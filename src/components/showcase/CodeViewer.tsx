import { useState, useEffect, useCallback } from "react";
import { X, Copy, Code, ClipboardCheck } from "lucide-react";
import type { ComponentEntry } from "@/lib/component-registry";

interface CodeViewerProps {
  entry: ComponentEntry;
  onClose: () => void;
}

// Glob loader for raw source
const repoModules = import.meta.glob("/src/components/repo/*.tsx", { query: "?raw", import: "default" });

const highlightSyntax = (code: string): string => {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    '<span style="color: hsl(220, 10%, 40%)">$1</span>'
  );
  highlighted = highlighted.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span style="color: hsl(220, 10%, 40%)">$1</span>'
  );

  // Strings
  highlighted = highlighted.replace(
    /(&quot;[^&]*?&quot;|'[^']*?'|`[^`]*?`)/g,
    '<span style="color: hsl(150, 60%, 55%)">$1</span>'
  );

  // Keywords
  const keywords = [
    "const", "let", "var", "function", "return", "import", "export",
    "from", "default", "if", "else", "for", "while", "new", "class",
    "extends", "interface", "type", "async", "await",
  ];
  keywords.forEach((kw) => {
    highlighted = highlighted.replace(
      new RegExp(`\\b(${kw})\\b`, "g"),
      '<span style="color: hsl(280, 65%, 68%)">$1</span>'
    );
  });

  // JSX tags
  highlighted = highlighted.replace(
    /(&lt;\/?)([\w.]+)/g,
    '$1<span style="color: hsl(38, 92%, 60%)">$2</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span style="color: hsl(30, 90%, 65%)">$1</span>'
  );

  return highlighted;
};

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return { copied, copy };
};

// Generate usage snippet for a component
const generateUsageCode = (entry: ComponentEntry): string => {
  const baseName = entry.sourceFile.replace(".tsx", "");
  return `import { Component } from "@/components/ui/${baseName}";

const DemoOne = () => {
  return <Component />;
};

export { DemoOne };`;
};

// Generate a copy-paste prompt for AI assistants
const generatePrompt = (entry: ComponentEntry): string => {
  const deps = entry.dependencies?.length
    ? `\nRequired dependencies: ${entry.dependencies.join(", ")}`
    : "";
  return `Create a page using the ${entry.name} component from "@/components/ui/${entry.sourceFile.replace(".tsx", "")}".${deps}`;
};

export const CodeViewer = ({ entry, onClose }: CodeViewerProps) => {
  const [sourceCode, setSourceCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const [activeTab, setActiveTab] = useState<"demo" | "source">("demo");
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const loadSource = async () => {
      setLoading(true);
      const sourceKey = `/src/components/repo/${entry.sourceFile}`;
      if (repoModules[sourceKey]) {
        const content = await repoModules[sourceKey]() as string;
        setSourceCode(content);
      } else {
        setSourceCode(`// Source: src/components/repo/${entry.sourceFile}\n// File not found`);
      }
      setLoading(false);
    };
    loadSource();
  }, [entry.sourceFile]);

  // Reset tab when switching components
  useEffect(() => {
    setActiveTab("demo");
    setShowSource(false);
  }, [entry.id]);

  const usageCode = generateUsageCode(entry);
  const prompt = generatePrompt(entry);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-code-bg rounded-lg border border-border">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-code-bg rounded-lg border border-border overflow-hidden relative">
      {/* Close button */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Close code view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        {/* How to use section */}
        {!showSource && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">How to use</h3>
              
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button
                  onClick={() => copy(prompt, "prompt")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {copied === "prompt" ? <ClipboardCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  Copy prompt
                </button>
                <button
                  onClick={() => copy(usageCode, "usage")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {copied === "usage" ? <ClipboardCheck className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  Copy code
                </button>
                <button
                  onClick={() => setShowSource(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Code className="w-3 h-3" />
                  {"</>"} View code
                </button>
              </div>

              {/* Usage code snippet */}
              <div className="rounded-md bg-secondary/60 border border-border overflow-hidden">
                <pre className="p-4 text-sm leading-relaxed font-mono overflow-x-auto">
                  <code dangerouslySetInnerHTML={{ __html: highlightSyntax(usageCode) }} />
                </pre>
              </div>
            </div>

            {/* Dependencies */}
            {entry.dependencies && entry.dependencies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Dependencies</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-destructive/15 text-destructive border border-destructive/20"
                    >
                      {dep}
                      <span className="text-[10px] font-bold bg-destructive/20 rounded px-1">N</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source Code section */}
        {showSource && (
          <div className="flex flex-col h-full">
            {/* Source Code header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-foreground mr-3">Source Code</span>
                <button
                  onClick={() => setShowSource(false)}
                  className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Back to how-to-use"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => copy(activeTab === "demo" ? usageCode : sourceCode, "source")}
                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Copy source code"
              >
                {copied === "source" ? <ClipboardCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Tabs — always show demo.tsx + component file */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("demo")}
                className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === "demo"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                demo.tsx
              </button>
              <button
                onClick={() => setActiveTab("source")}
                className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === "source"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {entry.sourceFile}
              </button>
            </div>

            {/* Source code content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm leading-relaxed font-mono">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(
                      activeTab === "demo" ? usageCode : sourceCode
                    ),
                  }}
                />
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
