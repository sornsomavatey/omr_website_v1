import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, CheckCircle, Loader2, MapPin, ChevronDown } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import './index.css';

export const BranchesEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBranchFilter = searchParams.get('branch') || 'all';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

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
    if (Array.isArray(data)) {
      const updated = [...data];
      updated[index] = { ...updated[index], [field]: val };
      setData(updated);
    } else if (data?.branches) {
      const updated = [...data.branches];
      updated[index] = { ...updated[index], [field]: val };
      setData({ ...data, branches: updated });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading content...
      </div>
    );
  }

  const rawBranches = Array.isArray(data) ? data : data?.branches || [];

  const filteredBranches = rawBranches.filter((branch: any) => {
    if (activeBranchFilter === 'boeung-kak') {
      const name = (branch.name || branch.title || '').toLowerCase();
      return name.includes('boeung') || branch.id === 'boeung-kak';
    }
    if (activeBranchFilter === 'toul-kork') {
      const name = (branch.name || branch.title || '').toLowerCase();
      return name.includes('toul') || branch.id === 'toul-kork';
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 text-[#1c2819] font-sans">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e8df] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Restaurant Branches Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} branch details & location info
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Branch Sub-Page Filter Dropdown */}
          <div className="relative">
            <select
              value={activeBranchFilter}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setSearchParams({});
                } else {
                  setSearchParams({ branch: e.target.value });
                }
              }}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-800 shadow-xs focus:outline-none focus:border-[#5b8045] cursor-pointer"
            >
              <option value="all">All Branches (2)</option>
              <option value="boeung-kak">  - Boeung Kak Branch</option>
              <option value="toul-kork">  - Toul Kork Branch</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
          <button
            onClick={() => setShowSaveConfirmModal(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
          </button>
        </div>
      </div>

      <CmsSaveConfirmModal
        isOpen={showSaveConfirmModal}
        onClose={() => setShowSaveConfirmModal(false)}
        onConfirm={async () => {
          await handleSave();
          setShowSaveConfirmModal(false);
        }}
        saving={saving}
        pageName="Restaurant Branches"
      />

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Branch Cards */}
      <div className="space-y-6">
        {filteredBranches.map((branch: any, idx: number) => {
          const originalIdx = rawBranches.findIndex((b: any) => b === branch);

          return (
            <div key={branch.id || idx} className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5b8045]" />
                  <span>{branch.name || branch.title || 'Restaurant Branch'} ({currentLangInfo.short})</span>
                </h2>
                <span className="text-xs font-mono font-bold text-[#5b8045] bg-[#f4f7f2] px-2.5 py-1 rounded-md border border-[#e2e8df]">
                  Sub-page: /branches/{branch.id || (idx === 0 ? 'boeung-kak' : 'toul-kork')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                    BRANCH NAME ({currentLangInfo.short})
                  </label>
                  <input
                    type="text"
                    value={branch.name || branch.title || ''}
                    onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'name', e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={branch.phone || ''}
                    onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'phone', e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                  FULL ADDRESS ({currentLangInfo.short})
                </label>
                <input
                  type="text"
                  value={branch.address || ''}
                  onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'address', e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                    OPENING HOURS ({currentLangInfo.short})
                  </label>
                  <input
                    type="text"
                    value={branch.hours || branch.openingHours || ''}
                    onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'hours', e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                    GOOGLE MAPS LINK / EMBED
                  </label>
                  <input
                    type="text"
                    value={branch.mapUrl || branch.map || ''}
                    onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'mapUrl', e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Branch Exterior / Main Photo"
                value={branch.image || branch.coverImage || ''}
                onChange={(url) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'image', url)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
