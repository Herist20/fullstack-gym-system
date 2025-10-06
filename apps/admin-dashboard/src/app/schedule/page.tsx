'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  checkScheduleConflict,
} from '@/lib/api/schedule.api';
import { fetchClasses } from '@/lib/api/classes.api';
import { fetchTrainersForClasses } from '@/lib/api/classes.api';
import { Schedule } from '@/lib/types';

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [conflictError, setConflictError] = useState<string>('');
  const [formData, setFormData] = useState({
    class_id: '',
    trainer_id: '',
    start_time: '',
    end_time: '',
    max_capacity: 20,
    status: 'scheduled',
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => fetchSchedules(),
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  const { data: trainers } = useQuery({
    queryKey: ['trainers-list'],
    queryFn: fetchTrainersForClasses,
  });

  const createMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Schedule> }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const resetForm = () => {
    setFormData({
      class_id: '',
      trainer_id: '',
      start_time: '',
      end_time: '',
      max_capacity: 20,
      status: 'scheduled',
    });
    setConflictError('');
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      class_id: schedule.class_id,
      trainer_id: schedule.trainer?.id || '',
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      max_capacity: schedule.max_capacity || 20,
      status: schedule.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');

    // Check for conflicts
    const hasConflict = await checkScheduleConflict(
      formData.trainer_id,
      formData.start_time,
      formData.end_time
    );

    if (hasConflict) {
      setConflictError('Trainer has a conflicting schedule at this time.');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');

    if (selectedSchedule) {
      // Check for conflicts (excluding current schedule)
      const hasConflict = await checkScheduleConflict(
        formData.trainer_id,
        formData.start_time,
        formData.end_time,
        selectedSchedule.id
      );

      if (hasConflict) {
        setConflictError('Trainer has a conflicting schedule at this time.');
        return;
      }

      updateMutation.mutate({ id: selectedSchedule.id, data: formData });
    }
  };

  const handleClassChange = (classId: string) => {
    const selectedClass = classes?.find((c) => c.id === classId);
    if (selectedClass) {
      setFormData({
        ...formData,
        class_id: classId,
        trainer_id: selectedClass.trainer_id || '',
        max_capacity: selectedClass.capacity,
      });
    }
  };

  const columns = [
    {
      key: 'class',
      label: 'Class',
      render: (schedule: Schedule) => (
        <div>
          <div className="font-medium text-gray-900">
            {schedule.class?.name || 'Unknown'}
          </div>
          <div className="text-xs text-gray-500">
            Duration: {schedule.class?.duration_minutes} min
          </div>
        </div>
      ),
    },
    {
      key: 'trainer',
      label: 'Trainer',
      render: (schedule: Schedule) => (
        <span className="text-sm text-gray-600">
          {schedule.trainer?.full_name || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'datetime',
      label: 'Date & Time',
      render: (schedule: Schedule) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-900">
            <Calendar className="h-4 w-4" />
            {new Date(schedule.start_time).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <Clock className="h-4 w-4" />
            {new Date(schedule.start_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {new Date(schedule.end_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (schedule: Schedule) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          {schedule.bookings?.length || 0} / {schedule.max_capacity || schedule.class?.capacity}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (schedule: Schedule) => {
        const colors: Record<string, string> = {
          scheduled: 'bg-blue-100 text-blue-800',
          ongoing: 'bg-green-100 text-green-800',
          completed: 'bg-gray-100 text-gray-800',
          cancelled: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={colors[schedule.status] || colors.scheduled}>
            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (schedule: Schedule) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(schedule)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(schedule.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const renderScheduleForm = (onSubmit: (e: React.FormEvent) => void, isPending: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {conflictError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {conflictError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Class *
        </label>
        <select
          required
          value={formData.class_id}
          onChange={(e) => handleClassChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Select Class</option>
          {classes?.map((gymClass) => (
            <option key={gymClass.id} value={gymClass.id}>
              {gymClass.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trainer *
        </label>
        <select
          required
          value={formData.trainer_id}
          onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Select Trainer</option>
          {trainers?.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            required
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.max_capacity}
            onChange={(e) =>
              setFormData({ ...formData, max_capacity: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isAddModalOpen) {
              setIsAddModalOpen(false);
            } else {
              setIsEditModalOpen(false);
              setSelectedSchedule(null);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isAddModalOpen ? 'Add Schedule' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage class schedules and calendar
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <DataTable
          data={schedules || []}
          columns={columns}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Schedule"
      >
        {renderScheduleForm(handleSubmitAdd, createMutation.isPending)}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSchedule(null);
          resetForm();
        }}
        title="Edit Schedule"
      >
        {renderScheduleForm(handleSubmitEdit, updateMutation.isPending)}
      </Modal>
    </DashboardLayout>
  );
}
