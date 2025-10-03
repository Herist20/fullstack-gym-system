import * as React from 'react'
import { Clock, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { cn, getInitials } from '../lib/utils'

export interface ClassCardProps {
  id: string
  name: string
  description?: string
  instructor: {
    name: string
    avatar?: string
  }
  category: string
  duration: number
  maxCapacity: number
  availableSpots: number
  schedule?: {
    date: string
    startTime: string
    endTime: string
  }
  imageUrl?: string
  onBook?: (classId: string) => void
  onViewDetails?: (classId: string) => void
  className?: string
}

export function ClassCard({
  id,
  name,
  description,
  instructor,
  category,
  duration,
  maxCapacity,
  availableSpots,
  schedule,
  imageUrl,
  onBook,
  onViewDetails,
  className,
}: ClassCardProps) {
  const categoryColors: Record<string, string> = {
    yoga: 'success',
    cardio: 'destructive',
    strength: 'warning',
    pilates: 'info',
    boxing: 'destructive',
    crossfit: 'warning',
    cycling: 'info',
    other: 'secondary',
  }

  const spotsLeft = availableSpots
  const isFull = spotsLeft === 0
  const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          <div className="absolute top-4 right-4">
            <Badge variant={categoryColors[category] as any}>{category}</Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{name}</CardTitle>
            {description && (
              <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{instructor.name}</p>
            <p className="text-xs text-muted-foreground">Instructor</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{duration} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>
              {spotsLeft}/{maxCapacity} spots
            </span>
          </div>
        </div>

        {schedule && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(schedule.date).toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}{' '}
              • {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        )}

        {isAlmostFull && !isFull && (
          <Badge variant="warning" className="w-full justify-center">
            Only {spotsLeft} spots left!
          </Badge>
        )}

        {isFull && (
          <Badge variant="destructive" className="w-full justify-center">
            Class Full
          </Badge>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {onViewDetails && (
          <Button variant="outline" className="flex-1" onClick={() => onViewDetails(id)}>
            Details
          </Button>
        )}
        {onBook && (
          <Button className="flex-1" onClick={() => onBook(id)} disabled={isFull}>
            {isFull ? 'Full' : 'Book Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
