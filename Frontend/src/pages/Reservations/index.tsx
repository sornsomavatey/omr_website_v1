import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building,
  Cake,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Phone,
  Plus,
  User,
  Utensils,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

import {
  imgGallery1,
  imgGallery5,
  imgHeroBg1,
  imgHeroBg2,
  imageMap,
} from "../Home/homeAssets";

import "./index.css";

type MealCategory = "Breakfast" | "Lunch" | "Dinner";

type GuestInformationItem = {
  type: string;
  label: string;
  value: string;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  img: string;
  tags: string[];
};

type DiningSeating = {
  id: string;
  name: string;
  img: string;
};

type OccasionItem = {
  id: string;
  name: string;
  icon: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type ReservationData = {
  hero: {
    eyebrow: string;
    title: string;
    desc: string;
    backgroundImage?: string;
    backgroundAlt: string;
  };
  guestInformationTitle: string;
  guestInformationAria: string;
  guestInformation: GuestInformationItem[];
  steps: {
    branch: {
      title: string;
      desc: string;
    };
    contact: {
      title: string;
      desc: string;
    };
    guests: {
      title: string;
      desc: string;
    };
    dateTime: {
      title: string;
      desc: string;
    };
    occasion: {
      title: string;
      desc: string;
    };
    seating: {
      title: string;
      desc: string;
    };
  };
  form: {
    aria: string;
    labels: {
      fullName: string;
      phoneNumber: string;
      adults: string;
      children: string;
      specialRequest: string;
    };
    placeholders: {
      fullName: string;
      phoneNumber: string;
      time: string;
      specialRequest: string;
    };
    ariaLabels: {
      decreaseAdults: string;
      increaseAdults: string;
      decreaseChildren: string;
      increaseChildren: string;
      previousMonth: string;
      nextMonth: string;
    };
    totalGuests: string;
    submit: string;
    cancellationNotice: string;
  };
  validation: {
    contactRequired: string;
    invalidName: string;
    invalidPhone: string;
  };
  success: {
    title: string;
    desc: string;
    makeAnother: string;
    valuedGuest: string;
    notProvided: string;
    detailLabels: {
      branch: string;
      guestName: string;
      phone: string;
      guests: string;
      dateTime: string;
      seatingOccasion: string;
    };
    guestsValue: string;
    dateTimeValue: string;
    seatingOccasionValue: string;
  };
  summary: {
    title: string;
    labels: {
      branch: string;
      name: string;
      contact: string;
      guests: string;
      date: string;
      occasion: string;
      seating: string;
    };
    empty: string;
    guestBreakdown: string;
    timeTag: string;
    arrivalNotice: string;
    reserveButton: string;
    contactRestaurant: string;
    phoneHref: string;
  };
  calendar: {
    months: string[];
    shortMonths: string[];
    daysOfWeek: string[];
  };
  timeCategories: Record<MealCategory, string>;
  branches: Branch[];
  occasions: OccasionItem[];
  seatingPreferences: DiningSeating[];
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
};

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  hours: Clock,
  phone: Phone,
  time: MessageCircle,
  policy: FileText,
};

const occasionIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  familyDining: Utensils,
  businessMeeting: Briefcase,
  birthdayCelebration: Cake,
  corporateEvent: Building,
  dateNight: Heart,
  other: MoreHorizontal,
};

const timeSuggestions = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
];

const timeSlots: Record<MealCategory, string[]> = {
  Breakfast: [
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  Lunch: [
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ],
  Dinner: [
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
  ],
};

const getMealCategoryFromTime = (
  timeStr: string,
  currentCategory: MealCategory,
): MealCategory | null => {
  if (!timeStr) {
    return null;
  }

  const cleanTime = timeStr.trim().toUpperCase();

  if (timeSlots[currentCategory].includes(cleanTime)) {
    return currentCategory;
  }

  for (const cat of ["Breakfast", "Lunch", "Dinner"] as const) {
    if (timeSlots[cat].includes(cleanTime)) {
      return cat;
    }
  }

  const match = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);

  if (!match) {
    return null;
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes < 690) {
    return "Breakfast";
  }

  if (totalMinutes < 990) {
    return "Lunch";
  }

  return "Dinner";
};

const getImage = (src?: string, fallback = imgHeroBg2) => {
  if (!src) {
    return fallback;
  }

  return imageMap[src] || src;
};

const formatText = (
  template: string,
  values: Record<string, string | number>,
) => {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];

    return value === undefined ? `{${key}}` : String(value);
  });
};

function GuestInformationCard({
  info,
  title,
  ariaLabel,
}: {
  info: GuestInformationItem[];
  title: string;
  ariaLabel: string;
}) {
  return (
    <aside className="reservation-guest-card" aria-label={ariaLabel}>
      <h2>{title}</h2>

      <div className="reservation-guest-list">
        {info.map((item) => {
          const Icon = iconMap[item.type] || Clock;

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

function ReservationHero({ data }: { data: ReservationData }) {
  return (
    <section className="reservation-hero" aria-labelledby="reservation-title">
      <img
        src={getImage(data.hero.backgroundImage, imgHeroBg2)}
        alt={data.hero.backgroundAlt}
        className="reservation-hero-image"
      />

      <div className="reservation-hero-overlay" />

      <div className="reservation-hero-container">
        <div className="reservation-hero-copy">
          <p className="reservation-hero-eyebrow">{data.hero.eyebrow}</p>

          <h1 id="reservation-title">{data.hero.title}</h1>

          <p className="reservation-hero-description">{data.hero.desc}</p>
        </div>

        <GuestInformationCard
          info={data.guestInformation}
          title={data.guestInformationTitle}
          ariaLabel={data.guestInformationAria}
        />
      </div>
    </section>
  );
}

function FaqSection({ faq }: { faq: ReservationData["faq"] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="faq-section" aria-labelledby="faq-section-title">
      <div className="faq-container">
        <span className="faq-eyebrow">{faq.eyebrow}</span>

        <h2 id="faq-section-title" className="faq-title font-serif">
          {faq.title}
        </h2>

        <div className="faq-list">
          {faq.items.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={`${item.q}-${index}`}
                className={`faq-item ${isExpanded ? "faq-item-expanded" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                >
                  <span>{item.q}</span>

                  {isExpanded ? (
                    <ChevronUp className="faq-arrow" />
                  ) : (
                    <ChevronDown className="faq-arrow" />
                  )}
                </button>

                <div
                  className={`faq-answer-wrapper ${
                    isExpanded ? "faq-answer-expanded" : ""
                  }`}
                >
                  <div className="faq-answer">
                    <p>{item.a}</p>
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

export default function ReservationPage() {
  const { getObject, language, t } = useTranslation();

  const resData = getObject<ReservationData | null>("reservationPage", null);
  const today = new Date();

  const [selectedBranch, setSelectedBranch] = useState("toulKork");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [adults, setAdults] = useState(4);
  const [childrenCount, setChildrenCount] = useState(2);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [timeCategory, setTimeCategory] = useState<MealCategory>("Breakfast");
  const [selectedTime, setSelectedTime] = useState("06:30 AM");
  const [customTime, setCustomTime] = useState("");

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeInputWrapperRef = useRef<HTMLDivElement>(null);

  const [selectedOccasion, setSelectedOccasion] = useState(
    "birthdayCelebration",
  );
  const [selectedSeating, setSelectedSeating] = useState("privateRoom");
  const [specialRequest, setSpecialRequest] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timeToParse = customTime || selectedTime;
    const detectedCategory = getMealCategoryFromTime(timeToParse, timeCategory);

    if (detectedCategory && detectedCategory !== timeCategory) {
      setTimeCategory(detectedCategory);
    }
  }, [selectedTime, customTime, timeCategory]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        timeInputWrapperRef.current &&
        !timeInputWrapperRef.current.contains(event.target as Node)
      ) {
        setShowTimeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTimeSuggestions = timeSuggestions.filter((time) =>
    time.toLowerCase().includes(customTime.toLowerCase()),
  );

  const handleSelectSuggestion = (time: string) => {
    setCustomTime(time);
    setSelectedTime("");
    setShowTimeDropdown(false);
  };

  if (!resData) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        {t("reservation.loading", undefined, "Loading reservations...")}
      </div>
    );
  }

  const branchesList = resData.branches.map((branch) => ({
    ...branch,
    img: getImage(branch.img, imgHeroBg2),
  }));

  const seatingPreferences = resData.seatingPreferences.map((seating) => ({
    ...seating,
    img:
      seating.img === "imgGallery1"
        ? imgGallery1
        : seating.img === "imgGallery5"
          ? imgGallery5
          : getImage(seating.img, imgHeroBg1),
  }));

  const selectedBranchData =
    branchesList.find((branch) => branch.id === selectedBranch) ||
    branchesList[0];

  const selectedOccasionData =
    resData.occasions.find((occasion) => occasion.id === selectedOccasion) ||
    resData.occasions[0];

  const selectedSeatingData =
    seatingPreferences.find((seating) => seating.id === selectedSeating) ||
    seatingPreferences[0];

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const startDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const getOrdinalSuffix = (day: number) => {
    if (language === "KH") {
      return "";
    }

    if (day > 3 && day < 21) {
      return "th";
    }

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDateDisplay = (date: Date) => {
    const monthName = resData.calendar.shortMonths[date.getMonth()];
    const dayNum = date.getDate();
    const yearNum = date.getFullYear();

    if (language === "KH") {
      return `${dayNum} ${monthName} ${yearNum}`;
    }

    return `${monthName} ${dayNum}${getOrdinalSuffix(dayNum)} ${yearNum}`;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
      return;
    }

    setCurrentMonth((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
      return;
    }

    setCurrentMonth((prev) => prev + 1);
  };

  const getCalendarDays = () => {
    const totalDays = daysInMonth(currentYear, currentMonth);
    const startDay = startDayOfMonth(currentYear, currentMonth);
    const days = [];

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

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

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

  const validateAndSubmit = () => {
    if (!fullName.trim() || !phone.trim()) {
      window.alert(resData.validation.contactRequired);

      const targetInput = !fullName.trim() ? "fullName" : "phoneNumber";
      const element = document.getElementById(targetInput);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }

      return;
    }

    if (fullName.trim().length < 2) {
      window.alert(resData.validation.invalidName);

      const element = document.getElementById("fullName");

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }

      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      window.alert(resData.validation.invalidPhone);

      const element = document.getElementById("phoneNumber");

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }

      return;
    }

    setIsSubmitted(true);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit();
  };

  const handleReset = () => {
    setFullName("");
    setPhone("");
    setAdults(4);
    setChildrenCount(2);
    setSelectedDate(today);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedTime("06:30 AM");
    setCustomTime("");
    setSelectedOccasion("birthdayCelebration");
    setSelectedSeating("privateRoom");
    setSpecialRequest("");
    setIsSubmitted(false);
  };

  return (
    <div className="reservation-page">
      <ReservationHero data={resData} />

      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={handleReset} />
          <div className="reservation-success-card relative z-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar w-full max-w-md shadow-2xl">
            <div className="success-icon-wrapper">
              <Check className="w-12 h-12 text-[#6b9158]" />
            </div>

            <h2 className="font-serif text-3xl text-[#212d1b] text-center mb-4">
              {resData.success.title}
            </h2>

            <p className="text-center text-[#646860] mb-8 max-w-md">
              {resData.success.desc}
            </p>

            <div className="success-details mb-8">
              <div className="success-detail-row">
                <span>{resData.success.detailLabels.branch}</span>
                <strong>{selectedBranchData.name}</strong>
              </div>

              <div className="success-detail-row">
                <span>{resData.success.detailLabels.guestName}</span>
                <strong>{fullName || resData.success.valuedGuest}</strong>
              </div>

              <div className="success-detail-row">
                <span>{resData.success.detailLabels.phone}</span>
                <strong>{phone || resData.success.notProvided}</strong>
              </div>

              <div className="success-detail-row">
                <span>{resData.success.detailLabels.guests}</span>
                <strong>
                  {formatText(resData.success.guestsValue, {
                    total: adults + childrenCount,
                    adults,
                    children: childrenCount,
                  })}
                </strong>
              </div>

              <div className="success-detail-row">
                <span>{resData.success.detailLabels.dateTime}</span>
                <strong>
                  {formatText(resData.success.dateTimeValue, {
                    date: formatDateDisplay(selectedDate),
                    time: customTime || selectedTime,
                  })}
                </strong>
              </div>

              <div className="success-detail-row">
                <span>{resData.success.detailLabels.seatingOccasion}</span>
                <strong>
                  {formatText(resData.success.seatingOccasionValue, {
                    seating: selectedSeatingData.name,
                    occasion: selectedOccasionData.name,
                  })}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="reserve-btn-primary w-full mb-4"
            >
              {resData.success.makeAnother}
            </button>
            <div className="text-center pb-2">
              <Link
                to="/"
                className="text-[#6b9158] hover:text-[#4d6a3f] font-sans text-sm font-medium underline underline-offset-4 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      <section
        className="reservation-form-section"
        aria-label={resData.form.aria}
      >
          <div className="reservation-form-container">
            <form
              className="reservation-form-main"
              onSubmit={handleReservationSubmit}
            >
              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>1</span>

                  <div>
                    <h2>{resData.steps.branch.title}</h2>
                    <p>{resData.steps.branch.desc}</p>
                  </div>
                </div>

                <div className="branch-selection-grid">
                  {branchesList.map((branch) => {
                    const isSelected = selectedBranch === branch.id;

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => setSelectedBranch(branch.id)}
                        className={`branch-card-btn text-left ${
                          isSelected ? "branch-card-btn-active" : ""
                        }`}
                      >
                        <div className="branch-card-image-wrapper">
                          <img src={branch.img} alt={branch.name} />
                        </div>

                        <div className="branch-card-content">
                          <div className="branch-card-header">
                            <h3>{branch.name}</h3>

                            {isSelected && (
                              <span className="branch-check-badge">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </span>
                            )}
                          </div>

                          <div className="branch-card-tags">
                            {branch.tags.map((tag) => (
                              <span key={tag} className="branch-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="step-divider" />

              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>2</span>

                  <div>
                    <h2>{resData.steps.contact.title}</h2>
                    <p>{resData.steps.contact.desc}</p>
                  </div>
                </div>

                <div className="contact-details-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      {resData.form.labels.fullName}
                    </label>

                    <input
                      type="text"
                      id="fullName"
                      placeholder={resData.form.placeholders.fullName}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">
                      {resData.form.labels.phoneNumber}
                    </label>

                    <input
                      type="tel"
                      id="phoneNumber"
                      placeholder={resData.form.placeholders.phoneNumber}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="step-divider" />

              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>3</span>

                  <div>
                    <h2>{resData.steps.guests.title}</h2>
                    <p>{resData.steps.guests.desc}</p>
                  </div>
                </div>

                <div className="guests-counter-container">
                  <div className="counter-row">
                    <span className="counter-label">
                      {resData.form.labels.adults}
                    </span>

                    <div className="counter-control">
                      <button
                        type="button"
                        onClick={() =>
                          setAdults((prev) => Math.max(1, prev - 1))
                        }
                        disabled={adults <= 1}
                        aria-label={resData.form.ariaLabels.decreaseAdults}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="counter-value">{adults}</span>

                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                        aria-label={resData.form.ariaLabels.increaseAdults}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="counter-row">
                    <span className="counter-label">
                      {resData.form.labels.children}
                    </span>

                    <div className="counter-control">
                      <button
                        type="button"
                        onClick={() =>
                          setChildrenCount((prev) => Math.max(0, prev - 1))
                        }
                        disabled={childrenCount <= 0}
                        aria-label={resData.form.ariaLabels.decreaseChildren}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="counter-value">{childrenCount}</span>

                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => prev + 1)}
                        aria-label={resData.form.ariaLabels.increaseChildren}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="total-guests-pill-wrapper">
                    <div className="total-guests-pill">
                      <User className="w-4 h-4 text-[#6b9158]" />

                      <span>
                        {formatText(resData.form.totalGuests, {
                          count: adults + childrenCount,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-divider" />

              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>4</span>

                  <div>
                    <h2>{resData.steps.dateTime.title}</h2>
                    <p>{resData.steps.dateTime.desc}</p>
                  </div>
                </div>

                <div className="date-time-picker-grid">
                  <div className="custom-calendar-widget">
                    <div className="calendar-header">
                      <span className="calendar-month-year">
                        {resData.calendar.months[currentMonth]} {currentYear}
                      </span>

                      <div className="calendar-nav">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          aria-label={resData.form.ariaLabels.previousMonth}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleNextMonth}
                          aria-label={resData.form.ariaLabels.nextMonth}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="calendar-grid">
                      {resData.calendar.daysOfWeek.map((day, index) => (
                        <div
                          key={`${day}-${index}`}
                          className="calendar-day-header"
                        >
                          {day}
                        </div>
                      ))}

                      {getCalendarDays().map(
                        ({ day, isCurrentMonth, date }, idx) => {
                          const isSelected =
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() === date.getMonth() &&
                            selectedDate.getFullYear() === date.getFullYear();

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`calendar-cell ${
                                !isCurrentMonth
                                  ? "calendar-cell-other-month"
                                  : ""
                              } ${isSelected ? "calendar-cell-selected" : ""}`}
                            >
                              <span>{day}</span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="time-picker-widget">
                    <div className="time-tabs">
                      {(["Breakfast", "Lunch", "Dinner"] as const).map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setTimeCategory(cat);
                              setSelectedTime(timeSlots[cat][0]);
                              setCustomTime("");
                            }}
                            className={`time-tab-btn ${
                              timeCategory === cat ? "time-tab-btn-active" : ""
                            }`}
                          >
                            {resData.timeCategories[cat]}
                          </button>
                        ),
                      )}
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
                              setCustomTime("");
                            }}
                            className={`time-slot-btn ${
                              isSelected ? "time-slot-btn-selected" : ""
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    <div
                      ref={timeInputWrapperRef}
                      className="custom-time-input-wrapper"
                    >
                      <Clock className="custom-time-icon" />

                      <input
                        type="text"
                        placeholder={resData.form.placeholders.time}
                        value={customTime}
                        onChange={(e) => {
                          setCustomTime(e.target.value);
                          setSelectedTime("");
                          setShowTimeDropdown(true);
                        }}
                        onFocus={() => setShowTimeDropdown(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape" || e.key === "Enter") {
                            setShowTimeDropdown(false);
                          }
                        }}
                      />

                      {showTimeDropdown &&
                        customTime.trim().length > 0 &&
                        filteredTimeSuggestions.length > 0 && (
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

              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>5</span>

                  <div>
                    <h2>{resData.steps.occasion.title}</h2>
                    <p>{resData.steps.occasion.desc}</p>
                  </div>
                </div>

                <div className="occasion-grid">
                  {resData.occasions.map((occasion) => {
                    const OccIcon =
                      occasionIconMap[occasion.icon] || MoreHorizontal;
                    const isSelected = selectedOccasion === occasion.id;

                    return (
                      <button
                        key={occasion.id}
                        type="button"
                        onClick={() => setSelectedOccasion(occasion.id)}
                        className={`occasion-btn-card ${
                          isSelected ? "occasion-btn-card-active" : ""
                        }`}
                      >
                        <OccIcon className="w-5 h-5 mb-2 shrink-0" />
                        <span>{occasion.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="step-divider" />

              <div className="step-container">
                <div className="reservation-step-heading mb-8">
                  <span>6</span>

                  <div>
                    <h2>{resData.steps.seating.title}</h2>
                    <p>{resData.steps.seating.desc}</p>
                  </div>
                </div>

                <div className="seating-grid">
                  {seatingPreferences.map((seating) => {
                    const isSelected = selectedSeating === seating.id;

                    return (
                      <button
                        key={seating.id}
                        type="button"
                        onClick={() => setSelectedSeating(seating.id)}
                        className={`seating-btn-card text-left ${
                          isSelected ? "seating-btn-card-active" : ""
                        }`}
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
                  <label htmlFor="specialRequest">
                    {resData.form.labels.specialRequest}
                  </label>

                  <textarea
                    id="specialRequest"
                    rows={4}
                    placeholder={resData.form.placeholders.specialRequest}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                  />
                </div>

                <div className="submit-area mt-8">
                  <button type="submit" className="reserve-btn-primary w-full">
                    {resData.form.submit}
                  </button>

                  <p className="cancel-notice text-center mt-3">
                    {resData.form.cancellationNotice}
                  </p>
                </div>
              </div>
            </form>

            <aside className="reservation-summary-card">
              <h2>{resData.summary.title}</h2>

              <div className="summary-content">
                <div className="summary-list">
                  <div className="summary-item summary-item-branch">
                    <span>{resData.summary.labels.branch}</span>
                    <strong>{selectedBranchData.name}</strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.name}</span>
                    <strong>{fullName || resData.summary.empty}</strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.contact}</span>
                    <strong>{phone || resData.summary.empty}</strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.guests}</span>
                    <strong>
                      {formatText(resData.form.totalGuests, {
                        count: adults + childrenCount,
                      })}

                      <span className="guest-breakdown">
                        {formatText(resData.summary.guestBreakdown, {
                          adults,
                          children: childrenCount,
                        })}
                      </span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.date}</span>
                    <strong>
                      {formatDateDisplay(selectedDate)}

                      <span className="time-tag">
                        {formatText(resData.summary.timeTag, {
                          time: customTime || selectedTime,
                          category: resData.timeCategories[timeCategory],
                        })}
                      </span>
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.occasion}</span>
                    <strong>{selectedOccasionData.name}</strong>
                  </div>

                  <div className="summary-item">
                    <span>{resData.summary.labels.seating}</span>
                    <strong>{selectedSeatingData.name}</strong>
                  </div>
                </div>

                <p className="arrival-notice">
                  {resData.summary.arrivalNotice}
                </p>

                <div className="summary-actions">
                  <button
                    type="button"
                    onClick={validateAndSubmit}
                    className="reserve-btn-primary w-full"
                  >
                    {resData.summary.reserveButton}
                  </button>

                  <a
                    href={resData.summary.phoneHref}
                    className="reserve-btn-secondary w-full text-center"
                  >
                    {resData.summary.contactRestaurant}
                  </a>
                </div>
              </div>
            </aside>
          </div>
      </section>

      <FaqSection faq={resData.faq} />
    </div>
  );
}
