export interface LogEntry {
  id: string;
  timestamp: string;
  step: string;
  status: "pending" | "done" | "skipped";
  detail?: string;
}

interface HonestAgentLogProps {
  logs: LogEntry[];
  className?: string;
}

export function HonestAgentLog({ logs, className = "" }: HonestAgentLogProps) {
  if (logs.length === 0) return null;

  return (
    <div
      className={`bg-[#FBF7EA] border border-[#1B1A17]/30 rounded-[6px] p-4 font-mono text-xs text-[#1B1A17] paper-shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-dashed border-[#1B1A17]/30 text-[10px] uppercase text-[#8A8576] font-semibold">
        <span>HONEST AUDIT LOG (STEPS EXECUTED)</span>
        <span>NO SYNTHETIC DELAYS</span>
      </div>

      <div className="space-y-1.5">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start justify-between gap-3 text-[11px]">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  log.status === "done"
                    ? "bg-[#1F6B4F]"
                    : log.status === "pending"
                    ? "bg-[#F3C94B] animate-ping"
                    : "bg-[#8A8576]"
                }`}
              />
              <span className="text-[#8A8576] tabular-nums">[{log.timestamp}]</span>
              <span className="font-medium text-[#1B1A17]">{log.step}</span>
            </div>
            {log.detail && (
              <span className="text-[#8A8576] text-right font-normal truncate max-w-xs">
                {log.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
