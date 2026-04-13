import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Subtle 2D parallax glass shards in the main column — moves with page scroll (depth illusion).
 */
export default function MainParallax() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const rawY1 = useTransform(scrollYProgress, [0, 0.45], [0, -72]);
  const rawY2 = useTransform(scrollYProgress, [0, 0.45], [0, 56]);
  const rawX = useTransform(scrollYProgress, [0, 0.5], [0, 24]);

  const y1 = useSpring(rawY1, { stiffness: 100, damping: 28 });
  const y2 = useSpring(rawY2, { stiffness: 100, damping: 28 });
  const x = useSpring(rawX, { stiffness: 90, damping: 30 });

  if (reduce) return null;

  return (
    <div className="main-parallax" aria-hidden>
      <motion.div className="main-parallax__shard main-parallax__shard--a" style={{ y: y1, x }} />
      <motion.div className="main-parallax__shard main-parallax__shard--b" style={{ y: y2 }} />
    </div>
  );
}
