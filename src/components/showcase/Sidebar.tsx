import React from "react";
import { Search, ArrowLeft, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface SidebarProps {
  components: { id: string; name: string; category: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const categoryOrder = [
  "Heroes & Sections",
  "Cursors",
  "Shaders & Effects",
  "Animations",
  "Text Effects",
  "Scroll Effects",
  "Interactive",
  "Cards & Layout",
  "Poison Library",
  "Skiper Collection",
];

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  {
    components,
    selectedId,
    onSelect,
    onDeselect,
    searchQuery,
    onSearch,
    mobileOpen = false,
    onMobileToggle,
  },
  _ref
) {
  const isMobile = useIsMobile();

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

  const handleSelect = (id: string) => {
    onSelect(id);
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    }
  };

  const sidebarContent = (
    <aside className="w-full md:w-64 h-full flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          {isMobile && (
            <button
              onClick={onMobileToggle}
              className="p-1 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {selectedId && !isMobile && (
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

      <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-2">
        {sortedCategories.map((category) => (
          <div key={category} className="mb-3">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 mb-1">
              {category}
            </h3>
            {grouped[category].map((comp) => (
              <button
                key={comp.id}
                onClick={() => handleSelect(comp.id)}
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

      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {components.length} components
        </p>
        <Link to="/" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          ← Home
        </Link>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onMobileToggle}
            />
            <div className="relative z-10 w-[280px] h-full animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return sidebarContent;
});

export const MobileHeader = React.forwardRef<HTMLDivElement, {
  title?: string;
  onMenuToggle: () => void;
  onBack?: () => void;
  showBack?: boolean;
  rightContent?: React.ReactNode;
}>(function MobileHeader({
  title,
  onMenuToggle,
  onBack,
  showBack,
  rightContent,
}, _ref) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background md:hidden">
      <div className="flex items-center gap-2">
        {showBack && onBack ? (
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onMenuToggle}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
            {title}
          </h1>
        )}
      </div>
      {rightContent && <div className="flex items-center gap-1">{rightContent}</div>}
    </div>
  );
});
