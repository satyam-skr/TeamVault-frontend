/**
 * Dashboard Home Page
 * Overview with stats and recent tasks
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { taskService } from '@/services/task.service';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { Task, TaskStats } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          taskService.getTaskStats(),
          taskService.getTasks(),
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data.slice(0, 5)); // Show only 5 recent tasks
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'todo';
      case TaskStatus.IN_PROGRESS:
        return 'in-progress';
      case TaskStatus.DONE:
        return 'done';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: TaskStatus) => {
    return status.replace('_', ' ');
  };

  return (
    <Container size="xl" className="py-8 space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name}`}
        description="Here's what's happening with your tasks today"
      />

      {/* Stats Grid */}
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
                {stats?.total || 0}
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
                {stats?.todo || 0}
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
                {stats?.inProgress || 0}
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
                {stats?.done || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recent Tasks</CardTitle>
          <Link href="/dashboard/tasks">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-4">No tasks yet</p>
              <Link href="/dashboard/tasks">
                <Button>Create your first task</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-zinc-900">
                        {task.title}
                      </h3>
                      <Badge variant={getStatusVariant(task.status)}>
                        {formatStatus(task.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {task.description.substring(0, 100)}
                      {task.description.length > 100 && '...'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
