import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, UtensilsCrossed } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import './index.css';

export const MenuEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadPageJson('menu.json')
      .then((res) => setData(res))
      .catch(() => {
        setData({
          hero: {
            title: 'Our Menu',
            subtitle: 'Traditional Cambodian flavors served with modern warmth.',
            backgroundImage: '/uploads/menu-banner.webp',
          },
          categories: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'],
          items: {
            Breakfast: [],
            Lunch: [],
            Dinner: [],
            Dessert: [],
            Drinks: [],
          },
        });
      })
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    const result = await savePageJson('menu.json', data);
    setSaving(false);
    setMessage(`Successfully saved Menu items & prices for ${currentLangInfo.flag} ${currentLangInfo.label}!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddItem = (category: string) => {
    if (!data || !data.items) return;
    const newItem = {
      id: `prod_${Date.now()}`,
      name: 'New Menu Item',
      name_kh: 'មុខម្ហូបថ្មី',
      price: '$12.00',
      desc: 'Delicious dish description.',
      img: '/uploads/default-food.webp',
      badge: '',
    };
    const categoryItems = data.items[category] || [];
    setData({
      ...data,
      items: {
        ...data.items,
        [category]: [newItem, ...categoryItems],
      },
    });
  };

  const handleRemoveItem = (category: string, index: number) => {
    if (!data || !data.items) return;
    const categoryItems = [...(data.items[category] || [])];
    categoryItems.splice(index, 1);
    setData({
      ...data,
      items: {
        ...data.items,
        [category]: categoryItems,
      },
    });
  };

  const handleItemChange = (category: string, index: number, field: string, val: string) => {
    if (!data || !data.items) return;
    const categoryItems = [...(data.items[category] || [])];
    categoryItems[index] = { ...categoryItems[index], [field]: val };
    setData({
      ...data,
      items: {
        ...data.items,
        [category]: categoryItems,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading menu.json content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  const categories = data?.categories || ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 text-[#1c2819]">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2e8df] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Menu Items & Pricing Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">Editing Frontend/public/mocks/menu.json</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Menu Categories */}
      {categories.map((cat: string) => {
        const items = data?.items?.[cat] || [];

        return (
          <div key={cat} className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-[#212d1b] font-serif tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
                <span>Category: {cat}</span>
                <span className="text-xs font-mono text-[#5b8045] font-semibold bg-[#5b8045]/10 px-2 py-0.5 rounded-lg">
                  {items.length} dishes
                </span>
              </h2>
              <button
                onClick={() => handleAddItem(cat)}
                className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5b8045]">
                      Item #{idx + 1} ({cat})
                    </span>
                    <button
                      onClick={() => handleRemoveItem(cat, idx)}
                      className="text-gray-400 hover:text-rose-600 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Item Name ({currentLangInfo.short})</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'name', e.target.value)}
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Khmer Name (name_kh)</label>
                      <input
                        type="text"
                        value={item.name_kh || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'name_kh', e.target.value)}
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Price</label>
                      <input
                        type="text"
                        value={item.price || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'price', e.target.value)}
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Badge Tag (e.g. Popular, Chef's Choice)</label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'badge', e.target.value)}
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Description ({currentLangInfo.short})</label>
                    <textarea
                      rows={2}
                      value={item.desc || ''}
                      onChange={(e) => handleItemChange(cat, idx, 'desc', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 resize-none font-medium"
                    />
                  </div>

                  <ImageUploader
                    label="Dish Image"
                    value={item.img || ''}
                    onChange={(url) => handleItemChange(cat, idx, 'img', url)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
