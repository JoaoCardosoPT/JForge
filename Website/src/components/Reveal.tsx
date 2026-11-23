import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export function useInView(once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setIsInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.unobserve(element);
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return { ref, isInView };
}

export function Reveal({ children, className = '', delay = 0 }: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`reveal ${className}`} data-visible={isInView}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
