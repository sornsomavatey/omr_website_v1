import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, Image as ImageIcon, Eye, Undo2, Redo2 } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { useCmsHistory } from '../../lib/useCmsHistory';
import './index.css';

export const GalleryEditor: React.FC = () => {
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
  } = useCmsHistory<any>('gallery.json');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  useEffect(() => {
    setLoading(true);
    loadPageJson('gallery.json')
      .then((res) => setInitialData(res))
      .catch((err) => console.error('Failed to load gallery.json:', err))
      .finally(() => setLoading(false));
  }, [language, setInitialData]);

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
    const updated = Array.isArray(data) ? items : { ...data, items };
    updateData(updated);
    savePageJson('gallery.json', updated).catch(() => {});
  };

  const handleRemovePhoto = (index: number) => {
    const items = Array.isArray(data) ? [...data] : [...(data.items || [])];
    items.splice(index, 1);
    const updated = Array.isArray(data) ? items : { ...data, items };
    updateData(updated);
    savePageJson('gallery.json', updated).catch(() => {});
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const items = Array.isArray(data) ? [...data] : [...(data.items || [])];
    items[index] = { ...items[index], [field]: val };
    const updated = Array.isArray(data) ? items : { ...data, items };
    updateData(updated);
    savePageJson('gallery.json', updated).catch(() => {});
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
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Back Link under Hamburger */}
      <div>
        <CmsBackToPagesLink />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d402f] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 font-serif tracking-wide flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#c8a962] shrink-0 font-sans" />
            <span>Gallery Editor</span>
          </h1>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/mocks/gallery.json</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CmsLanguageDropdown />
          <CmsPageSelectDropdown />
          <button
            onClick={() => setShowSaveConfirmModal(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-[#5b8045]/20 disabled:opacity-50 shrink-0 cursor-pointer"
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
        pageName="Gallery"
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

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath="/gallery"
      />
    </div>
  );
};
