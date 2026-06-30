import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { getReservationsData, getHomeData, createReservation } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import {
  imgHeroBg2,
  imgGallery1,
  imgGallery5,
  imgHeroBg1,
  imageMap,
} from '../Home/homeAssets';
import './index.css';

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
  const { t } = useTranslation();
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
                <strong>{item.value}</strong>
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

          <h1 id="reservation-title">{t('reservationPage.hero.title', undefined, hero.title)}</h1>

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
      a: 'Yes, you may bring your own wine. A corkage fee of $15 per bottle applies.',
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
                  className={`faq-answer-wrapper ${
                    isExpanded ? 'faq-answer-expanded' : ''
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
  const { t, getObject } = useTranslation();
  const [resData, setResData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Branch
  const [selectedBranch, setSelectedBranch] = useState('Toul Kork');

  // Step 2: Contact Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3: Guests
  const [adults, setAdults] = useState(4);
  const [childrenCount, setChildrenCount] = useState(2);

  // Step 3 (repeated): Date & Time
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed, so 5)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 18));
  const [timeCategory, setTimeCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');
  const [selectedTime, setSelectedTime] = useState('06:30 AM');
  const [customTime, setCustomTime] = useState('');

  // Automatically update active timeCategory tab when selectedTime or customTime changes
  useEffect(() => {
    const timeToParse = customTime || selectedTime;
    const detectedCategory = getMealCategoryFromTime(timeToParse, timeCategory);
    if (detectedCategory && detectedCategory !== timeCategory) {
      setTimeCategory(detectedCategory);
    }
  }, [selectedTime, customTime, timeCategory]);

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
  const [selectedOccasion, setSelectedOccasion] = useState('Birthday Celebration');

  // Step 5: Seating
  const [selectedSeating, setSelectedSeating] = useState('Private Room');
  const [specialRequest, setSpecialRequest] = useState('');

  // Booking submit status
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        {t('reservation.loading', undefined, 'Loading reservations...')}
      </div>
    );
  }

  if (error || !resData || !homeData) {
    return (
      <div className="pt-28 pb-20 text-center text-red-500 font-serif text-xl min-h-screen flex items-center justify-center">
        {error ? t('reservation.errors.load', undefined, error) : t('reservation.errors.noData', undefined, 'No reservation data available.')}
      </div>
    );
  }

  const branchesList: Branch[] = homeData.branches.map((branch: any) => ({
    ...branch,
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
  ].map((occ) => {
    const transOcc = occasionsList.find((o) => o.id === occ.id) || {};
    return {
      ...occ,
      name: transOcc.name || occ.name,
    };
  });

  const seatingList = getObject<any[]>('reservationPage.seatingPreferences', []);
  const seatingPreferences = [
    { id: 'indoor', name: 'Indoor', img: diningSpacesList[3]?.img || imgHeroBg1 },
    { id: 'outdoor', name: 'Outdoor', img: imgGallery1 },
    { id: 'privateRoom', name: 'Private Room', img: diningSpacesList[4]?.img || imgHeroBg2 },
    { id: 'bigRoom', name: 'Big Room', img: imgGallery5 }
  ].map((seating) => {
    const transSeating = seatingList.find((s) => s.id === seating.id) || {};
    return {
      ...seating,
      name: transSeating.name || seating.name,
    };
  });

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
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
    
    return `${monthName} ${dayNum}${getOrdinalSuffix(dayNum)} ${yearNum}`;
  };

  const translatedTimeCategory = (cat: 'Breakfast' | 'Lunch' | 'Dinner') => {
    return t(`reservationPage.timeCategories.${cat}`, undefined, cat);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !phone.trim()) {
      alert(t('reservationPage.validation.contactRequired', undefined, "Please fill in your Contact Details (Name & Phone Number) to complete your reservation."));
      
      const targetInput = !fullName.trim() ? "fullName" : "phoneNumber";
      const element = document.getElementById(targetInput);
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
    // Prepare reservation payload 
    const payload = {
      customer_name: fullName.trim(),
      customer_phone: phone.trim(),
      branch_id: selectedBranch === 'Toul Kork' ? 1 : 2,
      reservation_date: selectedDate.toISOString().split('T')[0],
      reservation_time: customTime || selectedTime,
      guest_count: adults + childrenCount,
      adults: adults,
      kids: childrenCount,
      area: selectedSeating || 'Standard',
      special_requests: specialRequest.trim() || null
    };

    createReservation(payload)
      .then(() => {
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error("Failed to submit reservation:", err);
        alert("There was an error processing your reservation. Please make sure the backend server is running.");
      });
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setAdults(4);
    setChildrenCount(2);
    setSelectedDate(new Date(2026, 5, 18));
    setSelectedTime('06:30 AM');
    setSelectedOccasion('Birthday Celebration');
    setSelectedSeating('Private Room');
    setSpecialRequest('');
    setIsSubmitted(false);
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
          <div className="absolute inset-0" onClick={handleReset} />
          <div className="reservation-success-card relative z-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar w-full max-w-md shadow-2xl">
            <div className="success-icon-wrapper">
              <Check className="w-12 h-12 text-[#6b9158]" />
            </div>
            <h2 className="font-serif text-3xl text-[#212d1b] text-center mb-4">{t('reservationPage.success.title', undefined, 'Reservation Confirmed!')}</h2>
            <p className="text-center text-[#646860] mb-8 max-w-md mx-auto">
              {t('reservationPage.success.desc', undefined, 'Thank you for booking with One More Restaurant. A confirmation message has been sent to your phone number.')}
            </p>
            
            <div className="success-details mb-8">
              <div className="success-detail-row">
                <span>{t('reservationPage.success.detailLabels.branch', undefined, 'Branch')}</span>
                <strong>One More {selectedBranch}</strong>
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
                    total: adults + childrenCount,
                    adults,
                    children: childrenCount
                  })}
                </strong>
              </div>
              <div className="success-detail-row">
                <span>{t('reservationPage.success.detailLabels.dateTime', undefined, 'Date & Time')}</span>
                <strong>
                  {t('reservationPage.success.dateTimeValue', {
                    date: formatDateDisplay(selectedDate),
                    time: customTime || selectedTime
                  })}
                </strong>
              </div>
              <div className="success-detail-row">
                <span>{t('reservationPage.success.detailLabels.seatingOccasion', undefined, 'Seating & Occasion')}</span>
                <strong>
                  {t('reservationPage.success.seatingOccasionValue', {
                    seating: selectedSeating,
                    occasion: selectedOccasion
                  })}
                </strong>
              </div>
            </div>

            <button type="button" onClick={handleReset} className="reserve-btn-primary w-full mb-4">
              {t('reservationPage.success.makeAnother', undefined, 'Make Another Booking')}
            </button>
            <div className="text-center pb-2">
              <Link to="/" className="text-[#6b9158] hover:text-[#4d6a3f] font-sans text-sm font-medium underline underline-offset-4 transition-colors">
                Back to Home
              </Link>
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
                  <span>1</span>
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
                      <img src={branchesList[0]?.img} alt="Toul Kork Branch" />
                    </div>
                    <div className="branch-card-content">
                      <div className="branch-card-header">
                        <h3>One More Restaurant Toul Kork</h3>
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
                      <img src={branchesList[1]?.img} alt="Boeung Kak Branch" />
                    </div>
                    <div className="branch-card-content">
                      <div className="branch-card-header">
                        <h3>One More Restaurant Boeung Kak</h3>
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
                  <span>2</span>
                  <div>
                    <h2>{stepContactTitle}</h2>
                    <p>{stepContactDesc}</p>
                  </div>
                </div>

                <div className="contact-details-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">{t('reservationPage.form.labels.fullName', undefined, 'Full Name *')}</label>
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
                    <label htmlFor="phoneNumber">{t('reservationPage.form.labels.phoneNumber', undefined, 'Phone Number *')}</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      placeholder={t('reservationPage.form.placeholders.phoneNumber', undefined, 'Enter phone number')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="step-divider" />

              {/* Step 3: Guests */}
              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>3</span>
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
                      <span className="counter-value">{adults}</span>
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
                      <span className="counter-value">{childrenCount}</span>
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
                      <span>{t('reservationPage.form.totalGuests', { count: adults + childrenCount })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-divider" />

              {/* Step 3 (repeated): Select Date & Time */}
              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>3</span>
                  <div>
                    <h2>{stepDateTimeTitle}</h2>
                    <p>{stepDateTimeDesc}</p>
                  </div>
                </div>

                <div className="date-time-picker-grid">
                  {/* Left Column: Calendar */}
                  <div className="custom-calendar-widget">
                    <div className="calendar-header">
                      <span className="calendar-month-year">
                        {monthNames[currentMonth]} {currentYear}
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
                            className={`calendar-cell ${!isCurrentMonth ? 'calendar-cell-other-month' : ''} ${
                              isSelected ? 'calendar-cell-selected' : ''
                            }`}
                          >
                            <span>{day}</span>
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
                            setSelectedTime(timeSlots[cat][0]);
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
                            {slot}
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
                              {time}
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
                  <span>4</span>
                  <div>
                    <h2>{stepOccasionTitle}</h2>
                    <p>{stepOccasionDesc}</p>
                  </div>
                </div>

                <div className="occasion-grid">
                  {occasions.map((occ) => {
                    const OccIcon = occ.icon;
                    const isSelected = selectedOccasion === occ.name;

                    return (
                      <button
                        key={occ.name}
                        type="button"
                        onClick={() => setSelectedOccasion(occ.name)}
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
                  <span>5</span>
                  <div>
                    <h2>{stepSeatingTitle}</h2>
                    <p>{stepSeatingDesc}</p>
                  </div>
                </div>

                <div className="seating-grid">
                  {seatingPreferences.map((seating) => {
                    const isSelected = selectedSeating === seating.name;

                    return (
                      <button
                        key={seating.name}
                        type="button"
                        onClick={() => setSelectedSeating(seating.name)}
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
                  <button type="submit" className="reserve-btn-primary w-full">
                    {t('reservationPage.form.submit', undefined, 'Reserve a Table')}
                  </button>
                  <p className="cancel-notice text-center mt-3">
                    {t('reservationPage.form.cancellationNotice', undefined, 'Free cancellation up to 24 hours before your reservation.')}
                  </p>
                </div>
              </div>

            </form>

            {/* Sticky Sidebar Booking Summary */}
            <aside className="reservation-summary-card">
              <h2>{t('reservationPage.summary.title', undefined, 'Booking Summary')}</h2>

              <div className="summary-content">
                <div className="summary-list">
                  <div className="summary-item summary-item-branch">
                    <span>{t('reservationPage.summary.labels.branch', undefined, 'Branch')}</span>
                    <strong>One More {selectedBranch}</strong>
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
                      {t('reservationPage.form.totalGuests', { count: adults + childrenCount })}
                      <span className="guest-breakdown">
                        {t('reservationPage.summary.guestBreakdown', { adults, children: childrenCount })}
                      </span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>{t('reservationPage.summary.labels.date', undefined, 'Date')}</span>
                    <strong>
                      {formatDateDisplay(selectedDate)}
                      <span className="time-tag">
                        {t('reservationPage.summary.timeTag', {
                          time: (customTime || selectedTime).toLowerCase(),
                          category: translatedTimeCategory(timeCategory).toLowerCase()
                        })}
                      </span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>{t('reservationPage.summary.labels.occasion', undefined, 'Occasion')}</span>
                    <strong>{selectedOccasion}</strong>
                  </div>

                  <div className="summary-item">
                    <span>{t('reservationPage.summary.labels.seating', undefined, 'Seating')}</span>
                    <strong>{selectedSeating}</strong>
                  </div>
                </div>

                <p className="arrival-notice">
                  {t('reservationPage.summary.arrivalNotice', undefined, 'Please arrive 10 mins early. Reservations are held for 15 mins after the scheduled time.')}
                </p>

                <div className="summary-actions">
                  <button
                    type="button"
                    onClick={handleReservationSubmit}
                    className="reserve-btn-primary w-full"
                  >
                    {t('reservationPage.summary.reserveButton', undefined, 'Reserve a Table')}
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
        </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
