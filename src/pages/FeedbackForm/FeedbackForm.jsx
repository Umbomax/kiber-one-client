import React, { useState } from "react";
import axios from "axios";
import styles from "./FeedbackForm.module.css";
import { Helmet } from "react-helmet-async";
import logo from "../../img/_R-1-.jpg";
import Notification from "../../components/ErrorNotification/ErrorNotification";
const FeedbackForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const phoneRegex = /^\+375(25|29|33|44)\d{7}$/;
    const [notification, setNotification] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const anonymous = form.anonymous.checked;
        const phone = form.phone ? form.phone.value.trim() : "";
        const city = form.city.value;
        const admin = form.admin.value;
        const teacher = form.teacher.value;
        const recommend = form.recommend.value;
        const comment = form.comment.value;

        if (!city) {
            setNotification({ message: "Пожалуйста, выберите город.", type: "error" });
            return;
        }

        if (!admin) {
            setNotification({ message: "Пожалуйста, оцените работу администратора.", type: "error" });
            return;
        }

        if (!teacher) {
            setNotification({ message: "Пожалуйста, оцените работу преподавателя.", type: "error" });
            return;
        }

        if (!recommend) {
            setNotification({ message: "Пожалуйста, выберите вероятность рекомендации.", type: "error" });
            return;
        }

        if (!anonymous && (!phone || !phoneRegex.test(phone))) {
            setNotification({ message: "Пожалуйста, введите корректный номер телефона (+37529xxxxxxx).", type: "error" });
            return;
        }

        const data = {
            city,
            admin,
            teacher,
            recommend,
            comment,
            phone: anonymous ? "" : phone,
            anonymous,
        };

        try {
            setIsSubmitting(true); // кнопка становится "Отправка..." и неактивной
            await axios.post(`${apiUrl}/submit-feedback`, data);
            setNotification({ message: "Спасибо за ваш отзыв!", type: "success" });
            form.reset();
            setIsAnonymous(false); // сброс чекбокса
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || "Произошла ошибка при отправке формы.";
            setNotification({ message: errMsg, type: "error" });
        } finally {
            setIsSubmitting(false); // вернуть кнопку к "Отправить"
        }
    };

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Ваше мнение о KIBERone</title>
                <meta name="description" content="Форма обратной связи." />
            </Helmet>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className={styles.header}>
                <h1>Оценка работы школы KIBERone</h1>
                <img src={logo} alt="KIBERone Logo" className={styles.logo} />
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="city">Из какого Вы города?</label>
                <select id="city" name="city" required>
                    <option value="">Выберите город</option>
                    <option value="Бобруйск">Бобруйск</option>
                    <option value="Брест">Брест</option>
                    <option value="Витебск">Витебск</option>
                    <option value="Гродно">Гродно</option>
                    <option value="Лида">Лида</option>
                    <option value="Могилев">Могилев</option>
                    <option value="Пинск">Пинск</option>
                </select>

                <label>Насколько Вы довольны работой администратора?</label>
                <div className={styles.scaleWrapperHalf}>
                    <div className={styles.scale}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <React.Fragment key={`admin${i + 1}`}>
                                <input type="radio" name="admin" id={`admin${i + 1}`} value={i + 1} />
                                <label htmlFor={`admin${i + 1}`}>{i + 1}</label>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className={styles.scaleLegend}>
                        <span>Плохо</span>
                        <span>Отлично</span>
                    </div>
                </div>

                <label>Довольны ли Вы и ваш ребенок работой преподавателя?</label>
                <div className={styles.scaleWrapperHalf}>
                    <div className={styles.scale}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <React.Fragment key={`teacher${i + 1}`}>
                                <input type="radio" name="teacher" id={`teacher${i + 1}`} value={i + 1} />
                                <label htmlFor={`teacher${i + 1}`}>{i + 1}</label>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className={styles.scaleLegend}>
                        <span>Плохо</span>
                        <span>Отлично</span>
                    </div>
                </div>

                <label>С какой вероятностью Вы порекомендуете KIBERone друзьям?</label>
                <div className={styles.scaleWrapper}>
                    <div className={styles.scale}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <React.Fragment key={`rec${i + 1}`}>
                                <input type="radio" name="recommend" id={`rec${i + 1}`} value={i + 1} />
                                <label htmlFor={`rec${i + 1}`}>{i + 1}</label>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className={styles.scaleLegend}>
                        <span>не буду рекомендовать</span>
                        <span>точно порекомендую</span>
                    </div>
                </div>

                <div className={styles.scaleWrapper}>
                    <label htmlFor="comment">Комментарий:</label>
                    <textarea id="comment" name="comment" placeholder="Что нам стоит изменить, добавить или за что нас похвалить?"></textarea>
                </div>

                <div className={styles.phoneBlock}>
                    {!isAnonymous && (
                        <>
                            <label htmlFor="phone">Ваш номер телефона:</label>
                            <input type="tel" id="phone" name="phone" placeholder="+375 (__) ___-__-__" />
                        </>
                    )}
                    <label className={styles.checkbox}>
                        <input type="checkbox" id="anonymous" name="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
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
