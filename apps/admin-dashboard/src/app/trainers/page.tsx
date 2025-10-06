'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Award, UserCheck, UserX } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  toggleTrainerStatus,
  addCertification,
  deleteCertification,
} from '@/lib/api/trainers.api';
import { Trainer } from '@/lib/types';

export default function TrainersPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
    specialization: '',
    bio: '',
  });
  const [certData, setCertData] = useState({
    name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
  });

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: fetchTrainers,
  });

  const createMutation = useMutation({
    mutationFn: createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trainer> }) =>
      updateTrainer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsEditModalOpen(false);
      setSelectedTrainer(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleTrainerStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });

  const addCertMutation = useMutation({
    mutationFn: addCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsCertModalOpen(false);
      setSelectedTrainer(null);
      setCertData({ name: '', issuing_organization: '', issue_date: '', expiry_date: '' });
    },
  });

  const deleteCertMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
    },
  });

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      password: '',
      specialization: '',
      bio: '',
    });
  };

  const handleEdit = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setFormData({
      email: trainer.email || '',
      full_name: trainer.full_name,
      phone: trainer.phone || '',
      password: '',
      specialization: '',
      bio: '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (trainer: Trainer) => {
    const newStatus = !trainer.admin_profile?.is_active;
    toggleStatusMutation.mutate({ id: trainer.id, isActive: newStatus });
  };

  const handleManageCerts = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsCertModalOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Trainer',
      render: (trainer: Trainer) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-semibold">
              {trainer.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{trainer.full_name}</div>
            <div className="text-xs text-gray-500">{trainer.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (trainer: Trainer) => (
        <span className="text-sm text-gray-600">{trainer.phone || '-'}</span>
      ),
    },
    {
      key: 'certifications',
      label: 'Certifications',
      render: (trainer: Trainer) => (
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-orange-600" />
          <span className="text-sm text-gray-900">
            {trainer.certifications?.length || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (trainer: Trainer) => {
        const isActive = trainer.admin_profile?.is_active !== false;
        return (
          <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (trainer: Trainer) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleManageCerts(trainer)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Manage Certifications"
          >
            <Award className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleToggleStatus(trainer)}
            className="p-1 hover:bg-gray-100 rounded"
            title={trainer.admin_profile?.is_active ? 'Deactivate' : 'Activate'}
          >
            {trainer.admin_profile?.is_active !== false ? (
              <UserX className="h-4 w-4 text-orange-600" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-600" />
            )}
          </button>
          <button
            onClick={() => handleEdit(trainer)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(trainer.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage trainers and their certifications
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trainer
          </Button>
        </div>

        <DataTable
          data={trainers || []}
          columns={columns}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search trainers..."
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Trainer"
      >
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Trainer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTrainer(null);
          resetForm();
        }}
        title="Edit Trainer"
      >
        <form onSubmit={(e) => { e.preventDefault(); if (selectedTrainer) updateMutation.mutate({ id: selectedTrainer.id, data: formData }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedTrainer(null); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Certifications Modal */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setSelectedTrainer(null);
        }}
        title={`Certifications - ${selectedTrainer?.full_name}`}
      >
        <div className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); if (selectedTrainer) addCertMutation.mutate({ trainer_id: selectedTrainer.id, ...certData }); }} className="space-y-3 pb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label>
              <input
                type="text"
                required
                value={certData.name}
                onChange={(e) => setCertData({ ...certData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={certData.issuing_organization}
                  onChange={(e) => setCertData({ ...certData, issuing_organization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={certData.issue_date}
                  onChange={(e) => setCertData({ ...certData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button type="submit" disabled={addCertMutation.isPending} className="w-full">
              {addCertMutation.isPending ? 'Adding...' : 'Add Certificate'}
            </Button>
          </form>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Current Certifications</h4>
            {selectedTrainer?.certifications && selectedTrainer.certifications.length > 0 ? (
              selectedTrainer.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{cert.name}</div>
                    <div className="text-xs text-gray-500">{cert.issuing_organization}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this certification?')) deleteCertMutation.mutate(cert.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No certifications added yet</p>
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
