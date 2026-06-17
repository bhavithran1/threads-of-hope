import { motion, useScroll, useSpring } from 'framer-motion'

export function Nav() {
  return (
    <motion.nav className="nav"
      initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}>
      <a href="#top" className="nav-brand">
        <span className="nav-knot" /> Threads<span className="nav-of"> of </span>Hope
      </a>
      <div className="nav-links">
        <a href="#constellation">The Sky</a>
        <a href="#voices">Voices</a>
        <a href="#share" className="nav-cta">Add yours</a>
      </div>
    </motion.nav>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="footer-quote serif">
          “No one's thread is long enough to reach across the dark alone.
          That's the whole point of a sky.”
        </p>
        <div className="footer-meta">
          <span className="nav-knot" />
          <span>Threads of Hope</span>
          <span className="footer-dim">
            A concept space for patient voices. Quotes are anonymized and written in the
            spirit of public health communities — not medical advice.
          </span>
        </div>
      </div>
    </footer>
  )
}

export function Marquee() {
  const words = ['you are not your diagnosis', 'rest is not quitting', 'data, not a verdict',
    'one teaspoon of future', 'the wolf leaves footprints', 'still, ridiculously alive',
    'out of spoons, not out of worth', 'the breakdown was a doorway']
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}>
        {[...words, ...words].map((w, i) => (
          <span className="marquee-item" key={i}>{w}<span className="marquee-star">✦</span></span>
        ))}
      </motion.div>
    </div>
  )
}
