import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { conditions } from '../data/voices.js'

// Lets a visitor add their own star to a small private sky. Stored only in
// component state — nothing leaves the browser — but it makes the metaphor
// tangible: your voice becomes light other people could navigate by.
export default function ShareThread({ onAdd }) {
  const [cond, setCond] = useState(conditions[0].id)
  const [text, setText] = useState('')
  const [mine, setMine] = useState([])

  function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    const c = conditions.find((x) => x.id === cond)
    const star = {
      id: `me-${Date.now()}`,
      text: t.slice(0, 140),
      color: c.color,
      glow: c.glow,
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 72,
    }
    setMine((m) => [...m, star])
    setText('')
    onAdd?.()
  }

  return (
    <section className="share" id="share">
      <div className="wrap share-head">
        <p className="eyebrow">Your turn</p>
        <h2 className="serif section-title">Add your thread<br />to the sky.</h2>
        <p className="section-lead">
          One sentence. The thing you wish someone had told you, or the thing you'd tell
          the version of you who was just diagnosed. It stays on your screen — a star, lit by you.
        </p>
      </div>

      <div className="wrap share-grid">
        <form className="share-form" onSubmit={submit}>
          <label className="share-label">Which thread are you on?</label>
          <div className="chip-row">
            {conditions.map((c) => (
              <button type="button" key={c.id}
                className={`chip ${cond === c.id ? 'chip-on' : ''}`}
                style={cond === c.id ? { borderColor: c.color, color: c.color, boxShadow: `0 0 14px ${c.glow}55` } : undefined}
                onClick={() => setCond(c.id)}>
                {c.label}
              </button>
            ))}
          </div>

          <label className="share-label">Your line of light</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder="What do you see differently now?"
            className="share-input"
          />
          <div className="share-row">
            <span className="share-count">{text.length}/140</span>
            <button type="submit" className="btn-primary" disabled={!text.trim()}>
              Light it up
            </button>
          </div>
        </form>

        <div className="mini-sky">
          {mine.length === 0 && (
            <p className="mini-empty serif">Your sky is waiting.<br />Write a line — watch it ignite.</p>
          )}
          <AnimatePresence>
            {mine.map((s) => (
              <motion.div key={s.id} className="mini-star"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 12 }}>
                <span className="mini-dot" style={{ background: s.color, boxShadow: `0 0 18px ${s.glow}` }} />
                <span className="mini-text">{s.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
