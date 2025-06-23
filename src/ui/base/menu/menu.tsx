import type { MenuItem } from "./types";
import React from "react";
import styles from './menu.module.css';

export const Menu = ({ menuItems = [], renderItem = (item: MenuItem) => <span role="menuitem" onMouseDown={() => item.onClick()}>{item.label}</span>, className = "" }: { menuItems?: MenuItem[], renderItem?: (item: MenuItem) => React.ReactNode, className?: string }) => {
    return (
      <ul
        role="menu"
        className={`${styles.menu} ${className}`}
      >
        {menuItems.map(renderItem)}
      </ul>
    )
};

