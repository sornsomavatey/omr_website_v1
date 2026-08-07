import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../lib/cmsStorage';
import { ImageUploader } from '../components/ImageUploader';
import { useCmsLanguage } from '../context/CmsLanguageContext';

export const GalleryEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadPageJson('gallery.json')
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load gallery.json:', err))
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    const result = await savePageJson('gallery.json', data);
    setSaving(false);
    setMessage(`Successfully saved Gallery content for ${currentLangInfo.flag} ${currentLangInfo.label}!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      id: `img_${Date.now()}`,
      title: 'New Gallery Photo',
      category: 'Ambience',
      src: '/uploads/default-gallery.webp',
      alt: 'One More Restaurant Gallery',
    };

    const items = Array.isArray(data) ? [...data, newPhoto] : [...(data.items || []), newPhoto];
    setData(Array.isArray(data) ? items : { ...data, items });
  };

  const handleRemovePhoto = (index: number) => {
    const items = Array.isArray(data) ? [...data] : [...(data.items || [])];
    items.splice(index, 1);
    setData(Array.isArray(data) ? items : { ...data, items });
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const items = Array.isArray(data) ? [...data] : [...(data.items || [])];
    items[index] = { ...items[index], [field]: val };
    setData(Array.isArray(data) ? items : { ...data, items });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading gallery.json content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  const photosList = Array.isArray(data) ? data : data?.items || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d402f] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100 font-serif tracking-wide">Gallery Editor</h1>
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#c8a962]/15 text-[#e5c158] border border-[#c8a962]/30 flex items-center gap-1 font-mono">
              <span>{currentLangInfo.flag}</span>
              <span>{currentLangInfo.short} Mode</span>
            </span>
          </div>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/mocks/gallery.json</p>
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

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#c8a962] uppercase tracking-wider font-mono">
          Gallery Assets ({photosList.length}) — {currentLangInfo.flag} {currentLangInfo.label}
        </h2>
        <button
          onClick={handleAddPhoto}
          className="flex items-center gap-1 bg-[#c8a962]/15 text-[#e5c158] hover:bg-[#c8a962]/25 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#c8a962]/30 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {photosList.map((item: any, idx: number) => (
          <div key={item.id || idx} className="p-5 bg-[#18271a] border border-[#2d402f] rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2d402f] pb-2">
              <span className="text-xs font-mono font-bold text-[#c8a962]">Photo #{idx + 1}</span>
              <button
                onClick={() => handleRemovePhoto(idx)}
                className="text-neutral-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Title / Caption ({currentLangInfo.short})</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Category Tag</label>
              <input
                type="text"
                value={item.category || ''}
                onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
              />
            </div>

            <ImageUploader
              label="Image File"
              value={item.src || item.url || item.image || ''}
              onChange={(url) => handleItemChange(idx, 'src', url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
