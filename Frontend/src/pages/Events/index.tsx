import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CakeSlice,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Mail,
  Music2,
  PartyPopper,
  Phone,
  Sparkles,
  Truck,
  Utensils,
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEventsData } from '@/lib/api';

import './index.css';

import imgHero from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.png';
import imgFamily from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.png';
import imgEngagement from '@/assets/Event & Celebrations card-2.png';
import imgCatering from '@/assets/Event & Celebrations card 03.png';
import imgCorporate from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png';
import imgDining from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.png';
import imgCateringWide from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.png';
import avatarDavid from '@/assets/home-v2/fe0520650c912ce97eb0e3d39282dfb2ecb8c889.png';
import avatarSophea from '@/assets/home-v2/0f84921deb64774c6b9d8e0f6b9cd098e318d66b.png';
import avatarEmma from '@/assets/home-v2/7412cda8fb627eef4cb8c5bfb7f0e7c533dee647.png';

const imageMapper: Record<string, string> = {
  '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.png': imgHero,
  '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.png': imgFamily,
  '@/assets/Event & Celebrations card-2.png': imgEngagement,
  '@/assets/Event & Celebrations card 03.png': imgCatering,
  '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png': imgCorporate,
};

type EventPackage = {
  id: string;
  name: string;
  guests: string;
  price: string;
  image: string;
  features: string[];
};

type EventsData = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    backgroundImage: string;
  };
  contact: {
    title: string;
    hotlineLabel: string;
    hotline: string;
    emailLabel: string;
    email: string;
    policyLabel: string;
    policy: string;
  };
  packages: EventPackage[];
};

const spaces = [
  {
    name: 'VIP Room',
    guests: '8–12 guests',
    label: 'Best for Private Dinners',
    image: imgDining,
    features: ['Integrated AV system', 'Garden views', 'Personal butler service', 'Flexible table setup'],
  },
  {
    name: 'Private Room',
    guests: '12–20 guests',
    label: 'Best for Family Events',
    image: imgDining,
    features: ['Integrated AV system', 'Private entrance', 'Dedicated service team', 'Custom room layout'],
  },
  {
    name: 'Main Hall',
    guests: '50–120 guests',
    label: 'Best for Grand Events',
    image: imgHero,
    features: ['Stage and AV system', 'Flexible floor plan', 'Full catering service', 'Event coordinator'],
  },
];

const services = [
  { icon: BellRing, title: 'Wedding Packages', text: 'Traditional Khmer weddings with modern elegance.' },
  { icon: CakeSlice, title: 'Birthday Packages', text: 'Celebrate milestones with gourmet dining.' },
  { icon: BriefcaseBusiness, title: 'Corporate Events', text: 'Impress clients in professional luxury spaces.' },
  { icon: Truck, title: 'Catering Services', text: 'Fine dining Khmer cuisine delivered to you.' },
  { icon: Sparkles, title: 'Decoration Services', text: 'Customized themes by expert event designers.' },
  { icon: Utensils, title: 'Buffet Services', text: 'Extensive Khmer and international menu options.' },
  { icon: Music2, title: 'Live Music & Entertainment', text: 'Traditional Khmer and modern acoustics.' },
  { icon: CalendarDays, title: 'Event Planning Support', text: 'Full coordination from concept to cleanup.' },
  { icon: Camera, title: 'Photography & Videography', text: 'Capture every moment with professional teams.' },
];

const galleryItems = [
  { category: 'Wedding', image: imgHero, alt: 'Elegant wedding celebration hall' },
  { category: 'Engagement', image: imgEngagement, alt: 'Guests celebrating an engagement' },
  { category: 'Corporate', image: imgCateringWide, alt: 'Outdoor corporate catering setup' },
  { category: 'Birthday', image: imgFamily, alt: 'Family birthday gathering' },
  { category: 'Private Party', image: imgDining, alt: 'Private dining room' },
];

const testimonials = [
  { name: 'David Chen', date: '1 month ago', avatar: avatarDavid, quote: 'Authentic Khmer cuisine at its finest. The private room was perfect for our business meeting. Highly recommended!' },
  { name: 'Sophea Prak', date: '1 month ago', avatar: avatarSophea, quote: 'This restaurant brings back memories of my grandmother’s cooking. True authentic flavors and excellent service.' },
  { name: 'Emma Wilson', date: '1 week ago', avatar: avatarEmma, quote: 'Our event felt effortless from start to finish. Every detail was thoughtful and the team was wonderfully attentive.' },
  { name: 'Dara Lim', date: '3 weeks ago', avatar: avatarDavid, quote: 'A beautiful space, generous menu, and a team that genuinely cared about making our celebration special.' },
];

const faqs = [
  ['Can I decorate the room?', 'Yes, we offer custom decoration services, and we also allow external decorators upon prior approval and coordination with our event team.'],
  ['Do you provide catering?', 'Yes. We provide buffet, family-style, plated, and off-site catering menus tailored to your guest count.'],
  ['Can I bring my own cake?', 'Absolutely. You may bring a celebration cake, and our team can assist with storage, presentation, and serving.'],
  ['What is the minimum guest requirement?', 'Minimum guest counts vary by room and package, beginning at 8 guests for our private dining spaces.'],
  ['Do you offer wedding packages?', 'Yes. Our wedding packages can include venue hire, menus, decoration, entertainment, and a dedicated coordinator.'],
];

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={`events-section-heading${light ? ' events-section-heading-light' : ''}`}>
      <div className="events-eyebrow"><span />{eyebrow}<span /></div>
      <h2>{title}</h2>
    </div>
  );
}

export default function EventsPage() {
  const [data, setData] = useState<EventsData | null>(null);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    let mounted = true;
    getEventsData().then((eventsData) => mounted && setData(eventsData)).catch((error) => console.error('Failed to load events data:', error));
    return () => { mounted = false; };
  }, []);

  const visibleGallery = useMemo(
    () => galleryFilter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === galleryFilter),
    [galleryFilter],
  );

  if (!data) {
    return <main className="events-page"><section className="events-loading"><span className="events-loader" /><p>Preparing your event experience…</p></section></main>;
  }

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="events-page">
      <section className="events-hero" style={{ backgroundImage: `url(${imgHero})` }}>
        <div className="events-hero-shade" />
        <div className="events-hero-inner">
          <div className="events-hero-copy">
            <h1>{data.hero.title}</h1>
            <p>{data.hero.description}</p>
            <div className="events-hero-actions">
              <a href="#inquiry" className="events-button events-button-primary">{data.hero.primaryCta}</a>
              <a href={`mailto:${data.contact.email}`} className="events-button events-button-outline">{data.hero.secondaryCta}</a>
            </div>
          </div>
          <aside className="events-contact-card">
            <h2>{data.contact.title}</h2>
            {[
              [Clock3, data.contact.hotlineLabel, data.contact.hotline],
              [Mail, data.contact.emailLabel, data.contact.email],
              [FileText, data.contact.policyLabel, data.contact.policy],
            ].map(([Icon, label, value]) => {
              const ContactIcon = Icon as typeof Phone;
              return <div className="events-contact-row" key={String(label)}><span className="events-contact-icon"><ContactIcon size={17} /></span><span><small>{String(label)}</small><strong>{String(value)}</strong></span></div>;
            })}
          </aside>
        </div>
      </section>

      <section className="events-section events-packages-section">
        <SectionHeading eyebrow="Event Packages" title="Choose The Perfect Package" />
        <div className="events-package-grid">
          {data.packages.map((item) => (
            <article className="events-package-card" key={item.id}>
              <img src={imageMapper[item.image] || item.image} alt={item.name} />
              <div className="events-package-content">
                <span className="events-badge">{item.guests}</span>
                <h3>{item.name}</h3>
                <ul>{item.features.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
                <div className="events-package-footer"><span><small>Starting From</small><strong>{item.price}<em> / person</em></strong></span><a href="#inquiry" className="events-pill-link">Book Now</a></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="events-section events-spaces-section">
        <SectionHeading eyebrow="Event Spaces" title="Beautiful Spaces For Every Occasion" light />
        <div className="events-spaces-list">
          {spaces.map((space) => (
            <article className="events-space-card" key={space.name}>
              <img src={space.image} alt={space.name} />
              <div className="events-space-content">
                <div className="events-space-top"><span className="events-badge">{space.guests}</span><span className="events-space-label">{space.label}</span></div>
                <h3>{space.name}</h3>
                <ul>{space.features.map((feature) => <li key={feature}><Check size={12} />{feature}</li>)}</ul>
                <div className="events-space-actions"><a href="#inquiry" className="events-button events-button-primary">Reserve Space</a><a href="#services" className="events-pill-link">View Details</a></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="events-section events-services-section" id="services">
        <SectionHeading eyebrow="Event Services" title="Curated services for every detail" />
        <div className="events-service-grid">
          {services.map(({ icon: Icon, title, text }) => <article className="events-service-card" key={title}><span><Icon size={19} /></span><h3>{title}</h3><p>{text}</p><a href="#inquiry">Learn More</a></article>)}
        </div>
      </section>

      <section className="events-section events-gallery-section">
        <SectionHeading eyebrow="Our Moments" title="Moments We Are Proud Of" />
        <div className="events-gallery-filters" role="group" aria-label="Filter event gallery">
          {['All', 'Wedding', 'Corporate', 'Birthday', 'Engagement', 'Private Party'].map((filter) => <button type="button" key={filter} className={galleryFilter === filter ? 'active' : ''} onClick={() => setGalleryFilter(filter)}>{filter}</button>)}
        </div>
        <div className={`events-gallery-grid${visibleGallery.length === 1 ? ' events-gallery-grid-single' : ''}`}>
          {visibleGallery.map((item) => <figure key={`${item.category}-${item.alt}`}><img src={item.image} alt={item.alt} /><figcaption>{item.category}</figcaption></figure>)}
        </div>
        <Link to="/gallery" className="events-pill-link events-gallery-link">View Full Gallery</Link>
      </section>

      <section className="events-section events-testimonials-section">
        <SectionHeading eyebrow="Testimonials" title="What Our Guests Say" />
        <p className="events-section-subtitle">Experiences shared by our valued customers</p>
        <div className="events-testimonial-grid">
          {[0, 1, 2].map((offset) => testimonials[(testimonialIndex + offset) % testimonials.length]).map((item) => <article className="events-testimonial-card" key={`${testimonialIndex}-${item.name}`}><div className="events-stars">★★★★★</div><div className="events-quote">”</div><p>{item.quote}</p><div className="events-guest"><img src={item.avatar} alt="" /><span><strong>{item.name}</strong><small>{item.date}</small></span></div></article>)}
        </div>
        <div className="events-slider-controls"><button type="button" aria-label="Previous testimonials" onClick={() => setTestimonialIndex((value) => (value - 1 + testimonials.length) % testimonials.length)}><ArrowLeft size={16} /></button><span>{testimonials.map((_, index) => <i key={index} className={index === testimonialIndex ? 'active' : ''} />)}</span><button type="button" aria-label="Next testimonials" onClick={() => setTestimonialIndex((value) => (value + 1) % testimonials.length)}><ArrowRight size={16} /></button></div>
      </section>

      <section className="events-section events-inquiry-section" id="inquiry">
        <div className="events-inquiry-visual" style={{ backgroundImage: `url(${imgEngagement})` }}><div><PartyPopper size={26} /><h2>Let’s Create<br />Something<br />Amazing Together</h2><p>Whether it’s a small milestone or a lifetime commitment, we are here to bring your vision to life with Khmer warmth and modern luxury.</p></div></div>
        <form className="events-inquiry-form" onSubmit={submitInquiry}>
          <h2>Inquiry Form</h2>
          <div className="events-form-grid">
            <label>Full Name *<input name="name" required placeholder="Enter full name" /></label>
            <label>Phone Number *<input name="phone" type="tel" required placeholder="Enter phone number" /></label>
            <label>Company Name<input name="company" placeholder="Company name" /></label>
            <label>Email Address (Optional)<input name="email" type="email" placeholder="Enter email address" /></label>
            <label>Event Type<select name="eventType" defaultValue="Wedding"><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Engagement</option><option>Private Party</option></select></label>
            <label>Guests<input name="guests" type="number" min="1" placeholder="e.g. 150" /></label>
            <label className="events-form-wide">Special Requirements<textarea name="requirements" rows={4} placeholder="Tell us more about your event…" /></label>
          </div>
          <button className="events-button events-button-primary" type="submit">Submit Inquiry</button>
          {formSent && <p className="events-form-success" role="status">Thank you! Our event team will be in touch shortly.</p>}
        </form>
      </section>

      <section className="events-section events-faq-section">
        <SectionHeading eyebrow="Event Questions" title="Frequently Asked Questions" />
        <div className="events-faq-list">
          {faqs.map(([question, answer], index) => <div className={`events-faq-item${openFaq === index ? ' open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><ChevronDown size={17} /></button><div className="events-faq-answer"><p>{answer}</p></div></div>)}
        </div>
      </section>

      <section className="events-final-cta" style={{ backgroundImage: `url(${imgHero})` }}><div><h2>Ready To Plan Your Event?</h2><p>Tell us what you’re imagining. We’ll help bring every detail together.</p><div><a href="#inquiry" className="events-button events-button-primary">Plan Your Event</a><a href={`mailto:${data.contact.email}`} className="events-button events-button-outline">Call to Event Team</a></div></div></section>
    </main>
  );
}
