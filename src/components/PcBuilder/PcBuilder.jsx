import React, { useMemo, useContext, useEffect } from "react";
import styles from "./PcBuilder.module.css";
import CategorySelector from "./CategorySelector";
import ProductPreview from "./ProductPreview";
import PriceSummary from "./PriceSummary";
import CartContext from "../../context/CartContext";

const PcBuilder = () => {
  const apiUrl = process.env.REACT_APP_API_URL; // уже есть в проекте
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("CPU");
  const [selected, setSelected] = React.useState({ CPU: null, RAM: null, GPU: null, Storage: null });

  const [basePrice, setBasePrice] = React.useState(350);
  const [products, setProducts] = React.useState({ CPU: [], RAM: [], GPU: [], Storage: [] });

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let aborted = false;
    (async () => {
      setLoading(true); setError("");
      try {
        const r = await fetch(`${apiUrl}/pc-builder/settings`);
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!aborted) {
          setBasePrice(data.basePrice ?? 350);
          setProducts(data.componentsByCategory || { CPU: [], RAM: [], GPU: [], Storage: [] });
        }
      } catch {
        if (!aborted) setError("Не удалось загрузить данные конструктора");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [apiUrl]);

  const selectedComponents = useMemo(() => {
    const out = [];
    Object.entries(selected).forEach(([cat, id]) => {
      if (!id) return;
      const list = products[cat] || [];
      const p = list.find(x => x.id === id);
      if (p) out.push({ category: cat, ...p });
    });
    return out;
  }, [selected, products]);

  const totalPrice = useMemo(() => basePrice + selectedComponents.reduce((s, p) => s + (p.price || 0), 0), [basePrice, selectedComponents]);

  const onSelect = (id) => {
    setSelected(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] === id ? null : id
    }));
  };

  const handleAddToCart = () => {
    if (selectedComponents.length === 0) return;
    const selectedOptions = {};
    selectedComponents.forEach(c => { selectedOptions[c.category] = c.name; });

    // это «виртуальный» товар, не из таблицы products
    const product = {
      id: "pc-builder", // нечисловой id → ниже на бэке обработаем как кастом-товар
      name: "Конструктор ПК (сборка)",
      price: totalPrice,
      images: ["/PC_Builder.png"],
      shortDescription: "Корпус, материнка и охлаждение включены в базовую стоимость."
    };
    addToCart(product, selectedOptions);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}><h1>Соберите свой компьютер</h1></div>
      {error && <div style={{color:"#b10000", marginBottom:12}}>{error}</div>}
      <div className={styles.layout}>
        <div className={styles.left}>
          <CategorySelector selectedCategory={selectedCategory} onChange={setSelectedCategory} />
        </div>
        <div className={styles.middle}>
          {loading ? <div>Загрузка…</div> : (
            <ProductPreview
              products={products}
              selectedCategory={selectedCategory}
              selectedId={selected[selectedCategory]}
              onSelect={onSelect}
            />
          )}
        </div>
        <div className={styles.right}>
          <PriceSummary
            basePrice={basePrice}
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            onAdd={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default PcBuilder;
