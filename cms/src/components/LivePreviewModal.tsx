import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';
import { getCMSConfig } from '../lib/cmsStorage';

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

  if (!isOpen) return null;

  const websiteUrl = getCMSConfig().websiteUrl || 'http://localhost:3001';
  const targetUrl = `${websiteUrl.replace(/\/$/, '')}${pagePath}`;

  const deviceWidths = {
    desktop: 'w-full max-w-6xl h-[85vh]',
    tablet: 'w-[768px] h-[85vh]',
    mobile: 'w-[375px] h-[750px]',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Top Controls Header */}
      <div className="w-full max-w-6xl flex items-center justify-between bg-[#18271a] border border-[#2d402f] rounded-t-2xl px-4 py-3 text-neutral-200 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-neutral-100 font-serif">Live Page Preview</span>
          <span className="text-xs font-mono bg-[#121c13] text-[#a9ca96] px-2.5 py-0.5 rounded-md border border-[#2d402f] ml-2">
            {targetUrl}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-[#121c13] p-1 rounded-xl border border-[#2d402f]">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              device === 'desktop' ? 'bg-[#c8a962] text-black font-bold shadow-sm' : 'text-[#8ba38e] hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              device === 'tablet' ? 'bg-[#c8a962] text-black font-bold shadow-sm' : 'text-[#8ba38e] hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
              device === 'mobile' ? 'bg-[#c8a962] text-black font-bold shadow-sm' : 'text-[#8ba38e] hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Mobile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2 text-neutral-300 hover:text-white bg-[#1d2f20] hover:bg-[#253b29] border border-[#2d402f] rounded-lg transition"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4 text-[#c8a962]" />
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-neutral-300 hover:text-white bg-[#1d2f20] hover:bg-[#253b29] border border-[#2d402f] rounded-lg transition"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2 text-rose-300 hover:text-rose-100 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg transition border border-rose-500/30"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Iframe Container */}
      <div className="w-full max-w-6xl flex justify-center bg-[#121c13] p-4 border-x border-b border-[#2d402f] rounded-b-2xl overflow-auto">
        <div className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden bg-black border border-[#2d402f] ${deviceWidths[device]}`}>
          <iframe
            key={iframeKey}
            src={targetUrl}
            title="Live Preview"
            className="w-full h-full border-0 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
