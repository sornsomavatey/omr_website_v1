import React, { useState } from 'react';
import { Save, Eye, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { LivePreviewModal } from '../components/LivePreviewModal';

export const FooterEditor: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [footerConfig, setFooterConfig] = useState({
    brandText: 'Traditional Cambodian flavors served with modern warmth and refined presentation.',
    copyrightText: '© 2026 One More Restaurant. All rights reserved.',
    exploreLinks: [
      { name: 'Menu', path: '/menu' },
      { name: 'Branches', path: '/branches' },
      { name: 'Story', path: '/about' },
    ],
    legalLinks: [
      { name: 'Terms & Conditions', path: '/terms' },
    ],
    contactLinks: [
      { name: 'Booking Inquiry', path: '/reservations' },
    ],
    socialLinks: [
      { name: 'Instagram', href: 'https://www.instagram.com/onemore.restaurantkh/' },
      { name: 'Facebook', href: 'https://www.facebook.com/onemorerestaurant' },
      { name: 'TikTok', href: 'https://www.tiktok.com/@onemorerestaurant' },
      { name: 'TripAdvisor', href: 'https://www.tripadvisor.com' },
    ],
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-[#1c2819] font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2819] tracking-tight">
            Footer Navigation & Content Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Manage footer links, brand description, copyright & social media links
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#5b8045]" />
            <span>Live Preview</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Footer</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Footer settings saved successfully!</span>
        </div>
      )}

      {/* Editor Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Text & Links Columns (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Description Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1c2819] pb-3 border-b border-gray-100">
              Footer Brand Text
            </h2>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  value={footerConfig.brandText}
                  onChange={(e) => setFooterConfig({ ...footerConfig, brandText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs outline-none focus:border-[#5b8045]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Copyright Line</label>
                <input
                  type="text"
                  value={footerConfig.copyrightText}
                  onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-bold outline-none focus:border-[#5b8045]"
                />
              </div>
            </div>
          </div>

          {/* Footer Explore & Legal Links */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1c2819] pb-3 border-b border-gray-100">
              Explore & Legal Navigation Links
            </h2>

            <div className="space-y-3">
              {footerConfig.exploreLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df]">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...footerConfig.exploreLinks];
                      updated[i].name = e.target.value;
                      setFooterConfig({ ...footerConfig, exploreLinks: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => {
                      const updated = [...footerConfig.exploreLinks];
                      updated[i].path = e.target.value;
                      setFooterConfig({ ...footerConfig, exploreLinks: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links Card (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1c2819] pb-3 border-b border-gray-100">
            Social Media Links
          </h2>

          <div className="space-y-3 text-xs">
            {footerConfig.socialLinks.map((soc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] space-y-1.5">
                <label className="block font-bold text-gray-700">{soc.name}</label>
                <input
                  type="text"
                  value={soc.href}
                  onChange={(e) => {
                    const updated = [...footerConfig.socialLinks];
                    updated[idx].href = e.target.value;
                    setFooterConfig({ ...footerConfig, socialLinks: updated });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-mono outline-none focus:border-[#5b8045]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath="/"
      />
    </div>
  );
};
