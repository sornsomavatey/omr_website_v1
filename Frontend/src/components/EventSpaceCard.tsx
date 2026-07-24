import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import './EventSpaceCard.css';

export interface EventSpaceCardProps {
  id: string;
  name: string;
  guestTag: string;
  badgeTag: string;
  image: string;
  features: string[];
  onReserveClick?: () => void;
  onViewDetailsClick?: () => void;
  className?: string;
}

export const EventSpaceCard: React.FC<EventSpaceCardProps> = ({
  name,
  guestTag,
  badgeTag,
  image,
  features,
  onReserveClick,
  onViewDetailsClick,
  className = '',
}) => {
  const { isKhmer } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`event-space-card-component events-space-card ${className}`}>
      <div className="event-space-image-container relative bg-[#f2f5f0]">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted z-0" />
        )}
        <img
          src={image}
          alt={name}
          className={`event-space-image transition-opacity duration-500 relative z-10 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <div className="event-space-content-container">
        <div className="event-space-header-badges">
          <span className="event-space-badge-outline">{guestTag}</span>
          <span className="event-space-badge-solid">{badgeTag}</span>
        </div>

        <h3 className="event-space-title">{name}</h3>

        <ul className="event-space-features-list">
          {features.map((feature, index) => (
            <li key={`${feature}-${index}`} className="event-space-feature-item">
              <Check className="event-space-check-icon" size={14} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="event-space-action-buttons">
          <a
            href="#inquiry"
            onClick={onReserveClick}
            className="event-space-btn-primary"
          >
            {isKhmer ? 'កក់ឥឡូវនេះ' : 'Reserve Space'}
          </a>
          <a
            href="#inquiry"
            onClick={onViewDetailsClick}
            className="event-space-btn-secondary"
          >
            {isKhmer ? 'ព័ត៌មានលម្អិត' : 'View Details'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventSpaceCard;
