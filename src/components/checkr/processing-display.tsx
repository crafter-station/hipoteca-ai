import { TaskProgressDisplay } from "./task-progress-display";

interface ProcessingDisplayProps {
  currentStage: string | null;
  status: string;
  runId: string;
}

export function ProcessingDisplay({
  currentStage,
  status,
  runId,
}: ProcessingDisplayProps) {
  return (
    <div className="flex-1 rounded-lg border border-border-base bg-ui-soft p-6">
      <div className="flex h-full flex-col items-center justify-center space-y-6">
        <img src="/clock-blueprint.webp" alt="Clock" className="h-16 w-16" />

        <div className="text-center">
          <h3 className="mb-2 font-semibold text-text-base text-xl">
            Procesando Contrato Hipotecario
          </h3>
          <p className="text-sm text-text-soft">
            Analizando tu contrato con inteligencia artificial...
          </p>
        </div>

        <TaskProgressDisplay
          currentStage={currentStage}
          status={status}
          runId={runId}
        />
      </div>
    </div>
  );
}
