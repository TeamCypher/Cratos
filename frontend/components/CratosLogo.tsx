import Image from "next/image"
import { cn } from "@/lib/utils"

interface CratosLogoProps {
  className?: string
  imageClassName?: string
  textClassName?: string
  width?: number
  height?: number
  priority?: boolean
  iconOnly?: boolean
}

export function CratosLogo({
  className,
  imageClassName,
  textClassName,
  width = 120,
  height = 120,
  priority = false,
  iconOnly = false
}: CratosLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center shrink-0", imageClassName)}>
        <Image
          src="/cratos-logo.png"
          alt="Cratos"
          width={width}
          height={height}
          priority={priority}
          className="object-contain w-full h-full"
        />
      </div>
      {!iconOnly && (
        <span className={cn("text-xl font-bold tracking-tight text-foreground font-cratos", textClassName)}>
          Cratos
        </span>
      )}
    </div>
  )
}
