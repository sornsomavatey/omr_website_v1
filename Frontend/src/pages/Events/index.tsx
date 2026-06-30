import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Clock, FileText, Mail, Shield, Users } from 'lucide-react';

import FeaturePackageCard from '@/components/FeaturePackageCard';
import SectionHeader from '@/components/SectionHeader';
import EventSpaceCard from '@/components/EventSpaceCard';
import TestimonialSection from '@/components/TestimonialSection';


import imgHero     from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.png';
import imgPkg1     from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.png';
import imgPkg2     from '@/assets/Event & Celebrations card-2.png';
import imgPkg3     from '@/assets/Event & Celebrations card 03.png';
import imgPkg4     from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png';
import imgSpace1   from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.png';
import imgSpace2   from '@/assets/home-v2/e8f4b56e423777f3f6c3df39c6ef78914b278e17.png';
import imgGal1     from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.png';
import imgGal2     from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png';
import imgGal3     from '@/assets/home-v2/13a7aa4dee36d6ba805abc6f982eb04ec7df4c4c.png';
import imgGal4     from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.png';
import imgGal5     from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png';
import imgInquiry  from '@/assets/Weeding.png';
import imgFinalCta from '@/assets/Weeding.png';

import './index.css';


const packages = [
  {
    id: 'family',
    name: 'Family Celebration',
    guests: '8–12 guests',
    price: '$65',
    unit: '/ person',
    img: imgPkg1,
    features: ['Private VIP Room', 'Custom 6-Course Menu', 'Basic Table Decor', 'Dedicated Service Staff'],
  },
  {
    id: 'engagement',
    name: 'Engagement Package',
    guests: '30 guests',
    price: '$65',
    unit: '/ person',
    img: imgPkg2,
    features: ['Full Ballroom Access', 'Gourmet Buffet or Family Style', 'Premium Floral Decor', 'Traditional Live Music', 'Garden views'],
  },
  {
    id: 'catering',
    name: 'Catering Services',
    guests: '30+ guests',
    price: '$65',
    unit: '/ person',
    img: imgPkg3,
    features: ['Private VIP Room', 'Custom 6-Course Menu', 'Basic Table Decor', 'Dedicated Service Staff'],
  },
  {
    id: 'corporate',
    name: 'Corporate Package',
    guests: '8–80 guests',
    price: '$65',
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

const testimonials = [
  {
    text: 'The team at One More Restaurant made our wedding reception absolutely perfect. Every detail was taken care of and the food was outstanding.',
    name: 'Sopheak & Dara', role: 'Wedding Reception', stars: 5,
  },
  {
    text: 'We hosted our annual corporate dinner here and the experience was flawless. Professional staff, beautiful décor, and exceptional cuisine.',
    name: 'Chen Wei', role: 'Corporate Event', stars: 5,
  },
  {
    text: 'The private VIP suite was perfect for our family celebration. Intimate, elegant and the service was beyond our expectations.',
    name: 'Vannak Phal', role: 'Birthday Celebration', stars: 5,
  },
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
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const visibleGallery = galleryFilter === 'All'
    ? galleryItems
    : galleryItems.filter((g) => g.cat === galleryFilter);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSuccess(true);
    formRef.current?.reset();
    setTimeout(() => setFormSuccess(false), 5000);
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
            <h1 className="font-serif">Celebrate Every<br />Special Moment</h1>
            <p>
              From intimate gatherings to grand celebrations, One More Restaurant
              provides beautiful spaces, exceptional cuisine, and unforgettable experiences.
            </p>
            <div className="events-hero-actions">
              <a href="#inquiry" className="events-button events-button-primary">Plan Your Event</a>
              <a href="#inquiry" className="events-button events-button-outline">Contact Event Team</a>
            </div>
          </div>

          <div className="events-contact-card">
            <h2 className="font-serif">Event Contact Info</h2>
            <div className="events-contact-row">
              <span className="events-contact-icon"><Clock size={16} /></span>
              <div><small>Event Hotline</small><strong>+855 23 888 999</strong></div>
            </div>
            <div className="events-contact-row">
              <span className="events-contact-icon"><Mail size={16} /></span>
              <div><small>Email Inquiry</small><strong>events@onemorerestaurant.com</strong></div>
            </div>
            <div className="events-contact-row">
              <span className="events-contact-icon"><FileText size={16} /></span>
              <div><small>Reservation Policy</small><strong>Free cancellation up to 24h</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────── */}
      <section className="events-section events-packages-section">
        <SectionHeader
          eyebrow="Event Packages"
          title="Choose The Perfect Package"
        />

        <div className="events-package-grid">
          {packages.map((pkg) => (
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
          <div className="events-eyebrow"><span />Event Spaces<span /></div>
          <h2>Beautiful Spaces For Every Occasion</h2>
        </div>

        <div className="events-spaces-list">
          {spaces.map((space) => (
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
          <div className="events-eyebrow"><span />SERVICES<span /></div>
          <h2>Curated Services For Every Detail</h2>
        </div>

        <div className="events-service-grid">
          {services.map((svc) => (
            <div key={svc.title} className="events-service-card">
              <span>{svc.icon}</span>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
              <Link to={svc.link}>Learn more →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────── */}
      <section className="events-section events-gallery-section">
        <div className="events-section-heading">
          <div className="events-eyebrow"><span />GALLERY<span /></div>
          <h2>Moments We Are Proud Of</h2>
        </div>

        <div className="events-gallery-filters">
          {galleryFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={galleryFilter === f ? 'active' : ''}
              onClick={() => setGalleryFilter(f)}
            >
              {f}
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
          <Link to="/gallery" className="events-pill-link">View Full Gallery</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialSection
        eyebrow="REVIEWS"
        title="What Our Guests Say"
        description="Experiences shared by our valued customers"
        testimonials={testimonials}
      />

      {/* ── INQUIRY ─────────────────────────── */}
      <section id="inquiry">
        <div className="events-inquiry-section">
          <div
            className="events-inquiry-visual"
            style={{ backgroundImage: `url(${imgInquiry})` }}
          >
            <div>
              <h2 className="font-serif">Let's Create Something Amazing Together</h2>
              <p>
                Whether it's a small milestone or a lifetime commitment, we are here to bring your vision to life with Khmer warmth and modern luxury.
              </p>
            </div>
          </div>

          <div className="events-inquiry-form-container">
            <div className="events-inquiry-form">
              <h2 className="font-serif">Inquiry Form</h2>
              <form ref={formRef} onSubmit={handleFormSubmit}>
                <div className="events-form-grid">
                  <label>
                    Full Name *
                    <input type="text" placeholder="Enter full name" required />
                  </label>
                  <label>
                    Phone Number *
                    <input type="tel" placeholder="Enter phone number" required />
                  </label>
                  <label>
                    Company Name
                    <input type="text" placeholder="Company Name" />
                  </label>
                  <label>
                    Email Address (Optional)
                    <input type="email" placeholder="Enter email address" />
                  </label>
                  <label>
                    Event Type
                    <div className="events-select-wrapper">
                      <select defaultValue="Wedding">
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Private Dining">Private Dining</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={18} className="events-select-icon" />
                    </div>
                  </label>
                  <label>
                    Guests
                    <input type="number" min={1} placeholder="e.g. 150" />
                  </label>
                  <label className="events-form-wide">
                    Special Requirements
                    <textarea rows={4} placeholder="Tell us more about your event..." />
                  </label>
                </div>
                <button type="submit" className="events-inquiry-submit">
                  Submit Inquiry
                </button>
                {formSuccess && (
                  <p className="events-form-success">
                    ✓ Thank you! Our team will reach out within 24 hours.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section className="events-section events-faq-section">
        <div className="events-section-heading">
          <div className="events-eyebrow"><span />FAQ<span /></div>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="events-faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`events-faq-item${openFaq === i ? ' open' : ''}`}>
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <ChevronDown size={18} />
              </button>
              <div className="events-faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
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
            ONE MORE RESTAURANT
            <span style={{ background: 'rgba(255,255,255,.4)' }} />
          </p>
          <h2>Ready To Plan Your Event?</h2>
          <p>Contact our team today and let's bring your vision to life.</p>
          <div>
            <a href="#inquiry" className="events-button events-button-primary">Book Now</a>
            <Link to="/contact" className="events-button events-button-outline">Get In Touch</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
