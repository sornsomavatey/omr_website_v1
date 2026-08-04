import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, Search, TrendingUp, LayoutGrid, List } from 'lucide-react';
import { getMenuData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import './MenuModal.css';

// types 

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

export type PreOrderCartItem = {
  id: string;
  name: string;
  nameEn?: string;
  name_kh?: string;
  price: number;
  qty: number;
  img: string;
  category: string;
  desc?: string;
  descEn?: string;
  desc_kh?: string;
  badge?: string;
  isOutOfStock?: boolean;
};

export type PreOrderCart = Record<string, PreOrderCartItem>;

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: PreOrderCart;
  onCartChange: React.Dispatch<React.SetStateAction<PreOrderCart>>;
}

function parsePrice(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  const match = String(raw).replace(/[^0-9.]/g, '');
  return parseFloat(match) || 0;
}

const CATEGORIES: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

const matchesSearchQuery = (dish: PreOrderCartItem, query: string): boolean => {
  if (!query || !query.trim()) return true;
  const rawQuery = query.toLowerCase().trim();

  // Expand search terms (e.g. 'ice' <-> 'iced', 'noodle' <-> 'noodles', 'soup' <-> 'kuyteav', 'coffee' <-> 'กាហ្វេ')
  const queryTerms = new Set<string>([rawQuery]);
  if (rawQuery === 'ice') queryTerms.add('iced');
  if (rawQuery === 'iced') queryTerms.add('ice');
  if (rawQuery === 'noodle') queryTerms.add('noodles');
  if (rawQuery === 'noodles') queryTerms.add('noodle');
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
  if (rawQuery === 'coffee' || rawQuery === 'កាហ្វេ') {
    queryTerms.add('coffee');
    queryTerms.add('កាហ្វេ');
    queryTerms.add('cappuccino');
    queryTerms.add('americano');
    queryTerms.add('latte');
    queryTerms.add('espresso');
  }

  const fieldsToSearch = [
    dish.name,
    dish.desc || '',
    dish.category,
    dish.nameEn || '',
    dish.descEn || '',
    dish.name_kh || '',
    dish.desc_kh || '',
  ].map((f) => f.toLowerCase());

  return Array.from(queryTerms).some((q) => {
    if (q === 'ice' || q === 'iced') {
      const regex = new RegExp(`\\b${q}\\b`, 'i');
      return fieldsToSearch.some((field) => regex.test(field));
    }

    return fieldsToSearch.some((field) => field.includes(q));
  });
};

const BADGE_COLORS: Record<string, string> = {
  popular:  'mm-badge--popular',
  "chef's pick": 'mm-badge--chef',
  premium:  'mm-badge--premium',
  signature:'mm-badge--signature',
  new:      'mm-badge--new',
};

// ─── sub-components ───────

function DishGridCard({
  item,
  qty,
  onAdd,
  onRemove,
}: {
  item: { id: string; name: string; name_kh?: string; desc?: string; desc_kh?: string; img: string; price: number; badge?: string; category: string; isOutOfStock?: boolean };
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const badgeKey = item.badge?.toLowerCase() ?? '';
  const displayName = item.name;
  const displayDesc = item.desc;

  const isOutOfStock = Boolean(
    item.isOutOfStock || badgeKey.includes('out of stock') || badgeKey.includes('sold out')
  );

  return (
    <div className={`flex flex-col bg-white rounded-2xl border ${qty > 0 ? 'border-[#6b9158] bg-[#f8fbf6] ring-1 ring-[#6b9158]/30' : 'border-[#e2e8e0] hover:border-[#6b9158]/50'} transition-all shadow-xs overflow-hidden ${isOutOfStock ? 'opacity-70' : ''}`}>
      <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-gray-100">
        <img src={item.img} alt={displayName} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
        {isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-600 text-white tracking-wider shadow-xs">
            {t('menu.modal.outOfStock', undefined, 'Out of Stock')}
          </span>
        )}
        {qty > 0 && (
          <div className="absolute top-2.5 right-2.5 w-6.5 h-6.5 rounded-full bg-[#6b9158] text-white text-xs font-bold flex items-center justify-center shadow-md">
            {qty}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2 text-left">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b9158] block mb-0.5">
            {item.category}
          </span>
          <h4 className="font-serif text-sm sm:text-base text-[#212d1b] font-medium leading-snug line-clamp-1">
            {displayName}
          </h4>
          {displayDesc && (
            <p className="text-[10px] sm:text-[11px] text-[#737970] line-clamp-2 mt-0.5 leading-snug font-normal">
              {displayDesc}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0f3ef] mt-auto">
          <span className="text-xs sm:text-sm font-bold text-[#212d1b]">
            ${item.price.toFixed(2)}
          </span>

          <div className="mm-dish-ctrl !mt-0">
            {isOutOfStock ? (
              <button
                type="button"
                className="mm-add-btn mm-add-btn--disabled cursor-not-allowed opacity-50 bg-gray-300 text-gray-500 border-gray-300 hover:bg-gray-300 !text-[11px] !py-1 !px-2"
                disabled
              >
                {t('menu.modal.outOfStock', undefined, 'Out of Stock')}
              </button>
            ) : qty === 0 ? (
              <button type="button" className="mm-add-btn !text-xs !py-1 !px-2.5" onClick={onAdd}>
                <Plus className="w-3.5 h-3.5" />
                {t('menu.modal.add')}
              </button>
            ) : (
              <div className="mm-qty-ctrl">
                <button type="button" onClick={onRemove} aria-label={t('menu.modal.removeOne')}>
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs">{qty}</span>
                <button type="button" onClick={onAdd} aria-label={t('menu.modal.addOne')}>
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DishRow({
  item,
  qty,
  onAdd,
  onRemove,
}: {
  item: { id: string; name: string; name_kh?: string; desc?: string; desc_kh?: string; img: string; price: number; badge?: string; category: string; isOutOfStock?: boolean };
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  const badgeKey = item.badge?.toLowerCase() ?? '';
  const displayName = item.name;
  const displayDesc = item.desc;

  const isOutOfStock = Boolean(
    item.isOutOfStock || badgeKey.includes('out of stock') || badgeKey.includes('sold out')
  );

  return (
    <div className={`mm-dish-row ${qty > 0 ? 'mm-dish-row--selected' : ''} ${isOutOfStock ? 'mm-dish-row--out-of-stock opacity-70' : ''}`}>
      <div className="mm-dish-img-wrap">
        <img src={item.img} alt={displayName} className="mm-dish-img" loading="lazy" />
        {isOutOfStock && <span className="mm-badge mm-badge--out-of-stock bg-red-600 text-white font-bold">{t('menu.modal.outOfStock', undefined, 'Out of Stock')}</span>}
        {qty > 0 && <div className="mm-dish-qty-bubble">{qty}</div>}
      </div>

      <div className="mm-dish-info">
        <p className="mm-dish-cat">{item.category}</p>
        <h4 className="mm-dish-name">{displayName}</h4>
        {displayDesc && <p className="mm-dish-desc">{displayDesc}</p>}
        <span className="mm-dish-price">${item.price.toFixed(2)}</span>
      </div>

      <div className="mm-dish-ctrl">
        {isOutOfStock ? (
          <button
            type="button"
            className="mm-add-btn mm-add-btn--disabled cursor-not-allowed opacity-50 bg-gray-300 text-gray-500 border-gray-300 hover:bg-gray-300"
            disabled
            aria-label={`${displayName} is Out of Stock`}
          >
            {t('menu.modal.outOfStock', undefined, 'Out of Stock')}
          </button>
        ) : qty === 0 ? (
          <button type="button" className="mm-add-btn" onClick={onAdd} aria-label={`Add ${displayName}`}>
            <Plus className="w-4 h-4" />
            {t('menu.modal.add')}
          </button>
        ) : (
          <div className="mm-qty-ctrl">
            <button type="button" onClick={onRemove} aria-label={t('menu.modal.removeOne')}>
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span>{qty}</span>
            <button type="button" onClick={onAdd} aria-label={t('menu.modal.addOne')}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

//main modal
export default function MenuModal({ isOpen, onClose, cart, onCartChange }: MenuModalProps) {
  const { t, getObject, isKhmer, language } = useTranslation();
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const bodyRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = () => {
    if (isSearchExpanded) {
      setIsSearchExpanded(false);
      setSearchQuery('');
    } else {
      setIsSearchExpanded(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  const handleCategoryClick = (cat: MenuCategory) => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    setActiveCategory(cat);
    if (bodyRef.current) {
      bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const translatedCategoryNames: Record<MenuCategory, string> = {
    Breakfast: t('menu.categories.breakfast', undefined, 'Breakfast'),
    Lunch: t('menu.categories.lunch', undefined, 'Lunch'),
    Dinner: t('menu.categories.dinner', undefined, 'Dinner'),
    Dessert: t('menu.categories.dessert', undefined, 'Dessert'),
    Drinks: t('menu.categories.drinks', undefined, 'Drinks'),
  };
  const translatedLiveItems = getObject<Record<string, string>>('liveItems', {});
  const translatedMenuItems = getObject<Record<string, Array<Partial<PreOrderCartItem>>>>('menu.items', {});

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Fetch menu data once
  useEffect(() => {
    if (menuData) return;
    getMenuData()
      .then((res) => { setMenuData(res); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);


  const handleQty = useCallback((item: PreOrderCartItem, delta: number) => {
    const current = cart[item.id]?.qty ?? 0;
    if (delta === -1 && current === 1) {
      const confirmDelete = window.confirm(
        t('menu.modal.removeConfirm', { name: item.name })
      );
      if (!confirmDelete) return;
    }
    onCartChange((prev: PreOrderCart) => {
      const currentQty = prev[item.id]?.qty ?? 0;
      const next = Math.max(0, currentQty + delta);
      if (next === 0) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: { ...item, qty: next } };
    });
  }, [onCartChange, cart, t]);

  const totalItems = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const totalPrice = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

  // ── build items list ───

  const getItems = (): PreOrderCartItem[] => {
    if (!menuData?.items) return [];

    let itemsList: any[] = [];
    if (searchQuery.trim()) {
      // Search across ALL categories when query is present
      Object.keys(menuData.items).forEach((cat) => {
        const raw = menuData.items[cat] ?? [];
        raw.forEach((d: any, itemIndex: number) => {
          itemsList.push({ ...d, rawCategory: cat, itemIndex });
        });
      });
    } else {
      const raw = menuData.items[activeCategory] ?? [];
      itemsList = raw.map((d: any, itemIndex: number) => ({ ...d, rawCategory: activeCategory, itemIndex }));
    }

    const items: PreOrderCartItem[] = itemsList.map((d: any) => {
      const catKey = (d.rawCategory || activeCategory).toLowerCase();
      const isLiveProduct = d.id != null && String(d.id).length > 0;
      const localizedLiveName = isLiveProduct ? translatedLiveItems[String(d.id)] : undefined;
      const localizedMock = !isLiveProduct ? translatedMenuItems[catKey]?.[d.itemIndex] : undefined;

      const isOut = Boolean(
        d.is_out_of_stock === '1' ||
        d.is_out_of_stock === 1 ||
        d.is_out_of_stock === true ||
        (d.menu_out_of_stock && d.menu_out_of_stock.length > 0) ||
        (d.badge && (d.badge.toLowerCase().includes('out of stock') || d.badge.toLowerCase().includes('sold out')))
      );
      const categoryName = translatedCategoryNames[d.rawCategory as MenuCategory] || d.category || d.rawCategory;

      const displayName = isKhmer
        ? (localizedLiveName || d.name_kh || localizedMock?.name || d.name)
        : (localizedLiveName || localizedMock?.name || d.name);

      const displayDesc = language === 'EN'
        ? (d.desc || localizedMock?.desc || '')
        : (localizedMock?.desc || d.desc_kh || d.desc || '');

      return {
        id: String(d.id),
        name: displayName,
        nameEn: d.name || localizedMock?.name || displayName,
        name_kh: d.name_kh || '',
        price: parsePrice(d.price),
        qty: 0,
        img: d.img,
        category: categoryName,
        desc: displayDesc,
        descEn: d.desc || localizedMock?.desc || '',
        desc_kh: d.desc_kh || '',
        badge: isOut ? 'Out of Stock' : undefined,
        isOutOfStock: isOut,
      };
    });

    const filtered = items.filter((dish) => matchesSearchQuery(dish, searchQuery));

    return filtered.sort((a: PreOrderCartItem, b: PreOrderCartItem) => (a.isOutOfStock === b.isOutOfStock ? 0 : a.isOutOfStock ? 1 : -1));
  };

  if (!isOpen) return null;

  return (
    <div className="mm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mm-panel" role="dialog" aria-modal="true" aria-label={t('menu.modal.title')}>

        {/* ── Header ── */}
        <div className="mm-header">
          <div>
            <h2 className="mm-header-title">{t('menu.modal.title')}</h2>
            <p className="mm-header-sub">{t('menu.modal.subtitle')}</p>
          </div>
          <button type="button" className="mm-close-btn" onClick={onClose} aria-label={t('menu.modal.close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Category tabs, Search Button & View Toggle ── */}
        <div className="mm-tabs-wrapper">
          <div className="mm-tabs-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`mm-tab ${activeCategory === cat && !searchQuery.trim() ? 'mm-tab--active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {translatedCategoryNames[cat]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            {/* Small Circular Search Icon Button (like menu page) */}
            <button
              type="button"
              onClick={handleToggleSearch}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                isSearchExpanded || searchQuery
                  ? 'bg-[#5b8045] text-white border-[#5b8045] shadow-xs'
                  : 'bg-white text-[#6b9158] border-[#6b9158]/40 hover:border-[#6b9158] hover:bg-[#6b9158]/10'
              }`}
              title={isKhmer ? 'ស្វែងរក' : 'Search'}
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* View Toggle Buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#f0f4ee] rounded-full border border-[#6b9158]/20 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#5b8045] text-white shadow-xs'
                    : 'text-[#444841] hover:text-[#212d1b] hover:bg-[#e0edd8]/50'
                }`}
                title={isKhmer ? 'ទិដ្ឋភាពបញ្ជី' : 'List View'}
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#5b8045] text-white shadow-xs'
                    : 'text-[#444841] hover:text-[#212d1b] hover:bg-[#e0edd8]/50'
                }`}
                title={isKhmer ? 'ទិដ្ឋភាពក្រឡា' : 'Grid View'}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Expandable Search Bar & Popular Pills ── */}
        {(isSearchExpanded || searchQuery) && (
          <div className="px-6 sm:px-7 pt-3.5 pb-2.5 flex flex-col gap-2.5 border-b border-[#f0f2f0] flex-shrink-0 bg-[#fafcf9] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative w-full flex items-center shadow-xs rounded-full bg-white border border-[#6b9158]/40 focus-within:border-[#6b9158] focus-within:ring-2 focus-within:ring-[#6b9158]/20 transition-all">
              <Search className="w-4 h-4 absolute left-3.5 text-[#6b9158] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKhmer ? 'ស្វែងរកម្ហូប ឬគ្រឿងផ្សំ...' : 'Search dishes or ingredients...'}
                className="w-full pl-10 pr-9 py-2 rounded-full text-xs sm:text-sm text-[#212d1b] placeholder:text-[#6b9158]/50 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchExpanded(false);
                }}
                className="absolute right-3 text-[#6b9158]/70 hover:text-[#6b9158] p-0.5 cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Popular Keywords Pills */}
            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
              <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 mr-1">
                <TrendingUp className="w-3 h-3 text-gray-400" />
                <span>{isKhmer ? 'ពេញនិយម:' : 'Popular:'}</span>
              </div>
              {[
                { en: 'Pho', kh: 'ហ្វឺ' },
                { en: 'Lok Lak', kh: 'ឡុកឡាក់' },
                { en: 'Fried Noodle', kh: 'មីឆា' },
                { en: 'Soup', kh: 'គុយទាវ' },
                { en: 'Coffee', kh: 'កាហ្វេ' },
                { en: 'Chicken', kh: 'សាច់មាន់' },
              ].map((item) => {
                const label = isKhmer ? item.kh : item.en;
                const isSelected = searchQuery.toLowerCase() === label.toLowerCase();
                return (
                  <button
                    key={item.en}
                    type="button"
                    onClick={() => setSearchQuery(isSelected ? '' : label)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5b8045] text-white border border-[#5b8045]'
                        : 'bg-white hover:bg-[#e0edd8] text-[#212d1b] border border-[#6b9158]/20'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Dish list / grid ── */}
        <div ref={bodyRef} className="mm-body">
          {loading ? (
            <div className="mm-loading">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mm-skeleton-row">
                  <div className="mm-skeleton-img" />
                  <div className="mm-skeleton-lines">
                    <div className="mm-skeleton-line mm-skeleton-line--sm" />
                    <div className="mm-skeleton-line" />
                    <div className="mm-skeleton-line mm-skeleton-line--md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {getItems().length === 0 ? (
                <p className="mm-empty">
                  {searchQuery.trim()
                    ? (isKhmer ? 'រកមិនឃើញម្ហូបទេ' : 'No dishes found matching your search.')
                    : t('menu.modal.empty')}
                </p>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
                  {getItems().map((item) => (
                    <DishGridCard
                      key={item.id}
                      item={item}
                      qty={cart[item.id]?.qty ?? 0}
                      onAdd={() => handleQty(item, 1)}
                      onRemove={() => handleQty(item, -1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mm-dish-list">
                  {getItems().map((item) => (
                    <DishRow
                      key={item.id}
                      item={item}
                      qty={cart[item.id]?.qty ?? 0}
                      onAdd={() => handleQty(item, 1)}
                      onRemove={() => handleQty(item, -1)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer cart summary ── */}
        <div className={`mm-footer ${totalItems > 0 ? 'mm-footer--visible' : 'mm-footer--hidden'}`}>
          {totalItems > 0 && (
            <>
              <div className="mm-footer-left">
                <div className="mm-cart-icon-wrap">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="mm-cart-badge">{totalItems}</span>
                </div>
                <div>
                  <p className="mm-cart-label">{t('menu.modal.summary')}</p>
                  <p className="mm-cart-items">
                    {t('menu.modal.preOrder')}
                  </p>
                </div>
              </div>
              <div className="mm-footer-right">
                <span className="mm-cart-total">${totalPrice.toFixed(2)}</span>
                <button
                  type="button"
                  className="mm-clear-btn"
                  onClick={() => {
                    const confirmClear = window.confirm(
                      t('menu.modal.clearConfirm')
                    );
                    if (confirmClear) {
                      onCartChange({});
                    }
                  }}
                  aria-label={t('menu.modal.clear')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button type="button" className="mm-confirm-btn" onClick={onClose}>
                  {t('menu.modal.confirm')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
