'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, createMember, updateMember, deleteMember, suspendMember, activateMember } from '@/lib/api/members.api';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Edit, Trash2, Ban, CheckCircle } from 'lucide-react';
import { Member } from '@/lib/types';
import { toast } from 'sonner';
import { formatDate, getInitials } from '@/lib/utils';

export default function MembersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
  });

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member added successfully');
      setShowAddModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add member');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Member> }) =>
      updateMember(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member updated successfully');
      setSelectedMember(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update member');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete member');
    },
  });

  const suspendMutation = useMutation({
    mutationFn: suspendMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member suspended');
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member activated');
    },
  });

  const columns = [
    {
      key: 'full_name',
      label: 'Member',
      render: (member: Member) => {
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium mr-3">
              {getInitials(member.full_name)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{member.full_name}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (member: Member) => member.phone || '-',
    },
    {
      key: 'membership',
      label: 'Membership',
      render: (member: Member) => {
        const membership = member.membership;
        if (!membership || !Array.isArray(membership)) return '-';
        const activeMembership = membership.find((m: any) => m.status === 'active');
        return activeMembership ? (
          <span className="capitalize">{activeMembership.membership_type}</span>
        ) : '-';
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (member: Member) => {
        const membership = member.membership;
        const status = Array.isArray(membership) && membership.find((m: any) => m.status === 'active')
          ? 'active'
          : 'inactive';
        return (
          <Badge variant={status === 'active' ? 'success' : 'default'}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Join Date',
      render: (member: Member) => formatDate(member.created_at),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (member: Member) => {
        const isActive = Array.isArray(member.membership) && member.membership.some((m: any) => m.status === 'active');

        return (
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(showActionsMenu === member.id ? null : member.id)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showActionsMenu === member.id && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowActionsMenu(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (isActive) {
                        suspendMutation.mutate(member.id);
                      } else {
                        activateMutation.mutate(member.id);
                      }
                      setShowActionsMenu(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {isActive ? (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this member?')) {
                        deleteMutation.mutate(member.id);
                      }
                      setShowActionsMenu(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-sm text-gray-600 mt-1">Manage gym members and their memberships</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading members...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={members || []}
            searchable
            searchPlaceholder="Search members..."
          />
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data: any) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Member Modal */}
      {selectedMember && (
        <EditMemberModal
          isOpen={!!selectedMember}
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSubmit={(updates: any) => updateMutation.mutate({ id: selectedMember.id, updates })}
          isLoading={updateMutation.isPending}
        />
      )}
    </DashboardLayout>
  );
}

function AddMemberModal({ isOpen, onClose, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EditMemberModal({ isOpen, member, onClose, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState({
    full_name: member.full_name,
    phone: member.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
