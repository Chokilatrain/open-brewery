import React, { useState, useEffect } from "react";
import styles from './sort_panel.module.css';

const SORT_FIELDS = [
  { value: "name", label: "Name" },
  { value: "type", label: "Type" },
  { value: "city", label: "City" },
];

const SortPanel = ({ sort, onSortChange, disabled = false }: { sort: string; onSortChange: (sort: string) => void; disabled?: boolean }) => {
  const [field, setField] = useState("name");
  const [direction, setDirection] = useState("asc");

  // Parse the current sort value and update internal state
  useEffect(() => {
    if (sort) {
      const [currentField, currentDirection] = sort.split(":");
      if (currentField && currentDirection) {
        setField(currentField);
        setDirection(currentDirection);
      }
    }
  }, [sort]);

  const handleApply = () => {
    if (disabled) return;
    // For now, just support one field and direction
    onSortChange(`${field}:${direction}`);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Sort by:</label>
      <select
        value={field}
        onChange={e => setField(e.target.value)}
        className={styles.select}
        disabled={disabled}
      >
        {SORT_FIELDS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
      <select
        value={direction}
        onChange={e => setDirection(e.target.value)}
        className={styles.select}
        disabled={disabled}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button
        onClick={handleApply}
        className={styles.button}
        disabled={disabled}
      >
        Apply
      </button>
    </div>
  );
};

export default SortPanel; 