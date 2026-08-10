import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import './index.css';

export const TestimonialsEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadPageJson('testimonials.json')
      .then((res) => setData(Array.isArray(res) ? res : res?.testimonials || []))
      .catch((err) => console.error('Failed to load testimonials.json:', err))
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await savePageJson('testimonials.json', { testimonials: data });
      setMessage(`Testimonials saved successfully for ${currentLangInfo.label}!`);
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Failed to save testimonials data.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: `review_${Date.now()}`,
      name: 'Guest Reviewer',
      location: 'Phnom Penh',
      date: '1 week ago',
      rating: 5,
      comment: 'Wonderful dining experience and great food!',
    };
    setData([newItem, ...data]);
  };

  const handleRemove = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  const handleChange = (index: number, field: string, val: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: val };
    setData(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading content...
      </div>
    );
  }

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
            <MessageSquare className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Guest Testimonials Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} content (testimonials.json)
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
        pageName="Guest Testimonials"
      />

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Reviews List Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
          <span>Reviews List ({data.length}) — {currentLangInfo.label}</span>
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-[#5b8045] hover:bg-[#4a6b37] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {data.map((rev: any, idx: number) => (
          <div key={rev.id || idx} className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Review #{idx + 1}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                  GUEST NAME
                </label>
                <input
                  type="text"
                  value={rev.name || rev.author || ''}
                  onChange={(e) => handleChange(idx, 'name', e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                  LOCATION / TAG
                </label>
                <input
                  type="text"
                  value={rev.location || rev.role || ''}
                  onChange={(e) => handleChange(idx, 'location', e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                  RATING (1-5 STARS)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rev.rating || 5}
                  onChange={(e) => handleChange(idx, 'rating', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                REVIEW COMMENT ({currentLangInfo.short})
              </label>
              <textarea
                rows={3}
                value={rev.comment || rev.text || ''}
                onChange={(e) => handleChange(idx, 'comment', e.target.value)}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
