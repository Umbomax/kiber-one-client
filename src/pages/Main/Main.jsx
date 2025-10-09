import React, { useState, useEffect } from "react";
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
    const [basePrice, setBasePrice] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${apiUrl}/pc-builder/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.basePrice) setBasePrice(data.basePrice);
                }
            } catch (err) {
                console.error("Ошибка загрузки базовой цены:", err);
            }
        })();
    }, [apiUrl]);
    return (
        <div>
            <Header />

            <main>
                <div>
                    <div className={styles.slide}>
                        <div className={styles.image}></div>
                        <div className={styles.caption}>
                            <p className={styles.title}>
                                Магазин КиберПриятностей <br /> для резидентов KIBERone
                            </p>
                            <div className={styles.ussmore}>
                                <a href="#catalog-block" tabIndex="0">
                                    Выбрать
                                </a>
                            </div>
                        </div>
                        <div id="catalog-block" className={styles.anchor}></div>
                    </div>



                    <div className={styles.container}>
                        <h1>Привет, дорогой резидент 🤗</h1>
                        <p>
                            Настало время ярмарки, где ты сможешь потратить свои накопленные <strong>КИБЕРОНЫ💵</strong>
                        </p>
                        <p className={styles.highlight}>
                            <b>!</b> Ярмарка работает по предзаказу и купить товары можно только через сайт. В школе купить товар без предзаказа уже будет нельзя!
                        </p>
                        <p className={styles.highlight}>
                            <b>!</b> Некоторые товары могут быть в ограниченном количестве, так что не тяни с оформлением своего заказа.
                        </p>
                        <p className={styles.highlight}>
                            <b>!</b> Примечание: так как ты делаешь заказ заранее до ярмарки, не забывай, при выборе товара, учитывать <strong>КИБЕРоны</strong>, которые ты еще заработаешь до конца
                            мая.
                        </p>
                        <p>Выбирай товары, которые хочешь приобрести, и завершай свой заказ в корзине, с указанием своих данных (ФИО, город и номер телефона) 💛</p>
                    </div>
                    <ProductList onAddToCart={handleAddToCart} />
                    <div className={styles.productCard} onClick={() => (window.location.href = "/pc-builder")}>
                        <img src="/PC_Builder.png" alt="Конструктор ПК" className={styles.productImage} />
                        <h3 className={styles.productName}>Конструктор ПК</h3>
                        <p className={styles.productPrice}>{basePrice !== null ? `Базовая стоимость — ${basePrice} киберон` : "Базовая стоимость — 6000 киберон"}</p>
                        <p className={styles.productDescription}>Собери свой компьютер — в базу уже входят корпус, материнка и охлаждение.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Main;
