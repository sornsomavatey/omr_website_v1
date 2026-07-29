import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

import imgHero from '@/assets/gallery/galleryhero.webp';
import imgArchitecturalDining from '@/assets/home-v2/curved-wood-interior.webp';
import imgDining from '@/assets/gallery/main-hall-dining.webp';
import imgNoodles from '@/assets/gallery/small-kuyteav-beef-no-logo.webp';
import imgWorkshop from '@/assets/home-v2/corporate-meeting.webp';
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
import imgService from '@/assets/gallery/service.webp';
import imgCatering from '@/assets/gallery/private-gatherings-no-logo.webp';
import imgRoom from '@/assets/home-v2/private-dining-room.webp';
import imgEvent from '@/assets/home-v2/event-celebration.webp';
import imgDessertCup from '@/assets/gallery/sweet-dessert-cup.webp';
import imgGrillPlatter from '@/assets/gallery/khmer-grill-chicken-no-logo.webp';
import imgCoffeeService from '@/assets/gallery/event-coffee-service.webp';
import imgChefChoppingVegetables from '@/assets/gallery/chefchoppingvegetable.webp';
import imgKuyteav from '@/assets/gallery/kuyteav.webp';
import imgTkInterior from '@/assets/gallery/tkinterior.webp';
import imgTkExterior from '@/assets/gallery/tkexterior.webp';
import imgTkFishPond from '@/assets/gallery/tkfishpond.jpg';
import imgTkOutdoorDining from '@/assets/gallery/tkoutdoordining.webp';
import imgFifteenYearAnniversary from '@/assets/gallery/15yearsanni.webp';
import imgBkGrandOpening from '@/assets/gallery/bkgrandopeningceremony.webp';
import imgChineseNewYearGift from '@/assets/gallery/chinesenewyeargift-clean.webp';
import imgPchumBen from '@/assets/gallery/pchumben-clean-enhanced.webp';
import imgButterflyCake from '@/assets/gallery/butterflycake.webp';
import imgCorporateCatering from '@/assets/gallery/catering.webp';
import imgFoodPlating from '@/assets/gallery/foodplating.webp';
import imgKhmerCakePlating from '@/assets/gallery/khmercakeplating.webp';
import imgAnsom from '@/assets/gallery/ansom-clean.webp';
import imgRedTableDining from '@/assets/gallery/redtabledining-clean.webp';
import imgChefInKitchen from '@/assets/gallery/chefinthekitchen-clean.webp';
import imgTkChef from '@/assets/gallery/tkchef-clean.png';
import imgFoodBox from '@/assets/gallery/foodbox-clean.webp';
import imgFruitPlate from '@/assets/gallery/fruitplate-clean.webp';
import imgFourDishes from '@/assets/gallery/fourdishes-clean.webp';
import imgBlueBirthdayDecor from '@/assets/gallery/bluedecoBD-clean.webp';
import imgWineSelection from '@/assets/gallery/wine-clean.webp';
import imgBkChineseNewYear from '@/assets/gallery/BKchinese.webp';
import imgBkDiningRoom from '@/assets/gallery/Bkdiningroom.webp';
import imgBkFrontYard from '@/assets/gallery/bkfrontyard.webp';
import imgBkChanchaiya from '@/assets/gallery/Bkchanchaiya.webp';
import imgBkRoom from '@/assets/gallery/bkroom.webp';
import imgBkOutsideRoom from '@/assets/gallery/bkoutsideroom.webp';
import imgTkRoomService from '@/assets/gallery/tkroomservice.webp';
import imgGalaDinner from '@/assets/gallery/galadinner.webp';
import imgRedBirthday from '@/assets/gallery/redbirthday-name-removed.webp';
import imgExterior from '@/assets/home-v2/toul-kork-exterior.webp';
import imgSiemReapChicken from '@/assets/gallery/grilled-chicken-salt-chilli.webp';
import imgEventHero from '@/assets/engagegreenv2-clean-v2.webp';
import imgFamilyCelebration from '@/assets/roundtablebk.webp';
import imgEngagementPackage from '@/assets/engagegreen-names-blurred.webp';
import imgMeetingRoom from '@/assets/corporateroomwhite.webp';
import imgCorporatePackage from '@/assets/cooporatepacakage.webp';
import imgVipRoom from '@/assets/bkfamilyroom.webp';

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
  { src: imgBkDiningRoom, alt: 'Private round-table dining room at One More Restaurant Boeung Kak', title: 'Boeung Kak Private Dining', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgBkFrontYard, alt: 'Curved open-air dining terrace at One More Restaurant Boeung Kak', title: 'Boeung Kak Garden Terrace', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgBkRoom, alt: 'Private dining room with garden views at One More Restaurant Boeung Kak', title: 'Boeung Kak Garden Room', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgBkChanchaiya, alt: 'Chanchaiya room entrance at One More Restaurant Boeung Kak', title: 'Chanchaiya Room', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgBkOutsideRoom, alt: 'Warmly lit private dining room corridor at One More Restaurant Boeung Kak', title: 'Boeung Kak Private Room Corridor', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgTkRoomService, alt: 'One More Restaurant Toul Kork hosts welcoming guests at a private dining room', title: 'Toul Kork Guest Welcome', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
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
  { src: imgTkChef, alt: 'One More Restaurant chef carefully plating a dish in the kitchen', title: 'Chef Plating', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgFoodBox, alt: 'Assorted restaurant meal boxes with Khmer dishes, fruit, and pastries', title: 'Khmer Meal Boxes', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgFruitPlate, alt: 'Decorative fresh fruit platter with a carved apple centerpiece', title: 'Fresh Fruit Art', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgFourDishes, alt: 'Four bowls of Khmer noodle dishes arranged on a wooden table', title: 'Four Khmer Favorites', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgBlueBirthdayDecor, alt: 'Blue, white, and silver birthday decorations in a private dining room', title: 'Blue Birthday Celebration', tag: 'Events', category: 'Events', shape: 'portrait' },
  { src: imgWineSelection, alt: 'Selection of red and white wine bottles with serving glasses', title: 'Wine Selection', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgBkChineseNewYear, alt: 'Boeung Kak restaurant exterior decorated with red lanterns for Chinese New Year', title: 'Chinese New Year at Boeung Kak', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgService, alt: 'Warm service in the restaurant courtyard', title: 'Khmer Hospitality', tag: 'Experience', category: 'Experience', shape: 'portrait' },
  { src: imgRoom, alt: 'Private dining room set for guests', title: 'The Private Room', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgEvent, alt: 'Floral event hall prepared for a celebration', title: 'A Day To Remember', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgEventHero, alt: 'Celebration hall prepared for a special event', title: 'Celebrate Every Special Moment', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgFamilyCelebration, alt: 'Private round-table room prepared for a family celebration', title: 'Family Celebration Room', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgEngagementPackage, alt: 'Green engagement celebration table setting', title: 'Engagement Celebration', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgMeetingRoom, alt: 'Bright private meeting room with a long conference table', title: 'Meeting Room Package', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgCorporatePackage, alt: 'Corporate event hall arranged with presentation seating', title: 'Corporate Event Package', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgVipRoom, alt: 'Private VIP dining room prepared for an event', title: 'VIP Private Event Room', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgGalaDinner, alt: 'Elegant gala dinner arranged for guests at One More Restaurant', title: 'Gala Dinner', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgRedBirthday, alt: 'Red and white birthday celebration in a private dining room', title: 'Red Birthday Celebration', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgDessertCup, alt: 'A sweet Khmer dessert served in a One More Restaurant cup', title: 'Sweet Refreshment', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgExterior, alt: 'One More Restaurant exterior', title: 'Canopy Entrance', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgArchitecturalDining, alt: 'Architectural restaurant dining room', title: 'Curves & Craft', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
];

const foodGalleryOrder = [
  imgTkChef,
  imgFoodPlating,
  imgKuyteav,
  imgFruitPlate,
  imgSiemReapChicken,
  imgButterflyCake,
  imgNoodles,
  imgArtisanalPlating,
  imgChefChoppingVegetables,
  imgFourDishes,
  imgGrillPlatter,
  imgDessertCup,
  imgKhmerCakePlating,
  imgFoodBox,
  imgAnsom,
  imgChicken,
  imgChefInKitchen,
] as const;

const foodGalleryRank = new Map<string, number>(
  foodGalleryOrder.map((src, index) => [src, index]),
);

const restaurantGalleryOrder = [
  imgTkInterior,
  imgBkFrontYard,
  imgExterior,
  imgBkDiningRoom,
  imgTkFishPond,
  imgBkRoom,
  imgDining,
  imgTkOutdoorDining,
  imgBkChanchaiya,
  imgArchitecturalDining,
  imgRedTableDining,
  imgTkExterior,
  imgBkOutsideRoom,
  imgBkChineseNewYear,
  imgRoom,
  imgTkRoomService,
] as const;

const restaurantGalleryRank = new Map<string, number>(
  restaurantGalleryOrder.map((src, index) => [src, index]),
);

const experienceGalleryOrder = [
  imgWorkshop,
  imgMissPlanetDining,
  imgWineToast,
  imgOmrHospitality,
  imgStaffNumansom,
  imgVitalEvent,
  imgService,
  imgWineSelection,
] as const;

const experienceGalleryRank = new Map<string, number>(
  experienceGalleryOrder.map((src, index) => [src, index]),
);

const eventsGalleryOrder = [
  imgEventHero,
  imgEngagementPackage,
  imgGalaDinner,
  imgRedBirthday,
  imgFamilyCelebration,
  imgCorporatePackage,
  imgMeetingRoom,
  imgVipRoom,
  imgEvent,
  imgBkGrandOpening,
  imgCatering,
  imgBlueBirthdayDecor,
  imgCorporateCatering,
  imgFifteenYearAnniversary,
  imgCoffeeService,
  imgChineseNewYearGift,
  imgCateringServiceStaff,
  imgPchumBen,
  imgChristmasWine,
  imgXmasDeer,
] as const;

const eventsGalleryRank = new Map<string, number>(
  eventsGalleryOrder.map((src, index) => [src, index]),
);

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

function shuffleGalleryItems<T>(items: T[], shuffleVersion: number) {
  if (shuffleVersion === 0) return items;

  const shuffled = [...items];
  let seed = shuffleVersion * 2654435761;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
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
  const [shuffleVersion, setShuffleVersion] = useState(0);
  const masonryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shuffleInterval = window.setInterval(() => {
      setShuffleVersion((version) => version + 1);
      setSelectedIndex(null);
    }, 5 * 60 * 1000);

    return () => window.clearInterval(shuffleInterval);
  }, []);

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

  const visibleItems = useMemo(() => {
    if (activeFilter === 'All') {
      return shuffleGalleryItems(translatedGalleryItems, shuffleVersion);
    }

    const filteredItems = translatedGalleryItems.filter((item) => item.category === activeFilter);

    if (activeFilter === 'Food') {
      return shuffleGalleryItems([...filteredItems].sort(
        (first, second) =>
          (foodGalleryRank.get(first.src) ?? Number.MAX_SAFE_INTEGER)
          - (foodGalleryRank.get(second.src) ?? Number.MAX_SAFE_INTEGER),
      ), shuffleVersion);
    }

    if (activeFilter === 'Restaurant') {
      return shuffleGalleryItems([...filteredItems].sort(
        (first, second) =>
          (restaurantGalleryRank.get(first.src) ?? Number.MAX_SAFE_INTEGER)
          - (restaurantGalleryRank.get(second.src) ?? Number.MAX_SAFE_INTEGER),
      ), shuffleVersion);
    }

    if (activeFilter === 'Experience') {
      return shuffleGalleryItems([...filteredItems].sort(
        (first, second) =>
          (experienceGalleryRank.get(first.src) ?? Number.MAX_SAFE_INTEGER)
          - (experienceGalleryRank.get(second.src) ?? Number.MAX_SAFE_INTEGER),
      ), shuffleVersion);
    }

    if (activeFilter === 'Events') {
      return shuffleGalleryItems([...filteredItems].sort(
        (first, second) =>
          (eventsGalleryRank.get(first.src) ?? Number.MAX_SAFE_INTEGER)
          - (eventsGalleryRank.get(second.src) ?? Number.MAX_SAFE_INTEGER),
      ), shuffleVersion);
    }

    return shuffleGalleryItems(filteredItems, shuffleVersion);
  }, [activeFilter, translatedGalleryItems, shuffleVersion]);

  const visibleColumns = useMemo(() => {
    return balanceGalleryColumns(visibleItems, galleryColumnCount);
  }, [visibleItems, galleryColumnCount]);

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
