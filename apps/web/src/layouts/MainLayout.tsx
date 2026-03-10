import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '@/components/ui/CartIcon/CartIcon';
import { useCart, useAuth } from '@/state/useCartAuth';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { cartState, openCart } = useCart();
  const { authState, login, logout } = useAuth();

  const itemCount = cartState.items.length;

  const handleCartOpen = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <div className={`${styles.root}${cartState.isOpen ? ` ${styles.cartOpen}` : ''}`}>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header className={styles.navbar} role="banner">
        <div className={styles.navbarInner}>
          <Link to="/" className={styles.logo} aria-label="Wardrobe Configurator home">
            Wardrobe<span className={styles.logoAccent}>.</span>
          </Link>
          <nav className={styles.navActions} aria-label="Site actions">

            {/* Dev login toggle — remove before production */}
            <button
              type="button"
              className={authState.isLoggedIn ? styles.navBtnActive : styles.navBtn}
              onClick={authState.isLoggedIn ? logout : login}
            >
              {authState.isLoggedIn ? 'Log out' : 'Log in'}
            </button>

            <CartIcon
              itemCount={itemCount}
              onClick={handleCartOpen}
            />
          </nav>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <main className={styles.main} id="main-content">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <span className={styles.footerCopy}>
            © {new Date().getFullYear()} Wardrobe Configurator. All rights reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}

export default MainLayout;