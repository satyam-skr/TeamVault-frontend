/**
 * FormField Component
 * Combines label, input, and error message
 */

import React from 'react';
import { Input, type InputProps } from './input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', className)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 leading-relaxed"
        >
          {label}
        </label>
        <Input id={inputId} ref={ref} error={error} {...props} />
        {error && (
          <p className="text-sm text-red-600 leading-relaxed" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-zinc-500 leading-relaxed">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
