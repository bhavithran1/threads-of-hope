import { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { positionedVoices, conditionMap } from '../data/voices.js'

// Build a set of "threads" between voices that sit near each other in the sky,
// so the scattered stars resolve into a single connected constellation.
function buildThreads(voices) {
  const links = []
  for (let i = 0; i < voices.length; i++) {
    const dists = []
    for (let j = 0; j < voices.length; j++) {
      if (i === j) continue
      const dx = voices[i].x - voices[j].x
      const dy = voices[i].y - voices[j].y
      dists.push({ j, d: Math.hypot(dx, dy) })
    }
    dists.sort((a, b) => a.d - b.d)
    // connect each star to its 2 nearest neighbours
    for (const { j, d } of dists.slice(0, 2)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!links.some((l) => l.key === key) && d < 0.34) {
        links.push({ key, a: voices[i], b: voices[j], d })
      }
    }
  }
  return links
}

export default function Constellation() {
  const ref = useRef(null)
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(null)
  const threads = useMemo(() => buildThreads(positionedVoices), [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drawProgress = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, -20])

  return (
    <section className="constellation" id="constellation" ref={ref}>
      <motion.div className="constellation-head" style={{ y: titleY }}>
        <p className="eyebrow">The sky, mapped</p>
        <h2 className="serif section-title">Every star is a person.<br />Every thread, a thing they share.</h2>
        <p className="section-lead">
          Hover a light to hear it. Follow the threads between strangers and you'll find the
          same quiet truths recurring across every diagnosis. Tap a star to read its full note.
        </p>
      </motion.div>

      <div className="sky">
        <svg className="sky-threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {threads.map((t, i) => {
            const ca = conditionMap[t.a.condition].color
            const isActive = active && (active === t.a.id || active === t.b.id)
            return (
              <motion.line
                key={t.key}
                x1={t.a.x * 100} y1={t.a.y * 100}
                x2={t.b.x * 100} y2={t.b.y * 100}
                stroke={ca}
                strokeWidth={isActive ? 0.28 : 0.12}
                strokeOpacity={isActive ? 0.9 : 0.28}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, delay: 0.2 + i * 0.05, ease: 'easeInOut' }}
                style={{ pathLength: drawProgress }}
              />
            )
          })}
        </svg>

        {positionedVoices.map((v, i) => {
          const c = conditionMap[v.condition]
          const isActive = active === v.id
          return (
            <motion.button
              key={v.id}
              className="star"
              style={{ left: `${v.x * 100}%`, top: `${v.y * 100}%` }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 160, damping: 14 }}
              onMouseEnter={() => setActive(v.id)}
              onMouseLeave={() => setActive((a) => (a === v.id ? null : a))}
              onFocus={() => setActive(v.id)}
              onClick={() => setOpen(v)}
              aria-label={`${c.label}: ${v.quote}`}
            >
              <motion.span
                className="star-dot"
                style={{ background: c.color, boxShadow: `0 0 ${10 + v.hope * 22}px ${c.glow}` }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="star-ring" style={{ borderColor: c.color }} />

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    className="star-tip"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.28 }}
                  >
                    <span className="star-tip-cond" style={{ color: c.color }}>{c.label}</span>
                    “{v.quote}”
                    <span className="star-tip-more">tap to read</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* legend */}
      <div className="legend">
        {Object.values(conditionMap).map((c) => (
          <span className="legend-item" key={c.id}>
            <span className="legend-dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.glow}` }} />
            {c.label}
          </span>
        ))}
      </div>

      {/* full-note modal */}
      <AnimatePresence>
        {open && (
          <motion.div className="modal-backdrop" onClick={() => setOpen(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
              <span className="modal-cond" style={{ color: conditionMap[open.condition].color }}>
                {conditionMap[open.condition].label}
              </span>
              <p className="modal-quote serif">“{open.quote}”</p>
              <p className="modal-note">{open.note}</p>
              <div className="modal-foot">
                <span className="modal-handle">— u/{open.handle}</span>
                <button className="btn-ghost" onClick={() => setOpen(null)}>close ✕</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
