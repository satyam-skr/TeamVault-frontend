/**
 * Task List Page
 * Main task management interface
 */

'use client';

import { useEffect, useState } from 'react';
import { taskService } from '@/services/task.service';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { EditTaskModal } from '@/components/tasks/edit-task-modal';
import { DeleteTaskModal } from '@/components/tasks/delete-task-modal';
import type { Task, TaskStatus } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    setIsCreateModalOpen(false);
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    setDeletingTask(null);
    fetchTasks();
  };

  const getStatusVariant = (status: TaskStatus) => {
    const statusMap: Record<TaskStatus, 'todo' | 'in-progress' | 'done'> = {
      TODO: 'todo',
      IN_PROGRESS: 'in-progress',
      DONE: 'done',
    };
    return statusMap[status];
  };

  const formatStatus = (status: TaskStatus) => {
    return status.replace('_', ' ');
  };

  if (isLoading) {
    return (
      <Container size="xl" className="py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 space-y-8">
      <PageHeader
        title="Tasks"
        description="Manage and organize your tasks"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Task
          </Button>
        }
      />

      {tasks.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            title="No tasks yet"
            description="Get started by creating your first task"
            action={
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Task
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {task.title}
                    </h3>
                    <Badge variant={getStatusVariant(task.status)}>
                      {formatStatus(task.status)}
                    </Badge>
                  </div>
                  <p className="text-zinc-600 mb-4">{task.description}</p>
                  <p className="text-xs text-zinc-400">
                    Created {formatDate(task.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingTask(task)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTaskCreated}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={handleTaskUpdated}
        />
      )}

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onSuccess={handleTaskDeleted}
        />
      )}
    </Container>
  );
}
