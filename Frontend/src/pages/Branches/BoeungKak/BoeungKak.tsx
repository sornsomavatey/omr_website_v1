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
  ArrowRight,
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
import './BoeungKak.css';

// Asset imports matching homeAssets
import imgBranchBoeungKak from '@/assets/Bk.webp'; // Boeung Kak Building
import imgHeritageMain from '@/assets/Bk space1.jpg'; // Boeung Kak interior main
import imgHeritageTopLeft from '@/assets/bk space2.jpg'; // Boeung Kak space top left
import imgHeritageTopRight from '@/assets/bk space3.jpg'; // Boeung Kak space top right
import imgHeritageBottom from '@/assets/bk space4.jpg'; // Boeung Kak space bottom full
import imgNeangTeav from '@/assets/neang teav.png'; // Neang Tev room
import imgOrnTitTom from '@/assets/orn tit tom.png'; // Orn Tit Tom room
import imgNekJei from '@/assets/nek jei.png'; // Nek Jei room
import imgNekSok from '@/assets/nek sok .png'; // Nek Sok room
import imgVipBk from '@/assets/bk vip.png'; // Boeung Kak VIP Room image
import imgBirthdayBk from '@/assets/birthday bk.jpg'; // Boeung Kak Birthday celebration image
import imgEngagementCompressed from '@/assets/engagement_compressed.jpg'; // Engagement celebration image
import imgFamilyPkg from '@/assets/Family_compressed.jpg'; // Family celebration image
import imgSpace2 from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.webp'; // Event hall (used in private rooms)
import imgGallery1 from '@/assets/neang teav.png'; // Neang Tev room
import imgGallery2 from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.webp'; // Round tables private dining
import imgGallery3 from '@/assets/moments.jpg'; // Event hall with balloons
import imgGallery4 from '@/assets/home-v2/80bc2f874a3b8b65fc3bd247f23046db8632d909.webp'; // People dining
import imgGallery6 from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp'; // Corporate meeting

// Dish assets
import imgDish1 from '@/assets/home-v2/36191a3943135f3542a0fe8b80adee304f122115.webp';
import imgDish2 from '@/assets/Food/Lunch and Dinner/compressed_ហហ្មុក.webp';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.webp';

// Map asset
import locationImg from '@/assets/Location Bk.webp';

export default function BoeungKak() {
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
    <div className="bk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="boeungkak-hero" className="bk-hero">
        <div className="bk-hero-bg">
          <img src={imgBranchBoeungKak} alt={isKhmer ? "អគារភោជនីយដ្ឋានវ័នម៉រ បឹងកក់" : "One More Restaurant Boeung Kak Building"} className="bk-hero-image" />
          <div className="bk-hero-overlay" />
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
                  {t('branchesPage.ui.comparison.boeungKakTitle', undefined, isKhmer ? 'បឹងកក់' : 'Boeung Kak')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="bk-hero-content">
          <h1 className="page-hero-title bk-hero-title">
            {isKhmer ? <><span className="md:whitespace-nowrap">ភោជនីយដ្ឋាន វ័នម៉រ</span><br />បឹងកក់</> : <><span className="md:whitespace-nowrap">One More Restaurant</span><br />Boeung Kak</>}
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
              <img src={imgHeritageMain} alt="Boeung Kak main space interior" />
              <div className="bk-image-mask" />
            </div>
          </div>
          <div className="bk-heritage-right">
            <div className="bk-heritage-right-top">
              <div className="bk-image-wrapper bk-sub-image-top-half">
                <img src={imgHeritageTopLeft} alt="Boeung Kak private dining space" />
                <div className="bk-image-mask" />
              </div>
              <div className="bk-image-wrapper bk-sub-image-top-half">
                <img src={imgHeritageTopRight} alt="Boeung Kak hall setting" />
                <div className="bk-image-mask" />
              </div>
            </div>
            <div className="bk-image-wrapper bk-sub-image-bottom-full">
              <img src={imgHeritageBottom} alt="Boeung Kak event setup" />
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
          {/* Room 1 — Nek Jei */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgNekJei} alt="Nek Jei Private Room" className="bk-room-img-reveal-left" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "អ្នកជ័យ" : "Nek Jei"}</h3>
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

          {/* Room 2 — Nek Sok */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgNekSok} alt="Nek Sok Private Room" className="bk-room-img-reveal-right" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "អ្នកសុខ" : "Nek Sok"}</h3>
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

          {/* Room 3 — VIP Room */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgVipBk} alt="VIP Room" />
              <div className="bk-room-badge">{t('branchDetails.rooms.guestBadge')}</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">{isKhmer ? "បន្ទប់ VIP" : "VIP Room"}</h3>
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
            image={imgBirthdayBk}
            alt={t('branchDetails.events.items.birthday.title')}
            title={t('branchDetails.events.items.birthday.title')}
            description={t('branchDetails.events.items.birthday.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgEngagementCompressed}
            alt={t('branchDetails.events.items.engagement.title')}
            title={t('branchDetails.events.items.engagement.title')}
            description={t('branchDetails.events.items.engagement.desc')}
            buttonLabel={t('branchDetails.events.planCta')}
            buttonHref="/reservations"
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
            image={imgHeritageTopLeft}
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
      <section id="visit-us" className="bk-section bk-visit">
        <div className="bk-visit-container">
          {/* Left: Map image */}
          <div className="bk-visit-map">
            <img src={locationImg} alt={isKhmer ? "ផែនទីភោជនីយដ្ឋាន វ័នម៉រ បឹងកក់" : "Map of One More Restaurant Boeung Kak"} className="bk-map-img" />
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
