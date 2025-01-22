import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  return (
    <header>
      <Link to="/">Логотип</Link>
      <Link to="/cart">
        <FaShoppingCart />
      </Link>
    </header>
  );
};

export default Header;
