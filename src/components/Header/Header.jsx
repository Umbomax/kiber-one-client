import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import styles from './Header.module.css';
import logo from '../../img/_R-1-.jpg';

const Header = () => {
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={styles.header}>
      {/* Бургер-меню */}
      <div className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
        <span className={`${styles.line} ${menuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${menuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.line} ${menuOpen ? styles.open : ''}`}></span>
      </div>

      {/* Логотип */}
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Логотип" />
      </Link>

      {/* Навигация (десктоп) */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>Главная</Link>
        <Link to="/orders" className={styles.navItem}>Посмотреть заказ</Link>
      </nav>

      {/* Корзина */}
      <Link to="/cart" className={styles.cart}>
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.cartIcon} viewBox="0 0 357 550">
          <path className={styles.cartPath} d="M349,149l-66.6-.7v-43.7C282.4,46.9,235.5,0,177.8,0s-104.6,46.9-104.6,104.6v41.3l-64.2-.7c-2.4,0-4.7.9-6.3,2.6C1,149.4,0,151.7,0,154.1v396.4c0,4.9,4,8.9,8.9,8.9h340c4.9,0,8.9-4,8.9-8.9V157.9c0-4.9-3.9-8.8-8.8-8.9h0ZM91,104.6c0-47.9,38.9-86.8,86.8-86.8s86.8,39,86.8,86.8v43.4l-173.6-1.9s0-41.5,0-41.5ZM340,541.6H17.8V163.1l55.4.6v26.6c-12.3,4-21.2,15.4-21.2,29s13.8,30.7,30.7,30.7,30.7-13.8,30.7-30.7-9.5-25.7-22.3-29.4v-26.1l173.6,1.9v24.3c-12.6,3.8-21.8,15.4-21.8,29.2s13.8,30.7,30.7,30.7,30.7-13.8,30.7-30.7-9.2-25.4-21.8-29.2v-24.1l57.6.6v374.9h0ZM82.7,206.5c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9-12.9-5.8-12.9-12.9,5.8-12.9,12.9-12.9ZM273.5,206.5c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9-12.9-5.8-12.9-12.9,5.8-12.9,12.9-12.9Z"/>
        </svg>
        {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
      </Link>

      {/* Мобильное меню */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.show : ''}`}>
        <button className={styles.closeMenu} onClick={() => setMenuOpen(false)}>×</button>
        <nav>
          <Link to="/" className={styles.menuItem} onClick={() => setMenuOpen(false)}>Главная</Link>
          <Link to="/orders" className={styles.menuItem} onClick={() => setMenuOpen(false)}>Посмотреть заказ</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
