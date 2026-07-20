import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

import imgHero from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp';
import imgDining from '@/assets/gallery/main-hall-dining.webp';
import imgNoodles from '@/assets/gallery/small-kuyteav-beef-no-logo.png';
import imgWorkshop from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import imgChicken from '@/assets/gallery/kitchen-ritauls.webp';
import imgArtisanalPlating from '@/assets/gallery/artisanal-plating-no-logo.png';
import imgChristmasWine from '@/assets/gallery/christmas-wine-display-no-logo.png';
import imgWineToast from '@/assets/gallery/wine-toast.webp';
import imgXmasDeer from '@/assets/gallery/xmas-deer.webp';
import imgMissPlanetDining from '@/assets/gallery/miss-planet-dining.webp';
import imgCateringServiceStaff from '@/assets/gallery/catering-service-staff-no-logo.png';
import imgStaffNumansom from '@/assets/gallery/staff-with-numansom-no-logo.png';
import imgVitalEvent from '@/assets/gallery/vital-event.webp';
import imgOmrHospitality from '@/assets/gallery/omr-hospitality.webp';
import imgService from '@/assets/gallery/khmer-hospitality-no-logo.png';
import imgCatering from '@/assets/gallery/private-gatherings-no-logo.png';
import imgRoom from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp';
import imgEvent from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp';
import imgChildren from '@/assets/gallery/little-moment-no-logo.png';
import imgDessertCup from '@/assets/gallery/sweet-dessert-cup.webp';
import imgGrillPlatter from '@/assets/gallery/khmer-grill-platter.webp';
import imgCoffeeService from '@/assets/gallery/event-coffee-service.webp';
import imgExterior from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.webp';

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
  { src: imgGrillPlatter, alt: 'Guest presenting a generous Khmer grilled-food platter', title: 'Khmer Grill Platter', tag: 'Food', category: 'Food', shape: 'portrait' },
  { src: imgArtisanalPlating, alt: 'Artfully plated Khmer dish', title: 'Artisanal Plating', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgChristmasWine, alt: 'Christmas wine bottle display', title: 'Christmas Wine Display', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgWineToast, alt: 'Guests toasting with red wine glasses', title: 'Wine Toast', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgXmasDeer, alt: 'Christmas deer display with festive lights', title: 'Christmas Deer Display', tag: 'Events', category: 'Events', shape: 'portrait' },
  { src: imgMissPlanetDining, alt: 'Miss Planet International guests dining at One More Restaurant', title: 'Miss Planet International Dining', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgCateringServiceStaff, alt: 'One More Restaurant catering service staff', title: 'Catering Service Team', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgStaffNumansom, alt: 'One More Restaurant staff presenting traditional Khmer cakes', title: 'Khmer Cake Traditions', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgCatering, alt: 'Outdoor catered celebration', title: 'Private Gatherings', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgCoffeeService, alt: 'One More Restaurant staff operating a coffee station at an event', title: 'Event Coffee Service', tag: 'Events', category: 'Events', shape: 'square' },
  { src: imgService, alt: 'Warm service in the restaurant courtyard', title: 'Khmer Hospitality', tag: 'Experience', category: 'Experience', shape: 'portrait' },
  { src: imgRoom, alt: 'Private dining room set for guests', title: 'The Private Room', tag: 'Restaurant', category: 'Restaurant', shape: 'portrait' },
  { src: imgEvent, alt: 'Floral event hall prepared for a celebration', title: 'A Day To Remember', tag: 'Events', category: 'Events', shape: 'landscape' },
  { src: imgChildren, alt: 'Children enjoying a creative activity', title: 'Little Moments', tag: 'Experience', category: 'Experience', shape: 'square' },
  { src: imgDessertCup, alt: 'A sweet Khmer dessert served in a One More Restaurant cup', title: 'Sweet Refreshment', tag: 'Food', category: 'Food', shape: 'square' },
  { src: imgExterior, alt: 'One More Restaurant exterior', title: 'Canopy Entrance', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
  { src: imgHero, alt: 'Architectural restaurant dining room', title: 'Curves & Craft', tag: 'Restaurant', category: 'Restaurant', shape: 'landscape' },
];

const galleryColumnBlueprint = [
  ['Canopy Entrance', 'Khmer Cooking Workshop', 'Miss Planet International Dining', 'Artisanal Plating', 'Khmer Cake Traditions', 'Kitchen Rituals', 'Wine Toast', 'Little Moments'],
  ['Main Hall Dining', 'One More Service Moment', 'Curves & Craft', 'Christmas Wine Display', 'Rich of Flavors', 'Private Gatherings', 'Khmer Hospitality', 'Sweet Refreshment'],
  ['Event Refreshment Moment', 'Christmas Deer Display', 'Khmer Grill Platter', 'Catering Service Team', 'The Private Room', 'Event Coffee Service', 'A Day To Remember'],
];

const galleryShapeWeight: Record<GalleryItem['shape'], number> = {
  landscape: 0.72,
  square: 1,
  portrait: 1.22,
};

function balanceGalleryColumns<T extends Pick<GalleryItem, 'shape'>>(items: T[]) {
  const columnCount = Math.min(3, Math.max(1, items.length));
  const columns = Array.from({ length: columnCount }, () => [] as T[]);
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  items.forEach((item) => {
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    columns[shortestColumnIndex].push(item);
    columnHeights[shortestColumnIndex] += galleryShapeWeight[item.shape];
  });

  return columns;
}

export default function GalleryPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
  }, [activeFilter, visibleItems, translatedGalleryItems]);

  const closeLightbox = () => setSelectedIndex(null);
  const showPrevious = () => setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length);
  const showNext = () => setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length);

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
        <div className="gallery-filter-bar" role="group" aria-label="Filter gallery by event type">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              aria-pressed={activeFilter === filter}
              onClick={() => {
                setActiveFilter(filter);
                setSelectedIndex(null);
              }}
            >
              {t(`galleryPage.filters.${filter}`, undefined, filter)}
            </button>
          ))}
        </div>

        <div className={`gallery-masonry gallery-masonry-${visibleColumns.length}`}>
          {visibleColumns.map((column, columnIndex) => (
            <div className="gallery-column" key={`gallery-column-${columnIndex}`}>
              {column.map((item) => {
                const lightboxIndex = visibleItems.indexOf(item);
                return (
                  <article className="gallery-card" key={`${item.title}-${item.src}`}>
                    <button type="button" className={`gallery-image-button gallery-image-${item.shape}`} onClick={() => setSelectedIndex(lightboxIndex)} aria-label={`Open ${item.title}`}>
                      <img src={item.src} alt={item.alt} loading={lightboxIndex > 5 ? 'lazy' : 'eager'} />
                      <span className="gallery-image-hover"><ZoomIn size={24} /><small>{t('galleryPage.aria.view', undefined, 'View image')}</small></span>
                    </button>
                    <div className="gallery-card-caption"><h2>{item.title}</h2><span>{item.tag}</span></div>
                  </article>
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
            <figcaption><strong>{selectedItem.title}</strong><span>{selectedItem.tag}</span></figcaption>
          </figure>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-next" onClick={showNext} aria-label={t('galleryPage.aria.next', undefined, 'Next image')}><ChevronRight size={30} /></button>
        </div>
      )}
    </main>
  );
}
