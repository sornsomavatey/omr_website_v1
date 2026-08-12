import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, Loader2, Sparkles, Package, Building, Layers, Image as ImageIcon, Phone } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { ImageUploader } from '../../components/ImageUploader';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import { CmsBackToPagesLink, CmsPageSelectDropdown } from '../../components/CmsPageSwitcher';
import { CmsSaveConfirmModal } from '../../components/CmsSaveConfirmModal';
import { CmsSectionNav, CmsSectionItem } from '../../components/CmsSectionNav';

const defaultPackages = {
  eyebrow: 'EVENT PACKAGES',
  title: 'Choose The Perfect Package',
  items: {
    family: {
      name: 'Family Celebration',
      guests: '8–12 Guests',
      features: [
        'Private Room',
        'Free basic table set up',
        'Free room charge 2hr',
        'More than 100+ A La Cart Selection',
        'Waiter and Waitress to Serve Food and Drink',
      ],
      img: '@/assets/events/round-table-boeung-kak.webp',
    },
    engagement: {
      name: 'Engagement Package',
      guests: '30 Guests',
      features: [
        'Free Event Hall Half Day',
        'Free Table Set Up',
        'Gourmet Buffet or Set Menu (8-10 item/set)',
        'Free beverage per table (vital water 350ml 10bottle/table, coke 10cans/table)',
        'Free flow of non-alcohol beverages for Buffet',
        'Waiter and Waitress to Serve Food and Drink',
      ],
      img: '@/assets/events/red-engagement-clean.webp',
    },
    catering: {
      name: 'Meeting Room',
      guests: '30+ Guests',
      features: [
        'Free Meeting Room',
        'LCD Projector + Screen + Laser Pointer',
        'PA System for Stage & Microphones',
        'Flipchart & Paper, Whiteboard with Markers & Lectern',
        'Vital Water 350ml (2 bottles/half day, 4 bottles/full day)',
      ],
      img: '@/assets/events/corporate-room.webp',
    },
    corporate: {
      name: 'Corporate Package',
      guests: '8–80 Guests',
      features: [
        'Free Meeting Room',
        'LCD Projector + Screen + Laser Pointer',
        'PA System for Stage & Microphones',
        'Flipchart & Paper, Whiteboard with Markers & Lectern',
        'Vital Water 350ml (2 bottles/half day, 4 bottles/full day)',
      ],
      img: '@/assets/events/corporate-package.webp',
    },
  },
};

const defaultSpaces = {
  eyebrow: 'EVENT SPACES',
  title: 'Beautiful Spaces For Every Occasion',
  items: {
    vip: {
      name: 'VIP Room',
      guestTag: '8–12 Guests',
      badgeTag: 'Best for Private Dinners',
      features: [
        'Air Conditioning (AC)',
        'Personal Butler Service',
        'Garden View',
        'Audio Visual System (AV)',
      ],
      img: '@/assets/events/private-room-no-logo.webp',
    },
    private: {
      name: 'Private Room',
      guestTag: '8–12 Guests',
      badgeTag: 'Best for Private Dinners',
      features: [
        'Air Conditioning (AC)',
        'Personal Butler Service',
        'Garden View',
        'Audio Visual System (AV)',
      ],
      img: '@/assets/events/family-event-room.webp',
    },
    'main-hall': {
      name: 'Main Dining Hall',
      guestTag: '80–120 Guests',
      badgeTag: 'Best for Large Celebrations',
      features: [
        'Air Conditioning (AC)',
        'Personal Butler Service',
        'Garden View',
        'Audio Visual System (AV)',
      ],
      img: '@/assets/events/main-hall.webp',
    },
  },
};

export const EventsEditor: React.FC = () => {
  const { language, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  const sections: CmsSectionItem[] = [
    { id: 'hero', label: 'Hero & Contact Card' },
    { id: 'packages', label: 'Event Packages' },
    { id: 'spaces', label: 'Event Spaces' },
    { id: 'promotions', label: 'Promotions List', count: Array.isArray(data?.events) ? data.events.length : 0 },
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadPageJson('events.json').catch(() => null),
      loadPageJson(`locales/${language}.json`).catch(() => null),
    ])
      .then(([res, dict]) => {
        const eventsList = Array.isArray(res) ? res : (res?.events || []);
        const eventsPage = dict?.eventsPage || {};

        const mergedHero = {
          eyebrow: eventsPage.hero?.eyebrow ?? 'ONE MORE RESTAURANT',
          title: eventsPage.hero?.title ?? 'Celebrate Every Special Moment With Us',
          desc: eventsPage.hero?.desc ?? 'From private intimate gatherings to grand celebrations, One More Restaurant offers beautiful spaces, exquisite food, and unforgettable experiences.',
          planCta: eventsPage.hero?.planCta ?? 'Plan Your Event',
          contactCta: eventsPage.hero?.contactCta ?? 'Contact Event Team',
          contactInfo: eventsPage.hero?.contactInfo ?? 'ព័ត៌មានទំនាក់ទំនង\nរៀបចំកម្មវិធី',
          hotline: eventsPage.hero?.hotline ?? 'Event Hotline',
          hotlineValue: eventsPage.hero?.hotlineValue ?? '023 888 222',
          email: eventsPage.hero?.email ?? 'Email Inquiry',
          emailValue: eventsPage.hero?.emailValue ?? 'sales@onemorerestaurant.com',
          policyLabel: eventsPage.hero?.policyLabel ?? 'Reservation Policy',
          policyValue: eventsPage.hero?.policyValue ?? 'Free cancellation up to 24h',
          heroImage: eventsPage.hero?.heroImage ?? '@/assets/events/silver-birthday-dining-no-hbd.webp',
        };

        const mergedPackages = {
          eyebrow: eventsPage.packages?.eyebrow ?? defaultPackages.eyebrow,
          title: eventsPage.packages?.title ?? defaultPackages.title,
          items: {
            ...defaultPackages.items,
            ...(eventsPage.packages?.items || {}),
          },
        };

        const mergedSpaces = {
          eyebrow: eventsPage.spaces?.eyebrow ?? defaultSpaces.eyebrow,
          title: eventsPage.spaces?.title ?? defaultSpaces.title,
          items: {
            ...defaultSpaces.items,
            ...(eventsPage.spaces?.items || {}),
          },
        };

        setData({
          events: eventsList,
          hero: mergedHero,
          packages: mergedPackages,
          spaces: mergedSpaces,
        });
      })
      .catch((err) => console.error('Failed to load events data:', err))
      .finally(() => setLoading(false));
  }, [language]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    // Save promotions array to events.json if in English
    if (language === 'en') {
      await savePageJson('events.json', data.events || []);
    }

    try {
      let currentDict = await loadPageJson(`locales/${language}.json`).catch(() => ({}));
      if (!currentDict) currentDict = {};

      const updatedDict = {
        ...currentDict,
        eventsPage: {
          ...(currentDict.eventsPage || {}),
          hero: data.hero || {},
          packages: data.packages || {},
          spaces: data.spaces || {},
        },
      };

      await savePageJson(`locales/${language}.json`, updatedDict);
    } catch (err) {
      console.warn('Could not sync eventsPage dictionary:', err);
    }

    setSaving(false);
    setMessage(`Successfully saved Events Page & Promotions for ${currentLangInfo.flag} ${currentLangInfo.label}!`);
    setTimeout(() => setMessage(null), 4000);
  };

  /* Promotions List Handlers */
  const handleAddEvent = () => {
    if (!data) return;
    const newEvent = {
      id: `event_${Date.now()}`,
      title: 'New Dining Event',
      category: 'SPECIAL PROMOTION',
      date: 'Available Daily',
      location: 'Boeung Kak & Toul Kork',
      description: 'Event description details.',
      fullDescription: 'Extended event information.',
      image: '/uploads/default-event.webp',
      featured: false,
    };

    const updatedEvents = [newEvent, ...(data.events || [])];
    setData({ ...data, events: updatedEvents });
  };

  const handleRemoveEvent = (index: number) => {
    if (!data || !data.events) return;
    const updated = [...data.events];
    updated.splice(index, 1);
    setData({ ...data, events: updated });
  };

  const handleEventChange = (index: number, field: string, val: any) => {
    if (!data || !data.events) return;
    const updated = [...data.events];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, events: updated });
  };

  /* Package Feature Handler */
  const handlePackageFeatureChange = (pkgKey: string, featIdx: number, val: string) => {
    if (!data || !data.packages?.items?.[pkgKey]) return;
    const pkg = data.packages.items[pkgKey];
    const updatedFeatures = [...(pkg.features || [])];
    updatedFeatures[featIdx] = val;

    setData({
      ...data,
      packages: {
        ...data.packages,
        items: {
          ...data.packages.items,
          [pkgKey]: {
            ...pkg,
            features: updatedFeatures,
          },
        },
      },
    });
  };

  const handleAddPackageFeature = (pkgKey: string) => {
    if (!data || !data.packages?.items?.[pkgKey]) return;
    const pkg = data.packages.items[pkgKey];
    const updatedFeatures = [...(pkg.features || []), 'New Package Feature'];
    setData({
      ...data,
      packages: {
        ...data.packages,
        items: { ...data.packages.items, [pkgKey]: { ...pkg, features: updatedFeatures } },
      },
    });
  };

  const handleRemovePackageFeature = (pkgKey: string, featIdx: number) => {
    if (!data || !data.packages?.items?.[pkgKey]) return;
    const pkg = data.packages.items[pkgKey];
    const updatedFeatures = [...(pkg.features || [])];
    updatedFeatures.splice(featIdx, 1);
    setData({
      ...data,
      packages: {
        ...data.packages,
        items: { ...data.packages.items, [pkgKey]: { ...pkg, features: updatedFeatures } },
      },
    });
  };

  /* Space Feature Handler */
  const handleSpaceFeatureChange = (spaceKey: string, featIdx: number, val: string) => {
    if (!data || !data.spaces?.items?.[spaceKey]) return;
    const space = data.spaces.items[spaceKey];
    const updatedFeatures = [...(space.features || [])];
    updatedFeatures[featIdx] = val;

    setData({
      ...data,
      spaces: {
        ...data.spaces,
        items: {
          ...data.spaces.items,
          [spaceKey]: {
            ...space,
            features: updatedFeatures,
          },
        },
      },
    });
  };

  const handleAddSpaceFeature = (spaceKey: string) => {
    if (!data || !data.spaces?.items?.[spaceKey]) return;
    const space = data.spaces.items[spaceKey];
    const updatedFeatures = [...(space.features || []), 'New Space Feature'];
    setData({
      ...data,
      spaces: {
        ...data.spaces,
        items: { ...data.spaces.items, [spaceKey]: { ...space, features: updatedFeatures } },
      },
    });
  };

  const handleRemoveSpaceFeature = (spaceKey: string, featIdx: number) => {
    if (!data || !data.spaces?.items?.[spaceKey]) return;
    const space = data.spaces.items[spaceKey];
    const updatedFeatures = [...(space.features || [])];
    updatedFeatures.splice(featIdx, 1);
    setData({
      ...data,
      spaces: {
        ...data.spaces,
        items: { ...data.spaces.items, [spaceKey]: { ...space, features: updatedFeatures } },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
        Loading Events content for {currentLangInfo.flag} {currentLangInfo.label}...
      </div>
    );
  }

  const eventsArray = data?.events || [];

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
            <Sparkles className="w-6 h-6 text-[#5b8045] shrink-0 font-sans" />
            <span>Events Page Content & Promotions Editor</span>
          </h1>
          <p className="text-xs text-[#606e5c] font-mono mt-1">
            Editing {currentLangInfo.label} content (events.json & locales/{language}.json)
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
        pageName="Events Page & Promotions"
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

      {/* ── 1. Hero & Contact Card ── */}
      {(activeSection === 'all' || activeSection === 'hero') && (
        <div id="section-hero" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
            <span>Events Hero Banner & Contact Card ({currentLangInfo.label})</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Eyebrow Tag ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.hero?.eyebrow || ''}
                onChange={(e) => setData({ ...data, hero: { ...data?.hero, eyebrow: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.hero?.title || ''}
                onChange={(e) => setData({ ...data, hero: { ...data?.hero, title: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5 font-mono">
                Hero Description ({currentLangInfo.short})
              </label>
              <textarea
                rows={3}
                value={data?.hero?.desc || ''}
                onChange={(e) => setData({ ...data, hero: { ...data?.hero, desc: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] resize-none font-medium"
              />
            </div>

            <div className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
              <span className="text-xs font-mono font-bold text-[#5b8045] uppercase tracking-wider">Contact Card Content ({currentLangInfo.short})</span>
              <div>
                <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Contact Info Card Title</label>
                <textarea
                  rows={2}
                  value={data?.hero?.contactInfo || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data?.hero, contactInfo: e.target.value } })}
                  placeholder="Use \n for line breaks"
                  className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Hotline Phone Number</label>
                  <input
                    type="text"
                    value={data?.hero?.hotlineValue || ''}
                    onChange={(e) => setData({ ...data, hero: { ...data?.hero, hotlineValue: e.target.value } })}
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Email Address</label>
                  <input
                    type="text"
                    value={data?.hero?.emailValue || ''}
                    onChange={(e) => setData({ ...data, hero: { ...data?.hero, emailValue: e.target.value } })}
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <ImageUploader
                label={`Events Hero Background Image (${currentLangInfo.short})`}
                value={data?.hero?.heroImage || ''}
                onChange={(url) => setData({ ...data, hero: { ...data?.hero, heroImage: url } })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Event Packages ── */}
      {(activeSection === 'all' || activeSection === 'packages') && (
        <div id="section-packages" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Event Packages Section ({currentLangInfo.label})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                Section Eyebrow Tag ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.packages?.eyebrow || ''}
                onChange={(e) => setData({ ...data, packages: { ...data?.packages, eyebrow: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                Section Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.packages?.title || ''}
                onChange={(e) => setData({ ...data, packages: { ...data?.packages, title: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {Object.keys(data?.packages?.items || {}).map((pkgKey: string) => {
              const pkg = data.packages.items[pkgKey];
              return (
                <div key={pkgKey} className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2e8df] pb-2">
                    <span className="text-xs font-mono font-bold text-[#5b8045] uppercase">Package: {pkgKey}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Package Name</label>
                      <input
                        type="text"
                        value={pkg.name || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            packages: {
                              ...data.packages,
                              items: { ...data.packages.items, [pkgKey]: { ...pkg, name: e.target.value } },
                            },
                          })
                        }
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Guests Capacity Tag</label>
                      <input
                        type="text"
                        value={pkg.guests || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            packages: {
                              ...data.packages,
                              items: { ...data.packages.items, [pkgKey]: { ...pkg, guests: e.target.value } },
                            },
                          })
                        }
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-[#5b8045] font-mono">Package Features List</label>
                      <button
                        type="button"
                        onClick={() => handleAddPackageFeature(pkgKey)}
                        className="text-[10px] font-bold text-[#5b8045] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(pkg.features || []).map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat || ''}
                            onChange={(e) => handlePackageFeatureChange(pkgKey, fIdx, e.target.value)}
                            className="flex-1 bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePackageFeature(pkgKey, fIdx)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove Feature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ImageUploader
                    label={`Package Cover Image (${pkgKey})`}
                    value={pkg.img || ''}
                    onChange={(url) =>
                      setData({
                        ...data,
                        packages: {
                          ...data.packages,
                          items: { ...data.packages.items, [pkgKey]: { ...pkg, img: url } },
                        },
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Event Spaces ── */}
      {(activeSection === 'all' || activeSection === 'spaces') && (
        <div id="section-spaces" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
              <span>Event Spaces & Venues ({currentLangInfo.label})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                Section Eyebrow Tag ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.spaces?.eyebrow || ''}
                onChange={(e) => setData({ ...data, spaces: { ...data?.spaces, eyebrow: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1 font-mono">
                Section Title ({currentLangInfo.short})
              </label>
              <input
                type="text"
                value={data?.spaces?.title || ''}
                onChange={(e) => setData({ ...data, spaces: { ...data?.spaces, title: e.target.value } })}
                className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {Object.keys(data?.spaces?.items || {}).map((spaceKey: string) => {
              const space = data.spaces.items[spaceKey];
              return (
                <div key={spaceKey} className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2e8df] pb-2">
                    <span className="text-xs font-mono font-bold text-[#5b8045] uppercase">Space: {spaceKey}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Space Name</label>
                      <input
                        type="text"
                        value={space.name || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            spaces: {
                              ...data.spaces,
                              items: { ...data.spaces.items, [spaceKey]: { ...space, name: e.target.value } },
                            },
                          })
                        }
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Guest Capacity Tag</label>
                      <input
                        type="text"
                        value={space.guestTag || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            spaces: {
                              ...data.spaces,
                              items: { ...data.spaces.items, [spaceKey]: { ...space, guestTag: e.target.value } },
                            },
                          })
                        }
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Badge Highlight Tag</label>
                      <input
                        type="text"
                        value={space.badgeTag || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            spaces: {
                              ...data.spaces,
                              items: { ...data.spaces.items, [spaceKey]: { ...space, badgeTag: e.target.value } },
                            },
                          })
                        }
                        className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-[#5b8045] font-mono">Space Amenities / Features</label>
                      <button
                        type="button"
                        onClick={() => handleAddSpaceFeature(spaceKey)}
                        className="text-[10px] font-bold text-[#5b8045] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(space.features || []).map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat || ''}
                            onChange={(e) => handleSpaceFeatureChange(spaceKey, fIdx, e.target.value)}
                            className="flex-1 bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#5b8045]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpaceFeature(spaceKey, fIdx)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove Feature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ImageUploader
                    label={`Space Photo (${spaceKey})`}
                    value={space.img || ''}
                    onChange={(url) =>
                      setData({
                        ...data,
                        spaces: {
                          ...data.spaces,
                          items: { ...data.spaces.items, [spaceKey]: { ...space, img: url } },
                        },
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Promotions & Events List ── */}
      {(activeSection === 'all' || activeSection === 'promotions') && (
        <div id="section-promotions" className="bg-white border border-[#d6e0d0] rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1c2819] font-serif tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5b8045]" />
                <span>Special Promotions & Events List ({eventsArray.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-sans">
                Manage individual special event cards and promotional announcements.
              </p>
            </div>
            <button
              onClick={handleAddEvent}
              className="flex items-center gap-1.5 bg-[#5b8045]/10 text-[#5b8045] hover:bg-[#5b8045] hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#5b8045]/30 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </button>
          </div>

          <div className="space-y-4">
            {eventsArray.map((ev: any, idx: number) => (
              <div key={ev.id || idx} className="p-4 bg-[#f8faf6] border border-[#e2e8df] rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#e2e8df] pb-2">
                  <span className="text-xs font-mono font-bold text-[#5b8045]">Event Item #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveEvent(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Title ({currentLangInfo.short})</label>
                    <input
                      type="text"
                      value={ev.title || ''}
                      onChange={(e) => handleEventChange(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Category Tag</label>
                    <input
                      type="text"
                      value={ev.category || ''}
                      onChange={(e) => handleEventChange(idx, 'category', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Date / Schedule</label>
                    <input
                      type="text"
                      value={ev.date || ''}
                      onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Location / Branch</label>
                    <input
                      type="text"
                      value={ev.location || ''}
                      onChange={(e) => handleEventChange(idx, 'location', e.target.value)}
                      className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5b8045] mb-1 font-mono">Description ({currentLangInfo.short})</label>
                  <textarea
                    rows={2}
                    value={ev.description || ''}
                    onChange={(e) => handleEventChange(idx, 'description', e.target.value)}
                    className="w-full bg-white border border-[#e2e8df] text-[#212d1b] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#5b8045] resize-none"
                  />
                </div>

                <ImageUploader
                  label="Event Banner Image"
                  value={ev.image || ev.img || ''}
                  onChange={(url) => handleEventChange(idx, 'image', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
