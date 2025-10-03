import * as React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '../lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const trendIsPositive = trend?.isPositive ?? trend ? trend.value > 0 : undefined

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  trendIsPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trendIsPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
              </div>
            )}

            {description && <span>{description}</span>}
            {trend?.label && !description && <span>{trend.label}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
