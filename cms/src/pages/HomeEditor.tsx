import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../lib/cmsStorage';
import { ImageUploader } from '../components/ImageUploader';
import { useCmsLanguage } from '../context/CmsLanguageContext';

export const HomeEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [localeDict, setLocaleDict] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

          const mergedHero = {
            ...homeRes.hero,
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

          setData({
            ...homeRes,
            hero: mergedHero,
            signatureDishes: mergedDishes,
          });
        } else {
          setData(homeRes);
        }
      })
      .catch((err) => console.error('Failed to load home page content:', err))
      .finally(() => setLoading(false));
  }, [language]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-[#1c2819]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e8df] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#212d1b] font-serif tracking-wide">Home Page Editor</h1>
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#5b8045]/10 text-[#5b8045] border border-[#5b8045]/30 flex items-center gap-1 font-mono">
              <span>{currentLangInfo.flag}</span>
              <span>{currentLangInfo.short} Mode</span>
            </span>
          </div>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.flag} {currentLangInfo.label} content (home.json & locales/{language}.json)
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white border border-[#e2e8df] rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
            Hero Section ({currentLangInfo.flag} {currentLangInfo.label})
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
            label="Hero Background Image"
            value={data?.hero?.backgroundImage || ''}
            onChange={(url) =>
              setData({ ...data, hero: { ...data?.hero, backgroundImage: url } })
            }
          />
        </div>
      </div>

      {/* Signature Dishes List */}
      <div className="bg-white border border-[#e2e8df] rounded-2xl p-6 space-y-4 shadow-xs">
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
    </div>
  );
};
