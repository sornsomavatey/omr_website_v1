import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData } from '@/lib/api';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Clock,
  User,
} from 'lucide-react';

import {
  imgHeroBg1,
  imgHeroBg2,
  imgGallery1,
  imgGallery2,
  imgGallery3,
  imgGallery4,
  imgGallery5,
  imgGallery6,
  imageMap,
} from './homeAssets';

import type {
  SignatureDish,
  DiningSpace,
  Branch,
  Testimonial,
} from './homeTypes';

import './index.css';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
        <span className="w-10 h-[1px] bg-[#6b9158]" />
        {eyebrow}
        <span className="w-10 h-[1px] bg-[#6b9158]" />
      </div>

      <h2
        className={`font-serif text-4xl md:text-5xl font-normal tracking-wide mb-6 ${
          dark ? 'text-[#f6fdf2]' : 'text-[#212d1b]'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-base md:text-lg font-sans font-light max-w-2xl mx-auto mb-16 leading-relaxed ${
            dark ? 'text-[#e7f6df]/80' : 'text-[#646860]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function HeroSection({ hero }: { hero: any }) {
  const handleScrollDown = () => {
    const targetSection = document.getElementById('menu');

    if (!targetSection) return;

    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const bgImage = imageMap[hero.backgroundImage] || imgHeroBg2;

  return (
    <section
      id="home-hero"
      className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
          src={bgImage}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/45" />
      </div>

      <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-32">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8 font-normal tracking-wide drop-shadow-lg">
          {hero.title.includes('Khmer Cuisine') ? (
            <>
              {hero.title.replace('Khmer Cuisine', '')}
              <br />
              <span className="text-[#E7F6DF]">Khmer Cuisine</span>
            </>
          ) : (
            hero.title
          )}
        </h1>

        <p className="text-white/80 text-lg md:text-xl font-sans font-light max-w-2xl mx-auto leading-relaxed mb-12">
          {hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/reservations" className="custom-btn-primary">
            {hero.cta_reserve}
          </Link>

          <Link to="/menu" className="custom-btn-secondary">
            {hero.cta_menu} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        className="hero-scroll-button"
        aria-label="Scroll to featured cuisine section"
      >
        <span>SCROLL</span>

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
  );
}

function SignatureDishesSection({ dishes }: { dishes: SignatureDish[] }) {
  return (
    <section id="menu" className="featured-cuisine-section">
      <div className="featured-cuisine-pattern" aria-hidden="true" />

      <div className="featured-cuisine-container">
        <SectionHeader
          eyebrow="Our Signature Dishes"
          title="Featured Khmer Cuisine"
          description="Each dish tells a story of Cambodia's culinary heritage, crafted with heirloom recipes and seasonal ingredients."
        />

        <div className="featured-cuisine-collage">
          {Array.from({ length: 8 }).map((_, index) => {
            const dish = dishes[index % dishes.length];

            return (
              <div
                key={`${dish.name}-${index}`}
                className={`cuisine-tile cuisine-tile-${index + 1}`}
              >
                <img src={dish.img} alt={dish.name} />
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
              src={dishes[0]?.img}
              alt={dishes[0]?.name}
            />
          </div>
        </div>

        <Link to="/menu" className="custom-btn-outline-green">
          View all menu
        </Link>
      </div>
    </section>
  );
}

function SpaceCard({ space }: { space: DiningSpace }) {
  return (
    <div className="space-card w-[300px] sm:w-[450px] md:w-[600px] lg:w-[720px] group">
      <div className="relative h-[350px] md:h-[480px] zoom-image-hover">
        <img
          alt={space.name}
          className="w-full h-full object-cover"
          src={space.img}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2416] via-[#1a2416]/10 to-transparent" />
      </div>

      <div className="p-8 text-left">
        <span className="text-[#6b9158] text-[10px] font-sans font-bold uppercase tracking-widest mb-2 block">
          {space.tag}
        </span>

        <h3 className="font-serif text-3xl md:text-4xl text-[#f6fdf2] font-normal mb-4">
          {space.name}
        </h3>

        <p className="text-[#e7f6df]/70 text-sm font-sans font-light leading-relaxed max-w-xl">
          {space.desc}
        </p>
      </div>
    </div>
  );
}

function SpacesSection({ spaces }: { spaces: DiningSpace[] }) {
  const spaceScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollSpaces = (direction: 'left' | 'right') => {
    if (!spaceScrollContainerRef.current) return;

    const scrollAmount = direction === 'left' ? -400 : 400;

    spaceScrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full py-24 bg-[#212d1b] text-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] flex flex-col items-center">
        <SectionHeader
          eyebrow="Our Space"
          title="Designed for Every Occasion"
          description="From intimate family meals to polished boardroom lunches, every corner of One More is crafted to make your moment feel extraordinary."
          dark
        />

        <div className="relative w-full flex flex-col items-center gap-8">
          <div
            ref={spaceScrollContainerRef}
            className="w-full flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4"
          >
            {spaces.map((space, index) => (
              <SpaceCard key={`${space.name}-${index}`} space={space} />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => scrollSpaces('left')}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Scroll spaces left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollSpaces('right')}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Scroll spaces right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationCard({ branch }: { branch: Branch }) {
  return (
    <div className="location-card group">
      <div className="h-[360px] md:h-[440px] zoom-image-hover relative">
        <img
          alt={branch.name}
          className="w-full h-full object-cover"
          src={branch.img}
        />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {branch.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white/95 text-[#212d1b] text-[10px] font-sans font-medium tracking-wide px-3 py-1 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
        <div className="space-y-6 mb-8">
          <h3 className="font-serif text-3xl text-[#212d1b] font-normal leading-snug">
            {branch.name}
          </h3>

          <div className="space-y-3 font-sans text-sm text-[#444841]/90">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#6b9158] shrink-0" />
              <span>{branch.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#6b9158] shrink-0" />
              <span className="underline cursor-pointer">{branch.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#6b9158] shrink-0" />
              <span>{branch.hours}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-[#f0f2f0]">
          <Link
            to="/contact"
            className="px-6 py-3 border border-[#dde0dc] hover:border-[#212d1b] text-[#212d1b] text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all"
          >
            Detail
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 border border-[#dde0dc] hover:border-[#212d1b] text-[#212d1b] text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all"
          >
            Map
          </Link>

          <Link
            to="/reservations"
            className="px-8 py-3 bg-[#6b9158] hover:bg-[#5b7d4a] text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full shadow-md transition-all ml-auto"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </div>
  );
}

function LocationsSection({ branches }: { branches: Branch[] }) {
  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center">
        <SectionHeader
          eyebrow="Our Locations"
          title="Choose Your Experience"
          description="Two distinct dining destinations, one unforgettable culinary story."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto text-left">
          {branches.map((branch, index) => (
            <LocationCard key={`${branch.name}-${index}`} branch={branch} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ gallery }: { gallery: any[] }) {
  const images = gallery.map((item) => ({
    src: imageMap[item.src] || item.src,
    alt: item.alt,
  }));

  return (
    <section className="w-full py-24 bg-[#fafaf9] flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center">
        <SectionHeader
          eyebrow="Our Story in Frames"
          title="Moments of Excellence"
          description="Every frame is a feeling — from the first flame to the final toast."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1200px] mb-12">
          <div className="flex flex-col gap-6">
            <div className="h-[400px] rounded-3xl shadow-sm zoom-image-hover">
              <img
                alt={images[0]?.alt}
                className="w-full h-full object-cover"
                src={images[0]?.src || imgGallery1}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={images[1]?.alt}
                  className="w-full h-full object-cover"
                  src={images[1]?.src || imgGallery2}
                />
              </div>

              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={images[2]?.alt}
                  className="w-full h-full object-cover"
                  src={images[2]?.src || imgGallery3}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={images[3]?.alt}
                  className="w-full h-full object-cover"
                  src={images[3]?.src || imgGallery4}
                />
              </div>

              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={images[4]?.alt}
                  className="w-full h-full object-cover"
                  src={images[4]?.src || imgGallery5}
                />
              </div>
            </div>

            <div className="h-[400px] rounded-3xl shadow-sm zoom-image-hover">
              <img
                alt={images[5]?.alt}
                className="w-full h-full object-cover"
                src={images[5]?.src || imgGallery6}
              />
            </div>
          </div>
        </div>

        <Link
          to="/gallery"
          className="px-8 py-3.5 border-2 border-[#6b9158] hover:bg-[#6b9158] text-[#6b9158] hover:text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300"
        >
          View Full Gallery
        </Link>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <article className="testimonial-card">
      <div
        className="testimonial-stars"
        aria-label="5 out of 5 stars"
      >
        <span aria-hidden="true">★★★★★</span>
      </div>

      <span
        className="testimonial-quote-mark"
        aria-hidden="true"
      >
        “
      </span>

      <p className="testimonial-card-text">
        {testimonial.text}
      </p>

      <div className="testimonial-author">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="testimonial-avatar"
        />

        <div className="testimonial-author-copy">
          <h3>{testimonial.name}</h3>
          <span>{testimonial.date}</span>
        </div>
      </div>
    </article>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] =
    useState(0);

  const orderedTestimonials = Array.from(
    { length: testimonials.length },
    (_, offset) =>
      testimonials[
        (currentTestimonialIndex + offset) % testimonials.length
      ]
  );

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((previousIndex) =>
      Math.max(previousIndex - 1, 0)
    );
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((previousIndex) =>
      Math.min(previousIndex + 1, testimonials.length - 1)
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentTestimonialIndex(index);
  };

  return (
    <section
      className="testimonials-section"
      aria-labelledby="testimonials-title"
    >
      <div className="testimonials-container">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Guests Say"
          description="Experiences shared by our valued customers"
        />

        <div className="testimonials-viewport">
          <div
            key={currentTestimonialIndex}
            className="testimonials-track"
          >
            {orderedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${currentTestimonialIndex}-${testimonial.name}-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        <div className="testimonials-navigation">
          <button
            type="button"
            className="testimonial-navigation-button"
            onClick={handlePrevTestimonial}
            disabled={currentTestimonialIndex === 0}
            aria-label="Previous testimonial"
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div
            className="testimonial-dots"
            aria-label="Choose testimonial"
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={`${testimonial.name}-${index}`}
                type="button"
                className={`testimonial-dot ${
                  currentTestimonialIndex === index
                    ? 'testimonial-dot-active'
                    : ''
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={
                  currentTestimonialIndex === index ? 'true' : undefined
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="testimonial-navigation-button"
            onClick={handleNextTestimonial}
            disabled={
              currentTestimonialIndex === testimonials.length - 1
            }
            aria-label="Next testimonial"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHomeData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load home page data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        Loading home...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-28 pb-20 text-center text-red-500 font-serif text-xl min-h-screen flex items-center justify-center">
        {error || 'No data available.'}
      </div>
    );
  }

  // Map home page arrays with image reference resolver
  const signatureDishesList: SignatureDish[] = data.signatureDishes.map((dish: any) => ({
    ...dish,
    img: imageMap[dish.img] || dish.img,
  }));

  const diningSpacesList: DiningSpace[] = data.diningSpaces.map((space: any) => ({
    ...space,
    img: imageMap[space.img] || space.img,
  }));

  const branchesList: Branch[] = data.branches.map((branch: any) => ({
    ...branch,
    img: imageMap[branch.img] || branch.img,
  }));

  const testimonialsList: Testimonial[] = data.testimonials.map((t: any) => ({
    ...t,
    avatar: imageMap[t.avatar] || t.avatar,
  }));

  return (
    <div className="bg-white flex flex-col items-center w-full overflow-x-hidden">
      <HeroSection hero={data.hero} />
      <SignatureDishesSection dishes={signatureDishesList} />
      <SpacesSection spaces={diningSpacesList} />
      <LocationsSection branches={branchesList} />
      <GallerySection gallery={data.gallery} />
      <TestimonialsSection testimonials={testimonialsList} />
    </div>
  );
}