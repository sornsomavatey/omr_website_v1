import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChefBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function ChefBadge({ className, children = "Chef's Choice ✦", ...props }: ChefBadgeProps) {
  return (
    <span
      className={cn(
        "absolute top-6 right-6 bg-[#4b653c] text-white text-[10px] font-sans font-semibold tracking-wider px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1 shadow-sm select-none z-10",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default ChefBadge
