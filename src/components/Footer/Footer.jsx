import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Подвал сайта KiberKod — юридическая информация">
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.company}>ООО «КиберКод»</div>
          <div className={styles.unp}>УНП <span className={styles.unpValue}>291782627</span></div>
        </div>

        <address className={styles.address}>
          <div>Юридический адрес:</div>
          <div>РБ, 224030, г. Брест, ул. Советская, д. 85-1, пом. 1-60.</div>
        </address>
      </div>
{/* 
      <div className={styles.bottom}>
        <small>© {new Date().getFullYear()} ООО «КиберКод». Все права защищены.</small>
      </div> */}
      
    </footer>
  );
};

export default Footer;
