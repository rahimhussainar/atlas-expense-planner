import React, { useEffect, useState, useRef } from 'react';
import { Users, Globe, TrendingUp, Star } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: <Users className="w-8 h-8 text-atlas-forest" />,
    value: 1000,
    suffix: '+',
    label: 'Active Travelers'
  },
  {
    icon: <Globe className="w-8 h-8 text-atlas-rust" />,
    value: 50,
    suffix: '+',
    label: 'Countries Explored'
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-atlas-gold" />,
    value: 95,
    suffix: '%',
    label: 'Trip Success Rate'
  },
  {
    icon: <Star className="w-8 h-8 text-atlas-slate" />,
    value: 4.9,
    suffix: '/5',
    label: 'User Rating'
  }
];

const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const steps = 50;
    const stepDuration = duration / steps;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}</span>;
};

const StatsSection: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-4 group"
            >
              <div className="inline-flex p-4 rounded-2xl bg-card shadow-lg group-hover:shadow-xl transition-all duration-300 border border-border/50">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value % 1 === 0 ? (
                    <AnimatedCounter end={stat.value} />
                  ) : (
                    stat.value
                  )}
                  <span className="text-2xl md:text-3xl">{stat.suffix}</span>
                </div>
                <div className="text-sm md:text-base text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 