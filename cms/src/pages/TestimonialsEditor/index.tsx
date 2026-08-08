import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import './index.css';

export const TestimonialsEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      <div className="flex items-center justify-center h-64 text-[#a9ca96] gap-2 text-xs font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading testimonials.json content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

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
            <MessageSquare className="w-6 h-6 text-[#c8a962] shrink-0 font-sans" />
            <span>Guest Testimonials Editor</span>
          </h1>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/mocks/testimonials.json</p>
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

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#c8a962] uppercase tracking-wider font-mono">
          Reviews List ({data.length}) — {currentLangInfo.flag} {currentLangInfo.label}
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 bg-[#c8a962]/15 text-[#e5c158] hover:bg-[#c8a962]/25 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#c8a962]/30 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Review
        </button>
      </div>

      <div className="space-y-4">
        {data.map((rev: any, idx: number) => (
          <div key={rev.id || idx} className="p-5 bg-[#18271a] border border-[#2d402f] rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2d402f] pb-2">
              <span className="text-xs font-mono font-bold text-[#c8a962]">Review #{idx + 1}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="text-neutral-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Guest Name</label>
                <input
                  type="text"
                  value={rev.name || rev.author || ''}
                  onChange={(e) => handleChange(idx, 'name', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Location / Tag</label>
                <input
                  type="text"
                  value={rev.location || rev.role || ''}
                  onChange={(e) => handleChange(idx, 'location', e.target.value)}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rev.rating || 5}
                  onChange={(e) => handleChange(idx, 'rating', Number(e.target.value))}
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a9ca96] mb-1 font-mono">Review Comment ({currentLangInfo.short})</label>
              <textarea
                rows={2}
                value={rev.comment || rev.text || ''}
                onChange={(e) => handleChange(idx, 'comment', e.target.value)}
                className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
