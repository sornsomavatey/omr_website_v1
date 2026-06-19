import React, { useState, useEffect, useRef } from 'react';
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
import {
  branches,
  diningSpaces,
  imgHeroBg2,
  imgGallery1,
  imgGallery5,
  imgHeroBg1,
} from '../Home/homeAssets';
import './index.css';
import ScrollToTop from '../../components/ScrollToTop';

const guestInformation = [
  {
    icon: Clock,
    label: 'Opening Hours',
    value: '06:00 AM - 10:00 PM',
  },
  {
    icon: Phone,
    label: 'Contact Number',
    value: '+855 23 888 222',
  },
  {
    icon: MessageCircle,
    label: 'Response Time',
    value: 'Within 15 Minutes',
  },
  {
    icon: FileText,
    label: 'Reservation Policy',
    value: 'Free cancellation up to 24h',
  },
];

function GuestInformationCard() {
  return (
    <aside className="reservation-guest-card" aria-label="Guest information">
      <h2>Guest Information</h2>

      <div className="reservation-guest-list">
        {guestInformation.map((item) => {
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

function ReservationHero() {
  return (
    <section className="reservation-hero" aria-labelledby="reservation-title">
      <img
        src={imgHeroBg2}
        alt="One More Restaurant dining room"
        className="reservation-hero-image"
      />

      <div className="reservation-hero-overlay" />

      <div className="reservation-hero-container">
        <div className="reservation-hero-copy">
          <p className="reservation-hero-eyebrow">EST. 2008 · PHNOM PENH</p>

          <h1 id="reservation-title">Reserve Your Table</h1>

          <p className="reservation-hero-description">
            Experience the pinnacle of Khmer culinary heritage. A journey of
            forgotten flavors rediscovered in a setting of timeless luxury.
          </p>
        </div>

        <GuestInformationCard />
      </div>
    </section>
  );
}

function FaqSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // first item expanded by default

  const faqs = [
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

  return (
    <section className="faq-section" aria-labelledby="faq-section-title">
      <div className="faq-container">
        <span className="faq-eyebrow">Assistance</span>
        <h2 id="faq-section-title" className="faq-title font-serif">
          Frequently Asked Questions
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

export default function ReservationPage() {
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

  // Time autocomplete dropdown state
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeInputWrapperRef = useRef<HTMLDivElement>(null);

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

  // Helper date calculations
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  const occasions = [
    { name: 'Family Dining', icon: Utensils },
    { name: 'Business Meeting', icon: Briefcase },
    { name: 'Birthday Celebration', icon: Cake },
    { name: 'Corporate Event', icon: Building },
    { name: 'Date Night', icon: Heart },
    { name: 'Other', icon: MoreHorizontal }
  ];

  const seatingPreferences = [
    { name: 'Indoor', img: diningSpaces[3]?.img || imgHeroBg1 },
    { name: 'Outdoor', img: imgGallery1 },
    { name: 'Private Room', img: diningSpaces[4]?.img || imgHeroBg2 },
    { name: 'Big Room', img: imgGallery5 }
  ];

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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const yearNum = date.getFullYear();
    
    return `${monthName} ${dayNum}${getOrdinalSuffix(dayNum)} ${yearNum}`;
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check for empty fields
    if (!fullName.trim() || !phone.trim()) {
      alert("Please fill in your Contact Details (Name & Phone Number) to complete your reservation.");
      
      const targetInput = !fullName.trim() ? "fullName" : "phoneNumber";
      const element = document.getElementById(targetInput);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // 2. Validate Name (must be at least 2 characters)
    if (fullName.trim().length < 2) {
      alert("Please enter a valid Full Name (at least 2 characters).");
      const element = document.getElementById("fullName");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // 3. Validate Phone Number (must have between 9 and 12 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      alert("Please enter a valid Phone Number (typically 9 to 11 digits).");
      const element = document.getElementById("phoneNumber");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitted(true);
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

  return (
    <div className="reservation-page">
      <ReservationHero />

      {isSubmitted ? (
        <section className="reservation-form-section flex items-center justify-center py-24">
          <div className="reservation-success-card">
            <div className="success-icon-wrapper">
              <Check className="w-12 h-12 text-[#6b9158]" />
            </div>
            <h2 className="font-serif text-3xl text-[#212d1b] text-center mb-4">Reservation Confirmed!</h2>
            <p className="text-center text-[#646860] mb-8 max-w-md">
              Thank you for booking with One More Restaurant. A confirmation message has been sent to your phone number.
            </p>
            
            <div className="success-details mb-8">
              <div className="success-detail-row">
                <span>Branch</span>
                <strong>One More {selectedBranch}</strong>
              </div>
              <div className="success-detail-row">
                <span>Guest Name</span>
                <strong>{fullName || 'Valued Guest'}</strong>
              </div>
              <div className="success-detail-row">
                <span>Phone</span>
                <strong>{phone || 'Not provided'}</strong>
              </div>
              <div className="success-detail-row">
                <span>Guests</span>
                <strong>{adults + childrenCount} Guests ({adults} Adults, {childrenCount} Kids)</strong>
              </div>
              <div className="success-detail-row">
                <span>Date & Time</span>
                <strong>{formatDateDisplay(selectedDate)} at {customTime || selectedTime}</strong>
              </div>
              <div className="success-detail-row">
                <span>Seating & Occasion</span>
                <strong>{selectedSeating} · {selectedOccasion}</strong>
              </div>
            </div>

            <button type="button" onClick={handleReset} className="reserve-btn-primary w-full">
              Make Another Booking
            </button>
          </div>
        </section>
      ) : (
        <section className="reservation-form-section" aria-label="Reservation form">
          <div className="reservation-form-container">
            {/* Form Main Area */}
            <form className="reservation-form-main" onSubmit={handleReservationSubmit}>
              
              {/* Step 1: Choose Branch */}
              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>1</span>
                  <div>
                    <h2>Choose Branch</h2>
                    <p>Select your preferred location in Phnom Penh</p>
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
                      <img src={branches[0].img} alt="Toul Kork Branch" />
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
                        {branches[0].tags.map((tag) => (
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
                      <img src={branches[1].img} alt="Boeung Kak Branch" />
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
                        {branches[1].tags.map((tag) => (
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
                    <h2>Contact Details</h2>
                    <p>Enter your information so we can contact you regarding your booking</p>
                  </div>
                </div>

                <div className="contact-details-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number *</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      placeholder="Enter phone number"
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
                    <h2>Guests</h2>
                    <p>Tell us how many people will be joining you</p>
                  </div>
                </div>

                <div className="guests-counter-container">
                  <div className="counter-row">
                    <span className="counter-label">Adults</span>
                    <div className="counter-control">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        aria-label="Decrease adults"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="counter-value">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                        aria-label="Increase adults"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="counter-row">
                    <span className="counter-label">Children</span>
                    <div className="counter-control">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                        disabled={childrenCount <= 0}
                        aria-label="Decrease children"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="counter-value">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => prev + 1)}
                        aria-label="Increase children"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="total-guests-pill-wrapper">
                    <div className="total-guests-pill">
                      <User className="w-4 h-4 text-[#6b9158]" />
                      <span>Total {adults + childrenCount} Guests</span>
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
                    <h2>Select Date & Time</h2>
                    <p>Choose when you would like to dine with us</p>
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
                        <button type="button" onClick={handlePrevMonth} aria-label="Previous month">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={handleNextMonth} aria-label="Next month">
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
                          {cat}
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
                      <Clock className="custom-time-icon" />
                      <input
                        type="text"
                        placeholder="Enter time..."
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
                      {showTimeDropdown && customTime.trim().length > 0 && filteredTimeSuggestions.length > 0 && (
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
                    <h2>Occasion</h2>
                    <p>Select the occasion for this booking</p>
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
                    <h2>Seating Preference</h2>
                    <p>Choose where you would like to be seated</p>
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
                  <label htmlFor="specialRequest">Special Request</label>
                  <textarea
                    id="specialRequest"
                    rows={4}
                    placeholder="Allergies, seating requests, etc."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                  />
                </div>

                <div className="submit-area mt-8">
                  <button type="submit" className="reserve-btn-primary w-full">
                    Reserve a Table
                  </button>
                  <p className="cancel-notice text-center mt-3">
                    Free cancellation up to 24 hours before your reservation.
                  </p>
                </div>
              </div>

            </form>

            {/* Sticky Sidebar Booking Summary */}
            <aside className="reservation-summary-card">
              <h2>Booking Summary</h2>

              <div className="summary-content">
                <div className="summary-list">
                  <div className="summary-item summary-item-branch">
                    <span>Branch</span>
                    <strong>One More {selectedBranch}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Name</span>
                    <strong>{fullName || '—'}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Contact</span>
                    <strong>{phone || '—'}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Guests</span>
                    <strong>
                      {adults + childrenCount} Guests
                      <span className="guest-breakdown">({adults} Adults, {childrenCount} Kids)</span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Date</span>
                    <strong>
                      {formatDateDisplay(selectedDate)}
                      <span className="time-tag">({(customTime || selectedTime).toLowerCase()} {timeCategory.toLowerCase()})</span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Occasion</span>
                    <strong>{selectedOccasion}</strong>
                  </div>

                  <div className="summary-item">
                    <span>Seating</span>
                    <strong>{selectedSeating}</strong>
                  </div>
                </div>

                <p className="arrival-notice">
                  Please arrive 10 mins early. Reservations are held for 15 mins after the scheduled time.
                </p>

                <div className="summary-actions">
                  <button
                    type="button"
                    onClick={handleReservationSubmit}
                    className="reserve-btn-primary w-full"
                  >
                    Reserve a Table
                  </button>

                  <a
                    href="tel:+85523888222"
                    className="reserve-btn-secondary w-full text-center"
                  >
                    Contact Restaurant
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FaqSection />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
