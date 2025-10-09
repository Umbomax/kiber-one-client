import React from "react";
import styles from "./PriceSummary.module.css";

const Included = () => (
    <div className={styles.includedBox}>
        <div className={styles.includedHeader}>Базовые компоненты (включены в цену):</div>
        <ul>
            <li>
                <span className={styles.dot} />
                Корпус <b>Включено</b>
            </li>
            <li>
                <span className={styles.dot} />
                Материнка <b>Включено</b>
            </li>
            <li>
                <span className={styles.dot} />
                Система охлаждения <b>Включено</b>
            </li>
        </ul>
    </div>
);

const PriceSummary = ({ basePrice, selectedComponents, totalPrice, onAdd }) => {
    return (
        <aside className={styles.card}>
            <div className={styles.header}>СВОДКА СБОРКИ</div>
            <Included />
            <div className={styles.selTitle}>Выбранные комплектующие</div>
            <div className={styles.selList}>
                {selectedComponents.length === 0 && <div className={styles.muted}>Компоненты не выбраны</div>}
                {selectedComponents.map((c) => (
                    <div key={c.id} className={styles.row}>
                        <span>
                            {c.category}: <b>{c.name}</b>
                        </span>
                        <span>{c.price} киберон</span>
                    </div>
                ))}
            </div>
            <div className={styles.sum}>
                <div className={styles.line}>
                    <span>Базовая цена</span>
                    <b>{basePrice} киберон</b>
                </div>
                <div className={styles.line}>
                    <span>Компоненты</span>
                    <b>{selectedComponents.reduce((s, p) => s + p.price, 0)} киберон</b>
                </div>
                <div className={styles.total}>
                    <span>ИТОГО</span>
                    <b>{totalPrice} киберон</b>
                </div>
            </div>
            <button className={styles.primary} onClick={onAdd} disabled={selectedComponents.length === 0}>
                Добавить в корзину
            </button>
        </aside>
    );
};

export default PriceSummary;
