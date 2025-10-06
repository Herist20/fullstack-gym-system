import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseQRCodeData, validateQRCode } from '@/lib/utils/qr-code';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrData } = body;

    if (!qrData) {
      return NextResponse.json({ error: 'QR data is required' }, { status: 400 });
    }

    // Parse QR code
    const parsed = parseQRCodeData(qrData);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid QR code format' }, { status: 400 });
    }

    // Validate QR code
    const validation = validateQRCode(parsed, 1440); // 24 hours validity
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const supabase = createClient();

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        user:users(full_name, email),
        schedule:schedules(
          *,
          class:classes(name)
        )
      `)
      .eq('id', parsed.bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if booking is already checked in
    if (booking.checked_in) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          booking: {
            userName: booking.user.full_name,
            className: booking.schedule.class.name,
            checkedInAt: booking.updated_at,
          },
        },
        { status: 400 }
      );
    }

    // Check booking status
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking has been cancelled' }, { status: 400 });
    }

    // Check if class has started or not too early
    const scheduleDate = new Date(booking.schedule.date);
    const scheduleTime = booking.schedule.start_time.split(':');
    scheduleDate.setHours(parseInt(scheduleTime[0]), parseInt(scheduleTime[1]));

    const now = new Date();
    const timeDiffMinutes = (scheduleDate.getTime() - now.getTime()) / (1000 * 60);

    if (timeDiffMinutes > 60) {
      return NextResponse.json(
        { error: 'Too early to check in. Check-in opens 1 hour before class.' },
        { status: 400 }
      );
    }

    if (timeDiffMinutes < -30) {
      return NextResponse.json(
        { error: 'Class has already ended.' },
        { status: 400 }
      );
    }

    // Update booking to checked in
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        checked_in: true,
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Check-in update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to check in' },
        { status: 500 }
      );
    }

    // Decrease available spots
    if (booking.schedule.available_spots > 0) {
      await supabase
        .from('schedules')
        .update({
          available_spots: booking.schedule.available_spots - 1,
        })
        .eq('id', booking.schedule_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      booking: {
        id: updatedBooking.id,
        userName: booking.user.full_name,
        userEmail: booking.user.email,
        className: booking.schedule.class.name,
        scheduleDate: booking.schedule.date,
        scheduleTime: booking.schedule.start_time,
        checkedInAt: updatedBooking.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: error.message || 'Check-in failed' },
      { status: 500 }
    );
  }
}

// Get booking QR code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      type: 'BOOKING_CHECKIN',
      bookingId: booking.id,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      qrData,
    });
  } catch (error: any) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
