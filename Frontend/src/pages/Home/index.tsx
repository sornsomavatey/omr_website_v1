import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

import {
  imgAvatar1,
  imgAvatar2,
  imgAvatar3,
  imgAvatar4,
  imgBranch1,
  imgDish1,
  imgDish2,
  imgDish3,
  imgGallery1,
  imgGallery2,
  imgGallery3,
  imgGallery4,
  imgGallery5,
  imgGallery6,
  imgHeroBg1,
  imgHeroBg2,
  imgSpace1,
  imgSpace2,
} from './homeAssets';

import type {
  Branch,
  DiningSpace,
  SignatureDish,
  Testimonial,
} from './homeTypes';

import './index.css';

const signatureDishes: SignatureDish[] = [
  {
    nameKey: 'home.signature.items.amok.name',
    categoryKey: 'home.signature.items.amok.category',
    descKey: 'home.signature.items.amok.description',
    img: imgDish2,
    price: '$24',
    badgeKey: 'home.signature.items.amok.badge',
  },
  {
    nameKey: 'home.signature.items.lokLak.name',
    categoryKey: 'home.signature.items.lokLak.category',
    descKey: 'home.signature.items.lokLak.description',
    img: imgDish1,
    price: '$22',
    badgeKey: 'home.signature.items.lokLak.badge',
  },
  {
    nameKey: 'home.signature.items.bbq.name',
    categoryKey: 'home.signature.items.bbq.category',
    descKey: 'home.signature.items.bbq.description',
    img: imgDish3,
    price: '$28',
    badgeKey: 'home.signature.items.bbq.badge',
  },
];

const diningSpaces: DiningSpace[] = [
  {
    nameKey: 'home.spaces.items.family.name',
    tagKey: 'home.spaces.items.family.tag',
    descKey: 'home.spaces.items.family.description',
    img: imgHeroBg1,
  },
  {
    nameKey: 'home.spaces.items.privateRoom.name',
    tagKey: 'home.spaces.items.privateRoom.tag',
    descKey: 'home.spaces.items.privateRoom.description',
    img: imgHeroBg2,
  },
  {
    nameKey: 'home.spaces.items.business.name',
    tagKey: 'home.spaces.items.business.tag',
    descKey: 'home.spaces.items.business.description',
    img: imgHeroBg1,
  },
  {
    nameKey: 'home.spaces.items.kidZone.name',
    tagKey: 'home.spaces.items.kidZone.tag',
    descKey: 'home.spaces.items.kidZone.description',
    img: imgSpace1,
  },
  {
    nameKey: 'home.spaces.items.event.name',
    tagKey: 'home.spaces.items.event.tag',
    descKey: 'home.spaces.items.event.description',
    img: imgSpace2,
  },
];

const branches: Branch[] = [
  {
    nameKey: 'home.locations.items.toulKork.name',
    addressKey: 'home.locations.items.toulKork.address',
    phone: '023 888 222',
    hoursKey: 'home.locations.items.toulKork.hours',
    img: imgBranch1,
    tagKeys: [
      'home.locations.tags.familyFriendly',
      'home.locations.tags.businessMeeting',
      'home.locations.tags.privateRoom',
    ],
  },
  {
    nameKey: 'home.locations.items.boeungKak.name',
    addressKey: 'home.locations.items.boeungKak.address',
    phone: '023 888 222',
    hoursKey: 'home.locations.items.boeungKak.hours',
    img: imgHeroBg2,
    tagKeys: [
      'home.locations.tags.eventSpace',
      'home.locations.tags.largeGroups',
      'home.locations.tags.corporate',
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    name: 'Sophea Prak',
    dateKey: 'home.testimonials.items.sophea.date',
    textKey: 'home.testimonials.items.sophea.text',
    avatar: imgAvatar1,
  },
  {
    name: 'David Chen',
    dateKey: 'home.testimonials.items.david.date',
    textKey: 'home.testimonials.items.david.text',
    avatar: imgAvatar2,
  },
  {
    name: 'Piseth Bun',
    dateKey: 'home.testimonials.items.piseth.date',
    textKey: 'home.testimonials.items.piseth.text',
    avatar: imgAvatar3,
  },
  {
    name: 'Emma Watson',
    dateKey: 'home.testimonials.items.emma.date',
    textKey: 'home.testimonials.items.emma.text',
    avatar: imgAvatar4,
  },
];

const galleryImages = [
  { img: imgGallery1, altKey: 'home.gallery.images.one' },
  { img: imgGallery2, altKey: 'home.gallery.images.two' },
  { img: imgGallery3, altKey: 'home.gallery.images.three' },
  { img: imgGallery4, altKey: 'home.gallery.images.four' },
  { img: imgGallery5, altKey: 'home.gallery.images.five' },
  { img: imgGallery6, altKey: 'home.gallery.images.six' },
];

export default function HomePage() {
  const { t } = useTranslation();

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const spaceScrollContainerRef = useRef<HTMLDivElement>(null);

  const activeTestimonial = testimonials[currentTestimonialIndex];

  const handleScrollDown = () => {
    const targetSection = document.getElementById('menu');

    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollSpaces = (direction: 'left' | 'right') => {
    if (!spaceScrollContainerRef.current) {
      return;
    }

    const scrollAmount = direction === 'left' ? -400 : 400;

    spaceScrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white flex flex-col items-center w-full overflow-x-hidden">
      <section
        id="home-hero"
        className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">

          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            src={imgHeroBg2}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-32">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8 font-normal tracking-wide drop-shadow-lg">
            {t('home.hero.titleLine1')}
            <br />
            <span className="text-[#E7F6DF]">
              {t('home.hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl font-sans font-light max-w-2xl mx-auto leading-relaxed mb-12">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/reservations" className="custom-btn-primary">
              {t('home.hero.reserveButton')}
            </Link>

            <Link to="/menu" className="custom-btn-secondary">
              {t('home.hero.menuButton')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleScrollDown}
          className="hero-scroll-button"
          aria-label={t(
            'home.hero.scrollAria',
            undefined,
            'Scroll to featured cuisine section'
          )}
        >
          <span>{t('home.hero.scroll')}</span>

          <svg
            className="hero-scroll-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </section>

      <section id="menu" className="featured-cuisine-section">
        <div className="featured-cuisine-pattern" aria-hidden="true" />

        <div className="featured-cuisine-container">
          <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            {t('home.signature.eyebrow')}
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#212d1b] font-normal tracking-wide mb-6 text-center">
            {t('home.signature.title')}
          </h2>

          <p className="text-[#444841] text-base md:text-lg font-sans font-light max-w-2xl mx-auto mb-12 text-center leading-relaxed">
            {t('home.signature.description')}
          </p>

          <div className="featured-cuisine-collage">
            {Array.from({ length: 8 }).map((_, index) => {
              const dish = signatureDishes[index % signatureDishes.length];

              return (
                <div
                  key={`${dish.nameKey}-${index}`}
                  className={`cuisine-tile cuisine-tile-${index + 1}`}
                >
                  <img src={dish.img} alt={t(dish.nameKey)} />
                </div>
              );
            })}

            <span
              className="cuisine-decoration cuisine-decoration-left"
              aria-hidden="true"
            />

            <span
              className="cuisine-decoration cuisine-decoration-right"
              aria-hidden="true"
            />

            <div className="cuisine-center-circle">
              <img
                src={signatureDishes[2].img}
                alt={t(signatureDishes[2].nameKey)}
              />
            </div>
          </div>

          <Link to="/menu" className="custom-btn-outline-green">
            {t('home.signature.viewAll')}
          </Link>
        </div>
      </section>

      <section className="w-full py-24 bg-[#212d1b] text-white flex flex-col items-center">
        <div className="max-w-[1440px] w-full px-6 md:px-[64px] flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            {t('home.spaces.eyebrow')}
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#f6fdf2] font-normal tracking-wide mb-6 text-center">
            {t('home.spaces.title')}
          </h2>

          <p className="text-[#e7f6df]/80 text-base md:text-lg font-sans font-light max-w-2xl mx-auto mb-16 text-center leading-relaxed">
            {t('home.spaces.description')}
          </p>

          <div className="relative w-full flex flex-col items-center gap-8">
            <div
              ref={spaceScrollContainerRef}
              className="w-full flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4"
            >
              {diningSpaces.map((space) => (
                <div
                  key={space.nameKey}
                  className="space-card w-[300px] sm:w-[450px] md:w-[600px] lg:w-[720px] group"
                >
                  <div className="relative h-[350px] md:h-[480px] zoom-image-hover">
                    <img
                      alt={t(space.nameKey)}
                      className="w-full h-full object-cover"
                      src={space.img}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2416] via-[#1a2416]/10 to-transparent" />
                  </div>

                  <div className="p-8 text-left">
                    <span className="text-[#6b9158] text-[10px] font-sans font-bold uppercase tracking-widest mb-2 block">
                      {t(space.tagKey)}
                    </span>

                    <h3 className="font-serif text-3xl md:text-4xl text-[#f6fdf2] font-normal mb-4">
                      {t(space.nameKey)}
                    </h3>

                    <p className="text-[#e7f6df]/70 text-sm font-sans font-light leading-relaxed max-w-xl">
                      {t(space.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => scrollSpaces('left')}
                aria-label={t(
                  'home.spaces.previous',
                  undefined,
                  'Previous space'
                )}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollSpaces('right')}
                aria-label={t(
                  'home.spaces.next',
                  undefined,
                  'Next space'
                )}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-white flex flex-col items-center">
        <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center">
          <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            {t('home.locations.eyebrow')}
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#212d1b] font-normal tracking-wide mb-6">
            {t('home.locations.title')}
          </h2>

          <p className="text-[#646860] text-base md:text-lg font-sans font-light max-w-xl mx-auto mb-16">
            {t('home.locations.description')}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto text-left">
            {branches.map((branch) => (
              <div key={branch.nameKey} className="location-card group">
                <div className="h-[360px] md:h-[440px] zoom-image-hover relative">
                  <img
                    alt={t(branch.nameKey)}
                    className="w-full h-full object-cover"
                    src={branch.img}
                  />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {branch.tagKeys.map((tagKey) => (
                      <span
                        key={tagKey}
                        className="bg-white/95 text-[#212d1b] text-[10px] font-sans font-medium tracking-wide px-3 py-1 rounded-full shadow-sm"
                      >
                        {t(tagKey)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
                  <div className="space-y-6 mb-8">
                    <h3 className="font-serif text-3xl text-[#212d1b] font-normal leading-snug">
                      {t(branch.nameKey)}
                    </h3>

                    <div className="space-y-3 font-sans text-sm text-[#444841]/90">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#6b9158] shrink-0" />
                        <span>{t(branch.addressKey)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#6b9158] shrink-0" />
                        <span className="underline cursor-pointer">
                          {branch.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#6b9158] shrink-0" />
                        <span>{t(branch.hoursKey)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-[#f0f2f0]">
                    <Link
                      to="/contact"
                      className="px-6 py-3 border border-[#dde0dc] hover:border-[#212d1b] text-[#212d1b] text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all"
                    >
                      {t('home.locations.detail')}
                    </Link>

                    <Link
                      to="/contact"
                      className="px-6 py-3 border border-[#dde0dc] hover:border-[#212d1b] text-[#212d1b] text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all"
                    >
                      {t('home.locations.map')}
                    </Link>

                    <Link
                      to="/reservations"
                      className="px-8 py-3 bg-[#6b9158] hover:bg-[#5b7d4a] text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full shadow-md transition-all ml-auto"
                    >
                      {t('home.locations.reserve')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-[#fafaf9] flex flex-col items-center">
        <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            {t('home.gallery.eyebrow')}
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#212d1b] font-normal tracking-wide mb-6">
            {t('home.gallery.title')}
          </h2>

          <p className="text-[#646860] text-base md:text-lg font-sans font-light max-w-2xl mx-auto mb-16">
            {t('home.gallery.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1200px] mb-12">
            <div className="flex flex-col gap-6">
              <div className="h-[400px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={t(galleryImages[0].altKey)}
                  className="w-full h-full object-cover"
                  src={galleryImages[0].img}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                  <img
                    alt={t(galleryImages[1].altKey)}
                    className="w-full h-full object-cover"
                    src={galleryImages[1].img}
                  />
                </div>

                <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                  <img
                    alt={t(galleryImages[2].altKey)}
                    className="w-full h-full object-cover"
                    src={galleryImages[2].img}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                  <img
                    alt={t(galleryImages[3].altKey)}
                    className="w-full h-full object-cover"
                    src={galleryImages[3].img}
                  />
                </div>

                <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                  <img
                    alt={t(galleryImages[4].altKey)}
                    className="w-full h-full object-cover"
                    src={galleryImages[4].img}
                  />
                </div>
              </div>

              <div className="h-[400px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={t(galleryImages[5].altKey)}
                  className="w-full h-full object-cover"
                  src={galleryImages[5].img}
                />
              </div>
            </div>
          </div>

          <Link
            to="/gallery"
            className="px-8 py-3.5 border-2 border-[#6b9158] hover:bg-[#6b9158] text-[#6b9158] hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300"
          >
            {t('home.gallery.viewFull')}
          </Link>
        </div>
      </section>

      <section className="w-full py-24 bg-white flex flex-col items-center">
        <div className="max-w-[1440px] w-full px-6 md:px-[64px] flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            {t('home.testimonials.eyebrow')}
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#212d1b] font-normal tracking-wide mb-6 text-center">
            {t('home.testimonials.title')}
          </h2>

          <p className="text-[#646860] text-base md:text-lg font-sans font-light max-w-xl mx-auto mb-16 text-center">
            {t('home.testimonials.description')}
          </p>

          <div className="w-full max-w-[850px] bg-[#e7f6df]/35 border border-[#6b9158]/10 rounded-3xl p-8 md:p-12 relative flex flex-col justify-between shadow-sm">
            <div className="text-6xl text-[#6b9158]/20 font-serif leading-none absolute top-6 left-8">
              “
            </div>

            <div className="relative z-10 space-y-8">
              <p className="text-[#444841] text-lg md:text-xl font-sans font-light leading-relaxed">
                {t(activeTestimonial.textKey)}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[#6b9158]/10">
                <img
                  alt={activeTestimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#6b9158]/25"
                  src={activeTestimonial.avatar}
                />

                <div className="text-left">
                  <h4 className="font-sans font-bold text-[#212d1b] text-base leading-snug">
                    {activeTestimonial.name}
                  </h4>

                  <span className="text-xs text-[#646860]/80 font-sans font-light">
                    {t(activeTestimonial.dateKey)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                aria-label={t(
                  'home.testimonials.previous',
                  undefined,
                  'Previous testimonial'
                )}
                className="w-10 h-10 rounded-full border border-[#6b9158]/20 hover:border-[#6b9158] text-[#6b9158] flex items-center justify-center hover:bg-[#6b9158]/5 transition-all cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextTestimonial}
                aria-label={t(
                  'home.testimonials.next',
                  undefined,
                  'Next testimonial'
                )}
                className="w-10 h-10 rounded-full border border-[#6b9158]/20 hover:border-[#6b9158] text-[#6b9158] flex items-center justify-center hover:bg-[#6b9158]/5 transition-all cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
