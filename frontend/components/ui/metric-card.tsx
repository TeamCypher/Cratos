import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "none"
  status?: "success" | "warning" | "error" | "neutral"
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  status = "neutral",
  className,
  ...props
}: MetricCardProps) {
  
  const statusColors = {
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
    neutral: "text-muted-foreground",
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className={cn("bg-card border-border shadow-sm", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
          {Icon && (
            <div className="p-2 rounded-lg dark:bg-white/5 bg-black/5 border dark:border-white/5 border-black/5">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">{value}</span>
          
          {trend && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", statusColors[status])}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
