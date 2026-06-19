import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { DishImageFrame, type DishFrameVariant } from "./dish-image-frame"
import { ChefBadge } from "./chef-badge"

export interface DishCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  category: string
  description: string
  image: string
  price: string
  badge?: string | boolean
  priceSuffix?: string
  href?: string
  actionText?: string
  variant?: DishFrameVariant
  index?: number
  onActionClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function DishCard({
  className,
  name,
  category,
  description,
  image,
  price,
  badge,
  priceSuffix = "per person",
  href = "/menu",
  actionText = "Add to Order",
  variant,
  index,
  onActionClick,
  ...props
}: DishCardProps) {
  // Determine variant based on index if variant is not explicitly provided
  const shapes: DishFrameVariant[] = ["left-leaf", "dome", "right-leaf"]
  const activeVariant = variant || (typeof index === "number" ? shapes[index % 3] : "left-leaf")

  return (
    <div
      className={cn(
        "group/dish-card group flex flex-col text-left bg-transparent border-0 shadow-none transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 relative",
        className
      )}
      {...props}
    >
      <div className="relative w-full">
        <DishImageFrame src={image} alt={name} variant={activeVariant} />
        {badge && (
          <ChefBadge>
            {typeof badge === "string" ? badge : undefined}
          </ChefBadge>
        )}
      </div>

      <div className="flex flex-col flex-grow mt-6">
        <span className="text-[#6b9158] font-sans text-[11px] font-bold uppercase tracking-[0.15em] mb-2 block">
          {category}
        </span>

        <h3 className="font-serif text-[32px] text-[#212d1b] font-semibold tracking-wide leading-tight mb-3">
          {name}
        </h3>

        <p className="text-[#646860] text-sm font-sans font-light leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-baseline">
            <span className="text-[#212d1b] font-serif text-[32px] font-bold leading-none">
              {price}
            </span>
            {priceSuffix && (
              <span className="text-xs text-[#646860]/80 font-sans font-light ml-1.5">
                {priceSuffix}
              </span>
            )}
          </div>

          <Link
            to={href}
            onClick={onActionClick}
            className="text-[#4b653c] hover:text-[#384c2d] font-sans font-semibold text-sm tracking-wide transition-colors duration-200 flex items-center gap-1"
          >
            {actionText} →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DishCard
