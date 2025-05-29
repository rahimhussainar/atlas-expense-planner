import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { variant?: string }>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-11 w-full rounded-md border border-input ${variant === 'trip' ? 'bg-[#2e2f33]' : 'bg-white dark:bg-[#2e2f33]'} text-black dark:text-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4a6c6f] focus-visible:border-[#4a6c6f] disabled:cursor-not-allowed disabled:opacity-50 md:h-10`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
