/**
 * Settings Page
 * User settings and preferences
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container size="lg" className="py-8 space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <p className="mt-1 text-sm text-zinc-900">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <p className="mt-1 text-sm text-zinc-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Role</label>
                <div className="mt-1">
                  <Badge variant="default">{user.role}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">User ID</label>
                <p className="mt-1 text-xs text-zinc-500 font-mono">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Email Notifications</p>
                  <p className="text-sm text-zinc-500">Receive email updates about your tasks</p>
                </div>
                <div className="text-sm text-zinc-500">Coming soon</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Task Reminders</p>
                  <p className="text-sm text-zinc-500">Get reminded about upcoming deadlines</p>
                </div>
                <div className="text-sm text-zinc-500">Coming soon</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Password</p>
                  <p className="text-sm text-zinc-500">Change your password</p>
                </div>
                <div className="text-sm text-zinc-500">Coming soon</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Two-Factor Authentication</p>
                  <p className="text-sm text-zinc-500">Add an extra layer of security</p>
                </div>
                <div className="text-sm text-zinc-500">Coming soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
