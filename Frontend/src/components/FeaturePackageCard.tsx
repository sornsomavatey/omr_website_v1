import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

import './FeaturePackageCard.css';

export interface FeaturePackageCardProps {
  image: string;
  alt: string;
  title: string;
  guestLabel: string;
  features: string[];
  priceLabel?: string;
  price: string;
  priceUnit?: string;
  bookLabel?: string;
  bookHref?: string;
  className?: string;
}

export default function FeaturePackageCard({
  image,
  alt,
  title,
  guestLabel,
  features,
  priceLabel = 'Starting From',
  price,
  priceUnit = '/ person',
  bookLabel = 'Book Now',
  bookHref = '#inquiry',
  className = '',
}: FeaturePackageCardProps) {
  return (
    <article className={`fpc-card ${className}`.trim()}>
      <div className="fpc-image-wrap">
        <img src={image} alt={alt} className="fpc-image" />
        <span className="fpc-guest-badge">{guestLabel}</span>
      </div>

      <div className="fpc-body">
        <h3 className="fpc-title">{title}</h3>

        <ul className="fpc-features">
          {features.map((feature) => (
            <li key={feature}>
              <Check size={14} className="fpc-check" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="fpc-footer">
          <div className="fpc-price">
            <small>{priceLabel}</small>
            <strong>
              {price}
              <em>{priceUnit}</em>
            </strong>
          </div>

          <Button asChild variant="outline" className="fpc-book-btn">
            <a href={bookHref}>{bookLabel}</a>
          </Button>
        </div>
      </div>
    </article>
  );
}
