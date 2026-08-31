import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-ink-950"
    >
      {/* Site-wide animated grid background */}
      <div className="absolute inset-0 grid-bg animate-gridscroll opacity-70" />

      {/* Radial fade mask to keep background elegant and subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,transparent_0%,rgba(10,10,10,0.75)_85%,#0a0a0a_100%)]" />

      {/* Drifting gradient orb 1 - Emerald glow */}
      <motion.div
        className="absolute -top-[10%] left-[10%] h-[520px] w-[520px] rounded-full bg-emerald2-500/10 blur-[130px] transform-gpu will-change-transform"
        animate={{
          x: [0, 90, -50, 30, 0],
          y: [0, 60, 110, -40, 0],
          scale: [1, 1.15, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Drifting gradient orb 2 - Sky blue glow */}
      <motion.div
        className="absolute top-[35%] -right-[5%] h-[480px] w-[480px] rounded-full bg-sky-500/10 blur-[120px] transform-gpu will-change-transform"
        animate={{
          x: [0, -80, 40, -60, 0],
          y: [0, 80, -50, 40, 0],
          scale: [1, 0.92, 1.12, 0.98, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Drifting gradient orb 3 - Deep emerald accent glow */}
      <motion.div
        className="absolute bottom-[10%] left-[25%] h-[440px] w-[440px] rounded-full bg-emerald2-400/[0.08] blur-[140px] transform-gpu will-change-transform"
        animate={{
          x: [0, 70, -80, 20, 0],
          y: [0, -70, 40, -30, 0],
          scale: [1, 1.08, 0.94, 1.04, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}
