import { Suspense } from "react";
import { Code, Eye } from "lucide-react";
import { CodeViewer } from "./CodeViewer";
import { ComponentErrorBoundary } from "./ErrorBoundary";
import type { ComponentEntry } from "@/lib/component-registry";

interface ComponentDisplayProps {
  entry: ComponentEntry;
  showCode: boolean;
  onToggleCode: () => void;
  onCloseCode: () => void;
}

export const ComponentDisplay = ({
  entry,
  showCode,
  onToggleCode,
  onCloseCode,
}: ComponentDisplayProps) => {
  const Component = entry.component;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">{entry.name}</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (showCode) onCloseCode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              !showCode
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={onToggleCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              showCode
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        {showCode ? (
          <CodeViewer entry={entry} onClose={onCloseCode} />
        ) : (
          <div
            className="h-full rounded-lg border border-showcase-border bg-showcase-surface overflow-auto"
            style={{
              transform: "translateZ(0)",
              isolation: "isolate",
            }}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <ComponentErrorBoundary componentName={entry.name}>
                <div key={entry.id} className="w-full h-full relative">
                  <Component />
                </div>
              </ComponentErrorBoundary>
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};
