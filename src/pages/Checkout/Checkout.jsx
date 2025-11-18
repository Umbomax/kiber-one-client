import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../context/CartContext";
import axios from "axios";
import styles from "./Checkout.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Notification from "../../components/Notification/Notification";
import ErrorNotification from "../../components/ErrorNotification/ErrorNotification";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [notification, setNotification] = useState(null);
    const [schools, setSchools] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [error, setError] = useState(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        schoolId: "",
        groupId: "",
        phone: "+375",
        comments: "",
    });

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await axios.get(`${apiUrl}/public/schools`);
                setSchools(response.data);
            } catch (error) {
                setError("Ошибка загрузки школ");
            }
        };
        fetchSchools();
    }, [apiUrl]);

    const normalizeName = (val) => {
        let v = String(val).replace(/[–-—−]/g, "-");
        v = v.replace(/[^A-Za-zА-Яа-яЁёІіЎў-]/g, "");
        v = v.replace(/-+/g, "-");
        return v;
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "firstName" || name === "lastName") {
            const cleanedValue = normalizeName(value);
            setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "schoolId") {
            try {
                const response = await axios.get(`${apiUrl}/public/schools/${value}/groups`);
                setGroups(response.data);
                setFormData((prev) => ({ ...prev, groupId: "" }));
            } catch (error) {
                console.error("Ошибка загрузки групп:", error);
                setGroups([]);
            }
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.startsWith("375")) {
            value = `+${value}`;
        } else if (value.startsWith("75")) {
            value = `+3${value}`;
        } else if (value.startsWith("5")) {
            value = `+375${value.substring(1)}`;
        }

        if (!value.startsWith("+375")) {
            value = "+375";
        }

        const phoneRegex = /^\+375(25|29|33|44)\d{7}$/;
        setIsPhoneValid(phoneRegex.test(value));

        setFormData((prev) => ({ ...prev, phone: value }));
    };

    const handleCheckboxChange = () => {
        setIsAgreed((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Клиентская проверка от подмены значений
        const nameRegex = /^[A-Za-zА-Яа-яЁёІіЎў-]+$/;
        if (!nameRegex.test(formData.firstName)) {
            setError("Имя должно содержать только буквы и дефис");
            return;
        }
        if (!nameRegex.test(formData.lastName)) {
            setError("Фамилия должна содержать только буквы и дефис");
            return;
        }

        if (!isPhoneValid) {
            setError("Введите корректный номер телефона");
            return;
        }
        if (!isAgreed) {
            setError("Необходимо согласие на обработку персональных данных");
            return;
        }

        if (!cart || cart.length === 0) {
            setError("Ваша корзина пуста");
            return;
        }

        const totalPrice = cart.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const qty = item.quantity || 1;
            return sum + price * qty;
        }, 0);

        if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
            setError("Ошибка при расчёте стоимости заказа. Попробуйте обновить страницу.");
            return;
        }

        if (totalPrice > 7000) {
            setError("У Вас недостаточно киберонов для заказа.");
            return;
        }

        const numbers = formData.comments.match(/\d+/g);
        if (!numbers || numbers.length === 0) {
            setError("Укажи, пожалуйста, количество заработанных тобой киберонов цифрой.");
            return;
        }

        const parsed = numbers.map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n) && n > 0);

        if (parsed.length === 0) {
            setError("Укажи, пожалуйста, количество заработанных тобой киберонов цифрой.");
            return;
        }

        const kiberonsAmount = Math.max(...parsed);


        if (kiberonsAmount < 50) {
            setError("Укажи, пожалуйста, количество заработанных тобой киберон цифрой.");
            return;
        }

        if (totalPrice - kiberonsAmount > 300) {
            setError("У Вас недостаточно киберонов для заказа.");
            return;
        }


        const cartPayload = cart.map((item) => {
            const isNumericId = Number.isInteger(item.id);
            return {
                product_id: isNumericId ? item.id : null,
                name: isNumericId ? undefined : item.name,
                price: Number(item.price),
                quantity: item.quantity || 1,
                selected_options: item.selectedOptions || null,
            };
        });

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${apiUrl}/create-order`, {
                ...formData,
                cart: cartPayload,
            });

            setNotification({
                message: `Ваш заказ №${response.data.orderCode} оформлен!`,
                orderCode: response.data.orderCode,
            });
            clearCart();
            setFormData({
                firstName: "",
                lastName: "",
                schoolId: "",
                groupId: "",
                phone: "+375",
                comments: "",
            });
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            setError(error.response?.data?.message || "Не удалось оформить заказ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            {notification && <Notification message={notification.message} orderCode={notification.orderCode} />}
            {error && <ErrorNotification message={error} onClose={() => setError(null)} />}
            <div className={styles.checkout}>
                <h2 className={styles.header}>Оформление заказа</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Имя ученика</label>
                        <input
                            placeholder="Укажите имя ученика"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            pattern="[A-Za-zА-Яа-яЁёІіЎў-]+"
                            inputMode="text"
                            autoComplete="given-name"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Фамилия ученика</label>
                        <input
                            placeholder="Укажите фамилию ученика"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            pattern="[A-Za-zА-Яа-яЁёІіЎў-]+"
                            inputMode="text"
                            autoComplete="family-name"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Адрес школы</label>
                        <select name="schoolId" value={formData.schoolId} onChange={handleChange} required>
                            <option value="">Выберите школу</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Группа</label>
                        <select name="groupId" value={formData.groupId} onChange={handleChange} disabled={!formData.schoolId} required>
                            <option value="">Выберите группу</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                        <p>❗️Внимательно выбирайте свой город, адрес школы и группу, чтобы Ваш заказ был доставлен верно</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            required
                            maxLength={13}
                            className={!isPhoneValid ? styles.invalid : ""}
                            inputMode="tel"
                            autoComplete="tel"
                        />
                        {!isPhoneValid && <small className={styles.errorText}>Формат: +375 (25/29/33/44) 1234567</small>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Комментарии</label>
                        <textarea placeholder="Напиши сюда сколько у тебя КИБЕРОНОВ и любые пожелания к заказу" name="comments" value={formData.comments} onChange={handleChange} required />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="agreement" checked={isAgreed} onChange={handleCheckboxChange} required />
                        <label htmlFor="agreement">Согласен на обработку персональных данных</label>
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={!isPhoneValid || isSubmitting}>
                        Оформить заказ
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
