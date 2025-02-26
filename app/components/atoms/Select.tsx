'use client';

import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: {
    value: string | number;
    label: string;
  }[];
}

export function Select({
  label,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        className={`rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 