/**
 * Input Component
 * Clean, accessible input field
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-sm leading-tight',
          'placeholder:text-zinc-400',
          'transition-colors duration-200',
          'hover:border-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50',
          error && 'border-red-300 focus:ring-red-400 focus:border-red-400',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
