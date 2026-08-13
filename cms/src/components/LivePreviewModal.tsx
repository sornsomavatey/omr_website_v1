import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, UploadCloud } from 'lucide-react';
import { getCMSConfig } from '../lib/cmsStorage';
import { PublishConfirmModal } from './PublishConfirmModal';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagePath?: string;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  pagePath = '/',
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  if (!isOpen) return null;

  const websiteUrl = getCMSConfig().websiteUrl || 'http://localhost:3001';
  const targetUrl = `${websiteUrl.replace(/\/$/, '')}${pagePath}`;

  // Device styles guaranteeing horizontal & vertical centering with light green & white theme
  const deviceStyles = {
    desktop: 'w-full h-full max-w-full rounded-xl border border-[#e2e8df] bg-white shadow-lg',
    tablet: 'w-[768px] max-w-full h-[850px] max-h-full mx-auto my-auto rounded-[28px] border-[8px] border-[#2d4323] shadow-2xl bg-white flex flex-col',
    mobile: 'w-[375px] max-w-full h-[720px] max-h-full mx-auto my-auto rounded-[36px] border-[8px] border-[#2d4323] shadow-2xl bg-white flex flex-col',
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#1c2819]/50 backdrop-blur-sm flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden h-screen w-screen">
        
        {/* Main Light Theme Modal Shell */}
        <div className="w-full max-w-6xl flex flex-col flex-1 min-h-0 h-full max-h-[92vh] border border-[#e2e8df] rounded-2xl overflow-hidden bg-[#f8faf6] shadow-2xl">
          
          {/* Top Controls Header */}
          <div className="w-full flex items-center justify-between bg-white border-b border-[#e2e8df] px-4 py-3 text-[#1c2819] shrink-0 gap-2 flex-wrap sm:flex-nowrap shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045] animate-pulse shrink-0" />
              <span className="text-sm font-bold text-[#1c2819] font-serif tracking-wide shrink-0">Live Page Preview</span>
              <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 shrink-0 font-semibold hidden lg:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>1. Review Preview</span>
                <span className="text-amber-400">➔</span>
                <span>2. Publish to Production</span>
              </span>
            </div>

            {/* Device Switcher (Desktop / Tablet / Mobile) */}
            <div className="flex items-center bg-[#f4f7f2] p-1 rounded-xl border border-[#e2e8df] shrink-0">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer font-semibold ${
                  device === 'desktop' ? 'bg-[#5b8045] text-white shadow-xs' : 'text-[#4a633f] hover:bg-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">Desktop</span>
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer font-semibold ${
                  device === 'tablet' ? 'bg-[#5b8045] text-white shadow-xs' : 'text-[#4a633f] hover:bg-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">Tablet</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer font-semibold ${
                  device === 'mobile' ? 'bg-[#5b8045] text-white shadow-xs' : 'text-[#4a633f] hover:bg-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">Mobile</span>
              </button>
            </div>

            {/* Action Controls & Publish to Production Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold transition shadow-md shadow-[#5b8045]/20 flex items-center gap-2 cursor-pointer"
                title="Publish Changes to Production (GitHub)"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Publish to Production</span>
              </button>

              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-2 text-gray-700 hover:text-[#5b8045] bg-[#f4f7f2] hover:bg-white border border-[#e2e8df] rounded-xl transition cursor-pointer"
                title="Refresh Preview"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-[#5b8045] bg-[#f4f7f2] hover:bg-white border border-[#e2e8df] rounded-xl transition"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 cursor-pointer"
                title="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Centered Preview Area (Light Green Background) */}
          <div className="w-full flex-1 flex items-center justify-center bg-[#eef3ec] p-4 md:p-6 overflow-auto min-h-0 relative">
            <div className={`transition-all duration-300 shadow-xl overflow-hidden bg-white flex flex-col ${deviceStyles[device]}`}>
              
              {/* Sleek Device Bezel Notch for Tablet & Mobile */}
              {device !== 'desktop' && (
                <div className="w-full bg-[#2d4323] py-1.5 flex items-center justify-center shrink-0 border-b border-[#2d4323]">
                  <div className="w-16 h-3 bg-[#1c2a17] rounded-full flex items-center justify-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#5b8045]" />
                    <div className="w-6 h-1 rounded-full bg-[#5b8045]" />
                  </div>
                </div>
              )}

              {/* Iframe Viewport */}
              <iframe
                key={iframeKey}
                src={targetUrl}
                title="Live Preview"
                className="w-full h-full min-h-0 flex-1 border-0 bg-white"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation & Publish to Production Modal */}
      <PublishConfirmModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={() => setIframeKey((k) => k + 1)}
      />
    </>
  );
};


