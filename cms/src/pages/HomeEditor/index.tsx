import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, Home as HomeIcon, MapPin, Image as ImageIcon, Sparkles, Building2, Eye, UploadCloud, Undo2, Redo2 } from 'lucide-react';
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

export const HomeEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const {
    data,
    setData,
    setInitialData,
    updateData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCmsHistory<any>('home.json');

  const [localeDict, setLocaleDict] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tab' | 'scroll'>('tab');

  const syncDraftData = (updatedData: any) => {
    updateData(updatedData);
    savePageJson('home.json', updatedData).catch(() => {});
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const sections: CmsSectionItem[] = [
    { id: 'hero', label: 'Hero Section', icon: <HomeIcon className="w-3.5 h-3.5 text-[#5b8045]" /> },
    { id: 'signatureDishes', label: 'Signature Dishes', count: data?.signatureDishes?.length || 0 },
    { id: 'diningSpaces', label: 'Dining Spaces', count: data?.diningSpaces?.length || 0, icon: <Building2 className="w-3.5 h-3.5 text-[#5b8045]" /> },
    { id: 'branches', label: 'Branches Overview', count: data?.branches?.length || 0, icon: <MapPin className="w-3.5 h-3.5 text-[#5b8045]" /> },
    { id: 'gallery', label: 'Photo Gallery', count: data?.gallery?.length || 0, icon: <ImageIcon className="w-3.5 h-3.5 text-[#5b8045]" /> },
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadPageJson('home.json').catch(() => null),
      loadPageJson(`locales/${language}.json`).catch(() => null),
    ])
      .then(([homeRes, dictRes]) => {
        setLocaleDict(dictRes);
        if (!homeRes) {
          setData(null);
          return;
        }

        if (dictRes && dictRes.home) {
          const heroLoc = dictRes.home.hero || {};
          const sigLoc = dictRes.home.signature?.items || {};

          const heroMedia = homeRes.hero?.backgroundVideo || homeRes.hero?.backgroundImage || '@/assets/video/hero vid.mov';

          const mergedHero = {
            ...homeRes.hero,
            backgroundVideo: heroMedia,
            backgroundImage: heroMedia,
            title: heroLoc.titleLine1 && heroLoc.titleHighlight
              ? `${heroLoc.titleLine1} ${heroLoc.titleHighlight}`
              : (heroLoc.title || homeRes.hero?.title || ''),
            subtitle: heroLoc.description || homeRes.hero?.subtitle || '',
            cta_reserve: heroLoc.reserveButton || homeRes.hero?.cta_reserve || '',
            cta_menu: heroLoc.menuButton || homeRes.hero?.cta_menu || '',
          };

          const mergedDishes = (homeRes.signatureDishes || []).map((dish: any) => {
            const locItem = sigLoc[dish.key];
            if (!locItem) return dish;
            return {
              ...dish,
              name: locItem.name || dish.name,
              desc: locItem.description || dish.desc,
            };
          });

          setInitialData({
            ...homeRes,
            hero: mergedHero,
            signatureDishes: mergedDishes,
            diningSpaces: homeRes.diningSpaces || [],
            branches: homeRes.branches || [],
            gallery: homeRes.gallery || [],
          });
        } else {
          const heroMedia = homeRes.hero?.backgroundVideo || homeRes.hero?.backgroundImage || '@/assets/video/hero vid.mov';

          setInitialData({
            ...homeRes,
            hero: {
              ...homeRes.hero,
              backgroundVideo: heroMedia,
              backgroundImage: heroMedia,
            },
            diningSpaces: homeRes.diningSpaces || [],
            branches: homeRes.branches || [],
            gallery: homeRes.gallery || [],
          });
        }
      })
      .catch((err) => console.error('Failed to load home page content:', err))
      .finally(() => setLoading(false));
  }, [language, setInitialData]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    const result = await savePageJson('home.json', data);

    try {
      let currentDict = localeDict || (await loadPageJson(`locales/${language}.json`).catch(() => ({})));
      if (!currentDict) currentDict = {};

      const words = (data.hero?.title || '').trim().split(/\s+/);
      let titleLine1 = data.hero?.title || '';
      let titleHighlight = '';
      if (words.length > 2) {
        titleLine1 = words.slice(0, 2).join(' ');
        titleHighlight = words.slice(2).join(' ');
      } else if (words.length === 2) {
        titleLine1 = words[0];
        titleHighlight = words[1];
      }

      const sigItemsUpdate: Record<string, any> = {};
      (data.signatureDishes || []).forEach((dish: any) => {
        if (dish.key) {
          sigItemsUpdate[dish.key] = {
            name: dish.name,
            description: dish.desc,
            category: dish.category,
            badge: dish.badge,
          };
        }
      });

      const updatedDict = {
        ...currentDict,
        home: {
          ...(currentDict.home || {}),
          hero: {
            ...(currentDict.home?.hero || {}),
            titleLine1,
            titleHighlight,
            description: data.hero?.subtitle || '',
            reserveButton: data.hero?.cta_reserve || '',
            menuButton: data.hero?.cta_menu || '',
          },
          signature: {
            ...(currentDict.home?.signature || {}),
            items: {
              ...(currentDict.home?.signature?.items || {}),
              ...sigItemsUpdate,
            },
          },
        },
      };

      await savePageJson(`locales/${language}.json`, updatedDict);
      setLocaleDict(updatedDict);
    } catch (err) {
      console.warn(`Could not sync locales/${language}.json:`, err);
    }

    setSaving(false);
    setMessage(`Successfully saved Home Page content for ${currentLangInfo.flag} ${currentLangInfo.label}!`);
    setTimeout(() => setMessage(null), 4000);
  };

  /* Dish Handlers */
  const handleAddDish = () => {
    if (!data) return;
    const newDish = {
      key: `dish_${Date.now()}`,
      name: 'New Signature Dish',
      category: 'LUNCH · SPECIAL',
      desc: 'Description of the dish goes here.',
      img: '/uploads/default-dish.webp',
      price: '$18',
      badge: "Chef's Choice ✦",
    };
    setData({
      ...data,
      signatureDishes: [newDish, ...(data.signatureDishes || [])],
    });
  };

  const handleRemoveDish = (index: number) => {
    if (!data || !data.signatureDishes) return;
    const updated = [...data.signatureDishes];
    updated.splice(index, 1);
    setData({ ...data, signatureDishes: updated });
  };

  const handleDishChange = (index: number, field: string, val: string) => {
    if (!data || !data.signatureDishes) return;
    const updated = [...data.signatureDishes];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, signatureDishes: updated });
  };

  /* Dining Space Handlers */
  const handleAddSpace = () => {
    if (!data) return;
    const newSpace = {
      name: 'New Dining Space',
      tag: 'Up to 20 guests',
      desc: 'Beautiful Khmer-inspired space designed for comfort and warm gatherings.',
      img: '@/assets/home-v2/curved-wood-interior.webp',
    };
    setData({
      ...data,
      diningSpaces: [...(data.diningSpaces || []), newSpace],
    });
  };

  const handleRemoveSpace = (index: number) => {
    if (!data || !data.diningSpaces) return;
    const updated = [...data.diningSpaces];
    updated.splice(index, 1);
    setData({ ...data, diningSpaces: updated });
  };

  const handleSpaceChange = (index: number, field: string, val: string) => {
    if (!data || !data.diningSpaces) return;
    const updated = [...data.diningSpaces];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, diningSpaces: updated });
  };

  /* Branch Handlers */
  const handleBranchChange = (index: number, field: string, val: string) => {
    if (!data || !data.branches) return;
    const updated = [...data.branches];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, branches: updated });
  };

  /* Gallery Handlers */
  const handleAddGalleryImage = () => {
    if (!data) return;
    const newImg = {
      src: '@/assets/home-v2/private-dining-room.webp',
      alt: 'Gallery Moment',
    };
    setData({
      ...data,
      gallery: [...(data.gallery || []), newImg],
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!data || !data.gallery) return;
    const updated = [...data.gallery];
    updated.splice(index, 1);
    setData({ ...data, gallery: updated });
  };

  const handleGalleryChange = (index: number, field: string, val: string) => {
    if (!data || !data.gallery) return;
    const updated = [...data.gallery];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, gallery: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-4 pb-12 text-[#1c2819]">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e8df] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2.5">
            <HomeIcon className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Home Page Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} content (home.json & locales/{language}.json)
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
        pageName="Home Page"
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

      {/* 1. HERO SECTION */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'hero') && (
        <div id="section-hero" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              Hero Banner Section ({currentLangInfo.label})
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.hero?.title || ''}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data?.hero, title: e.target.value } })
                }
                placeholder={`Hero Title in ${currentLangInfo.label}`}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Subtitle ({currentLangInfo.short})
              </label>
              <textarea
                rows={2}
                value={data?.hero?.subtitle || ''}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data?.hero, subtitle: e.target.value } })
                }
                placeholder={`Hero Subtitle in ${currentLangInfo.label}`}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 resize-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                  CTA Button 1 Text
                </label>
                <input
                  type="text"
                  value={data?.hero?.cta_reserve || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data?.hero, cta_reserve: e.target.value } })
                  }
                  className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                  CTA Button 2 Text
                </label>
                <input
                  type="text"
                  value={data?.hero?.cta_menu || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data?.hero, cta_menu: e.target.value } })
                  }
                  className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                />
              </div>
            </div>

            <ImageUploader
              label="Hero Background Video / Media"
              value={data?.hero?.backgroundVideo || data?.hero?.backgroundImage || '@/assets/video/hero vid.mov'}
              onChange={(url) => {
                const updated = {
                  ...data,
                  hero: { ...data?.hero, backgroundVideo: url, backgroundImage: url },
                };
                syncDraftData(updated);
              }}
            />
          </div>
        </div>
      )}

      {/* 2. SIGNATURE DISHES LIST */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'signatureDishes') && (
        <div id="section-signatureDishes" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Signature Dishes Showcase ({data?.signatureDishes?.length || 0})</span>
            </h2>
            <button
              onClick={handleAddDish}
              className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Dish
            </button>
          </div>

          <div className="space-y-4">
            {(data?.signatureDishes || []).map((dish: any, idx: number) => (
              <div
                key={dish.key || idx}
                className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">Dish #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveDish(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition"
                    title="Remove dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Dish Name ({currentLangInfo.short})
                    </label>
                    <input
                      type="text"
                      value={dish.name || ''}
                      onChange={(e) => handleDishChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={dish.category || ''}
                      onChange={(e) => handleDishChange(idx, 'category', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Price
                    </label>
                    <input
                      type="text"
                      value={dish.price || ''}
                      onChange={(e) => handleDishChange(idx, 'price', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={dish.badge || ''}
                      onChange={(e) => handleDishChange(idx, 'badge', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                    Description ({currentLangInfo.short})
                  </label>
                  <textarea
                    rows={2}
                    value={dish.desc || ''}
                    onChange={(e) => handleDishChange(idx, 'desc', e.target.value)}
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 resize-none font-medium"
                  />
                </div>

                <ImageUploader
                  label="Dish Photo"
                  value={dish.img || ''}
                  onChange={(url) => handleDishChange(idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DINING SPACES SHOWCASE SECTION */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'diningSpaces') && (
        <div id="section-diningSpaces" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
                <span>Dining Spaces — Designed for Every Occasion ({data?.diningSpaces?.length || 0})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                Manage your dining spaces, halls, and capacity tags shown on the Home page.
              </p>
            </div>
            <button
              onClick={handleAddSpace}
              className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Space
            </button>
          </div>

          <div className="space-y-4">
            {(data?.diningSpaces || []).map((space: any, idx: number) => (
              <div
                key={space.name + idx}
                className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">Space #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveSpace(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition"
                    title="Remove dining space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Space Name ({currentLangInfo.short})
                    </label>
                    <input
                      type="text"
                      value={space.name || ''}
                      onChange={(e) => handleSpaceChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Family Dining"
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Guest Capacity Tag
                    </label>
                    <input
                      type="text"
                      value={space.tag || ''}
                      onChange={(e) => handleSpaceChange(idx, 'tag', e.target.value)}
                      placeholder="e.g. Up to 10 guests"
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                    Space Description ({currentLangInfo.short})
                  </label>
                  <textarea
                    rows={2}
                    value={space.desc || ''}
                    onChange={(e) => handleSpaceChange(idx, 'desc', e.target.value)}
                    placeholder="Description of the dining room or occasion layout"
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 resize-none font-medium"
                  />
                </div>

                <ImageUploader
                  label="Space Photo"
                  value={space.img || ''}
                  onChange={(url) => handleSpaceChange(idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BRANCHES OVERVIEW SECTION */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'branches') && (
        <div id="section-branches" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Restaurant Locations Overview ({data?.branches?.length || 0})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-sans">
              Manage branch address and contact details shown on the Home page.
            </p>
          </div>

          <div className="space-y-4">
            {(data?.branches || []).map((branch: any, idx: number) => (
              <div
                key={branch.name + idx}
                className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">
                    Branch #{idx + 1}: {branch.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      value={branch.name || ''}
                      onChange={(e) => handleBranchChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={branch.phone || ''}
                      onChange={(e) => handleBranchChange(idx, 'phone', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={branch.address || ''}
                      onChange={(e) => handleBranchChange(idx, 'address', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={branch.hours || ''}
                      onChange={(e) => handleBranchChange(idx, 'hours', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Branch Photo"
                  value={branch.img || ''}
                  onChange={(url) => handleBranchChange(idx, 'img', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PHOTO GALLERY GRID SECTION */}
      {(viewMode === 'scroll' || activeSection === 'all' || activeSection === 'gallery') && (
        <div id="section-gallery" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
                <span>Home Photo Gallery Grid ({data?.gallery?.length || 0})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                Manage featured photo gallery images displayed on the Home page grid.
              </p>
            </div>
            <button
              onClick={handleAddGalleryImage}
              className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data?.gallery || []).map((item: any, idx: number) => (
              <div
                key={item.src + idx}
                className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">Photo #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition"
                    title="Remove gallery photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                    Image Caption / Alt Text
                  </label>
                  <input
                    type="text"
                    value={item.alt || ''}
                    onChange={(e) => handleGalleryChange(idx, 'alt', e.target.value)}
                    placeholder="Photo description"
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                  />
                </div>

                <ImageUploader
                  label="Gallery Photo"
                  value={item.src || ''}
                  onChange={(url) => handleGalleryChange(idx, 'src', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath="/"
      />
    </div>
  );
};
