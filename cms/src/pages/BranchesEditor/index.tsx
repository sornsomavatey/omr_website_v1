import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Loader2, MapPin } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import './index.css';

export const BranchesEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadPageJson('restaurants.json')
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load restaurants.json:', err))
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await savePageJson('restaurants.json', data);
      setMessage(`Branches data saved successfully for ${currentLangInfo.label}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Failed to save branches data.');
    } finally {
      setSaving(false);
    }
  };

  const handleBranchChange = (index: number, field: string, val: any) => {
    const branches = Array.isArray(data) ? [...data] : [...(data.branches || [])];
    branches[index] = { ...branches[index], [field]: val };
    setData(Array.isArray(data) ? branches : { ...data, branches });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#a9ca96] gap-2 text-xs font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading restaurants.json content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  const branchesArray = Array.isArray(data) ? data : data?.branches || [];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d402f] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 font-serif tracking-wide flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-[#c8a962] shrink-0 font-sans" />
            <span>Restaurant Branches Editor</span>
          </h1>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/mocks/restaurants.json</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#c8a962] hover:bg-[#b39a62] text-black px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-[#c8a962]/10 disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      <div className="space-y-6">
        {branchesArray.map((branch: any, idx: number) => (
          <div key={branch.id || idx} className="p-6 bg-[#18271a] border border-[#2d402f] rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[#c8a962] uppercase tracking-wider border-b border-[#2d402f] pb-3 font-mono">
              Branch #{idx + 1}: {branch.name || branch.title || 'Restaurant Branch'} — {currentLangInfo.flag} {currentLangInfo.short}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Branch Name ({currentLangInfo.short})</label>
                <input
                  type="text"
                  value={branch.name || branch.title || ''}
                  onChange={(e) => handleBranchChange(idx, 'name', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Phone Number</label>
                <input
                  type="text"
                  value={branch.phone || ''}
                  onChange={(e) => handleBranchChange(idx, 'phone', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Full Address ({currentLangInfo.short})</label>
              <input
                type="text"
                value={branch.address || ''}
                onChange={(e) => handleBranchChange(idx, 'address', e.target.value)}
                className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Opening Hours ({currentLangInfo.short})</label>
                <input
                  type="text"
                  value={branch.hours || branch.openingHours || ''}
                  onChange={(e) => handleBranchChange(idx, 'hours', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Google Maps Embed / Link</label>
                <input
                  type="text"
                  value={branch.mapUrl || branch.map || ''}
                  onChange={(e) => handleBranchChange(idx, 'mapUrl', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>
            </div>

            <ImageUploader
              label="Branch Exterior/Main Photo"
              value={branch.image || branch.coverImage || ''}
              onChange={(url) => handleBranchChange(idx, 'image', url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
