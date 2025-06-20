import React from "react";

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
  <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full mb-4 ${className}`}>
    <input
      type="text"
      placeholder="Filter by name"
      value={name}
      onChange={e => onNameChange(e.target.value)}
      className="bg-gray-900 text-white border-2 border-gray-700 rounded-md p-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
    />
    <input
      type="text"
      placeholder="Filter by city"
      value={city}
      onChange={e => onCityChange(e.target.value)}
      className="bg-gray-900 text-white border-2 border-gray-700 rounded-md p-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
    />
    <button
      onClick={onGo}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Go
    </button>
  </div>
);

export default FilterPanel; 