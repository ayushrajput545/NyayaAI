import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  className?: string;
  description: string;
  icon?: LucideIcon;
  title: string;
}

function EmptyState({
  className,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      ) : null}
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export { EmptyState };
