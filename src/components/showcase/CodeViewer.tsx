import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CodeViewerProps {
  sourceFile: string;
  onClose: () => void;
}

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
    "const",
    "let",
    "var",
    "function",
    "return",
    "import",
    "export",
    "from",
    "default",
    "if",
    "else",
    "for",
    "while",
    "new",
    "class",
    "extends",
    "interface",
    "type",
    "async",
    "await",
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

export const CodeViewer = ({ sourceFile, onClose }: CodeViewerProps) => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the raw source file content
    const loadSource = async () => {
      setLoading(true);
      try {
        const modules = import.meta.glob("/src/components/repo/*.tsx", { query: "?raw", import: "default" });
        const key = `/src/components/repo/${sourceFile}`;
        if (modules[key]) {
          const content = await modules[key]() as string;
          setCode(content);
        } else {
          setCode(`// Source: src/components/repo/${sourceFile}\n// File not found in glob`);
        }
      } catch {
        setCode(`// Source: src/components/repo/${sourceFile}\n// Could not load source`);
      }
      setLoading(false);
    };
    loadSource();
  }, [sourceFile]);

  return (
    <div className="h-full flex flex-col bg-code-bg rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <span className="text-xs font-mono text-muted-foreground">
          {sourceFile}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Close code view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <pre className="text-sm leading-relaxed font-mono">
            <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
          </pre>
        )}
      </div>
    </div>
  );
};
