import { create } from 'zustand';

export interface BookingState {
  selectedClassId: string | null;
  selectedScheduleId: string | null;
  bookingInProgress: boolean;
  setSelectedClass: (classId: string, scheduleId: string) => void;
  clearSelectedClass: () => void;
  setBookingInProgress: (inProgress: boolean) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedClassId: null,
  selectedScheduleId: null,
  bookingInProgress: false,
  setSelectedClass: (classId, scheduleId) =>
    set({ selectedClassId: classId, selectedScheduleId: scheduleId }),
  clearSelectedClass: () =>
    set({ selectedClassId: null, selectedScheduleId: null }),
  setBookingInProgress: (inProgress) => set({ bookingInProgress: inProgress }),
}));
