/**
 * Edit Task Modal
 * Modal for editing existing tasks
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { taskService } from '@/services/task.service';
import { updateTaskSchema, type UpdateTaskFormData } from '@/lib/validations';
import { TaskStatus, type Task } from '@/types/api';
import { toast } from 'sonner';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSuccess,
}: EditTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });

  const onSubmit = async (data: UpdateTaskFormData) => {
    setIsLoading(true);
    try {
      await taskService.updateTask(task.id, data);
      toast.success('Task updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      description="Update task details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Title
          </label>
          <Input
            placeholder="Enter task title"
            error={errors.title?.message}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Description
          </label>
          <Textarea
            placeholder="Enter task description"
            error={errors.description?.message}
            rows={4}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Status
          </label>
          <Select {...register('status')}>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
