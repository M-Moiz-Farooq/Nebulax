import { motion, useReducedMotion } from 'framer-motion';

const OFFSET = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: 56, y: 0 },
  right: { x: -56, y: 0 },
};

/**
 * 2D scroll-triggered reveal: elements translate on X/Y + fade in when entering the viewport.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount,
  ...rest
}) {
  const reduce = useReducedMotion();
  const base = OFFSET[direction] || OFFSET.up;
  const initial = amount
    ? {
        x: base.x ? (base.x / 48) * amount : 0,
        y: base.y ? (base.y / 48) * amount : 0,
      }
    : { x: base.x, y: base.y };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initial }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
