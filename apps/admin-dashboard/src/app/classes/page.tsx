'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClassesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
            <p className="text-sm text-gray-600 mt-1">Manage fitness classes and categories</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Classes management module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include class CRUD, grid/list view, and category management</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
