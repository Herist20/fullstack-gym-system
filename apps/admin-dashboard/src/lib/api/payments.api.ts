import { createClient } from '@/lib/supabase/client';
import { PaymentTransaction } from '@/lib/types';

export async function fetchPayments(): Promise<PaymentTransaction[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      user:users(id, full_name, email),
      membership:memberships(id, plan_id, start_date, end_date)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PaymentTransaction[];
}

export async function fetchPaymentById(id: string): Promise<PaymentTransaction> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      user:users(id, full_name, email, phone),
      membership:memberships(
        id,
        plan_id,
        start_date,
        end_date,
        plan:membership_plans(name, price)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PaymentTransaction;
}

export async function createPayment(paymentData: {
  user_id: string;
  membership_id?: string;
  amount: number;
  payment_method: string;
  status?: string;
  transaction_id?: string;
  metadata?: any;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .insert({
      ...paymentData,
      status: paymentData.status || 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(
  id: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  metadata?: any
) {
  const supabase = createClient();

  const updates: any = { status };
  if (metadata) {
    updates.metadata = metadata;
  }

  const { data, error } = await supabase
    .from('payment_transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function refundPayment(id: string, reason?: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .update({
      status: 'refunded',
      metadata: { refund_reason: reason, refunded_at: new Date().toISOString() },
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPaymentStats() {
  const supabase = createClient();

  // Total revenue
  const { data: allPayments } = await supabase
    .from('payment_transactions')
    .select('amount, status, created_at')
    .eq('status', 'completed');

  const totalRevenue = allPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Revenue this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const revenueThisMonth =
    allPayments
      ?.filter((p) => new Date(p.created_at) >= startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  // Pending payments
  const { count: pendingCount } = await supabase
    .from('payment_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Failed payments
  const { count: failedCount } = await supabase
    .from('payment_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  return {
    totalRevenue,
    revenueThisMonth,
    pendingPayments: pendingCount || 0,
    failedPayments: failedCount || 0,
  };
}

export async function fetchRevenueByMonth(months: number = 12) {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', startDate.toISOString())
    .order('created_at');

  if (error) throw error;

  // Group by month
  const revenueByMonth: { [key: string]: number } = {};

  data?.forEach((payment) => {
    const date = new Date(payment.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + payment.amount;
  });

  return Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function fetchPaymentsByMethod() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('payment_method, amount')
    .eq('status', 'completed');

  if (error) throw error;

  const methodStats: { [key: string]: { count: number; total: number } } = {};

  data?.forEach((payment) => {
    const method = payment.payment_method || 'unknown';
    if (!methodStats[method]) {
      methodStats[method] = { count: 0, total: 0 };
    }
    methodStats[method].count++;
    methodStats[method].total += payment.amount;
  });

  return Object.entries(methodStats).map(([method, stats]) => ({
    method,
    count: stats.count,
    total: stats.total,
  }));
}

export async function generateInvoice(paymentId: string) {
  // This would typically integrate with a PDF generation service
  // For now, we'll just return the payment data formatted for an invoice
  const payment = await fetchPaymentById(paymentId);

  return {
    invoiceNumber: `INV-${payment.id.slice(0, 8).toUpperCase()}`,
    date: payment.created_at,
    payment,
  };
}
