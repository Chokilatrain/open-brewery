import React from "react";
import styles from './menu_item.module.css';

export const MenuItem = ({ label, onClick, icon = null }: { label: string, onClick: () => void, icon?: React.ReactNode }) => {
  return (
    <li key={label} role="menuitem" onMouseDown={onClick} className={styles.menuItem}>
      {icon ?? null}
      {label ?? null}
    </li>
  )
}


