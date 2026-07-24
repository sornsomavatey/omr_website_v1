import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DishCard from '@/components/ui/dish-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMenuData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import './index.css';
import imgLotusHalf from '@/assets/Half lotus.webp';

// Background assets
import imgHeroBg from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.webp';

// Breakfast assets
import imgBreakfast1 from '@/assets/Food/Breakfast/khmer-noodle-soup.webp';
import imgBreakfast2 from '@/assets/Food/Breakfast/bean-sprout-fried-noodle.webp';
import imgBreakfast3 from '@/assets/Food/Breakfast/beef-fried-noodle.webp';
import imgBreakfast4 from '@/assets/Food/Breakfast/seafood-fried-noodle.webp';
import imgBreakfast5 from '@/assets/Food/Breakfast/pork-bone-soup.webp';
import imgBreakfast6 from '@/assets/Food/Breakfast/meatball-kuyteav.webp';

// Lunch & Dinner assets
import imgLunch1 from '@/assets/Food/Lunch and Dinner/compressed_ហហ្មុក.webp';
import imgLunch2 from '@/assets/Food/Lunch and Dinner/banana-blossom-chicken-salad.webp';
import imgLunch3 from '@/assets/Food/Lunch and Dinner/stir-fried-cockles-tamarind.webp';
import imgLunch4 from '@/assets/Food/Lunch and Dinner/britian-loklak.webp';
import imgLunch5 from '@/assets/Food/Lunch and Dinner/curry-lobster.webp';
import imgLunch6 from '@/assets/Food/Lunch and Dinner/samlor-korko-catfish.webp';

// Dessert assets
import imgDessert1 from '@/assets/Food/Dessert/five-signature-dessert.webp';

// Fallback high-res food images for visual variety
import imgDish2 from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.webp';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.webp';

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  desc: string;
  img: string;
  price: string;
  badge?: string;
};

const imageMapper: Record<string, string> = {
  '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.webp': imgHeroBg,
  '@/assets/Food/Breakfast/khmer-noodle-soup.webp': imgBreakfast1,
  '@/assets/Food/Breakfast/bean-sprout-fried-noodle.webp': imgBreakfast2,
  '@/assets/Food/Breakfast/beef-fried-noodle.webp': imgBreakfast3,
  '@/assets/Food/Breakfast/seafood-fried-noodle.webp': imgBreakfast4,
  '@/assets/Food/Breakfast/pork-bone-soup.webp': imgBreakfast5,
  '@/assets/Food/Breakfast/meatball-kuyteav.webp': imgBreakfast6,
  '@/assets/Food/Lunch and Dinner/fish-amok-coconut.webp': imgLunch1,
  '@/assets/Food/Lunch and Dinner/banana-blossom-chicken-salad.webp': imgLunch2,
  '@/assets/Food/Lunch and Dinner/stir-fried-cockles-tamarind.webp': imgLunch3,
  '@/assets/Food/Lunch and Dinner/britian-loklak.webp': imgLunch4,
  '@/assets/Food/Lunch and Dinner/curry-lobster.webp': imgLunch5,
  '@/assets/Food/Lunch and Dinner/samlor-korko-catfish.webp': imgLunch6,
  '@/assets/Food/Dessert/five-signature-dessert.webp': imgDessert1,
  '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.webp': imgDish2,
  '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.webp': imgDish3,
};

const MENU_LANGUAGE_TOGGLE_EVENT = 'omr:before-language-toggle';
const MENU_SCROLL_ANCHOR_SELECTOR = '[data-menu-scroll-anchor="true"]';
const MENU_SCROLL_TARGET_TOP = 180;

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Menu() {
  const { t, getObject, isKhmer, language } = useTranslation();
  const [menuDataState, setMenuDataState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isLotusVisible, setIsLotusVisible] = useState(false);
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingScrollRestoreRef = useRef<{ id: string; top: number } | null>(null);

  const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  const translatedCategoryNames: Record<MenuCategory, string> = {
    Breakfast: t('menu.categories.breakfast', undefined, 'Breakfast'),
    Lunch: t('menu.categories.lunch', undefined, 'Lunch'),
    Dinner: t('menu.categories.dinner', undefined, 'Dinner'),
    Dessert: t('menu.categories.dessert', undefined, 'Dessert'),
    Drinks: t('menu.categories.drinks', undefined, 'Drinks'),
  };
  const translatedMenuItems = getObject<Record<string, Array<Partial<MenuItem>>>>('menu.items', {});
  const translatedLiveItems = getObject<Record<string, string>>('menu.liveItems', {});
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
      const heroSection = document.getElementById('menu-hero');
      if (!heroSection) {
        setIsStickyVisible(false);
        return;
      }

      setIsStickyVisible(heroSection.getBoundingClientRect().bottom <= 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
    const captureCurrentMenuAnchor = () => {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>(MENU_SCROLL_ANCHOR_SELECTOR)
      );

      const visibleAnchors = anchors
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > MENU_SCROLL_TARGET_TOP && rect.top < window.innerHeight)
        .sort(
          (a, b) =>
            Math.abs(a.rect.top - MENU_SCROLL_TARGET_TOP) -
            Math.abs(b.rect.top - MENU_SCROLL_TARGET_TOP)
        );

      const anchor = visibleAnchors[0];
      if (!anchor?.element.id) return;

      pendingScrollRestoreRef.current = {
        id: anchor.element.id,
        top: anchor.rect.top,
      };
    };

    window.addEventListener(MENU_LANGUAGE_TOGGLE_EVENT, captureCurrentMenuAnchor);

    return () => {
      window.removeEventListener(MENU_LANGUAGE_TOGGLE_EVENT, captureCurrentMenuAnchor);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!pendingScrollRestoreRef.current) return undefined;

    const restoreScrollAnchor = () => {
      const pendingAnchor = pendingScrollRestoreRef.current;
      if (!pendingAnchor) return;

      const anchor = document.getElementById(pendingAnchor.id);
      if (!anchor) return;

      const nextTop = anchor.getBoundingClientRect().top;
      const delta = nextTop - pendingAnchor.top;
      if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }
    };

    restoreScrollAnchor();

    const animationFrame = window.requestAnimationFrame(restoreScrollAnchor);
    const timeout = window.setTimeout(() => {
      restoreScrollAnchor();
      pendingScrollRestoreRef.current = null;
    }, 180);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [isKhmer]);

  // Reveal sections and lotus background as they scroll into view
  useEffect(() => {
    if (loading || error || !menuDataState) return;

    const revealOnScroll = () => {
      const viewportBottom = window.innerHeight + 120; // generous buffer
      let anyVisible = false;

      categories.forEach((category) => {
        const id = category.toLowerCase();
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        // Reveal when the top of the section enters the viewport (+ buffer)
        if (rect.top < viewportBottom) {
          anyVisible = true;
          setRevealedSections((prev) => {
            if (prev[id]) return prev; // already revealed, skip re-render
            return { ...prev, [id]: true };
          });
        }
      });

      if (anyVisible) setIsLotusVisible(true);
    };

    // Run once immediately in case sections are already in view
    revealOnScroll();

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [loading, error, menuDataState]);

  const handleCategoryClick = (category: MenuCategory) => {
    const id = category.toLowerCase();
    setIsLotusVisible(true);
    // Immediately reveal the clicked section so it's never invisible
    setRevealedSections((prev) => ({ ...prev, [id]: true }));

    const element = document.getElementById(id);
    if (element) {
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
      <div className="bg-white flex flex-col items-center w-full min-h-screen">
        {/* Hero skeleton */}
        <div className="relative w-full h-[500px] md:h-[580px] flex flex-col items-center justify-center overflow-hidden bg-[#1a2318]">
          <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-[700px] px-6 pt-16">
            <Skeleton className="h-14 w-3/4 md:h-[70px] bg-white/10 rounded-xl" />
            <Skeleton className="h-5 w-1/2 bg-white/10 rounded-lg mt-2" />
            <Skeleton className="h-4 w-2/5 bg-white/10 rounded-lg" />
            {/* Category pill skeletons */}
            <div className="flex gap-3 mt-6 flex-wrap justify-center">
              {[120, 80, 90, 100, 80].map((w, i) => (
                <Skeleton key={i} className="h-10 rounded-full bg-white/10" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>

        {/* Dish card grid skeleton */}
        <div className="w-full max-w-[1440px] px-6 md:px-[64px] py-16">
          {/* Section heading skeleton */}
          <Skeleton className="h-10 w-48 mx-auto mb-14 rounded-xl" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                {/* Image placeholder */}
                <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                {/* Category label */}
                <Skeleton className="h-3 w-20 rounded-full" />
                {/* Dish name */}
                <Skeleton className="h-6 w-4/5 rounded-lg" />
                {/* Description lines */}
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
                {/* Price + button row */}
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
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

    acc[category] = itemsList.map((item: any, itemIndex: number) => {
      const localizedItem = translatedMenuItems[category.toLowerCase()]?.[itemIndex];
      const localizedLiveName = item.id != null ? translatedLiveItems[String(item.id)] : undefined;
      return {
        id: `${category.toLowerCase()}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: isKhmer
          ? (localizedLiveName || item.name_kh || item.name)
          : (localizedLiveName || localizedItem?.name || item.name),
        category: localizedItem?.category || translatedCategoryNames[category],
        desc: language === 'EN'
          ? (item.desc || '')
          : (localizedItem?.desc || item.desc || ''),
        badge: localizedItem?.badge || item.badge,
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
      <section id="menu-hero" className="relative w-full h-[420px] md:h-[480px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img
            alt={t('menu.hero.backgroundAlt', undefined, 'Menu Header Background')}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroBg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/65" />
        </div>

        <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-16 flex flex-col items-center">
          <h1 className="page-hero-title font-serif text-5xl md:text-6xl lg:text-[70px] leading-tight mb-4 tracking-wide drop-shadow-md">
            {t('menu.hero.title', undefined, hero.title)}
          </h1>

          <p className="text-white/80 text-base md:text-lg font-sans font-light max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            {t('menu.hero.subtitle', undefined, hero.subtitle)}
          </p>
        </div>
      </section>

      {/* Category Filter Bar Under Hero */}
      <div className="menu-filter-slot">
        <div className="menu-filter-bar">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`menu-filter-btn ${isActive ? 'active' : ''}`}
              >
                {translatedCategoryNames[category]}
              </button>
            );
          })}
        </div>
      </div>

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
              data-menu-scroll-anchor="true"
              className={`menu-section section-animate w-full py-16 first:pt-4 last:pb-16 border-b border-[#dde0dc]/50 last:border-b-0${
                revealedSections[category.toLowerCase()] ? ' section-visible' : ''
              }`}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-wide mb-10 md:mb-16 text-[#212d1b]">
                {translatedCategoryNames[category]}
              </h2>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 w-full text-left">
                {menuItemsData[category].map((dish, index) => (
                  <DishCard
                    key={dish.id}
                    id={`menu-dish-${dish.id}`}
                    data-menu-scroll-anchor="true"
                    className="menu-dish-card"
                    index={index}
                    name={dish.name}
                    category={dish.category}
                    description=""
                    image={dish.img}
                    price={dish.price}
                    badge={dish.badge}
                    showAction={false}
                    showCategory={false}
                    priceSuffix=""
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
