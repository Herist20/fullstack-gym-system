import * as React from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { cn } from '../lib/utils'

export interface CalendarSlot {
  id: string
  startTime: string
  endTime: string
  className: string
  instructor: string
  availableSpots: number
  maxCapacity: number
  status: 'available' | 'full' | 'booked'
}

export interface BookingCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  slots: CalendarSlot[]
  onSlotClick?: (slotId: string) => void
  className?: string
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
  slots,
  onSlotClick,
  className,
}: BookingCalendarProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [currentWeek, setCurrentWeek] = React.useState(0)

  // Get dates for current week
  const getWeekDates = () => {
    const dates = []
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + currentWeek * 7)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const weekDates = getWeekDates()

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const getSlotStatus = (slot: CalendarSlot) => {
    if (slot.status === 'booked') return { text: 'Booked', variant: 'success' as const }
    if (slot.status === 'full') return { text: 'Full', variant: 'destructive' as const }
    if (slot.availableSpots <= 3)
      return { text: `${slot.availableSpots} left`, variant: 'warning' as const }
    return { text: 'Available', variant: 'secondary' as const }
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentWeek(0)
                onDateChange(new Date())
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Week Days Header */}
        <div className="mb-4 grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex flex-col items-center rounded-lg p-2 transition-colors',
                isSelected(date) && 'bg-primary text-primary-foreground',
                !isSelected(date) && isToday(date) && 'bg-primary/10',
                !isSelected(date) && !isToday(date) && 'hover:bg-muted'
              )}
            >
              <span className="text-xs font-medium">{weekDays[date.getDay()]}</span>
              <span className="mt-1 text-lg font-semibold">{date.getDate()}</span>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          {slots.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No classes scheduled for this date
            </p>
          ) : (
            slots.map((slot) => {
              const status = getSlotStatus(slot)
              return (
                <button
                  key={slot.id}
                  onClick={() => onSlotClick?.(slot.id)}
                  disabled={slot.status === 'full'}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-all hover:shadow-md',
                    slot.status === 'booked' && 'border-green-500 bg-green-50',
                    slot.status === 'full' && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{slot.className}</p>
                        <Badge variant={status.variant} className="text-xs">
                          {status.text}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{slot.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {slot.availableSpots}/{slot.maxCapacity} spots
                      </p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
