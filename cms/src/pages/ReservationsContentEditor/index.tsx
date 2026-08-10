import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Loader2, Calendar, FileText, Info, ShieldCheck, Clock } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import './index.css';

export const ReservationsContentEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadPageJson('reservations_content.json')
      .then((res) => {
        if (!res) {
          setData({
            heroTitle: 'Reserve Your Table or Event',
            heroSubtitle: 'Experience authentic Khmer dining in Boeung Kak & Toul Kork.',
            heroImage: '/assets/home-v2/boeung-kak-interior.webp',
            groupBookingNotice: 'For parties larger than 12 guests or private venue buyout inquiries, please contact our event manager directly.',
            cancellationPolicy: 'Reservations can be modified or cancelled up to 2 hours prior to reservation time.',
            depositTerms: 'No prepayment required for standard dining tables. Private banquet rooms require a 30% advance deposit.',
            operatingHours: 'Lunch: 11:00 AM - 2:30 PM | Dinner: 5:00 PM - 10:00 PM',
            maxGuestsNote: 'Standard tables seat up to 8 guests. Larger groups will be arranged across adjacent dining tables.',
          });
        } else {
          setData(res);
        }
      })
      .catch(() => {
        setData({
          heroTitle: 'Reserve Your Table or Event',
          heroSubtitle: 'Experience authentic Khmer dining in Boeung Kak & Toul Kork.',
          heroImage: '/assets/home-v2/boeung-kak-interior.webp',
          groupBookingNotice: 'For parties larger than 12 guests or private venue buyout inquiries, please contact our event manager directly.',
          cancellationPolicy: 'Reservations can be modified or cancelled up to 2 hours prior to reservation time.',
          depositTerms: 'No prepayment required for standard dining tables. Private banquet rooms require a 30% advance deposit.',
          operatingHours: 'Lunch: 11:00 AM - 2:30 PM | Dinner: 5:00 PM - 10:00 PM',
          maxGuestsNote: 'Standard tables seat up to 8 guests. Larger groups will be arranged across adjacent dining tables.',
        });
      })
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageJson('reservations_content.json', data);
      setMessage(`Successfully saved Reservations Page content for ${currentLangInfo.flag} ${currentLangInfo.label}!`);
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error('Failed to save reservations_content.json:', err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-mono">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading Content...
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
            <Calendar className="w-6 h-6 text-black shrink-0 font-sans" />
            <span>Reservations Page Content Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} content for public reservations page
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
        pageName="Reservations Page Content"
      />

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* ── 1. Hero Section ── */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5b8045]" />
          <span>Hero Banner Section ({currentLangInfo.label})</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              HERO TITLE ({currentLangInfo.short})
            </label>
            <input
              type="text"
              value={data.heroTitle || ''}
              onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              HERO SUBTITLE ({currentLangInfo.short})
            </label>
            <textarea
              rows={2}
              value={data.heroSubtitle || ''}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              HERO BACKGROUND IMAGE
            </label>
            <ImageUploader
              value={data.heroImage || ''}
              onChange={(val) => setData({ ...data, heroImage: val })}
              label="Hero Background Image"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Guidelines & Policy Notice ── */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#5b8045]" />
          <span>Booking Guidelines & Policy Text</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              LARGE GROUP / EVENT NOTICE
            </label>
            <textarea
              rows={2}
              value={data.groupBookingNotice || ''}
              onChange={(e) => setData({ ...data, groupBookingNotice: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                CANCELLATION POLICY SUMMARY
              </label>
              <textarea
                rows={3}
                value={data.cancellationPolicy || ''}
                onChange={(e) => setData({ ...data, cancellationPolicy: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                DEPOSIT / PREPAYMENT TERMS
              </label>
              <textarea
                rows={3}
                value={data.depositTerms || ''}
                onChange={(e) => setData({ ...data, depositTerms: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Operating Hours & Capacity Settings ── */}
      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#5b8045]" />
          <span>Operating Hours & Seating Capacity Info</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              OPERATING HOURS TEXT
            </label>
            <input
              type="text"
              value={data.operatingHours || ''}
              onChange={(e) => setData({ ...data, operatingHours: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
              SEATING CAPACITY NOTE
            </label>
            <input
              type="text"
              value={data.maxGuestsNote || ''}
              onChange={(e) => setData({ ...data, maxGuestsNote: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#5b8045]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
