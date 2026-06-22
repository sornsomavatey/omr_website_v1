import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import LocationCard from '@/components/LocationCard';
import SectionHeader from '@/components/SectionHeader';
import { useTranslation } from '@/hooks/useTranslation';

import locationImg from '@/assets/location.png';
import imgBranchToulKork from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png';
import imgBranchBoeungKak from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png';

import './index.css';

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
  ui: {
    reserveCta: string;
    heroMapAlt: string;
    comparison: {
      eyebrow: string;
      title: string;
      featureLabel: string;
      featureDesc: string;
      toulKorkTitle: string;
      boeungKakTitle: string;
      venueTag: string;
      toulKorkAlt: string;
      boeungKakAlt: string;
    };
    findUs: {
      eyebrow: string;
      title: string;
      description: string;
    };
    map: {
      eyebrow: string;
      title: string;
      description: string;
      imageAlt: string;
    };
    modal: {
      closeAria: string;
      venueDetails: string;
      highlightsTitle: string;
      reserveCta: string;
    };
  };
  comparison: {
    features: ComparisonFeature[];
  };
  locations: LocationItem[];
};

const imageMapper: Record<string, string> = {
  '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png':
    imgBranchToulKork,
  '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png':
    imgBranchBoeungKak,
};

export default function Branches() {
  const { getObject, t } = useTranslation();
  const navigate = useNavigate();

  const data = getObject<RestaurantsData | null>('branchesPage', null);
  const [activeModal, setActiveModal] = useState<LocationItem | null>(null);

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

  if (!data) {
    return (
      <div className="pt-32 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        {t('branches.loading', undefined, 'Loading locations...')}
      </div>
    );
  }

  const { header, comparison, locations, ui } = data;

  const handleScrollToMap = () => {
    const mapSection = document.getElementById('see-us-on-map');

    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="branches-container">
      <section className="branches-hero">
        <div className="branches-hero-glow-1" />
        <div className="branches-hero-glow-2" />

        <div className="branches-hero-inner">
          <div className="hero-text-side">
            <h1 className="hero-title">{header.title}</h1>

            <p className="hero-desc">{header.desc}</p>

            <Button asChild className="hero-cta-button">
              <Link to="/reservations">{ui.reserveCta}</Link>
            </Button>
          </div>

          <div className="hero-map-side">
            <div className="hero-map-frame">
              <img
                src={locationImg}
                alt={ui.heroMapAlt}
                className="hero-map-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="comparison-inner">
          <SectionHeader
            eyebrow={ui.comparison.eyebrow}
            title={ui.comparison.title}
          />

          <div className="comparison-table-container">
            <div className="comparison-scroll-wrapper">
              <div className="comparison-headers-grid">
                <div className="feature-info-card">
                  <span className="feature-info-label">
                    {ui.comparison.featureLabel}
                  </span>

                  <span className="feature-info-desc">
                    {ui.comparison.featureDesc}
                  </span>
                </div>

                <div className="branch-header-card">
                  <img
                    src={imgBranchToulKork}
                    alt={ui.comparison.toulKorkAlt}
                    className="branch-header-image"
                  />

                  <div className="branch-header-overlay" />

                  <div className="branch-header-content">
                    <h4 className="branch-header-title">
                      {ui.comparison.toulKorkTitle}
                    </h4>

                    <span className="branch-header-tag">
                      {ui.comparison.venueTag}
                    </span>
                  </div>
                </div>

                <div className="branch-header-card">
                  <img
                    src={imgBranchBoeungKak}
                    alt={ui.comparison.boeungKakAlt}
                    className="branch-header-image"
                  />

                  <div className="branch-header-overlay" />

                  <div className="branch-header-content">
                    <h4 className="branch-header-title">
                      {ui.comparison.boeungKakTitle}
                    </h4>

                    <span className="branch-header-tag">
                      {ui.comparison.venueTag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="comparison-rows-list">
                {comparison.features.map((feature, idx) => (
                  <div
                    key={`${feature.name}-${idx}`}
                    className="comparison-row-item"
                  >
                    <div className="feature-name">{feature.name}</div>

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
                        <span className="text-value">{feature.toulKork}</span>
                      )}
                    </div>

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
                        <span className="text-value">{feature.boeungKak}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="find-us-section">
        <div className="comparison-inner text-center">
          <SectionHeader
            eyebrow={ui.findUs.eyebrow}
            title={ui.findUs.title}
            description={ui.findUs.description}
          />

          <div className="find-us-grid">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                branch={loc}
                onDetailClick={(branch) => {
                  if (branch.id === 'toulKork') {
                    navigate('/branches/toul-kork');
                  } else {
                    setActiveModal(branch as LocationItem);
                  }
                }}
                onMapClick={handleScrollToMap}
                imageMapper={imageMapper}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="see-us-on-map" className="map-section">
        <div className="map-wrapper text-center">
          <SectionHeader
            eyebrow={ui.map.eyebrow}
            title={ui.map.title}
            description={ui.map.description}
          />

          <div className="map-frame">
            <img
              src={locationImg}
              alt={ui.map.imageAlt}
              className="map-image-large"
            />
          </div>
        </div>
      </section>

      {activeModal && (
        <div className="modal-backdrop">
          <div
            className="modal-click-overlay"
            onClick={() => setActiveModal(null)}
          />

          <div className="modal-window">
            <Button
              onClick={() => setActiveModal(null)}
              variant="ghost"
              size="icon"
              className="modal-close-button"
              aria-label={ui.modal.closeAria}
            >
              <X size={18} />
            </Button>

            <div className="modal-hero-image-wrapper">
              <img
                src={imageMapper[activeModal.image] || activeModal.image}
                alt={activeModal.name}
                className="modal-hero-image"
              />

              <div className="modal-hero-overlay" />

              <div className="modal-hero-badge">
                {ui.modal.venueDetails}
              </div>
            </div>

            <div className="modal-content">
              <h3 className="modal-title">{activeModal.name}</h3>

              <div className="modal-badges-row">
                {activeModal.tags.map((tag) => (
                  <span key={tag} className="pill-badge">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="modal-desc">{activeModal.description}</p>

              <div className="modal-highlights-container">
                <h4 className="modal-highlights-header">
                  {ui.modal.highlightsTitle}
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

              <Button asChild className="modal-reserve-button">
                <Link
                  to="/reservations"
                  onClick={() => setActiveModal(null)}
                >
                  {ui.modal.reserveCta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
