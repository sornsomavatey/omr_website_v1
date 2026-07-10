import {
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeader from './SectionHeader';
import './TestimonialSection.css';

export interface TestimonialItem {
  name: string;
  date?: string;
  role?: string;
  avatar?: string;
  text: string;
  stars?: number;
}

interface TestimonialSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  testimonials: TestimonialItem[];
  className?: string;
  isKhmer?: boolean;
}

const TEXT_TRUNCATE_LENGTH = 150;

function TestimonialCard({
  testimonial,
  isKhmer,
}: {
  testimonial: TestimonialItem;
  isKhmer: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const starCount = testimonial.stars || 5;
  const canTruncate = testimonial.text.length > TEXT_TRUNCATE_LENGTH;

  return (
    <article className="ts-card">
      <div className="ts-card-topline">
        <div className="ts-stars" aria-label={`${starCount} out of 5 stars`}>
          <span aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={index < starCount ? 'ts-star-filled' : ''}
              />
            ))}
          </span>
        </div>

        <span className="ts-review-label">
          {isKhmer ? 'មតិភ្ញៀវ' : 'Guest review'}
        </span>
      </div>

      <span className="ts-quote-mark" aria-hidden="true">
        <Quote />
      </span>

      <p className={`ts-card-text ${expanded ? 'ts-card-text-expanded' : ''}`}>
        {testimonial.text}
      </p>

      {canTruncate && (
        <button
          type="button"
          className="ts-see-more"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}

      <div className="ts-author">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="ts-avatar"
          />
        ) : (
          <div className="ts-avatar-fallback">
            {testimonial.name ? testimonial.name[0] : 'U'}
          </div>
        )}

        <div className="ts-author-copy">
          <h3>{testimonial.name}</h3>
          <span>{testimonial.date || testimonial.role || ''}</span>
        </div>
      </div>
    </article>
  );
}

export default function TestimonialSection({
  eyebrow = 'REVIEWS',
  title = 'What Our Guests Say',
  description,
  testimonials,
  className = '',
  isKhmer = false,
}: TestimonialSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPointerDraggingRef = useRef(false);
  const didPointerDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const scrollTestimonials = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>('.ts-card');
    const gap = parseFloat(getComputedStyle(track).columnGap || '16') || 16;
    const cardWidth = card ? card.offsetWidth + gap : 340;

    track.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    const scrollAmount =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (!scrollAmount) return;

    event.preventDefault();
    track.scrollLeft += scrollAmount;
  }, []);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const track = trackRef.current;
    if (!track) return;

    isPointerDraggingRef.current = true;
    didPointerDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isPointerDraggingRef.current) return;

    const dragDistance = event.clientX - dragStartXRef.current;
    if (Math.abs(dragDistance) > 4) {
      didPointerDragRef.current = true;
    }

    event.preventDefault();
    track.scrollLeft = dragStartScrollLeftRef.current - dragDistance;
  }, []);

  const stopPointerDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isPointerDraggingRef.current) return;

    isPointerDraggingRef.current = false;
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!didPointerDragRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    didPointerDragRef.current = false;
  }, []);

  return (
    <section className={`ts-section ${className}`}>
      <div className="ts-container">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="ts-viewport">
          <div
            ref={trackRef}
            className="ts-track"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopPointerDrag}
            onPointerLeave={stopPointerDrag}
            onPointerCancel={stopPointerDrag}
            onClickCapture={handleClickCapture}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
                isKhmer={isKhmer}
              />
            ))}
          </div>
        </div>

        <div className="ts-navigation">
          <button
            type="button"
            className="ts-nav-button"
            onClick={() => scrollTestimonials('left')}
            aria-label={isKhmer ? 'ការវាយតម្លៃមុន' : 'Previous review'}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <button
            type="button"
            className="ts-nav-button"
            onClick={() => scrollTestimonials('right')}
            aria-label={isKhmer ? 'ការវាយតម្លៃបន្ទាប់' : 'Next review'}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
