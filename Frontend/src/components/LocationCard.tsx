import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export type BranchData = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  tags: string[];
  description?: string;
  highlights?: string[];
};

type LocationCardProps = {
  branch: BranchData;
  onDetailClick?: (branch: BranchData) => void;
  onMapClick?: (branch: BranchData) => void;
  imageMapper?: Record<string, string>;
};

export default function LocationCard({
  branch,
  onDetailClick,
  onMapClick,
  imageMapper,
}: LocationCardProps) {
  const { t } = useTranslation();
  const resolvedImage = imageMapper && imageMapper[branch.image] ? imageMapper[branch.image] : branch.image;

  return (
    <div className="branch-card">
      {/* Top Image */}
      <div className="card-image-wrapper">
        <img
          src={resolvedImage}
          alt={branch.name}
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-mask" />
      </div>

      {/* Content */}
      <div className="card-body">
        <h3 className="card-title">
          {branch.name}
        </h3>

        {/* Badges */}
        <div className="badges-row">
          {branch.tags.map((tag) => (
            <span key={tag} className="pill-badge">
              {tag}
            </span>
          ))}
        </div>

        {/* Details List */}
        <ul className="details-list">
          <li className="details-item">
            <MapPin size={18} />
            <span className="details-text">
              {branch.address}
            </span>
          </li>
          <li className="details-item">
            <Phone size={18} />
            <span className="details-text">
              {branch.phone}
            </span>
          </li>
          <li className="details-item">
            <Clock size={18} />
            <span className="details-text">
              {branch.hours}
            </span>
          </li>
        </ul>

        {/* Actions */}
        <div className="card-actions">
          {onDetailClick ? (
            <Button
              onClick={() => onDetailClick(branch)}
              variant="outline"
              className="btn-action-outline"
            >
              {t('home.locations.detail', undefined, 'Detail')}
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="btn-action-outline"
            >
              <Link to="/contact">{t('home.locations.detail', undefined, 'Detail')}</Link>
            </Button>
          )}

          {onMapClick ? (
            <Button
              onClick={() => onMapClick(branch)}
              variant="outline"
              className="btn-action-outline"
            >
              {t('home.locations.map', undefined, 'Map')}
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="btn-action-outline"
            >
              <Link to="/contact">{t('home.locations.map', undefined, 'Map')}</Link>
            </Button>
          )}

          {(() => {
            const branchParam =
              branch.id === 'boeungKak' ||
              branch.id === 'boeung-kak' ||
              (branch.name && (branch.name.toLowerCase().includes('boeung') || branch.name.includes('បឹងកក់')))
                ? 'boeung-kak'
                : 'toul-kork';
            return (
              <Button asChild className="btn-action-primary">
                <Link to={`/reservations?branch=${branchParam}`}>
                  {t('home.locations.reserve', undefined, 'Reserve a Table')}
                </Link>
              </Button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
