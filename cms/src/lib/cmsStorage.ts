import axios from 'axios';

export interface CMSConfig {
  githubToken?: string;
  githubOwner?: string;
  githubRepo?: string;
  githubBranch?: string;
  websiteUrl?: string;
}

const getStoredConfig = (): CMSConfig => {
  return {
    githubToken: localStorage.getItem('omr_cms_gh_token') || import.meta.env.VITE_GITHUB_TOKEN || '',
    githubOwner: localStorage.getItem('omr_cms_gh_owner') || import.meta.env.VITE_GITHUB_OWNER || '',
    githubRepo: localStorage.getItem('omr_cms_gh_repo') || import.meta.env.VITE_GITHUB_REPO || '',
    githubBranch: localStorage.getItem('omr_cms_gh_branch') || import.meta.env.VITE_GITHUB_BRANCH || 'main',
    websiteUrl: localStorage.getItem('omr_cms_website_url') || import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3001',
  };
};

export const saveCMSConfig = (config: CMSConfig) => {
  if (config.githubToken !== undefined) localStorage.setItem('omr_cms_gh_token', config.githubToken);
  if (config.githubOwner !== undefined) localStorage.setItem('omr_cms_gh_owner', config.githubOwner);
  if (config.githubRepo !== undefined) localStorage.setItem('omr_cms_gh_repo', config.githubRepo);
  if (config.githubBranch !== undefined) localStorage.setItem('omr_cms_gh_branch', config.githubBranch);
  if (config.websiteUrl !== undefined) localStorage.setItem('omr_cms_website_url', config.websiteUrl);
};

export const getCMSConfig = (): CMSConfig => getStoredConfig();

/**
 * Load JSON content from local dev API or fallback
 */
export async function loadPageJson(filename: string): Promise<any> {
  try {
    const res = await axios.get(`/api/cms/read-json?filename=${encodeURIComponent(filename)}`);
    return res.data;
  } catch {
    // Try fetching from frontend server or public path directly
    const websiteUrl = getStoredConfig().websiteUrl;
    const fetchPath = filename.startsWith('locales/') ? `/locales/${filename.replace('locales/', '')}` : `/mocks/${filename}`;
    const res = await axios.get(`${websiteUrl}${fetchPath}`);
    return res.data;
  }
}

/**
 * Save JSON data to local dev file or via GitHub API commit
 */
export async function savePageJson(filename: string, content: any): Promise<{ success: boolean; message: string }> {
  const jsonString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  // 1. Try Local Server API first (Dev Mode / Local Server)
  try {
    const res = await axios.post('/api/cms/save-json', {
      filename,
      content,
    });
    if (res.data && res.data.success) {
      return { success: true, message: `Successfully saved ${filename} to Frontend/public/` };
    }
  } catch (err: any) {
    console.warn('Local save-json API unavailable, trying GitHub commit or download fallback...', err?.message);
  }

  // 2. Try GitHub API commit if configured
  const config = getStoredConfig();
  if (config.githubToken && config.githubOwner && config.githubRepo) {
    try {
      const filePath = filename.startsWith('locales/') ? `Frontend/public/${filename}` : `Frontend/public/mocks/${filename}`;
      const url = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/contents/${filePath}`;

      let sha = '';
      try {
        const getRes = await axios.get(url, {
          headers: { Authorization: `Bearer ${config.githubToken}` },
        });
        sha = getRes.data.sha;
      } catch {
        // File doesn't exist yet
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(jsonString);
      let binary = '';
      for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const base64Content = btoa(binary);

      await axios.put(
        url,
        {
          message: `cms: update ${filename} content`,
          content: base64Content,
          branch: config.githubBranch || 'main',
          ...(sha ? { sha } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${config.githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return { success: true, message: `Successfully committed ${filename} to GitHub repo!` };
    } catch (ghErr: any) {
      console.error('GitHub API commit error:', ghErr);
      return { success: false, message: `GitHub Commit Error: ${ghErr?.response?.data?.message || ghErr.message}` };
    }
  }

  // 3. Fallback: Trigger browser download
  triggerJsonDownload(filename, jsonString);
  return { success: true, message: `Downloaded updated ${filename} file locally!` };
}

/**
 * Upload an image file to Frontend/public/uploads/ or GitHub repo
 */
export async function uploadCMSImage(file: File): Promise<{ success: boolean; url: string; message: string }> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const fileName = `${timestamp}-${cleanName}`;

  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const base64Data = await base64Promise;

    const res = await axios.post('/api/cms/upload-image', {
      fileName,
      fileData: base64Data,
    });

    if (res.data && res.data.success) {
      return {
        success: true,
        url: res.data.url,
        message: 'Image uploaded successfully to Frontend/public/uploads/',
      };
    }
  } catch (err: any) {
    console.warn('Local image upload API unavailable, attempting fallback...', err?.message);
  }

  // GitHub Upload Fallback
  const config = getStoredConfig();
  if (config.githubToken && config.githubOwner && config.githubRepo) {
    try {
      const filePath = `Frontend/public/uploads/${fileName}`;
      const url = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/contents/${filePath}`;

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Content = btoa(binary);

      await axios.put(
        url,
        {
          message: `cms: upload image ${fileName}`,
          content: base64Content,
          branch: config.githubBranch || 'main',
        },
        {
          headers: {
            Authorization: `Bearer ${config.githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      return {
        success: true,
        url: `/uploads/${fileName}`,
        message: 'Image committed to GitHub /uploads/',
      };
    } catch (ghErr: any) {
      console.error('GitHub Image upload error:', ghErr);
    }
  }

  const dataUrl = await new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });

  return {
    success: true,
    url: dataUrl,
    message: 'Loaded image preview (Data URL)',
  };
}

export function triggerJsonDownload(filename: string, contentStr: string) {
  const blob = new Blob([contentStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
