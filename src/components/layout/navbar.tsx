/**
 * Navbar Component
 * Clean top navigation with user menu
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-white text-sm font-medium">
            TV
          </div>
          <span className="text-lg font-semibold text-zinc-900">TeamVault</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-900">{user.name}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-100 text-sm font-medium text-zinc-700">
              {getInitials(user.name)}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
