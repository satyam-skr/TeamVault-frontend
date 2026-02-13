/**
 * Admin Dashboard Page
 * Admin overview with statistics
 */

'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { taskService } from '@/services/task.service';
import { userService } from '@/services/user.service';
import type { TaskStats, UserStats } from '@/types/api';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskStatsRes, userStatsRes] = await Promise.all([
          taskService.getTaskStats(),
          userService.getUserStats(),
        ]);
        setTaskStats(taskStatsRes.data);
        setUserStats(userStatsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container size="xl" className="py-8 space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide statistics and management"
      />

      {/* User Stats */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">User Statistics</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {userStats?.totalUsers || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {userStats?.adminCount || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Regular Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {userStats?.userCount || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Task Stats */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Task Statistics</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {taskStats?.total || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  To Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {taskStats?.todo || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {taskStats?.inProgress || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-zinc-900">
                  {taskStats?.done || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
}
