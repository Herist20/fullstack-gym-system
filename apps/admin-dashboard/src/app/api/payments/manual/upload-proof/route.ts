import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get('paymentId') as string;
    const file = formData.get('file') as File;

    if (!paymentId || !file) {
      return NextResponse.json(
        { error: 'Payment ID and file are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Validate file type (images only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Get payment to verify it exists
    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Upload file to Supabase Storage
    const fileName = `${paymentId}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    // Update payment with proof URL
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        metadata: {
          ...payment.metadata,
          proof_url: urlData.publicUrl,
          proof_uploaded_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('Payment update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      proofUrl: urlData.publicUrl,
      message: 'Payment proof uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload proof' },
      { status: 500 }
    );
  }
}
