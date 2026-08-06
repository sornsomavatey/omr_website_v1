import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DishCard from '@/components/ui/dish-card';
import { DishCardSkeleton, Skeleton } from '@/components/ui/skeleton';
import { getMenuData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import { formatPrice } from '@/lib/price';
import { Search, X, TrendingUp } from 'lucide-react';

import './index.css';
import imgLotusHalf from '@/assets/menu/half-lotus-pattern.webp';

// Background assets
import imgHeroBg from '@/assets/home-v2/boeung-kak-exterior.webp';

// Breakfast assets
import imgBreakfast1 from '@/assets/Food/Breakfast/breakfast-khmer-noodle-soup-006.webp';
import imgBreakfast2 from '@/assets/Food/Breakfast/breakfast-bean-sprout-fried-noodle-001.webp';
import imgBreakfast3 from '@/assets/Food/Breakfast/breakfast-beef-fried-noodle-002.webp';
import imgBreakfast4 from '@/assets/Food/Breakfast/breakfast-seafood-fried-noodle-012.webp';
import imgBreakfast5 from '@/assets/Food/Breakfast/breakfast-pork-bone-soup-011.webp';
import imgBreakfast6 from '@/assets/Food/Breakfast/breakfast-meatball-kuyteav-008.webp';

// Lunch & Dinner assets
import imgLunch1 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-compressed-003.webp';
import imgLunch2 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-banana-blossom-chicken-salad-001.webp';
import imgLunch3 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-stir-fried-cockles-tamarind-049.webp';
import imgLunch4 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-britian-loklak-002.webp';
import imgLunch5 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-curry-lobster-004.webp';
import imgLunch6 from '@/assets/Food/Lunch and Dinner/lunch-and-dinner-samlor-korko-catfish-009.webp';

// Dessert assets
import imgDessert1 from '@/assets/Food/Dessert/dessert-five-signature-dessert-001.webp';

// Fallback high-res food images for visual variety
import imgDish2 from '@/assets/home-v2/signature-dish-two.webp';
import imgDish3 from '@/assets/home-v2/signature-dish-three.webp';

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

type MenuItem = {
  id: string;
  name: string;
  nameEn: string;
  nameKh?: string;
  category: string;
  categoryEn: string;
  desc: string;
  descEn: string;
  img: string;
  price: string;
  badge?: string;
};

const imageMapper: Record<string, string> = {
  '@/assets/home-v2/boeung-kak-exterior.webp': imgHeroBg,
  '@/assets/Food/Breakfast/breakfast-khmer-noodle-soup-006.webp': imgBreakfast1,
  '@/assets/Food/Breakfast/breakfast-bean-sprout-fried-noodle-001.webp': imgBreakfast2,
  '@/assets/Food/Breakfast/breakfast-beef-fried-noodle-002.webp': imgBreakfast3,
  '@/assets/Food/Breakfast/breakfast-seafood-fried-noodle-012.webp': imgBreakfast4,
  '@/assets/Food/Breakfast/breakfast-pork-bone-soup-011.webp': imgBreakfast5,
  '@/assets/Food/Breakfast/breakfast-meatball-kuyteav-008.webp': imgBreakfast6,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-fish-amok-coconut-005.webp': imgLunch1,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-banana-blossom-chicken-salad-001.webp': imgLunch2,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-stir-fried-cockles-tamarind-049.webp': imgLunch3,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-britian-loklak-002.webp': imgLunch4,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-curry-lobster-004.webp': imgLunch5,
  '@/assets/Food/Lunch and Dinner/lunch-and-dinner-samlor-korko-catfish-009.webp': imgLunch6,
  '@/assets/Food/Dessert/dessert-five-signature-dessert-001.webp': imgDessert1,
  '@/assets/home-v2/signature-dish-two.webp': imgDish2,
  '@/assets/home-v2/signature-dish-three.webp': imgDish3,
};

const MENU_LANGUAGE_TOGGLE_EVENT = 'omr:before-language-toggle';
const MENU_SCROLL_ANCHOR_SELECTOR = '[data-menu-scroll-anchor="true"]';
const MENU_SCROLL_TARGET_TOP = 180;

function useDragToScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    isMouseDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 80);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current || !ref.current) return;
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      isDragging.current = true;
      e.preventDefault();
      ref.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return {
    ref,
    isDragging,
    props: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
    },
  };
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Menu() {
  const { t, getObject, isKhmer, language } = useTranslation();
  const [menuDataState, setMenuDataState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast');

  const inlineDrag = useDragToScroll();
  const stickyDrag = useDragToScroll();

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [isSearchExpanded]);

  const handleOpenSearch = () => {
    setIsSearchExpanded(true);
    const heroSection = document.getElementById('menu-hero');
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
      if (window.scrollY < heroBottom - 100) {
        const targetElement = document.getElementById(activeCategory.toLowerCase());
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({
            top: heroBottom - 60,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const handleSelectDishResult = (dishId: string) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    setTimeout(() => {
      const el = document.getElementById(`menu-dish-${dishId}`) || document.getElementById(dishId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };



  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isLotusVisible, setIsLotusVisible] = useState(false);
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
    dessert: true,
    drinks: true,
  });
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
      .catch(() => {
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
    if (inlineDrag.isDragging.current || stickyDrag.isDragging.current) {
      return;
    }
    setIsSearchExpanded(false);
    setSearchQuery('');
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
      const englishName = item.name || localizedItem?.name || '';
      const englishDesc = item.desc || '';
      const khmerName = item.name_kh || '';

      return {
        id: `${category.toLowerCase()}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: isKhmer
          ? (localizedLiveName || item.name_kh || item.name)
          : (localizedLiveName || localizedItem?.name || item.name),
        nameEn: englishName,
        nameKh: khmerName,
        category: localizedItem?.category || translatedCategoryNames[category],
        categoryEn: category,
        desc: language === 'EN'
          ? (item.desc || '')
          : (localizedItem?.desc || item.desc || ''),
        descEn: englishDesc,
        badge: localizedItem?.badge || item.badge,
        img: item.img,
        price: item.price,
      };
    });
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  const matchesSearchQuery = (dish: MenuItem, query: string): boolean => {
    if (!query || !query.trim()) return true;
    const rawQuery = query.toLowerCase().trim();

    // Expand search terms (e.g. 'ice' <-> 'iced', 'noodle' <-> 'noodles', 'soup' <-> 'kuyteav')
    const queryTerms = new Set<string>([rawQuery]);
    if (rawQuery === 'ice') queryTerms.add('iced');
    if (rawQuery === 'iced') queryTerms.add('ice');
    if (rawQuery === 'noodle' || rawQuery === 'noodles' || rawQuery === 'មី' || rawQuery === 'មីឆា' || rawQuery === 'fried noodle') {
      queryTerms.add('noodle');
      queryTerms.add('noodles');
      queryTerms.add('មី');
      queryTerms.add('មីឆា');
      queryTerms.add('fried noodle');
    }
    if (rawQuery === 'kuyteav' || rawQuery === 'kuy teav' || rawQuery === 'kuyteavs') {
      queryTerms.add('soup');
      queryTerms.add('kuyteav');
      queryTerms.add('គុយទាវ');
      queryTerms.add('ស៊ុប');
    }
    if (rawQuery === 'soup' || rawQuery === 'soups' || rawQuery === 'ស៊ុប') {
      queryTerms.add('soup');
      queryTerms.add('kuyteav');
      queryTerms.add('ស៊ុប');
      queryTerms.add('គុយទាវ');
    }
    if (rawQuery === 'beef' || rawQuery === 'សាច់គោ') {
      queryTerms.add('beef');
      queryTerms.add('សាច់គោ');
    }

    const fieldsToSearch = [
      dish.name,
      dish.desc,
      dish.category,
      dish.nameEn,
      dish.descEn,
      dish.categoryEn,
      dish.nameKh || '',
    ].map((f) => f.toLowerCase());

    return Array.from(queryTerms).some((q) => {
      // For 'ice' or 'iced', use word-boundary matching so it matches iced beverages without matching 'rice', 'sliced', 'spiced', 'service', etc.
      if (q === 'ice' || q === 'iced') {
        const regex = new RegExp(`\\b${q}\\b`, 'i');
        return fieldsToSearch.some((field) => regex.test(field));
      }

      return fieldsToSearch.some((field) => field.includes(q));
    });
  };

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

      {/* Category Filter Bar Under Hero (Normal Flow) */}
      <div className="menu-filter-slot relative w-full">
        <div className="menu-filter-bar relative flex items-center justify-center min-h-[44px] max-w-5xl mx-auto w-full px-3 sm:px-4">
          {/* Category Pills & Search Container */}
          <div
            className={`flex items-center justify-center gap-2.5 w-full transition-all duration-400 cubic-bezier(0.16,1,0.3,1) transform ${
              isSearchExpanded || searchQuery
                ? '-translate-x-16 opacity-0 pointer-events-none'
                : 'translate-x-0 opacity-100 pointer-events-auto'
            }`}
          >
            {/* Scrollable / Centered Category Pills */}
            <div
              ref={inlineDrag.ref}
              {...inlineDrag.props}
              className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto scrollbar-none py-1 max-w-full cursor-grab active:cursor-grabbing select-none"
            >
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`menu-filter-btn shrink-0 ${isActive ? 'active' : ''}`}
                  >
                    {translatedCategoryNames[category]}
                  </button>
                );
              })}
            </div>

            {/* Circular Search Icon Button (42px height matching pills) */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] rounded-full border border-[#6b9158]/40 hover:border-[#6b9158] bg-white text-[#6b9158] hover:bg-[#6b9158]/10 flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
              aria-label={t('menu.search.placeholder', undefined, 'Search dishes')}
              title={isKhmer ? 'ស្វែងរក' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Category Filter Tabs (Normal Flow when scrolled) */}
      <div className={`menu-sticky-tabs-container ${isStickyVisible && !isSearchExpanded && !searchQuery ? 'menu-sticky-tabs-visible' : 'menu-sticky-tabs-hidden'}`}>
        <div className="menu-sticky-tabs-inner flex items-center justify-center max-w-5xl mx-auto w-full px-3 sm:px-4">
          <div
            ref={stickyDrag.ref}
            {...stickyDrag.props}
            className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto scrollbar-none py-1 max-w-full cursor-grab active:cursor-grabbing select-none"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`category-pill-btn shrink-0 ${
                    isActive ? 'category-pill-btn-active' : 'category-pill-btn-inactive'
                  }`}
                >
                  {translatedCategoryNames[category]}
                </button>
              );
            })}
          </div>

          {/* Circular Sticky Bar Search Button (42px height matching pills) */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] rounded-full border border-[#5b8045]/40 hover:border-[#5b8045] bg-white text-[#5b8045] hover:bg-[#5b8045]/10 flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 ml-1.5"
            aria-label={t('menu.search.placeholder', undefined, 'Search dishes')}
            title={isKhmer ? 'ស្វែងរក' : 'Search'}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dark Blur Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-[1.5px] z-[1000] transition-opacity duration-300 ease-out ${
          isSearchExpanded || searchQuery ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSearchExpanded(false)}
      />

      {/* Fixed Search Input Bar Prominently Centered at Top (z-[1003]) with Smooth Leftward Expansion */}
      <div
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-[1003] origin-right transition-all duration-400 cubic-bezier(0.16,1,0.3,1) transform ${
          isSearchExpanded || searchQuery
            ? 'opacity-100 scale-x-100 pointer-events-auto'
            : 'opacity-0 scale-x-0 pointer-events-none overflow-hidden'
        }`}
      >
        <div className="relative w-full flex items-center shadow-lg rounded-full bg-white">
          <Search className="w-4 h-4 absolute left-4 text-[#6b9158] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('menu.search.placeholder', undefined, isKhmer ? 'ស្វែងរកម្ហូប ឬគ្រឿងផ្សំ...' : 'Special Pho.....')}
            className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-full border-2 border-[#6b9158] bg-white text-xs sm:text-sm text-[#212d1b] placeholder:text-[#6b9158]/50 focus:outline-none focus:ring-2 focus:ring-[#6b9158]/20"
          />
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsSearchExpanded(false);
            }}
            className="absolute right-3.5 text-[#6b9158]/70 hover:text-[#6b9158] p-1 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Rounded White Card Panel with Green Border Centered at z-[1002] */}
      <div
        className={`fixed top-[74px] sm:top-[82px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white border-2 border-[#6b9158] rounded-[28px] shadow-2xl z-[1002] p-4 sm:p-6 flex flex-col items-center gap-4 min-h-[300px] max-h-[calc(100vh-110px)] overflow-y-auto transform transition-all duration-200 cubic-bezier(0.16,1,0.3,1) ${
          isSearchExpanded || searchQuery
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : '-translate-y-6 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Category Filter Pills - Only show when NOT actively searching */}
        {!searchQuery.trim() && (
          <div
            className={`menu-filter-bar flex items-center justify-center flex-wrap gap-2 transition-all duration-200 cubic-bezier(0.16,1,0.3,1) transform ${
              isSearchExpanded || searchQuery
                ? 'translate-y-0 opacity-100 scale-95'
                : '-translate-y-3 opacity-0 scale-75'
            }`}
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`menu-filter-btn !text-xs !py-1.5 !px-3.5 sm:!px-4 ${isActive ? 'active' : ''}`}
                >
                  {translatedCategoryNames[category]}
                </button>
              );
            })}
          </div>
        )}


            {/* Content / Matching Dishes inside Card Panel */}
            {(() => {
              const searchResults = searchQuery.trim() ? (() => {
                const allDishes = Object.values(menuItemsData).flat();
                const seenKeys = new Set<string>();
                const uniqueDishes: MenuItem[] = [];
                for (const dish of allDishes) {
                  const key = (dish.nameEn || dish.name || '').toLowerCase().trim();
                  if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    if (matchesSearchQuery(dish, searchQuery)) {
                      uniqueDishes.push(dish);
                    }
                  }
                }
                return uniqueDishes;
              })() : [];

              return searchQuery.trim() ? (
                <div className="w-full flex flex-col gap-3 pt-2">
                  <span className="text-xs font-semibold text-[#6b9158] uppercase tracking-wider text-left">
                    {isKhmer ? 'លទ្ធផលស្វែងរក' : 'Search Results'} ({searchResults.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {searchResults.map((dish) => (
                      <div
                        key={dish.id}
                        onClick={() => handleSelectDishResult(dish.id)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#6b9158]/40 hover:bg-[#f8faf7] transition-all cursor-pointer text-left"
                      >
                        <img
                          src={imageMapper[dish.img] || dish.img}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-semibold text-[#212d1b] truncate">{dish.name}</span>
                          <span className="text-xs text-[#6b9158] font-bold">
                            {formatPrice(dish.price, isKhmer)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {searchResults.length === 0 && (
                      <p className="text-sm text-gray-500 col-span-full py-6 text-center">
                        {isKhmer ? 'រកមិនឃើញម្ហូបទេ' : 'No dishes found matching your search.'}
                      </p>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
            {!searchQuery.trim() && (
              <div className="w-full flex flex-col gap-4 pt-2 text-left">
                {/* Popular Keywords Section */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 px-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                    <span>{isKhmer ? 'ការស្វែងរកពេញនិយម' : 'Popular Searches'}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    {[
                      { en: 'Pho', kh: 'ហ្វឺ' },
                      { en: 'Lok Lak', kh: 'ឡុកឡាក់' },
                      { en: 'Beef', kh: 'សាច់គោ' },
                      { en: 'Soup', kh: 'គុយទាវ' },
                      { en: 'Coffee', kh: 'កាហ្វេ' },
                      { en: 'Chicken', kh: 'សាច់មាន់' },
                    ].map((item) => {
                      const label = isKhmer ? item.kh : item.en;
                      return (
                        <button
                          key={item.en}
                          type="button"
                          onClick={() => setSearchQuery(label)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f3f7f0] hover:bg-[#6b9158] text-[#212d1b] hover:text-white border border-[#6b9158]/20 hover:border-transparent transition-all cursor-pointer shadow-2xs"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Dishes Quick Recommendations */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-[#6b9158] uppercase tracking-wider px-1">
                    {isKhmer ? 'ម្ហូបពេញនិយមប្រចាំហាង' : 'Popular Dishes'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    {Object.values(menuItemsData)
                      .flat()
                      .slice(0, 4)
                      .map((dish) => (
                        <div
                          key={dish.id}
                          onClick={() => handleSelectDishResult(dish.id)}
                          className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-[#6b9158]/40 hover:bg-[#f8faf7] transition-all cursor-pointer text-left group"
                        >
                          <img
                            src={imageMapper[dish.img] || dish.img}
                            alt={dish.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-semibold text-[#212d1b] truncate group-hover:text-[#6b9158]">
                              {dish.name}
                            </span>
                            <span className="text-[11px] text-[#6b9158] font-bold">
                              {formatPrice(dish.price, isKhmer)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
















      {/* Menu Grid Sections */}
      <section className="w-full pt-0 pb-16 md:py-16 bg-white flex flex-col items-center relative overflow-hidden">
        {/* Lotus Background Pattern */}
        <div className={`lotus-bg-wrapper ${isLotusVisible ? 'lotus-bg-visible' : ''}`}>
          <div className="lotus-bg-pattern" style={{ backgroundImage: `url("${imgLotusHalf}")` }} />
        </div>

        <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center relative z-10">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 md:gap-x-8 lg:gap-x-12 gap-y-12 w-full py-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <DishCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            categories.map((category) => {
              const categoryDishes = menuItemsData[category]
                .filter((dish) => matchesSearchQuery(dish, searchQuery))
                .sort((a, b) => {
                  const aOut = Boolean(a.badge && (a.badge.toLowerCase().includes('out of stock') || a.badge.toLowerCase().includes('sold out')));
                  const bOut = Boolean(b.badge && (b.badge.toLowerCase().includes('out of stock') || b.badge.toLowerCase().includes('sold out')));
                  return aOut === bOut ? 0 : aOut ? 1 : -1;
                });

              return (
                <div
                  key={category}
                  id={category.toLowerCase()}
                  data-menu-scroll-anchor="true"
                  className={`menu-section section-animate w-full py-16 first:pt-0 md:first:pt-4 last:pb-16 border-b border-[#dde0dc]/50 last:border-b-0${
                    revealedSections[category.toLowerCase()] ? ' section-visible' : ''
                  }`}
                >
                  <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-wide mb-10 md:mb-16 text-[#212d1b]">
                    {translatedCategoryNames[category]}
                  </h2>

                  {categoryDishes.length === 0 ? (
                    <div className="py-8 text-center text-[#646860] font-sans text-sm italic w-full">
                      {isKhmer
                        ? `មិនមានម្ហូបឈ្មោះ "${searchQuery}" ក្នុងប្រភេទនេះទេ`
                        : `No dishes matching "${searchQuery}" in ${translatedCategoryNames[category]}`}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 md:gap-x-8 lg:gap-x-12 gap-y-16 w-full text-left">
                      {categoryDishes.map((dish, index) => (
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
                          liftOnHover={false}
                          priceSuffix=""
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </section>
    </div>
  );
}
