import React, { useState } from "react";

const SORT_FIELDS = [
  { value: "name", label: "Name" },
  { value: "type", label: "Type" },
  { value: "city", label: "City" },
];

const SortPanel = ({ onSortChange }: { sort: string; onSortChange: (sort: string) => void }) => {
  const [field, setField] = useState("name");
  const [direction, setDirection] = useState("asc");

  const handleApply = () => {
    // For now, just support one field and direction
    onSortChange(`${field}:${direction}`);
  };

  return (
    <div className={`flex flex-row items-center gap-2 mb-4`}>
      <label className="font-semibold">Sort by:</label>
      <select
        value={field}
        onChange={e => setField(e.target.value)}
        className="border-2 border-gray-300 rounded-md p-2"
      >
        {SORT_FIELDS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
      <select
        value={direction}
        onChange={e => setDirection(e.target.value)}
        className="border-2 border-gray-300 rounded-md p-2"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button
        onClick={handleApply}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
};

export default SortPanel; 