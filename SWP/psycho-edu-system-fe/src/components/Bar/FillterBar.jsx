import React from "react";
import { FiFilter } from "react-icons/fi";

const Filter = ({
  options,
  value,
  onChange,
  showIcon = true,
  className = "",
}) => {
  return (
    <div className="flex items-center">
      {showIcon && <FiFilter className="mr-2" />}
      <select
        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
