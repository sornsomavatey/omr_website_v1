import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Check, X } from 'lucide-react';
import { getRestaurantsData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import LocationCard from '@/components/LocationCard';
import SectionHeader from '@/components/SectionHeader';
import './index.css';

// Asset imports
import locationImg from '@/assets/location.png';
import imgBranchToulKork from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png';
import imgBranchBoeungKak from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png';

type LocationItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  tags: string[];
  description: string;
  highlights: string[];
};

type ComparisonFeature = {
  name: string;
  toulKork: boolean | string;
  boeungKak: boolean | string;
};

type RestaurantsData = {
  header: {
    title: string;
    desc: string;
  };
  comparison: {
    features: ComparisonFeature[];
  };
  locations: LocationItem[];
};

// Map JSON image paths to imported local assets
const imageMapper: Record<string, string> = {
  '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png': imgBranchToulKork,
  '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png': imgBranchBoeungKak,
};

export default function Branches() {
  const navigate = useNavigate();
  const [data, setData] = useState<RestaurantsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<LocationItem | null>(null);

  useEffect(() => {
    getRestaurantsData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load locations.');
        setLoading(false);
      });
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        Loading locations...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-32 pb-20 text-center text-red-500 font-serif text-xl min-h-screen flex items-center justify-center">
        {error || 'No data available.'}
      </div>
    );
  }

  const { header, comparison, locations } = data;

  const handleScrollToMap = () => {
    const mapSection = document.getElementById('see-us-on-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="branches-container">
      
      {/* 1. HERO SECTION */}
      <section className="branches-hero">
        <div className="branches-hero-glow-1" />
        <div className="branches-hero-glow-2" />

        <div className="branches-hero-inner">
          <div className="hero-text-side">
            <h1 className="hero-title">
              {header.title}
            </h1>
            
            <p className="hero-desc">
              {header.desc}
            </p>
            
            <Button asChild className="hero-cta-button">
              <Link to="/reservations">Reserve a Table</Link>
            </Button>
          </div>

          <div className="hero-map-side">
            <div className="hero-map-frame">
              <img
                src={locationImg}
                alt="Map of branch locations"
                className="hero-map-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPARE OUR LOCATIONS */}
      <section className="comparison-section">
        <div className="comparison-inner">
          <SectionHeader
            eyebrow="What's different"
            title="Compare Our Locations"
          />

          <div className="comparison-table-container">
            <div className="comparison-scroll-wrapper">
              
              {/* Table Headers */}
              <div className="comparison-headers-grid">
                {/* Feature Description Card */}
                <div className="feature-info-card">
                  <span className="feature-info-label">
                    Feature
                  </span>
                  <span className="feature-info-desc">
                    Compare venue highlights
                  </span>
                </div>

                {/* Toul Kork Card */}
                <div className="branch-header-card">
                  <img
                    src={imgBranchToulKork}
                    alt="Toul Kork Venue"
                    className="branch-header-image"
                  />
                  <div className="branch-header-overlay" />
                  <div className="branch-header-content">
                    <h4 className="branch-header-title">
                      Toul Kork
                    </h4>
                    <span className="branch-header-tag">
                      Venue
                    </span>
                  </div>
                </div>

                {/* Boeung Kak Card */}
                <div className="branch-header-card">
                  <img
                    src={imgBranchBoeungKak}
                    alt="Boeung Kak Venue"
                    className="branch-header-image"
                  />
                  <div className="branch-header-overlay" />
                  <div className="branch-header-content">
                    <h4 className="branch-header-title">
                      Boeung Kak
                    </h4>
                    <span className="branch-header-tag">
                      Venue
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="comparison-rows-list">
                {comparison.features.map((feature, idx) => (
                  <div
                    key={`${feature.name}-${idx}`}
                    className="comparison-row-item"
                  >
                    {/* Feature Name */}
                    <div className="feature-name">
                      {feature.name}
                    </div>

                    {/* Toul Kork Option */}
                    <div className="feature-value-cell">
                      {typeof feature.toulKork === 'boolean' ? (
                        feature.toulKork ? (
                          <div className="checkmark-badge">
                            <Check size={16} />
                          </div>
                        ) : (
                          <div className="crossmark-badge">
                            <X size={16} />
                          </div>
                        )
                      ) : (
                        <span className="text-value">
                          {feature.toulKork}
                        </span>
                      )}
                    </div>

                    {/* Boeung Kak Option */}
                    <div className="feature-value-cell">
                      {typeof feature.boeungKak === 'boolean' ? (
                        feature.boeungKak ? (
                          <div className="checkmark-badge">
                            <Check size={16} />
                          </div>
                        ) : (
                          <div className="crossmark-badge">
                            <X size={16} />
                          </div>
                        )
                      ) : (
                        <span className="text-value">
                          {feature.boeungKak}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. FIND US HERE */}
      <section className="find-us-section">
        <div className="comparison-inner text-center">
          
          <SectionHeader
            eyebrow="Our Locations"
            title="Find us here"
            description="Two distinct dining destinations, one unforgettable culinary story."
          />

          <div className="find-us-grid">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                branch={loc}
                onDetailClick={(b) => {
                  if (b.id === 'toulKork') {
                    navigate('/branches/toul-kork');
                  } else if (b.id === 'boeungKak') {
                    navigate('/branches/boeung-kak');
                  } else {
                    setActiveModal(b as LocationItem);
                  }
                }}
                onMapClick={handleScrollToMap}
                imageMapper={imageMapper}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. SEE US ON MAP */}
      <section id="see-us-on-map" className="map-section">
        <div className="map-wrapper text-center">
          
          <SectionHeader
            eyebrow="See the Map"
            title="See us on Map"
            description="Two distinct dining destinations, one unforgettable culinary story."
          />

          <div className="map-frame">
            <img
              src={locationImg}
              alt="Locations map view full"
              className="map-image-large"
            />
          </div>

        </div>
      </section>

      {/* INTERACTIVE DETAIL DIALOG / MODAL */}
      {activeModal && (
        <div className="modal-backdrop">
          
          {/* Modal Backdrop click handler */}
          <div
            className="modal-click-overlay"
            onClick={() => setActiveModal(null)}
          />

          <div className="modal-window">
            
            {/* Close Button */}
            <Button
              onClick={() => setActiveModal(null)}
              variant="ghost"
              size="icon"
              className="modal-close-button"
              aria-label="Close details"
            >
              <X size={18} />
            </Button>

            {/* Top Image */}
            <div className="modal-hero-image-wrapper">
              <img
                src={imageMapper[activeModal.image] || activeModal.image}
                alt={activeModal.name}
                className="modal-hero-image"
              />
              <div className="modal-hero-overlay" />
              <div className="modal-hero-badge">
                Venue details
              </div>
            </div>

            {/* Content Area */}
            <div className="modal-content">
              <h3 className="modal-title">
                {activeModal.name}
              </h3>

              {/* Badges */}
              <div className="modal-badges-row">
                {activeModal.tags.map((tag) => (
                  <span key={tag} className="pill-badge">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="modal-desc">
                {activeModal.description}
              </p>

              {/* Highlights */}
              <div className="modal-highlights-container">
                <h4 className="modal-highlights-header">
                  Key Venue Highlights
                </h4>
                <ul className="modal-highlights-list">
                  {activeModal.highlights.map((highlight, index) => (
                    <li key={index} className="modal-highlight-item">
                      <Check size={16} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reserve Button */}
              <Button
                asChild
                className="modal-reserve-button"
              >
                <Link to="/reservations" onClick={() => setActiveModal(null)}>
                  Reserve a Table
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
