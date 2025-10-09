import React from "react";
import styles from "./CategorySelector.module.css";

const ICONS = {
    CPU: (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" opacity=".2" />
            <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" fill="none" />
        </svg>
    ),
    RAM: (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" fill="none" />
            <path d="M7 8v8M11 8v8M15 8v8" stroke="currentColor" />
        </svg>
    ),
    GPU: (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" fill="none" />
            <circle cx="9" cy="12" r="2.5" stroke="currentColor" fill="none" />
            <rect x="14" y="10" width="5" height="4" rx="1" fill="currentColor" opacity=".2" />
        </svg>
    ),
    Storage: (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" fill="none" />
            <circle cx="12" cy="12" r="2" fill="currentColor" opacity=".2" />
        </svg>
    ),
};

const ITEMS = [
    { id: "CPU", label: "Процессор" },
    { id: "RAM", label: "Оперативная память" },
    { id: "GPU", label: "Видеокарта" },
    { id: "Storage", label: "Жёсткий диск" },
];

const CategorySelector = ({ selectedCategory, onChange }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.caption}>КОМПОНЕНТЫ</div>
            <div className={styles.nav}>
                {ITEMS.map((it) => (
                    <button key={it.id} className={selectedCategory === it.id ? `${styles.item} ${styles.active}` : styles.item} onClick={() => onChange(it.id)} type="button">
                        <span className={styles.icon}>{ICONS[it.id]}</span>
                        <span>{it.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default CategorySelector;
