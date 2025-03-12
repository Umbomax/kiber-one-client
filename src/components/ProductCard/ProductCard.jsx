import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import CartContext from "../../context/CartContext";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(product.images[0]);
    const { cart, addToCart, removeFromCart } = useContext(CartContext);

    const [selectedOptions, setSelectedOptions] = useState(() => {
        if (!Array.isArray(product.selectors)) return {};
        return product.selectors.reduce((acc, selector) => {
            acc[selector.name] = selector.options?.[0] || ""; // Первый вариант по умолчанию
            return acc;
        }, {});
    });

    const cartItem = cart.find((item) => item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleChange = (selectorName, optionValue) => {
        setSelectedOptions((prev) => ({ ...prev, [selectorName]: optionValue }));
    };

    return (
        <>
            <div className={styles.productCard} onClick={() => setModalIsOpen(true)} role="button" tabIndex="0" onKeyPress={(e) => e.key === "Enter" && setModalIsOpen(true)}>
                <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{product.price} киберонов</p>
                <p className={styles.productDescription}>{product.shortDescription}</p>
            </div>

            <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className={styles.modal} overlayClassName={styles.overlay}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={() => setModalIsOpen(false)}>
                        ×
                    </button>
                    <h2>{product.name}</h2>
                    <img src={activeImage} alt={product.name} className={styles.modalImage} />
                    <div className={styles.thumbnailContainer}>
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} - ${index}`}
                                className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ""}`}
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
                                        <select value={selectedOptions[selector.name]} onChange={(e) => handleChange(selector.name, e.target.value)}>
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
                </div>

                <div className={styles.modalFooter}>
                    {quantity > 0 ? (
                        <div className={styles.cartControls}>
                            <button onClick={() => removeFromCart(product, selectedOptions)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => addToCart(product, selectedOptions)}>+</button>
                        </div>
                    ) : (
                        <button onClick={() => addToCart(product, selectedOptions)}>Добавить в корзину</button>
                    )}
                    <button onClick={() => setModalIsOpen(false)}>Закрыть</button>
                </div>
            </ReactModal>
        </>
    );
};

export default ProductCard;
