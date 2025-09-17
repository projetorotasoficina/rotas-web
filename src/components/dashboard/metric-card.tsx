import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type MetricCardProps = {
  title: string
  value: string | number
  trend?: {
    value: string
    type: 'positive' | 'negative' | 'neutral'
    description: string
  }
  footerText?: string
}

function getTrendIcon(type: 'positive' | 'negative' | 'neutral') {
  // biome-ignore lint/nursery/noUnnecessaryConditions: switch
  switch (type) {
    case 'positive':
      return TrendingUp
    case 'negative':
      return TrendingDown
    default:
      return TrendingUp
  }
}

function getTrendVariant(type: 'positive' | 'negative' | 'neutral') {
  // biome-ignore lint/nursery/noUnnecessaryConditions: switch
  switch (type) {
    case 'positive':
      return 'default'
    case 'negative':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function MetricCard({
  title,
  value,
  trend,
  footerText,
}: MetricCardProps) {
  const TrendIcon = trend ? getTrendIcon(trend.type) : null

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          {value}
        </CardTitle>
        {trend && (
          <CardAction>
            <Badge variant={getTrendVariant(trend.type)}>
              {TrendIcon && <TrendIcon className="h-3 w-3" />}
              {trend.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {(trend?.description || footerText) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {trend?.description && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {trend.description}
              {TrendIcon && <TrendIcon className="size-4" />}
            </div>
          )}
          {footerText && (
            <div className="text-muted-foreground">{footerText}</div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
