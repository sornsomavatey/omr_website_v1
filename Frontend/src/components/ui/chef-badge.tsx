import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChefBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function ChefBadge({ className, children, ...props }: ChefBadgeProps) {
  const badgeContent = React.useMemo(() => {
    if (!children) return "Chef's Choice ✦"
    if (typeof children === "string") {
      const trimmed = children.trim()
      return trimmed.endsWith("✦") ? trimmed : `${trimmed} ✦`
    }
    return children
  }, [children])

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 bg-[#6b9158] text-white text-[10px] font-sans font-semibold tracking-wider px-3 py-1 rounded-full uppercase shadow-sm select-none z-10 w-fit",
        className
      )}
      {...props}
    >
      {badgeContent}
    </span>
  )
}

export default ChefBadge
