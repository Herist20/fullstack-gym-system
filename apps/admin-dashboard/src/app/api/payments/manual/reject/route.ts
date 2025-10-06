import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, reason } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment to failed/rejected
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'failed',
        metadata: {
          ...payment.metadata,
          rejected_at: new Date().toISOString(),
          rejected_by: 'admin',
          rejection_reason: reason,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('Payment rejection error:', updateError);
      return NextResponse.json({ error: 'Failed to reject payment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment rejected successfully',
    });
  } catch (error: any) {
    console.error('Payment rejection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject payment' },
      { status: 500 }
    );
  }
}
