/**
 * Container Component
 * Provides consistent max-width and padding across pages
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export function Container({ 
  size = 'xl', 
  className, 
  children,
  ...props 
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-6',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
