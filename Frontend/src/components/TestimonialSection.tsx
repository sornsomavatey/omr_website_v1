import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  const [expanded, setExpanded] = useState(false);
  const starCount = testimonial.stars || 5;
  const canTruncate = testimonial.text.length > TEXT_TRUNCATE_LENGTH;

  return (
    <article className="ts-card">
      <div className="ts-stars" aria-label={`${starCount} out of 5 stars`}>
        <span aria-hidden="true">{'★'.repeat(starCount)}</span>
      </div>

      <span className="ts-quote-mark" aria-hidden="true">
        “
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

  return (
    <section className={`ts-section ${className}`}>
      <div className="ts-container">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="ts-viewport">
          <div ref={trackRef} className="ts-track">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
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
