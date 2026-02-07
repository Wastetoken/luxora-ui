import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  Layers,
  Paintbrush,
  MousePointerClick,
  Type,
  ArrowDownToLine,
  LayoutGrid,
  Zap,
  Box,
} from 'lucide-react';

const categories = [
  { icon: Layers, name: 'Heroes & Sections', count: 2, description: 'Full-page hero sections with 3D and scroll effects' },
  { icon: Paintbrush, name: 'Shaders & Effects', count: 3, description: 'WebGL shaders including liquid chrome and waves' },
  { icon: Zap, name: 'Animations', count: 5, description: 'Fluid blobs, circle animations, and galleries' },
  { icon: Type, name: 'Text Effects', count: 4, description: 'Wavy text, parallax scrolling, and text rolls' },
  { icon: ArrowDownToLine, name: 'Scroll Effects', count: 3, description: 'Flyby scroll, SVG paths, and image trails' },
  { icon: MousePointerClick, name: 'Interactive', count: 2, description: 'Menu animations and hover interactions' },
  { icon: LayoutGrid, name: 'Cards & Layout', count: 2, description: 'Display cards and hardware-style layouts' },
  { icon: Box, name: 'Skiper Collection', count: 30, description: 'Expansive collection of creative micro-components' },
];

export default function CategoriesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative z-10 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Explore by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground text-base">
            From WebGL shaders to micro-interactions — find the perfect component
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.06 * i }}
              >
                <Link
                  to="/showcase"
                  className="block p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-card/60 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
                    <span className="text-xs text-primary font-mono">{cat.count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
