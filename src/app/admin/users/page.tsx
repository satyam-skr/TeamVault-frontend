/**
 * User Management Page
 * Admin-only page for managing users
 */

'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { userService } from '@/services/user.service';
import { DeleteUserModal } from '@/components/admin/delete-user-modal';
import type { User } from '@/types/api';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserDeleted = () => {
    setDeletingUser(null);
    fetchUsers();
  };

  if (isLoading) {
    return (
      <Container size="xl" className="py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 space-y-8">
      <PageHeader
        title="User Management"
        description="Manage all users in the system"
      />

      {users.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="No users found"
            description="There are no users in the system"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {user.name}
                      </h3>
                      <Badge variant="default">{user.role}</Badge>
                    </div>
                    <p className="text-sm text-zinc-600 mb-3">{user.email}</p>
                    <div className="flex items-center gap-6 text-sm text-zinc-500">
                      <div>
                        <span className="font-medium">Created:</span> {formatDateTime(user.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">ID:</span> <span className="font-mono text-xs">{user.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id);
                        toast.success('User ID copied');
                      }}
                    >
                      Copy ID
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingUser(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onSuccess={handleUserDeleted}
        />
      )}
    </Container>
  );
}
