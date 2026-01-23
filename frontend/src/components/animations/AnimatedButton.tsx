import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition-colors flex items-center gap-2 justify-center';
    
    const variantStyles = {
      primary: 'bg-blue-800 hover:bg-blue-900 text-white disabled:bg-blue-600 shadow-md',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-100',
      danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
      success: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(Object.fromEntries(Object.entries(props).filter(([key]) => !key.startsWith('on'))) as any)}
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⏳
            </motion.span>
            Loading...
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
