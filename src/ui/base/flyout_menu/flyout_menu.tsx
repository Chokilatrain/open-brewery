"use client";

import { Menu } from "@/ui/base/menu/menu";
import { MenuItem as MenuItemComponent } from "@/ui/base/menu/menu_item";
import { Button } from "@/ui/base/button/button";
import { useState } from "react";
import { MenuItem } from "@/ui/base/menu/types";

export const FlyoutMenu = ({ buttonLabel, menuItems = [] }: { buttonLabel?: string, menuItems: MenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
      setIsOpen(!isOpen);
  }

  return (
    <>
      <Button label={buttonLabel} onClick={handleClick} />
      {isOpen && <Menu menuItems={menuItems} renderItem={(item) => <MenuItemComponent label={item.label} onClick={item.onClick} icon={item.icon} key={item.label} />} />}  
    </>
  )
}




