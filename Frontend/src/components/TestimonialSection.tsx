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
  const restoreSnapTimeoutRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const temporarilyDisableSnap = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    track.classList.add('ts-track-free-scroll');

    if (restoreSnapTimeoutRef.current) {
      window.clearTimeout(restoreSnapTimeoutRef.current);
    }

    restoreSnapTimeoutRef.current = window.setTimeout(() => {
      track.classList.remove('ts-track-free-scroll');
      restoreSnapTimeoutRef.current = null;
    }, 160);
  }, []);

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

    const hasHorizontalWheel = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const scrollAmount = hasHorizontalWheel
      ? event.deltaX
      : event.shiftKey
        ? event.deltaY
        : 0;

    if (!scrollAmount) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const nextScrollLeft = Math.max(
      0,
      Math.min(maxScrollLeft, track.scrollLeft + scrollAmount),
    );

    if (nextScrollLeft === track.scrollLeft) return;

    event.preventDefault();
    temporarilyDisableSnap();
    track.scrollLeft = nextScrollLeft;
  }, [temporarilyDisableSnap]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const track = trackRef.current;
    if (!track) return;
    if ((event.target as HTMLElement).closest('button, a, input, textarea, select')) return;

    event.preventDefault();
    temporarilyDisableSnap();
    isPointerDraggingRef.current = true;
    didPointerDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = track.scrollLeft;
    track.classList.add('ts-track-dragging');
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
    temporarilyDisableSnap();
    track.scrollLeft = dragStartScrollLeftRef.current - dragDistance;
  }, [temporarilyDisableSnap]);

  const stopPointerDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isPointerDraggingRef.current) return;

    isPointerDraggingRef.current = false;
    track.classList.remove('ts-track-dragging');
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

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

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
