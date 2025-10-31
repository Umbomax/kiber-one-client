import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";
import { Link } from "react-router-dom";

const ProductList = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [basePrice, setBasePrice] = useState(null);

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

    useEffect(() => {
        axios
            .get(`${apiUrl}/products`)
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Ошибка при загрузке товаров");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Загрузка товаров...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.productList}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
            <Link to="/pc-builder" className={styles.productCard} aria-label="Открыть конструктор ПК">
                <div className={styles.imgBox}>
                    <img src="/PC_Builder.png" alt="Конструктор ПК" className={styles.productImage} />
                </div>
                <h3 className={styles.productName}>Конструктор ПК</h3>
                <p className={styles.productPrice}>{basePrice !== null ? `Базовая стоимость — ${basePrice} киберон` : "Базовая стоимость включена"}</p>
                <p className={styles.productDescription}>Собери свой компьютер — корпус, материнская плата, блок питания и охлаждение уже в базовой цене.</p>
            </Link>
        </div>
    );
};

export default ProductList;
