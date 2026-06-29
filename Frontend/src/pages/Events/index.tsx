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

import { useTranslation } from '@/hooks/useTranslation';
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

const khmerContent = {
  packages: [
    ['កម្មវិធីជួបជុំគ្រួសារ', '៨–១២ នាក់', ['បន្ទប់ VIP ឯកជន', 'មុខម្ហូប ៦ វគ្គតាមតម្រូវការ', 'ការតុបតែងតុជាមូលដ្ឋាន', 'បុគ្គលិកបម្រើផ្ទាល់']],
    ['កញ្ចប់ពិធីភ្ជាប់ពាក្យ', '៨–១២ នាក់', ['ប្រើប្រាស់សាលទាំងមូល', 'អាហារប៊ូហ្វេ ឬបែបគ្រួសារ', 'ការតុបតែងផ្កាប្រណីត', 'តន្ត្រីប្រពៃណីផ្ទាល់', 'ទិដ្ឋភាពសួនច្បារ']],
    ['សេវាកម្មម្ហូបអាហារ', '៨–១២ នាក់', ['បន្ទប់ VIP ឯកជន', 'មុខម្ហូប ៦ វគ្គតាមតម្រូវការ', 'ការតុបតែងតុជាមូលដ្ឋាន', 'បុគ្គលិកបម្រើផ្ទាល់']],
    ['កញ្ចប់កម្មវិធីក្រុមហ៊ុន', '៨–១២ នាក់', ['ប្រើប្រាស់សាលឯកជន', 'ឧបករណ៍សោតទស្សន៍', 'អាហារថ្ងៃត្រង់កម្រិតខ្ពស់', 'អាហារសម្រន់ និងកាហ្វេពេលព្រឹកនិងរសៀល']],
  ] as [string, string, string[]][],
  spaces: [
    ['បន្ទប់ VIP', '៨–១២ នាក់', 'ស័ក្តិសមសម្រាប់អាហារឯកជន', ['ប្រព័ន្ធសោតទស្សន៍', 'ទិដ្ឋភាពសួនច្បារ', 'អ្នកបម្រើផ្ទាល់', 'ការរៀបចំតុបត់បែន']],
    ['បន្ទប់ឯកជន', '១២–២០ នាក់', 'ស័ក្តិសមសម្រាប់កម្មវិធីគ្រួសារ', ['ប្រព័ន្ធសោតទស្សន៍', 'ច្រកចូលឯកជន', 'ក្រុមបម្រើផ្ទាល់', 'ការរៀបចំបន្ទប់តាមតម្រូវការ']],
    ['សាលធំ', '៥០–១២០ នាក់', 'ស័ក្តិសមសម្រាប់កម្មវិធីធំៗ', ['ឆាក និងប្រព័ន្ធសោតទស្សន៍', 'ប្លង់បត់បែន', 'សេវាម្ហូបអាហារពេញលេញ', 'អ្នកសម្របសម្រួលកម្មវិធី']],
  ] as [string, string, string, string[]][],
  services: [
    ['កញ្ចប់មង្គលការ', 'ពិធីមង្គលការខ្មែរបែបប្រពៃណីជាមួយភាពប្រណីតទំនើប។'], ['កញ្ចប់ខួបកំណើត', 'អបអរពេលវេលាពិសេសជាមួយអាហារដ៏ប្រណីត។'],
    ['កម្មវិធីក្រុមហ៊ុន', 'បង្កើតចំណាប់អារម្មណ៍ដល់អតិថិជនក្នុងទីកន្លែងប្រកបដោយវិជ្ជាជីវៈ។'], ['សេវាកម្មម្ហូបអាហារ', 'ម្ហូបខ្មែរដ៏ប្រណីតដឹកជូនដល់អ្នក។'],
    ['សេវាតុបតែង', 'ប្រធានបទតាមតម្រូវការដោយអ្នករចនាកម្មវិធីជំនាញ។'], ['សេវាប៊ូហ្វេ', 'ជម្រើសម្ហូបខ្មែរ និងអន្តរជាតិដ៏សម្បូរបែប។'],
    ['តន្ត្រី និងការកម្សាន្តផ្ទាល់', 'តន្ត្រីប្រពៃណីខ្មែរ និងសម័យទំនើប។'], ['ជំនួយរៀបចំកម្មវិធី', 'ការសម្របសម្រួលពេញលេញចាប់ពីគំនិតរហូតដល់បញ្ចប់។'],
    ['ការថតរូប និងវីដេអូ', 'រក្សាទុកគ្រប់ពេលវេលាជាមួយក្រុមជំនាញ។'],
  ],
  gallery: [['មង្គលការ', 'សាលមង្គលការដ៏ប្រណីត'], ['ពិធីភ្ជាប់ពាក្យ', 'ភ្ញៀវកំពុងអបអរពិធីភ្ជាប់ពាក្យ'], ['កម្មវិធីក្រុមហ៊ុន', 'ការរៀបចំម្ហូបអាហារក្រុមហ៊ុនខាងក្រៅ'], ['ខួបកំណើត', 'ការជួបជុំខួបកំណើតគ្រួសារ'], ['កម្មវិធីឯកជន', 'បន្ទប់ទទួលទានអាហារឯកជន']],
  testimonials: [
    ['ដេវីដ ចិន', '១ ខែមុន', 'ម្ហូបខ្មែរពិតប្រាកដដ៏ល្អឥតខ្ចោះ។ បន្ទប់ឯកជនស័ក្តិសមបំផុតសម្រាប់ការប្រជុំអាជីវកម្មរបស់យើង។'],
    ['សុភា ប្រាក់', '១ ខែមុន', 'ភោជនីយដ្ឋាននេះធ្វើឱ្យខ្ញុំនឹកឃើញម្ហូបរបស់ជីដូន។ រសជាតិពិតប្រាកដ និងសេវាកម្មល្អឥតខ្ចោះ។'],
    ['អេម៉ា វីលសុន', '១ សប្តាហ៍មុន', 'កម្មវិធីរបស់យើងប្រព្រឹត្តទៅយ៉ាងរលូនតាំងពីដើមដល់ចប់។ ក្រុមការងារយកចិត្តទុកដាក់យ៉ាងខ្លាំង។'],
    ['ដារ៉ា លឹម', '៣ សប្តាហ៍មុន', 'ទីកន្លែងស្រស់ស្អាត មុខម្ហូបសម្បូរបែប និងក្រុមការងារដែលយកចិត្តទុកដាក់ចំពោះកម្មវិធីរបស់យើង។'],
  ],
  faqs: [
    ['តើខ្ញុំអាចតុបតែងបន្ទប់បានទេ?', 'បាន។ យើងផ្តល់សេវាតុបតែងតាមតម្រូវការ និងអនុញ្ញាតឱ្យអ្នកតុបតែងខាងក្រៅចូលរៀបចំដោយមានការយល់ព្រមជាមុន។'],
    ['តើមានសេវាម្ហូបអាហារដែរឬទេ?', 'មាន។ យើងផ្តល់អាហារប៊ូហ្វេ បែបគ្រួសារ ជាវគ្គ និងសេវាក្រៅទីតាំងតាមចំនួនភ្ញៀវ។'],
    ['តើខ្ញុំអាចយកនំផ្ទាល់ខ្លួនមកបានទេ?', 'បាន។ ក្រុមការងាររបស់យើងអាចជួយរក្សាទុក រៀបចំ និងបម្រើនំរបស់អ្នក។'],
    ['តើតម្រូវការភ្ញៀវអប្បបរមាគឺប៉ុន្មាន?', 'ចំនួនអប្បបរមាអាស្រ័យលើបន្ទប់ និងកញ្ចប់ ដោយចាប់ផ្តើមពី ៨ នាក់សម្រាប់បន្ទប់ឯកជន។'],
    ['តើមានកញ្ចប់មង្គលការដែរឬទេ?', 'មាន។ កញ្ចប់អាចរួមមានទីកន្លែង មុខម្ហូប ការតុបតែង ការកម្សាន្ត និងអ្នកសម្របសម្រួលផ្ទាល់។'],
  ],
};

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={`events-section-heading${light ? ' events-section-heading-light' : ''}`}>
      <div className="events-eyebrow"><span />{eyebrow}<span /></div>
      <h2>{title}</h2>
    </div>
  );
}

export default function EventsPage() {
  const { isKhmer } = useTranslation();
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

  const localizedSpaces = isKhmer ? spaces.map((item, index) => ({ ...item, name: khmerContent.spaces[index][0], guests: khmerContent.spaces[index][1], label: khmerContent.spaces[index][2], features: khmerContent.spaces[index][3] })) : spaces;
  const localizedServices = isKhmer ? services.map((item, index) => ({ ...item, title: khmerContent.services[index][0], text: khmerContent.services[index][1] })) : services;
  const localizedGallery = isKhmer ? galleryItems.map((item, index) => ({ ...item, category: khmerContent.gallery[index][0], alt: khmerContent.gallery[index][1] })) : galleryItems;
  const localizedTestimonials = isKhmer ? testimonials.map((item, index) => ({ ...item, name: khmerContent.testimonials[index][0], date: khmerContent.testimonials[index][1], quote: khmerContent.testimonials[index][2] })) : testimonials;
  const galleryFilters = ['All', 'Wedding', 'Corporate', 'Birthday', 'Engagement', 'Private Party'];
  const khmerFilters = ['ទាំងអស់', 'មង្គលការ', 'កម្មវិធីក្រុមហ៊ុន', 'ខួបកំណើត', 'ពិធីភ្ជាប់ពាក្យ', 'កម្មវិធីឯកជន'];

  const visibleGallery = useMemo(
    () => galleryFilter === 'All' ? localizedGallery : localizedGallery.filter((_, index) => galleryItems[index].category === galleryFilter),
    [galleryFilter, isKhmer],
  );

  if (!data) {
    return <main className="events-page"><section className="events-loading"><span className="events-loader" /><p>{isKhmer ? 'កំពុងរៀបចំបទពិសោធន៍កម្មវិធីរបស់អ្នក…' : 'Preparing your event experience…'}</p></section></main>;
  }

  const localizedPackages = isKhmer ? data.packages.map((item, index) => ({ ...item, name: khmerContent.packages[index][0], guests: khmerContent.packages[index][1], features: khmerContent.packages[index][2] })) : data.packages;

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
            <h1>{isKhmer ? 'អបអរគ្រប់ពេលវេលាពិសេស' : data.hero.title}</h1>
            <p>{isKhmer ? 'ចាប់ពីការជួបជុំដ៏ស្និទ្ធស្នាលរហូតដល់ពិធីដ៏ធំ ភោជនីយដ្ឋាន វ័នម័រ ផ្តល់ជូនទីកន្លែងដ៏ស្រស់ស្អាត ម្ហូបអាហារពិសេស និងបទពិសោធន៍ដែលមិនអាចបំភ្លេចបាន។' : data.hero.description}</p>
            <div className="events-hero-actions">
              <a href="#inquiry" className="events-button events-button-primary">{isKhmer ? 'រៀបចំកម្មវិធីរបស់អ្នក' : data.hero.primaryCta}</a>
              <a href={`mailto:${data.contact.email}`} className="events-button events-button-outline">{isKhmer ? 'ទាក់ទងក្រុមកម្មវិធី' : data.hero.secondaryCta}</a>
            </div>
          </div>
          <aside className="events-contact-card">
            <h2>{isKhmer ? 'ព័ត៌មានទំនាក់ទំនងកម្មវិធី' : data.contact.title}</h2>
            {[
              [Clock3, isKhmer ? 'លេខទូរស័ព្ទកម្មវិធី' : data.contact.hotlineLabel, data.contact.hotline],
              [Mail, isKhmer ? 'អ៊ីមែលសាកសួរ' : data.contact.emailLabel, data.contact.email],
              [FileText, isKhmer ? 'គោលការណ៍កក់' : data.contact.policyLabel, isKhmer ? 'លុបចោលដោយឥតគិតថ្លៃមុន ២៤ ម៉ោង' : data.contact.policy],
            ].map(([Icon, label, value]) => {
              const ContactIcon = Icon as typeof Phone;
              return <div className="events-contact-row" key={String(label)}><span className="events-contact-icon"><ContactIcon size={17} /></span><span><small>{String(label)}</small><strong>{String(value)}</strong></span></div>;
            })}
          </aside>
        </div>
      </section>

      <section className="events-section events-packages-section">
        <SectionHeading eyebrow={isKhmer ? 'កញ្ចប់កម្មវិធី' : 'Event Packages'} title={isKhmer ? 'ជ្រើសរើសកញ្ចប់ដ៏ស័ក្តិសម' : 'Choose The Perfect Package'} />
        <div className="events-package-grid">
          {localizedPackages.map((item) => (
            <article className="events-package-card" key={item.id}>
              <img src={imageMapper[item.image] || item.image} alt={item.name} />
              <div className="events-package-content">
                <span className="events-badge">{item.guests}</span>
                <h3>{item.name}</h3>
                <ul>{item.features.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
                <div className="events-package-footer"><span><small>{isKhmer ? 'ចាប់ពី' : 'Starting From'}</small><strong>{item.price}<em>{isKhmer ? ' / ម្នាក់' : ' / person'}</em></strong></span><a href="#inquiry" className="events-pill-link">{isKhmer ? 'កក់ឥឡូវនេះ' : 'Book Now'}</a></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="events-section events-spaces-section">
        <SectionHeading eyebrow={isKhmer ? 'ទីកន្លែងកម្មវិធី' : 'Event Spaces'} title={isKhmer ? 'ទីកន្លែងដ៏ស្រស់ស្អាតសម្រាប់គ្រប់ឱកាស' : 'Beautiful Spaces For Every Occasion'} light />
        <div className="events-spaces-list">
          {localizedSpaces.map((space) => (
            <article className="events-space-card" key={space.name}>
              <img src={space.image} alt={space.name} />
              <div className="events-space-content">
                <div className="events-space-top"><span className="events-badge">{space.guests}</span><span className="events-space-label">{space.label}</span></div>
                <h3>{space.name}</h3>
                <ul>{space.features.map((feature) => <li key={feature}><Check size={12} />{feature}</li>)}</ul>
                <div className="events-space-actions"><a href="#inquiry" className="events-button events-button-primary">{isKhmer ? 'កក់ទីកន្លែង' : 'Reserve Space'}</a><a href="#services" className="events-pill-link">{isKhmer ? 'មើលព័ត៌មានលម្អិត' : 'View Details'}</a></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="events-section events-services-section" id="services">
        <SectionHeading eyebrow={isKhmer ? 'សេវាកម្មកម្មវិធី' : 'Event Services'} title={isKhmer ? 'សេវាកម្មរៀបចំយ៉ាងយកចិត្តទុកដាក់គ្រប់ផ្នែក' : 'Curated services for every detail'} />
        <div className="events-service-grid">
          {localizedServices.map(({ icon: Icon, title, text }) => <article className="events-service-card" key={title}><span><Icon size={19} /></span><h3>{title}</h3><p>{text}</p><a href="#inquiry">{isKhmer ? 'ស្វែងយល់បន្ថែម' : 'Learn More'}</a></article>)}
        </div>
      </section>

      <section className="events-section events-gallery-section">
        <SectionHeading eyebrow={isKhmer ? 'ពេលវេលារបស់យើង' : 'Our Moments'} title={isKhmer ? 'ពេលវេលាដែលយើងមានមោទនភាព' : 'Moments We Are Proud Of'} />
        <div className="events-gallery-filters" role="group" aria-label={isKhmer ? 'ចម្រាញ់វិចិត្រសាលកម្មវិធី' : 'Filter event gallery'}>
          {galleryFilters.map((filter, index) => <button type="button" key={filter} className={galleryFilter === filter ? 'active' : ''} onClick={() => setGalleryFilter(filter)}>{isKhmer ? khmerFilters[index] : filter}</button>)}
        </div>
        <div className={`events-gallery-grid${visibleGallery.length === 1 ? ' events-gallery-grid-single' : ''}`}>
          {visibleGallery.map((item) => <figure key={`${item.category}-${item.alt}`}><img src={item.image} alt={item.alt} /><figcaption>{item.category}</figcaption></figure>)}
        </div>
        <Link to="/gallery" className="events-pill-link events-gallery-link">{isKhmer ? 'មើលវិចិត្រសាលទាំងមូល' : 'View Full Gallery'}</Link>
      </section>

      <section className="events-section events-testimonials-section">
        <SectionHeading eyebrow={isKhmer ? 'ការវាយតម្លៃ' : 'Testimonials'} title={isKhmer ? 'អ្វីដែលភ្ញៀវរបស់យើងនិយាយ' : 'What Our Guests Say'} />
        <p className="events-section-subtitle">{isKhmer ? 'បទពិសោធន៍ចែករំលែកដោយអតិថិជនជាទីស្រឡាញ់របស់យើង' : 'Experiences shared by our valued customers'}</p>
        <div className="events-testimonial-grid">
          {[0, 1, 2].map((offset) => localizedTestimonials[(testimonialIndex + offset) % localizedTestimonials.length]).map((item) => <article className="events-testimonial-card" key={`${testimonialIndex}-${item.name}`}><div className="events-stars">★★★★★</div><div className="events-quote">”</div><p>{item.quote}</p><div className="events-guest"><img src={item.avatar} alt="" /><span><strong>{item.name}</strong><small>{item.date}</small></span></div></article>)}
        </div>
        <div className="events-slider-controls"><button type="button" aria-label={isKhmer ? 'ការវាយតម្លៃមុន' : 'Previous testimonials'} onClick={() => setTestimonialIndex((value) => (value - 1 + testimonials.length) % testimonials.length)}><ArrowLeft size={16} /></button><span>{testimonials.map((_, index) => <i key={index} className={index === testimonialIndex ? 'active' : ''} />)}</span><button type="button" aria-label={isKhmer ? 'ការវាយតម្លៃបន្ទាប់' : 'Next testimonials'} onClick={() => setTestimonialIndex((value) => (value + 1) % testimonials.length)}><ArrowRight size={16} /></button></div>
      </section>

      <section className="events-section events-inquiry-section" id="inquiry">
        <div className="events-inquiry-visual" style={{ backgroundImage: `url(${imgEngagement})` }}><div><PartyPopper size={26} /><h2>{isKhmer ? <>តោះបង្កើតអ្វីមួយ<br />ដ៏អស្ចារ្យជាមួយគ្នា</> : <>Let’s Create<br />Something<br />Amazing Together</>}</h2><p>{isKhmer ? 'មិនថាជាព្រឹត្តិការណ៍តូចមួយ ឬការសន្យាអស់មួយជីវិតទេ យើងនៅទីនេះដើម្បីធ្វើឱ្យចក្ខុវិស័យរបស់អ្នកក្លាយជាការពិត។' : 'Whether it’s a small milestone or a lifetime commitment, we are here to bring your vision to life with Khmer warmth and modern luxury.'}</p></div></div>
        <form className="events-inquiry-form" onSubmit={submitInquiry}>
          <h2>{isKhmer ? 'ទម្រង់សាកសួរ' : 'Inquiry Form'}</h2>
          <div className="events-form-grid">
            <label>{isKhmer ? 'ឈ្មោះពេញ *' : 'Full Name *'}<input name="name" required placeholder={isKhmer ? 'បញ្ចូលឈ្មោះពេញ' : 'Enter full name'} /></label>
            <label>{isKhmer ? 'លេខទូរស័ព្ទ *' : 'Phone Number *'}<input name="phone" type="tel" required placeholder={isKhmer ? 'បញ្ចូលលេខទូរស័ព្ទ' : 'Enter phone number'} /></label>
            <label>{isKhmer ? 'ឈ្មោះក្រុមហ៊ុន' : 'Company Name'}<input name="company" placeholder={isKhmer ? 'ឈ្មោះក្រុមហ៊ុន' : 'Company name'} /></label>
            <label>{isKhmer ? 'អាសយដ្ឋានអ៊ីមែល (ស្រេចចិត្ត)' : 'Email Address (Optional)'}<input name="email" type="email" placeholder={isKhmer ? 'បញ្ចូលអាសយដ្ឋានអ៊ីមែល' : 'Enter email address'} /></label>
            <label>{isKhmer ? 'ប្រភេទកម្មវិធី' : 'Event Type'}<select name="eventType" defaultValue="Wedding"><option>{isKhmer ? 'មង្គលការ' : 'Wedding'}</option><option>{isKhmer ? 'ខួបកំណើត' : 'Birthday'}</option><option>{isKhmer ? 'កម្មវិធីក្រុមហ៊ុន' : 'Corporate'}</option><option>{isKhmer ? 'ពិធីភ្ជាប់ពាក្យ' : 'Engagement'}</option><option>{isKhmer ? 'កម្មវិធីឯកជន' : 'Private Party'}</option></select></label>
            <label>{isKhmer ? 'ចំនួនភ្ញៀវ' : 'Guests'}<input name="guests" type="number" min="1" placeholder={isKhmer ? 'ឧ. ១៥០' : 'e.g. 150'} /></label>
            <label className="events-form-wide">{isKhmer ? 'តម្រូវការពិសេស' : 'Special Requirements'}<textarea name="requirements" rows={4} placeholder={isKhmer ? 'ប្រាប់យើងបន្ថែមអំពីកម្មវិធីរបស់អ្នក…' : 'Tell us more about your event…'} /></label>
          </div>
          <button className="events-button events-button-primary" type="submit">{isKhmer ? 'ផ្ញើការសាកសួរ' : 'Submit Inquiry'}</button>
          {formSent && <p className="events-form-success" role="status">{isKhmer ? 'សូមអរគុណ! ក្រុមកម្មវិធីរបស់យើងនឹងទាក់ទងទៅអ្នកឆាប់ៗនេះ។' : 'Thank you! Our event team will be in touch shortly.'}</p>}
        </form>
      </section>

      <section className="events-section events-faq-section">
        <SectionHeading eyebrow={isKhmer ? 'សំណួរអំពីកម្មវិធី' : 'Event Questions'} title={isKhmer ? 'សំណួរដែលសួរញឹកញាប់' : 'Frequently Asked Questions'} />
        <div className="events-faq-list">
          {(isKhmer ? khmerContent.faqs : faqs).map(([question, answer], index) => <div className={`events-faq-item${openFaq === index ? ' open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><ChevronDown size={17} /></button><div className="events-faq-answer"><p>{answer}</p></div></div>)}
        </div>
      </section>

      <section className="events-final-cta" style={{ backgroundImage: `url(${imgHero})` }}><div><h2>{isKhmer ? 'ត្រៀមរៀបចំកម្មវិធីរបស់អ្នកហើយឬនៅ?' : 'Ready To Plan Your Event?'}</h2><p>{isKhmer ? 'ប្រាប់យើងពីអ្វីដែលអ្នកស្រមៃ។ យើងនឹងជួយរៀបចំគ្រប់ព័ត៌មានលម្អិត។' : 'Tell us what you’re imagining. We’ll help bring every detail together.'}</p><div><a href="#inquiry" className="events-button events-button-primary">{isKhmer ? 'រៀបចំកម្មវិធីរបស់អ្នក' : 'Plan Your Event'}</a><a href={`mailto:${data.contact.email}`} className="events-button events-button-outline">{isKhmer ? 'ទាក់ទងក្រុមកម្មវិធី' : 'Call to Event Team'}</a></div></div></section>
    </main>
  );
}
