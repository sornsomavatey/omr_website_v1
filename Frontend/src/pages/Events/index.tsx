import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, FileText, Mail, Shield, Users } from 'lucide-react';

import FeaturePackageCard from '@/components/FeaturePackageCard';
import SectionHeader from '@/components/SectionHeader';
import EventSpaceCard from '@/components/EventSpaceCard';
import TestimonialSection from '@/components/TestimonialSection';
import { createEventBooking, getTestimonialsData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';

import imgHero     from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp';
import imgPkg1     from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.webp';
import imgPkg2     from '@/assets/Event & Celebrations card-2.webp';
import imgPkg3     from '@/assets/Event & Celebrations card 03.webp';
import imgPkg4     from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import imgSpace1   from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp';
import imgSpace2   from '@/assets/home-v2/e8f4b56e423777f3f6c3df39c6ef78914b278e17.webp';
import imgGal1     from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.webp';
import imgGal2     from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.webp';
import imgGal3     from '@/assets/home-v2/13a7aa4dee36d6ba805abc6f982eb04ec7df4c4c.webp';
import imgGal4     from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp';
import imgGal5     from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import imgInquiry  from '@/assets/Weeding.webp';
import imgFinalCta from '@/assets/Weeding.webp';
import { imageMap } from '@/pages/Home/homeAssets';

import './index.css';

const packages = [
  {
    id: 'family',
    name: 'Family Celebration',
    guests: '8–12 guests',
    price: 'USD 65',
    unit: '/ person',
    img: imgPkg1,
    features: ['Private VIP Room', 'Custom 6-Course Menu', 'Basic Table Decor', 'Dedicated Service Staff'],
  },
  {
    id: 'engagement',
    name: 'Engagement Package',
    guests: '30 guests',
    price: 'USD 65',
    unit: '/ person',
    img: imgPkg2,
    features: ['Full Ballroom Access', 'Gourmet Buffet or Family Style', 'Premium Floral Decor', 'Traditional Live Music', 'Garden views'],
  },
  {
    id: 'catering',
    name: 'Catering Services',
    guests: '30+ guests',
    price: 'USD 65',
    unit: '/ person',
    img: imgPkg3,
    features: ['Private VIP Room', 'Custom 6-Course Menu', 'Basic Table Decor', 'Dedicated Service Staff'],
  },
  {
    id: 'corporate',
    name: 'Corporate Package',
    guests: '8–80 guests',
    price: 'USD 65',
    unit: '/ person',
    img: imgPkg4,
    features: ['Private Hall Access', 'Audio-Visual Equipment', 'Premium Working Lunch', 'Morning & Afternoon Coffee Breaks'],
  },
];

const spaces = [
  {
    id: 'vip',
    name: 'VIP Room',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgSpace2,
    features: ['Integrated AV system', 'Personal butler service', 'Garden views', 'Personal butler service'],
  },
  {
    id: 'private',
    name: 'Private Room',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgSpace1,
    features: ['Integrated AV system', 'Personal butler service', 'Garden views', 'Personal butler service'],
  },
  {
    id: 'main-hall',
    name: 'Main Hall',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgHero,
    features: ['Integrated AV system', 'Personal butler service', 'Garden views', 'Personal butler service'],
  },
];

const MusicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18V5l12-2v13M9 9l12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);
const DecorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 7l-7 5 7 5V7zM1 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>
  </svg>
);
const CateringIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
  </svg>
);

const services = [
  { icon: <Users size={20} />, title: 'Event Planning', desc: 'Our dedicated event coordinators work with you from concept to celebration, handling every detail with care.', link: '/contact' },
  { icon: <DecorIcon />, title: 'Floral & Décor', desc: 'Stunning floral arrangements and thematic décor to transform any space into your dream venue.', link: '/contact' },
  { icon: <MusicIcon />, title: 'Live Entertainment', desc: 'Traditional Khmer music, contemporary bands, and cultural performances for a truly memorable atmosphere.', link: '/contact' },
  { icon: <VideoIcon />, title: 'Photography', desc: 'Professional photography and videography packages to capture every precious moment of your special day.', link: '/contact' },
  { icon: <CateringIcon />, title: 'Custom Catering', desc: 'Bespoke menus crafted by our executive chefs, from traditional Khmer feasts to international cuisines.', link: '/menu' },
  { icon: <Shield size={20} />, title: 'Full Coordination', desc: 'On-the-day coordination service ensuring everything runs seamlessly from arrival to farewell.', link: '/contact' },
];

type GalleryFilter = 'All' | 'Wedding' | 'Corporate' | 'Birthday' | 'Private';
const galleryFilters: GalleryFilter[] = ['All', 'Wedding', 'Corporate', 'Birthday', 'Private'];
const galleryItems: { src: string; alt: string; caption: string; cat: Exclude<GalleryFilter, 'All'> }[] = [
  { src: imgGal1, alt: 'Outdoor catering event', caption: 'Garden Gathering', cat: 'Private' },
  { src: imgGal2, alt: 'Traditional Khmer dish', caption: 'Artisanal Plating', cat: 'Corporate' },
  { src: imgGal3, alt: 'Elegant dining setup', caption: 'Bridal Dinner', cat: 'Wedding' },
  { src: imgGal4, alt: 'Restaurant interior', caption: 'Venue Ambiance', cat: 'Corporate' },
  { src: imgGal5, alt: 'Grand dining hall', caption: 'Grand Ballroom', cat: 'Wedding' },
];

const faqs = [
  { q: 'How far in advance should I book my event?', a: 'We recommend booking at least 4–6 weeks in advance for smaller events and 3–6 months for large weddings or corporate functions. This ensures your preferred date and space are available.' },
  { q: 'What is your minimum guest count for private events?', a: 'Our private VIP suite accommodates 8–30 guests. The Grand Ballroom is ideal for 40–120 guests. For smaller intimate dinners, we can arrange semi-private sections starting from 6 guests.' },
  { q: 'Can I bring my own cake or decoration items?', a: 'Yes! You are welcome to bring your own cake and personal decorations. Our team will help set everything up at no additional charge. A small corkage fee may apply for external beverages.' },
  { q: 'What is the cancellation and deposit policy?', a: 'A 30% deposit secures your event date. Full cancellations made more than 14 days before the event receive a full deposit refund. Cancellations within 14 days forfeit the deposit.' },
  { q: 'Do you offer menu tasting sessions before the event?', a: 'Absolutely. We offer complimentary tasting sessions for groups of 4+ on package bookings. Our executive chef will personally guide you through the selected menu options.' },
];

// ── Sub-components ───────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return <div className="events-stars">{'★'.repeat(count)}</div>;
}

// ── Main ─────────────────────────────────────────────────────
export default function EventsPage() {
  const { t, getObject, isKhmer } = useTranslation();
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const packagesList = [
    {
      id: 'family',
      name: t('eventsPage.packages.items.family.name', undefined, packages[0].name),
      guests: t('eventsPage.packages.items.family.guests', undefined, packages[0].guests),
      price: 'USD 65',
      unit: t('eventsPage.packages.unit', undefined, '/ person'),
      img: imgPkg1,
      features: getObject<string[]>('eventsPage.packages.items.family.features', packages[0].features),
    },
    {
      id: 'engagement',
      name: t('eventsPage.packages.items.engagement.name', undefined, packages[1].name),
      guests: t('eventsPage.packages.items.engagement.guests', undefined, packages[1].guests),
      price: 'USD 65',
      unit: t('eventsPage.packages.unit', undefined, '/ person'),
      img: imgPkg2,
      features: getObject<string[]>('eventsPage.packages.items.engagement.features', packages[1].features),
    },
    {
      id: 'catering',
      name: t('eventsPage.packages.items.catering.name', undefined, packages[2].name),
      guests: t('eventsPage.packages.items.catering.guests', undefined, packages[2].guests),
      price: 'USD 65',
      unit: t('eventsPage.packages.unit', undefined, '/ person'),
      img: imgPkg3,
      features: getObject<string[]>('eventsPage.packages.items.catering.features', packages[2].features),
    },
    {
      id: 'corporate',
      name: t('eventsPage.packages.items.corporate.name', undefined, packages[3].name),
      guests: t('eventsPage.packages.items.corporate.guests', undefined, packages[3].guests),
      price: 'USD 65',
      unit: t('eventsPage.packages.unit', undefined, '/ person'),
      img: imgPkg4,
      features: getObject<string[]>('eventsPage.packages.items.corporate.features', packages[3].features),
    },
  ];

  const spacesList = [
    {
      id: 'vip',
      name: t('eventsPage.spaces.items.vip.name', undefined, spaces[0].name),
      guestTag: t('eventsPage.spaces.items.vip.guestTag', undefined, spaces[0].guestTag),
      badgeTag: t('eventsPage.spaces.items.vip.badgeTag', undefined, spaces[0].badgeTag),
      img: imgSpace2,
      features: getObject<string[]>('eventsPage.spaces.items.vip.features', spaces[0].features),
    },
    {
      id: 'private',
      name: t('eventsPage.spaces.items.private.name', undefined, spaces[1].name),
      guestTag: t('eventsPage.spaces.items.private.guestTag', undefined, spaces[1].guestTag),
      badgeTag: t('eventsPage.spaces.items.private.badgeTag', undefined, spaces[1].badgeTag),
      img: imgSpace1,
      features: getObject<string[]>('eventsPage.spaces.items.private.features', spaces[1].features),
    },
    {
      id: 'main-hall',
      name: t('eventsPage.spaces.items.main-hall.name', undefined, spaces[2].name),
      guestTag: t('eventsPage.spaces.items.main-hall.guestTag', undefined, spaces[2].guestTag),
      badgeTag: t('eventsPage.spaces.items.main-hall.badgeTag', undefined, spaces[2].badgeTag),
      img: imgHero,
      features: getObject<string[]>('eventsPage.spaces.items.main-hall.features', spaces[2].features),
    },
  ];

  const servicesList = [
    { icon: <Users size={20} />, title: t('eventsPage.services.items.planning.title', undefined, services[0].title), desc: t('eventsPage.services.items.planning.desc', undefined, services[0].desc), link: '/contact' },
    { icon: <DecorIcon />, title: t('eventsPage.services.items.decor.title', undefined, services[1].title), desc: t('eventsPage.services.items.decor.desc', undefined, services[1].desc), link: '/contact' },
    { icon: <MusicIcon />, title: t('eventsPage.services.items.music.title', undefined, services[2].title), desc: t('eventsPage.services.items.music.desc', undefined, services[2].desc), link: '/contact' },
    { icon: <VideoIcon />, title: t('eventsPage.services.items.photo.title', undefined, services[3].title), desc: t('eventsPage.services.items.photo.desc', undefined, services[3].desc), link: '/contact' },
    { icon: <CateringIcon />, title: t('eventsPage.services.items.catering.title', undefined, services[4].title), desc: t('eventsPage.services.items.catering.desc', undefined, services[4].desc), link: '/menu' },
    { icon: <Shield size={20} />, title: t('eventsPage.services.items.coordination.title', undefined, services[5].title), desc: t('eventsPage.services.items.coordination.desc', undefined, services[5].desc), link: '/contact' },
  ];

  const translatedGalleryItems = galleryItems.map(item => ({
    ...item,
    caption: t(`eventsPage.gallery.captions.${item.caption}`, undefined, item.caption)
  }));

  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);

  useEffect(() => {
    getTestimonialsData()
      .then((res) => {
        const items = (res || []).map((item: any) => ({
          ...item,
          ...(isKhmer ? item.translations?.kh : {}),
          avatar: imageMap[item.avatar] || item.avatar,
        }));
        setTestimonialsList(items);
      })
      .catch((err) => console.error(err));
  }, [isKhmer]);

  const faqsList = getObject<any[]>('eventsPage.faq.items', faqs);

  const visibleGallery = galleryFilter === 'All'
    ? translatedGalleryItems
    : translatedGalleryItems.filter((g) => g.cat === galleryFilter);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;
    const emailInput = formData.get('email') as string;
    const event_type = formData.get('event_type') as string;
    const guest_count = Number(formData.get('guest_count') || 1);
    const special_requirements = formData.get('special_requirements') as string;

    // Construct valid payload
    const email = emailInput || 'noemail@onemore.com';
    const event_date = new Date().toISOString().split('T')[0]; // Current date

    const package_details = [
      company ? `Company Name: ${company}` : '',
      special_requirements ? `Requirements: ${special_requirements}` : ''
    ].filter(Boolean).join('\n') || 'None';

    try {
      await createEventBooking({
        name,
        email,
        phone,
        event_type,
        guest_count,
        event_date,
        package_details
      });
      setFormSuccess(true);
      formRef.current.reset();
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit inquiry. Please try again.');
    }
  }

  return (
    <main className="events-page">


      {/* ── HERO ────────────────────────────── */}
      <section
        className="events-hero"
        id="events-hero"
        style={{ backgroundImage: `url(${imgHero})` }}
      >
        <div className="events-hero-shade" />
        <div className="events-hero-inner">
          <div className="events-hero-copy">
            <h1 className="page-hero-title font-serif">
              {t('eventsPage.hero.title', undefined, 'Celebrate Every\nSpecial Moment').split('\n').map((line, idx) => (
                <span className="events-hero-title-line" key={idx}>{line}</span>
              ))}
            </h1>
            <p>
              {t('eventsPage.hero.desc', undefined, 'From intimate gatherings to grand celebrations, One More Restaurant provides beautiful spaces, exceptional cuisine, and unforgettable experiences.')}
            </p>
            <div className="events-hero-actions">
              <a href="#inquiry" className="events-button events-button-primary">
                {t('eventsPage.hero.planCta', undefined, 'Plan Your Event')}
              </a>
              <a href="#inquiry" className="events-button events-button-outline">
                {t('eventsPage.hero.contactCta', undefined, 'Contact Event Team')}
              </a>
            </div>
          </div>

          <div className="events-contact-card">
            <h2 className="font-serif">{t('eventsPage.hero.contactInfo', undefined, 'Event Contact Info')}</h2>
            <div className="events-contact-row">
              <span className="events-contact-icon"><Clock size={16} /></span>
              <div>
                <small>{t('eventsPage.hero.hotline', undefined, 'Event Hotline')}</small>
                <strong>+855 23 888 999</strong>
              </div>
            </div>
            <div className="events-contact-row">
              <span className="events-contact-icon"><Mail size={16} /></span>
              <div>
                <small>{t('eventsPage.hero.email', undefined, 'Email Inquiry')}</small>
                <strong>events@onemorerestaurant.com</strong>
              </div>
            </div>
            <div className="events-contact-row">
              <span className="events-contact-icon"><FileText size={16} /></span>
              <div>
                <small>{t('eventsPage.hero.policyLabel', undefined, 'Reservation Policy')}</small>
                <strong>{t('eventsPage.hero.policyValue', undefined, 'Free cancellation up to 24h')}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────── */}
      <section className="events-section events-packages-section">
        <SectionHeader
          eyebrow={t('eventsPage.packages.eyebrow', undefined, 'Event Packages')}
          title={t('eventsPage.packages.title', undefined, 'Choose The Perfect Package')}
        />

        <div className="events-package-grid">
          {packagesList.map((pkg) => (
            <FeaturePackageCard
              key={pkg.id}
              image={pkg.img}
              alt={pkg.name}
              title={pkg.name}
              guestLabel={pkg.guests}
              features={pkg.features}
              price={pkg.price}
              priceUnit={pkg.unit}
              bookHref="#inquiry"
            />
          ))}
        </div>
      </section>

      {/* ── SPACES ──────────────────────────── */}
      <section className="events-section events-spaces-section" id="spaces">
        <div className="events-section-heading events-section-heading-light">
          <div className="events-eyebrow"><span />{t('eventsPage.spaces.eyebrow', undefined, 'Event Spaces')}<span /></div>
          <h2>{t('eventsPage.spaces.title', undefined, 'Beautiful Spaces For Every Occasion')}</h2>
        </div>

        <div className="events-spaces-list">
          {spacesList.map((space) => (
            <EventSpaceCard
              key={space.id}
              id={space.id}
              name={space.name}
              guestTag={space.guestTag}
              badgeTag={space.badgeTag}
              image={space.img}
              features={space.features}
            />
          ))}
        </div>
      </section>

      {/* ── SERVICES ────────────────────────── */}
      <section className="events-section events-services-section">
        <div className="events-section-heading">
          <div className="events-eyebrow"><span />{t('eventsPage.services.eyebrow', undefined, 'SERVICES')}<span /></div>
          <h2 className={isKhmer ? 'events-services-title-khmer' : undefined}>
            {t('eventsPage.services.title', undefined, 'Curated Services For Every Detail')}
          </h2>
        </div>

        <div className="events-service-grid">
          {servicesList.map((svc) => (
            <div key={svc.title} className="events-service-card">
              <span>{svc.icon}</span>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────── */}
      <section className="events-section events-gallery-section">
        <div className="events-section-heading">
          <div className="events-eyebrow"><span />{t('eventsPage.gallery.eyebrow', undefined, 'GALLERY')}<span /></div>
          <h2>{t('eventsPage.gallery.title', undefined, 'Moments We Are Proud Of')}</h2>
        </div>

        <div className="events-gallery-filters">
          {galleryFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={galleryFilter === f ? 'active' : ''}
              onClick={() => setGalleryFilter(f)}
            >
              {t(`eventsPage.gallery.filters.${f}`, undefined, f)}
            </button>
          ))}
        </div>

        <div className={`events-gallery-grid${visibleGallery.length === 1 ? ' events-gallery-grid-single' : ''}`}>
          {visibleGallery.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="events-gallery-link">
          <Link to="/gallery" className="events-pill-link">
            {t('eventsPage.gallery.viewFull', undefined, 'View Full Gallery')}
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialSection
        eyebrow={t('home.testimonials.eyebrow', undefined, 'Testimonials')}
        title={t('home.testimonials.title', undefined, 'What Our Guests Say')}
        description={t('home.testimonials.description', undefined, 'Experiences shared by our valued customers.')}
        testimonials={testimonialsList}
        isKhmer={isKhmer}
      />

      {/* ── INQUIRY ─────────────────────────── */}
      <section id="inquiry">
        <div className="events-inquiry-section">
          <div
            className="events-inquiry-visual"
            style={{ backgroundImage: `url(${imgInquiry})` }}
          >
            <div>
              <h2 className="font-serif">
                {t('eventsPage.inquiry.visual.title', undefined, "Let's Create Something Amazing Together")}
              </h2>
              <p>
                {t('eventsPage.inquiry.visual.desc', undefined, 'Whether it is a small milestone or a lifetime commitment, we are here to bring your vision to life with Khmer warmth and modern luxury.')}
              </p>
            </div>
          </div>

          <div className="events-inquiry-form-container">
            <div className="events-inquiry-form">
              <h2 className="font-serif">{t('eventsPage.inquiry.form.title', undefined, 'Inquiry Form')}</h2>
              <form ref={formRef} onSubmit={handleFormSubmit}>
                <div className="events-form-grid">
                  <label>
                    {t('eventsPage.inquiry.form.labels.name', undefined, 'Full Name *')}
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={t('eventsPage.inquiry.form.placeholders.name', undefined, 'Enter full name')}
                      required
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.phone', undefined, 'Phone Number *')}
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('eventsPage.inquiry.form.placeholders.phone', undefined, 'Enter phone number')}
                      required
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.company', undefined, 'Company Name')}
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={t('eventsPage.inquiry.form.placeholders.company', undefined, 'Company Name')}
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.email', undefined, 'Email Address (Optional)')}
                    <input
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder={t('eventsPage.inquiry.form.placeholders.email', undefined, 'Enter email address')}
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.eventType', undefined, 'Event Type')}
                    <div className="events-select-wrapper">
                      <select name="event_type" defaultValue="Wedding">
                        <option value="Wedding">{t('eventsPage.inquiry.form.eventTypes.Wedding', undefined, 'Wedding')}</option>
                        <option value="Birthday">{t('eventsPage.inquiry.form.eventTypes.Birthday', undefined, 'Birthday')}</option>
                        <option value="Corporate Event">{t('eventsPage.inquiry.form.eventTypes.Corporate Event', undefined, 'Corporate Event')}</option>
                        <option value="Engagement">{t('eventsPage.inquiry.form.eventTypes.Engagement', undefined, 'Engagement')}</option>
                        <option value="Private Dining">{t('eventsPage.inquiry.form.eventTypes.Private Dining', undefined, 'Private Dining')}</option>
                        <option value="Other">{t('eventsPage.inquiry.form.eventTypes.Other', undefined, 'Other')}</option>
                      </select>
                      <ChevronDown size={18} className="events-select-icon" />
                    </div>
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.guests', undefined, 'Guests')}
                    <input
                      name="guest_count"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder={t('eventsPage.inquiry.form.placeholders.guests', undefined, 'e.g. 150')}
                      required
                    />
                  </label>
                  <label className="events-form-wide">
                    {t('eventsPage.inquiry.form.labels.requirements', undefined, 'Special Requirements')}
                    <textarea
                      name="special_requirements"
                      rows={4}
                      placeholder={t('eventsPage.inquiry.form.placeholders.requirements', undefined, 'Tell us more about your event...')}
                    />
                  </label>
                </div>
                <button type="submit" className="events-inquiry-submit">
                  {t('eventsPage.inquiry.form.submit', undefined, 'Submit Inquiry')}
                </button>
                {formSuccess && (
                  <p className="events-form-success">
                    {t('eventsPage.inquiry.form.success', undefined, '✓ Thank you! Our team will reach out within 24 hours.')}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section className="faq-section events-faq-section" aria-labelledby="events-faq-section-title">
        <div className="faq-container">
          <span className="faq-eyebrow">{t('eventsPage.faq.eyebrow', undefined, 'FAQ')}</span>
          <h2 id="events-faq-section-title" className="faq-title font-serif">
            {t('eventsPage.faq.title', undefined, 'Frequently Asked Questions')}
          </h2>

          <div className="faq-list">
            {faqsList.map((faq, i) => {
              const isExpanded = openFaq === i;

              return (
                <div key={i} className={`faq-item ${isExpanded ? 'faq-item-expanded' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isExpanded ? null : i)}
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="faq-arrow" />
                    ) : (
                      <ChevronDown className="faq-arrow" />
                    )}
                  </button>
                  <div className={`faq-answer-wrapper ${isExpanded ? 'faq-answer-expanded' : ''}`}>
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────── */}
      <section
        className="events-final-cta"
        style={{ backgroundImage: `url(${imgFinalCta})` }}
      >
        <div>
          <p className="events-eyebrow" style={{ color: 'rgba(255,255,255,.7)', fontSize: 11 }}>
            <span style={{ background: 'rgba(255,255,255,.4)' }} />
            {t('eventsPage.finalCta.eyebrow', undefined, 'ONE MORE RESTAURANT')}
            <span style={{ background: 'rgba(255,255,255,.4)' }} />
          </p>
          <h2>{t('eventsPage.finalCta.title', undefined, 'Ready To Plan Your Event?')}</h2>
          <p>{t('eventsPage.finalCta.desc', undefined, 'Contact our team today and let\'s bring your vision to life.')}</p>
          <div>
            <a href="#inquiry" className="events-button events-button-primary">
              {t('eventsPage.finalCta.bookNow', undefined, 'Book Now')}
            </a>
            <Link to="/reservations" className="events-button events-button-outline">
              {t('eventsPage.finalCta.getInTouch', undefined, 'Get In Touch')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
