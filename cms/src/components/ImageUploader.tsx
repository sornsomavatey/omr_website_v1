import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, Video } from 'lucide-react';
import { uploadCMSImage } from '../lib/cmsStorage';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg|ogv)(\?.*)?$/i.test(url) || url.startsWith('data:video');
}

function getPreviewSource(rawUrl: string, fallbackIndex: number = 0): string {
  if (!rawUrl) return '';
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return rawUrl;

  let clean = rawUrl.trim();
  if (clean.startsWith('@/assets/')) {
    clean = clean.replace('@/assets/', '/src/assets/');
  } else if (clean.startsWith('@assets/')) {
    clean = clean.replace('@assets/', '/src/assets/');
  }

  // Handle spaces and special characters in filenames (e.g. "hero vid.mov" -> "hero%20vid.mov")
  const encodedParts = clean.split('/').map(part => {
    try {
      return encodeURIComponent(decodeURIComponent(part));
    } catch {
      return part;
    }
  }).join('/');

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  if (fallbackIndex === 0) {
    return encodedParts;
  }
  if (fallbackIndex === 1) {
    return `http://localhost:3000${encodedParts.startsWith('/') ? '' : '/'}${encodedParts}`;
  }
  if (fallbackIndex === 2) {
    return `http://localhost:3002${encodedParts.startsWith('/') ? '' : '/'}${encodedParts}`;
  }

  return encodedParts;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image / Video Asset',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setFallbackIndex(0);
    setHasError(false);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await uploadCMSImage(file);
      if (res.success && res.url) {
        onChange(res.url);
        setStatus(res.message || 'Uploaded successfully!');
        setTimeout(() => setStatus(null), 4000);
      } else {
        setStatus(`Upload failed: ${res.message}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message || 'Failed to upload'}`);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleError = () => {
    if (fallbackIndex < 2) {
      setFallbackIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const isVideo = isVideoUrl(value);
  const previewSrc = getPreviewSource(value, fallbackIndex);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] font-mono">{label}</label>}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 bg-white border border-[#e2e8df] rounded-xl shadow-xs">
        <div className="relative w-20 h-20 bg-[#f8faf6] rounded-xl border border-[#e2e8df] flex items-center justify-center overflow-hidden shrink-0 group">
          {value && !hasError ? (
            isVideo ? (
              <video
                src={previewSrc}
                autoPlay
                loop
                muted
                playsInline
                onError={handleError}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={previewSrc}
                alt="Preview"
                onError={handleError}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
              {isVideo ? <Video className="w-7 h-7 text-[#5b8045]/40" /> : <ImageIcon className="w-7 h-7 text-[#5b8045]/40" />}
              <span className="text-[9px] font-mono">No Preview</span>
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image/Video path (e.g. /uploads/image.webp or @/assets/...) "
            className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-mono font-medium"
          />

          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3.5 py-1.5 rounded-xl transition font-semibold border border-[#5b8045]/30 shadow-xs">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {loading ? 'Uploading...' : 'Upload New File'}
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            </label>

            {status && (
              <span className="text-xs flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
