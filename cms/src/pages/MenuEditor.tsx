import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../lib/cmsStorage';
import { ImageUploader } from '../components/ImageUploader';
import { useCmsLanguage } from '../context/CmsLanguageContext';

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d402f] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100 font-serif tracking-wide">Menu Items & Pricing Editor</h1>
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#c8a962]/15 text-[#e5c158] border border-[#c8a962]/30 flex items-center gap-1 font-mono">
              <span>{currentLangInfo.flag}</span>
              <span>{currentLangInfo.short} Mode</span>
            </span>
          </div>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/mocks/menu.json</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#c8a962] hover:bg-[#b39a62] text-black px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-[#c8a962]/10 disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : `Save (${currentLangInfo.short})`}
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {/* Menu Categories */}
      {categories.map((cat: string) => {
        const items = data?.items?.[cat] || [];

        return (
          <div key={cat} className="bg-[#18271a] border border-[#2d402f] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2d402f] pb-3">
              <h2 className="text-sm font-bold text-[#c8a962] uppercase tracking-wider font-mono">
                Category: {cat} ({items.length} dishes) — {currentLangInfo.flag} {currentLangInfo.short}
              </h2>
              <button
                onClick={() => handleAddItem(cat)}
                className="flex items-center gap-1 bg-[#c8a962]/15 text-[#e5c158] hover:bg-[#c8a962]/25 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#c8a962]/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-4 bg-[#121c13] border border-[#2d402f] rounded-xl space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#c8a962]">
                      Item #{idx + 1} ({cat})
                    </span>
                    <button
                      onClick={() => handleRemoveItem(cat, idx)}
                      className="text-neutral-500 hover:text-rose-400 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Item Name ({currentLangInfo.short})</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'name', e.target.value)}
                        className="w-full bg-[#18271a] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Khmer Name (name_kh)</label>
                      <input
                        type="text"
                        value={item.name_kh || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'name_kh', e.target.value)}
                        className="w-full bg-[#18271a] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Price</label>
                      <input
                        type="text"
                        value={item.price || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'price', e.target.value)}
                        className="w-full bg-[#18271a] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Badge Tag (e.g. Popular, Chef's Choice)</label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => handleItemChange(cat, idx, 'badge', e.target.value)}
                        className="w-full bg-[#18271a] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Description ({currentLangInfo.short})</label>
                    <textarea
                      rows={2}
                      value={item.desc || ''}
                      onChange={(e) => handleItemChange(cat, idx, 'desc', e.target.value)}
                      className="w-full bg-[#18271a] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] resize-none"
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
