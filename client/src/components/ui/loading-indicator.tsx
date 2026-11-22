import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  className?: string;
  label?: string;
}

function LoadingIndicator({
  className,
  label = "Loading",
}: LoadingIndicatorProps) {
  return (
    <span
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-sm text-slate-500", className)}
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-blue-800" />
      <span>{label}</span>
    </span>
  );
}

export { LoadingIndicator };
