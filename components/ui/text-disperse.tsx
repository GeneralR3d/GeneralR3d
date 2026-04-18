'use client';
import type { JSX, ComponentProps } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transform {
  x: number;
  y: number;
  rotationZ: number;
}

const transforms: Transform[] = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
];

type TextDisperseProps = ComponentProps<'div'> & {
  children: string;
  /** When provided, external caller fully controls disperse state (hover is disabled) */
  dispersed?: boolean;
};

export function TextDisperse({
  children,
  dispersed,
  className,
  ...props
}: TextDisperseProps) {
  const isAnimated = dispersed ?? false;

  const splitWord = (word: string) => {
    const chars: JSX.Element[] = [];
    word.split('').forEach((char, i) => {
      const t = transforms[i % transforms.length];
      chars.push(
        <motion.span
          variants={{
            open: {
              x: t.x + 'em',
              y: t.y + 'em',
              rotateZ: t.rotationZ,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 1,
            },
            closed: {
              x: 0,
              y: 0,
              rotateZ: 0,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 0,
            },
          }}
          animate={isAnimated ? 'open' : 'closed'}
          key={char + i}
        >
          {char}
        </motion.span>,
      );
    });
    return chars;
  };

  return (
    <div
      className={cn('relative flex justify-center', className)}
      {...props}
    >
      {splitWord(children)}
    </div>
  );
}
