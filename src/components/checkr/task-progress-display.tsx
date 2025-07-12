import { PROGRESS_STAGES } from "@/lib/checkr/constants";
import { Loader2 } from "lucide-react";
import { TaskStatusIcon } from "./task-status-icon";

interface TaskProgressDisplayProps {
  currentStage: string | null;
  status: string;
  runId: string;
}

export function TaskProgressDisplay({
  currentStage,
  status,
  runId,
}: TaskProgressDisplayProps) {
  if (!runId) {
    return null;
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-border-base bg-ui-subtle p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-sm text-text-soft uppercase">
          Tareas de Procesamiento
        </h4>
        {status === "REATTEMPTING" && (
          <div className="flex items-center gap-1 text-warning-base text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            Reintentando...
          </div>
        )}
      </div>

      <div className="space-y-3">
        {Object.entries(PROGRESS_STAGES).map(([stage, description]) => {
          // If no currentStage (task in queue, not started, or just started executing), all tasks are pending
          if (!currentStage || status === "QUEUED") {
            return (
              <div
                key={stage}
                className="flex items-center justify-between rounded-md bg-ui-soft p-3 text-text-soft transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{description}</p>
                  <p className="text-xs opacity-80">Pendiente</p>
                </div>
                <TaskStatusIcon status="PENDING" />
              </div>
            );
          }

          const stageKeys = Object.keys(PROGRESS_STAGES);
          const currentStageIndex = stageKeys.indexOf(currentStage);
          const thisStageIndex = stageKeys.indexOf(stage);

          const isCompleted =
            currentStage === "completed" || currentStageIndex > thisStageIndex;

          const isCurrent = currentStage === stage;
          const isRetrying = isCurrent && status === "REATTEMPTING";

          const taskStatus = isCompleted
            ? "COMPLETED"
            : isCurrent
              ? isRetrying
                ? "REATTEMPTING"
                : "EXECUTING"
              : "PENDING";

          return (
            <div
              key={stage}
              className={`flex items-center justify-between rounded-md p-3 transition-colors ${
                isCompleted
                  ? "bg-success-subtle text-success-strong"
                  : isCurrent
                    ? isRetrying
                      ? "bg-warning-subtle text-warning-strong"
                      : "bg-info-subtle text-info-strong"
                    : "bg-ui-soft text-text-soft"
              }`}
            >
              <div>
                <p className="font-medium text-sm">{description}</p>
                <p className="text-xs opacity-80">
                  {isCompleted
                    ? "Completado"
                    : isCurrent
                      ? isRetrying
                        ? "Reintentando..."
                        : "En progreso"
                      : "Pendiente"}
                </p>
              </div>
              <TaskStatusIcon status={taskStatus} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
