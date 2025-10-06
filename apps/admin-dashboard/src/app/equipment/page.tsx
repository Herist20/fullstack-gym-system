'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Equipment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

async function fetchEquipment(): Promise<Equipment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Equipment[];
}

export default function EquipmentPage() {
  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: fetchEquipment,
  });

  const columns = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'category',
      label: 'Category',
      render: (equipment: Equipment) => (
        <span className="capitalize">{equipment.category.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (equipment: Equipment) => {
        const status = equipment.status;
        const variant =
          status === 'available'
            ? 'success'
            : status === 'maintenance'
            ? 'warning'
            : status === 'broken'
            ? 'danger'
            : 'default';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      key: 'last_maintenance',
      label: 'Last Maintenance',
      render: (equipment: Equipment) => {
        const date = equipment.last_maintenance;
        return date ? formatDate(date) : '-';
      },
    },
    {
      key: 'next_maintenance',
      label: 'Next Due',
      render: (equipment: Equipment) => {
        const date = equipment.next_maintenance;
        return date ? formatDate(date) : '-';
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
            <p className="text-sm text-gray-600 mt-1">Manage gym equipment and maintenance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading equipment...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={equipment || []}
            searchable
            searchPlaceholder="Search equipment..."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
