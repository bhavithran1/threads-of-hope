import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const line = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.14, duration: 1, ease: [0.2, 0.65, 0.3, 1] },
  }),
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const threadDraw = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-inner" style={{ y, opacity }}>
        <motion.p className="eyebrow" custom={0} variants={line} initial="hidden" animate="show">
          A constellation of patient voices
        </motion.p>

        <h1 className="hero-title serif">
          <motion.span custom={1} variants={line} initial="hidden" animate="show">Threads</motion.span>
          <motion.span custom={2} variants={line} initial="hidden" animate="show" className="hero-amp">of</motion.span>
          <motion.span custom={3} variants={line} initial="hidden" animate="show">Hope</motion.span>
        </h1>

        <motion.p className="hero-sub" custom={4} variants={line} initial="hidden" animate="show">
          Every person facing illness is a point of light. Alone, a star.
          Together — woven thread by thread — a sky you can navigate by.
        </motion.p>

        <motion.div className="hero-cta" custom={5} variants={line} initial="hidden" animate="show">
          <a href="#constellation" className="btn-primary">Enter the sky</a>
          <a href="#share" className="btn-ghost">Add your thread</a>
        </motion.div>
      </motion.div>

      {/* hand-drawn glowing thread that traces as you arrive */}
      <svg className="hero-thread" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5eead4" stopOpacity="0" />
            <stop offset="0.3" stopColor="#a78bfa" />
            <stop offset="0.7" stopColor="#fb7185" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <filter id="threadGlow"><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        <motion.path
          d="M -50 470 C 280 360, 420 540, 720 430 S 1180 300, 1500 410"
          fill="none" stroke="url(#threadGrad)" strokeWidth="1.6"
          filter="url(#threadGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: 'easeInOut', delay: 0.5 }}
          style={{ pathLength: threadDraw }}
        />
      </svg>

      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span>scroll</span>
        <motion.div className="scroll-cue-line" animate={{ scaleY: [0.2, 1, 0.2], originY: 0 }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
    </section>
  )
}
