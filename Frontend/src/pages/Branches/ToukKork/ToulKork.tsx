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
  
  // Testimonial state
  const testimonials = [
    {
      id: 1,
      name: "Sovan Dara",
      date: "2 weeks ago",
      text: "An absolute gem in Toul Kork. The traditional architecture is stunning, and the private rooms are perfect for business dinners. The service is top-notch.",
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
    document.title = "One More Restaurant - Toul Kork Branch";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Experience authentic Cambodian dining at One More Restaurant Toul Kork. Ideal for family gatherings, business meetings, and elegant events in Phnom Penh.');
    }
  }, []);

  return (
    <div className="tk-page-container">
      
      {/* 1. HERO BANNER */}
      <section id="toulkork-hero" className="tk-hero">
        <div className="tk-hero-bg">
          <img src={imgBranchToulKork} alt="One More Restaurant Toul Kork Building" className="tk-hero-image" />
          <div className="tk-hero-overlay" />
        </div>
        <div className="tk-hero-content">
          <h1 className="tk-hero-title">One More Restaurant<br />Toul Kork</h1>
          <p className="tk-hero-desc">
            A premium dining destination designed for family gatherings and business meetings, serving the finest Cambodian heritage cuisine.
          </p>
          <Button asChild className="hero-cta-button">
            <Link to="/reservations">Reserve a Table</Link>
          </Button>
        </div>
      </section>

      {/* 2. ARCHITECTURAL HERITAGE & ELEGANCE */}
      <section className="tk-section tk-heritage">
        <SectionHeader eyebrow="Our Space" title="Architectural Heritage & Elegance" />
        
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
            <span className="tk-eyebrow">Our Philosophy</span>
            <h2 className="tk-section-title">The Art of Cambodian Hospitality</h2>
            <p className="tk-desc-para">
              At One More Toul Kork, we believe dining is more than just a meal—it is a cultural immersion. Our space combines traditional Khmer craftsmanship with modern sophistication, creating an atmosphere that is both grand and intimate. Whether it is a quiet family dinner or a high-stakes executive meeting, our service is tailored to exceed expectations.
            </p>
          </div>
          <div className="tk-hospitality-box">
            <span className="tk-box-tag">Best For</span>
            <ul className="tk-box-list">
              <li className="tk-box-item">
                <span className="tk-box-icon"><Users size={20} /></span>
                <span className="tk-box-label">Family Dining</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><Briefcase size={20} /></span>
                <span className="tk-box-label">Business Meetings</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><UserCheck size={20} /></span>
                <span className="tk-box-label">Corporate Lunch</span>
              </li>
              <li className="tk-box-item">
                <span className="tk-box-icon"><CalendarDays size={20} /></span>
                <span className="tk-box-label">Special Occasions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. PRIVATE DINING ROOMS */}
      <section className="tk-section tk-rooms">
        <SectionHeader eyebrow="Exclusivity" title="Private Dining Rooms" />
        
        <div className="tk-rooms-grid">
          {/* Room 1 — Neang Tev */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageTopLeft} alt="Neang Tev Private Room" />
              <div className="tk-room-badge">8-12 guests</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">Neang Tev</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>

          {/* Room 2 — Orn Tit Tom */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageBottom} alt="Orn Tit Tom Private Room" />
              <div className="tk-room-badge">8-12 guests</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">Orn Tit Tom</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>

          {/* Room 3 — VVIP */}
          <div className="tk-room-card">
            <div className="tk-room-img-wrapper">
              <img src={imgHeritageTopRight} alt="VVIP Hall" />
              <div className="tk-room-badge">8-12 guests</div>
            </div>
            <div className="tk-room-body">
              <h3 className="tk-room-name">VVIP</h3>
              <ul className="tk-room-highlights">
                <li><Check size={14} className="text-olive" /> Integrated AV system</li>
                <li><Check size={14} className="text-olive" /> Personal butler service</li>
                <li><Check size={14} className="text-olive" /> Garden views</li>
              </ul>
              <Button asChild className="tk-room-button">
                <Link to="/reservations">Reserve Private Room</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHEF'S RECOMMENDATIONS */}
      <section className="tk-section tk-menu-recs">
        <SectionHeader eyebrow="Our Menu" title="Chef's Recommendations" />
        
        <div className="tk-menu-grid">
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
          <Button asChild variant="outline" className="tk-btn-menu-full">
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </section>

      {/* 6. EVENTS & CELEBRATIONS */}
      <section className="tk-section tk-events">
        <SectionHeader eyebrow="Host With Us" title="Events & Celebrations" align="left" />

        <div className="tk-events-grid">
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
      <section className="tk-section tk-testimonials">
        <SectionHeader eyebrow="Reviews" title="What Our Guests Say" description="Experiences shared by our valued customers" />
        
        <div className="tk-testimonial-slider">
          <div className="tk-testimonial-card">
            <div className="tk-stars">
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
              <Star size={16} fill="#6b9158" className="text-olive" />
            </div>
            
            <span className="tk-quote-mark">“</span>
            
            <p className="tk-testimonial-text">
              {testimonials[currentTestimonial].text}
            </p>
            
            <div className="tk-testimonial-user">
              <img 
                src={testimonials[currentTestimonial].avatar} 
                alt={testimonials[currentTestimonial].name} 
                className="tk-avatar" 
              />
              <div className="tk-user-info">
                <h4 className="tk-user-name">{testimonials[currentTestimonial].name}</h4>
                <span className="tk-user-date">{testimonials[currentTestimonial].date}</span>
              </div>
            </div>
          </div>
          
          <div className="tk-slider-nav">
            <button onClick={prevTestimonial} className="tk-slider-btn" aria-label="Previous review">
              <ChevronLeft size={20} />
            </button>
            <div className="tk-slider-dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentTestimonial(index)}
                  className={`tk-slider-dot ${currentTestimonial === index ? 'active' : ''}`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} className="tk-slider-btn" aria-label="Next review">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. VISIT US */}
      <section className="tk-section tk-visit">
        <div className="tk-visit-container">
          {/* Left: Map image */}
          <div className="tk-visit-map">
            <img src={locationImg} alt="Map of One More Restaurant Toul Kork" className="tk-map-img" />
          </div>

          {/* Right: Contact details */}
          <div className="tk-visit-details">
            <h2 className="tk-visit-title">Visit Us</h2>
            <span className="tk-visit-divider" />

            <ul className="tk-details-list">
              <li className="tk-detail-item">
                <MapPin size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">Address</h4>
                  <p className="tk-detail-value">63 Street R11, Phnom Penh 120210</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Phone size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">Phone</h4>
                  <p className="tk-detail-value">023 888 222</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <ArrowRight size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">Telegram</h4>
                  <p className="tk-detail-value">@OneMoreRestaurant</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Clock size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">Opening Hours</h4>
                  <p className="tk-detail-value">Daily: 11:00 AM – 10:00 PM</p>
                </div>
              </li>
              <li className="tk-detail-item">
                <Car size={20} className="tk-detail-icon text-olive" />
                <div>
                  <h4 className="tk-detail-label">Parking</h4>
                  <p className="tk-detail-value">Free secure parking available</p>
                </div>
              </li>
            </ul>

            <div className="tk-visit-actions">
              <Button asChild className="tk-btn-directions">
                <a href="https://maps.google.com/?q=One+More+Restaurant+Toul+Kork" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
              </Button>
              <Button asChild variant="outline" className="tk-btn-close">
                <a href="tel:023888222">Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
