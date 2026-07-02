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
import './BoeungKak.css';

// Asset imports matching homeAssets
import imgBranchBoeungKak from '@/assets/Bk.webp'; // Boeung Kak Building
import imgHeritageMain from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp'; // Curved wood interior (main left)
import imgHeritageTopLeft from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp'; // Dark wood table with garden window (top-left)
import imgHeritageTopRight from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.webp'; // Blue bow-tie event hall (top-right)
import imgHeritageBottom from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp'; // Long table with waitress and pink flowers (bottom)
import imgSpace2 from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.webp'; // Event hall (used in private rooms)
import imgGallery1 from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp'; // Dark wood table (used in private rooms)
import imgGallery2 from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.webp'; // Round tables private dining
import imgGallery3 from '@/assets/home-v2/13a7aa4dee36d6ba805abc6f982eb04ec7df4c4c.webp'; // Event hall with balloons
import imgGallery4 from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.webp'; // People dining
import imgGallery6 from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp'; // Corporate meeting

// Dish assets
import imgDish1 from '@/assets/home-v2/36191a3943135f3542a0fe8b80adee304f122115.webp';
import imgDish2 from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.webp';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.webp';

// Testimonial Avatars
import imgAvatar1 from '@/assets/home-v2/fe0520650c912ce97eb0e3d39282dfb2ecb8c889.webp';
import imgAvatar2 from '@/assets/home-v2/0f84921deb64774c6b9d8e0f6b9cd098e318d66b.webp';
import imgAvatar3 from '@/assets/home-v2/ea74517d10d49de5ec0cc6665fb3c27a5e86b047.webp';

// Map asset
import locationImg from '@/assets/Location Bk.webp';

export default function BoeungKak() {
  const navigate = useNavigate();
  const { t, isKhmer } = useTranslation();
  
  // Testimonial state
  const testimonials = [
    {
      id: 1,
      name: t('branchDetails.testimonials.items.boeungKak.0.name', undefined, "Sovan Dara"),
      date: t('branchDetails.testimonials.items.boeungKak.0.date', undefined, "2 weeks ago"),
      text: t('branchDetails.testimonials.items.boeungKak.0.text', undefined, "An absolute gem in Boeung Kak. The traditional architecture is stunning, and the private rooms are perfect for business dinners. The service is top-notch."),
      avatar: imgAvatar1
    },
    {
      id: 2,
      name: t('branchDetails.testimonials.items.boeungKak.1.name', undefined, "Vichea Pok"),
      date: t('branchDetails.testimonials.items.boeungKak.1.date', undefined, "1 month ago"),
      text: t('branchDetails.testimonials.items.boeungKak.1.text', undefined, "The best place to experience authentic Khmer fine dining. Beautiful garden setting and the Amok Trey is outstanding. Highly recommended!"),
      avatar: imgAvatar2
    },
    {
      id: 3,
      name: t('branchDetails.testimonials.items.boeungKak.2.name', undefined, "Chanthy Chea"),
      date: t('branchDetails.testimonials.items.boeungKak.2.date', undefined, "1 month ago"),
      text: t('branchDetails.testimonials.items.boeungKak.2.text', undefined, "Excellent venue for corporate events. We hosted a seminar in their VIP room, and the AV setup and catering exceeded our expectations."),
      avatar: imgAvatar3
    }
  ];

  // Set document title & SEO meta
  useEffect(() => {
    document.title = isKhmer ? "ភោជនីយដ្ឋាន វ័នម័រ - សាខាបឹងកក់" : "One More Restaurant - Boeung Kak Branch";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isKhmer 
        ? "ទទួលបទពិសោធន៍ទទួលទានអាហារខ្មែរពិតប្រាកដនៅភោជនីយដ្ឋាន វ័នម័រ បឹងកក់។ ស័ក្តិសមសម្រាប់ការជួបជុំគ្រួសារ ការប្រជុំអាជីវកម្ម និងព្រឹត្តិការណ៍ផ្សេងៗ។" 
        : "Experience authentic Cambodian dining at One More Restaurant Boeung Kak. Ideal for family gatherings, business meetings, and elegant events in Phnom Penh.");
    }
  }, [isKhmer]);

  return (
    <div className="bk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="boeungkak-hero" className="bk-hero">
        <div className="bk-hero-bg">
          <img src={imgBranchBoeungKak} alt={isKhmer ? "អគារភោជនីយដ្ឋានវ័នម័រ បឹងកក់" : "One More Restaurant Boeung Kak Building"} className="bk-hero-image" />
          <div className="bk-hero-overlay" />
        </div>

        <div className="bk-hero-content">
          <h1 className="bk-hero-title">
            {isKhmer ? <>ភោជនីយដ្ឋាន វ័នម័រ<br />បឹងកក់</> : <>One More Restaurant<br />Boeung Kak</>}
          </h1>
          <p className="bk-hero-desc">
            {t('branchDetails.hero.boeungKak.desc')}
          </p>
          <Button asChild className="hero-cta-button">
            <Link to="/reservations">{t('branchDetails.hero.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* 2. ARCHITECTURAL HERITAGE & ELEGANCE */}
      <section className="bk-section bk-heritage">
        <SectionHeader 
          eyebrow={t('branchDetails.space.eyebrow')} 
          title={t('branchDetails.space.title')} 
        />
        
        <div className="bk-heritage-grid">
          <div className="bk-heritage-left">
            <div className="bk-image-wrapper bk-large-image">
              <img src={imgHeritageMain} alt="Curved wood interior" />
              <div className="bk-image-mask" />
            </div>
          </div>
          <div className="bk-heritage-right">
            <div className="bk-heritage-right-top">
              <div className="bk-image-wrapper bk-sub-image-top-half">
                <img src={imgHeritageTopLeft} alt="Dark wood table with garden view" />
                <div className="bk-image-mask" />
              </div>
              <div className="bk-image-wrapper bk-sub-image-top-half">
                <img src={imgHeritageTopRight} alt="Blue bow-tie event hall" />
                <div className="bk-image-mask" />
              </div>
            </div>
            <div className="bk-image-wrapper bk-sub-image-bottom-full">
              <img src={imgHeritageBottom} alt="Long table with waitress and pink flowers" />
              <div className="bk-image-mask" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE ART OF CAMBODIAN HOSPITALITY */}
      <section className="bk-section bk-hospitality">
        <div className="bk-hospitality-container">
          <div className="bk-hospitality-text">
            <span className="bk-eyebrow">{t('branchDetails.philosophy.eyebrow')}</span>
            <h2 className="bk-section-title">{t('branchDetails.philosophy.title')}</h2>
            <p className="bk-desc-para">
              {t('branchDetails.philosophy.boeungKakDesc')}
            </p>
          </div>
          <div className="bk-hospitality-box">
            <span className="bk-box-tag">{t('branchDetails.philosophy.bestFor')}</span>
            <ul className="bk-box-list">
              <li className="bk-box-item">
                <span className="bk-box-icon"><Users size={20} /></span>
                <span className="bk-box-label">{t('branchDetails.philosophy.family')}</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><Briefcase size={20} /></span>
                <span className="bk-box-label">{t('branchDetails.philosophy.business')}</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><UserCheck size={20} /></span>
                <span className="bk-box-label">{t('branchDetails.philosophy.corporate')}</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><CalendarDays size={20} /></span>
                <span className="bk-box-label">{t('branchDetails.philosophy.special')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. PRIVATE DINING ROOMS */}
      <section className="bk-section bk-rooms">
        <SectionHeader 
          eyebrow={t('branchDetails.rooms.eyebrow')} 
          title={t('branchDetails.rooms.title')} 
        />
        
        <div className="bk-rooms-grid">
          {/* Room 1 — Neang Tev */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageTopLeft} alt="Neang Tev Private Room" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "នាងទេវី" : "Neang Tev"}</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>

          {/* Room 2 — Orn Tit Tom */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageBottom} alt="Orn Tit Tom Private Room" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "អនទិត្យទុំ" : "Orn Tit Tom"}</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>

          {/* Room 3 — VVIP */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageTopRight} alt="VVIP Hall" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "បន្ទប់ VVIP" : "VVIP"}</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.av')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.butler')}</li>
                <li><Check size={14} className="text-olive" /> {t('branchDetails.rooms.highlights.views')}</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">{t('branchDetails.rooms.reserveCta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHEF'S RECOMMENDATIONS */}
      <section className="bk-section bk-menu-recs">
        <SectionHeader 
          eyebrow={t('branchDetails.chefRecs.eyebrow')} 
          title={t('branchDetails.chefRecs.title')} 
        />
        
        <div className="bk-menu-grid">
          <DishCard
            name={isKhmer ? "អាម៉ុកត្រីបែបបុរាណ" : "Traditional Fish Amok"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer 
              ? "ម្ហូបខ្មែរបុរាណធ្វើពីត្រីចំហុយក្នុងទឹកគ្រឿងខ្ទិះដូងខាប់ រុំក្នុងស្លឹកចេក។"
              : "A classic Khmer dish of fish steamed in a thick savory coconut curry custard wrapped in banana leaves."}
            image={imgDish1}
            price="USD 24"
            priceSuffix={isKhmer ? "សុទ្ធ" : "/ Net"}
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
            price="USD 24"
            priceSuffix={isKhmer ? "សុទ្ធ" : "/ Net"}
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
            price="USD 24"
            priceSuffix={isKhmer ? "សុទ្ធ" : "/ Net"}
            actionText={t('branchDetails.chefRecs.addToCart')}
            index={2}
          />
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="bk-btn-menu-full">
            <Link to="/menu">{t('branchDetails.chefRecs.viewFullMenu')}</Link>
          </Button>
        </div>
      </section>

      {/* 6. EVENTS & CELEBRATIONS */}
      <section className="bk-section bk-events">
        <SectionHeader 
          eyebrow={t('branchDetails.events.eyebrow')} 
          title={t('branchDetails.events.title')} 
          align="left" 
        />

        <div className="bk-events-grid">
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
      <section className="bk-section bk-visit">
        <div className="bk-visit-container">
          {/* Left: Map image */}
          <div className="bk-visit-map">
            <img src={locationImg} alt={isKhmer ? "ផែនទីភោជនីយដ្ឋាន វ័នម័រ បឹងកក់" : "Map of One More Restaurant Boeung Kak"} className="bk-map-img" />
          </div>

          {/* Right: Contact details */}
          <div className="bk-visit-details">
            <h2 className="bk-visit-title">{t('branchDetails.visit.title')}</h2>
            <span className="bk-visit-divider" />

            <ul className="bk-details-list">
              <li className="bk-detail-item">
                <MapPin size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">{t('branchDetails.visit.labels.address')}</h4>
                  <p className="bk-detail-value">{t('branchDetails.visit.values.boeungKakAddress')}</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Phone size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">{t('branchDetails.visit.labels.phone')}</h4>
                  <p className="bk-detail-value">023 888 222</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <ArrowRight size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">{t('branchDetails.visit.labels.telegram')}</h4>
                  <p className="bk-detail-value">@OneMoreRestaurant</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Clock size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">{t('branchDetails.visit.labels.hours')}</h4>
                  <p className="bk-detail-value">{t('branchDetails.visit.values.hours')}</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Car size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">{t('branchDetails.visit.labels.parking')}</h4>
                  <p className="bk-detail-value">{t('branchDetails.visit.values.parking')}</p>
                </div>
              </li>
            </ul>

            <div className="bk-visit-actions">
              <Button asChild className="bk-btn-directions">
                <a href="https://maps.google.com/?q=One+More+Restaurant+Boeung+Kak" target="_blank" rel="noopener noreferrer">
                  {t('branchDetails.visit.directions')}
                </a>
              </Button>
              <Button asChild variant="outline" className="bk-btn-close">
                <a href="tel:023888222">{t('branchDetails.visit.call')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
