import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  className?: string;
  description: string;
  title?: string;
}

function ErrorState({
  className,
  description,
  title = "Something went wrong",
}: ErrorStateProps) {
  return (
    <div
      aria-live="assertive"
      className={cn(
        "flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-950",
        className,
      )}
      role="alert"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-700" />
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-red-800">{description}</p>
      </div>
    </div>
  );
}

export { ErrorState };
