import { useState, useEffect, useCallback } from "react";
import { X, Copy, Code, ClipboardCheck, Terminal, FileCode } from "lucide-react";
import type { ComponentEntry } from "@/lib/component-registry";

interface CodeViewerProps {
  entry: ComponentEntry;
  onClose: () => void;
}

// Glob loader for raw source
const repoModules = import.meta.glob("/src/components/repo/*.tsx", { query: "?raw", import: "default" });

const highlightSyntax = (code: string): string => {
  let text = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const tokens: string[] = [];
  const store = (html: string): string => {
    const idx = tokens.length;
    tokens.push(html);
    return `\x00T${idx}T\x00`;
  };

  // Comments
  text = text.replace(/(\/\/.*$)/gm, (m) => store(`<span style="color:#6a737d">${m}</span>`));
  text = text.replace(/(\/\*[\s\S]*?\*\/)/g, (m) => store(`<span style="color:#6a737d">${m}</span>`));

  // Strings
  text = text.replace(/(&quot;[^&]*?&quot;|'[^']*?'|`[^`]*?`)/g, (m) => store(`<span style="color:#85e89d">${m}</span>`));

  // Keywords
  text = text.replace(
    /\b(const|let|var|function|return|import|export|from|default|if|else|for|while|new|class|extends|interface|type|async|await)\b/g,
    (m) => store(`<span style="color:#b392f0">${m}</span>`)
  );

  // JSX tags
  text = text.replace(/(&lt;\/?)([\w.]+)/g, (_, bracket, tag) =>
    `${bracket}${store(`<span style="color:#e3b341">${tag}</span>`)}`
  );

  // Numbers
  text = text.replace(/\b(\d+\.?\d*)\b/g, (m) => store(`<span style="color:#f8a544">${m}</span>`));

  // Restore all tokens
  for (let i = 0; i < tokens.length; i++) {
    text = text.replace(`\x00T${i}T\x00`, tokens[i]);
  }

  return text;
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

// Generate the npm/bun install command
const generateInstallCommand = (entry: ComponentEntry): string | null => {
  if (!entry.dependencies || entry.dependencies.length === 0) return null;
  return `npm install ${entry.dependencies.join(" ")}`;
};

// Generate correct, working usage snippet for a component
const generateUsageCode = (entry: ComponentEntry): string => {
  const baseName = entry.sourceFile.replace(".tsx", "");
  const importPath = `@/components/${baseName}`;

  if (entry.isDefaultExport) {
    return `import ${entry.exportName} from "${importPath}";

const Demo = () => {
  return <${entry.exportName} />;
};

export default Demo;`;
  }

  const exports = entry.exportName.split(",").map(e => e.trim());
  const mainExport = exports[0];

  return `import { ${entry.exportName} } from "${importPath}";

const Demo = () => {
  return <${mainExport} />;
};

export default Demo;`;
};

// Generate a copy-paste prompt for AI assistants
const generatePrompt = (entry: ComponentEntry): string => {
  const baseName = entry.sourceFile.replace(".tsx", "");
  const deps = entry.dependencies?.length
    ? `\nRequired dependencies: ${entry.dependencies.join(", ")}`
    : "";
  const localDeps = entry.localDeps?.length
    ? `\nAlso requires local files: ${entry.localDeps.join(", ")}`
    : "";
  return `Create a page using the ${entry.name} component from "@/components/${baseName}".${deps}${localDeps}\n\nImport: ${entry.isDefaultExport ? `import ${entry.exportName} from "@/components/${baseName}"` : `import { ${entry.exportName} } from "@/components/${baseName}"`}`;
};

export const CodeViewer = ({ entry, onClose }: CodeViewerProps) => {
  const [sourceCode, setSourceCode] = useState<string>("");
  const [localDepSources, setLocalDepSources] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const [activeTab, setActiveTab] = useState<"demo" | "source" | string>("demo");
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const loadSource = async () => {
      setLoading(true);
      
      // Load main source
      const sourceKey = `/src/components/repo/${entry.sourceFile}`;
      if (repoModules[sourceKey]) {
        const content = await repoModules[sourceKey]() as string;
        setSourceCode(content);
      } else {
        setSourceCode(`// Source: src/components/repo/${entry.sourceFile}\n// File not found`);
      }

      // Load local dependencies
      if (entry.localDeps?.length) {
        const depSources: Record<string, string> = {};
        for (const dep of entry.localDeps) {
          const depKey = `/src/components/repo/${dep}`;
          if (repoModules[depKey]) {
            depSources[dep] = await repoModules[depKey]() as string;
          }
        }
        setLocalDepSources(depSources);
      } else {
        setLocalDepSources({});
      }

      setLoading(false);
    };
    loadSource();
  }, [entry.sourceFile, entry.localDeps]);

  // Reset tab when switching components
  useEffect(() => {
    setActiveTab("demo");
    setShowSource(false);
  }, [entry.id]);

  const usageCode = generateUsageCode(entry);
  const prompt = generatePrompt(entry);
  const installCmd = generateInstallCommand(entry);

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
                  {"</>"} View source
                </button>
              </div>

              {/* Install command */}
              {installCmd && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">1. Install dependencies</span>
                  </div>
                  <div className="rounded-md bg-secondary/60 border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2">
                      <pre className="text-sm font-mono text-foreground/90">
                        <code>{installCmd}</code>
                      </pre>
                      <button
                        onClick={() => copy(installCmd, "install")}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                        title="Copy install command"
                      >
                        {copied === "install" ? <ClipboardCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Local dependencies note */}
              {entry.localDeps && entry.localDeps.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {installCmd ? "2." : "1."} Copy required local files
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.localDeps.map((dep) => (
                      <span
                        key={dep}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-accent/20 text-accent-foreground border border-accent/30"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    These files are included in the source tab below. Copy them alongside the main component.
                  </p>
                </div>
              )}

              {/* Usage code snippet */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {installCmd ? (entry.localDeps?.length ? "3." : "2.") : "1."} Add to your project
                  </span>
                </div>
                <div className="rounded-md bg-secondary/60 border border-border overflow-hidden">
                  <pre className="p-4 text-sm leading-relaxed font-mono overflow-x-auto">
                    <code dangerouslySetInnerHTML={{ __html: highlightSyntax(usageCode) }} />
                  </pre>
                </div>
              </div>
            </div>

            {/* Dependencies list */}
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
                onClick={() => {
                  const content = activeTab === "demo" ? usageCode : (activeTab === "source" ? sourceCode : (localDepSources[activeTab] || ""));
                  copy(content, "source");
                }}
                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Copy source code"
              >
                {copied === "source" ? <ClipboardCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab("demo")}
                className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "demo"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                demo.tsx
              </button>
              <button
                onClick={() => setActiveTab("source")}
                className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "source"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {entry.sourceFile}
              </button>
              {entry.localDeps?.map((dep) => (
                <button
                  key={dep}
                  onClick={() => setActiveTab(dep)}
                  className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === dep
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>

            {/* Source code content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm leading-relaxed font-mono">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(
                      activeTab === "demo"
                        ? usageCode
                        : activeTab === "source"
                        ? sourceCode
                        : (localDepSources[activeTab] || `// ${activeTab} source not found`)
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
