import { cn } from "@/lib/utils";
import { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-rose-500 dark:border-white/10 dark:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-rose-500 dark:border-white/10 dark:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-foreground/70", className)}
      {...props}
    />
  );
}
