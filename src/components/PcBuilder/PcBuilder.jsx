import React from "react";
import styles from "./PcBuilder.module.css";
import CategorySelector from "./CategorySelector";
import ProductPreview from "./ProductPreview";
import PriceSummary from "./PriceSummary";
import CartContext from "../../context/CartContext";

const REQUIRED = ["CPU", "RAM", "Storage"]; // обязательно
const OPTIONAL = ["GPU"]; // опционально

const PcBuilder = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { addToCart } = React.useContext(CartContext);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("CPU");
  const [selected, setSelected] = React.useState({ CPU: null, RAM: null, GPU: null, Storage: null });

  const [basePrice, setBasePrice] = React.useState(350);
  const [products, setProducts] = React.useState({ CPU: [], RAM: [], GPU: [], Storage: [] });

  React.useEffect(() => {
    let off = false;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${apiUrl}/pc-builder/settings`);
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!off) {
          setBasePrice(data.basePrice ?? 350);
          setProducts(data.componentsByCategory || { CPU: [], RAM: [], GPU: [], Storage: [] });
        }
      } catch {
        if (!off) setError("Не удалось загрузить данные конструктора");
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, [apiUrl]);

  const listFor = (cat) => products[cat] || [];
  const findById = (cat, id) => listFor(cat).find(x => x.id === id) || null;

  const selectedComponents = React.useMemo(() => {
    const out = [];
    Object.entries(selected).forEach(([cat, id]) => {
      if (!id) return;
      const p = findById(cat, id);
      if (p) out.push({ category: cat, ...p });
    });
    return out;
  }, [selected, products]);

  const selectedSum = React.useMemo(
    () => selectedComponents.reduce((s, p) => s + (Number(p.price) || 0), 0),
    [selectedComponents]
  );

  const totalPrice = basePrice + selectedSum;

  const requiredOk = REQUIRED.every((cat) => !!selected[cat]);

  const onSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] === id ? null : id
    }));
  };

  const handleAddToCart = () => {
    if (!requiredOk) return;

    const selectedOptions = {};
    selectedComponents.forEach((c) => { selectedOptions[c.category] = c.name; });

    const product = {
      id: "pc-builder",
      name: "Конструктор ПК (сборка)",
      price: totalPrice,
      images: ["/PC_Builder.png"],
      shortDescription: "Корпус, материнка и охлаждение включены в базовую стоимость."
    };
    addToCart(product, selectedOptions);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Соберите свой компьютер</h1>
        {/* дублируем обязательность в заголовке */}
        <div className={styles.legendBar}>
          <span className={styles.badgeRequired}><span>*</span> Обязательно</span>
        </div>
      </div>

      {error && <div className={styles.err}>{error}</div>}

      <div className={styles.layout}>
        <div className={styles.left}>
          <CategorySelector
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
            requiredMap={{ CPU: true, RAM: true, Storage: true, GPU: false }}
          />
        </div>

        <div className={styles.middle}>
          {loading ? (
            <div className={styles.loading}>Загрузка…</div>
          ) : (
            <ProductPreview
              products={products}
              selectedCategory={selectedCategory}
              selectedId={selected[selectedCategory]}
              onSelect={onSelect}
              isRequired={REQUIRED.includes(selectedCategory)}
            />
          )}
        </div>

        <div className={styles.right}>
          <PriceSummary
            basePrice={basePrice}
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            onAdd={handleAddToCart}
            requiredState={{
              CPU: !!selected.CPU,
              RAM: !!selected.RAM,
              Storage: !!selected.Storage,
              GPU: !!selected.GPU 
            }}
            addDisabled={!requiredOk}
          />
        </div>
      </div>
    </div>
  );
};

export default PcBuilder;
