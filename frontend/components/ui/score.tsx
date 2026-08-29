import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: "small" | "medium" | "large" | "hero"
}

export function Score({
  value,
  max = 100,
  size = "medium",
  className,
  ...props
}: ScoreProps) {
  const sizeClasses = {
    small: "text-lg font-bold",
    medium: "text-3xl font-bold",
    large: "text-5xl font-bold tracking-tight",
    hero: "text-7xl font-extrabold tracking-tighter",
  }

  const denominatorClasses = {
    small: "text-xs text-muted-foreground ml-1 font-medium",
    medium: "text-sm text-muted-foreground ml-1 font-semibold",
    large: "text-xl text-muted-foreground ml-2 font-bold",
    hero: "text-3xl text-muted-foreground ml-2 font-bold",
  }

  // Choose color based on value
  const getColorClass = (val: number) => {
    if (val >= 80) return "text-primary" // Electric Violet
    if (val >= 60) return "text-secondary" // Pink/Magenta
    if (val >= 40) return "text-accent" // Cyan
    return "text-muted-foreground"
  }

  return (
    <div
      className={cn(
        "inline-flex items-baseline",
        size === "hero" ? "bg-clip-text text-transparent bg-gradient-to-br from-white to-primary" : getColorClass(value),
        className
      )}
      {...props}
    >
      <span className={cn(sizeClasses[size])}>{value}</span>
      <span className={cn(denominatorClasses[size], size === "hero" ? "text-slate-500" : "")}>
        / {max}
      </span>
    </div>
  )
}
