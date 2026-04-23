import React, { startTransition, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import styles from "./FeedbackForm.module.css";
import logo from "../../img/_R-1-.jpg";
import Notification from "../../components/ErrorNotification/ErrorNotification";

const CITIES = [
    "Бобруйск",
    "Брест",
    "Витебск",
    "Гродно",
    "Кобрин",
    "Лида",
    "Могилев",
    "Орша",
    "Пинск",
];

const SCORE_VALUES = Array.from({ length: 10 }, (_, index) => String(index + 1));

const RATING_SECTIONS = [
    {
        key: "quality",
        step: "01",
        title: "Насколько Вы удовлетворены качеством обучения?",
    },
    {
        key: "teacher",
        step: "02",
        title: "Оцените взаимодействие преподавателей с детьми",
    },
    {
        key: "admin",
        step: "03",
        title: "Как Вы оцениваете оперативность и качество взаимодействия с администратором?",
    },
];

const RECOMMEND_OPTIONS = [
    { value: "yes", label: "Да" },
    { value: "no", label: "Нет" },
    { value: "unsure", label: "Затрудняюсь ответить" },
];

const PARALLAX_CONFIG = {
    desktop: {
        scroll: {
            back: 0.14,
            mid: 0.26,
            front: 0.42,
            near: 0.64,
        },
        pointer: {
            x: 168,
            y: 108,
        },
    },
    mobile: {
        scroll: {
            back: 0.09,
            mid: 0.17,
            front: 0.28,
            near: 0.4,
        },
        pointer: {
            x: 56,
            y: 34,
        },
    },
};

const INITIAL_FORM_STATE = {
    city: "",
    quality: "",
    teacher: "",
    admin: "",
    recommend: "",
    reason: "",
    improvement: "",
    childName: "",
    anonymous: false,
};

const getReasonLabel = (recommend) => {
    if (recommend === "no") {
        return "Пожалуйста, укажите причину, почему Вы выбрали «Нет»";
    }

    return "Пожалуйста, укажите причину, причину Вы затрудняетесь ответить";
};

const getReasonPlaceholder = (recommend) => {
    if (recommend === "no") {
        return "Что повлияло на ваше решение?";
    }

    return "Что мешает дать однозначную оценку?";
};

const FeedbackForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const pageRef = useRef(null);

    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    const showReasonField = formData.recommend === "no" || formData.recommend === "unsure";

    useEffect(() => {
        const pageNode = pageRef.current;

        if (!pageNode || typeof window === "undefined") {
            return undefined;
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let rafId = 0;
        let pointerX = 0.5;
        let pointerY = 0.5;

        const setStaticParallax = () => {
            pageNode.style.setProperty("--parallax-back", "0px");
            pageNode.style.setProperty("--parallax-mid", "0px");
            pageNode.style.setProperty("--parallax-front", "0px");
            pageNode.style.setProperty("--parallax-near", "0px");
            pageNode.style.setProperty("--parallax-drift-x", "0px");
            pageNode.style.setProperty("--parallax-drift-y", "0px");
        };

        const applyParallax = () => {
            const isMobile = window.innerWidth <= 768;
            const config = isMobile ? PARALLAX_CONFIG.mobile : PARALLAX_CONFIG.desktop;
            const scrollShift = window.scrollY;
            const driftX = (pointerX - 0.5) * config.pointer.x;
            const driftY = (pointerY - 0.5) * config.pointer.y;

            pageNode.style.setProperty("--parallax-back", `${scrollShift * config.scroll.back}px`);
            pageNode.style.setProperty("--parallax-mid", `${scrollShift * config.scroll.mid}px`);
            pageNode.style.setProperty("--parallax-front", `${scrollShift * config.scroll.front}px`);
            pageNode.style.setProperty("--parallax-near", `${scrollShift * config.scroll.near}px`);
            pageNode.style.setProperty("--parallax-drift-x", `${driftX}px`);
            pageNode.style.setProperty("--parallax-drift-y", `${driftY}px`);
        };

        const requestParallaxUpdate = () => {
            if (motionQuery.matches || rafId) {
                return;
            }

            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                applyParallax();
            });
        };

        const handlePointerMove = (event) => {
            pointerX = event.clientX / window.innerWidth;
            pointerY = event.clientY / window.innerHeight;
            requestParallaxUpdate();
        };

        const handleMotionChange = () => {
            if (motionQuery.matches) {
                setStaticParallax();
                return;
            }

            requestParallaxUpdate();
        };

        if (motionQuery.matches) {
            setStaticParallax();
        } else {
            requestParallaxUpdate();
        }

        window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
        window.addEventListener("resize", requestParallaxUpdate);
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        motionQuery.addEventListener?.("change", handleMotionChange);

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }

            window.removeEventListener("scroll", requestParallaxUpdate);
            window.removeEventListener("resize", requestParallaxUpdate);
            window.removeEventListener("pointermove", handlePointerMove);
            motionQuery.removeEventListener?.("change", handleMotionChange);
        };
    }, []);

    const updateField = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleCityChange = (event) => {
        const city = event.target.value;

        setFormData((previous) => ({
            ...previous,
            city,
        }));
    };

    const handleRecommendChange = (value) => {
        setFormData((previous) => ({
            ...previous,
            recommend: value,
            reason: value === "yes" ? "" : previous.reason,
        }));
    };

    const handleAnonymousChange = (checked) => {
        setFormData((previous) => ({
            ...previous,
            anonymous: checked,
            childName: checked ? "" : previous.childName,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const childName = formData.childName.trim();
        const reason = formData.reason.trim();
        const improvement = formData.improvement.trim();

        if (!formData.city) {
            setNotification({ message: "Пожалуйста, выберите город.", type: "error" });
            return;
        }

        if (!formData.quality) {
            setNotification({ message: "Оцените качество обучения.", type: "error" });
            return;
        }

        if (!formData.teacher) {
            setNotification({ message: "Оцените работу преподавателей.", type: "error" });
            return;
        }

        if (!formData.admin) {
            setNotification({ message: "Оцените взаимодействие с администрацией.", type: "error" });
            return;
        }

        if (!formData.recommend) {
            setNotification({ message: "Выберите, порекомендовали бы вы школу знакомым.", type: "error" });
            return;
        }

        if (!improvement) {
            setNotification({ message: "Напишите, что можно улучшить в работе школы.", type: "error" });
            return;
        }

        if (!formData.anonymous && !childName) {
            setNotification({ message: "Укажите ФИО ребенка или включите анонимный отзыв.", type: "error" });
            return;
        }

        const payload = {
            city: formData.city,
            quality: formData.quality,
            teacher: formData.teacher,
            admin: formData.admin,
            recommend: formData.recommend,
            recommendReason: showReasonField ? reason : "",
            improvement,
            childName: formData.anonymous ? "" : childName,
            anonymous: formData.anonymous,
        };

        try {
            setIsSubmitting(true);

            await axios.post(`${apiUrl}/submit-feedback`, payload, {
                withCredentials: true,
            });

            setNotification({ message: "Спасибо! Отзыв отправлен.", type: "success" });

            startTransition(() => {
                setFormData(INITIAL_FORM_STATE);
            });
        } catch (error) {
            const message = error.response?.data?.error || "Ошибка при отправке формы.";
            setNotification({ message, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page} ref={pageRef}>
            <Helmet>
                <title>Оценка работы школы KIBERone</title>
                <meta
                    name="description"
                    content="Форма обратной связи KIBERone для родителей: оценки качества обучения, преподавателей и взаимодействия с администрацией."
                />
            </Helmet>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className={styles.parallaxScene} aria-hidden="true">
                <span className={`${styles.orb} ${styles.orbTealPrimary}`} />
                <span className={`${styles.orb} ${styles.orbGoldPrimary}`} />
                <span className={`${styles.orb} ${styles.orbTealSecondary}`} />
                <span className={`${styles.orb} ${styles.orbGoldSecondary}`} />
                <span className={`${styles.orb} ${styles.orbTealTertiary}`} />
                <span className={`${styles.orb} ${styles.orbGoldTertiary}`} />
                <span className={`${styles.orb} ${styles.orbTealHalo}`} />
                <span className={`${styles.orb} ${styles.orbGoldHalo}`} />
                <span className={`${styles.orb} ${styles.orbBackAccent}`} />
                <span className={`${styles.orb} ${styles.orbMidAccent}`} />
                <span className={`${styles.orb} ${styles.orbFrontAccent}`} />
                <span className={`${styles.orb} ${styles.orbNearAccent}`} />
                <span className={`${styles.orb} ${styles.orbLowerLeftPrimary}`} />
                <span className={`${styles.orb} ${styles.orbLowerLeftSecondary}`} />
                <span className={`${styles.orb} ${styles.orbBottomTeal}`} />
                <span className={`${styles.orb} ${styles.orbBottomGold}`} />
            </div>

            <main className={styles.layout}>
                <header
                    className={`${styles.card} ${styles.headerCard}`}
                    style={{ "--reveal-delay": "40ms" }}
                >
                    <h1 className={styles.title}>Оценка работы школы KIBERone</h1>
                    <img className={styles.logo} src={logo} alt="KIBERone" />
                </header>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <section
                        className={styles.card}
                        style={{ "--reveal-delay": "110ms" }}
                    >
                        <h2 className={styles.sectionTitle}>Из какого Вы города?</h2>

                        <div className={styles.fieldStack}>
                            <label className={styles.fieldLabel} htmlFor="city">
                                Город
                            </label>
                            <div className={styles.selectWrap}>
                                <select
                                    className={styles.select}
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                    required
                                >
                                    <option value="">Выберите город</option>
                                    {CITIES.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {RATING_SECTIONS.map((section, index) => (
                        <section
                            key={section.key}
                            className={styles.card}
                            style={{ "--reveal-delay": `${180 + index * 70}ms` }}
                        >
                            <div className={styles.cardHeading}>
                                <span className={styles.stepBadge}>
                                    <span className={styles.stepNumber}>{section.step}</span>
                                </span>
                                <h2 className={styles.questionTitle}>{section.title}</h2>
                            </div>

                            <div className={styles.ratingGrid}>
                                {SCORE_VALUES.map((score) => {
                                    const inputId = `${section.key}-${score}`;

                                    return (
                                        <label className={styles.scoreControl} htmlFor={inputId} key={inputId}>
                                            <input
                                                className={styles.scoreInput}
                                                id={inputId}
                                                name={section.key}
                                                type="radio"
                                                value={score}
                                                checked={formData[section.key] === score}
                                                onChange={(event) => updateField(section.key, event.target.value)}
                                            />
                                            <span className={styles.scoreBubble}>{score}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className={styles.scaleLegend}>
                                <span>совсем не доволен</span>
                                <span className={styles.scaleLegendEnd}>полностью доволен</span>
                            </div>
                        </section>
                    ))}

                    <section
                        className={styles.card}
                        style={{ "--reveal-delay": "390ms" }}
                    >
                        <div className={styles.cardHeading}>
                            <span className={styles.stepBadge}>
                                <span className={styles.stepNumber}>04</span>
                            </span>
                            <h2 className={styles.questionTitle}>
                                Порекомендовали бы Вы нашу школу своим знакомым?
                            </h2>
                        </div>

                        <div className={styles.choiceList}>
                            {RECOMMEND_OPTIONS.map((option) => {
                                const inputId = `recommend-${option.value}`;

                                return (
                                    <label className={styles.choiceControl} htmlFor={inputId} key={option.value}>
                                        <input
                                            className={styles.choiceInput}
                                            id={inputId}
                                            name="recommend"
                                            type="radio"
                                            value={option.value}
                                            checked={formData.recommend === option.value}
                                            onChange={() => handleRecommendChange(option.value)}
                                        />
                                        <span className={styles.choicePill}>{option.label}</span>
                                    </label>
                                );
                            })}
                        </div>

                        <div
                            className={`${styles.collapsible} ${showReasonField ? styles.collapsibleOpen : ""}`}
                        >
                            <div className={styles.collapsibleInner}>
                                <div className={styles.fieldStack}>
                                    <label className={styles.fieldLabel} htmlFor="reason">
                                        {getReasonLabel(formData.recommend)}
                                    </label>
                                    <textarea
                                        className={styles.textArea}
                                        id="reason"
                                        name="reason"
                                        placeholder={getReasonPlaceholder(formData.recommend)}
                                        value={formData.reason}
                                        onChange={(event) => updateField("reason", event.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        className={styles.card}
                        style={{ "--reveal-delay": "460ms" }}
                    >
                        <div className={styles.cardHeading}>
                            <span className={styles.stepBadge}>
                                <span className={styles.stepNumber}>05</span>
                            </span>
                            <h2 className={styles.questionTitle}>
                                Что, по Вашему мнению, можно улучшить в работе школы?
                            </h2>
                        </div>

                        <div className={styles.fieldStack}>
                            <label className={styles.fieldLabel} htmlFor="improvement">
                                Комментарий
                            </label>
                            <textarea
                                className={styles.textArea}
                                id="improvement"
                                name="improvement"
                                placeholder="Что стоит изменить, добавить или усилить?"
                                value={formData.improvement}
                                onChange={(event) => updateField("improvement", event.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                    </section>

                    <section
                        className={styles.card}
                        style={{ "--reveal-delay": "530ms" }}
                    >
                        <h2 className={styles.sectionTitle}>ФИО ребенка</h2>

                        <div
                            className={`${styles.collapsible} ${!formData.anonymous ? styles.collapsibleOpen : ""}`}
                        >
                            <div className={styles.collapsibleInner}>
                                <div className={styles.fieldStack}>
                                    <label className={styles.fieldLabel} htmlFor="childName">
                                        ФИО ребенка
                                    </label>
                                    <input
                                        className={styles.textInput}
                                        id="childName"
                                        name="childName"
                                        type="text"
                                        placeholder="Например, Иванов Артем Сергеевич"
                                        value={formData.childName}
                                        onChange={(event) => updateField("childName", event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <label
                            className={`${styles.anonymousToggle} ${
                                formData.anonymous ? styles.anonymousToggleActive : ""
                            }`}
                            htmlFor="anonymous"
                        >
                            <input
                                className={styles.checkboxInput}
                                id="anonymous"
                                name="anonymous"
                                type="checkbox"
                                checked={formData.anonymous}
                                onChange={(event) => handleAnonymousChange(event.target.checked)}
                            />
                            <span className={styles.checkboxMark} aria-hidden="true" />
                            <span className={styles.anonymousText}>Оставить отзыв анонимно</span>
                        </label>
                    </section>

                    <div
                        className={styles.footer}
                        style={{ "--reveal-delay": "600ms" }}
                    >
                        <button
                            className={styles.submitButton}
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? "Отправляем отзыв..." : "Отправить отзыв"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default FeedbackForm;
