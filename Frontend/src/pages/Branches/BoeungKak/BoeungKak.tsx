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
import DishCard from '@/components/ui/dish-card';
import SharpImageCard from '@/components/SharpImageCard';
import './BoeungKak.css';

// Asset imports matching homeAssets
import imgBranchBoeungKak from '@/assets/Bk.png'; // Boeung Kak Building
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
import locationImg from '@/assets/Location Bk.png';

export default function BoeungKak() {
  const navigate = useNavigate();
  
  // Testimonial state
  const testimonials = [
    {
      id: 1,
      name: "Sovan Dara",
      date: "2 weeks ago",
      text: "An absolute gem in Boeung Kak. The traditional architecture is stunning, and the private rooms are perfect for business dinners. The service is top-notch.",
      avatar: imgAvatar1
    },
    {
      id: 2,
      name: "Vichea Pok",
      date: "1 month ago",
      text: "The best place to experience authentic Khmer fine dining. Beautiful garden setting and the Amok Trey is outstanding. Highly recommended!",
      avatar: imgAvatar2
    },
    {
      id: 3,
      name: "Chanthy Chea",
      date: "1 month ago",
      text: "Excellent venue for corporate events. We hosted a seminar in their VIP room, and the AV setup and catering exceeded our expectations.",
      avatar: imgAvatar3
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Set document title & SEO meta
  useEffect(() => {
    document.title = "One More Restaurant - Boeung Kak Branch";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Experience authentic Cambodian dining at One More Restaurant Boeung Kak. Ideal for family gatherings, business meetings, and elegant events in Phnom Penh.');
    }
  }, []);

  return (
    <div className="bk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="boeungkak-hero" className="bk-hero">
        <div className="bk-hero-bg">
          <img src={imgBranchBoeungKak} alt="One More Restaurant Boeung Kak Building" className="bk-hero-image" />
          <div className="bk-hero-overlay" />
        </div>
        <div className="bk-hero-content">
          <h1 className="bk-hero-title">One More Restaurant<br />Boeung Kak</h1>
          <p className="bk-hero-desc">
            A premium dining destination designed for family gatherings and business meetings, serving the finest Cambodian heritage cuisine.
          </p>
          <Button asChild className="hero-cta-button">
            <Link to="/reservations">Reserve a Table</Link>
          </Button>
        </div>
      </section>

      {/* 2. ARCHITECTURAL HERITAGE & ELEGANCE */}
      <section className="bk-section bk-heritage">
        <SectionHeader eyebrow="Our Space" title="Architectural Heritage & Elegance" />
        
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
            <span className="bk-eyebrow">Our Philosophy</span>
            <h2 className="bk-section-title">The Art of Cambodian Hospitality</h2>
            <p className="bk-desc-para">
              At One More Boeung Kak, we believe dining is more than just a meal—it is a cultural immersion. Our space combines traditional Khmer craftsmanship with modern sophistication, creating an atmosphere that is both grand and intimate. Whether it is a quiet family dinner or a high-stakes executive meeting, our service is tailored to exceed expectations.
            </p>
          </div>
          <div className="bk-hospitality-box">
            <span className="bk-box-tag">Best For</span>
            <ul className="bk-box-list">
              <li className="bk-box-item">
                <span className="bk-box-icon"><Users size={20} /></span>
                <span className="bk-box-label">Family Dining</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><Briefcase size={20} /></span>
                <span className="bk-box-label">Business Meetings</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><UserCheck size={20} /></span>
                <span className="bk-box-label">Corporate Lunch</span>
              </li>
              <li className="bk-box-item">
                <span className="bk-box-icon"><CalendarDays size={20} /></span>
                <span className="bk-box-label">Special Occasions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. PRIVATE DINING ROOMS */}
      <section className="bk-section bk-rooms">
        <SectionHeader eyebrow="Exclusivity" title="Private Dining Rooms" />
        
        <div className="bk-rooms-grid">
          {/* Room 1 — Neang Tev */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageTopLeft} alt="Neang Tev Private Room" />
              <div className="bk-room-badge">8-12 guests</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">Neang Tev</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>

          {/* Room 2 — Orn Tit Tom */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageBottom} alt="Orn Tit Tom Private Room" />
              <div className="bk-room-badge">8-12 guests</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">Orn Tit Tom</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>

          {/* Room 3 — VVIP */}
          <div className="bk-room-card">
            <div className="bk-room-img-wrapper">
              <img src={imgHeritageTopRight} alt="VVIP Hall" />
              <div className="bk-room-badge">8-12 guests</div>
            </div>
            <div className="bk-room-body">
              <h3 className="bk-room-name">VVIP</h3>
              <ul className="bk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="bk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHEF'S RECOMMENDATIONS */}
      <section className="bk-section bk-menu-recs">
        <SectionHeader eyebrow="Our Menu" title="Chef's Recommendations" />
        
        <div className="bk-menu-grid">
          <DishCard
            name="Amok Trey"
            category="Signature"
            description="A classic Khmer dish of fish steamed in a thick savory coconut curry custard wrapped in banana leaves."
            image={imgDish1}
            price="$24"
            priceSuffix="USD / Net"
            actionText="ADD TO CART"
            index={0}
          />

          <DishCard
            name="Amok Trey"
            category="Signature"
            description="Savory Cambodian fish amok cooked in traditional spices, coconut cream, and sweet leaf bush."
            image={imgDish2}
            price="$24"
            priceSuffix="USD / Net"
            actionText="ADD TO CART"
            index={1}
          />

          <DishCard
            name="Amok Trey"
            category="Signature"
            description="Rich Khmer style steamed fish curry with local herbs, kaffir lime leaf, lemongrass paste, and coconut milk."
            image={imgDish3}
            price="$24"
            priceSuffix="USD / Net"
            actionText="ADD TO CART"
            index={2}
          />
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="bk-btn-menu-full">
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </section>

      {/* 6. EVENTS & CELEBRATIONS */}
      <section className="bk-section bk-events">
        <SectionHeader eyebrow="Host With Us" title="Events & Celebrations" align="left" />

        <div className="bk-events-grid">
          <SharpImageCard
            image={imgGallery3}
            alt="Birthday Celebrations"
            title="Birthday Celebrations"
            description="Create lasting memories with our bespoke party planning."
            buttonLabel="Plan Your Event"
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgHeritageBottom}
            alt="Engagement Dinners"
            title="Engagement Dinners"
            description="Intimate and romantic settings for your big announcement."
            buttonLabel="Plan Your Event"
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgGallery4}
            alt="Family Gatherings"
            title="Family Gatherings"
            description="Spacious enough for the whole family to share heritage recipes."
            buttonLabel="Plan Your Event"
            buttonHref="/reservations"
          />
          <SharpImageCard
            image={imgGallery2}
            alt="Corporate Events"
            title="Corporate Events"
            description="The perfect professional backdrop for meetings and launches."
            buttonLabel="Plan Your Event"
            buttonHref="/reservations"
          />
        </div>
      </section>

      {/* 7. WHAT OUR GUESTS SAY */}
      <section className="bk-section bk-testimonials">
        <SectionHeader eyebrow="Reviews" title="What Our Guests Say" description="Experiences shared by our valued customers" />
        
        <div className="bk-testimonial-slider">
          <div className="bk-testimonial-card">
            <div className="bk-stars">
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
            </div>
            
            <span className="bk-quote-mark">“</span>
            
            <p className="bk-testimonial-text">
              {testimonials[currentTestimonial].text}
            </p>
            
            <div className="bk-testimonial-user">
              <img 
                src={testimonials[currentTestimonial].avatar} 
                alt={testimonials[currentTestimonial].name} 
                className="bk-avatar" 
              />
              <div className="bk-user-info">
                <h4 className="bk-user-name">{testimonials[currentTestimonial].name}</h4>
                <span className="bk-user-date">{testimonials[currentTestimonial].date}</span>
              </div>
            </div>
          </div>
          
          <div className="bk-slider-nav">
            <button onClick={prevTestimonial} className="bk-slider-btn" aria-label="Previous review">
              <ChevronLeft size={20} />
            </button>
            <div className="bk-slider-dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentTestimonial(index)}
                  className={`bk-slider-dot ${currentTestimonial === index ? 'active' : ''}`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} className="bk-slider-btn" aria-label="Next review">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. VISIT US */}
      <section className="bk-section bk-visit">
        <div className="bk-visit-container">
          {/* Left: Map image */}
          <div className="bk-visit-map">
            <img src={locationImg} alt="Map of One More Restaurant Boeung Kak" className="bk-map-img" />
          </div>

          {/* Right: Contact details */}
          <div className="bk-visit-details">
            <h2 className="bk-visit-title">Visit Us</h2>
            <span className="bk-visit-divider" />

            <ul className="bk-details-list">
              <li className="bk-detail-item">
                <MapPin size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">Address</h4>
                  <p className="bk-detail-value">63 Street R11, Phnom Penh 120210</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Phone size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">Phone</h4>
                  <p className="bk-detail-value">023 888 222</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <ArrowRight size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">Telegram</h4>
                  <p className="bk-detail-value">@OneMoreRestaurant</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Clock size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">Opening Hours</h4>
                  <p className="bk-detail-value">Daily: 11:00 AM – 10:00 PM</p>
                </div>
              </li>
              <li className="bk-detail-item">
                <Car size={20} className="bk-detail-icon text-olive" />
                <div>
                  <h4 className="bk-detail-label">Parking</h4>
                  <p className="bk-detail-value">Free secure parking available</p>
                </div>
              </li>
            </ul>

            <div className="bk-visit-actions">
              <Button asChild className="bk-btn-directions">
                <a href="https://maps.google.com/?q=One+More+Restaurant+Toul+Kork" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
              </Button>
              <Button asChild variant="outline" className="bk-btn-close">
                <a href="tel:023888222">Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
