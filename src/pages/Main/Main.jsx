import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ProductList from "../../components/ProductList/ProductList";
import styles from "./Main.module.css";
// import background from "../../img/___9-1.jpg";
const Main = () => {
    const [cart, setCart] = useState([]);

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prevCart, product];
        });
    };

    return (
        <div>
            <Header />

            <main>
                <div>
                    <div className={styles.slide}>
                        <div className={styles.image}></div>
                        <div className={styles.caption}>
                            <p className={styles.title}>Магазин КиберПриятностей для резидентов KIBERone</p>
                            <div className={styles.ussmore}>
                                <a href="#catalog-block" tabIndex="0">
                                    Выбрать
                                </a>
                            </div>
                        </div>
                        <div id="catalog-block" className={styles.anchor}></div>
                    </div>
                </div>
                <div className={styles.container}>
                    <h1>Привет, дорогой резидент 🤗</h1>
                    <p>
                        Настало время ярмарки, где ты сможешь потратить свои накопленные <strong>КИБЕРОНЫ💵</strong>
                    </p>
                    <p className={styles.highlight}>❗️Некоторые товары могут быть в ограниченном количестве, так что не тяни с оформлением своего заказа.</p>
                    <p className={styles.highlight}>❗️Ярмарка работает по предзаказу и купить товары можно только через сайт, в школе купить товар без предзаказа уже будет нельзя.</p>
                    <p className={styles.highlight}>
                        ❗️Примечание: так как ты делаешь заказ заранее до ярмарки, не забывай, при выборе товара, учитывать <strong>КИБЕРоны</strong>, которые ты еще заработаешь до конца мая.
                    </p>
                    <p>Выбирай товары, которые хочешь приобрести, и завершай свой заказ в корзине, с указанием своих данных (ФИО, город и номер телефона) 💛</p>
                </div>
                <ProductList onAddToCart={handleAddToCart} />
            </main>
        </div>
    );
};

export default Main;
