import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, CheckCircle, Loader2, MapPin, ChevronDown, Eye, Globe } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import { CmsSectionNav, CmsSectionItem } from '../../components/CmsSectionNav';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { useCmsHistory } from '../../lib/useCmsHistory';
import './index.css';

export const BranchesEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBranchFilter = searchParams.get('branch') || 'all';

  const {
    data,
    setData,
    setInitialData,
    updateData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCmsHistory<any>('restaurants.json');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tab' | 'scroll'>('tab');

  const sections: CmsSectionItem[] = [
    { id: 'hero', label: 'Hero Header Section', icon: <Globe className="w-3.5 h-3.5 text-[#5b8045]" /> },
    { id: 'boeung-kak', label: 'Boeung Kak Branch', icon: <MapPin className="w-3.5 h-3.5 text-[#5b8045]" /> },
    { id: 'toul-kork', label: 'Toul Kork Branch', icon: <MapPin className="w-3.5 h-3.5 text-[#5b8045]" /> },
  ];

  useEffect(() => {
    setLoading(true);
    loadPageJson('restaurants.json')
      .then((res) => {
        const defaultData = {
          header: {
            title: 'Every Location Has Its Own Story.',
            desc: 'From the quiet Riverside Garden to the vibrant City Centre, each of our locations is a chapter in the story of traditional Cambodian flavors, served in spaces designed to feel like home.',
            heroImage1: '@/assets/home-v2/toul-kork-exterior.webp',
            heroImage2: '@/assets/home-v2/boeung-kak-exterior.webp',
            ctaText: 'Reserve Table',
          },
          locations: [
            {
              id: 'boeungKak',
              name: 'One More Restaurant Boeung Kak',
              address: 'G2 Street R11, Phnom Penh 120210',
              phone: '023 888 222',
              hours: 'Daily: 06:00 AM - 10:00 PM',
              image: '@/assets/home-v2/boeung-kak-exterior.webp',
              description: 'Our Boeung Kak branch showcases striking modern architectural design and expansive layouts.',
            },
            {
              id: 'toulKork',
              name: 'One More Restaurant Toul Kork',
              address: '37 St 315, Phnom Penh 120407',
              phone: '023 888 222',
              hours: 'Daily: 06:00 AM - 10:00 PM',
              image: '@/assets/home-v2/toul-kork-exterior.webp',
              description: 'Our signature branch in Toul Kork offers a beautiful garden dining experience and elegant private rooms.',
            },
          ],
        };

        const merged = res
          ? {
              ...defaultData,
              ...res,
              header: {
                ...defaultData.header,
                ...(res.header || {}),
              },
              locations: Array.isArray(res) ? res : res.locations || res.branches || defaultData.locations,
            }
          : defaultData;

        setInitialData(merged);
      })
      .catch((err) => console.error('Failed to load restaurants.json:', err))
      .finally(() => setLoading(false));
  }, [language, setInitialData]);

  useEffect(() => {
    if (activeBranchFilter === 'boeung-kak') {
      setActiveSection('boeung-kak');
    } else if (activeBranchFilter === 'toul-kork') {
      setActiveSection('toul-kork');
    } else {
      setActiveSection('all');
    }
  }, [activeBranchFilter]);

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

  const handleHeaderChange = (field: string, val: any) => {
    const updated = {
      ...data,
      header: {
        ...(data?.header || {}),
        [field]: val,
      },
    };
    updateData(updated);
    savePageJson('restaurants.json', updated).catch(() => {});
  };

  const handleBranchChange = (index: number, field: string, val: any) => {
    const locKey = data?.locations ? 'locations' : 'branches';
    const rawList = Array.isArray(data) ? data : data?.[locKey] || [];
    const updatedList = [...rawList];
    updatedList[index] = { ...updatedList[index], [field]: val };

    const updatedData = Array.isArray(data)
      ? updatedList
      : { ...data, [locKey]: updatedList };

    updateData(updatedData);
    savePageJson('restaurants.json', updatedData).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading content...
      </div>
    );
  }

  const rawBranches = Array.isArray(data) ? data : data?.locations || data?.branches || [];

  const filteredBranches = rawBranches.filter((branch: any) => {
    if (activeBranchFilter === 'boeung-kak') {
      const name = (branch.name || branch.title || '').toLowerCase();
      return name.includes('boeung') || branch.id === 'boeung-kak' || branch.id === 'boeungKak';
    }
    if (activeBranchFilter === 'toul-kork') {
      const name = (branch.name || branch.title || '').toLowerCase();
      return name.includes('toul') || branch.id === 'toul-kork' || branch.id === 'toulKork';
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
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-medium shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-emerald-950 text-sm">Draft Content Saved!</span>
              <span className="text-emerald-800 font-normal">{message}</span>
            </div>
          </div>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white rounded-xl font-bold text-xs shadow-md shadow-[#5b8045]/20 flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Changes Now</span>
          </button>
        </div>
      )}

      {/* Section Quick Jump & Focus Tab Bar */}
      <CmsSectionNav
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* ── 1. Hero Header Section ── */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'hero') && (
        <div id="section-hero" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              Branches Page Hero Header ({currentLangInfo.label})
            </span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Main Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.header?.title || ''}
                onChange={(e) => handleHeaderChange('title', e.target.value)}
                placeholder="e.g. Every Location Has Its Own Story."
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Description / Subtitle ({currentLangInfo.short})
              </label>
              <textarea
                rows={3}
                value={data?.header?.desc || ''}
                onChange={(e) => handleHeaderChange('desc', e.target.value)}
                placeholder="Hero paragraph description"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] resize-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <ImageUploader
                label="Hero Image 1 (Toul Kork Exterior Photo)"
                value={data?.header?.heroImage1 || '@/assets/home-v2/toul-kork-exterior.webp'}
                onChange={(url) => handleHeaderChange('heroImage1', url)}
              />
              <ImageUploader
                label="Hero Image 2 (Boeung Kak Exterior Photo)"
                value={data?.header?.heroImage2 || '@/assets/home-v2/boeung-kak-exterior.webp'}
                onChange={(url) => handleHeaderChange('heroImage2', url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Branch Cards ── */}
      <div className="space-y-6">
        {filteredBranches
          .filter((branch: any, idx: number) => {
            const branchKey = branch.id === 'boeungKak' || branch.id === 'boeung-kak' || idx === 0 ? 'boeung-kak' : 'toul-kork';
            if (activeSection === 'all' || activeSection === 'hero') return true;
            return activeSection === branchKey;
          })
          .map((branch: any, idx: number) => {
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
                    BRANCH DESCRIPTION ({currentLangInfo.short})
                  </label>
                  <input
                    type="text"
                    value={branch.description || ''}
                    onChange={(e) => handleBranchChange(originalIdx >= 0 ? originalIdx : idx, 'description', e.target.value)}
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

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath="/branches"
      />
    </div>
  );
};
