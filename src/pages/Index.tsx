import { useState, useMemo, useEffect } from "react";
import { X, Code, Eye, ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/showcase/Sidebar";
import { ComponentDisplay } from "@/components/showcase/ComponentDisplay";
import { CodeViewer } from "@/components/showcase/CodeViewer";
import { ComponentErrorBoundary } from "@/components/showcase/ErrorBoundary";
import { componentRegistry } from "@/lib/component-registry";

const Index = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedComponent = useMemo(
    () => componentRegistry.find((c) => c.id === selectedId) || null,
    [selectedId]
  );

  const filteredComponents = useMemo(
    () =>
      componentRegistry.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  // Scroll to top when entering fullscreen mode
  useEffect(() => {
    if (selectedComponent?.needsFullscreen && !showCode) {
      window.scrollTo(0, 0);
    }
  }, [selectedComponent, showCode]);

  // Fullscreen rendering for scroll/3D components
  if (selectedComponent?.needsFullscreen && !showCode) {
    const Component = selectedComponent.component;
    return (
      <div className="relative w-full">
        {/* Floating toolbar */}
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 shadow-2xl">
          <button
            onClick={() => {
              setSelectedId(null);
              setShowCode(false);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
            title="Back to library"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-medium text-white/90 px-2 border-l border-white/10">
            {selectedComponent.name}
          </span>
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 border-l border-white/10"
            title="View source code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Full-page component */}
        <ComponentErrorBoundary componentName={selectedComponent.name}>
          <Component />
        </ComponentErrorBoundary>
      </div>
    );
  }

  // Fullscreen component in code view — show sidebar + code
  if (selectedComponent?.needsFullscreen && showCode) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          components={filteredComponents}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setShowCode(false);
          }}
          onDeselect={() => {
            setSelectedId(null);
            setShowCode(false);
          }}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground">{selectedComponent.name}</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors bg-primary/15 text-primary font-medium"
              >
                <Code className="w-3.5 h-3.5" />
                Code
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-6">
            <CodeViewer entry={selectedComponent} onClose={() => setShowCode(false)} />
          </div>
        </main>
      </div>
    );
  }

  // Normal layout
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        components={filteredComponents}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setShowCode(false);
        }}
        onDeselect={() => {
          setSelectedId(null);
          setShowCode(false);
        }}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <main className="flex-1 overflow-hidden">
        {selectedComponent ? (
          <ComponentDisplay
            entry={selectedComponent}
            showCode={showCode}
            onToggleCode={() => setShowCode(!showCode)}
            onCloseCode={() => setShowCode(false)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Component Library
              </h2>
              <p className="text-muted-foreground">
                Select a component from the sidebar to preview it
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
