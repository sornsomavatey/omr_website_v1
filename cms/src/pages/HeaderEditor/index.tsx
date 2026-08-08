import React, { useState } from 'react';
import { Save, Globe, Eye, Link as LinkIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import './index.css';

export const HeaderEditor: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [headerConfig, setHeaderConfig] = useState({
    logoText: 'One More Restaurant',
    reservationButtonText: 'Book a Table',
    navLinks: [
      { name: 'Home', path: '/' },
      { name: 'Menu', path: '/menu' },
      { name: 'Events', path: '/events' },
      { name: 'Branches', path: '/branches' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'About Us', path: '/about' },
    ],
    enabledLanguages: [
      { code: 'KH', label: 'ខ្មែរ', enabled: true },
      { code: 'EN', label: 'English', enabled: true },
      { code: 'ZH', label: '中文', enabled: true },
      { code: 'KO', label: '한국어', enabled: true },
    ],
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNavLinkChange = (index: number, field: 'name' | 'path', value: string) => {
    const updated = [...headerConfig.navLinks];
    updated[index][field] = value;
    setHeaderConfig({ ...headerConfig, navLinks: updated });
  };

  const addNavLink = () => {
    setHeaderConfig({
      ...headerConfig,
      navLinks: [...headerConfig.navLinks, { name: 'New Link', path: '/' }],
    });
  };

  const removeNavLink = (index: number) => {
    setHeaderConfig({
      ...headerConfig,
      navLinks: headerConfig.navLinks.filter((_, i) => i !== index),
    });
  };

  const toggleLanguage = (code: string) => {
    const updated = headerConfig.enabledLanguages.map((l) =>
      l.code === code ? { ...l, enabled: !l.enabled } : l
    );
    setHeaderConfig({ ...headerConfig, enabledLanguages: updated });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 text-[#1c2819] font-sans pb-12">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2819] tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-black shrink-0" />
            <span>Header Navigation Editor</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage main navigation links, logo branding, action CTA buttons & languages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
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
            <span>Save Header</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Header navigation settings saved successfully!</span>
        </div>
      )}

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Links Manager (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#d6e0d0] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#1c2819]">Main Navigation Menu Links</h2>
            <button
              onClick={addNavLink}
              className="text-xs font-bold text-[#5b8045] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {headerConfig.navLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df]"
              >
                <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleNavLinkChange(idx, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold outline-none focus:border-[#5b8045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      URL Path
                    </label>
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => handleNavLinkChange(idx, 'path', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-mono outline-none focus:border-[#5b8045]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeNavLink(idx)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA & Language Controls (1 Col) */}
        <div className="space-y-6">
          {/* Reservation Button CTA */}
          <div className="bg-white rounded-2xl p-6 border border-[#d6e0d0] shadow-md space-y-4">
            <h2 className="text-base font-bold text-[#1c2819] pb-3 border-b border-gray-100">
              Header Action Button
            </h2>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={headerConfig.reservationButtonText}
                  onChange={(e) =>
                    setHeaderConfig({ ...headerConfig, reservationButtonText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-bold outline-none focus:border-[#5b8045]"
                />
              </div>
            </div>
          </div>

          {/* Enabled Languages */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1c2819] pb-3 border-b border-gray-100">
              Language Switcher Options
            </h2>

            <div className="space-y-2 text-xs">
              {headerConfig.enabledLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf6] border border-[#e2e8df]"
                >
                  <span className="font-bold text-gray-800">{lang.label} ({lang.code})</span>
                  <input
                    type="checkbox"
                    checked={lang.enabled}
                    onChange={() => toggleLanguage(lang.code)}
                    className="w-4 h-4 accent-[#5b8045] cursor-pointer"
                  />
                </div>
              ))}
            </div>
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
