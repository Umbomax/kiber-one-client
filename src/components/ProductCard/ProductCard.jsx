import React, { useState, useContext } from 'react';
import ReactModal from 'react-modal';
import CartContext from '../../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images[0]); // Текущее активное изображение
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <>
      <div
        className={styles.productCard}
        onClick={() => setModalIsOpen(true)}
        role="button"
        tabIndex="0"
        onKeyPress={(e) => e.key === 'Enter' && setModalIsOpen(true)}
      >
        <img src={product.images[0]} alt={product.name} className={styles.productImage} />
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>{product.price} киберонов</p>
        <p className={styles.productDescription}>{product.shortDescription}</p>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{product.name}</h2>
        <img src={activeImage} alt={product.name} className={styles.modalImage} />
        <div className={styles.thumbnailContainer}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} - ${index}`}
              className={`${styles.thumbnail} ${
                activeImage === img ? styles.activeThumbnail : ''
              }`}
              onClick={() => setActiveImage(img)}
            />
          ))}
        </div>
        <p>{product.description}</p>
        {product.selectors && product.selectors.length > 0 && (
          <div className={styles.selectors}>
            {product.selectors.map((selector, index) => (
              <div key={index} className={styles.selector}>
                <label>
                  {selector.name}
                  <select>
                    {selector.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
        )}
        {quantity > 0 ? (
          <div className={styles.cartControls}>
            <button onClick={() => removeFromCart(product)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart(product)}>+</button>
          </div>
        ) : (
          <button onClick={() => addToCart(product)}>Добавить в корзину</button>
        )}
        <button onClick={() => setModalIsOpen(false)}>Закрыть</button>
      </ReactModal>
    </>
  );
};

export default ProductCard;
