import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import './SharpImageCard.css';

interface SharpImageCardProps {
  /** Image source URL or import */
  image: string;
  
  alt: string;
  
  title: string;
  /** Short description displayed below the title */
  description: string;
  /** Label for the action button */
  buttonLabel?: string;
  /** Where the button links to */
  buttonHref?: string;
  /** Optional extra class for the card wrapper */
  className?: string;
}


const SharpImageCard: React.FC<SharpImageCardProps> = ({
  image,
  alt,
  title,
  description,
  buttonLabel = 'Learn More',
  buttonHref = '/',
  className = '',
}) => {
  return (
    <div className={`sic-card ${className}`}>
      <img src={image} alt={alt} className="sic-image" />
      <div className="sic-overlay" />
      <div className="sic-content">
        <h3 className="sic-title">{title}</h3>
        <p className="sic-description">{description}</p>
        <Button asChild variant="secondary" className="sic-button">
          <Link to={buttonHref}>{buttonLabel}</Link>
        </Button>
      </div>
    </div>
  );
};

export default SharpImageCard;
