import React from "react";
import styles from './spinner.module.css';

export const Spinner = () => (
  <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className={styles.circle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className={styles.path} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
); 