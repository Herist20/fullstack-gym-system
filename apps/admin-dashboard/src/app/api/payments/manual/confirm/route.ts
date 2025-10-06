import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPaymentReceipt } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, notes } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        user:users(full_name, email),
        membership:memberships(*)
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status === 'completed') {
      return NextResponse.json({ error: 'Payment already confirmed' }, { status: 400 });
    }

    // Update payment to completed
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        metadata: {
          ...payment.metadata,
          confirmed_at: new Date().toISOString(),
          confirmed_by: 'admin',
          confirmation_notes: notes,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('Payment update error:', updateError);
      return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }

    // Activate membership if applicable
    if (payment.membership_id) {
      await supabase
        .from('memberships')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.membership_id);
    }

    // Send payment receipt email
    if (payment.user?.email) {
      await sendPaymentReceipt(
        payment.user.email,
        payment.user.full_name,
        payment.id,
        payment.amount,
        'Bank Transfer',
        [
          {
            name: payment.type === 'membership' ? 'Membership Fee' : 'Payment',
            price: payment.amount,
          },
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
    });
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
