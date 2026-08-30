import Image from "next/image"
import { cn } from "@/lib/utils"
import { Press_Start_2P } from "next/font/google"

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})

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
        <span className={cn("text-xl tracking-tight text-foreground", pixelFont.className, textClassName)}>
          Cratos
        </span>
      )}
    </div>
  )
}
