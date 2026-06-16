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

const variantClasses = {
  "left-leaf": "rounded-[50%_0px_50%_0px]",
  "circle": "rounded-[50%_50%_0px_0px]", // dome alias for index mapping
  "dome": "rounded-[50%_50%_0px_0px]",
  "right-leaf": "rounded-[0px_50%_0px_50%]",
}

export function DishImageFrame({
  src,
  alt,
  variant = "left-leaf",
  children,
  className,
  imageClassName,
  ...props
}: DishImageFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full h-[380px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(33,45,27,0.15)] transition-all duration-500",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/dish-card:scale-105 group-hover:scale-105",
          imageClassName
        )}
      />
      {children}
    </div>
  )
}

export default DishImageFrame
