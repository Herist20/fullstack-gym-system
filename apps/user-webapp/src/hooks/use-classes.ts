import { useQuery } from '@tanstack/react-query';
import { classesApi } from '@/lib/api/classes.api';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: ['classes', classId],
    queryFn: () => classesApi.getClassById(classId),
    enabled: !!classId,
  });
}

export function useClassSchedules(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['class-schedules', startDate, endDate],
    queryFn: () => classesApi.getClassSchedules(startDate, endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSchedule(scheduleId: string) {
  return useQuery({
    queryKey: ['class-schedules', scheduleId],
    queryFn: () => classesApi.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
}
