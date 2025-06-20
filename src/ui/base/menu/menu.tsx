import type { MenuItem } from "./types";
import React from "react";

export const Menu = ({ menuItems = [], renderItem = (item: MenuItem) => <span role="menuitem" onMouseDown={() => item.onClick()}>{item.label}</span>, className = "" }: { menuItems?: MenuItem[], renderItem?: (item: MenuItem) => React.ReactNode, className?: string }) => {
    return (
      <ul
        role="menu"
        className={`absolute left-0 right-0 border border-gray-300 rounded-md mt-1 z-10 max-h-48 overflow-y-auto shadow-lg ${className}`}
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {menuItems.map(renderItem)}
      </ul>
    )
};

