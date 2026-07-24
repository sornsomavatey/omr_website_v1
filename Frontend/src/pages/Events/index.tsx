import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Sparkles,
  User,
  Users,
  X
} from 'lucide-react';

import FeaturePackageCard from '@/components/FeaturePackageCard';
import SectionHeader from '@/components/SectionHeader';
import EventSpaceCard from '@/components/EventSpaceCard';
import TestimonialSection from '@/components/TestimonialSection';
import { createEventBooking, getTestimonialsData, sendCustomerEmail } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';

import imgHero     from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp';
import imgPkg1     from '@/assets/Family_compressed.jpg';
import imgPkg2     from '@/assets/engagement_compressed.jpg';
import imgPkg3     from '@/assets/meeting-room-package.png';
import imgPkg4     from '@/assets/cooperate package_compressed.jpg';
import imgSpace1   from '@/assets/private-room-no-logo.webp';
import imgSpace2   from '@/assets/family dinner.jpg';
import imgGal1     from '@/assets/gallery/private-gatherings-no-logo.webp';
import imgGal2     from '@/assets/gallery/artisanal-plating-no-logo.webp';
import imgGal3     from '@/assets/gallery/wine-toast.webp';
import imgGal4     from '@/assets/gallery/event-coffee-service.webp';
import imgGal5     from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import imgInquiry  from '@/assets/Weeding.webp';
import imgFinalCta from '@/assets/event bg.jpg';
import imgMainHall from '@/assets/main hall.jpg';
import { imageMap } from '@/pages/Home/homeAssets';

import './index.css';

const packages = [
  {
    id: 'family',
    name: 'Family Celebration',
    guests: '8–12 guests',
    img: imgPkg1,
    features: [
      'Private Room',
      'Free basic table set up',
      'Free room charge 2hr',
      'More than 100+ A La Cart Selection',
      'Waiter and Waitress to Serve Food and Drink'
    ],
  },
  {
    id: 'engagement',
    name: 'Engagement Package',
    guests: '30 guests',
    img: imgPkg2,
    features: [
      'Free Event Hall Half Day',
      'Free Table Set Up',
      'Gourmet Buffet or Set Menu (8-10 item/set)',
      'Free beverage per table (vital water 350ml 10bottle/table, coke 10cans/table)',
      'Free flow of non-alcohol beverages for Buffet',
      'Dedicated Servers to Serve Food and Drink'
    ],
  },
  {
    id: 'catering',
    name: 'Meeting Room',
    guests: '30+ guests',
    img: imgPkg3,
    features: [
      'Complimentary meeting room',
      'LCD Projector + Screen + Pointer',
      'PA system for rostrum and microphones',
      'Flipchart and paper White board with markers Podium',
      'Vital Premium Water 350ml (2bottles/half day, 4bottles/full day)'
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Package',
    guests: '8–80 guests',
    img: imgPkg4,
    features: [
      'Complimentary meeting room',
      'LCD Projector + Screen + Pointer',
      'PA system for rostrum and microphones',
      'Flipchart and paper White board with markers Podium',
      'Vital Premium Water 350ml (2bottles/half day, 4bottles/full day)'
    ],
  },
];

const spaces = [
  {
    id: 'vip',
    name: 'VIP Room',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgSpace2,
    features: ['Air Conditioning (AC)', 'Personal butler service', 'Garden views', 'Integrated AV system'],
  },
  {
    id: 'private',
    name: 'Private Room',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgSpace1,
    features: ['Air Conditioning (AC)', 'Personal butler service', 'Garden views', 'Integrated AV system'],
  },
  {
    id: 'main-hall',
    name: 'Main Hall',
    guestTag: '8–12 guests',
    badgeTag: 'Best for Private Dinners',
    img: imgMainHall,
    features: ['Air Conditioning (AC)', 'Personal butler service', 'Garden views', 'Integrated AV system'],
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

const galleryItems: { src: string; alt: string; caption: string }[] = [
  { src: imgGal1, alt: 'Outdoor catering event', caption: 'Garden Gathering' },
  { src: imgGal2, alt: 'Traditional Khmer dish', caption: 'Artisanal Plating' },
  { src: imgGal3, alt: 'Guests raising wine glasses in celebration', caption: 'Bridal Toast' },
  { src: imgGal4, alt: 'One More Restaurant staff operating a coffee station at an event', caption: 'Corporate Coffee Service' },
  { src: imgGal5, alt: 'Grand dining hall', caption: 'Grand Ballroom' },
];

const faqs = [
  { q: 'How far in advance should I book my event?', a: 'We recommend booking at least 4–6 weeks in advance for smaller events and 3–6 months for large weddings or corporate functions. This ensures your preferred date and space are available.' },
  { q: 'What is your minimum guest count for private events?', a: 'Our private VIP suite accommodates 8–30 guests. The Grand Ballroom is ideal for 40–120 guests. For smaller intimate dinners, we can arrange semi-private sections starting from 6 guests.' },
  { q: 'Can I bring my own cake or decoration items?', a: 'Yes! You are welcome to bring your own cake and personal decorations. Our team will help set everything up at no additional charge. A small corkage fee may apply for external beverages.' },
  { q: 'What is the cancellation and deposit policy?', a: 'A 30% deposit secures your event date. Full cancellations made more than 14 days before the event receive a full deposit refund. Cancellations within 14 days forfeit the deposit.' },

];

// ── Sub-components ───────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return <div className="events-stars">{'★'.repeat(count)}</div>;
}

function CustomBranchSelect({
  disabled,
  t,
  defaultBranch
}: {
  disabled?: boolean;
  t: any;
  defaultBranch?: string;
}) {
  const [selected, setSelected] = useState(defaultBranch || 'Boeung Kak');
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const branches = [
    { value: 'Boeung Kak', label: t('eventsPage.inquiry.form.branches.bk', undefined, 'Boeung Kak') },
    { value: 'Toul Kork', label: t('eventsPage.inquiry.form.branches.tk', undefined, 'Toul Kork') },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = branches.find(opt => opt.value === selected) || branches[0];

  return (
    <div className="custom-event-select-container" ref={dropdownRef}>
      <input type="hidden" name="branch" value={selected} />
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`custom-event-select-trigger ${isOpen ? 'custom-event-select-trigger-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`custom-event-select-label ${!hasUserSelected ? 'custom-event-select-label-placeholder' : ''}`}>
          {currentOption.label}
        </span>
        <ChevronDown size={18} className={`custom-event-select-icon ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-event-select-dropdown" role="listbox">
          {branches.map((b) => {
            const isSelected = b.value === selected;
            return (
              <div
                key={b.value}
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelected(b.value);
                  setHasUserSelected(true);
                  setIsOpen(false);
                }}
                className={`custom-event-select-option ${isSelected ? 'custom-event-select-option-active' : ''}`}
              >
                <span>{b.label}</span>
                {isSelected && <Check size={16} className="custom-event-select-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CustomEventSelect({
  disabled,
  t
}: {
  disabled?: boolean;
  t: any;
}) {
  const [selected, setSelected] = useState('');
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const eventTypes = [
    { value: 'Wedding', label: t('eventsPage.inquiry.form.eventTypes.Wedding', undefined, 'Wedding') },
    { value: 'Birthday', label: t('eventsPage.inquiry.form.eventTypes.Birthday', undefined, 'Birthday') },
    { value: 'Corporate Event', label: t('eventsPage.inquiry.form.eventTypes.Corporate Event', undefined, 'Corporate Event') },
    { value: 'Engagement', label: t('eventsPage.inquiry.form.eventTypes.Engagement', undefined, 'Engagement') },
    { value: 'Private Dining', label: t('eventsPage.inquiry.form.eventTypes.Private Dining', undefined, 'Private Dining') },
    { value: 'Other', label: t('eventsPage.inquiry.form.eventTypes.Other', undefined, 'Other') },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = eventTypes.find(opt => opt.value === selected);

  return (
    <div className="custom-event-select-container" ref={dropdownRef}>
      <input type="hidden" name="event_type" value={selected || 'Wedding'} />
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`custom-event-select-trigger ${isOpen ? 'custom-event-select-trigger-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`custom-event-select-label ${!hasUserSelected ? 'custom-event-select-label-placeholder' : ''}`}>
          {currentOption ? currentOption.label : t('eventsPage.inquiry.form.selectEventType', undefined, 'Wedding')}
        </span>
        <ChevronDown size={18} className={`custom-event-select-icon ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-event-select-dropdown" role="listbox">
          {eventTypes.map((type) => {
            const isSelected = type.value === selected;
            return (
              <div
                key={type.value}
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelected(type.value);
                  setHasUserSelected(true);
                  setIsOpen(false);
                }}
                className={`custom-event-select-option ${isSelected ? 'custom-event-select-option-active' : ''}`}
              >
                <span>{type.label}</span>
                {isSelected && <Check size={16} className="custom-event-select-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function EventsPage() {
  const { t, getObject, isKhmer } = useTranslation();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    phone: string;
    branch: string;
    email: string;
    company?: string;
    event_type: string;
    guest_count: number;
    special_requirements?: string;
    date: string;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const queryBranch = new URLSearchParams(location.search).get('branch') ||
                      (location.hash.includes('boeung-kak') ? 'Boeung Kak' : location.hash.includes('toul-kork') ? 'Toul Kork' : '');
  const initialBranch = queryBranch?.toLowerCase().includes('toul') ? 'Toul Kork' : 'Boeung Kak';

  useEffect(() => {
    if (location.hash === '#inquiry') {
      setTimeout(() => {
        const element = document.getElementById('inquiry');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const packagesList = [
    {
      id: 'family',
      name: t('eventsPage.packages.items.family.name', undefined, packages[0].name),
      guests: t('eventsPage.packages.items.family.guests', undefined, packages[0].guests),
      img: imgPkg1,
      features: getObject<string[]>('eventsPage.packages.items.family.features', packages[0].features),
    },
    {
      id: 'engagement',
      name: t('eventsPage.packages.items.engagement.name', undefined, packages[1].name),
      guests: t('eventsPage.packages.items.engagement.guests', undefined, packages[1].guests),
      img: imgPkg2,
      features: getObject<string[]>('eventsPage.packages.items.engagement.features', packages[1].features),
    },
    {
      id: 'catering',
      name: t('eventsPage.packages.items.catering.name', undefined, packages[2].name),
      guests: t('eventsPage.packages.items.catering.guests', undefined, packages[2].guests),
      img: imgPkg3,
      features: getObject<string[]>('eventsPage.packages.items.catering.features', packages[2].features),
    },
    {
      id: 'corporate',
      name: t('eventsPage.packages.items.corporate.name', undefined, packages[3].name),
      guests: t('eventsPage.packages.items.corporate.guests', undefined, packages[3].guests),
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
      img: imgMainHall,
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

  const [bookingRef, setBookingRef] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [hasDownloadedConfirmation, setHasDownloadedConfirmation] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [hasSentEmail, setHasSentEmail] = useState(false);

  const handleDownloadConfirmation = async () => {
    if (!submittedData || isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    const refCode = bookingRef || 'EVT-00000';
    const filename = `OMR_Event_Inquiry_${refCode}.pdf`;
    const issueTimestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const { jsPDF } = await import('jspdf');

      const logoUrl = window.location.origin + '/assets/partners/onemorerestaurant.png';
      const logoData = await new Promise<{ dataUrl: string; width: number; height: number } | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve({
                dataUrl: canvas.toDataURL('image/png'),
                width: img.width,
                height: img.height,
              });
              return;
            }
          } catch {}
          resolve(null);
        };
        img.onerror = () => resolve(null);
        img.src = logoUrl;
      });

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [120, 215],
      });

      // Receipt Card Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 120, 215, 'F');

      // Outer Border
      doc.setDrawColor(107, 145, 88);
      doc.setLineWidth(0.7);
      doc.roundedRect(6, 6, 108, 203, 4, 4, 'S');

      let currentTopY = 12;

      if (logoData) {
        const logoWidth = 26;
        const logoHeight = (logoWidth * logoData.height) / logoData.width;
        const logoX = (120 - logoWidth) / 2;
        doc.addImage(logoData.dataUrl, 'PNG', logoX, currentTopY, logoWidth, logoHeight);
        currentTopY += logoHeight + 4;
      } else {
        doc.setFillColor(17, 27, 15);
        doc.circle(60, 22, 9, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('O', 60, 26.5, { align: 'center' });

        doc.setTextColor(17, 27, 15);
        doc.setFont('times', 'bold');
        doc.setFontSize(15);
        doc.text('ONE MORE RESTAURANT', 60, 38, { align: 'center' });
        currentTopY = 43.5;
      }

      // Title
      doc.setTextColor(33, 45, 27);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('EVENT INQUIRY', 60, currentTopY, { align: 'center' });

      doc.setTextColor(107, 145, 88);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Thank you for choosing One More Restaurant', 60, currentTopY + 4.5, { align: 'center' });

      currentTopY += 9;

      // Separator Line
      doc.setDrawColor(240, 244, 239);
      doc.setLineWidth(0.4);
      doc.line(14, currentTopY, 106, currentTopY);

      currentTopY += 4;

      // Ref Bar
      doc.setFillColor(243, 248, 241);
      doc.setDrawColor(200, 220, 190);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, currentTopY, 92, 11, 2, 2, 'FD');

      doc.setTextColor(100, 104, 96);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Inquiry Ref:', 18, currentTopY + 7);

      doc.setTextColor(107, 145, 88);
      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.text(`#${refCode}`, 37, currentTopY + 7);

      doc.setTextColor(100, 104, 96);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`Issued: ${issueTimestamp}`, 102, currentTopY + 7, { align: 'right' });

      currentTopY += 18;

      // Rows Data
      const branchDisplay = submittedData.branch === 'Toul Kork' ? 'One More Restaurant Toul Kork' : 'One More Restaurant Boeung Kak';
      const rows = [
        { label: 'Guest Name', value: submittedData.name.trim() || 'Valued Guest' },
        { label: 'Phone Number', value: submittedData.phone.trim() || 'Not Provided' },
        { label: 'Branch Location', value: branchDisplay },
        { label: 'Event Type', value: submittedData.event_type },
        { label: 'Expected Guests', value: `${submittedData.guest_count} Guests` },
      ];

      if (submittedData.email.trim()) {
        rows.push({ label: 'Email Address', value: submittedData.email.trim() });
      }
      if (submittedData.company?.trim()) {
        rows.push({ label: 'Company Name', value: submittedData.company.trim() });
      }
      if (submittedData.special_requirements?.trim()) {
        rows.push({ label: 'Special Request', value: submittedData.special_requirements.trim() });
      }

      let currentY = currentTopY;
      rows.forEach((row) => {
        doc.setTextColor(115, 121, 112);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(row.label, 16, currentY);

        doc.setTextColor(33, 45, 27);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);

        const valLines = doc.splitTextToSize(row.value, 50);
        doc.text(valLines[0], 104, currentY, { align: 'right' });

        doc.setDrawColor(240, 243, 239);
        doc.setLineWidth(0.2);
        doc.line(16, currentY + 3.5, 104, currentY + 3.5);

        currentY += 8.5;
      });

      // Policies Box
      currentY += 2;
      doc.setFillColor(250, 253, 248);
      doc.setDrawColor(220, 235, 215);
      doc.setLineWidth(0.3);
      doc.roundedRect(14, currentY, 92, 22, 2, 2, 'FD');

      doc.setFillColor(107, 145, 88);
      doc.rect(14, currentY, 1.5, 22, 'F');

      doc.setTextColor(33, 45, 27);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('Important Event Information:', 18, currentY + 5);

      doc.setTextColor(85, 93, 82);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('• Our event manager will contact you within 24 hours.', 18, currentY + 9.5);
      doc.text('• Custom menus and hall decor available upon request.', 18, currentY + 13.5);
      doc.text('• Hotlines: 023 888 222 / 012 888 222', 18, currentY + 17.5);

      // Footer
      currentY += 26;
      doc.setTextColor(115, 121, 112);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Thank you for choosing One More Restaurant.', 60, currentY, { align: 'center' });
      doc.text('www.onemorerestaurant.com', 60, currentY + 4, { align: 'center' });

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let sharedSuccessfully = false;

      if (isMobile && navigator.canShare) {
        try {
          const pdfBlob = doc.output('blob');
          const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
          if (navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: 'Event Inquiry Receipt',
              text: `One More Restaurant Event Inquiry #${refCode}`
            });
            sharedSuccessfully = true;
          }
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            sharedSuccessfully = true;
          }
        }
      }

      if (!sharedSuccessfully) {
        doc.save(filename);
      }
      setHasDownloadedConfirmation(true);
    } catch (err) {
      console.error('jsPDF generation error:', err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSendToEmail = async (overrideEmail?: string) => {
    const targetEmail = (overrideEmail || emailInput || '').trim();
    if (!targetEmail || !submittedData) {
      alert(isKhmer ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ' : 'Please enter a valid email address.');
      return;
    }

    setIsSendingEmail(true);
    try {
      const refCode = bookingRef || 'EVT-00000';
      const branchDisplay = submittedData.branch === 'Toul Kork' ? 'One More Restaurant Toul Kork' : 'One More Restaurant Boeung Kak';

      const customMessage = `Event Inquiry Confirmation #${refCode}
Dear ${submittedData.name},

Thank you for submitting your event inquiry with One More Restaurant. Below are your details:
• Branch: ${branchDisplay}
• Event Type: ${submittedData.event_type}
• Expected Guests: ${submittedData.guest_count}
• Phone Number: ${submittedData.phone}
${submittedData.company ? `• Company: ${submittedData.company}\n` : ''}${submittedData.special_requirements ? `• Special Requirements: ${submittedData.special_requirements}\n` : ''}
Our event coordinator will contact you within 24 hours.`;

      await sendCustomerEmail(targetEmail, undefined, customMessage);

      setHasSentEmail(true);
      setShowEmailModal(false);
      alert(isKhmer ? 'អ៊ីមែលបញ្ជាក់ត្រូវបានផ្ញើដោយជោគជ័យ!' : 'Confirmation email sent successfully!');
    } catch (err) {
      console.error('Failed to send email:', err);
      alert(isKhmer ? 'បរាជ័យក្នុងការផ្ញើអ៊ីមែល។ សូមព្យាយាមម្តងទៀត។' : 'Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current || isSubmitting) return;

    const formData = new FormData(formRef.current);
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const branch = (formData.get('branch') as string || 'Boeung Kak').trim();
    const company = (formData.get('company') as string || '').trim();
    const emailInput = (formData.get('email') as string || '').trim();
    const event_type = formData.get('event_type') as string;
    const guest_count = Number(formData.get('guest_count') || 1);
    const special_requirements = (formData.get('special_requirements') as string || '').trim();

    // Construct valid payload
    const email = emailInput || 'noemail@onemore.com';
    const event_date = new Date().toISOString().split('T')[0]; // Current date

    const package_details = [
      `Branch: ${branch}`,
      company ? `Company Name: ${company}` : '',
      special_requirements ? `Requirements: ${special_requirements}` : ''
    ].filter(Boolean).join('\n') || 'None';

    setIsSubmitting(true);

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

      const ref = `EVT-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingRef(ref);

      setSubmittedData({
        name,
        phone,
        branch,
        email: emailInput,
        company,
        event_type,
        guest_count,
        special_requirements,
        date: event_date,
      });

      setEmailInput(emailInput);
      setHasDownloadedConfirmation(false);
      setHasSentEmail(false);

      setFormSuccess(true);
      formRef.current.reset();
      setShowModal(true);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      alert(isKhmer ? 'បរាជ័យក្នុងការផ្ញើព័ត៌មានសាកសួរ។ សូមព្យាយាមម្តងទៀត។' : 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                <strong>{t('eventsPage.hero.hotlineValue', undefined, '023 888 222')}</strong>
              </div>
            </div>
            <div className="events-contact-row">
              <span className="events-contact-icon"><Mail size={16} /></span>
              <div>
                <small>{t('eventsPage.hero.email', undefined, 'Email Inquiry')}</small>
                <strong>sales@onemorerestaurant.com</strong>
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

        <div className="events-gallery-grid">
          {translatedGalleryItems.map((item) => (
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.branch', undefined, 'Select Branch *')}
                    <CustomBranchSelect disabled={isSubmitting} t={t} defaultBranch={initialBranch} />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.company', undefined, 'Company Name')}
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={t('eventsPage.inquiry.form.placeholders.company', undefined, 'Company Name')}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.eventType', undefined, 'Event Type')}
                    <CustomEventSelect disabled={isSubmitting} t={t} />
                  </label>
                  <label>
                    {t('eventsPage.inquiry.form.labels.guests', undefined, 'Guests *')}
                    <input
                      name="guest_count"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder={t('eventsPage.inquiry.form.placeholders.guests', undefined, 'e.g. 150')}
                      required
                      disabled={isSubmitting}
                    />
                  </label>
                  <label className="events-form-wide">
                    {t('eventsPage.inquiry.form.labels.requirements', undefined, 'Special Requirements')}
                    <textarea
                      name="special_requirements"
                      rows={4}
                      placeholder={t('eventsPage.inquiry.form.placeholders.requirements', undefined, 'Tell us more about your event...')}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`events-inquiry-submit ${isSubmitting ? 'events-inquiry-submit-loading' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="events-submit-spinner-text">
                      <Loader2 className="events-spinner-icon" size={18} />
                      {isKhmer ? 'កំពុងផ្ញើព័ត៌មាន...' : 'Submitting Inquiry...'}
                    </span>
                  ) : (
                    t('eventsPage.inquiry.form.submit', undefined, 'Submit Inquiry')
                  )}
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

      {/* ── CONFIRMATION MODAL ────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl relative flex flex-col items-center animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 left-5 text-[#737970] hover:text-[#212d1b] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="success-icon-wrapper">
              <Check className="w-10 h-10 text-[#6b9158]" />
            </div>

            <h2 className="font-serif text-3xl text-[#212d1b] text-center mb-2">
              {t('eventsPage.inquiry.modal.title', undefined, isKhmer ? 'ការសាកសួរត្រូវបានបញ្ជាក់!' : 'Inquiry Confirmed!')}
            </h2>

            <p className="text-center text-[#646860] mb-8 max-w-md mx-auto">
              {t('eventsPage.inquiry.modal.subtitle', undefined, isKhmer
                ? 'សូមអរគុណសម្រាប់ការទាក់ទងមកកាន់ភោជនីយដ្ឋាន វ៉ាន់ ម៉័រ។'
                : 'Thank you for booking with One More Restaurant.')}
            </p>

            {submittedData && (
              <div className="success-details mb-8">
                <div className="success-detail-row">
                  <span>{isKhmer ? 'ឈ្មោះភ្ញៀវ' : 'Guest Name'}</span>
                  <strong>{submittedData.name}</strong>
                </div>
                <div className="success-detail-row">
                  <span>{isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone'}</span>
                  <strong>{submittedData.phone}</strong>
                </div>
                <div className="success-detail-row">
                  <span>{isKhmer ? 'សាខា' : 'Branch'}</span>
                  <strong>
                    {submittedData.branch === 'Toul Kork'
                      ? t('eventsPage.inquiry.form.branches.tk', undefined, 'One More Restaurant Toul Kork')
                      : t('eventsPage.inquiry.form.branches.bk', undefined, 'One More Restaurant Boeung Kak')}
                  </strong>
                </div>
                {submittedData.email && (
                  <div className="success-detail-row">
                    <span>{isKhmer ? 'អ៊ីមែល' : 'Email'}</span>
                    <strong>{submittedData.email}</strong>
                  </div>
                )}
                {submittedData.company && (
                  <div className="success-detail-row">
                    <span>{isKhmer ? 'ក្រុមហ៊ុន' : 'Company'}</span>
                    <strong>{submittedData.company}</strong>
                  </div>
                )}
                <div className="success-detail-row">
                  <span>{isKhmer ? 'ប្រភេទកម្មវិធី' : 'Event Type'}</span>
                  <strong>{submittedData.event_type}</strong>
                </div>
                <div className="success-detail-row">
                  <span>{isKhmer ? 'ចំនួនភ្ញៀវ' : 'Guests'}</span>
                  <strong>{submittedData.guest_count} {isKhmer ? 'នាក់' : 'Guests'}</strong>
                </div>
                {submittedData.special_requirements && (
                  <div className="success-detail-row">
                    <span>{isKhmer ? 'តម្រូវការផ្សេងៗ' : 'Special Requirements'}</span>
                    <strong>{submittedData.special_requirements}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmailInput(submittedData?.email || '');
                  setShowEmailModal(true);
                }}
                className="w-full py-3.5 px-4 bg-[#6b9158] hover:bg-[#5a7d49] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <Mail className="w-5 h-5 text-white" />
                <span>{isKhmer ? 'ផ្ញើទៅ អ៊ីមែល' : 'Send to Email'}</span>
              </button>

              <button
                type="button"
                disabled={isDownloadingPdf}
                onClick={handleDownloadConfirmation}
                className="w-full py-3 px-4 border border-[#6b9158] hover:bg-[#f2f6f0] text-[#6b9158] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#6b9158] animate-spin" />
                    <span>{isKhmer ? 'កំពុងបង្កើត PDF...' : 'Generating PDF...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#6b9158]" />
                    <span>{isKhmer ? 'ទាញយកលិខិតបញ្ជាក់ (PDF)' : 'Download Confirmation (PDF)'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 text-sm text-[#646860] hover:text-[#212d1b] font-medium transition-colors text-center underline underline-offset-4 decoration-gray-300 cursor-pointer"
              >
                {isKhmer ? 'បិទ' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL MODAL ───────────────────────── */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6b9158]/10 flex items-center justify-center text-[#6b9158]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {isKhmer ? 'ផ្ញើទៅ អ៊ីមែល' : 'Send to Email'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isKhmer ? 'បញ្ជូនព័ត៌មានសាកសួរទៅកាន់អ៊ីមែលរបស់អ្នក' : 'Send inquiry details to your email'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">
                {isKhmer ? 'អាសយដ្ឋានអ៊ីមែល (Email Address)' : 'Email Address'}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. customer@example.com"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9158] focus:border-transparent transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendToEmail();
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                disabled={isSendingEmail}
                onClick={() => handleSendToEmail()}
                className="w-full py-3 bg-[#6b9158] hover:bg-[#5a7d49] text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isKhmer ? 'កំពុងផ្ញើ...' : 'Sending Email...'}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{isKhmer ? 'ផ្ញើអ៊ីមែលឥឡូវនេះ' : 'Send Email Now'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
