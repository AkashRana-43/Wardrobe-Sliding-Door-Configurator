import React, { useCallback, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useCart } from '@/state/useCartAuth';
import { useAuth } from '@/state/useCartAuth';
import type { CartItem } from '@/state/cartTypes';
import type { PriceBreakdown } from '@/domain/models/slidingDoorConfig';
import styles from './CartPanel.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(timestamp));
}

function formatWardrobeType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function scalePrice(breakdown: PriceBreakdown, quantity: number): number {
  return breakdown.total * quantity;
}

// ─── CartItemCard ─────────────────────────────────────────────────────────────

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartItemCard = React.memo(function CartItemCard({
  item,
  onRemove,
  onQuantityChange,
}: CartItemCardProps) {
  const { wardrobeSnapshot, priceBreakdown, addedAt, id, quantity } = item;
  const { wardrobeDimensions, wardrobeTypeId, wardrobeDoorCount, wardrobeDoorMelamineColourId } = wardrobeSnapshot;

  const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) onQuantityChange(id, quantity - 1);
  }, [id, quantity, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    onQuantityChange(id, quantity + 1);
  }, [id, quantity, onQuantityChange]);

  return (
    <article className={styles.cartItem} aria-label="Cart item">
      <div className={styles.cartItemHeader}>
        <span className={styles.cartItemType}>
          {wardrobeTypeId ? formatWardrobeType(wardrobeTypeId) : 'Wardrobe'}
        </span>
        <span className={styles.cartItemDate}>{formatDate(addedAt)}</span>
      </div>

      <div className={styles.cartItemMeta}>
        <div className={styles.cartItemMetaRow}>
          <span className={styles.cartItemMetaLabel}>Width</span>
          <span className={styles.cartItemMetaValue}>
            {wardrobeDimensions ? `${wardrobeDimensions.widthMm}mm` : '—'}
          </span>
        </div>
        <div className={styles.cartItemMetaRow}>
          <span className={styles.cartItemMetaLabel}>Height</span>
          <span className={styles.cartItemMetaValue}>
            {wardrobeDimensions ? `${wardrobeDimensions.heightMm}mm` : '—'}
          </span>
        </div>
        <div className={styles.cartItemMetaRow}>
          <span className={styles.cartItemMetaLabel}>Doors</span>
          <span className={styles.cartItemMetaValue}>
            {wardrobeDoorCount ?? '—'}
          </span>
        </div>
        <div className={styles.cartItemMetaRow}>
          <span className={styles.cartItemMetaLabel}>Colour</span>
          <span className={styles.cartItemMetaValue}>
            {wardrobeDoorMelamineColourId ?? '—'}
          </span>
        </div>
      </div>

      <div className={styles.cartItemFooter}>
        {/* Quantity control */}
        <div className={styles.quantityControl}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.quantityValue} aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <span className={styles.cartItemPrice}>
          {formatPrice(scalePrice(priceBreakdown, quantity))}
        </span>

        <button
          type="button"
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`Remove ${wardrobeTypeId ? formatWardrobeType(wardrobeTypeId) : 'item'} from cart`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Remove
        </button>
      </div>
    </article>
  );
});

// ─── CartPanel ────────────────────────────────────────────────────────────────

function CartPanel() {
  const { cartState, closeCart, removeFromCart, updateQuantity } = useCart();
  const { authState } = useAuth();
  const { items, isOpen } = cartState;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Quantity change — dispatch update action
  // Wire this to your cartReducer UPDATE_QUANTITY action when ready
  const handleQuantityChange = useCallback((id: string, quantity: number) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const total = items.reduce(
    (sum, item) => sum + item.priceBreakdown.total * (item.quantity ?? 1),
    0
  );

  const handleCheckout = useCallback(() => {
    alert('Proceeding to checkout…');
  }, []);

  const handleQuote = useCallback(() => {
    alert('Requesting a quote…');
  }, []);

  return (
    <>
      {/* Scrim */}
      <div
        className={`${styles.overlay}${isOpen ? ` ${styles.overlayVisible}` : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel — slides from RIGHT */}
      <aside
        className={`${styles.panel}${isOpen ? ` ${styles.panelOpen}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.title}>Your Cart</span>
            {items.length > 0 && (
              <span className={styles.itemCount}>
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg
                className={styles.emptyIcon}
                width="48" height="48" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptySubtitle}>Configure a wardrobe to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onQuantityChange={handleQuantityChange}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>{formatPrice(total)}</span>
            </div>
            <div className={styles.footerActions}>
              {authState.isLoggedIn ? (
                <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
                  Checkout
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" fullWidth onClick={handleQuote}>
                    Ask a Quote
                  </Button>
                  <Button variant="ghost" size="md" fullWidth onClick={closeCart}>
                    Continue Configuring
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartPanel;