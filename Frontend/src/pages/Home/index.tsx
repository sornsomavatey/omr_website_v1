import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHomeData } from '@/lib/api';
import SignatureDishes from '@/components/SignatureDishes';
import LocationCard from '@/components/LocationCard';
import { useTranslation } from '@/hooks/useTranslation';
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

import SectionHeader from '@/components/SectionHeader';


function HeroSection({ hero }: { hero: any }) {
  const { t } = useTranslation();
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
          {t('home.hero.titleLine1')}
          <br />
          <span className="text-[#E7F6DF]">{t('home.hero.titleHighlight')}</span>
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
        aria-label={t('home.hero.scrollAria')}
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
  const { t } = useTranslation();
  const spaceScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollSpaces = (direction: 'left' | 'right') => {
    if (!spaceScrollContainerRef.current) return;

    const scrollAmount = direction === 'left' ? -400 : 400;

    spaceScrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const spaceKeys = ['family', 'privateRoom', 'business', 'kidZone', 'event'];

  return (
    <section className="w-full py-24 bg-[#212d1b] text-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] flex flex-col items-center">
        <SectionHeader
          eyebrow={t('home.spaces.eyebrow')}
          title={t('home.spaces.title')}
          description={t('home.spaces.description')}
          dark
        />

        <div className="relative w-full flex flex-col items-center gap-8">
          <div
            ref={spaceScrollContainerRef}
            className="w-full flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4"
          >
            {spaces.map((space, index) => {
              const key = spaceKeys[index] || 'family';
              const translatedSpace = {
                ...space,
                name: t(`home.spaces.items.${key}.name`, undefined, space.name),
                tag: t(`home.spaces.items.${key}.tag`, undefined, space.tag),
                desc: t(`home.spaces.items.${key}.description`, undefined, space.desc),
              };
              return <SpaceCard key={`${space.name}-${index}`} space={translatedSpace} />;
            })}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => scrollSpaces('left')}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label={t('home.spaces.previous')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollSpaces('right')}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label={t('home.spaces.next')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationsSection({
  branches,
  onDetailClick,
}: {
  branches: any[];
  onDetailClick?: (branch: any) => void;
}) {
  const { t } = useTranslation();

  const tagKeyMap: Record<string, string> = {
    "Family Friendly": "home.locations.tags.familyFriendly",
    "Business Meeting": "home.locations.tags.businessMeeting",
    "Private Room": "home.locations.tags.privateRoom",
    "Event Space": "home.locations.tags.eventSpace",
    "Large Groups": "home.locations.tags.largeGroups",
    "Corporate": "home.locations.tags.corporate",
  };

  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center">
        <SectionHeader
          eyebrow={t('home.locations.eyebrow')}
          title={t('home.locations.title')}
          description={t('home.locations.description')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto text-left">
          {branches.map((branch) => {
            const key = branch.id;
            const translatedBranch = {
              ...branch,
              name: t(`home.locations.items.${key}.name`, undefined, branch.name),
              address: t(`home.locations.items.${key}.address`, undefined, branch.address),
              hours: t(`home.locations.items.${key}.hours`, undefined, branch.hours),
              tags: branch.tags.map((tag: string) => t(tagKeyMap[tag] || tag, undefined, tag)),
            };
            return (
              <LocationCard
                key={branch.id}
                branch={translatedBranch}
                onDetailClick={onDetailClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ gallery }: { gallery: any[] }) {
  const { t } = useTranslation();
  const imageKeys = ['one', 'two', 'three', 'four', 'five', 'six'];
  const images = gallery.map((item, index) => {
    const key = imageKeys[index] || 'one';
    return {
      src: imageMap[item.src] || item.src,
      alt: t(`home.gallery.images.${key}`, undefined, item.alt),
    };
  });

  return (
    <section className="w-full py-24 bg-[#fafaf9] flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center">
        <SectionHeader
          eyebrow={t('home.gallery.eyebrow')}
          title={t('home.gallery.title')}
          description={t('home.gallery.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1200px] mb-12">
          <div className="flex flex-col gap-6">
            <div className="h-[400px] rounded-none shadow-sm zoom-image-hover">
              <img
                alt={images[0]?.alt}
                className="w-full h-full object-cover"
                src={images[0]?.src || imgGallery1}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[1]?.alt}
                  className="w-full h-full object-cover"
                  src={images[1]?.src || imgGallery2}
                />
              </div>

              <div className="h-[250px] rounded-none shadow-sm zoom-image-hover">
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
              <div className="h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[3]?.alt}
                  className="w-full h-full object-cover"
                  src={images[3]?.src || imgGallery4}
                />
              </div>

              <div className="h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[4]?.alt}
                  className="w-full h-full object-cover"
                  src={images[4]?.src || imgGallery5}
                />
              </div>
            </div>

            <div className="h-[400px] rounded-none shadow-sm zoom-image-hover">
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
          className="inline-flex items-center justify-center min-h-[48px] px-9 rounded-full bg-white border border-[#c8dfc3] text-[#354330] hover:border-[#6b9659] hover:text-[#6b9659] hover:bg-[#6b9659]/5 text-sm font-sans font-medium transition-all duration-200"
        >
          {t('home.gallery.viewFull')}
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
  const { t } = useTranslation();
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
          eyebrow={t('home.testimonials.eyebrow')}
          title={t('home.testimonials.title')}
          description={t('home.testimonials.description')}
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
            aria-label={t('home.testimonials.previous')}
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
            aria-label={t('home.testimonials.next')}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        {t('home.loading', undefined, 'Loading home...')}
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

  const branchesList: any[] = data.branches.map((branch: any) => ({
    id: branch.name.toLowerCase().includes('toul') ? 'toulKork' : 'boeungKak',
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    hours: branch.hours,
    image: imageMap[branch.img] || branch.img,
    tags: branch.tags,
  }));

  const testimonialKeys = ['sophea', 'david', 'piseth', 'emma'];
  const testimonialsList: Testimonial[] = data.testimonials.map((item: any, index: number) => {
    const key = testimonialKeys[index] || 'sophea';
    return {
      ...item,
      text: t(`home.testimonials.items.${key}.text`, undefined, item.text),
      date: t(`home.testimonials.items.${key}.date`, undefined, item.date),
      avatar: imageMap[item.avatar] || item.avatar,
    };
  });

  return (
    <div className="bg-white flex flex-col items-center w-full overflow-x-hidden">
      <HeroSection hero={data.hero} />
      <SignatureDishes dishes={signatureDishesList} />
      <SpacesSection spaces={diningSpacesList} />
      <LocationsSection
        branches={branchesList}
        onDetailClick={(branch) => {
          if (branch.id === 'toulKork') {
            navigate('/branches/toul-kork');
          } else if (branch.id === 'boeungKak') {
            navigate('/branches/boeung-kak');
          } else {
            navigate('/branches');
          }
        }}
      />
      <GallerySection gallery={data.gallery} />
      <TestimonialsSection testimonials={testimonialsList} />
    </div>
  );
}