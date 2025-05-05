import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(function Input(
  { className, type, ...props }, 
  ref
) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-base text-ebony",
        "ring-offset-white",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-600",
        "placeholder:text-primary-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-primary-700 dark:bg-card-dark dark:text-white-smoke dark:ring-offset-card-dark dark:placeholder:text-primary-500",
        "md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }