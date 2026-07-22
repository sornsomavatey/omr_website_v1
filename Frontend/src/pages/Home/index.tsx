import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHomeData, getTestimonialsData } from '@/lib/api';
import SignatureDishes from '@/components/SignatureDishes';
import { Skeleton } from '@/components/ui/skeleton';
import LocationCard from '@/components/LocationCard';
import SharedTestimonialSection from '@/components/TestimonialSection';
import PartnerCompanySlider, {
  type PartnerCompany,
} from '@/components/PartnerCompanySlider';
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

import imgBkEdited from '@/assets/compressed_OMR Bk edited.webp';
import heroVideo from '@/assets/video/omr vdo.MOV';

import SectionHeader from '@/components/SectionHeader';

const homepagePartners: PartnerCompany[] = [
  { id: 'one-fraternity', name: 'One Fraternity', logo: '/assets/partners/onefraternity.webp' },
  { id: 'one-more-restaurant', name: 'One More Restaurant', logo: '/assets/partners/onemorerestaurant.png' },
  { id: 'one-more-kitchen', name: 'One More Kitchen', logo: '/assets/partners/onemorekitchen.png' },
  { id: 'mee-chiet', name: 'Mee Chiet', logo: '/assets/partners/meechiet.png' },
  { id: 'one-more-manufacturing', name: 'One More Manufacturing', logo: '/assets/partners/onemorefacturing.png' },
  { id: 'nmc-corporation', name: 'NMC Corporation', logo: '/assets/partners/nvc.png' },
  { id: 'vital', name: 'Vital Premium Water', logo: '/assets/partners/vital.png' },
  { id: 'amt', name: 'AMT', logo: '/assets/partners/amt-transparent.webp' },
  { id: 'amret', name: 'Amret Plc', logo: '/assets/partners/image45.webp' },
  { id: 'cisco', name: 'CISCO', logo: '/assets/partners/image2.webp' },
  { id: 'clinton-health', name: 'CLINTON Health Access Initiative', logo: '/assets/partners/image4.webp' },
  { id: 'danone', name: 'DANONE', logo: '/assets/partners/image1.webp' },
  { id: 'dynamic-entrepreneur-spark', name: 'Dynamic Enterpreneur Spark', logo: '/assets/partners/image42.webp' },
  { id: 'etiqa', name: 'eTiQa (General Insurance)', logo: '/assets/partners/image41.webp' },
  { id: 'jotun', name: 'JOTUN', logo: '/assets/partners/image40.webp' },
  { id: 'kcr-group', name: 'KCR Group', logo: '/assets/partners/image39.webp' },
  { id: 'manulife', name: 'Manulife', logo: '/assets/partners/image38.webp' },
  { id: 'netpoleon', name: 'netpoleon Network and Security', logo: '/assets/partners/image3.webp' },
  { id: 'octopus', name: 'OCTOPUS', logo: '/assets/partners/image37.webp' },
  { id: 'proseth-solutions', name: 'Proseth Solutions', logo: '/assets/partners/image36.webp' },
  { id: 'siemens', name: 'SIEMENS', logo: '/assets/partners/image35.webp' },
  { id: 'ministry-national-defence', name: 'ក្រសួងការពារជាតិ', logo: '/assets/partners/image44.webp' },
  { id: 'ministry-womens-affairs', name: 'ក្រសួងកិច្ចការនារី', logo: '/assets/partners/image43.webp' },
  { id: 'baksey-academy', name: 'Baksey academy', logo: '/assets/partners/image34.webp' },
  { id: 'tem-trading', name: 'TEM trading', logo: '/assets/partners/image33.webp' },
  { id: 'cwea', name: 'CWEA - Cambodia Women Entrepreneurs Association | Phnom Penh', logo: '/assets/partners/image32.webp' },
  { id: 'marketing-solution-asia', name: 'Marketing solution asia ltd', logo: '/assets/partners/image31.webp' },
  { id: 'bni-unicorn', name: 'BNI Unicorn Chapter', logo: '/assets/partners/image30.webp' },
  { id: 'dhl', name: 'DHL', logo: '/assets/partners/image29.webp' },
  { id: 'dksh', name: 'DKSH', logo: '/assets/partners/image28.webp' },
  { id: 'ggear', name: 'Ggear', logo: '/assets/partners/image27.webp' },
  { id: 'prudential', name: 'Prudential', logo: '/assets/partners/image26.webp' },
  { id: 'metfone', name: 'Metfone', logo: '/assets/partners/image25.webp' },
  { id: 'sambat-finance', name: 'SAMBAT - SAMBAT Finance PLC', logo: '/assets/partners/image24.webp' },
  { id: 'aws-cambodia', name: 'AWS (CAMBODIA)', logo: '/assets/partners/image23.webp' },
  { id: 'world-pop-1', name: 'World Pop Travel & Tour Group Co., Ltd.', logo: '/assets/partners/image22.webp' },
  { id: 'nippon-paint', name: 'Nippon Paint', logo: '/assets/partners/image21.webp' },
  { id: 'ppm-pharma', name: 'PPM Pharma Product Manufacturing', logo: '/assets/partners/image20.webp' },
  { id: 'rupp', name: 'RUPP', logo: '/assets/partners/image19.webp' },
  { id: 'eci-distribution', name: 'ECI Distribution Co., Ltd', logo: '/assets/partners/image18.webp' },
  { id: 'intermedica', name: 'Intermedica Co., Ltd.', logo: '/assets/partners/image17.webp' },
  { id: 'world-pop-2', name: 'World Pop Travel & Tour Group Co., Ltd.', logo: '/assets/partners/image22.webp' },
  { id: 'air-cambodia', name: 'Air Cambodia', logo: '/assets/partners/image16.webp' },
  { id: 'vietnam-airline', name: 'Vetnam Airline', logo: '/assets/partners/image15.webp' },
  { id: 'eva-air', name: 'Eva air', logo: '/assets/partners/image14.webp' },
  { id: 'cjcc', name: 'CJCC', logo: '/assets/partners/image13.webp' },
  { id: 'ecam-solution', name: 'Ecam Solution', logo: '/assets/partners/image12.webp' },
  { id: 'hrinc-cambodia', name: 'HRINC (Cambodia) Co., Ltd', logo: '/assets/partners/image11.webp' },
  { id: 'shinhan-bank', name: 'Shinhan Bank', logo: '/assets/partners/image10.webp' },
  { id: 'edtcam', name: 'EDTCAM CO.,LTD', logo: '/assets/partners/image9.webp' },
  { id: 'chief-bank', name: 'Chief Bank', logo: '/assets/partners/image8.webp' },
  { id: 'angkor-insurance', name: 'Angkor General insurance', logo: '/assets/partners/image7.webp' },
  { id: 'woori-bank', name: 'Woori Bank Cambodia', logo: '/assets/partners/image6.webp' },
  { id: 'fwd', name: 'FWD', logo: '/assets/partners/image5.webp' },
];


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

  return (
    <section
      id="home-hero"
      className="home-hero relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <video
          src={heroVideo}
          poster={imgBkEdited}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/35 pointer-events-none" />
      </div>

      <div className="home-hero-content relative z-10 text-center text-white max-w-[1260px] px-6">
        <h1 className="page-hero-title page-hero-title--home font-serif text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8 font-normal tracking-wide drop-shadow-sm">
          <span className="hero-title-top">
            {t('home.hero.titleLine1', undefined, 'Experience Authentic')}
          </span>
          <br />
          <span className="text-white">
            {t('home.hero.titleHighlight', undefined, 'Khmer Cuisine')}
          </span>
        </h1>

        <div className="home-hero-controls">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/reservations" className="custom-btn-primary">
              {t('home.hero.reserveButton', undefined, 'Reserve a Table')}
            </Link>

            <Link to="/menu" className="custom-btn-secondary">
              {t('home.hero.menuButton', undefined, 'Explore Menu')}{' '}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        className="hero-scroll-button"
        aria-label={t('home.hero.scrollAria', undefined, 'Scroll to featured cuisine section')}
      >
        <span>{t('home.hero.scroll', undefined, 'SCROLL')}</span>

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
  onMapClick,
}: {
  branches: any[];
  onDetailClick?: (branch: any) => void;
  onMapClick?: (branch: any) => void;
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
    <section className="home-locations-section w-full py-24 bg-white flex flex-col items-center">
      <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center">
        <SectionHeader
          eyebrow={t('home.locations.eyebrow')}
          title={<span className="home-locations-title">{t('home.locations.title')}</span>}
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
                onMapClick={onMapClick}
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

        <div className="home-gallery-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1200px] mb-12">
          <div className="home-gallery-column flex flex-col gap-6">
            <div className="home-gallery-tile h-[400px] rounded-none shadow-sm zoom-image-hover">
              <img
                alt={images[0]?.alt}
                className="w-full h-full object-cover"
                src={images[0]?.src || imgGallery1}
              />
            </div>

            <div className="home-gallery-pair grid grid-cols-2 gap-6">
              <div className="home-gallery-tile h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[1]?.alt}
                  className="w-full h-full object-cover"
                  src={images[1]?.src || imgGallery2}
                />
              </div>

              <div className="home-gallery-tile h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[2]?.alt}
                  className="w-full h-full object-cover"
                  src={images[2]?.src || imgGallery3}
                />
              </div>
            </div>
          </div>

          <div className="home-gallery-column flex flex-col gap-6">
            <div className="home-gallery-pair grid grid-cols-2 gap-6">
              <div className="home-gallery-tile h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[3]?.alt}
                  className="w-full h-full object-cover"
                  src={images[3]?.src || imgGallery4}
                />
              </div>

              <div className="home-gallery-tile h-[250px] rounded-none shadow-sm zoom-image-hover">
                <img
                  alt={images[4]?.alt}
                  className="w-full h-full object-cover"
                  src={images[4]?.src || imgGallery5}
                />
              </div>
            </div>

            <div className="home-gallery-tile h-[400px] rounded-none shadow-sm zoom-image-hover">
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

export default function HomePage() {
  const navigate = useNavigate();
  const { t, isKhmer } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [testimonialsData, setTestimonialsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getHomeData(), getTestimonialsData()])
      .then(([homeRes, testimonialsRes]) => {
        setData(homeRes);
        setTestimonialsData(testimonialsRes);
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
      <div className="bg-white flex flex-col items-center w-full min-h-screen">
        {/* Hero Section Skeleton */}
        <div className="relative w-full h-[600px] md:h-[700px] flex flex-col items-center justify-center overflow-hidden bg-[#1a2318] w-full">
          <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[800px] px-6 text-center">
            <Skeleton className="h-4 w-32 bg-white/10 rounded-full" />
            <Skeleton className="h-16 w-4/5 md:h-[90px] bg-white/10 rounded-xl" />
            <Skeleton className="h-5 w-2/3 bg-white/10 rounded-lg mt-2" />
            <Skeleton className="h-4 w-1/2 bg-white/10 rounded-lg" />
            <Skeleton className="h-12 w-40 bg-white/15 rounded-lg mt-6 animate-pulse" />
          </div>
        </div>

        {/* Signature Dishes Section Skeleton */}
        <div className="w-full max-w-[1440px] px-6 md:px-[64px] py-20 flex flex-col items-center">
          <Skeleton className="h-4 w-28 mb-3 rounded-full bg-muted" />
          <Skeleton className="h-10 w-64 mb-14 rounded-xl bg-muted" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 border border-gold/10 p-5 rounded-2xl bg-[#fafdf8]/50 w-full">
                <Skeleton className="w-full aspect-[4/3] rounded-xl bg-muted" />
                <Skeleton className="h-4 w-20 rounded-full bg-muted" />
                <Skeleton className="h-6 w-3/4 rounded-lg bg-muted" />
                <div className="flex flex-col gap-2 mt-1">
                  <Skeleton className="h-3 w-full rounded bg-muted" />
                  <Skeleton className="h-3 w-5/6 rounded bg-muted" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-6 w-16 rounded bg-muted" />
                  <Skeleton className="h-10 w-28 rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dining Spaces Section Skeleton */}
        <div className="w-full bg-[#f4f7f2] py-20 flex flex-col items-center">
          <div className="w-full max-w-[1440px] px-6 md:px-[64px] flex flex-col items-center">
            <Skeleton className="h-4 w-24 mb-3 rounded-full bg-muted" />
            <Skeleton className="h-10 w-80 mb-14 rounded-xl bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="w-full aspect-[16/10] rounded-2xl bg-muted" />
                <Skeleton className="h-7 w-1/3 rounded-lg bg-muted" />
                <Skeleton className="h-4 w-full rounded bg-muted" />
                <Skeleton className="h-4 w-4/5 rounded bg-muted" />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="w-full aspect-[16/10] rounded-2xl bg-muted" />
                <Skeleton className="h-7 w-1/3 rounded-lg bg-muted" />
                <Skeleton className="h-4 w-full rounded bg-muted" />
                <Skeleton className="h-4 w-4/5 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
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

  const testimonialsList: Testimonial[] = (testimonialsData || []).map((item: any) => ({
    ...item,
    ...(isKhmer ? item.translations?.kh : {}),
    avatar: imageMap[item.avatar] || item.avatar,
  }));

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
        onMapClick={(branch) => {
          if (branch.id === 'toulKork') {
            navigate('/branches/toul-kork#visit-us');
          } else if (branch.id === 'boeungKak') {
            navigate('/branches/boeung-kak#visit-us');
          } else {
            navigate('/branches#see-us-on-map');
          }
        }}
      />
      <GallerySection gallery={data.gallery} />
      <SharedTestimonialSection
        eyebrow={t('home.testimonials.eyebrow')}
        title={t('home.testimonials.title')}
        description={t('home.testimonials.description')}
        testimonials={testimonialsList}
        className="home-testimonials-section"
        isKhmer={isKhmer}
      />
      <PartnerCompanySlider
        partners={homepagePartners}
        eyebrow={t('home.partners.eyebrow')}
        title={t('home.partners.title')}
        description={t('home.partners.description')}
        durationSeconds={150}
      />
    </div>
  );
}
