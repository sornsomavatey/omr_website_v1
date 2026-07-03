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

// ─── sub-components ──────────────────────────────────────────────────────────

function DishRow({
  item,
  qty,
  onAdd,
  onRemove,
  isKhmer,
}: {
  item: { id: string; name: string; name_kh?: string; desc: string; desc_kh?: string; img: string; price: number; badge?: string; category: string };
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  isKhmer: boolean;
}) {
  const badgeKey = item.badge?.toLowerCase() ?? '';
  const badgeClass = BADGE_COLORS[badgeKey] ?? 'mm-badge--popular';
  const displayName = isKhmer ? (item.name_kh || item.name) : item.name;
  const displayDesc = isKhmer ? (item.desc_kh || item.desc) : item.desc;

  return (
    <div className={`mm-dish-row ${qty > 0 ? 'mm-dish-row--selected' : ''}`}>
      <div className="mm-dish-img-wrap">
        <img src={item.img} alt={displayName} className="mm-dish-img" loading="lazy" />
        {item.badge && <span className={`mm-badge ${badgeClass}`}>{item.badge}</span>}
        {qty > 0 && <div className="mm-dish-qty-bubble">{qty}</div>}
      </div>

      <div className="mm-dish-info">
        <p className="mm-dish-cat">{item.category}</p>
        <h4 className="mm-dish-name">{displayName}</h4>
        {displayDesc && <p className="mm-dish-desc">{displayDesc}</p>}
        <span className="mm-dish-price">${item.price.toFixed(2)}</span>
      </div>

      <div className="mm-dish-ctrl">
        {qty === 0 ? (
          <button type="button" className="mm-add-btn" onClick={onAdd} aria-label={`Add ${displayName}`}>
            <Plus className="w-4 h-4" />
            {isKhmer ? 'បន្ថែម' : 'Add'}
          </button>
        ) : (
          <div className="mm-qty-ctrl">
            <button type="button" onClick={onRemove} aria-label="Remove one">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span>{qty}</span>
            <button type="button" onClick={onAdd} aria-label="Add one more">
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
  const { t, isKhmer } = useTranslation();
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

  // ── cart helpers ──────────────────────────────────────────────────────────

  const handleQty = useCallback((item: PreOrderCartItem, delta: number) => {
    onCartChange((prev: PreOrderCart) => {
      const current = prev[item.id]?.qty ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: { ...item, qty: next } };
    });
  }, [onCartChange]);

  const totalItems = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const totalPrice = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

  // ── build items list ──────────────────────────────────────────────────────

  const getItems = (): PreOrderCartItem[] => {
    if (!menuData?.items) return [];
    const raw = menuData.items[activeCategory] ?? [];
    return raw.map((d: any) => ({
      id: String(d.id),
      name: d.name,
      name_kh: d.name_kh,
      price: parsePrice(d.price),
      qty: 0,
      img: d.img,
      category: translatedCategoryNames[activeCategory],
      desc: d.desc ?? '',
      desc_kh: d.desc_kh ?? '',
      badge: d.badge,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="mm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mm-panel" role="dialog" aria-modal="true" aria-label={isKhmer ? 'ជ្រើសរើសមុខម្ហូប' : 'Browse Menu'}>

        {/* ── Header ── */}
        <div className="mm-header">
          <div>
            <h2 className="mm-header-title">{isKhmer ? 'ជ្រើសរើសមុខម្ហូប' : 'Browse Menu'}</h2>
            <p className="mm-header-sub">{isKhmer ? 'បន្ថែមមុខម្ហូបទៅក្នុងការកុម្ម៉ង់មុនរបស់អ្នក' : 'Add dishes to your pre-order'}</p>
          </div>
          <button type="button" className="mm-close-btn" onClick={onClose} aria-label="Close menu">
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
                <p className="mm-empty">{isKhmer ? 'មិនទាន់មានមុខម្ហូបក្នុងប្រភេទនេះនៅឡើយទេ។' : 'No items available in this category yet.'}</p>
              ) : (
                getItems().map((item) => (
                  <DishRow
                    key={item.id}
                    item={item}
                    qty={cart[item.id]?.qty ?? 0}
                    onAdd={() => handleQty(item, 1)}
                    onRemove={() => handleQty(item, -1)}
                    isKhmer={isKhmer}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Footer cart summary ── */}
        <div className={`mm-footer ${totalItems > 0 ? 'mm-footer--visible' : ''}`}>
          {totalItems > 0 && (
            <>
              <div className="mm-footer-left">
                <div className="mm-cart-icon-wrap">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="mm-cart-badge">{totalItems}</span>
                </div>
                <div>
                  <p className="mm-cart-label">{isKhmer ? 'សេចក្តីសង្ខេបនៃការកុម្ម៉ង់មុន' : 'Pre-order Summary'}</p>
                  <p className="mm-cart-items">
                    {Object.values(cart)
                      .map((i) => `${isKhmer ? (i.name_kh || i.name) : i.name} ×${i.qty}`)
                      .join(' · ')}
                  </p>
                </div>
              </div>
              <div className="mm-footer-right">
                <span className="mm-cart-total">${totalPrice.toFixed(2)}</span>
                <button
                  type="button"
                  className="mm-clear-btn"
                  onClick={() => onCartChange({})}
                  aria-label="Clear pre-order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button type="button" className="mm-confirm-btn" onClick={onClose}>
                  {isKhmer ? 'យល់ព្រម' : 'Confirm'}
                </button>
              </div>
            </>
          )}
          {totalItems === 0 && (
            <button type="button" className="mm-confirm-btn mm-confirm-btn--full" onClick={onClose}>
              {isKhmer ? 'បិទ' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
