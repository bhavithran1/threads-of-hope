import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { stats } from '../data/voices.js'

function Counter({ value, prefix = '', suffix = '', dynamic, liveCount }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)
  const target = dynamic ? liveCount : value

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.8, ease: [0.2, 0.65, 0.3, 1],
      onUpdate: (v) => setN(v),
    })
    return () => controls.stop()
  }, [inView, target])

  return <span ref={ref}>{prefix}{Math.round(n)}{suffix}</span>
}

export default function Stats({ liveCount }) {
  return (
    <section className="stats">
      <div className="wrap stats-grid">
        {stats.map((s, i) => (
          <motion.div className="stat" key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}>
            <span className="stat-num serif">
              <Counter {...s} liveCount={liveCount} />
            </span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
