"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer relative size-5 shrink-0 rounded-xs border border-border",
        "bg-background transition-colors",
        "data-[checked]:bg-primary data-[checked]:border-primary",
        "data-[checked]:text-primary-foreground",
        "focus-visible:outline-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "absolute inset-0 flex items-center justify-center text-current",
          "data-[unchecked]:hidden"
        )}
      >
        <Check className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
