import React from 'react';
import styles from './CartIcon.module.css';

interface CartIconProps {
  itemCount: number;
  onClick: () => void;
  'aria-label'?: string;
}

const CartIcon = React.memo(function CartIcon({
  itemCount,
  onClick,
  'aria-label': ariaLabel = 'Open cart',
}: CartIconProps) {
  return (
    <button
      type="button"
      className={styles.root}
      onClick={onClick}
      aria-label={`${ariaLabel}${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? 's' : ''}` : ''}`}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>

      {itemCount > 0 && (
        <span key={itemCount} className={styles.badge} aria-hidden="true">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
});

export default CartIcon;