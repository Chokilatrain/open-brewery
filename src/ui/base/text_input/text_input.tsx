import React, { useState, useRef, useEffect } from "react";
import { Menu } from "@/ui/base/menu/menu";
import { MenuItem } from "@/ui/base/menu/menu_item";
import styles from './text_input.module.css';

export interface SuggestionItem {
  id: string;
  name: string;
}

export const TextInput = ({
  placeholder = "Search",
  value = "",
  onChange = () => {},
  suggestions = [],
  onEnter,
  onSuggestionClick,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  suggestions?: SuggestionItem[];
  onEnter?: () => void;
  onSuggestionClick?: (suggestion: SuggestionItem) => void;
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (val: string) => {
    onChange(val);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onChange(suggestion.name);
    }
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };
  
  const menuItems = suggestions.map((suggestion) => ({ 
    label: suggestion.name, 
    onClick: () => { handleSuggestionClick(suggestion) } 
  }));

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && suggestions.length > 0 && (
        <Menu 
          menuItems={menuItems}
          renderItem={
            (item) => <MenuItem label={item.label} onClick={item.onClick} icon={item.icon} key={item.label} />
          }
          className={styles.menu}
        />
      )}
    </div>
  );
};


/**
<ul
className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 max-h-48 overflow-y-auto shadow-lg"
style={{ listStyle: "none", margin: 0, padding: 0 }}
>
{suggestions.map((suggestion, idx) => (
  <li
    key={idx}
    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
    onMouseDown={() => handleSuggestionClick(suggestion)}
  >
    {suggestion}
  </li>
))}
</ul>
 */
