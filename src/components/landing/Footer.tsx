import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/30 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Luxora</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Luxora. Open-source component library for creative developers.
        </p>
      </div>
    </footer>
  );
}
