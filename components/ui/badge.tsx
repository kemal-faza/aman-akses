import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center shrink-0 transition-colors font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground border border-transparent",
        outline:
          "text-foreground border border-border",
        warning:
          "bg-warning/10 text-warning border border-warning/20",
        success:
          "bg-success/10 text-success border border-success/20",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20",
      },
      size: {
        default: "rounded-pill px-3 py-1 text-xs",
        sm: "rounded-pill px-2 py-0.5 text-[11px]",
        lg: "rounded-pill px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div
      data-slot="badge"
      role="status"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
