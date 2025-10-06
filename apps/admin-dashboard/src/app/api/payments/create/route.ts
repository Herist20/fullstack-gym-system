import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createInvoice, createVirtualAccount, createQRISPayment, createEWalletCharge } from '@/lib/services/xendit.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, membershipId, amount, paymentMethod, type } = body;

    if (!userId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        membership_id: membershipId,
        amount,
        payment_method: paymentMethod,
        type: type || 'membership',
        status: 'pending',
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    let paymentData;

    // Create payment based on method
    switch (paymentMethod) {
      case 'invoice':
        paymentData = await createInvoice({
          externalId: transaction.id,
          amount,
          payerEmail: user.email,
          description: `${type === 'membership' ? 'Membership' : 'Payment'} for ${user.full_name}`,
          successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        });
        break;

      case 'va_bca':
      case 'va_bni':
      case 'va_bri':
      case 'va_mandiri':
        const bankCode = paymentMethod.replace('va_', '').toUpperCase() as any;
        paymentData = await createVirtualAccount({
          externalId: transaction.id,
          bankCode,
          name: user.full_name,
          expectedAmount: amount,
        });
        break;

      case 'qris':
        paymentData = await createQRISPayment({
          externalId: transaction.id,
          amount,
        });
        break;

      case 'ovo':
      case 'dana':
      case 'linkaja':
      case 'shopeepay':
        paymentData = await createEWalletCharge({
          externalId: transaction.id,
          amount,
          ewalletType: paymentMethod.toUpperCase() as any,
          phone: user.phone,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported payment method' },
          { status: 400 }
        );
    }

    if (!paymentData.success) {
      // Update transaction to failed
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      return NextResponse.json(
        { error: paymentData.error },
        { status: 500 }
      );
    }

    // Update transaction with payment details
    await supabase
      .from('payment_transactions')
      .update({ transaction_metadata: paymentData.data })
      .eq('id', transaction.id);

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      paymentData: paymentData.data,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
