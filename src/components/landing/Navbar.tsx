import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">
            Luxora
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/50 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-border/50">
          <Link
            to="/"
            className="px-4 py-1.5 text-sm font-medium text-foreground rounded-full bg-primary/10 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/showcase"
            className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          >
            Components
          </Link>
        </div>

        {/* CTA */}
        <Link
          to="/showcase"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Library
        </Link>

        {/* Mobile menu */}
        <Link
          to="/showcase"
          className="md:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground"
        >
          Components
        </Link>
      </div>
    </nav>
  );
}
