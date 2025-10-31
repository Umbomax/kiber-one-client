import React from "react";
import styles from "./PriceSummary.module.css";

const Included = () => (
  <div className={styles.includedBox}>
    <div className={styles.includedHeader}>Базовые компоненты (включены в цену):</div>
    <ul>
      <li><span className={styles.dot} /> Корпус <b>Включено</b></li>
      <li><span className={styles.dot} /> Материнка <b>Включено</b></li>
      <li><span className={styles.dot} /> Система охлаждения <b>Включено</b></li>
      <li><span className={styles.dot} /> Блок питания <b>Включено</b></li>
    </ul>
  </div>
);

const mustShowLine = (cat, selectedComponents) => selectedComponents.find((c) => c.category === cat);

const PriceSummary = ({ basePrice, selectedComponents, totalPrice, onAdd, requiredState, addDisabled }) => {
  const cpu = mustShowLine("CPU", selectedComponents);
  const ram = mustShowLine("RAM", selectedComponents);
  const ssd = mustShowLine("Storage", selectedComponents);
  const gpu = mustShowLine("GPU", selectedComponents);

  const row = (label, comp, isRequired) => (
    <div className={styles.row}>
      <span>
        {label}:{" "}
        {comp ? <span className={styles.itemName}>{comp.name}</span> : <b className={isRequired ? styles.missed : styles.muted}>Не выбрано</b>}
      </span>
      <span>{comp ? `${comp.price} киберон` : "-"}</span>
    </div>
  );

  return (
    <aside className={styles.card}>
      <div className={styles.header}>СВОДКА СБОРКИ</div>
      <Included />

      <div className={styles.selTitle}>Выбранные комплектующие</div>
      <div className={styles.selList}>
        {row("Процессор", cpu, true)}
        {row("Опетаривная память", ram, true)}
        {row("Жёсткий диск", ssd, true)}
        {row("Видеокарта", gpu, false)}
      </div>

      <div className={styles.sum}>
        <div className={styles.line}>
          <span>Базовая цена</span>
          <b>{basePrice} киберон</b>
        </div>
        <div className={styles.line}>
          <span>Компоненты</span>
          <b>
            {selectedComponents.reduce((s, p) => s + (Number(p.price) || 0), 0)} киберон
          </b>
        </div>
        <div className={styles.total}>
          <span>ИТОГО</span>
          <span>{addDisabled ? "-" : `${totalPrice} киберон`}</span>
        </div>
      </div>

      <button className={styles.primary} onClick={onAdd} disabled={addDisabled}>
        Добавить в корзину
      </button>
    </aside>
  );
};

export default PriceSummary;
