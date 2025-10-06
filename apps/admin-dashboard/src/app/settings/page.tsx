'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Building, CreditCard, Mail, Users, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchGymSettings,
  updateSetting,
  fetchMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  fetchEmailTemplates,
} from '@/lib/api/settings.api';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'membership' | 'email' | 'users'>('general');

  const { data: settings } = useQuery({
    queryKey: ['gym-settings'],
    queryFn: fetchGymSettings,
  });

  const { data: plans } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: fetchMembershipPlans,
  });

  const { data: emailTemplates } = useQuery({
    queryKey: ['email-templates'],
    queryFn: fetchEmailTemplates,
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-settings'] });
      alert('Settings saved successfully');
    },
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'membership', label: 'Membership Plans', icon: CreditCard },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'users', label: 'Admin Users', icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure system settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gym Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gym Name
                  </label>
                  <input
                    type="text"
                    defaultValue="My Gym"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="info@mygym.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 234 567 890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Asia/Jakarta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  rows={3}
                  defaultValue="123 Fitness Street, Gym City, GC 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Membership Plans */}
        {activeTab === 'membership' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button>Add New Plan</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans?.map((plan) => (
                <Card key={plan.id} className="p-6">
                  <h4 className="font-semibold text-lg mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /{plan.duration_days} days
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="space-y-2 mb-4">
                    {plan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Plan
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Email Templates */}
        {activeTab === 'email' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
            <div className="space-y-4">
              {emailTemplates?.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Subject: {template.subject}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Variables: {template.variables?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Admin Users */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Admin & Staff Users</h3>
            <p className="text-sm text-gray-600">
              Manage admin and trainer access permissions here.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
