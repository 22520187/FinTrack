import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-400 text-white hover:bg-primary-500",
        destructive:
          "bg-compleprimary-500 text-white hover:bg-compleprimary-600",
        outline:
          "border border-primary-200 bg-white hover:bg-primary-50 hover:text-primary-600",
        secondary:
          "bg-secondary-400 text-white hover:bg-secondary-500",
        ghost: "hover:bg-primary-50 hover:text-primary-600",
        link: "text-primary-500 underline-offset-4 hover:underline",
        warning: "bg-orange-500 text-white hover:bg-orange-600",
        amber: "bg-amber-light text-amber-dark hover:bg-amber-dark hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props }, 
  ref
) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }