import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/services/xendit.service';
import { sendPaymentReceipt } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-callback-token') || '';

    // Verify webhook signature
    const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN || '';
    const isValid = verifyWebhookSignature(webhookToken, signature, body);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const supabase = createClient();

    // Handle different webhook events
    switch (payload.status || payload.event) {
      case 'PAID':
      case 'paid':
      case 'SETTLED':
        await handlePaymentSuccess(supabase, payload);
        break;

      case 'EXPIRED':
      case 'expired':
        await handlePaymentExpired(supabase, payload);
        break;

      case 'FAILED':
      case 'failed':
        await handlePaymentFailed(supabase, payload);
        break;

      default:
        console.log('Unhandled webhook event:', payload.status || payload.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(supabase: any, payload: any) {
  const externalId = payload.external_id || payload.reference_id;
  const paidAmount = payload.paid_amount || payload.capture_amount || payload.amount;

  // Update payment transaction
  const { data: payment, error: paymentError } = await supabase
    .from('payment_transactions')
    .update({
      status: 'completed',
      transaction_metadata: payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', externalId)
    .select('*, user:users(full_name, email), membership:memberships(*)')
    .single();

  if (paymentError) {
    console.error('Payment update error:', paymentError);
    return;
  }

  // If it's a membership payment, update membership status
  if (payment.membership_id) {
    await supabase
      .from('memberships')
      .update({ status: 'active' })
      .eq('id', payment.membership_id);
  }

  // Send payment receipt email
  if (payment.user?.email) {
    await sendPaymentReceipt(
      payment.user.email,
      payment.user.full_name,
      payment.id,
      paidAmount,
      payload.payment_method || 'Bank Transfer',
      [
        {
          name: payment.type === 'membership' ? 'Membership Fee' : 'Payment',
          price: paidAmount,
        },
      ]
    );
  }
}

async function handlePaymentExpired(supabase: any, payload: any) {
  const externalId = payload.external_id || payload.reference_id;

  await supabase
    .from('payment_transactions')
    .update({
      status: 'cancelled',
      transaction_metadata: payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', externalId);
}

async function handlePaymentFailed(supabase: any, payload: any) {
  const externalId = payload.external_id || payload.reference_id;

  await supabase
    .from('payment_transactions')
    .update({
      status: 'failed',
      transaction_metadata: payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', externalId);
}
