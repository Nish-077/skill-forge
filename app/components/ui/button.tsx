// @/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  let variantClass = '';

  switch (variant) {
    case 'primary':
      variantClass = 'bg-blue-500 hover:bg-blue-700 text-white';
      break;
    case 'secondary':
      variantClass = 'bg-gray-500 hover:bg-gray-700 text-white';
      break;
    case 'ghost':
      variantClass = 'bg-transparent hover:bg-gray-200 text-gray-800';
      break;
    case 'outline':
      variantClass = 'bg-transparent border border-gray-500 hover:bg-gray-500 text-gray-800 hover:text-white';
      break;
  }

  return (
    <button className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${variantClass}`} {...props}>
      {children}
    </button>
  );
};
