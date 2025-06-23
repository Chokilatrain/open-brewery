import React from "react";
import styles from './filter_panel.module.css';

interface FilterPanelProps {
  name: string;
  city: string;
  onNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onGo: () => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  name,
  city,
  onNameChange,
  onCityChange,
  onGo,
  className = "",
}) => (
  <div className={`${styles.container} ${className}`}>
    <input
      type="text"
      placeholder="Filter by name"
      value={name}
      onChange={e => onNameChange(e.target.value)}
      className={styles.input}
    />
    <input
      type="text"
      placeholder="Filter by city"
      value={city}
      onChange={e => onCityChange(e.target.value)}
      className={styles.input}
    />
    <button
      onClick={onGo}
      className={styles.button}
    >
      Go
    </button>
  </div>
);

export default FilterPanel; 