/**
 * Login Page
 * Clean, professional login form with enhanced error handling
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Alert } from '@/components/ui/alert';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import type { ApiError } from '@/types/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setFormError(null);

    try {
      await login(data);
    } catch (error) {
      const apiError = error as ApiError;
      
      // Handle field-level errors
      if (apiError.errors && Array.isArray(apiError.errors)) {
        let hasFieldError = false;
        
        apiError.errors.forEach((err) => {
          if (err.field === 'email') {
            setError('email', { message: err.message });
            hasFieldError = true;
          } else if (err.field === 'password') {
            setError('password', { message: err.message });
            hasFieldError = true;
          }
        });
        
        // If no field-specific errors, show general error
        if (!hasFieldError) {
          setFormError(
            apiError.message || 'Invalid email or password. Please try again.'
          );
        }
      } else {
        // Show general error message
        setFormError(
          apiError.message || 'Invalid email or password. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-3 leading-tight">
            Sign in to TeamVault
          </h1>
          <p className="text-base text-zinc-600 leading-relaxed">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
              <Alert variant="error">
                {formError}
              </Alert>
            )}

            <FormField
              label="Email"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormField
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-8"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600 leading-relaxed">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500 leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
