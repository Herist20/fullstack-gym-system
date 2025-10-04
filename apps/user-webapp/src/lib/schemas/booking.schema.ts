import { z } from 'zod';

export const bookClassSchema = z.object({
  classId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  notes: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().optional(),
});

export const joinWaitlistSchema = z.object({
  classId: z.string().uuid(),
  scheduleId: z.string().uuid(),
});

export type BookClassInput = z.infer<typeof bookClassSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
