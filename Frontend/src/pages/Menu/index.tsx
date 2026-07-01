import React, { useState, useEffect, useRef } from 'react';
import DishCard from '@/components/ui/dish-card';
import { getMenuData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import './index.css';
import imgLotusHalf from '@/assets/Half lotus.png';

// Background assets
import imgHeroBg from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png';

// Breakfast assets
import imgBreakfast1 from '@/assets/Food/Breakfast/khmer-noodle-soup.png';
import imgBreakfast2 from '@/assets/Food/Breakfast/bean-sprout-fried-noodle.png';
import imgBreakfast3 from '@/assets/Food/Breakfast/beef-fried-noodle.png';
import imgBreakfast4 from '@/assets/Food/Breakfast/seafood-fried-noodle.png';
import imgBreakfast5 from '@/assets/Food/Breakfast/pork-bone-soup.png';
import imgBreakfast6 from '@/assets/Food/Breakfast/meatball-kuyteav.png';

// Lunch & Dinner assets
import imgLunch1 from '@/assets/Food/Lunch and Dinner/fish-amok-coconut.png';
import imgLunch2 from '@/assets/Food/Lunch and Dinner/banana-blossom-chicken-salad.png';
import imgLunch3 from '@/assets/Food/Lunch and Dinner/stir-fried-cockles-tamarind.png';
import imgLunch4 from '@/assets/Food/Lunch and Dinner/britian-loklak.png';
import imgLunch5 from '@/assets/Food/Lunch and Dinner/curry-lobster.png';
import imgLunch6 from '@/assets/Food/Lunch and Dinner/samlor-korko-catfish.png';

// Dessert assets
import imgDessert1 from '@/assets/Food/Dessert/five-signature-dessert.png';

// Fallback high-res food images for visual variety
import imgDish2 from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.png';

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

type MenuItem = {
  name: string;
  category: string;
  desc: string;
  img: string;
  price: string;
  badge?: string;
};

const imageMapper: Record<string, string> = {
  '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png': imgHeroBg,
  '@/assets/Food/Breakfast/khmer-noodle-soup.png': imgBreakfast1,
  '@/assets/Food/Breakfast/bean-sprout-fried-noodle.png': imgBreakfast2,
  '@/assets/Food/Breakfast/beef-fried-noodle.png': imgBreakfast3,
  '@/assets/Food/Breakfast/seafood-fried-noodle.png': imgBreakfast4,
  '@/assets/Food/Breakfast/pork-bone-soup.png': imgBreakfast5,
  '@/assets/Food/Breakfast/meatball-kuyteav.png': imgBreakfast6,
  '@/assets/Food/Lunch and Dinner/fish-amok-coconut.png': imgLunch1,
  '@/assets/Food/Lunch and Dinner/banana-blossom-chicken-salad.png': imgLunch2,
  '@/assets/Food/Lunch and Dinner/stir-fried-cockles-tamarind.png': imgLunch3,
  '@/assets/Food/Lunch and Dinner/britian-loklak.png': imgLunch4,
  '@/assets/Food/Lunch and Dinner/curry-lobster.png': imgLunch5,
  '@/assets/Food/Lunch and Dinner/samlor-korko-catfish.png': imgLunch6,
  '@/assets/Food/Dessert/five-signature-dessert.png': imgDessert1,
  '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png': imgDish2,
  '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.png': imgDish3,
};

export default function Menu() {
  const { t, getObject, isKhmer } = useTranslation();
  const [menuDataState, setMenuDataState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isLotusVisible, setIsLotusVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  const translatedCategoryNames: Record<MenuCategory, string> = {
    Breakfast: t('menu.categories.breakfast', undefined, 'Breakfast'),
    Lunch: t('menu.categories.lunch', undefined, 'Lunch'),
    Dinner: t('menu.categories.dinner', undefined, 'Dinner'),
    Dessert: t('menu.categories.dessert', undefined, 'Dessert'),
    Drinks: t('menu.categories.drinks', undefined, 'Drinks'),
  };

  useEffect(() => {
    getMenuData()
      .then((res) => {
        setMenuDataState(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load menu data.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth >= 768 ? 480 : 400;
      setIsStickyVisible(window.scrollY > threshold);
      if (window.scrollY > 15) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loading || error || !menuDataState) return;

    const observerOptions = {
      root: null,
      rootMargin: '-180px 0px -50% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        const closest = intersectingEntries.reduce((prev, curr) => {
          return Math.abs(curr.boundingClientRect.top - 180) < Math.abs(prev.boundingClientRect.top - 180)
            ? curr
            : prev;
        });

        const categoryId = closest.target.id;
        const matchedCategory = categories.find(
          (c) => c.toLowerCase() === categoryId
        );
        if (matchedCategory) {
          setActiveCategory(matchedCategory);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    categories.forEach((category) => {
      const element = document.getElementById(category.toLowerCase());
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, error, menuDataState]);

  useEffect(() => {
    if (loading || error || !menuDataState) return;

    const revealOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px', 
      threshold: 0.05,
    };

    const handleReveal = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Only reveal if the user has scrolled
        if (entry.isIntersecting && hasScrolled) {
          entry.target.classList.add('section-visible');
          setIsLotusVisible(true);
          revealObserver.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(handleReveal, revealOptions);

    categories.forEach((category) => {
      const element = document.getElementById(category.toLowerCase());
      if (element) {
        revealObserver.observe(element);
      }
    });

    return () => {
      revealObserver.disconnect();
    };
  }, [loading, error, menuDataState, hasScrolled]);

  const handleCategoryClick = (category: MenuCategory) => {
    const element = document.getElementById(category.toLowerCase());
    if (element) {
      element.classList.add('section-visible');
      setIsLotusVisible(true);
      if (observerRef.current) {
        categories.forEach((cat) => {
          const el = document.getElementById(cat.toLowerCase());
          if (el) observerRef.current?.unobserve(el);
        });
      }

      setActiveCategory(category);

      element.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        categories.forEach((cat) => {
          const el = document.getElementById(cat.toLowerCase());
          if (el) observerRef.current?.observe(el);
        });
      }, 850);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl min-h-screen flex items-center justify-center">
        {t('menu.loading', undefined, 'Loading menu...')}
      </div>
    );
  }

  if (error || !menuDataState) {
    return (
      <div className="pt-28 pb-20 text-center text-red-500 font-serif text-xl min-h-screen flex items-center justify-center">
        {error ? t('menu.errors.load', undefined, error) : t('menu.errors.noData', undefined, 'No menu data available.')}
      </div>
    );
  }

  // Parse item images and translate properties dynamically
  const menuItemsData: Record<MenuCategory, MenuItem[]> = Object.keys(menuDataState.items).reduce((acc, cat) => {
    const category = cat as MenuCategory;
    const itemsList = (menuDataState.items as any)[category];

    acc[category] = itemsList.map((item: any) => {
      return {
        name: isKhmer ? (item.name_kh || item.name) : item.name,
        category: isKhmer ? translatedCategoryNames[category] : category,
        desc: item.desc || '',
        badge: item.badge,
        img: item.img,
        price: item.price,
      };
    });
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  const { hero } = menuDataState;
  const heroBg = imageMapper[hero.backgroundImage] || imgHeroBg;

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      {/* Hero Header Section */}
      <section className="relative w-full h-[500px] md:h-[580px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img
            alt={t('menu.hero.backgroundAlt', undefined, 'Menu Header Background')}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroBg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/65" />
        </div>

        <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-16 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[70px] leading-tight mb-4 font-normal tracking-wide drop-shadow-md">
            {t('menu.hero.title', undefined, hero.title)}
          </h1>

          <p className="text-white/80 text-base md:text-lg font-sans font-light max-w-xl mx-auto leading-relaxed drop-shadow-sm mb-10">
            {t('menu.hero.subtitle', undefined, hero.subtitle)}
          </p>

          {/* Hero Category Filter Tabs */}
          <div className="menu-hero-tabs-container">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`hero-category-pill-btn ${
                    isActive ? 'hero-category-pill-btn-active' : 'hero-category-pill-btn-inactive'
                  }`}
                >
                  {translatedCategoryNames[category]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Category Filter Tabs */}
      <div className={`menu-sticky-tabs-container ${isStickyVisible ? 'menu-sticky-tabs-visible' : 'menu-sticky-tabs-hidden'}`}>
        <div className="menu-sticky-tabs-inner">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`category-pill-btn ${
                  isActive ? 'category-pill-btn-active' : 'category-pill-btn-inactive'
                }`}
              >
                {translatedCategoryNames[category]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid Sections */}
      <section className="w-full py-16 bg-white flex flex-col items-center relative overflow-hidden">
        {/* Lotus Background Pattern */}
        <div className={`lotus-bg-wrapper ${isLotusVisible ? 'lotus-bg-visible' : ''}`}>
          <div className="lotus-bg-pattern" style={{ backgroundImage: `url("${imgLotusHalf}")` }} />
        </div>

        <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center relative z-10">
          {categories.map((category) => (
            <div
              key={category}
              id={category.toLowerCase()}
              className="menu-section section-animate w-full py-16 first:pt-4 last:pb-16 border-b border-[#dde0dc]/50 last:border-b-0"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-wide mb-16 text-[#212d1b]">
                {translatedCategoryNames[category]}
              </h2>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 w-full text-left">
                {menuItemsData[category].map((dish, index) => (
                  <DishCard
                    key={`${dish.name}-${index}`}
                    className="menu-dish-card"
                    index={index}
                    name={dish.name}
                    category={dish.category}
                    description={dish.desc}
                    image={dish.img}
                    price={dish.price}
                    badge={dish.badge}
                    actionText={isKhmer ? 'កម្មង់ឥឡូវនេះ' : 'Add to Order'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
