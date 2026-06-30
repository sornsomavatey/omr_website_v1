import { useState } from 'react';
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

export default function TestimonialSection({
  eyebrow = 'REVIEWS',
  title = 'What Our Guests Say',
  description,
  testimonials,
  className = '',
  isKhmer = false,
}: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const orderedTestimonials = Array.from(
    { length: testimonials.length },
    (_, offset) =>
      testimonials[(currentIndex + offset) % testimonials.length]
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
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
          <div key={currentIndex} className="ts-track">
            {orderedTestimonials.map((testimonial, index) => {
              const starCount = testimonial.stars || 5;
              return (
                <article
                  key={`${currentIndex}-${testimonial.name}-${index}`}
                  className="ts-card"
                >
                  <div
                    className="ts-stars"
                    aria-label={`${starCount} out of 5 stars`}
                  >
                    <span aria-hidden="true">{'★'.repeat(starCount)}</span>
                  </div>

                  <span className="ts-quote-mark" aria-hidden="true">
                    “
                  </span>

                  <p className="ts-card-text">{testimonial.text}</p>

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
            })}
          </div>
        </div>

        <div className="ts-navigation">
          <button
            type="button"
            className="ts-nav-button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label={isKhmer ? 'ការវាយតម្លៃមុន' : 'Previous review'}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="ts-dots" aria-label="Choose testimonial">
            {testimonials.map((testimonial, index) => (
              <button
                key={`${testimonial.name}-${index}`}
                type="button"
                className={`ts-dot ${
                  currentIndex === index ? 'ts-dot-active' : ''
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="ts-nav-button"
            onClick={handleNext}
            disabled={currentIndex === testimonials.length - 1}
            aria-label={isKhmer ? 'ការវាយតម្លៃបន្ទាប់' : 'Next review'}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
