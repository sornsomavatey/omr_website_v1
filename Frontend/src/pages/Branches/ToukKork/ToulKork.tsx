import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  Mail, 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ArrowRight,
  Info,
  Users,
  Briefcase,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';
import TestimonialSection from '@/components/TestimonialSection';
import DishCard from '@/components/ui/dish-card';
import SharpImageCard from '@/components/SharpImageCard';
import { useTranslation } from '@/hooks/useTranslation';
import './ToulKork.css';

// Asset imports matching homeAssets
import imgBranchToulKork from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.png'; // Toul Kork Building
import imgHeritageMain from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.png'; // Curved wood interior (main left)
import imgHeritageTopLeft from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.png'; // Dark wood table with garden window (top-left)
import imgHeritageTopRight from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.png'; // Blue bow-tie event hall (top-right)
import imgHeritageBottom from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.png'; // Long table with waitress and pink flowers (bottom)
import imgSpace2 from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.png'; // Event hall (used in private rooms)
import imgGallery1 from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.png'; // Dark wood table (used in private rooms)
import imgGallery2 from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.png'; // Round tables private dining
import imgGallery3 from '@/assets/home-v2/13a7aa4dee36d6ba805abc6f982eb04ec7df4c4c.png'; // Event hall with balloons
import imgGallery4 from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.png'; // People dining
import imgGallery6 from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.png'; // Corporate meeting

// Dish assets
import imgDish1 from '@/assets/home-v2/36191a3943135f3542a0fe8b80adee304f122115.png';
import imgDish2 from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.png';

// Testimonial Avatars
import imgAvatar1 from '@/assets/home-v2/fe0520650c912ce97eb0e3d39282dfb2ecb8c889.png';
import imgAvatar2 from '@/assets/home-v2/0f84921deb64774c6b9d8e0f6b9cd098e318d66b.png';
import imgAvatar3 from '@/assets/home-v2/ea74517d10d49de5ec0cc6665fb3c27a5e86b047.png';

// Map asset
import locationImg from '@/assets/Location Tk.png';

export default function ToulKork() {
  const navigate = useNavigate();
  const { t, isKhmer } = useTranslation();
  
  // Testimonial state
  const testimonials = [
    {
      id: 1,
      name: t('branchDetails.testimonials.items.toulKork.0.name', undefined, "Sovan Dara"),
      date: t('branchDetails.testimonials.items.toulKork.0.date', undefined, "2 weeks ago"),
      text: t('branchDetails.testimonials.items.toulKork.0.text', undefined, "An absolute gem in Toul Kork. The traditional architecture is stunning, and the private rooms are perfect for business dinners. The service is top-notch."),
      avatar: imgAvatar1
    },
    {
      id: 2,
      name: t('branchDetails.testimonials.items.toulKork.1.name', undefined, "Vichea Pok"),
      date: t('branchDetails.testimonials.items.toulKork.1.date', undefined, "1 month ago"),
      text: t('branchDetails.testimonials.items.toulKork.1.text', undefined, "The best place to experience authentic Khmer fine dining. Beautiful garden setting and the Amok Trey is outstanding. Highly recommended!"),
      avatar: imgAvatar2
    },
    {
      id: 3,
      name: t('branchDetails.testimonials.items.toulKork.2.name', undefined, "Chanthy Chea"),
      date: t('branchDetails.testimonials.items.toulKork.2.date', undefined, "1 month ago"),
      text: t('branchDetails.testimonials.items.toulKork.2.text', undefined, "Excellent venue for corporate events. We hosted a seminar in their VIP room, and the AV setup and catering exceeded our expectations."),
      avatar: imgAvatar3
    }
  ];

  // Set document title & SEO meta
  useEffect(() => {
    document.title = isKhmer ? "ភោជនីយដ្ឋាន វ័នម័រ - សាខាទួលគោក" : "One More Restaurant - Toul Kork Branch";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isKhmer 
        ? "ទទួលបទពិសោធន៍ទទួលទានអាហារខ្មែរពិតប្រាកដនៅភោជនីយដ្ឋាន វ័នម័រ ទួលគោក។ ស័ក្តិសមសម្រាប់ការជួបជុំគ្រួសារ ការប្រជុំអាជីវកម្ម និងព្រឹត្តិការណ៍ផ្សេងៗ។" 
        : "Experience authentic Cambodian dining at One More Restaurant Toul Kork. Ideal for family gatherings, business meetings, and elegant events in Phnom Penh.");
    }
  }, [isKhmer]);

  return (
    <div className="tk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="toulkork-hero" className="tk-hero">
        <div className="tk-hero-bg">
          <img src={imgBranchToulKork} alt={isKhmer ? "អគារភោជនីយដ្ឋានវ័នម័រ ទួលគោក" : "One More Restaurant Toul Kork Building"} className="tk-hero-image" />
          <div className="tk-hero-overlay" />
        </div>

        <div className="tk-hero-content">
          <h1 className="tk-hero-title">
            {isKhmer ? <>ភោជនីយដ្ឋាន វ័នម័រ<br />ទួលគោក</> : <>One More Restaurant<br />Toul Kork</>}
          </h1>
          <p className="tk-hero-desc">
            {t('branchDetails.hero.toulKork.desc')}
          </p>
          <Button asChild className="hero-cta-button">
            <Link to="/reservations">{t('branchDetails.hero.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* 2. ARCHITECTURAL HERITAGE & ELEGANCE */}
      <section className="tk-section tk-heritage">
        <SectionHeader 
          eyebrow={t('branchDetails.space.eyebrow')} 
          title={t('branchDetails.space.title')} 
        />
        
        <div className="tk-heritage-grid">
          <div className="tk-heritage-left">
            <div className="tk-image-wrapper tk-large-image">
              <img src={imgHeritageMain} alt="Curved wood interior" />
              <div className="tk-image-mask" />
            </div>
          </div>
          <div className="tk-heritage-right">
            <div className="tk-heritage-right-top">
              <div className="tk-image-wrapper tk-sub-image-top-half">
                <img src={imgHeritageTopLeft} alt="Dark wood table with garden view" />
                <div className="tk-image-mask" />
              </div>
              <div className="tk-image-wrapper tk-sub-image-top-half">
                <img src={imgHeritageTopRight} alt="Blue bow-tie event hall" />
                <div className="tk-image-mask" />
              </div>
            </div>
            <div className="tk-image-wrapper tk-sub-image-bottom-full">
              <img src={imgHeritageBottom} alt="Long table with waitress and pink flowers" />
              <div className="tk-image-mask" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE ART OF CAMBODIAN HOSPITALITY */}
      <section className="tk-section tk-hospitality">
        <div className="tk-hospitality-container">
          <div className="tk-hospitality-text">
            <span className="tk-eyebrow">{t('branchDetails.philosophy.eyebrow')}</span>
            <h2 className="tk-section-title">{t('branchDetails.philosophy.title')}</h2>
            <p className="tk-desc-para">
              {t('branchDetails.philosophy.toulKorkDesc')}
            </p>
          </div>
          <div className="tk-hospitality-box">
            <span className="tk-box-tag">{t('branchDetails.philosophy.bestFor')}</span>
            <ul className="tk-box-list">
              <li className="tk-box-item">
                <span className="tk-box-icon"><Users size={20} /></span>
                <span className="tk-box-label">{t('branchDetails.philosophy.family')}</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><Briefcase size={20} /></span>
                <span className="tk-box-label">{t('branchDetails.philosophy.business')}</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><UserCheck size={20} /></span>
                <span className="tk-box-label">{t('branchDetails.philosophy.corporate')}</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><CalendarDays size={20} /></span>
                <span className="tk-box-label">{t('branchDetails.philosophy.special')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. PRIVATE DINING ROOMS */}
      <section className="tk-section tk-rooms">
        <SectionHeader 
          eyebrow={t('branchDetails.rooms.eyebrow')} 
          title={t('branchDetails.rooms.title')} 
        />
        
        <div className="tk-rooms-grid">
          {/* Room 1 — Neang Tev */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageTopLeft} alt="Neang Tev Private Room" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "នាងទេវី" : "Neang Tev"}</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>

          {/* Room 2 — Orn Tit Tom */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageBottom} alt="Orn Tit Tom Private Room" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "អនទិត្យទុំ" : "Orn Tit Tom"}</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>

          {/* Room 3 — VVIP */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageTopRight} alt="VVIP Hall" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "បន្ទប់ VVIP" : "VVIP"}</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHEF'S RECOMMENDATIONS */}
      <section className="tk-section tk-menu-recs">
        <SectionHeader 
          eyebrow={t('branchDetails.chefRecs.eyebrow')} 
          title={t('branchDetails.chefRecs.title')} 
        />
        
        <div className="tk-menu-grid">
          <DishCard
            name={isKhmer ? "អាម៉ុកត្រីបែបបុរាណ" : "Traditional Fish Amok"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer 
              ? "ម្ហូបខ្មែរបុរាណធ្វើពីត្រីចំហុយក្នុងទឹកគ្រឿងខ្ទិះដូងខាប់ រុំក្នុងស្លឹកចេក។"
              : "A classic Khmer dish of fish steamed in a thick savory coconut curry custard wrapped in banana leaves."}
            image={imgDish1}
            price="$24"
            priceSuffix={isKhmer ? "ដុល្លារ / សុទ្ធ" : "USD / Net"}
            actionText={t('branchDetails.chefRecs.addToCart')}
            index={0}
          />

          <DishCard
            name={isKhmer ? "អាម៉ុកត្រីស្លឹកញរ" : "Fish Amok with Noni Leaf"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer
              ? "អាម៉ុកត្រីខ្មែររសជាតិឈ្ងុយឆ្ងាញ់ ចម្អិនជាមួយគ្រឿងទេសប្រពៃណី ខ្ទិះដូង និងស្លឹកញរ។"
              : "Savory Cambodian fish amok cooked in traditional spices, coconut cream, and noni leaf."}
            image={imgDish2}
            price="$24"
            priceSuffix={isKhmer ? "ដុល្លារ / សុទ្ធ" : "USD / Net"}
            actionText={t('branchDetails.chefRecs.addToCart')}
            index={1}
          />

          <DishCard
            name={isKhmer ? "ការីត្រីចំហុយខ្មែរ" : "Khmer Steamed Fish Curry"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer
              ? "ការីត្រីចំហុយតាមបែបខ្មែរ សម្បូរទៅដោយជីរក្នុងស្រុក ស្លឹកក្រូចសើច គ្រឿងគល់ស្លឹកគ្រៃ និងខ្ទិះដូង។"
              : "Rich Khmer style steamed fish curry with local herbs, kaffir lime leaf, lemongrass paste, and coconut milk."}
            image={imgDish3}
            price="$24"
            priceSuffix={isKhmer ? "ដុល្លារ / សុទ្ធ" : "USD / Net"}
            actionText={t('branchDetails.chefRecs.addToCart')}
            index={2}
          />
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="tk-btn-menu-full">
            <Link to="/menu">{t('branchDetails.chefRecs.viewFullMenu')}</Link>
          </Button>
        </div>
      </section>

      {/* 6. EVENTS & CELEBRATIONS */}
      <section className="tk-section tk-events">
        <SectionHeader 
          eyebrow={t('branchDetails.events.eyebrow')} 
          title={t('branchDetails.events.title')} 
          align="left" 
        />

        <div className="tk-events-grid">
          <SharpImageCard
            image={imgGallery3}
            alt={t('branchDetails.events.items.birthday.title')}
            title={t('branchDetails.events.items.birthday.title')}
            description={t('branchDetails.events.items.birthday.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgHeritageBottom}
            alt={t('branchDetails.events.items.engagement.title')}
            title={t('branchDetails.events.items.engagement.title')}
            description={t('branchDetails.events.items.engagement.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgGallery4}
            alt={t('branchDetails.events.items.family.title')}
            title={t('branchDetails.events.items.family.title')}
            description={t('branchDetails.events.items.family.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgGallery2}
            alt={t('branchDetails.events.items.corporate.title')}
            title={t('branchDetails.events.items.corporate.title')}
            description={t('branchDetails.events.items.corporate.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
          />
        </div>
      </section>

      {/* 7. WHAT OUR GUESTS SAY */}
      <TestimonialSection
        eyebrow={t('branchDetails.testimonials.eyebrow')}
        title={t('branchDetails.testimonials.title')}
        description={t('branchDetails.testimonials.desc')}
        testimonials={testimonials}
        isKhmer={isKhmer}
      />

      {/* 8. VISIT US */}
      <section className="tk-section tk-visit">
        <div className="tk-visit-container">
          {/* Left: Map image */}
          <div className="tk-visit-map">
            <img src={locationImg} alt={isKhmer ? "ផែនទីភោជនីយដ្ឋាន វ័នម័រ ទួលគោក" : "Map of One More Restaurant Toul Kork"} className="bk-map-img" />
          </div>

          {/* Right: Contact details */}
          <div className="tk-visit-details">
            <h2 className="tk-visit-title">{t('branchDetails.visit.title')}</h2>
            <span className="tk-visit-divider" />

            <ul className="tk-details-list">
              <li className="tk-detail-item">
                <MapPin size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">{t('branchDetails.visit.labels.address')}</h4>
                  <p className="tk-detail-value">{t('branchDetails.visit.values.toulKorkAddress')}</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Phone size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">{t('branchDetails.visit.labels.phone')}</h4>
                  <p className="tk-detail-value">023 888 222</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <ArrowRight size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">{t('branchDetails.visit.labels.telegram')}</h4>
                  <p className="tk-detail-value">@OneMoreRestaurant</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Clock size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">{t('branchDetails.visit.labels.hours')}</h4>
                  <p className="tk-detail-value">{t('branchDetails.visit.values.hours')}</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Car size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">{t('branchDetails.visit.labels.parking')}</h4>
                  <p className="tk-detail-value">{t('branchDetails.visit.values.parking')}</p>
                </div>
              </li>
            </ul>

            <div className="tk-visit-actions">
              <Button asChild className="tk-btn-directions">
                <a href="https://maps.google.com/?q=One+More+Restaurant+Toul+Kork" target="_blank" rel="noopener noreferrer">
                  {t('branchDetails.visit.directions')}
                </a>
              </Button>
              <Button asChild variant="outline" className="tk-btn-close">
                <a href="tel:023888222">{t('branchDetails.visit.call')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
