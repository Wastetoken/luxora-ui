import { Search, ArrowLeft } from "lucide-react";

interface SidebarProps {
  components: { id: string; name: string; category: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const categoryOrder = [
  "Heroes & Sections",
  "Shaders & Effects",
  "Animations",
  "Text Effects",
  "Scroll Effects",
  "Interactive",
  "Cards & Layout",
  "Skiper Collection",
];

export const Sidebar = ({
  components,
  selectedId,
  onSelect,
  onDeselect,
  searchQuery,
  onSearch,
}: SidebarProps) => {
  const grouped = components.reduce<Record<string, typeof components>>(
    (acc, comp) => {
      if (!acc[comp.category]) acc[comp.category] = [];
      acc[comp.category].push(comp);
      return acc;
    },
    {}
  );

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <aside className="w-64 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          {selectedId && (
            <button
              onClick={onDeselect}
              className="p-1 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-sm font-semibold text-foreground tracking-wide">
            Component Library
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-sidebar-accent text-sm text-foreground placeholder:text-muted-foreground rounded-md pl-8 pr-3 py-1.5 border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {sortedCategories.map((category) => (
          <div key={category} className="mb-3">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 mb-1">
              {category}
            </h3>
            {grouped[category].map((comp) => (
              <button
                key={comp.id}
                onClick={() => onSelect(comp.id)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                  selectedId === comp.id
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground text-center">
          {components.length} components
        </p>
      </div>
    </aside>
  );
};
