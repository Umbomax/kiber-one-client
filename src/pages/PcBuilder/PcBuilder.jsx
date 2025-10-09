
import React from "react";
import Header from "../../components/Header/Header";
import PcBuilder from "../../components/PcBuilder/PcBuilder";
import styles from "./PcBuilderPage.module.css";

const PcBuilderPage = () => {
  return (
    <div className={styles.page}>
      <Header />
      <PcBuilder />
    </div>
  );
};

export default PcBuilderPage;
