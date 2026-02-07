import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: '50+', label: 'Creative Components', description: 'Fully maintained and growing monthly' },
  { value: '8', label: 'Categories', description: 'Shaders, animations, scroll effects, and more' },
  { value: '0', label: 'Dependencies Lock-in', description: 'Copy the code. Own it forever.' },
  { value: '100%', label: 'Customizable', description: 'Every component is yours to modify' },
];

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

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
            Built for <span className="text-primary">Shipping</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Your creative edge for building web projects
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:bg-card/80"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
