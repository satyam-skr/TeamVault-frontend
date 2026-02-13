/**
 * Alert Component
 * Professional alert for errors and notifications
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'error' | 'warning' | 'success' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm leading-relaxed',
        variants[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
