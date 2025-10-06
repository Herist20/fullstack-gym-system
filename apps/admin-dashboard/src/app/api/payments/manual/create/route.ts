import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, getPaymentReceiptTemplate } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, membershipId, amount, type, description } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'User ID and amount are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get gym bank account settings
    const { data: settings } = await supabase
      .from('gym_settings')
      .select('value')
      .eq('key', 'bank_accounts')
      .single();

    const bankAccounts = settings?.value || {
      bca: { account: '1234567890', name: 'Gym System' },
      bni: { account: '0987654321', name: 'Gym System' },
      mandiri: { account: '1122334455', name: 'Gym System' },
    };

    // Create payment transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        membership_id: membershipId,
        amount,
        payment_method: 'bank_transfer',
        type: type || 'membership',
        status: 'pending',
        metadata: {
          payment_type: 'manual',
          description: description || 'Membership Payment',
          bank_accounts: bankAccounts,
          created_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create payment transaction' },
        { status: 500 }
      );
    }

    // Send payment instructions email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .bank-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .bank-item { margin-bottom: 20px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 6px; }
            .bank-name { font-weight: bold; color: #2563eb; font-size: 16px; margin-bottom: 5px; }
            .account-number { font-size: 24px; font-weight: bold; color: #1e40af; font-family: monospace; }
            .account-name { color: #666; margin-top: 5px; }
            .amount { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .amount-value { font-size: 28px; font-weight: bold; color: #d97706; }
            .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .step { margin: 15px 0; padding-left: 30px; position: relative; }
            .step-number { position: absolute; left: 0; background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px; }
            .footer { background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Instructions 💳</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.full_name}!</h2>
              <p>Thank you for your payment. Please complete your payment by transferring to one of our bank accounts below:</p>

              <div class="amount">
                <p style="margin: 0; font-weight: bold;">Total Amount:</p>
                <div class="amount-value">Rp ${amount.toLocaleString('id-ID')}</div>
              </div>

              <div class="bank-info">
                <h3>Bank Account Details:</h3>

                ${Object.entries(bankAccounts).map(([bank, details]: [string, any]) => `
                  <div class="bank-item">
                    <div class="bank-name">${bank.toUpperCase()}</div>
                    <div class="account-number">${details.account}</div>
                    <div class="account-name">a.n. ${details.name}</div>
                  </div>
                `).join('')}
              </div>

              <div class="steps">
                <h3>Payment Steps:</h3>
                <div class="step">
                  <div class="step-number">1</div>
                  Transfer the exact amount to one of the bank accounts above
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  Save your transfer receipt/proof
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  Upload your payment proof in the user dashboard
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  Wait for admin confirmation (usually within 1-24 hours)
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  Your membership will be activated automatically after confirmation
                </div>
              </div>

              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Please transfer the <strong>exact amount</strong> shown above</li>
                <li>Save your transfer receipt for proof of payment</li>
                <li>Payment confirmation usually takes 1-24 hours</li>
                <li>Contact us if you have any questions</li>
              </ul>

              <p><strong>Invoice Number:</strong> ${transaction.id}</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Gym System. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: `Payment Instructions - Invoice #${transaction.id}`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      transaction,
      bankAccounts,
      message: 'Payment transaction created. Instructions sent to email.',
    });
  } catch (error: any) {
    console.error('Manual payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
