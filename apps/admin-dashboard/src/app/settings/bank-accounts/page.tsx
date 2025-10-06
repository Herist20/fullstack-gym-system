'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

async function fetchBankAccounts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('gym_settings')
    .select('value')
    .eq('key', 'bank_accounts')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data?.value || {};
}

async function saveBankAccounts(accounts: Record<string, any>) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('gym_settings')
    .select('*')
    .eq('key', 'bank_accounts')
    .single();

  if (existing) {
    const { error } = await supabase
      .from('gym_settings')
      .update({
        value: accounts,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'bank_accounts');

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('gym_settings')
      .insert({
        key: 'bank_accounts',
        value: accounts,
        description: 'Bank accounts for manual payment transfers',
      });

    if (error) throw error;
  }
}

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<Record<string, BankAccount>>({});
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: fetchBankAccounts,
    onSuccess: (data) => {
      setAccounts(data);
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveBankAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast.success('Bank accounts saved successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save bank accounts');
    },
  });

  const handleAddAccount = () => {
    const newKey = `bank_${Date.now()}`;
    setAccounts({
      ...accounts,
      [newKey]: {
        bank: '',
        accountNumber: '',
        accountName: '',
      },
    });
    setIsEditing(true);
  };

  const handleUpdateAccount = (key: string, field: keyof BankAccount, value: string) => {
    setAccounts({
      ...accounts,
      [key]: {
        ...accounts[key],
        [field]: value,
      },
    });
  };

  const handleDeleteAccount = (key: string) => {
    const newAccounts = { ...accounts };
    delete newAccounts[key];
    setAccounts(newAccounts);
  };

  const handleSave = () => {
    // Validate all accounts have required fields
    const valid = Object.values(accounts).every(
      (acc) => acc.bank && acc.accountNumber && acc.accountName
    );

    if (!valid) {
      toast.error('Please fill in all bank account fields');
      return;
    }

    saveMutation.mutate(accounts);
  };

  const bankOptions = [
    'BCA',
    'BNI',
    'BRI',
    'Mandiri',
    'CIMB Niaga',
    'Permata',
    'Danamon',
    'BTN',
    'Other',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bank Account Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure bank accounts for manual payment transfers
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleAddAccount}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading bank accounts...</p>
          </Card>
        ) : Object.keys(accounts).length === 0 ? (
          <Card className="p-12 text-center">
            <Banknote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Bank Accounts Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first bank account to start accepting manual payments
            </p>
            <Button onClick={handleAddAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(accounts).map(([key, account]) => (
              <Card key={key} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-orange-600" />
                      Bank Account
                    </h3>
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteAccount(key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    {isEditing ? (
                      <select
                        value={account.bank}
                        onChange={(e) => handleUpdateAccount(key, 'bank', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Bank</option>
                        {bankOptions.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{account.bank}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={account.accountNumber}
                        onChange={(e) =>
                          handleUpdateAccount(key, 'accountNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                        placeholder="1234567890"
                      />
                    ) : (
                      <p className="text-xl font-bold text-gray-900 font-mono">
                        {account.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={account.accountName}
                        onChange={(e) =>
                          handleUpdateAccount(key, 'accountName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Gym System Indonesia"
                      />
                    ) : (
                      <p className="text-gray-900">{account.accountName}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 How Manual Payments Work
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Users will see these bank accounts when making payments</li>
            <li>They transfer to one of these accounts</li>
            <li>They upload payment proof in their dashboard</li>
            <li>You confirm payments in the Manual Payments page</li>
            <li>Membership is automatically activated after confirmation</li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
}
