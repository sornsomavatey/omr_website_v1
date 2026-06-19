import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/app/layouts/NavBar';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Clock,
} from 'lucide-react';

import {
  svgPaths,
  imgHeroBg1,
  imgHeroBg2,
  imgGallery1,
  imgGallery2,
  imgGallery3,
  imgGallery4,
  imgGallery5,
  imgGallery6,
  signatureDishes,
  diningSpaces,
  branches,
  testimonials,
} from './homeAssets';

import type {
  SignatureDish,
  DiningSpace,
  Branch,
  Testimonial,
} from './homeTypes';

import './index.css';
import DishCard from '@/components/ui/dish-card';

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

function HeroSection() {
  return (
    <section id="home-hero" className="relative w-full h-[1080px] flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">

        <img
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
          src={imgHeroBg2}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-32">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8 font-normal tracking-wide drop-shadow-lg">
          Experience Authentic <br />
          <span className="text-[#E7F6DF]">Khmer Cuisine</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl font-sans font-light max-w-2xl mx-auto leading-relaxed mb-12">
          Traditional Cambodian flavors served in a modern dining experience. Crafted with
          passion, fresh local organic produce, and heirloom recipes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/reservations" className="custom-btn-primary">
            Reserve a Table
          </Link>

          <Link to="/menu" className="custom-btn-secondary">
            Explore Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce cursor-pointer">
        <span className="text-[10px] tracking-widest font-sans font-medium">
          SCROLL
        </span>

        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

function SignatureDishesSection() {
  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center">
        <SectionHeader
          eyebrow="Our Signature Dishes"
          title="Featured Khmer Cuisine"
          description="Each dish tells a story of Cambodia's culinary heritage, crafted with heirloom recipes and seasonal, locally sourced ingredients."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {signatureDishes.map((dish, index) => (
            <DishCard
              key={`${dish.name}-${index}`}
              index={index}
              name={dish.name}
              category={dish.category}
              description={dish.desc}
              image={dish.img}
              price={dish.price}
              badge={dish.badge}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/menu" className="custom-btn-outline-green">
            View all menu
          </Link>
        </div>
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

function SpacesSection() {
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
            {diningSpaces.map((space, index) => (
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

function LocationsSection() {
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

function GallerySection() {
  const galleryImages = [
    { src: imgGallery1, alt: 'Gallery 1' },
    { src: imgGallery2, alt: 'Gallery 2' },
    { src: imgGallery3, alt: 'Gallery 3' },
    { src: imgGallery4, alt: 'Gallery 4' },
    { src: imgGallery5, alt: 'Gallery 5' },
    { src: imgGallery6, alt: 'Gallery 6' },
  ];

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
                alt={galleryImages[0].alt}
                className="w-full h-full object-cover"
                src={galleryImages[0].src}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={galleryImages[1].alt}
                  className="w-full h-full object-cover"
                  src={galleryImages[1].src}
                />
              </div>

              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={galleryImages[2].alt}
                  className="w-full h-full object-cover"
                  src={galleryImages[2].src}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={galleryImages[3].alt}
                  className="w-full h-full object-cover"
                  src={galleryImages[3].src}
                />
              </div>

              <div className="h-[250px] rounded-3xl shadow-sm zoom-image-hover">
                <img
                  alt={galleryImages[4].alt}
                  className="w-full h-full object-cover"
                  src={galleryImages[4].src}
                />
              </div>
            </div>

            <div className="h-[400px] rounded-3xl shadow-sm zoom-image-hover">
              <img
                alt={galleryImages[5].alt}
                className="w-full h-full object-cover"
                src={galleryImages[5].src}
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

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative z-10 space-y-8">
      <p className="text-[#444841] text-lg md:text-xl font-sans font-light leading-relaxed">
        {testimonial.text}
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-[#6b9158]/10">
        <img
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#6b9158]/25"
          src={testimonial.avatar}
        />

        <div className="text-left">
          <h4 className="font-sans font-bold text-[#212d1b] text-base leading-snug">
            {testimonial.name}
          </h4>

          <span className="text-xs text-[#646860]/80 font-sans font-light">
            {testimonial.date}
          </span>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const currentTestimonial = testimonials[currentTestimonialIndex];

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
    <section className="w-full py-24 bg-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] flex flex-col items-center">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Guests Say"
          description="Experiences shared by our valued customers."
        />

        <div className="w-full max-w-[850px] bg-[#e7f6df]/35 border border-[#6b9158]/10 rounded-3xl p-8 md:p-12 relative flex flex-col justify-between shadow-sm">
          <div className="text-6xl text-[#6b9158]/20 font-serif leading-none absolute top-6 left-8">
            “
          </div>

          <TestimonialCard testimonial={currentTestimonial} />

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handlePrevTestimonial}
              className="w-10 h-10 rounded-full border border-[#6b9158]/20 hover:border-[#6b9158] text-[#6b9158] flex items-center justify-center hover:bg-[#6b9158]/5 transition-all cursor-pointer active:scale-90"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNextTestimonial}
              className="w-10 h-10 rounded-full border border-[#6b9158]/20 hover:border-[#6b9158] text-[#6b9158] flex items-center justify-center hover:bg-[#6b9158]/5 transition-all cursor-pointer active:scale-90"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="bg-[#304625] w-full" data-name="footer">
      <div className="max-w-[1440px] mx-auto content-stretch flex flex-col gap-16 pb-12 pt-24 px-6 md:px-[80px] relative w-full text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-12 border-b border-white/10">
          <div className="max-w-xs space-y-6">
            <Link to="/" className="inline-block">
              <svg className="w-[64px] h-[78px]" viewBox="0 0 49 59" fill="none">
                <path d={svgPaths.pd305680} fill="#F6FDF2" />
              </svg>
            </Link>

            <p className="text-white/80 text-sm leading-relaxed font-sans font-light">
              Redefining the boundaries of Khmer gastronomy through a commitment to heritage
              and innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 sm:gap-16">
            <div className="space-y-4">
              <h4 className="text-[#E7F6DF] font-sans font-bold text-xs uppercase tracking-widest">
                Explore
              </h4>

              <ul className="space-y-3 text-sm font-sans font-light text-white/70">
                <li>
                  <Link to="/menu" className="hover:text-[#E7F6DF] transition-colors">
                    Menu
                  </Link>
                </li>

                <li>
                  <Link to="/restaurants" className="hover:text-[#E7F6DF] transition-colors">
                    Branches
                  </Link>
                </li>

                <li>
                  <Link to="/about" className="hover:text-[#E7F6DF] transition-colors">
                    Story
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="hover:text-[#E7F6DF] transition-colors">
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[#E7F6DF] font-sans font-bold text-xs uppercase tracking-widest">
                Legal
              </h4>

              <ul className="space-y-3 text-sm font-sans font-light text-white/70">
                <li>
                  <Link to="/" className="hover:text-[#E7F6DF] transition-colors">
                    Terms
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#E7F6DF] transition-colors">
                    Privacy
                  </Link>
                </li>

                <li>
                  <Link to="/" className="hover:text-[#E7F6DF] transition-colors">
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[#E7F6DF] font-sans font-bold text-xs uppercase tracking-widest">
                Contact
              </h4>

              <ul className="space-y-3 text-sm font-sans font-light text-white/70">
                <li>
                  <Link to="/contact" className="hover:text-[#E7F6DF] transition-colors">
                    Booking Inquiry
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="hover:text-[#E7F6DF] transition-colors">
                    Press
                  </Link>
                </li>

                <li>
                  <Link to="/careers" className="hover:text-[#E7F6DF] transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-white/60 font-sans font-light">
          <p>© 2026 One More Restaurant. All Rights Reserved.</p>

          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E7F6DF] transition-colors"
            >
              Instagram
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E7F6DF] transition-colors"
            >
              Facebook
            </a>

            <a
              href="https://tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E7F6DF] transition-colors"
            >
              TripAdvisor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white flex flex-col items-center w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SignatureDishesSection />
      <SpacesSection />
      <LocationsSection />
      <GallerySection />
      <TestimonialsSection />
      <HomeFooter />
    </div>
  );
}