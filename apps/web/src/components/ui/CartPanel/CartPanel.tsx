import React, { useCallback, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCart, useAuth } from '@/state/useCartAuth';
import type { CartItem } from '@/state/cartTypes';
import type { PriceBreakdown } from '@/domain/models/slidingDoorConfig';
import styles from './CartPanel.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(dollars: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(timestamp));
}

function formatWardrobeType(type: string): string {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function scalePrice(breakdown: PriceBreakdown, quantity: number): number {
  return breakdown.total * quantity;
}

// ─── CartItemAccordion ────────────────────────────────────────────────────────

interface CartItemAccordionProps {
  item: CartItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onEdit: (id: string) => void;
}

const CartItemAccordion = React.memo(function CartItemAccordion({
  item,
  isExpanded,
  onToggle,
  onRemove,
  onQuantityChange,
  onEdit,
}: CartItemAccordionProps) {
  const { wardrobeSnapshot, priceBreakdown, addedAt, id, quantity, reference } = item;
  const {
    wardrobeDimensions,
    wardrobeTypeId,
    wardrobeDoorCount,
    wardrobeDoorMelamineColourId,
    wardrobeStilesAndTracksId,
    wardrobeDoorConfigurations,
    wardrobeSelectedExtras,
    wardrobeTrackLengthMm,
  } = wardrobeSnapshot;

  const handleDecrement = useCallback(() => {
    if (quantity > 1) onQuantityChange(id, quantity - 1);
  }, [id, quantity, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    onQuantityChange(id, quantity + 1);
  }, [id, quantity, onQuantityChange]);

  const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);

  const typeLabel = wardrobeTypeId ? formatWardrobeType(wardrobeTypeId) : 'Wardrobe';
  const dimLabel = wardrobeDimensions
    ? `${wardrobeDimensions.widthMm} × ${wardrobeDimensions.heightMm}mm`
    : null;

  const configRows: { label: string; value: string }[] = [];

  if (wardrobeDimensions) {
    configRows.push({ label: 'Width', value: `${wardrobeDimensions.widthMm}mm` });
    configRows.push({ label: 'Height', value: `${wardrobeDimensions.heightMm}mm` });
  }
  if (wardrobeDoorCount) {
    configRows.push({ label: 'Doors', value: `${wardrobeDoorCount}` });
  }

  // Only show Door Colour if not all doors have inserts
  const allDoorsHaveInsert =
    wardrobeDoorConfigurations.length > 0 &&
    wardrobeDoorConfigurations.every((d) => d.insertId !== null);

  if (wardrobeDoorMelamineColourId && !allDoorsHaveInsert) {
    configRows.push({
      label: 'Door Colour',
      value: wardrobeDoorMelamineColourId
        .replace(/^colour-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    });
  }

  wardrobeDoorConfigurations.forEach((door) => {
    if (door.insertId) {
      configRows.push({
        label: `Door ${door.doorIndex + 1}`,
        value: door.insertId
          .replace('insert-', '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      });
    }
  });

  if (wardrobeStilesAndTracksId) {
    const stilesName = wardrobeStilesAndTracksId
      .replace('stiles-tracks-', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    configRows.push({
      label: 'Stiles',
      value: stilesName || wardrobeStilesAndTracksId,
    });
  }

  Object.entries(wardrobeSelectedExtras).forEach(([extraId, qty]) => {
    if (qty <= 0) return;
    const label = extraId
      .replace('extra-', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    if (extraId === 'extra-top-track') {
      const mm = wardrobeTrackLengthMm?.top;
      configRows.push({ label, value: mm != null ? `${mm}mm × ${qty}` : `× ${qty}` });
    } else if (extraId === 'extra-bottom-track') {
      const mm = wardrobeTrackLengthMm?.bottom;
      configRows.push({ label, value: mm != null ? `${mm}mm × ${qty}` : `× ${qty}` });
    } else {
      configRows.push({ label, value: `× ${qty}` });
    }
  });

  if (reference) {
    configRows.push({ label: 'Reference', value: reference });
  }

  return (
    <article className={styles.cartItem} aria-label="Cart item">

      {/* ── Header ────────────────────────────────────────────────── */}
      <button
        type="button"
        className={`${styles.cartItemHeader}${isExpanded ? ` ${styles.cartItemHeaderOpen}` : ''}`}
        onClick={() => onToggle(id)}
        aria-expanded={isExpanded}
      >
        <div className={styles.cartItemHeaderLeft}>
          <span className={styles.cartItemType}>{typeLabel}</span>
          {dimLabel && <span className={styles.cartItemDim}>{dimLabel}</span>}
          {reference && <span className={styles.cartItemRef}>{reference}</span>}
        </div>
        <div className={styles.cartItemHeaderRight}>
          <span className={styles.cartItemDate}>{formatDate(addedAt)}</span>
          <svg
            className={`${styles.chevron}${isExpanded ? ` ${styles.chevronOpen}` : ''}`}
            width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Expanded config rows ───────────────────────────────────── */}
      {isExpanded && (
        <div className={styles.cartItemBody}>
          {configRows.map((row) => (
            <div key={row.label} className={styles.cartItemMetaRow}>
              <span className={styles.cartItemMetaLabel}>{row.label}</span>
              <span className={styles.cartItemMetaValue} title={row.value}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className={styles.cartItemFooter}>
        <div className={styles.quantityControl}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >−</button>
          <span className={styles.quantityValue} aria-live="polite">{quantity}</span>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >+</button>
        </div>

        <span className={styles.cartItemPrice}>
          {formatPrice(scalePrice(priceBreakdown, quantity))}
        </span>

        <button
          type="button"
          className={styles.editButton}
          onClick={handleEdit}
          aria-label={`Edit ${typeLabel}`}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Edit
        </button>

        <button
          type="button"
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`Remove ${typeLabel} from cart`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"
            stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>

    </article>
  );
});

// ─── CartPanel ────────────────────────────────────────────────────────────────

function CartPanel() {
  const { cartState, closeCart, removeFromCart, updateQuantity, startEditing } = useCart();
  const { authState } = useAuth();
  const { items, isOpen } = cartState;

  // Only one item open at a time — tracked at panel level
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  }, []);

  // Reset open item when cart closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setOpenItemId(null), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleQuantityChange = useCallback((id: string, quantity: number) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const handleEdit = useCallback((id: string) => {
    startEditing(id);
    closeCart();
  }, [startEditing, closeCart]);

  const total = items.reduce(
    (sum, item) => sum + item.priceBreakdown.total * (item.quantity ?? 1),
    0
  );

  return (
    <>
      <div
        className={`${styles.overlay}${isOpen ? ` ${styles.overlayVisible}` : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

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
              <path d="M1 1l16 16M17 1L1 17"
                stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.25"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptySubtitle}>Configure a wardrobe to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemAccordion
                key={item.id}
                item={item}
                isExpanded={openItemId === item.id}
                onToggle={handleToggle}
                onRemove={removeFromCart}
                onQuantityChange={handleQuantityChange}
                onEdit={handleEdit}
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
                <Button variant="primary" size="lg" fullWidth
                  onClick={() => alert('Proceeding to checkout…')}>
                  Checkout
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" fullWidth
                    onClick={() => alert('Requesting a quote…')}>
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