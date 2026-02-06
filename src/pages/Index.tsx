import { useState, useMemo } from "react";
import { Sidebar } from "@/components/showcase/Sidebar";
import { ComponentDisplay } from "@/components/showcase/ComponentDisplay";
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        components={filteredComponents}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
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
