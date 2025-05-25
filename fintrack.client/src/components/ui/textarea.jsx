import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-sm text-ebony",
        "ring-offset-white",
        "placeholder:text-primary-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }