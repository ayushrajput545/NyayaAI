import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.24)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      ref={ref}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"h3">
>(({ className, ...props }, ref) => (
  <h3
    className={cn("font-semibold leading-none tracking-tight", className)}
    ref={ref}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      ref={ref}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardFooter, CardHeader, CardTitle };
