import { AuditLog } from "@shared/schema";
import { format } from "date-fns";
import { History, Edit2, FileText, CheckSquare, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ActivityTimeline({ logs }: { logs: AuditLog[] }) {
  const getIcon = (fieldName: string | null) => {
    if (!fieldName) return <History className="h-4 w-4" />;
    if (fieldName.includes("document")) return <FileText className="h-4 w-4" />;
    if (fieldName.includes("checklist") || fieldName.includes("task")) return <CheckSquare className="h-4 w-4" />;
    return <Edit2 className="h-4 w-4" />;
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No activity yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 pr-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 pb-4 border-l-2 border-muted-foreground/20 pl-4 relative">
            <div className="absolute -left-2.5 top-1 h-5 w-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0 text-primary">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{log.summary}</p>
                <time className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {format(new Date(log.timestamp), "MMM d, HH:mm")}
                </time>
              </div>
              {log.fieldName && (
                <p className="text-xs text-muted-foreground mb-2">
                  Field: <span className="font-mono">{log.fieldName}</span>
                </p>
              )}
              {log.oldValue && log.newValue && (
                <div className="text-xs bg-muted/50 p-2 rounded border border-muted-foreground/20 font-mono">
                  <div className="text-destructive/80">- {log.oldValue.substring(0, 60)}{log.oldValue.length > 60 ? "..." : ""}</div>
                  <div className="text-success/80">+ {log.newValue.substring(0, 60)}{log.newValue.length > 60 ? "..." : ""}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
