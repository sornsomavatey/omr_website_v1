import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import imgHero from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.png';
import imgDining from '@/assets/Event & Celebrations card 03.png';
import imgNoodles from '@/assets/Food/Breakfast/small-kuyteav-beef.png';
import imgWorkshop from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png';
import imgChicken from '@/assets/home-v2/13a7aa4dee36d6ba805abc6f982eb04ec7df4c4c.png';
import imgAmok from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png';
import imgService from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.png';
import imgCatering from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.png';
import imgRoom from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.png';
import imgEvent from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.png';
import imgChildren from '@/assets/home-v2/e8f4b56e423777f3f6c3df39c6ef78914b278e17.png';
import imgExterior from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png';

import './index.css';

const filters = ['All', 'Wedding', 'Corporate', 'Birthday', 'Engagement', 'Conference', 'Private Party'] as const;
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
  { src: imgDining, alt: 'Guests enjoying the main dining hall', title: 'Main Hall Dining', tag: 'Restaurant', category: 'Corporate', shape: 'portrait' },
  { src: imgNoodles, alt: 'A bowl of Khmer beef noodles', title: 'Street Flavors', tag: 'Food', category: 'Private Party', shape: 'square' },
  { src: imgWorkshop, alt: 'Traditional Khmer cooking workshop', title: 'Khmer Cooking Workshop', tag: 'Experience', category: 'Corporate', shape: 'portrait' },
  { src: imgChicken, alt: 'Khmer chicken and fragrant rice', title: 'Kitchen Rituals', tag: 'Food', category: 'Wedding', shape: 'portrait' },
  { src: imgAmok, alt: 'Traditional fish amok presentation', title: 'Artisanal Plating', tag: 'Food', category: 'Engagement', shape: 'square' },
  { src: imgCatering, alt: 'Outdoor catered celebration', title: 'Private Gatherings', tag: 'Events', category: 'Engagement', shape: 'landscape' },
  { src: imgService, alt: 'Warm service in the restaurant courtyard', title: 'Khmer Hospitality', tag: 'People', category: 'Birthday', shape: 'portrait' },
  { src: imgRoom, alt: 'Private dining room set for guests', title: 'The Private Room', tag: 'Restaurant', category: 'Conference', shape: 'portrait' },
  { src: imgEvent, alt: 'Floral event hall prepared for a celebration', title: 'A Day To Remember', tag: 'Events', category: 'Wedding', shape: 'landscape' },
  { src: imgChildren, alt: 'Children enjoying a creative activity', title: 'Little Moments', tag: 'Family', category: 'Birthday', shape: 'square' },
  { src: imgExterior, alt: 'One More Restaurant exterior', title: 'Canopy Entrance', tag: 'Restaurant', category: 'Private Party', shape: 'landscape' },
  { src: imgHero, alt: 'Architectural restaurant dining room', title: 'Curves & Craft', tag: 'Design', category: 'Conference', shape: 'landscape' },
];

const galleryColumnBlueprint = [
  ['Main Hall Dining', 'Kitchen Rituals', 'The Private Room'],
  ['Street Flavors', 'Artisanal Plating', 'Khmer Hospitality', 'Private Gatherings', 'Little Moments'],
  ['Khmer Cooking Workshop', 'A Day To Remember', 'Canopy Entrance', 'Curves & Craft'],
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => activeFilter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  const visibleColumns = useMemo(() => {
    const visibleTitles = new Set(visibleItems.map((item) => item.title));
    return galleryColumnBlueprint
      .map((titles) => titles
        .map((title) => galleryItems.find((item) => item.title === title))
        .filter((item): item is GalleryItem => Boolean(item))
        .filter((item) => visibleTitles.has(item.title)))
      .filter((column) => column.length > 0);
  }, [visibleItems]);

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
          <span>One More Restaurant</span>
          <h1>Gallery</h1>
          <p>A visual journey through the flavors, craft, and atmosphere of authentic Khmer hospitality.</p>
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
              {filter}
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
                      <span className="gallery-image-hover"><ZoomIn size={24} /><small>View image</small></span>
                    </button>
                    <div className="gallery-card-caption"><h2>{item.title}</h2><span>{item.tag}</span></div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>

        {visibleItems.length === 0 && <p className="gallery-empty">More moments from this collection are coming soon.</p>}
      </section>

      {selectedItem && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selectedItem.title} onMouseDown={(event) => event.target === event.currentTarget && closeLightbox()}>
          <button type="button" className="gallery-lightbox-close" onClick={closeLightbox} aria-label="Close image"><X size={24} /></button>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-previous" onClick={showPrevious} aria-label="Previous image"><ChevronLeft size={30} /></button>
          <figure>
            <img src={selectedItem.src} alt={selectedItem.alt} />
            <figcaption><strong>{selectedItem.title}</strong><span>{selectedItem.tag}</span></figcaption>
          </figure>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-next" onClick={showNext} aria-label="Next image"><ChevronRight size={30} /></button>
        </div>
      )}
    </main>
  );
}
