import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

import imgHero from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp';
import imgDining from '@/assets/gallery/main-hall-dining.webp';
import imgNoodles from '@/assets/gallery/small-kuyteav-beef-no-logo.webp';
import imgWorkshop from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import imgChicken from '@/assets/gallery/kitchen-ritauls.webp';
import imgArtisanalPlating from '@/assets/gallery/artisanal-plating-no-logo.webp';
import imgChristmasWine from '@/assets/gallery/christmas-wine-display-no-logo.webp';
import imgWineToast from '@/assets/gallery/wine-toast.webp';
import imgXmasDeer from '@/assets/gallery/xmas-deer.webp';
import imgMissPlanetDining from '@/assets/gallery/miss-planet-dining.webp';
import imgCateringServiceStaff from '@/assets/gallery/catering-service-staff-no-logo.webp';
import imgStaffNumansom from '@/assets/gallery/staff-with-numansom-no-logo.webp';
import imgVitalEvent from '@/assets/gallery/vital-event.webp';
import imgOmrHospitality from '@/assets/gallery/omr-hospitality.webp';
import imgService from '@/assets/gallery/service.jpg';
import imgCatering from '@/assets/gallery/private-gatherings-no-logo.webp';
import imgRoom from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp';
import imgEvent from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp';
import imgDessertCup from '@/assets/gallery/sweet-dessert-cup.webp';
import imgGrillPlatter from '@/assets/gallery/khmer-grill-chicken-no-logo.webp';
import imgCoffeeService from '@/assets/gallery/event-coffee-service.webp';
import imgChefChoppingVegetables from '@/assets/gallery/chefchoppingvegetable.png';
import imgKuyteav from '@/assets/gallery/kuyteav.jpg';
import imgTkInterior from '@/assets/gallery/tkinterior.jpg';
import imgTkExterior from '@/assets/gallery/tkexterior.jpg';
import imgTkFishPond from '@/assets/gallery/tkfishpond.jpg';
import imgTkOutdoorDining from '@/assets/gallery/tkoutdoordining.jpg';
import imgFifteenYearAnniversary from '@/assets/gallery/15yearsanni.png';
import imgBkGrandOpening from '@/assets/gallery/bkgrandopeningceremony.jpg';
import imgChineseNewYearGift from '@/assets/gallery/chinesenewyeargift-clean.png';
import imgPchumBen from '@/assets/gallery/pchumben-clean-enhanced.png';
import imgButterflyCake from '@/assets/gallery/butterflycake.jpg';
import imgCorporateCatering from '@/assets/gallery/catering.webp';
import imgFoodPlating from '@/assets/gallery/foodplating.jpg';
import imgKhmerCakePlating from '@/assets/gallery/khmercakeplating.png';
import imgAnsom from '@/assets/gallery/ansom-clean.png';
import imgRedTableDining from '@/assets/gallery/redtabledining-clean.png';
import imgChefInKitchen from '@/assets/gallery/chefinthekitchen-clean.png';
import imgChefPlating from '@/assets/gallery/chefplating-clean.png';
import imgFoodBox from '@/assets/gallery/foodbox-clean.png';
import imgFruitPlate from '@/assets/gallery/fruitplate-clean.png';
import imgFourDishes from '@/assets/gallery/fourdishes-clean.png';
import imgBlueBirthdayDecor from '@/assets/gallery/bluedecoBD-private.png';
import imgWineSelection from '@/assets/gallery/wine-clean.png';
import imgBkChineseNewYear from '@/assets/gallery/BKchinese.png';
import imgExterior from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.webp';
import imgSiemReapChicken from '@/assets/Food/Lunch and Dinner/grilled-chicken-siemreap.webp';

import './index.css';

const filters = ['All', 'Restaurant', 'Food', 'Experience', 'Events'] as const;
type Filter = (typeof filters)[number];

type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  tag: string;
  category: Exclude<Filter, 'All'>;
  shape: 'portrait' | 'landscape' | 'square';
};

const galleryItems: GalleryItem[] = [
  { src: imgDining, alt: 'Guests enjoying the main dining hall', title: 'Main Hall Dining', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgNoodles, alt: 'A bowl of Khmer beef noodles', title: 'Rich of Flavors', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgWorkshop, alt: 'Traditional Khmer cooking workshop', title: 'Khmer Cooking Workshop', tag: 'Experience', category: 'Experience', shape: 'portrait' },
  { src: imgVitalEvent, alt: 'Guests enjoying refreshing drinks at a One More Restaurant event', title: 'Event Refreshment Moment', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgOmrHospitality, alt: 'One More Restaurant staff serving a guest at the table', title: 'One More Service Moment', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgChicken, alt: 'Khmer chicken and fragrant rice', title: 'Kitchen Rituals', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgGrillPlatter, alt: 'Guest presenting Khmer grilled chicken with fresh vegetables and dipping sauces', title: 'Khmer Grill Platter', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgSiemReapChicken, alt: 'Siem Reap grilled chicken served with traditional accompaniments', title: 'Siem Reap Grilled Chicken', tag: 'Food', category: 'Food', shape: 'landscape' },
  { src: imgArtisanalPlating, alt: 'Artfully plated Khmer dish', title: 'Artisanal Plating', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgChristmasWine, alt: 'Christmas wine bottle display', title: 'Christmas Wine Display', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgWineToast, alt: 'Guests toasting with red wine glasses', title: 'Wine Toast', tag: 'Experience', category: 'Experience', shape: 'landscape' },
  { src: imgXmasDeer, alt: 'Christmas deer display with festive lights', title: 'Christmas Deer Display', tag: 'Events', category: 'Events', shape: 'portrait' },
  { src: imgMissPlanetDining, alt: 'Miss Planet International guests dining at One More Restaurant', title: 'Miss Planet International Dining', tag: 'Experience', category: 'Experience', shape: 'landscape' },
  { src: imgCateringServiceStaff, alt: 'One More Restaurant catering service staff', title: 'Catering Service Team', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgStaffNumansom, alt: 'One More Restaurant staff presenting traditional Khmer cakes', title: 'Khmer Cake Traditions', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgCatering, alt: 'Outdoor catered celebration', title: 'Private Gatherings', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgCoffeeService, alt: 'One More Restaurant staff operating a coffee station at an event', title: 'Event Coffee Service', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgChefChoppingVegetables, alt: 'One More Restaurant chef preparing fresh vegetables in the kitchen', title: 'Freshly Prepared', tag: 'Food', category: 'Food', shape: 'landscape' },
  { src: imgKuyteav, alt: 'One More Restaurant signature kuyteav with traditional accompaniments', title: 'Signature Kuyteav', tag: 'Food', category: 'Food', shape: 'landscape' },
  { src: imgTkInterior, alt: 'Sculptural interior at One More Restaurant Toul Kork', title: 'Toul Kork Interior', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgTkExterior, alt: 'Garden and water feature at One More Restaurant Toul Kork', title: 'Toul Kork Exterior', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgTkFishPond, alt: 'Koi fish pond at One More Restaurant Toul Kork', title: 'Toul Kork Fish Pond', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgTkOutdoorDining, alt: 'Outdoor dining area at One More Restaurant Toul Kork', title: 'Toul Kork Outdoor Dining', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgFifteenYearAnniversary, alt: 'Traditional Khmer desserts celebrating One More Restaurant anniversary', title: '15th Anniversary', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgBkGrandOpening, alt: 'Traditional Khmer ceremonial arrangements for the Boeung Kak grand opening', title: 'Boeung Kak Grand Opening', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgChineseNewYearGift, alt: 'Chinese New Year orange gift basket presented by One More Restaurant staff', title: 'Chinese New Year Gift', tag: 'Events', category: 'Events', shape: 'portrait' },
  { src: imgPchumBen, alt: 'Traditional Pchum Ben gift baskets decorated with lotus flowers', title: 'Pchum Ben Traditions', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgButterflyCake, alt: 'Blue and white butterfly-shaped Khmer coconut cakes', title: 'Butterfly Coconut Cakes', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgCorporateCatering, alt: 'Corporate catering buffet and reception tables prepared by One More Restaurant', title: 'Corporate Catering', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgFoodPlating, alt: 'A table filled with plated Khmer dishes at One More Restaurant', title: 'Khmer Feast', tag: 'Food', category: 'Food', shape: 'landscape' },
  { src: imgKhmerCakePlating, alt: 'Traditional Khmer cakes presented in woven palm-leaf baskets with lotus flowers', title: 'Khmer Cake Plating', tag: 'Food', category: 'Food', shape: 'landscape' },
  { src: imgAnsom, alt: 'Traditional Khmer ansom cakes with savory and sweet fillings', title: 'Traditional Ansom', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgRedTableDining, alt: 'Red table dining room set for guests at One More Restaurant', title: 'Red Table Dining', tag: 'Restaurant', category: 'Restaurant', shape: 'square' },
  { src: imgChefInKitchen, alt: 'Chef organizing ingredients in the One More Restaurant kitchen', title: 'Chef in the Kitchen', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgChefPlating, alt: 'Chefs carefully plating dishes in the restaurant kitchen', title: 'Chef Plating', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgFoodBox, alt: 'Assorted restaurant meal boxes with Khmer dishes, fruit, and pastries', title: 'Khmer Meal Boxes', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgFruitPlate, alt: 'Decorative fresh fruit platter with a carved apple centerpiece', title: 'Fresh Fruit Art', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgFourDishes, alt: 'Four bowls of Khmer noodle dishes arranged on a wooden table', title: 'Four Khmer Favorites', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgBlueBirthdayDecor, alt: 'Blue, white, and silver birthday decorations in a private dining room', title: 'Blue Birthday Celebration', tag: 'Events', category: 'Events', shape: 'portrait' },
  { src: imgWineSelection, alt: 'Selection of red and white wine bottles with serving glasses', title: 'Wine Selection', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgBkChineseNewYear, alt: 'Boeung Kak restaurant exterior decorated with red lanterns for Chinese New Year', title: 'Chinese New Year at Boeung Kak', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgService, alt: 'Warm service in the restaurant courtyard', title: 'Khmer Hospitality', tag: 'Experience', category: 'Experience', shape: 'portrait' },
  { src: imgRoom, alt: 'Private dining room set for guests', title: 'The Private Room', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgEvent, alt: 'Floral event hall prepared for a celebration', title: 'A Day To Remember', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgDessertCup, alt: 'A sweet Khmer dessert served in a One More Restaurant cup', title: 'Sweet Refreshment', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgExterior, alt: 'One More Restaurant exterior', title: 'Canopy Entrance', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgHero, alt: 'Architectural restaurant dining room', title: 'Curves & Craft', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
];

const galleryColumnBlueprint = [
  ['Main Hall Dining', 'Signature Kuyteav', 'Khmer Meal Boxes', 'Wine Toast', 'Khmer Cooking Workshop', 'Toul Kork Exterior', 'Butterfly Coconut Cakes', 'Blue Birthday Celebration', 'Boeung Kak Grand Opening', 'One More Service Moment', 'Red Table Dining', 'The Private Room', 'Artisanal Plating', 'Corporate Catering', 'Christmas Deer Display'],
  ['Canopy Entrance', 'Freshly Prepared', 'Chef in the Kitchen', 'Fresh Fruit Art', 'Wine Selection', '15th Anniversary', 'Event Refreshment Moment', 'Toul Kork Interior', 'Khmer Feast', 'Traditional Ansom', 'Chinese New Year Gift', 'Khmer Cake Traditions', 'Toul Kork Outdoor Dining', 'Khmer Grill Platter', 'A Day To Remember', 'Catering Service Team'],
  ['Toul Kork Fish Pond', 'Rich of Flavors', 'Chef Plating', 'Four Khmer Favorites', 'Chinese New Year at Boeung Kak', 'Christmas Wine Display', 'Khmer Hospitality', 'Curves & Craft', 'Kitchen Rituals', 'Pchum Ben Traditions', 'Miss Planet International Dining', 'Khmer Cake Plating', 'Siem Reap Grilled Chicken', 'Private Gatherings', 'Sweet Refreshment', 'Event Coffee Service'],
];

const galleryShapeWeight: Record<GalleryItem['shape'], number> = {
  landscape: 0.72,
  square: 1,
  portrait: 1.22,
};

function balanceGalleryColumns<T extends Pick<GalleryItem, 'shape'>>(items: T[], maximumColumns = 3) {
  const columnCount = Math.min(maximumColumns, Math.max(1, items.length));
  const columns = Array.from({ length: columnCount }, () => [] as T[]);
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  items.forEach((item) => {
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    columns[shortestColumnIndex].push(item);
    columnHeights[shortestColumnIndex] += galleryShapeWeight[item.shape];
  });

  return columns;
}

function GalleryItemCard({
  item,
  lightboxIndex,
  onSelect,
  t,
}: {
  item: GalleryItem;
  lightboxIndex: number;
  onSelect: () => void;
  t: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article className="gallery-card">
      <button
        type="button"
        className={`gallery-image-button gallery-image-${item.shape} relative bg-[#1b2b1a] overflow-hidden`}
        onClick={onSelect}
        aria-label={`Open ${item.title}`}
      >
        {!isLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-white/10 z-0 animate-pulse" />
        )}
        <img
          src={item.src}
          alt={item.alt}
          loading={lightboxIndex > 5 ? 'lazy' : 'eager'}
          onLoad={() => setIsLoaded(true)}
          ref={(img) => {
            if (img && img.complete) {
              setIsLoaded(true);
            }
          }}
          className={`transition-opacity duration-500 relative z-10 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        <span className="gallery-image-hover z-20">
          <ZoomIn size={24} />
          <small>{t('galleryPage.aria.view', undefined, 'View image')}</small>
        </span>
      </button>
    </article>
  );
}

export default function GalleryPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFilterNavigationVisible, setIsFilterNavigationVisible] = useState(false);
  const [galleryColumnCount, setGalleryColumnCount] = useState(3);
  const masonryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobileColumns = window.matchMedia('(max-width: 900px)');
    const updateColumnCount = () => setGalleryColumnCount(mobileColumns.matches ? 2 : 3);

    updateColumnCount();
    mobileColumns.addEventListener('change', updateColumnCount);
    return () => mobileColumns.removeEventListener('change', updateColumnCount);
  }, []);

  useEffect(() => {
    const updateFilterNavigation = () => {
      const hero = document.getElementById('gallery-hero');
      setIsFilterNavigationVisible(Boolean(hero && hero.getBoundingClientRect().bottom <= 0));
    };

    window.addEventListener('scroll', updateFilterNavigation, { passive: true });
    window.addEventListener('resize', updateFilterNavigation);
    updateFilterNavigation();

    return () => {
      window.removeEventListener('scroll', updateFilterNavigation);
      window.removeEventListener('resize', updateFilterNavigation);
    };
  }, []);

  const translatedGalleryItems = useMemo(() => {
    return galleryItems.map(item => ({
      ...item,
      title: t(`galleryPage.items.${item.title}.title`, undefined, item.title),
      tag: t(`galleryPage.items.${item.title}.tag`, undefined, item.tag),
    }));
  }, [t]);

  const visibleItems = useMemo(
    () => activeFilter === 'All' ? translatedGalleryItems : translatedGalleryItems.filter((item) => item.category === activeFilter),
    [activeFilter, translatedGalleryItems],
  );

  const visibleColumns = useMemo(() => {
    if (galleryColumnCount === 2) {
      return balanceGalleryColumns(visibleItems, 2);
    }

    if (activeFilter !== 'All') {
      return balanceGalleryColumns(visibleItems);
    }

    const visibleTitles = new Set(visibleItems.map((item) => item.title));
    return galleryColumnBlueprint
      .map((titles) => titles
        .map((title) => {
          const originalItem = galleryItems.find((item) => item.title === title);
          if (!originalItem) return undefined;
          const originalIndex = galleryItems.indexOf(originalItem);
          return translatedGalleryItems[originalIndex];
        })
        .filter((item): item is typeof translatedGalleryItems[number] => Boolean(item))
        .filter((item) => visibleTitles.has(item.title)))
      .filter((column) => column.length > 0);
  }, [activeFilter, visibleItems, translatedGalleryItems, galleryColumnCount]);

  const closeLightbox = () => setSelectedIndex(null);
  const showPrevious = () => setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length);
  const showNext = () => setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length);
  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
    setSelectedIndex(null);

    requestAnimationFrame(() => {
      const masonry = masonryRef.current;
      if (!masonry) return;

      const stickyFilters = document.querySelector<HTMLElement>('.gallery-filter-bar-navigation');
      const stickyBottom = stickyFilters?.getBoundingClientRect().bottom ?? 0;
      const resultsTop = window.scrollY + masonry.getBoundingClientRect().top;

      window.scrollTo({
        top: Math.max(0, resultsTop - stickyBottom - 16),
        behavior: 'auto',
      });
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, visibleItems.length]);

  const selectedItem = selectedIndex === null ? null : visibleItems[selectedIndex];

  useEffect(() => {
    const masonry = masonryRef.current;
    if (!masonry) return;

    const cards = Array.from(masonry.querySelectorAll<HTMLElement>('.gallery-card'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('gallery-card-visible'));
      return;
    }

    masonry.classList.add('gallery-motion-ready');
    cards.forEach((card, index) => {
      card.getAnimations().forEach((animation) => animation.cancel());
      delete card.dataset.galleryRevealed;
      card.style.setProperty('--gallery-reveal-delay', `${(index % 4) * 55}ms`);
    });

    const revealCard = (card: HTMLElement) => {
      if (card.dataset.galleryRevealed === 'true') return;
      card.dataset.galleryRevealed = 'true';
      const delay = Number.parseInt(card.style.getPropertyValue('--gallery-reveal-delay'), 10) || 0;

      card.animate([
        { opacity: 0.18, filter: 'blur(4px)', transform: 'translateY(42px) scale(.97)' },
        { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
      ], {
        duration: 820,
        delay,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both',
      });
    };

    const revealVisibleCards = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.top < viewportHeight && bounds.bottom > 0) {
          revealCard(card);
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealCard(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 4% 0px',
    });

    cards.forEach((card) => observer.observe(card));
    const animationFrame = requestAnimationFrame(revealVisibleCards);
    window.addEventListener('scroll', revealVisibleCards, { passive: true });
    window.addEventListener('resize', revealVisibleCards);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', revealVisibleCards);
      window.removeEventListener('resize', revealVisibleCards);
    };
  }, [activeFilter, visibleItems.length]);

  return (
    <main className="gallery-page">
      <section className="gallery-hero" style={{ backgroundImage: `url(${imgHero})` }} id="gallery-hero">
        <div className="gallery-hero-overlay" />
        <div className="gallery-hero-content">
          <h1 className="page-hero-title">{t('galleryPage.hero.title', undefined, 'Gallery')}</h1>
          <p>{t('galleryPage.hero.desc', undefined, 'A visual journey through the flavors, craft, and atmosphere of authentic Khmer hospitality.')}</p>
        </div>
      </section>

      <section className="gallery-content" aria-label="Restaurant gallery">
        <div className="gallery-filter-slot">
          <div
            className="gallery-filter-bar"
            role="group"
            aria-label="Filter gallery by event type"
          >
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                aria-pressed={activeFilter === filter}
                onClick={() => handleFilterChange(filter)}
              >
                {t(`galleryPage.filters.${filter}`, undefined, filter)}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`gallery-filter-bar gallery-filter-bar-navigation ${
            isFilterNavigationVisible ? 'gallery-filter-bar-visible' : 'gallery-filter-bar-hidden'
          }`}
          role="group"
          aria-label="Filter gallery by event type"
        >
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              aria-pressed={activeFilter === filter}
              onClick={() => handleFilterChange(filter)}
            >
              {t(`galleryPage.filters.${filter}`, undefined, filter)}
            </button>
          ))}
        </div>

        <div ref={masonryRef} className={`gallery-masonry gallery-masonry-${visibleColumns.length}`}>
          {visibleColumns.map((column, columnIndex) => (
            <div className="gallery-column" key={`gallery-column-${columnIndex}`}>
              {column.map((item) => {
                const lightboxIndex = visibleItems.indexOf(item);
                return (
                  <GalleryItemCard
                    key={`${item.title}-${item.src}`}
                    item={item}
                    lightboxIndex={lightboxIndex}
                    onSelect={() => setSelectedIndex(lightboxIndex)}
                    t={t}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {visibleItems.length === 0 && <p className="gallery-empty">{t('galleryPage.empty', undefined, 'More moments from this collection are coming soon.')}</p>}
      </section>

      {selectedItem && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selectedItem.title} onMouseDown={(event) => event.target === event.currentTarget && closeLightbox()}>
          <button type="button" className="gallery-lightbox-close" onClick={closeLightbox} aria-label={t('galleryPage.aria.close', undefined, 'Close image')}><X size={24} /></button>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-previous" onClick={showPrevious} aria-label={t('galleryPage.aria.previous', undefined, 'Previous image')}><ChevronLeft size={30} /></button>
          <figure>
            <img src={selectedItem.src} alt={selectedItem.alt} />
          </figure>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-next" onClick={showNext} aria-label={t('galleryPage.aria.next', undefined, 'Next image')}><ChevronRight size={30} /></button>
        </div>
      )}
    </main>
  );
}
