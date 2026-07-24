import { useState } from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/price';
import { Skeleton } from '@/components/ui/skeleton';

import './FeaturePackageCard.css';

export interface FeaturePackageCardProps {
  image: string;
  alt: string;
  title: string;
  guestLabel: string;
  features: string[];
  priceLabel?: string;
  price?: string;
  priceUnit?: string;
  detailLabel?: string;
  detailHref?: string;
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
  detailLabel = 'View Details',
  detailHref = '#inquiry',
  bookLabel = 'Book Now',
  bookHref = '#inquiry',
  className = '',
}: FeaturePackageCardProps) {
  const { isKhmer } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const localizedPrice = price ? formatPrice(price, isKhmer) : '';
  const localizedPriceUnit = isKhmer ? '/ ម្នាក់' : priceUnit;
  const localizedPriceLabel = isKhmer ? 'ចាប់ពី' : priceLabel;
  const localizedDetailLabel = isKhmer ? 'មើលលម្អិត' : detailLabel;
  const localizedBookLabel = isKhmer ? 'កក់ឥឡូវនេះ' : bookLabel;

  return (
    <article className={`fpc-card ${className}`.trim()}>
      <div className="fpc-image-wrap relative bg-[#f2f5f0]">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted z-0" />
        )}
        <img
          src={image}
          alt={alt}
          className={`fpc-image transition-opacity duration-500 relative z-10 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoaded(true)}
          ref={(img) => {
            if (img && img.complete) {
              setIsLoaded(true);
            }
          }}
        />
        <span className="fpc-guest-badge z-20">{guestLabel}</span>
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
          {price ? (
            <div className="fpc-price">
              <small>{localizedPriceLabel}</small>
              <strong>
                {localizedPrice}
                <em>{localizedPriceUnit}</em>
              </strong>
            </div>
          ) : (
            <Button asChild variant="outline" className="fpc-detail-btn">
              <a href={detailHref}>{localizedDetailLabel}</a>
            </Button>
          )}

          <Button asChild className="fpc-book-btn">
            <a href={bookHref}>{localizedBookLabel}</a>
          </Button>
        </div>
      </div>
    </article>
  );
}
