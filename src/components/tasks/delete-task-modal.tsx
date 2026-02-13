/**
 * Delete Task Modal
 * Confirmation modal for task deletion
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { taskService } from '@/services/task.service';
import type { Task } from '@/types/api';
import { toast } from 'sonner';

interface DeleteTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteTaskModal({
  task,
  isOpen,
  onClose,
  onSuccess,
}: DeleteTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await taskService.deleteTask(task.id);
      toast.success('Task deleted successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      description="This action cannot be undone"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-600">
          Are you sure you want to delete{' '}
          <span className="font-medium text-zinc-900">{task.title}</span>?
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={isLoading}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
