import React, { useState } from "react";
import axios from "axios";
import styles from "./FeedbackForm.module.css";
import { Helmet } from "react-helmet-async";
import logo from "../../img/_R-1-.jpg";
import Notification from "../../components/ErrorNotification/ErrorNotification";
import YandexReviewModal from "../../components/YandexReviewModal/YandexReviewModal";

const FeedbackForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const phoneRegex = /^\+375(25|29|33|44)\d{7}$/;

    const [notification, setNotification] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [modalData, setModalData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const anonymous = form.anonymous.checked;
        const phone = form.phone ? form.phone.value.trim() : "";
        const city = form.city.value;
        const location = form.location?.value || "";
        const admin = form.admin.value;
        const teacher = form.teacher.value;
        const recommend = form.recommend.value;
        const comment = form.comment.value;

        if (!city) return setNotification({ message: "Пожалуйста, выберите город.", type: "error" });
        if (locationOptions.length > 0 && !location) return setNotification({ message: "Пожалуйста, выберите локацию.", type: "error" });
        if (!admin) return setNotification({ message: "Оцените администратора.", type: "error" });
        if (!teacher) return setNotification({ message: "Оцените преподавателя.", type: "error" });
        if (!recommend) return setNotification({ message: "Оцените вероятность рекомендации.", type: "error" });
        if (!anonymous && (!phone || !phoneRegex.test(phone))) {
            return setNotification({ message: "Введите корректный номер телефона.", type: "error" });
        }

        const data = {
            city,
            location,
            admin,
            teacher,
            recommend,
            comment,
            phone: anonymous ? "" : phone,
            anonymous,
        };

        try {
            setIsSubmitting(true);

            const response = await axios.post(`${apiUrl}/submit-feedback`, data);
            const { showYandexReview, city: serverCity, location: serverLocation } = response.data;

            setNotification({ message: "Спасибо за Ваш отзыв!", type: "success" });

            if (showYandexReview) {
                setModalData({ city: serverCity, location: serverLocation });
            }
                form.reset();
                setIsAnonymous(false);
                setSelectedCity("");
                setSelectedLocation("");
                setLocationOptions([]);
        } catch (err) {
            const msg = err.response?.data?.error || "Ошибка при отправке формы.";
            setNotification({ message: msg, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);

        if (city === "Гродно") setLocationOptions(["17 Сентября 49а", "Титова 14"]);
        else if (city === "Брест") setLocationOptions(["ТЦ Миллионный", "БЦ IQ"]);
        else setLocationOptions([]);

        setSelectedLocation("");
    };

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Ваше мнение о KIBERone</title>
                <meta name="description" content="Форма обратной связи." />
            </Helmet>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {modalData && (
                <YandexReviewModal
                    city={modalData.city}
                    location={modalData.location}
                    onClose={() => setModalData(null)}
                />
            )}

            <div className={styles.header}>
                <h1>Оценка работы школы KIBERone</h1>
                <img src={logo} alt="KIBERone Logo" className={styles.logo} />
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="city">Из какого Вы города?</label>
                <select
                    id="city"
                    name="city"
                    value={selectedCity}
                    onChange={handleCityChange}
                    required
                >
                    <option value="">Выберите город</option>
                    <option value="Бобруйск">Бобруйск</option>
                    <option value="Брест">Брест</option>
                    <option value="Витебск">Витебск</option>
                    <option value="Гродно">Гродно</option>
                    <option value="Лида">Лида</option>
                    <option value="Могилев">Могилев</option>
                    <option value="Пинск">Пинск</option>
                </select>

                {locationOptions.length > 0 && (
                    <>
                        <label htmlFor="location">Выберите адрес:</label>
                        <select
                            id="location"
                            name="location"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            required
                        >
                            <option value="">Выберите адрес</option>
                            {locationOptions.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label>Оцените администратора:</label>
                <div className={styles.scale}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <React.Fragment key={`admin${i + 1}`}>
                            <input type="radio" name="admin" id={`admin${i + 1}`} value={i + 1} />
                            <label htmlFor={`admin${i + 1}`}>{i + 1}</label>
                        </React.Fragment>
                    ))}
                </div>

                <label>Оцените преподавателя:</label>
                <div className={styles.scale}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <React.Fragment key={`teacher${i + 1}`}>
                            <input type="radio" name="teacher" id={`teacher${i + 1}`} value={i + 1} />
                            <label htmlFor={`teacher${i + 1}`}>{i + 1}</label>
                        </React.Fragment>
                    ))}
                </div>

                <label>Вероятность рекомендации:</label>
                <div className={styles.scale}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <React.Fragment key={`rec${i + 1}`}>
                            <input type="radio" name="recommend" id={`rec${i + 1}`} value={i + 1} />
                            <label htmlFor={`rec${i + 1}`}>{i + 1}</label>
                        </React.Fragment>
                    ))}
                </div>

                <label htmlFor="comment">Комментарий:</label>
                <textarea
                    id="comment"
                    name="comment"
                    placeholder="Что нам стоит изменить, добавить или за что нас похвалить?"
                />

                <div className={styles.phoneBlock}>
                    {!isAnonymous && (
                        <>
                            <label htmlFor="phone">Ваш номер телефона:</label>
                            <input type="tel" id="phone" name="phone" placeholder="+375 (__) ___-__-__" />
                        </>
                    )}
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            id="anonymous"
                            name="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        Анонимный отзыв
                    </label>
                </div>

                <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                    {isSubmitting ? "Отправка..." : "Отправить"}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
