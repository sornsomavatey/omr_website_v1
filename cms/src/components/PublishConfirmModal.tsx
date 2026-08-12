import React, { useState } from 'react';
import {
  UploadCloud,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileJson,
  Settings,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { getCMSConfig, saveCMSConfig, publishToProduction, CMSConfig } from '../lib/cmsStorage';

interface PublishConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [config, setConfig] = useState<CMSConfig>(getCMSConfig());
  const [commitMessage, setCommitMessage] = useState('cms: publish content updates to production');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Detect pending modified files from localStorage
  const pendingFiles: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('omr_cms_data_')) {
        pendingFiles.push(key.replace('omr_cms_data_', ''));
      }
    }
  } catch (e) {
    console.warn('Error reading localStorage for pending files:', e);
  }

  const handleSaveConfig = () => {
    saveCMSConfig(config);
    setShowConfig(false);
  };

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    setStatusMessage(null);

    try {
      const res = await publishToProduction(commitMessage);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        if (onSuccess) onSuccess(res.message);
        setTimeout(() => {
          setIsPublishing(false);
          setStatusMessage(null);
          onClose();
        }, 2500);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
        setIsPublishing(false);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'An error occurred while publishing to production.',
      });
      setIsPublishing(false);
    }
  };

  const hasGitHubSetup = !!(config.githubToken && config.githubOwner && config.githubRepo);

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2819]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-[#1c2819] border border-[#e2e8df] rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPublishing}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-[#f4f7f2] rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#e2e8df]">
          <div className="w-11 h-11 rounded-xl bg-[#5b8045]/10 text-[#5b8045] border border-[#5b8045]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Rocket className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              Publish to Production
              <span className="text-[10px] bg-[#5b8045]/10 text-[#5b8045] font-mono px-2 py-0.5 rounded-full border border-[#5b8045]/20 font-bold">
                GitHub Sync
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Commit & push CMS changes directly to live production website
            </p>
          </div>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* GitHub / Repo Status Card */}
        <div className="bg-[#f8faf6] rounded-xl p-3.5 border border-[#e2e8df] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1c2819]">
              <GitBranch className="w-4 h-4 text-[#5b8045]" />
              <span>Target Repository</span>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-[#5b8045] hover:underline flex items-center gap-1 cursor-pointer font-mono font-bold"
            >
              <Settings className="w-3 h-3" />
              {showConfig ? 'Hide Settings' : 'Configure GitHub'}
            </button>
          </div>

          {showConfig ? (
            <div className="pt-2 border-t border-[#e2e8df] space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-mono font-medium">
                  GitHub Personal Access Token (PAT):
                </label>
                <input
                  type="password"
                  value={config.githubToken || ''}
                  onChange={(e) => setConfig({ ...config, githubToken: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full bg-white border border-[#e2e8df] rounded-xl px-3 py-1.5 text-xs text-[#1c2819] font-mono focus:outline-none focus:border-[#5b8045]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-mono font-medium">Owner / User:</label>
                  <input
                    type="text"
                    value={config.githubOwner || ''}
                    onChange={(e) => setConfig({ ...config, githubOwner: e.target.value })}
                    placeholder="e.g. username"
                    className="w-full bg-white border border-[#e2e8df] rounded-xl px-3 py-1.5 text-xs text-[#1c2819] font-mono focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-mono font-medium">Repository:</label>
                  <input
                    type="text"
                    value={config.githubRepo || ''}
                    onChange={(e) => setConfig({ ...config, githubRepo: e.target.value })}
                    placeholder="e.g. repo-name"
                    className="w-full bg-white border border-[#e2e8df] rounded-xl px-3 py-1.5 text-xs text-[#1c2819] font-mono focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveConfig}
                  className="px-3.5 py-1 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#e2e8df]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-[#5b8045]" />
                <span className="font-mono text-gray-800 font-semibold">
                  {config.githubOwner && config.githubRepo
                    ? `${config.githubOwner}/${config.githubRepo}`
                    : 'Local Dev Server (Local Git Push)'}
                </span>
              </div>
              <span className="text-[11px] font-mono bg-[#f4f7f2] text-[#5b8045] px-2 py-0.5 rounded-lg border border-[#e2e8df] font-bold">
                {config.githubBranch || 'main'}
              </span>
            </div>
          )}
        </div>

        {/* Pending Content Files Summary */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-[#5b8045]" />
              Modified CMS Files Ready for Push:
            </span>
            <span className="font-mono text-[11px] text-[#5b8045] font-bold">
              {pendingFiles.length > 0 ? `${pendingFiles.length} File(s)` : 'All Up to Date / Current Editor'}
            </span>
          </label>
          <div className="bg-[#f8faf6] rounded-xl p-2.5 border border-[#e2e8df] max-h-28 overflow-y-auto space-y-1">
            {pendingFiles.length > 0 ? (
              pendingFiles.map((fn) => (
                <div key={fn} className="flex items-center justify-between text-[11px] font-mono text-gray-800 px-2.5 py-1 bg-white rounded-lg border border-[#e2e8df]">
                  <span className="truncate">{fn}</span>
                  <span className="text-[#5b8045] text-[10px] uppercase font-bold">Modified</span>
                </div>
              ))
            ) : (
              <div className="text-[11px] font-mono text-gray-500 px-2 py-1">
                Website Content Mocks & Locales (frontend/public/)
              </div>
            )}
          </div>
        </div>

        {/* Commit Message Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">
            Git Commit Message:
          </label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Describe your CMS changes..."
            className="w-full bg-[#f8faf6] border border-[#e2e8df] rounded-xl px-3 py-2 text-xs text-[#1c2819] placeholder:text-gray-400 focus:outline-none focus:border-[#5b8045] font-mono"
          />
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-[#f4f7f2] rounded-xl border border-[#e2e8df] text-[11px] text-gray-700 space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[#5b8045]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>How Live Production Deployment Works</span>
          </div>
          <p className="text-gray-600 pl-5">
            Clicking confirm will commit all updated page JSON data to your GitHub repository on branch <code className="text-[#5b8045] font-mono font-bold">main</code>. Automated platforms like Vercel, Netlify, or GitHub Actions will automatically re-build and deploy your live site!
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#e2e8df]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer disabled:opacity-50 border border-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmPublish}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Publishing to GitHub...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-white" />
                <span>Confirm & Publish Now</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
