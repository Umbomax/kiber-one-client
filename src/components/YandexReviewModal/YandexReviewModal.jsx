import React from "react";
import styles from "./YandexReviewModal.module.css";

const yandexWidgets = {
    Брест: {
        "ТЦ Миллионный": {
            widget: "208082974578",
            link: "https://yandex.by/maps/org/kiberone/208082974578/",
            text: "KIBERone на карте Бреста — Яндекс Карты",
        },
        "БЦ IQ": {
            widget: "239997963075",
            link: "https://yandex.by/maps/org/kiberone/239997963075/",
            text: "KIBERone в БЦ IQ — Яндекс Карты",
        },
    },
    Гродно: {
        "17 Сентября 49а": {
            widget: "226607218851",
            link: "https://yandex.by/maps/org/kiberone/226607218851/",
            text: "KIBERone 17 Сентября — Яндекс Карты",
        },
        "Титова 14": {
            widget: "244432454586",
            link: "https://yandex.by/maps/org/kiberone/244432454586/",
            text: "KIBERone Титова — Яндекс Карты",
        },
    },
    Бобруйск: {
        widget: "78434256316",
        link: "https://yandex.by/maps/org/kiberone/78434256316/",
        text: "KIBERone на карте Бобруйска — Яндекс Карты",
    },
    Витебск: {
        widget: "78434322222",
        link: "https://yandex.by/maps/org/kiberone/78434322222/",
        text: "KIBERone на карте Витебска — Яндекс Карты",
    },
    Лида: {
        widget: "78434333333",
        link: "https://yandex.by/maps/org/kiberone/78434333333/",
        text: "KIBERone на карте Лиды — Яндекс Карты",
    },
    Могилев: {
        widget: "142977241228",
        link: "https://yandex.by/maps/org/kiberone/142977241228/",
        text: "KIBERone на карте Могилева — Яндекс Карты",
    },
    Пинск: {
        widget: "205379812619",
        link: "https://yandex.by/maps/org/kiberone/205379812619/",
        text: "KIBERone на карте Пинска — Яндекс Карты",
    },
};

const YandexReviewModal = ({ city, location, onClose }) => {
    let data = null;

    if (["Брест", "Гродно"].includes(city) && yandexWidgets[city]?.[location]) {
        data = yandexWidgets[city][location];
    } else if (yandexWidgets[city]) {
        data = yandexWidgets[city];
    }

    if (!data) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.textSection}>
                    <p className={styles.textHeader}>Спасибо Вам за то, что нашли время для обратной связи 🙏</p>
                    <p>
                        Пожалуйста, оставьте отзыв о нашей школе на Яндекс Картах. Ваше мнение важно для нас и поможет другим сделать правильный выбор.
                        <br />
                        Спасибо за Вашу поддержку 💛
                    </p>
                </div>

                <div className={styles.widgetContainer}>
                    <iframe
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "1px solid #e6e6e6",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                        }}
                        src={`https://yandex.ru/maps-reviews-widget/${data.widget}?comments`}
                        title="Отзывы Яндекс"
                    />
                    <a href={data.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {data.text}
                    </a>
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default YandexReviewModal;
