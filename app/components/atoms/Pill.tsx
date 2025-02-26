'use client';

import { ButtonHTMLAttributes } from 'react';

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isSelected?: boolean;
  category?: 'basic' | 'complex';
}

export function Pill({
  label,
  isSelected = false,
  category = 'basic',
  className = '',
  ...props
}: PillProps) {
  const baseStyles = 'rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const categoryStyles = {
    basic: isSelected
      ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
      : 'bg-orange-50 text-orange-700 hover:bg-orange-100 focus:ring-orange-500',
    complex: isSelected
      ? 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500'
      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 focus:ring-purple-500',
  };

  const combinedClasses = `${baseStyles} ${categoryStyles[category]} ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClasses}
      {...props}
    >
      {label}
    </button>
  );
} 