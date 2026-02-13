/**
 * Profile Page
 * User profile information display
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container size="lg" className="py-8 space-y-8">
      <PageHeader
        title="Profile"
        description="View your account information"
      />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Full Name
              </label>
              <p className="mt-1.5 text-sm text-zinc-900">{user.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Email Address
              </label>
              <p className="mt-1.5 text-sm text-zinc-900">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Role</label>
              <div className="mt-1.5">
                <Badge variant="default">{user.role}</Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                User ID
              </label>
              <p className="mt-1.5 text-xs text-zinc-500 font-mono">{user.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Member Since
              </label>
              <p className="mt-1.5 text-sm text-zinc-900">
                {formatDateTime(user.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Last Updated
              </label>
              <p className="mt-1.5 text-sm text-zinc-900">
                {formatDateTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
