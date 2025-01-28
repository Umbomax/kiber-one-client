import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../context/CartContext";
import axios from "axios";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    schoolId: "",
    phone: "",
    comments: "",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://localhost:5050/add-school");
        setSchools(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке адресов школ:", error);
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5050/create-order", {
        ...formData,
        cart,
      });

      alert("Заказ успешно оформлен!");
      clearCart();
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert("Не удалось оформить заказ");
    }
  };

  return (
    <div className={styles.checkout}>
      <h2>Оформление заказа</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Фамилия:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Адрес школы:
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            required
          >
            <option value="">Выберите школу</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.address}
              </option>
            ))}
          </select>
        </label>
        <label>
          Телефон:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Комментарии:
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </label>
        <button type="submit" className={styles.submitButton}>
          Оформить заказ
        </button>
      </form>
    </div>
  );
};

export default Checkout;
