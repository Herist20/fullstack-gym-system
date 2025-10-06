import Xendit from 'xendit-node';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});

export interface CreateInvoiceParams {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  invoiceDuration?: number;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface CreateVirtualAccountParams {
  externalId: string;
  bankCode: 'BCA' | 'BNI' | 'BRI' | 'MANDIRI' | 'PERMATA';
  name: string;
  expectedAmount?: number;
}

export interface CreateQRISParams {
  externalId: string;
  amount: number;
  callbackUrl?: string;
}

export interface CreateEWalletChargeParams {
  externalId: string;
  amount: number;
  phone?: string;
  ewalletType: 'OVO' | 'DANA' | 'LINKAJA' | 'SHOPEEPAY';
  callbackUrl?: string;
  redirectUrl?: string;
}

/**
 * Create Xendit invoice for flexible payment methods
 */
export async function createInvoice(params: CreateInvoiceParams) {
  try {
    const { Invoice } = xendit;
    const invoiceClient = new Invoice({});

    const invoice = await invoiceClient.createInvoice({
      data: {
        externalId: params.externalId,
        amount: params.amount,
        payerEmail: params.payerEmail,
        description: params.description,
        invoiceDuration: params.invoiceDuration || 86400, // 24 hours default
        successRedirectUrl: params.successRedirectUrl,
        failureRedirectUrl: params.failureRedirectUrl,
        currency: 'IDR',
        items: [
          {
            name: params.description,
            quantity: 1,
            price: params.amount,
          },
        ],
      },
    });

    return {
      success: true,
      data: {
        id: invoice.id,
        externalId: invoice.externalId,
        invoiceUrl: invoice.invoiceUrl,
        amount: invoice.amount,
        status: invoice.status,
        expiryDate: invoice.expiryDate,
      },
    };
  } catch (error: any) {
    console.error('Xendit create invoice error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create invoice',
    };
  }
}

/**
 * Create Virtual Account for bank transfer
 */
export async function createVirtualAccount(params: CreateVirtualAccountParams) {
  try {
    const { VirtualAccount } = xendit;
    const vaClient = new VirtualAccount({});

    const va = await vaClient.createFixedVA({
      data: {
        externalId: params.externalId,
        bankCode: params.bankCode,
        name: params.name,
        expectedAmount: params.expectedAmount,
        isClosed: true,
        isSingleUse: true,
      },
    });

    return {
      success: true,
      data: {
        id: va.id,
        externalId: va.externalId,
        bankCode: va.bankCode,
        accountNumber: va.accountNumber,
        name: va.name,
        expectedAmount: va.expectedAmount,
        status: va.status,
      },
    };
  } catch (error: any) {
    console.error('Xendit create VA error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create virtual account',
    };
  }
}

/**
 * Create QRIS payment
 */
export async function createQRISPayment(params: CreateQRISParams) {
  try {
    const { QRCode } = xendit;
    const qrClient = new QRCode({});

    const qris = await qrClient.createCode({
      data: {
        externalId: params.externalId,
        type: 'DYNAMIC',
        callbackUrl: params.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/xendit`,
        amount: params.amount,
      },
    });

    return {
      success: true,
      data: {
        id: qris.id,
        externalId: qris.externalId,
        qrString: qris.qrString,
        amount: qris.amount,
        status: qris.status,
      },
    };
  } catch (error: any) {
    console.error('Xendit create QRIS error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create QRIS payment',
    };
  }
}

/**
 * Create e-wallet charge
 */
export async function createEWalletCharge(params: CreateEWalletChargeParams) {
  try {
    const { EWallet } = xendit;
    const ewalletClient = new EWallet({});

    const charge = await ewalletClient.createEWalletCharge({
      data: {
        referenceId: params.externalId,
        currency: 'IDR',
        amount: params.amount,
        checkoutMethod: 'ONE_TIME_PAYMENT',
        channelCode: params.ewalletType,
        channelProperties: {
          successRedirectUrl: params.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failureRedirectUrl: params.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
          mobileNumber: params.phone,
        },
      },
    });

    return {
      success: true,
      data: {
        id: charge.id,
        referenceId: charge.referenceId,
        chargeUrl: (charge as any).actions?.desktop_web_checkout_url || (charge as any).actions?.mobile_deeplink_checkout_url,
        amount: charge.captureAmount,
        status: charge.status,
      },
    };
  } catch (error: any) {
    console.error('Xendit create e-wallet charge error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create e-wallet charge',
    };
  }
}

/**
 * Get invoice status
 */
export async function getInvoiceStatus(invoiceId: string) {
  try {
    const { Invoice } = xendit;
    const invoiceClient = new Invoice({});

    const invoice = await invoiceClient.getInvoice({
      invoiceId,
    });

    return {
      success: true,
      data: {
        id: invoice.id,
        status: invoice.status,
        amount: invoice.amount,
        paidAmount: invoice.paidAmount,
        paymentMethod: invoice.paymentMethod,
        paidAt: invoice.paidAt,
      },
    };
  } catch (error: any) {
    console.error('Xendit get invoice error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get invoice status',
    };
  }
}

/**
 * Create refund
 */
export async function createRefund(invoiceId: string, amount: number, reason?: string) {
  try {
    const { Invoice } = xendit;
    const invoiceClient = new Invoice({});

    const refund = await invoiceClient.expireInvoice({
      invoiceId,
    });

    return {
      success: true,
      data: {
        id: refund.id,
        status: refund.status,
      },
    };
  } catch (error: any) {
    console.error('Xendit refund error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process refund',
    };
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  webhookToken: string,
  signature: string,
  payload: string
): boolean {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', webhookToken);
  hmac.update(payload);
  const computedSignature = hmac.digest('hex');
  return computedSignature === signature;
}
