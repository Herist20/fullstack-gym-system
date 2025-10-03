import * as React from 'react'
import { Check, Crown, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { cn, formatCurrency } from '../lib/utils'

export interface MembershipCardProps {
  id: string
  name: string
  description?: string
  price: number
  duration: number // in days
  features: string[]
  popular?: boolean
  currentPlan?: boolean
  onSelect?: (planId: string) => void
  className?: string
}

export function MembershipCard({
  id,
  name,
  description,
  price,
  duration,
  features,
  popular = false,
  currentPlan = false,
  onSelect,
  className,
}: MembershipCardProps) {
  const getIcon = () => {
    if (name.toLowerCase().includes('platinum')) return <Crown className="h-6 w-6" />
    if (name.toLowerCase().includes('premium')) return <Star className="h-6 w-6" />
    return null
  }

  const durationText = duration === 30 ? '1 Month' : duration === 90 ? '3 Months' : `${duration} Days`

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-lg',
        popular && 'border-primary shadow-md',
        className
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          POPULAR
        </div>
      )}

      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {getIcon()}
        </div>

        <CardTitle className="text-2xl">{name}</CardTitle>
        {description && <CardDescription className="mt-2">{description}</CardDescription>}

        <div className="mt-4">
          <div className="text-4xl font-bold">{formatCurrency(price)}</div>
          <p className="text-sm text-muted-foreground">per {durationText}</p>
        </div>

        {currentPlan && (
          <Badge variant="success" className="mt-4 w-fit mx-auto">
            Current Plan
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        {onSelect && (
          <Button
            className="w-full"
            variant={popular ? 'default' : 'outline'}
            onClick={() => onSelect(id)}
            disabled={currentPlan}
          >
            {currentPlan ? 'Current Plan' : 'Choose Plan'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
