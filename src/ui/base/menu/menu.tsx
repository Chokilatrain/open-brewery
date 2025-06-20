import type { MenuItem } from "./types";

export const Menu = ({ menuItems = [], renderItem = (item: MenuItem) => <span role="menuitem" onMouseDown={() => item.onClick()}>{item.label}</span> }: { menuItems?: MenuItem[], renderItem?: (item: MenuItem) => React.ReactNode }) => {
    return (
      <ul
        role="menu"
        className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 max-h-48 overflow-y-auto shadow-lg"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
        
      >
        {menuItems.map(renderItem)}
      </ul>
    )
};

