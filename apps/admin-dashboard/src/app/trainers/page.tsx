'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TrainersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
            <p className="text-sm text-gray-600 mt-1">Manage trainers and their performance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Trainer
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Trainers management module - To be implemented</p>
          <p className="text-sm text-gray-500 mt-2">Will include trainer profiles, performance metrics, certifications, and availability</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
