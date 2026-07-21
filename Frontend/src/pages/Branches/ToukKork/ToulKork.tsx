import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Send,
  Info,
  Users,
  Briefcase,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import SectionHeader from '@/components/SectionHeader';
import TestimonialSection from '@/components/TestimonialSection';
import DishCard from '@/components/ui/dish-card';
import SharpImageCard from '@/components/SharpImageCard';
import { useTranslation } from '@/hooks/useTranslation';
import { getTestimonialsData } from '@/lib/api';
import { imageMap } from '@/pages/Home/homeAssets';
import './ToulKork.css';

// Asset imports matching homeAssets
import imgBranchToulKork from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.webp'; // Toul Kork Building
import imgHeritageMain from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp'; // Curved wood interior (main left)
import imgHeritageTopLeft from '@/assets/toul-kork-room-no-logo.webp'; // Nighttime Toul Kork room image (top-left)
import imgNeangTeav from '@/assets/neang teav.png'; // Neang Tev room
import imgOrnTitTom from '@/assets/orn tit tom.png'; // Orn Tit Tom room
import imgHeritageTopRight from '@/assets/moments.jpg'; // Outdoor deck with balloons (top-right)
import imgHeritageBottom from '@/assets/tk yellow.jpg'; // Outdoor canopy with yellow lights (bottom)
import imgVipTk from '@/assets/vip tk.png'; // VIP Room image
import imgSpace2 from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.webp'; // Event hall (used in private rooms)
import imgGallery1 from '@/assets/neang teav.png'; // Neang Tev room
import imgGallery2 from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.webp'; // Round tables private dining
import imgGallery3 from '@/assets/moments.jpg'; // Event hall with balloons
import imgFamilyPkg from '@/assets/Family_compressed.jpg'; // Family celebration image
import imgGallery6 from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp'; // Corporate meeting

// Dish assets
import imgDish1 from '@/assets/home-v2/36191a3943135f3542a0fe8b80adee304f122115.webp';
import imgDish2 from '@/assets/Food/Lunch and Dinner/compressed_ហហ្មុក.webp';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.webp';

// Map asset
import locationImg from '@/assets/Location Tk.webp';

export default function ToulKork() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isKhmer } = useTranslation();
  
  // Testimonial state
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    getTestimonialsData()
      .then((res) => {
        const items = (res || []).map((item: any) => ({
          ...item,
          ...(isKhmer ? item.translations?.kh : {}),
          avatar: imageMap[item.avatar] || item.avatar,
        }));
        setTestimonials(items);
      })
      .catch((err) => console.error(err));
  }, [isKhmer]);

  useEffect(() => {
    if (location.hash !== '#visit-us') return;

    const scrollToVisitUs = () => {
      document.getElementById('visit-us')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const animationFrame = requestAnimationFrame(scrollToVisitUs);
    const timeout = window.setTimeout(scrollToVisitUs, 300);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [location.hash, testimonials.length]);



  return (
    <div className="tk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="toulkork-hero" className="tk-hero">
        <div className="tk-hero-bg">
          <img src={imgBranchToulKork} alt={isKhmer ? "អគារភោជនីយដ្ឋានវ័នម៉រ ទួលគោក" : "One More Restaurant Toul Kork Building"} className="tk-hero-image" />
          <div className="tk-hero-overlay" />
        </div>

        {/* Breadcrumb container aligned to the top-left corner matching site grid */}
        <div className="absolute top-[102px] left-0 right-0 z-10 w-full max-w-[1440px] mx-auto px-6 md:px-16 hidden lg:block">
          <Breadcrumb className="flex justify-start">
            <BreadcrumbList className="text-[#f6fdf2] opacity-80 flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-widest">
              <BreadcrumbItem className="opacity-60 hover:opacity-100 transition-opacity">
                <BreadcrumbLink asChild>
                  <Link to="/">{t('nav.home', undefined, 'Home')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="opacity-30" />
              <BreadcrumbItem className="opacity-60 hover:opacity-100 transition-opacity">
                <BreadcrumbLink asChild>
                  <Link to="/branches">{t('nav.branches', undefined, 'Branches')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="opacity-30" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#f6fdf2] font-semibold">
                  {t('branchesPage.ui.comparison.toulKorkTitle', undefined, isKhmer ? 'ទួលគោក' : 'Toul Kork')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="tk-hero-content">
          <h1 className="page-hero-title tk-hero-title">
            {isKhmer ? <><span className="md:whitespace-nowrap">ភោជនីយដ្ឋាន វ័នម៉រ</span><br />ទួលគោក</> : <><span className="md:whitespace-nowrap">One More Restaurant</span><br />Toul Kork</>}
          </h1>
          <p className="tk-hero-desc">
            {t('branchDetails.hero.toulKork.desc')}
          </p>
          <Button asChild className="hero-cta-button">
            <Link to="/reservations?branch=toul-kork">{t('branchDetails.hero.cta')}</Link>
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
                <img src={imgHeritageTopLeft} alt="Toul Kork room" />
                <div className="tk-image-mask" />
              </div>
              <div className="tk-image-wrapper tk-sub-image-top-half">
                <img src={imgHeritageTopRight} alt="Outdoor balloon patio" />
                <div className="tk-image-mask" />
              </div>
            </div>
            <div className="tk-image-wrapper tk-sub-image-bottom-full">
              <img src={imgHeritageBottom} alt="TK outdoor canopy dining area" />
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
              <img src={imgNeangTeav} alt="Neang Tev Private Room" className="tk-room-img-reveal-left" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "នាងទាវ" : "Neang Tev"}</h3>
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
              <img src={imgOrnTitTom} alt="Orn Tit Tom Private Room" className="tk-room-img-reveal-right" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "អន្ទិតទុំ" : "Orn Tit Tom"}</h3>
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

          {/* Room 3 — VIP Room */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgVipTk} alt="VIP Room" />
              <div className="tk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">{isKhmer ? "បន្ទប់ VIP" : "VIP Room"}</h3>
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
            name={isKhmer ? "មីឆា One More" : "Onemore Fried Noodle"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer 
              ? "សាច់មាន់អាំងពណ៌មាស បម្រើលើមីឆាជាមួយសណ្ដែកបណ្ដុះ គូឆាយ និងគ្រឿងផ្សំប្រចាំហាងដ៏ឈ្ងុយឆ្ងាញ់។"
              : "Golden grilled chicken served over wok-fried noodles with crisp bean sprouts, chives, and savory house seasoning."}
            image={imgDish1}
            price="USD 6.50"
            priceSuffix=""
            showAction={false}
            index={0}
          />

          <DishCard
            name={isKhmer ? "អាម៉ុកត្រីក្នុងដូងខ្ចី" : "Fish Amok in Young Coconut"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer
              ? "ត្រីទន់ចំហុយជាមួយខ្ទិះដូង គ្រឿងខ្មែរ និងស្លឹកក្រូចសើច បម្រើក្នុងផ្លែដូងខ្ចី។"
              : "Tender fish steamed with coconut cream, Khmer kroeung, and kaffir lime, served in a fresh young coconut."}
            image={imgDish2}
            price="USD 9.90"
            priceSuffix=""
            showAction={false}
            index={1}
          />

          <DishCard
            name={isKhmer ? "លៀសឆាម្រះព្រៅទឹកអំពិលទុំ" : "Stir-Fried Cockle, Hot Basil in Tamarind Sauce"}
            category={isKhmer ? "ការណែនាំ" : "Recommendation"}
            description={isKhmer
              ? "លៀសស្រស់ឆាជាមួយទឹកអំពិលទុំ ជី និងម្ទេសស្រាលៗ មានរសជាតិជូរផ្អែមឈ្ងុយឆ្ងាញ់។"
              : "Fresh cockles stir-fried with tamarind sauce, aromatic herbs, and a gentle chili kick."}
            image={imgDish3}
            price="USD 8.90"
            priceSuffix=""
            showAction={false}
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
            image={imgHeritageBottom}
            alt={t('branchDetails.events.items.birthday.title')}
            title={t('branchDetails.events.items.birthday.title')}
            description={t('branchDetails.events.items.birthday.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations?branch=toul-kork"
          />
          <SharpImageCard
            image={imgGallery3}
            alt={t('branchDetails.events.items.engagement.title')}
            title={t('branchDetails.events.items.engagement.title')}
            description={t('branchDetails.events.items.engagement.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations?branch=toul-kork"
          />
          <SharpImageCard
            image={imgFamilyPkg}
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
        className="tk-testimonials"
      />

      {/* 8. VISIT US */}
      <section id="visit-us" className="tk-section tk-visit">
        <div className="tk-visit-container">
          {/* Left: Map image */}
          <div className="tk-visit-map">
            <img src={locationImg} alt={isKhmer ? "ផែនទីភោជនីយដ្ឋាន វ័នម៉រ ទួលគោក" : "Map of One More Restaurant Toul Kork"} className="tk-map-img" />
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
                <Send size={20} className="tk-detail-icon" />
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
