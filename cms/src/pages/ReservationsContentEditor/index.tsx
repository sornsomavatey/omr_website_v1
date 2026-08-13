import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, Calendar, FileText, HelpCircle, Clock, Info, Check, Gift, Armchair, Sparkles } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsHistory } from '../../lib/useCmsHistory';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import { CmsSectionNav, CmsSectionItem } from '../../components/CmsSectionNav';
import { ImageUploader } from '../../components/ImageUploader';

const defaultOccasions = [
  { id: 'birthday', name: 'Birthday Celebration', desc: 'Complimentary dessert & candle setup' },
  { id: 'business', name: 'Business Dinner', desc: 'Quiet table positioning for private discussions' },
  { id: 'anniversary', name: 'Anniversary', desc: 'Special table setup & flower arrangement options' },
  { id: 'family', name: 'Family Gathering', desc: 'Spacious seating suitable for groups' },
  { id: 'romantic', name: 'Romantic Date', desc: 'Intimate ambiance with romantic lighting' },
  { id: 'other', name: 'Other Celebration', desc: 'Tell us your occasion notes when booking' },
];

const defaultSeating = [
  { id: 'indoor', name: 'Indoor Main Hall', desc: 'Climate-controlled dining with elegant decor' },
  { id: 'outdoor', name: 'Outdoor Garden Terrace', desc: 'Al-fresco dining surrounded by lush greenery' },
  { id: 'private', name: 'Private Dining Room', desc: 'Exclusive enclosed room for uninterrupted privacy' },
  { id: 'vip', name: 'VIP Lounge', desc: 'Premium private suite with dedicated service staff' },
];

export const ReservationsContentEditor: React.FC = () => {
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
  } = useCmsHistory<any>('reservations.json');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  const sections: CmsSectionItem[] = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'guestInfo', label: 'Guest Info Card', count: data?.guestInformation?.length || 0 },
    { id: 'steps', label: 'Booking Form Steps' },
    { id: 'options', label: 'Occasions & Seating' },
    { id: 'faq', label: 'FAQs', count: data?.faq?.items?.length || 0 },
  ];

  useEffect(() => {
    setLoading(true);
    loadPageJson('reservations.json')
      .then((res) => {
        const defaultBase = {
          hero: {
            eyebrow: 'EST. 2008 · PHNOM PENH',
            title: 'Reserve Your Table',
            desc: 'Immerse yourself in the ultimate Cambodian dining experience, where legendary heritage recipes are proudly brought to life in an atmosphere of refined elegance.',
            heroImage: '@/assets/home-v2/boeung-kak-exterior.webp',
          },
          guestInformationTitle: 'Guest Information',
          guestInformation: [
            { type: 'hours', label: 'Opening Hours', value: '06:00 AM - 10:00 PM' },
            { type: 'phone', label: 'Contact Number', value: '+855 23 888 222' },
            { type: 'policy', label: 'Reservation Policy', value: 'Free cancellation up to 24h' },
          ],
          steps: {
            branch: { title: 'Choose Branch', desc: 'Select your preferred location in Phnom Penh' },
            contact: { title: 'Contact Details', desc: 'Enter your information so we can contact you regarding your booking' },
            guests: { title: 'Guests', desc: 'Tell us how many people will be joining you' },
            dateTime: { title: 'Select Date & Time', desc: 'Choose preferred date, meal time & guest size' },
            occasion: { title: 'Special Occasion', desc: 'Let us know if you are celebrating a special event' },
            seating: { title: 'Seating Preference', desc: 'Choose where you would like to be seated' },
            summary: { title: 'Booking Summary' },
          },
          occasions: defaultOccasions,
          seatingPreferences: defaultSeating,
          success: {
            title: 'Reservation Confirmed!',
            desc: 'Thank you for booking with One More Restaurant.',
            makeAnother: 'Make Another Booking',
          },
          faq: {
            eyebrow: 'Assistance',
            title: 'Frequently Asked Questions',
            items: [
              { q: 'What is the dress code?', a: 'We recommend smart casual attire. Traditional Khmer attire is also very welcome for special occasions.' },
              { q: 'Do you offer vegetarian or vegan options?', a: 'Yes, we have a variety of vegetarian and vegan options available. Please inform your waiter or mention it in the special requests section when booking.' },
              { q: 'Is there parking available at the branches?', a: 'Yes, both our Toul Kork and Boeung Kak branches feature spacious, secure parking lots with complimentary valet service.' },
              { q: 'Can I bring my own wine?', a: 'Yes, you may bring your own wine. A corkage fee of USD 15 per bottle applies.' },
              { q: 'Are pets allowed?', a: 'To ensure a comfortable dining environment for all guests, pets are only allowed in our outdoor garden areas.' },
            ],
          },
        };

        const base = res ? {
          ...defaultBase,
          ...res,
          hero: {
            ...defaultBase.hero,
            ...(res?.hero || {}),
            heroImage: res?.hero?.heroImage || res?.hero?.backgroundImage || res?.hero?.image || defaultBase.hero.heroImage,
          },
        } : defaultBase;
        setInitialData(base);
      })
      .catch((err) => console.error('Failed to load reservations data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    await savePageJson('reservations.json', data);

    setSaving(false);
    setMessage(`Successfully saved Reservations Page content!`);
    setTimeout(() => setMessage(null), 4000);
  };

  /* FAQ Handlers */
  const handleAddFaq = () => {
    if (!data) return;
    const newFaq = { q: 'New Question?', a: 'Detailed answer response goes here.' };
    const updatedItems = [...(data.faq?.items || []), newFaq];
    setData({ ...data, faq: { ...(data.faq || {}), items: updatedItems } });
  };

  const handleRemoveFaq = (index: number) => {
    if (!data || !data.faq?.items) return;
    const updated = [...data.faq.items];
    updated.splice(index, 1);
    setData({ ...data, faq: { ...data.faq, items: updated } });
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', val: string) => {
    if (!data || !data.faq?.items) return;
    const updated = [...data.faq.items];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, faq: { ...data.faq, items: updated } });
  };

  /* Guest Info Handlers */
  const handleGuestInfoChange = (index: number, val: string) => {
    if (!data || !data.guestInformation) return;
    const updated = [...data.guestInformation];
    updated[index] = { ...updated[index], value: val };
    setData({ ...data, guestInformation: updated });
  };

  /* Occasions Handler */
  const handleOccasionChange = (index: number, field: 'name' | 'desc', val: string) => {
    if (!data || !data.occasions) return;
    const updated = [...data.occasions];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, occasions: updated });
  };

  /* Seating Preference Handler */
  const handleSeatingChange = (index: number, field: 'name' | 'desc', val: string) => {
    if (!data || !data.seatingPreferences) return;
    const updated = [...data.seatingPreferences];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, seatingPreferences: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading Reservations Content...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-4 pb-12 text-[#1c2819] font-sans">
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
            Editing {currentLangInfo.label} content (reservations.json & locales/{language}.json)
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

      {/* Section Quick Jump Bar */}
      <CmsSectionNav
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* ── 1. Hero Banner Section ── */}
      {(activeSection === 'all' || activeSection === 'hero') && (
        <div id="section-hero" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
            <span>Hero Banner Section ({currentLangInfo.label})</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Eyebrow Tag ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.hero?.eyebrow || ''}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data?.hero, eyebrow: e.target.value } })
                }
                placeholder="e.g. EST. 2008 · PHNOM PENH"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
              />
            </div>

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
                placeholder="e.g. Reserve Your Table"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Description ({currentLangInfo.short})
              </label>
              <textarea
                rows={3}
                value={data?.hero?.desc || ''}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data?.hero, desc: e.target.value } })
                }
                placeholder="Hero paragraph description"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 resize-none font-medium"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <ImageUploader
                label={`Hero Background Image (${currentLangInfo.short})`}
                value={data?.hero?.heroImage || data?.hero?.backgroundImage || data?.hero?.image || '@/assets/home-v2/boeung-kak-exterior.webp'}
                onChange={(url) =>
                  setData({
                    ...data,
                    hero: {
                      ...data?.hero,
                      heroImage: url,
                      backgroundImage: url,
                      image: url,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Guest Info Card Settings ── */}
      {(activeSection === 'all' || activeSection === 'guestInfo') && (
        <div id="section-guestInfo" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Guest Information Card ({data?.guestInformation?.length || 0})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-sans">
              Manage opening hours, phone number, and reservation policy displayed in the top right card.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
              Card Section Title ({currentLangInfo.short})
            </label>
            <input
              type="text"
              value={data?.guestInformationTitle || 'Guest Information'}
              onChange={(e) => setData({ ...data, guestInformationTitle: e.target.value })}
              placeholder="e.g. Guest Information"
              className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] font-medium"
            />
          </div>

          <div className="space-y-3">
            {(data?.guestInformation || []).map((info: any, idx: number) => (
              <div key={info.label + idx} className="p-3.5 bg-[#f8faf6] border border-[#e2e8df] rounded-xl flex items-center justify-between gap-4">
                <div className="w-1/3">
                  <span className="text-xs font-mono font-bold text-[#5b8045] block">{info.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({info.type})</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={info.value || ''}
                    onChange={(e) => handleGuestInfoChange(idx, e.target.value)}
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Booking Form Steps Labels ── */}
      {(activeSection === 'all' || activeSection === 'steps') && (
        <div id="section-steps" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Booking Form Steps & Headers ({currentLangInfo.label})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-sans">
              Customize the step titles and description subtitles shown in the reservation booking form.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1: Branch */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 1: Choose Branch</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.branch?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, branch: { ...data?.steps?.branch, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.branch?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, branch: { ...data?.steps?.branch, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 2: Contact Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.contact?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, contact: { ...data?.steps?.contact, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.contact?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, contact: { ...data?.steps?.contact, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Guests */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 3: Guests Count</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.guests?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, guests: { ...data?.steps?.guests, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.guests?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, guests: { ...data?.steps?.guests, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Date & Time */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 4: Select Date & Time</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.dateTime?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, dateTime: { ...data?.steps?.dateTime, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.dateTime?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, dateTime: { ...data?.steps?.dateTime, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Occasion */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 5: Special Occasion</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.occasion?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, occasion: { ...data?.steps?.occasion, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.occasion?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, occasion: { ...data?.steps?.occasion, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 6: Seating */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 6: Seating Preference</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Step Title</label>
                  <input
                    type="text"
                    value={data?.steps?.seating?.title || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, seating: { ...data?.steps?.seating, title: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Subtitle Description</label>
                  <input
                    type="text"
                    value={data?.steps?.seating?.desc || ''}
                    onChange={(e) =>
                      setData({ ...data, steps: { ...data?.steps, seating: { ...data?.steps?.seating, desc: e.target.value } } })
                    }
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            {/* Step 7: Summary Header */}
            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045]">Step 7: Booking Summary Header</span>
              <div>
                <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Section Header Title</label>
                <input
                  type="text"
                  value={data?.steps?.summary?.title || ''}
                  onChange={(e) =>
                    setData({ ...data, steps: { ...data?.steps, summary: { ...data?.steps?.summary, title: e.target.value } } })
                  }
                  className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Occasion & Seating Options ── */}
      {(activeSection === 'all' || activeSection === 'options') && (
        <div id="section-options" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-6 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Occasion & Seating Options ({currentLangInfo.label})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-sans">
              Edit interactive occasion options and seating preferences selectable by guests when making a booking.
            </p>
          </div>

          {/* Special Occasions */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-[#5b8045] uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#5b8045]" />
              <span>Special Occasions List ({data?.occasions?.length || 0})</span>
            </h3>
            <div className="space-y-3">
              {(data?.occasions || []).map((occ: any, idx: number) => (
                <div key={occ.id || idx} className="p-3.5 bg-[#f8faf6] border border-[#e2e8df] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1">Occasion Name ({occ.id})</label>
                    <input
                      type="text"
                      value={occ.name || ''}
                      onChange={(e) => handleOccasionChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1">Occasion Subtitle / Note</label>
                    <input
                      type="text"
                      value={occ.desc || ''}
                      onChange={(e) => handleOccasionChange(idx, 'desc', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seating Preferences */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-mono font-bold text-[#5b8045] uppercase tracking-wider flex items-center gap-1.5">
              <Armchair className="w-4 h-4 text-[#5b8045]" />
              <span>Seating Preferences List ({data?.seatingPreferences?.length || 0})</span>
            </h3>
            <div className="space-y-3">
              {(data?.seatingPreferences || []).map((seat: any, idx: number) => (
                <div key={seat.id || idx} className="p-3.5 bg-[#f8faf6] border border-[#e2e8df] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1">Seating Preference Name ({seat.id})</label>
                    <input
                      type="text"
                      value={seat.name || ''}
                      onChange={(e) => handleSeatingChange(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-500 mb-1">Seating Description</label>
                    <input
                      type="text"
                      value={seat.desc || ''}
                      onChange={(e) => handleSeatingChange(idx, 'desc', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* ── 6. Frequently Asked Questions (FAQ) Section ── */}
      {(activeSection === 'all' || activeSection === 'faq') && (
        <div id="section-faq" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
                <span>Frequently Asked Questions ({data?.faq?.items?.length || 0})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                Manage questions and answers displayed in the FAQ accordion section at the bottom of the Reservations page.
              </p>
            </div>
            <button
              onClick={handleAddFaq}
              className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add FAQ
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                FAQ Eyebrow Tag ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.faq?.eyebrow || ''}
                onChange={(e) =>
                  setData({ ...data, faq: { ...data?.faq, eyebrow: e.target.value } })
                }
                placeholder="e.g. Assistance"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                FAQ Section Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.faq?.title || ''}
                onChange={(e) =>
                  setData({ ...data, faq: { ...data?.faq, title: e.target.value } })
                }
                placeholder="e.g. Frequently Asked Questions"
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(data?.faq?.items || []).map((faq: any, idx: number) => (
              <div
                key={faq.q + idx}
                className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">FAQ Item #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveFaq(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                    title="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                    Question ({currentLangInfo.short})
                  </label>
                  <input
                    type="text"
                    value={faq.q || ''}
                    onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                    placeholder="e.g. What is the dress code?"
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">
                    Answer ({currentLangInfo.short})
                  </label>
                  <textarea
                    rows={2}
                    value={faq.a || ''}
                    onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                    placeholder="Provide a helpful, detailed answer..."
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] resize-none font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
