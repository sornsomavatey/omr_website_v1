import * as React from "react"
import { cn } from "@/lib/utils"

export type DishFrameVariant = "left-leaf" | "circle" | "right-leaf" | "dome"

export interface DishImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  variant?: DishFrameVariant
  children?: React.ReactNode
  imageClassName?: string
}

export const variantClasses = {
  "left-leaf": "rounded-[200px_0px_200px_0px]",
  "circle": "rounded-[200px_200px_0px_0px]", // dome alias for index mapping
  "dome": "rounded-[200px_200px_0px_0px]",
  "right-leaf": "rounded-[0px_200px_0px_200px]",
  "menu-redesign": "rounded-[160px_16px_16px_16px]",
}

import { Skeleton } from "@/components/ui/skeleton"

export function DishImageFrame({
  src,
  alt,
  variant = "left-leaf",
  children,
  className,
  imageClassName,
  ...props
}: DishImageFrameProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)

  return (
    <div
      className={cn(
        "relative w-full h-[380px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(33,45,27,0.15)] transition-all duration-500 bg-[#f2f5f0]",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-muted z-0" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/dish-card:scale-105 group-hover:scale-105 relative z-10",
          !isLoaded ? "opacity-0" : "opacity-100",
          imageClassName
        )}
      />
      {children}
    </div>
  )
}

export default DishImageFrame
