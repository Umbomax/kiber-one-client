import React from "react";
import styles from "./ProductPreview.module.css";

const ProductPreview = ({ products, selectedCategory, selectedId, onSelect, isRequired }) => {
    const list = products[selectedCategory] || [];

    const getVariantWord = (count) => {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) return "вариант";
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "варианта";
        return "вариантов";
    };

    return (
        <section className={styles.wrap}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {selectedCategory === "CPU" && "Процессор"}
                    {selectedCategory === "RAM" && "Оперативная память"}
                    {selectedCategory === "GPU" && "Видеокарта"}
                    {selectedCategory === "Storage" && "Жёсткий диск"}
                </h2>
                <div className={styles.metaHead}>
                    <span className={isRequired ? styles.req : styles.opt}>
                        {isRequired ? "Обязательно" : "Опционально"}
                    </span>
                    <span className={styles.count}>
                        {list.length} {getVariantWord(list.length)} доступно
                    </span>
                </div>
            </div>

            <div className={styles.list}>
                {list.map((p) => (
                    <div key={p.id} className={styles.card}>
                        <div className={styles.thumb}>
                            <img
                                src={p.image}
                                alt={p.name}
                                onError={(e) => {
                                    e.currentTarget.style.opacity = 0.5;
                                }}
                            />
                        </div>
                        <div className={styles.body}>
                            <div className={styles.name}>{p.name}</div>
                            {p.description && <div className={styles.desc}>{p.description}</div>}
                            {Array.isArray(p.specs) && (
                                <ul className={styles.specs}>
                                    {p.specs.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            )}
                            <div className={styles.footer}>
                                <div className={styles.price}>{p.price} киберон</div>
                                <button
                                    className={selectedId === p.id ? `${styles.btn} ${styles.chosen}` : styles.btn}
                                    onClick={() => onSelect(p.id)}
                                    type="button"
                                >
                                    {selectedId === p.id ? "Выбрано" : "Выбрать"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductPreview;
