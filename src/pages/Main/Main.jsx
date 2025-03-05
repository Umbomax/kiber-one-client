import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ProductList from "../../components/ProductList/ProductList";
import styles from "./Main.module.css";
import background from "../../img/___9-1.jpg";
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
                                <a href="#catalog-block" tabindex="0">
                                    Выбрать
                                </a>
                            </div>
                        </div>
                        <div id="catalog-block" className={styles.anchor}></div>
                    </div>
                </div>
                <h1  className={styles.header}>
                    Яркие, стильные КиберПриятности,
                    <br />
                    созданные с любовью.
                </h1>
                <strong >
                    <p className={styles.uss_shop_content}>
                        Привет, наш дорогой резидент🤗
                        <br />
                        Вот и настало время ярмарки, где ты можешь потратить свои накопленные кибероны💵 <br />
                        Ниже будут представлены все товары нашей ярмарки🎁
                        <br />
                        ❗️Некоторые товары могут быть в ограниченном количестве, так что не тяни с оформлением своего заказа. <br />
                        Ярмарка работает по предзаказу и купить товары можно только через сайт, в школе купить товар без предзаказа уже будет нельзя.❗️
                        <br /> Выбирай товары, которые хочешь приобрести и завершай свой заказ в корзине, с указанием своих данных(ФИО, город, и номер телефона)💛
                    </p>
                </strong>
                <ProductList onAddToCart={handleAddToCart} />
            </main>
        </div>
    );
};

export default Main;
