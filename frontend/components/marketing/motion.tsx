'use client';

import { LazyMotion, domAnimation, m, type MotionProps } from 'framer-motion';
import * as React from 'react';

const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
  viewport: { once: true, amount: 0.2 },
};

const fadeIn: MotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' },
  viewport: { once: true, amount: 0.2 },
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function MotionSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.section className={className} {...fadeInUp}>
      {children}
    </m.section>
  );
}

export function MotionDiv({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay }}
    >
      {children}
    </m.div>
  );
}

export function MotionFade({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      {...fadeIn}
      transition={{ ...fadeIn.transition, delay }}
    >
      {children}
    </m.div>
  );
}

export const Motion = m;


