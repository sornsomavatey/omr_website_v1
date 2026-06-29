import React from 'react';
import { Check } from 'lucide-react';
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
  return (
    <div className={`event-space-card-component events-space-card ${className}`}>
      <div className="event-space-image-container">
        <img src={image} alt={name} className="event-space-image" />
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
            Reserve Space
          </a>
          <a
            href="#inquiry"
            onClick={onViewDetailsClick}
            className="event-space-btn-secondary"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventSpaceCard;
