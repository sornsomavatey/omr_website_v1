import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { getMenuData } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import './MenuModal.css';

// types 

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

export type PreOrderCartItem = {
  id: string;
  name: string;
  name_kh?: string;
  price: number;
  qty: number;
  img: string;
  category: string;
  desc?: string;
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

const BADGE_COLORS: Record<string, string> = {
  popular:  'mm-badge--popular',
  "chef's pick": 'mm-badge--chef',
  premium:  'mm-badge--premium',
  signature:'mm-badge--signature',
  new:      'mm-badge--new',
};

// ─── sub-components ───────

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

  const translatedCategoryNames: Record<MenuCategory, string> = {
    Breakfast: t('menu.categories.breakfast', undefined, 'Breakfast'),
    Lunch: t('menu.categories.lunch', undefined, 'Lunch'),
    Dinner: t('menu.categories.dinner', undefined, 'Dinner'),
    Dessert: t('menu.categories.dessert', undefined, 'Dessert'),
    Drinks: t('menu.categories.drinks', undefined, 'Drinks'),
  };
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
    const raw = menuData.items[activeCategory] ?? [];
    const items = raw.map((d: any, itemIndex: number) => {
      const localized = translatedMenuItems[activeCategory.toLowerCase()]?.[itemIndex];
      const isOut = Boolean(
        d.is_out_of_stock === '1' ||
        d.is_out_of_stock === 1 ||
        d.is_out_of_stock === true ||
        (d.menu_out_of_stock && d.menu_out_of_stock.length > 0) ||
        (d.badge && (d.badge.toLowerCase().includes('out of stock') || d.badge.toLowerCase().includes('sold out')))
      );
      return {
        id: String(d.id),
        name: isKhmer ? (d.name_kh || localized?.name || d.name) : (localized?.name || d.name),
        name_kh: d.name_kh,
        price: parsePrice(d.price),
        qty: 0,
        img: d.img,
        category: translatedCategoryNames[activeCategory],
        desc: language === 'EN' ? (d.desc ?? '') : (localized?.desc || d.desc_kh || d.desc || ''),
        desc_kh: d.desc_kh ?? '',
        badge: isOut ? 'Out of Stock' : undefined,
        isOutOfStock: isOut,
      };
    });

    return items.sort((a: PreOrderCartItem, b: PreOrderCartItem) => (a.isOutOfStock === b.isOutOfStock ? 0 : a.isOutOfStock ? 1 : -1));
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

        {/* ── Category tabs ── */}
        <div className="mm-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`mm-tab ${activeCategory === cat ? 'mm-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {translatedCategoryNames[cat]}
            </button>
          ))}
        </div>

        {/* ── Dish list ── */}
        <div className="mm-body">
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
            <div className="mm-dish-list">
              {getItems().length === 0 ? (
                <p className="mm-empty">{t('menu.modal.empty')}</p>
              ) : (
                getItems().map((item) => (
                  <DishRow
                    key={item.id}
                    item={item}
                    qty={cart[item.id]?.qty ?? 0}
                    onAdd={() => handleQty(item, 1)}
                    onRemove={() => handleQty(item, -1)}
                  />
                ))
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
