import { CheckCircle, Loader2, X } from "lucide-react";

interface TaskStatusIconProps {
  status: string;
}

export function TaskStatusIcon({ status }: TaskStatusIconProps) {
  if (status === "COMPLETED") {
    return <CheckCircle className="h-4.5 w-4.5 text-success-base" />;
  }

  if (["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"].includes(status)) {
    return (
      <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-error-base text-error-foreground text-xs">
        <X className="h-3 w-3" />
      </div>
    );
  }

  if (["EXECUTING", "QUEUED", "REATTEMPTING"].includes(status)) {
    return <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-base" />;
  }

  if (status === "PENDING") {
    return (
      <div className="h-4.5 w-4.5 rounded-full border-2 border-border-soft" />
    );
  }

  return null;
}
