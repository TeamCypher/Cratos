import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string
  description?: string
}

export function SectionHeading({
  title,
  description,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 
        className="text-2xl font-bold tracking-tight text-foreground mb-1 font-pixel" 
        {...props}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
