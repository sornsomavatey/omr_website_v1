import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

export interface ChefBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function ChefBadge({ className, children, ...props }: ChefBadgeProps) {
  const { isKhmer } = useTranslation();
  const text = isKhmer ? "ជម្រើសមេចុងភៅ ✦" : "Chef's Choice ✦";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 bg-[#6b9158] text-white text-[10px] font-sans font-semibold tracking-wider px-3 py-1 rounded-full uppercase shadow-sm select-none z-10 w-fit",
        className
      )}
      {...props}
    >
      {text}
    </span>
  )
}

export default ChefBadge
