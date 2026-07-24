import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Clock,
  FileText,
  MessageCircle,
  Phone,
  MapPin,
  Plus,
  Minus,
  Check,
  Briefcase,
  Cake,
  Utensils,
  Building,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  ShoppingCart,
  Trash2,
  Loader2,
  Download,
  X,
  Send,
  Mail,
} from 'lucide-react';
import { getReservationsData, getHomeData, createReservation, sendCustomerEmail } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import { toKhmerDigits } from '@/lib/price';
import whiteLogo from '@/assets/omr_logo_white.webp';
import imgMainHall from '@/assets/main hall.jpg';
import {
  imgSpaceOutdoor,
  imgHeroBg2,
  imgGallery1,
  imgGallery5,
  imgHeroBg1,
  imageMap,
} from '../Home/homeAssets';
import MenuModal, { type PreOrderCart } from '@/components/MenuModal/MenuModal';
import './index.css';
import { Skeleton } from '@/components/ui/skeleton';

// Pre-order menu items (static, not yet connected to backend)
type PreOrderItem = {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch & Dinner' | 'Dessert' | 'Drinks';
  price: number;
  desc: string;
  img: string;
  badge?: string;
};

const PRE_ORDER_ITEMS: PreOrderItem[] = [
  {
    id: 'po-1',
    name: 'Khmer Noodle Soup',
    category: 'Breakfast',
    price: 7,
    desc: 'Traditional kuy teav with pork broth, rice noodles, fresh herbs & bean sprouts.',
    img: '/src/assets/Food/Breakfast/khmer-noodle-soup.webp',
  },
  {
    id: 'po-2',
    name: 'Beef Fried Noodle',
    category: 'Breakfast',
    price: 8,
    desc: 'Wok-tossed rice noodles with tender beef slices, egg & spring onions.',
    img: '/src/assets/Food/Breakfast/beef-fried-noodle.webp',
  },
  {
    id: 'po-3',
    name: 'Seafood Fried Noodle',
    category: 'Breakfast',
    price: 10,
    desc: 'Fresh seafood medley stir-fried with flat rice noodles in savory sauce.',
    img: '/src/assets/Food/Breakfast/seafood-fried-noodle.webp',
  },
  {
    id: 'po-4',
    name: 'Fish Amok',
    category: 'Lunch & Dinner',
    price: 12,
    desc: 'Creamy Khmer fish curry steamed in banana leaves with coconut & lemongrass.',
    img: '/src/assets/Food/Lunch and Dinner/fish-amok-coconut.webp',
  },
  {
    id: 'po-5',
    name: 'Curry Lobster',
    category: 'Lunch & Dinner',
    price: 28,
    desc: 'Whole lobster simmered in fragrant Khmer red curry with vegetables.',
    img: '/src/assets/Food/Lunch and Dinner/curry-lobster.webp',
  },
  {
    id: 'po-6',
    name: 'Lok Lak',
    category: 'Lunch & Dinner',
    price: 14,
    desc: 'Classic Cambodian stir-fried beef with lime-pepper dipping sauce & fried egg.',
    img: '/src/assets/Food/Lunch and Dinner/britian-loklak.webp',
  },
  {
    id: 'po-7',
    name: 'Samlor Korko',
    category: 'Lunch & Dinner',
    price: 11,
    desc: 'Traditional Khmer sour soup with catfish, green papaya & roasted rice.',
    img: '/src/assets/Food/Lunch and Dinner/samlor-korko-catfish.webp',
  },
  {
    id: 'po-8',
    name: 'Five Signature Desserts',
    category: 'Dessert',
    price: 9,
    desc: 'A curated platter of five traditional Khmer sweet treats, beautifully presented.',
    img: '/src/assets/Food/Dessert/five-signature-dessert.webp',
  },
];

const PRE_ORDER_CATEGORIES = ['All', 'Breakfast', 'Lunch & Dinner', 'Dessert', 'Drinks'] as const;

type Branch = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  img: string;
  tags: string[];
};

type DiningSpace = {
  name: string;
  tag: string;
  desc: string;
  img: string;
};

const iconMap: Record<string, React.ComponentType> = {
  hours: Clock,
  phone: Phone,
  time: MessageCircle,
  policy: FileText,
};

function GuestInformationCard({ info }: { info: any[] }) {
  const { t, isKhmer } = useTranslation();
  return (
    <aside className="reservation-guest-card" aria-label={t('reservationPage.guestInformationAria', undefined, 'Guest information')}>
      <h2>{t('reservationPage.guestInformationTitle', undefined, 'Guest Information')}</h2>

      <div className="reservation-guest-list">
        {info.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="reservation-guest-item">
              <span className="reservation-guest-icon" aria-hidden="true">
                <Icon />
              </span>

              <div className="reservation-guest-copy">
                <p>{item.label}</p>
                <strong>{isKhmer ? toKhmerDigits(String(item.value)) : item.value}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ReservationHero({ hero, info }: { hero: any; info: any[] }) {
  const { t } = useTranslation();
  return (
    <section className="reservation-hero" aria-labelledby="reservation-title">
      <img
        src={imgHeroBg2}
        alt={t('reservationPage.hero.backgroundAlt', undefined, 'One More Restaurant dining room')}
        className="reservation-hero-image"
      />

      <div className="reservation-hero-overlay" />

      <div className="reservation-hero-container">
        <div className="reservation-hero-copy">
          <p className="reservation-hero-eyebrow">{t('reservationPage.hero.eyebrow', undefined, hero.eyebrow)}</p>

          <h1 className="page-hero-title" id="reservation-title">{t('reservationPage.hero.title', undefined, hero.title)}</h1>

          <p className="reservation-hero-description">
            {t('reservationPage.hero.desc', undefined, hero.desc)}
          </p>
        </div>

        <GuestInformationCard info={info} />
      </div>
    </section>
  );
}

function FaqSection() {
  const { t, getObject } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const defaultFaqs = [
    {
      q: 'What is the dress code?',
      a: 'We recommend smart casual attire. Traditional Khmer attire is also very welcome for special occasions.',
    },
    {
      q: 'Do you offer vegetarian or vegan options?',
      a: 'Yes, we have a variety of vegetarian and vegan options available. Please inform your waiter or mention it in the special requests section when booking.',
    },
    {
      q: 'Is there parking available at the branches?',
      a: 'Yes, both our Toul Kork and Boeung Kak branches feature spacious, secure parking lots with complimentary valet service.',
    },
    {
      q: 'Can I bring my own wine?',
      a: 'Yes, you may bring your own wine. A corkage fee of USD 15 per bottle applies.',
    },
    {
      q: 'Are pets allowed?',
      a: 'To ensure a comfortable dining environment for all guests, pets are only allowed in our outdoor garden areas.',
    },
  ];

  const faqs = getObject<any[]>('reservationPage.faq.items', defaultFaqs);

  return (
    <section className="faq-section" aria-labelledby="faq-section-title">
      <div className="faq-container">
        <span className="faq-eyebrow">{t('reservationPage.faq.eyebrow', undefined, 'Assistance')}</span>
        <h2 id="faq-section-title" className="faq-title font-serif">
          {t('reservationPage.faq.title', undefined, 'Frequently Asked Questions')}
        </h2>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isExpanded ? 'faq-item-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="faq-arrow" />
                  ) : (
                    <ChevronDown className="faq-arrow" />
                  )}
                </button>
                <div
                  className={`faq-answer-wrapper ${isExpanded ? 'faq-answer-expanded' : ''
                    }`}
                >
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
  );
}

const timeSuggestions = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
  '10:00 PM'
];

const timeSlots = {
  Breakfast: [
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'
  ],
  Lunch: [
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM',
    '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM'
  ],
  Dinner: [
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM'
  ]
};

const getMealCategoryFromTime = (
  timeStr: string,
  currentCategory: 'Breakfast' | 'Lunch' | 'Dinner'
): 'Breakfast' | 'Lunch' | 'Dinner' | null => {
  if (!timeStr) return null;
  const cleanTime = timeStr.trim().toUpperCase();

  // 1. If it exists in the current category's slots, keep it
  if (timeSlots[currentCategory].includes(cleanTime)) {
    return currentCategory;
  }

  // 2. See if it matches another category exactly
  for (const cat of ['Breakfast', 'Lunch', 'Dinner'] as const) {
    if (timeSlots[cat].includes(cleanTime)) {
      return cat;
    }
  }

  // 3. Fallback: Parse custom input (e.g. "06:00 PM")
  const match = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes < 690) { // Before 11:30 AM
    return 'Breakfast';
  } else if (totalMinutes < 990) { // Before 4:30 PM
    return 'Lunch';
  } else { // 4:30 PM onwards
    return 'Dinner';
  }
};

export default function ReservationPage() {
  const { t, getObject, isKhmer, language } = useTranslation();
  const [resData, setResData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Helper to parse branch query parameter
  const getBranchFromQuery = (searchStr: string) => {
    const params = new URLSearchParams(searchStr);
    const branchParam = (params.get('branch') || params.get('location') || '').toLowerCase();
    if (branchParam.includes('boeung') || branchParam.includes('bk') || branchParam.includes('បឹងកក់')) {
      return 'Boeung Kak';
    }
    if (branchParam.includes('toul') || branchParam.includes('tk') || branchParam.includes('ទួលគោក')) {
      return 'Toul Kork';
    }
    return null;
  };

  // Step 1: Branch (defaults to query param if present)
  const [selectedBranch, setSelectedBranch] = useState(() => getBranchFromQuery(location.search) || 'Toul Kork');

  useEffect(() => {
    const paramBranch = getBranchFromQuery(location.search);
    if (paramBranch) {
      setSelectedBranch(paramBranch);
    }
  }, [location.search]);

  // Step 2: Contact Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 3: Guests
  const [adults, setAdults] = useState(4);
  const [childrenCount, setChildrenCount] = useState(2);

  // Step 3 (repeated): Date & Time
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [timeCategory, setTimeCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');
  const [selectedTime, setSelectedTime] = useState('');
  const [customTime, setCustomTime] = useState('');

  // Automatically update active timeCategory tab when selectedTime or customTime changes
  useEffect(() => {
    const timeToParse = customTime || selectedTime;
    const detectedCategory = getMealCategoryFromTime(timeToParse, timeCategory);
    if (detectedCategory && detectedCategory !== timeCategory) {
      setTimeCategory(detectedCategory);
    }
  }, [selectedTime, customTime, timeCategory]);

  // Confirmation modal download & email prompt tracking state
  const [hasDownloadedConfirmation, setHasDownloadedConfirmation] = useState(false);
  const [hasSentEmail, setHasSentEmail] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Time autocomplete dropdown state
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeInputWrapperRef = useRef<HTMLDivElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([getReservationsData(), getHomeData()])
      .then(([reservationsRes, homeRes]) => {
        setResData(reservationsRes);
        setHomeData(homeRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load reservation data.');
        setLoading(false);
      });
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        timeInputWrapperRef.current &&
        !timeInputWrapperRef.current.contains(event.target as Node)
      ) {
        setShowTimeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on typed input
  const filteredTimeSuggestions = timeSuggestions.filter((time) =>
    time.toLowerCase().includes(customTime.toLowerCase())
  );

  const handleSelectSuggestion = (time: string) => {
    setCustomTime(time);
    setSelectedTime('');
    setShowTimeDropdown(false);
  };

  // Step 4: Occasion
  const [selectedOccasion, setSelectedOccasion] = useState('birthdayCelebration');

  // Step 5: Seating
  const [selectedSeating, setSelectedSeating] = useState('privateRoom');
  const [specialRequest, setSpecialRequest] = useState('');

  // Step 6: Pre-Order
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [preOrderCart, setPreOrderCart] = useState<PreOrderCart>({});
  const [isPreOrderSummaryExpanded, setIsPreOrderSummaryExpanded] = useState(false);

  const preOrderItemCount = Object.values(preOrderCart).reduce((s, i) => s + i.qty, 0);
  const preOrderTotal = Object.values(preOrderCart).reduce((s, i) => s + i.price * i.qty, 0);

  const handleQtyInBanner = (item: any, delta: number) => {
    if (delta === -1 && preOrderCart[item.id]?.qty === 1) {
      const confirmDelete = window.confirm(
        isKhmer
          ? `តើអ្នកចង់លុប ${item.name_kh || item.name} ចេញពីការកុម្ម៉ង់មុនមែនទេ?`
          : `Are you sure you want to remove ${item.name} from your pre-order?`
      );
      if (!confirmDelete) return;
    }
    setPreOrderCart((prev) => {
      const current = prev[item.id]?.qty ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: { ...item, qty: next } };
    });
  };

  // Booking submit status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Email Confirmation Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<number | undefined>(undefined);

  const handleSendToEmail = async (customEmail?: string) => {
    const targetEmail = (customEmail !== undefined ? customEmail : (emailInput || email)).trim();

    if (!targetEmail) {
      alert(isKhmer ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក' : 'Please enter your email address.');
      return;
    }

    setIsSendingEmail(true);
    try {
      const customMsg = `🎉 One More Restaurant - Reservation Confirmation\n\nDear ${fullName.trim() || 'Valued Guest'},\nThank you for choosing One More Restaurant! Your table reservation is confirmed.\n\nDate: ${formatDateDisplay(selectedDate)}\nTime Slot: ${formatTimeDisplay(customTime || selectedTime)}\nGuest Count: ${adults + childrenCount} (${adults} Adults, ${childrenCount} Kids)\nBranch: ${selectedBranchDisplay}\nSeating Area: ${selectedSeatingDisplay}\nSpecial Requests: ${specialRequest.trim() || 'None'}\n\nWe look forward to welcoming you!\nwww.onemorerestaurant.com`;
      await sendCustomerEmail(targetEmail, createdReservationId, customMsg);
      setHasSentEmail(true);
      alert(isKhmer 
        ? `លិខិតបញ្ជាក់ការកក់ត្រូវ បានផ្ញើទៅកាន់ ${targetEmail} ដោយជោគជ័យ!` 
        : `Reservation confirmation email sent successfully to ${targetEmail}!`);
      setShowEmailModal(false);
    } catch (err) {
      console.error('Failed to send email to customer:', err);
      alert(isKhmer 
        ? 'មានបញ្ហាក្នុងការផ្ញើអ៊ីមែល។ សូមពិនិត្យមើលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។' 
        : 'Could not send confirmation email. Please make sure backend server is running and email settings are configured.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <section className="reservation-form-section min-h-screen pt-28 pb-20 bg-white">
        <div className="reservation-form-container flex flex-col lg:flex-row gap-10 w-full max-w-[1440px] px-6">

          {/* Left Form Main Area Skeleton */}
          <div className="reservation-form-main flex-1 flex flex-col gap-10">
            {/* Step 1: Choose Branch Skeleton */}
            <div className="step-container">
              <div className="flex gap-4 items-start mb-6">
                <Skeleton className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-6 w-48 rounded bg-muted animate-pulse" />
                  <Skeleton className="h-4 w-full max-w-sm rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="w-full h-44 rounded-xl bg-muted animate-pulse" />
                <Skeleton className="w-full h-44 rounded-xl bg-muted animate-pulse" />
              </div>
            </div>

            <div className="h-px bg-gold/10 w-full" />

            {/* Step 2: Contact Details Skeleton */}
            <div className="step-container">
              <div className="flex gap-4 items-start mb-6">
                <Skeleton className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-6 w-48 rounded bg-muted animate-pulse" />
                  <Skeleton className="h-4 w-full max-w-sm rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24 rounded bg-muted" />
                  <Skeleton className="h-12 w-full rounded-lg bg-muted" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24 rounded bg-muted" />
                  <Skeleton className="h-12 w-full rounded-lg bg-muted" />
                </div>
              </div>
            </div>

            <div className="h-px bg-gold/10 w-full" />

            {/* Step 3: Date & Time Skeleton */}
            <div className="step-container">
              <div className="flex gap-4 items-start mb-6">
                <Skeleton className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-6 w-48 rounded bg-muted animate-pulse" />
                  <Skeleton className="h-4 w-full max-w-sm rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar grid skeleton */}
                <div className="border border-gold/10 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-28 rounded bg-muted" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-7 rounded bg-muted" />
                      <Skeleton className="h-7 w-7 rounded bg-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-4 w-6 mx-auto rounded bg-muted" />
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-8 w-8 mx-auto rounded-full bg-muted animate-pulse" />
                    ))}
                  </div>
                </div>
                {/* Time slot grid skeleton */}
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-5 w-32 rounded bg-muted" />
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-10 rounded-lg bg-muted" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar Skeleton */}
          <aside className="reservation-summary-card w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6 p-6 border border-gold/10 rounded-2xl bg-[#fafdf8]">
            <Skeleton className="h-7 w-40 rounded bg-muted mb-4 animate-pulse" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gold/5 last:border-0">
                  <Skeleton className="h-4 w-20 rounded bg-muted" />
                  <Skeleton className="h-4 w-28 rounded bg-muted" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg bg-muted mt-6 animate-pulse" />
          </aside>

        </div>
      </section>
    );
  }

  if (error || !resData || !homeData) {
    return (
      <div className="pt-28 pb-20 text-center text-red-500 font-serif text-xl min-h-screen flex items-center justify-center">
        {error ? t('reservation.errors.load', undefined, error) : t('reservation.errors.noData', undefined, 'No reservation data available.')}
      </div>
    );
  }

  const translatedBranches = getObject<any[]>('reservationPage.branches', []);
  const branchesList: Branch[] = homeData.branches.map((branch: any, index: number) => ({
    ...branch,
    ...(translatedBranches[index] || {}),
    id: branch.id,
    img: imageMap[branch.img] || branch.img,
  }));

  const diningSpacesList: DiningSpace[] = homeData.diningSpaces.map((space: any) => ({
    ...space,
    img: imageMap[space.img] || space.img,
  }));

  const translatedGuestInfoList = getObject<any[]>('reservationPage.guestInformation', []);
  const guestInfoList = resData.guestInformation.map((item: any, idx: number) => {
    const transItem = translatedGuestInfoList[idx] || {};
    return {
      icon: iconMap[item.type] || Clock,
      label: transItem.label || item.label,
      value: transItem.value || item.value,
    };
  });

  const localizeNumber = (value: string | number) =>
    isKhmer ? toKhmerDigits(String(value)) : String(value);

  const formatTimeDisplay = (time: string) => {
    if (!isKhmer) return time;
    return toKhmerDigits(time)
      .replace(/\s*AM/i, ' ព្រឹក')
      .replace(/\s*PM/i, ' ល្ងាច');
  };

  const selectedBranchIndex = selectedBranch === 'Toul Kork' ? 0 : 1;
  const selectedBranchDisplay = branchesList[selectedBranchIndex]?.name || selectedBranch;

  // Helper date calculations
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = getObject<string[]>('reservationPage.calendar.months', [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);

  const daysOfWeek = getObject<string[]>('reservationPage.calendar.daysOfWeek', ['S', 'M', 'T', 'W', 'T', 'F', 'S']);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const getCalendarDays = () => {
    const totalDays = daysInMonth(currentYear, currentMonth);
    const startDay = startDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Prev month padding
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthVal = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthTotalDays = daysInMonth(prevMonthYear, prevMonthVal);

    for (let i = startDay - 1; i >= 0; i--) {
      const dayVal = prevMonthTotalDays - i;
      days.push({
        day: dayVal,
        isCurrentMonth: false,
        date: new Date(prevMonthYear, prevMonthVal, dayVal),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    // Next month padding
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonthVal = currentMonth === 11 ? 0 : currentMonth + 1;
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(nextMonthYear, nextMonthVal, i),
      });
    }

    return days;
  };

  const occasionsList = getObject<any[]>('reservationPage.occasions', []);
  const occasions = [
    { id: 'familyDining', name: 'Family Dining', icon: Utensils },
    { id: 'businessMeeting', name: 'Business Meeting', icon: Briefcase },
    { id: 'birthdayCelebration', name: 'Birthday Celebration', icon: Cake },
    { id: 'corporateEvent', name: 'Corporate Event', icon: Building },
    { id: 'dateNight', name: 'Date Night', icon: Heart },
    { id: 'other', name: 'Other', icon: MoreHorizontal }
  ].map((occ, index) => {
    const transOcc = occasionsList[index] || {};
    return {
      ...occ,
      name: transOcc.name || occ.name,
    };
  });

  const selectedOccasionDisplay =
    occasions.find((occasion) => occasion.id === selectedOccasion)?.name || selectedOccasion;

  const seatingList = getObject<any[]>('reservationPage.seatingPreferences', []);
  const seatingPreferences = [
    { id: 'indoor', name: 'Indoor', img: imgMainHall },
    { id: 'outdoor', name: 'Outdoor', img: imgSpaceOutdoor },
    { id: 'privateRoom', name: 'Private Room', img: diningSpacesList[1]?.img || imgGallery1 },
    { id: 'vipRoom', name: 'VIP Room', img: imgGallery5 }
  ].map((seating, index) => {
    const transSeating = seatingList[index] || {};
    return {
      ...seating,
      name: transSeating.name || seating.name,
    };
  });

  const selectedSeatingDisplay =
    seatingPreferences.find((seating) => seating.id === selectedSeating)?.name || selectedSeating;

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatDateDisplay = (date: Date) => {
    const months = getObject<string[]>('reservationPage.calendar.shortMonths', [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const yearNum = date.getFullYear();

    if (isKhmer) {
      return `${localizeNumber(dayNum)} ${monthName} ${localizeNumber(yearNum)}`;
    }
    if (language === 'ZH') {
      return `${yearNum}年${monthName}${dayNum}日`;
    }
    if (language === 'KO') {
      return `${yearNum}년 ${monthName} ${dayNum}일`;
    }

    return `${monthName} ${dayNum}${getOrdinalSuffix(dayNum)} ${yearNum}`;
  };

  const translatedTimeCategory = (cat: 'Breakfast' | 'Lunch' | 'Dinner') => {
    return t(`reservationPage.timeCategories.${cat}`, undefined, cat);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Full Name check
    if (!fullName.trim()) {
      alert(t('reservationPage.validation.nameRequired', undefined, "Please enter your Full Name."));
      const element = document.getElementById("fullName");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    if (fullName.trim().length < 2) {
      alert(t('reservationPage.validation.invalidName', undefined, "Please enter a valid Full Name (at least 2 characters)."));
      const element = document.getElementById("fullName");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // 2. Phone Number check
    if (!phone.trim()) {
      alert(t('reservationPage.validation.phoneRequired', undefined, "Please enter your Phone Number."));
      const element = document.getElementById("phoneNumber");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      alert(t('reservationPage.validation.invalidPhone', undefined, "Please enter a valid Phone Number (typically 9 to 11 digits)."));
      const element = document.getElementById("phoneNumber");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // 3. Date & Time check
    if (!selectedDate || (!selectedTime && !customTime.trim())) {
      alert(t('reservationPage.validation.dateTimeRequired', undefined, "Please select a Date & Time for your reservation."));
      const element = document.querySelector(".date-time-picker-grid");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (isSubmitting) return;

    // Prepare reservation payload 
    const payload = {
      customer_name: fullName.trim(),
      customer_email: email.trim() || null,
      customer_phone: phone.trim(),
      branch_id: selectedBranch === 'Toul Kork' ? 1 : 2,
      reservation_date: selectedDate.toISOString().split('T')[0],
      reservation_time: customTime || selectedTime,
      guest_count: adults + childrenCount,
      adults: adults,
      kids: childrenCount,
      area: ({
        indoor: 'Indoor',
        outdoor: 'Outdoor',
        privateRoom: 'Private Room',
        vipRoom: 'VIP Room',
        bigRoom: 'VIP Room',
      } as Record<string, string>)[selectedSeating] || 'Standard',
      special_requests: specialRequest.trim() || null,
      preordered_items: Object.values(preOrderCart).map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty
      }))
    };

    setIsSubmitting(true);

    createReservation(payload)
      .then((res: any) => {
        if (res && res.id) {
          setCreatedReservationId(res.id);
        }
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error("Failed to submit reservation:", err);
        alert(isKhmer
          ? 'មានបញ្ហាក្នុងការដំណើរការកក់តុរបស់អ្នក។ សូមពិនិត្យថាម៉ាស៊ីនមេកំពុងដំណើរការ។'
          : 'There was an error processing your reservation. Please make sure the backend server is running.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDownloadConfirmation = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setHasDownloadedConfirmation(true);
    setShowDownloadPrompt(false);

    const bookingRef = `OMR-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = formatDateDisplay(selectedDate);
    const formattedTime = formatTimeDisplay(customTime || selectedTime);
    const totalGuestsCount = adults + childrenCount;
    const issueTimestamp = new Date().toLocaleString();
    const filename = `OMR_Reservation_${bookingRef}.pdf`;

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
          } catch {
            // ignore
          }
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
        // Fallback Header
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

      // Subtitle
      doc.setTextColor(107, 145, 88);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('THANK YOU FOR CHOOSING US', 60, currentTopY, { align: 'center' });

      currentTopY += 3.5;

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
      doc.text('Booking Ref:', 18, currentTopY + 7);

      doc.setTextColor(107, 145, 88);
      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.text(`#${bookingRef}`, 37, currentTopY + 7);

      doc.setTextColor(100, 104, 96);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`Issued: ${issueTimestamp}`, 102, currentTopY + 7, { align: 'right' });

      currentTopY += 18;

      // Rows Data
      const rows = [
        { label: 'Guest Name', value: fullName.trim() || 'Valued Guest' },
        { label: 'Phone Number', value: phone.trim() || 'Not Provided' },
        { label: 'Branch Location', value: selectedBranchDisplay },
        { label: 'Date & Time', value: `${formattedDate} at ${formattedTime}` },
        { label: 'Party Size', value: `${totalGuestsCount} Guests (${adults} Adults, ${childrenCount} Kids)` },
        { label: 'Seating Preference', value: selectedSeatingDisplay },
        { label: 'Special Occasion', value: selectedOccasionDisplay },
      ];

      if (specialRequest.trim()) {
        rows.push({ label: 'Special Request', value: specialRequest.trim() });
      }
      if (preOrderItemCount > 0) {
        rows.push({ label: 'Pre-order Total', value: `$${preOrderTotal.toFixed(2)}` });
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
      doc.text('Important Reservation Policies:', 18, currentY + 5);

      doc.setTextColor(85, 93, 82);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('• Please arrive 15 minutes before your scheduled time.', 18, currentY + 9.5);
      doc.text('• Reservations are held for up to 15 minutes.', 18, currentY + 13.5);
      doc.text('• Free cancellation up to 24 hours prior.', 18, currentY + 17.5);

      // Footer
      currentY += 26;
      doc.setTextColor(115, 121, 112);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Thank you for dining with One More Restaurant.', 60, currentY, { align: 'center' });
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
              title: 'Reservation Receipt',
              text: `One More Restaurant Reservation Receipt #${bookingRef}`
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
    } catch (err) {
      console.error('jsPDF generation error:', err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCloseAttempt = () => {
    if (hasDownloadedConfirmation || hasSentEmail) {
      handleReset();
    } else {
      setShowDownloadPrompt(true);
    }
  };

  const handleReset = () => {
    const now = new Date();
    setFullName('');
    setPhone('');
    setAdults(4);
    setChildrenCount(2);
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now);
    setSelectedTime('');
    setCustomTime('');
    setSelectedOccasion('birthdayCelebration');
    setSelectedSeating('privateRoom');
    setSpecialRequest('');
    setPreOrderCart({});
    setIsSubmitted(false);
    setHasDownloadedConfirmation(false);
    setHasSentEmail(false);
    setShowDownloadPrompt(false);
  };

  // Translate step headings
  const stepBranchTitle = t('reservationPage.steps.branch.title', undefined, resData.steps.branch.title);
  const stepBranchDesc = t('reservationPage.steps.branch.desc', undefined, resData.steps.branch.desc);

  const stepContactTitle = t('reservationPage.steps.contact.title', undefined, 'Contact Details');
  const stepContactDesc = t('reservationPage.steps.contact.desc', undefined, 'Enter your information so we can contact you regarding your booking');

  const stepGuestsTitle = t('reservationPage.steps.guests.title', undefined, 'Guests');
  const stepGuestsDesc = t('reservationPage.steps.guests.desc', undefined, 'Tell us how many people will be joining you');

  const stepDateTimeTitle = t('reservationPage.steps.dateTime.title', undefined, 'Select Date & Time');
  const stepDateTimeDesc = t('reservationPage.steps.dateTime.desc', undefined, 'Choose when you would like to dine with us');

  const stepOccasionTitle = t('reservationPage.steps.occasion.title', undefined, 'Special Occasion');
  const stepOccasionDesc = t('reservationPage.steps.occasion.desc', undefined, 'Let us know if you are celebrating a special event');

  const stepSeatingTitle = t('reservationPage.steps.seating.title', undefined, 'Seating Preference');
  const stepSeatingDesc = t('reservationPage.steps.seating.desc', undefined, 'Choose where you would like to be seated');

  return (
    <div className="reservation-page">
      <ReservationHero hero={resData.hero} info={guestInfoList} />

      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={handleCloseAttempt} />
          <div className="reservation-success-card relative z-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar w-full max-w-md shadow-2xl">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="absolute top-5 left-5 p-2 rounded-full text-[#646860] hover:text-[#212d1b] hover:bg-[#f0f4ef] transition-colors cursor-pointer"
              aria-label="Close confirmation"
            >
              <X className="w-5 h-5" />
            </button>

            {showDownloadPrompt ? (
              <div className="flex flex-col items-center text-center py-4 px-2 animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 rounded-full bg-[#f3f8f1] border border-[#6b9158]/30 text-[#6b9158] flex items-center justify-center mb-5 shadow-sm">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#212d1b] mb-3 font-semibold">
                  {isKhmer ? 'ទាញយកលិខិតបញ្ជាក់ការកក់?' : 'Download Confirmation Proof?'}
                </h3>
                <p className="text-sm text-[#646860] mb-8 max-w-xs leading-relaxed">
                  {isKhmer
                    ? 'សូមទាញយកលិខិតបញ្ជាក់របស់អ្នកមុនពេលបិទ'
                    : 'Please download your confirmation before closing'}
                </p>
                <div className="w-full flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={isDownloadingPdf}
                    onClick={async () => {
                      await handleDownloadConfirmation();
                      handleReset();
                    }}
                    className="reserve-btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isKhmer ? 'កំពុងបង្កើត PDF...' : 'Generating PDF...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{isKhmer ? 'ទាញយក និងបិទ' : 'Download & Close'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isDownloadingPdf}
                    onClick={handleReset}
                    className="w-full py-3 px-4 rounded-xl text-sm font-sans font-medium text-[#737970] hover:text-[#212d1b] hover:bg-[#f2f5f2] transition-colors"
                  >
                    {isKhmer ? 'បិទដោយមិនទាញយក' : 'Close Without Downloading'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="success-icon-wrapper">
                  <Check className="w-12 h-12 text-[#6b9158]" />
                </div>
                <h2 className="font-serif text-3xl text-[#212d1b] text-center mb-4">{t('reservationPage.success.title', undefined, 'Reservation Confirmed!')}</h2>
                <p className="text-center text-[#646860] mb-8 max-w-md mx-auto">
                  {t('reservationPage.success.desc', undefined, 'Thank you for booking with One More Restaurant.')}
                </p>

                <div className="success-details mb-8">
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.branch', undefined, 'Branch')}</span>
                    <strong>{selectedBranchDisplay}</strong>
                  </div>
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.guestName', undefined, 'Guest Name')}</span>
                    <strong>{fullName || t('reservationPage.success.valuedGuest', undefined, 'Valued Guest')}</strong>
                  </div>
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.phone', undefined, 'Phone')}</span>
                    <strong>{phone || t('reservationPage.success.notProvided', undefined, 'Not provided')}</strong>
                  </div>
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.guests', undefined, 'Guests')}</span>
                    <strong>
                      {t('reservationPage.success.guestsValue', {
                        total: localizeNumber(adults + childrenCount),
                        adults: localizeNumber(adults),
                        children: localizeNumber(childrenCount)
                      }, `${adults + childrenCount} Guests (${adults} Adults, ${childrenCount} Kids)`)}
                    </strong>
                  </div>
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.dateTime', undefined, 'Date & Time')}</span>
                    <strong>
                      {t('reservationPage.success.dateTimeValue', {
                        date: formatDateDisplay(selectedDate),
                        time: formatTimeDisplay(customTime || selectedTime)
                      }, `${formatDateDisplay(selectedDate)} at ${formatTimeDisplay(customTime || selectedTime)}`)}
                    </strong>
                  </div>
                  <div className="success-detail-row">
                    <span>{t('reservationPage.success.detailLabels.seatingOccasion', undefined, 'Seating & Occasion')}</span>
                    <strong>
                      {t('reservationPage.success.seatingOccasionValue', {
                        seating: selectedSeatingDisplay,
                        occasion: selectedOccasionDisplay
                      }, `${selectedSeatingDisplay} · ${selectedOccasionDisplay}`)}
                    </strong>
                  </div>
                  {preOrderItemCount > 0 && (
                    <div className="success-detail-row">
                      <span>{isKhmer ? 'តម្លៃសរុបកុម្ម៉ង់មុន' : 'Pre-order Total'}</span>
                      <strong className="text-[#6b9158] font-bold">${preOrderTotal.toFixed(2)}</strong>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput(email);
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
                    className="download-confirmation-btn disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#6b9158] animate-spin" />
                        <span>{isKhmer ? 'កំពុងបង្កើត PDF...' : 'Generating PDF...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#6b9158]" />
                        <span>{isKhmer ? 'ទាញយកលិខិតបញ្ជាក់' : 'Download Confirmation'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseAttempt}
                    className="w-full py-2.5 text-sm text-[#646860] hover:text-[#212d1b] font-medium transition-colors text-center underline underline-offset-4 decoration-gray-300"
                  >
                    {t('reservationPage.success.makeAnother', undefined, 'Make Another Booking')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6b9158]/10 flex items-center justify-center text-[#6b9158]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {isKhmer ? 'ផ្ញើការកក់ទៅ អ៊ីមែល' : 'Send to Email'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isKhmer ? 'បញ្ជូនព័ត៌មានកក់ទុកទៅកាន់អ៊ីមែលរបស់អ្នក' : 'Send confirmation details to your email'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors"
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

      <section className="reservation-form-section" aria-label={t('reservationPage.form.aria', undefined, 'Reservation form')}>
        <div className="reservation-form-container">
          {/* Form Main Area */}
          <form className="reservation-form-main" onSubmit={handleReservationSubmit}>

            {/* Step 1: Choose Branch */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(1)}</span>
                <div>
                  <h2>{stepBranchTitle}</h2>
                  <p>{stepBranchDesc}</p>
                </div>
              </div>

              <div className="branch-selection-grid">
                {/* Toul Kork Card */}
                <button
                  type="button"
                  onClick={() => setSelectedBranch('Toul Kork')}
                  className={`branch-card-btn text-left ${selectedBranch === 'Toul Kork' ? 'branch-card-btn-active' : ''}`}
                >
                  <div className="branch-card-image-wrapper">
                    <img src={branchesList[0]?.img} alt={branchesList[0]?.name} />
                  </div>
                  <div className="branch-card-content">
                    <div className="branch-card-header">
                      <h3>{branchesList[0]?.name}</h3>
                      {selectedBranch === 'Toul Kork' && (
                        <span className="branch-check-badge">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="branch-card-tags">
                      {branchesList[0]?.tags.map((tag: string) => (
                        <span key={tag} className="branch-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>

                {/* Boeung Kak Card */}
                <button
                  type="button"
                  onClick={() => setSelectedBranch('Boeung Kak')}
                  className={`branch-card-btn text-left ${selectedBranch === 'Boeung Kak' ? 'branch-card-btn-active' : ''}`}
                >
                  <div className="branch-card-image-wrapper">
                    <img src={branchesList[1]?.img} alt={branchesList[1]?.name} />
                  </div>
                  <div className="branch-card-content">
                    <div className="branch-card-header">
                      <h3>{branchesList[1]?.name}</h3>
                      {selectedBranch === 'Boeung Kak' && (
                        <span className="branch-check-badge">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="branch-card-tags">
                      {branchesList[1]?.tags.map((tag: string) => (
                        <span key={tag} className="branch-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 2: Contact Details */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(2)}</span>
                <div>
                  <h2>{stepContactTitle}</h2>
                  <p>{stepContactDesc}</p>
                </div>
              </div>

              <div className="contact-details-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label htmlFor="fullName">
                    {t('reservationPage.form.labels.fullName', undefined, 'Full Name')}
                    <span className="required-star"> *</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder={t('reservationPage.form.placeholders.fullName', undefined, 'Enter full name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    {t('reservationPage.form.labels.phoneNumber', undefined, 'Phone Number')}
                    <span className="required-star"> *</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder={t('reservationPage.form.placeholders.phoneNumber', undefined, 'Enter phone number')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">
                    {t('reservationPage.form.labels.email', undefined, 'Email Address')}
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    placeholder={t('reservationPage.form.placeholders.email', undefined, 'e.g. customer@example.com')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 3: Guests */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(3)}</span>
                <div>
                  <h2>{stepGuestsTitle}</h2>
                  <p>{stepGuestsDesc}</p>
                </div>
              </div>

              <div className="guests-counter-container">
                <div className="counter-row">
                  <span className="counter-label">{t('reservationPage.form.labels.adults', undefined, 'Adults')}</span>
                  <div className="counter-control">
                    <button
                      type="button"
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      disabled={adults <= 1}
                      aria-label={t('reservationPage.form.ariaLabels.decreaseAdults', undefined, 'Decrease adults')}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="counter-value">{localizeNumber(adults)}</span>
                    <button
                      type="button"
                      onClick={() => setAdults((prev) => prev + 1)}
                      aria-label={t('reservationPage.form.ariaLabels.increaseAdults', undefined, 'Increase adults')}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="counter-row">
                  <span className="counter-label">{t('reservationPage.form.labels.children', undefined, 'Children')}</span>
                  <div className="counter-control">
                    <button
                      type="button"
                      onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                      disabled={childrenCount <= 0}
                      aria-label={t('reservationPage.form.ariaLabels.decreaseChildren', undefined, 'Decrease children')}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="counter-value">{localizeNumber(childrenCount)}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount((prev) => prev + 1)}
                      aria-label={t('reservationPage.form.ariaLabels.increaseChildren', undefined, 'Increase children')}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="total-guests-pill-wrapper">
                  <div className="total-guests-pill">
                    <User className="w-4 h-4 text-[#6b9158]" />
                    <span>{t('reservationPage.form.totalGuests', { count: localizeNumber(adults + childrenCount) })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 3 (repeated): Select Date & Time */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(3)}</span>
                <div>
                  <h2>
                    {stepDateTimeTitle}
                    <span className="required-star"> *</span>
                  </h2>
                  <p>{stepDateTimeDesc}</p>
                </div>
              </div>

              <div className="date-time-picker-grid">
                {/* Left Column: Calendar */}
                <div className="custom-calendar-widget">
                  <div className="calendar-header">
                    <span className="calendar-month-year">
                      {monthNames[currentMonth]} {localizeNumber(currentYear)}
                    </span>
                    <div className="calendar-nav">
                      <button type="button" onClick={handlePrevMonth} aria-label={t('reservationPage.form.ariaLabels.previousMonth', undefined, 'Previous month')}>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={handleNextMonth} aria-label={t('reservationPage.form.ariaLabels.nextMonth', undefined, 'Next month')}>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="calendar-grid">
                    {daysOfWeek.map((day, index) => (
                      <div key={`${day}-${index}`} className="calendar-day-header">
                        {day}
                      </div>
                    ))}

                    {getCalendarDays().map(({ day, isCurrentMonth, date }, idx) => {
                      const isSelected =
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === date.getMonth() &&
                        selectedDate.getFullYear() === date.getFullYear();

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`calendar-cell ${!isCurrentMonth ? 'calendar-cell-other-month' : ''} ${isSelected ? 'calendar-cell-selected' : ''
                            }`}
                        >
                          <span>{localizeNumber(day)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Time slots */}
                <div className="time-picker-widget">
                  <div className="time-tabs">
                    {(['Breakfast', 'Lunch', 'Dinner'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setTimeCategory(cat);
                        }}
                        className={`time-tab-btn ${timeCategory === cat ? 'time-tab-btn-active' : ''}`}
                      >
                        {translatedTimeCategory(cat)}
                      </button>
                    ))}
                  </div>

                  <div className="time-slots-grid">
                    {timeSlots[timeCategory].map((slot) => {
                      const isSelected = selectedTime === slot && !customTime;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setCustomTime('');
                          }}
                          className={`time-slot-btn ${isSelected ? 'time-slot-btn-selected' : ''}`}
                        >
                          {formatTimeDisplay(slot)}
                        </button>
                      );
                    })}
                  </div>

                  <div ref={timeInputWrapperRef} className="custom-time-input-wrapper">
                    <Clock
                      className="custom-time-icon cursor-pointer"
                      onClick={() => timeInputRef.current?.focus()}
                    />
                    <input
                      ref={timeInputRef}
                      type="text"
                      placeholder={t('reservationPage.form.placeholders.time', undefined, 'Enter time...')}
                      value={customTime}
                      onChange={(e) => {
                        setCustomTime(e.target.value);
                        setSelectedTime('');
                        setShowTimeDropdown(true);
                      }}
                      onFocus={() => setShowTimeDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape' || e.key === 'Enter') {
                          setShowTimeDropdown(false);
                        }
                      }}
                    />
                    {showTimeDropdown && filteredTimeSuggestions.length > 0 && (
                      <div className="time-dropdown-list">
                        {filteredTimeSuggestions.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className="time-dropdown-item"
                            onClick={() => handleSelectSuggestion(time)}
                          >
                            {formatTimeDisplay(time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 4: Occasion */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(4)}</span>
                <div>
                  <h2>{stepOccasionTitle}</h2>
                  <p>{stepOccasionDesc}</p>
                </div>
              </div>

              <div className="occasion-grid">
                {occasions.map((occ) => {
                  const OccIcon = occ.icon;
                  const isSelected = selectedOccasion === occ.id;

                  return (
                    <button
                      key={occ.name}
                      type="button"
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`occasion-btn-card ${isSelected ? 'occasion-btn-card-active' : ''}`}
                    >
                      <OccIcon className="w-5 h-5 mb-2 shrink-0" />
                      <span>{occ.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 5: Seating Preference */}
            <div className="step-container">
              <div className="reservation-step-heading mb-8">
                <span>{localizeNumber(5)}</span>
                <div>
                  <h2>{stepSeatingTitle}</h2>
                  <p>{stepSeatingDesc}</p>
                </div>
              </div>

              <div className="seating-grid">
                {seatingPreferences.map((seating) => {
                  const isSelected = selectedSeating === seating.id;

                  return (
                    <button
                      key={seating.name}
                      type="button"
                      onClick={() => setSelectedSeating(seating.id)}
                      className={`seating-btn-card text-left ${isSelected ? 'seating-btn-card-active' : ''}`}
                    >
                      <div className="seating-card-image-wrapper">
                        <img src={seating.img} alt={seating.name} />
                      </div>
                      <div className="seating-card-label">
                        <span>{seating.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="step-divider" />

            {/* Step 6: Pre-Order */}
            <div className="step-container">
              <div className="preorder-step-row">
                <div className="reservation-step-heading" style={{ marginBottom: 0 }}>
                  <span>{localizeNumber(6)}</span>
                  <div className="preorder-step-copy">
                    <h2>{t('reservationPage.steps.preOrder.title', undefined, 'Pre-order Dishes')}</h2>
                    <p>{t('reservationPage.steps.preOrder.desc', undefined, 'Choose your favorite dishes in advance')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="preorder-browse-btn"
                  onClick={() => setIsMenuModalOpen(true)}
                >
                  {t('reservationPage.steps.preOrder.button', undefined, 'Pre-order Menu')}
                </button>
              </div>

              {/* Cart pill — shows selected items */}
              {preOrderItemCount > 0 && (
                <div className="preorder-cart-banner mt-6">
                  <div className="preorder-cart-header">
                    <div className="preorder-cart-header-left">
                      <div className="preorder-cart-icon-wrap">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="preorder-cart-count">{preOrderItemCount}</span>
                      </div>
                      <div>
                        <p className="preorder-cart-label">{t('menu.modal.summary', undefined, 'Pre-order Summary')}</p>
                        <p className="preorder-cart-items-preview">
                          {t('menu.modal.preOrder', undefined, 'Pre-order')}
                        </p>
                      </div>
                    </div>
                    <div className="preorder-cart-header-right">
                      <span className="preorder-cart-header-total">${preOrderTotal.toFixed(2)}</span>
                      <button
                        type="button"
                        className="preorder-clear-btn"
                        onClick={() => {
                          const confirmClear = window.confirm(
                            t('menu.modal.clearConfirm', undefined, 'Are you sure you want to clear all pre-ordered items?')
                          );
                          if (confirmClear) {
                            setPreOrderCart({});
                          }
                        }}
                        aria-label="Clear pre-order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="preorder-cart-items-list-container">
                    {Object.values(preOrderCart).map((item) => (
                      <div key={item.id} className="preorder-cart-item-row">
                        <span className="preorder-item-row-name">
                          {isKhmer ? (item.name_kh || item.name) : item.name}
                        </span>
                        <div className="preorder-item-row-actions">
                          <div className="preorder-item-row-qty-ctrl">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleQtyInBanner(item, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="qty-val">{item.qty}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleQtyInBanner(item, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="special-request-wrapper mt-8">
                <label htmlFor="specialRequest">{t('reservationPage.form.labels.specialRequest', undefined, 'Special Request')}</label>
                <textarea
                  id="specialRequest"
                  rows={4}
                  placeholder={t('reservationPage.form.placeholders.specialRequest', undefined, 'Allergies, seating requests, etc.')}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>

              <div className="submit-area mt-8">
                <button type="submit" className="reserve-btn-primary w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('reservationPage.form.processing', undefined, 'Processing...')}</span>
                    </>
                  ) : (
                    t('reservationPage.form.submit', undefined, 'Reserve a Table')
                  )}
                </button>
                <p className="cancel-notice text-center mt-3">
                  {t('reservationPage.form.cancellationNotice', undefined, 'Free cancellation up to 24 hours before your reservation.')}
                </p>
              </div>
            </div>

          </form>

          {/* Sticky Sidebar Booking Summary */}
          <div className="reservation-summary-sticky">
            <aside className="reservation-summary-card">
            <h2>{t('reservationPage.summary.title', undefined, 'Booking Summary')}</h2>

            <div className="summary-content">
              <div className="summary-list">
                <div className="summary-item summary-item-branch">
                  <span>{t('reservationPage.summary.labels.branch', undefined, 'Branch')}</span>
                  <strong>{selectedBranchDisplay}</strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.name', undefined, 'Name')}</span>
                  <strong>{fullName || t('reservationPage.summary.empty', undefined, '—')}</strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.contact', undefined, 'Contact')}</span>
                  <strong>{phone || t('reservationPage.summary.empty', undefined, '—')}</strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.guests', undefined, 'Guests')}</span>
                  <strong>
                    {t('reservationPage.form.totalGuests', { count: localizeNumber(adults + childrenCount) })}
                    <span className="guest-breakdown">
                      {t('reservationPage.summary.guestBreakdown', {
                        adults: localizeNumber(adults),
                        children: localizeNumber(childrenCount)
                      })}
                    </span>
                  </strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.date', undefined, 'Date')}</span>
                  <strong>
                    {formatDateDisplay(selectedDate)}
                    <span className="time-tag">
                      {(customTime || selectedTime)
                        ? t('reservationPage.summary.timeTag', {
                            time: formatTimeDisplay(customTime || selectedTime),
                            category: translatedTimeCategory(timeCategory)
                          })
                        : t('reservationPage.summary.empty', undefined, '—')}
                    </span>
                  </strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.occasion', undefined, 'Occasion')}</span>
                  <strong>{selectedOccasionDisplay}</strong>
                </div>

                <div className="summary-item">
                  <span>{t('reservationPage.summary.labels.seating', undefined, 'Seating')}</span>
                  <strong>{selectedSeatingDisplay}</strong>
                </div>

                {preOrderItemCount > 0 && (
                  <div className="summary-item-preorder">
                    <button
                      type="button"
                      className="summary-preorder-toggle"
                      onClick={() => setIsPreOrderSummaryExpanded(!isPreOrderSummaryExpanded)}
                      aria-expanded={isPreOrderSummaryExpanded}
                    >
                      <span>{t('menu.modal.preOrder', undefined, 'Pre-order')} ({preOrderItemCount})</span>
                      {isPreOrderSummaryExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#6b9158]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6b9158]" />
                      )}
                    </button>
                    {isPreOrderSummaryExpanded && (
                      <div className="summary-preorder-list">
                        {Object.values(preOrderCart).map((i) => (
                          <div key={i.id} className="summary-preorder-subitem">
                            <span className="subitem-name">{isKhmer ? (i.name_kh || i.name) : i.name}</span>
                            <span className="subitem-qty">×{i.qty}</span>
                          </div>
                        ))}
                        <div className="summary-preorder-total">
                          <span>{t('reservationPage.summary.totalPrice', undefined, 'Total Price')}:</span>
                          <strong>${preOrderTotal.toFixed(2)}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="arrival-notice">
                {t('reservationPage.summary.arrivalNotice', undefined, 'Please arrive 10 mins early. Reservations are held for 15 mins after the scheduled time.')}
              </p>

              <div className="summary-actions">
                <button
                  type="button"
                  onClick={handleReservationSubmit}
                  className="reserve-btn-primary w-full flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('reservationPage.form.processing', undefined, 'Processing...')}</span>
                    </>
                  ) : (
                    t('reservationPage.summary.reserveButton', undefined, 'Reserve a Table')
                  )}
                </button>

                <a
                  href={t('reservationPage.summary.phoneHref', undefined, 'tel:+85523888222')}
                  className="reserve-btn-secondary w-full text-center"
                >
                  {t('reservationPage.summary.contactRestaurant', undefined, 'Contact Restaurant')}
                </a>
              </div>
            </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        cart={preOrderCart}
        onCartChange={setPreOrderCart}
      />
    </div>
  );
}
