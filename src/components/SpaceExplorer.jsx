import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { voices, conditionMap } from '../data/voices.js'

const WORLD_W = 5000
const WORLD_H = 5000
const MIN_ZOOM = 0.15
const MAX_ZOOM = 1.6
const NOTE_RADIUS = 220

function seededRand(i, salt) {
  const x = Math.sin((i + 1) * 9301 + salt * 49297) * 233280
  return x - Math.floor(x)
}

function placeNotes(list) {
  const placed = []
  for (let i = 0; i < list.length; i++) {
    let x, y, attempts = 0
    do {
      x = 300 + seededRand(i + attempts, 1) * (WORLD_W - 600)
      y = 300 + seededRand(i + attempts, 2) * (WORLD_H - 600)
      attempts++
    } while (
      attempts < 40 &&
      placed.some(p => Math.hypot(p.x - x, p.y - y) < NOTE_RADIUS)
    )
    placed.push({ ...list[i], x, y, size: 6 + list[i].hope * 10 })
  }
  return placed
}

function buildLinks(notes) {
  const links = []
  for (let i = 0; i < notes.length; i++) {
    const dists = []
    for (let j = 0; j < notes.length; j++) {
      if (i === j) continue
      dists.push({ j, d: Math.hypot(notes[i].x - notes[j].x, notes[i].y - notes[j].y) })
    }
    dists.sort((a, b) => a.d - b.d)
    for (const { j, d } of dists.slice(0, 2)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!links.some(l => l.key === key) && d < 900) {
        links.push({ key, a: notes[i], b: notes[j] })
      }
    }
  }
  return links
}

function BackgroundStars({ count = 600 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: seededRand(i, 10) * WORLD_W,
      y: seededRand(i, 20) * WORLD_H,
      r: 0.5 + seededRand(i, 30) * 2,
      opacity: 0.15 + seededRand(i, 40) * 0.5,
      dur: 3 + seededRand(i, 50) * 6,
    })), [count])

  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity}>
          <animate attributeName="opacity" values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
            dur={`${s.dur}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  )
}

function Nebulae() {
  return (
    <g>
      <radialGradient id="neb1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
      <radialGradient id="neb2"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0" /></radialGradient>
      <radialGradient id="neb3"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.08" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0" /></radialGradient>
      <radialGradient id="neb4"><stop offset="0%" stopColor="#10b981" stopOpacity="0.09" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></radialGradient>
      <radialGradient id="neb5"><stop offset="0%" stopColor="#d946ef" stopOpacity="0.07" /><stop offset="100%" stopColor="#d946ef" stopOpacity="0" /></radialGradient>
      <circle cx="800" cy="700" r="600" fill="url(#neb1)" />
      <circle cx="3200" cy="1200" r="800" fill="url(#neb2)" />
      <circle cx="1500" cy="3500" r="700" fill="url(#neb3)" />
      <circle cx="4000" cy="3800" r="650" fill="url(#neb4)" />
      <circle cx="2500" cy="2500" r="900" fill="url(#neb5)" />
      <circle cx="4200" cy="800" r="500" fill="url(#neb1)" />
      <circle cx="600" cy="4200" r="550" fill="url(#neb2)" />
    </g>
  )
}

export default function SpaceExplorer() {
  const containerRef = useRef(null)
  const zoomRef = useRef(0.35)
  const panRef = useRef({ x: 0, y: 0 })
  const [zoom, _setZoom] = useState(0.35)
  const [pan, _setPan] = useState({ x: 0, y: 0 })
  const [dragging, _setDragging] = useState(false)
  const draggingRef = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const setZoom = useCallback((v) => {
    const next = typeof v === 'function' ? v(zoomRef.current) : v
    zoomRef.current = next
    _setZoom(next)
  }, [])
  const setPan = useCallback((v) => {
    const next = typeof v === 'function' ? v(panRef.current) : v
    panRef.current = next
    _setPan(next)
  }, [])

  const notes = useMemo(() => placeNotes(voices), [])
  const links = useMemo(() => buildLinks(notes), [notes])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = {
      x: rect.width / 2 - (WORLD_W / 2) * 0.35,
      y: rect.height / 2 - (WORLD_H / 2) * 0.35,
    }
    setPan(p)
  }, [setPan])

  const applyZoom = useCallback((factor, cx, cy) => {
    const prev = zoomRef.current
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * factor))
    const scale = next / prev
    const p = panRef.current
    setPan({ x: cx - scale * (cx - p.x), y: cy - scale * (cy - p.y) })
    setZoom(next)
  }, [setZoom, setPan])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    applyZoom(e.deltaY > 0 ? 0.9 : 1.1, mx, my)
  }, [applyZoom])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const zoomToCenter = useCallback((factor) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    applyZoom(factor, rect.width / 2, rect.height / 2)
  }, [applyZoom])

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target.closest('.space-note')) return
    draggingRef.current = true
    _setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy })
  }, [setPan])

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
    _setDragging(false)
  }, [])

  const handleNoteClick = useCallback((note) => {
    setSelected(note)
  }, [])

  const showLabel = zoom > 0.45
  const showCards = zoom > 0.7

  return (
    <section className="space-explorer" id="voices">
      <div className="space-header wrap">
        <p className="eyebrow">Explore the cosmos</p>
        <h2 className="serif section-title">Drift through the dark.<br />Every light is a life.</h2>
        <p className="section-lead">
          Scroll to zoom. Drag to drift. Each star is a person's note — zoom in close enough
          and their words appear. Click any light to read its full story.
        </p>
      </div>

      <div className="space-controls">
        <button className="space-zoom-btn" onClick={() => zoomToCenter(1.4)} aria-label="Zoom in">+</button>
        <div className="space-zoom-level">{Math.round(zoom * 100)}%</div>
        <button className="space-zoom-btn" onClick={() => zoomToCenter(0.7)} aria-label="Zoom out">−</button>
        <button className="space-zoom-btn space-reset" onClick={() => {
          setZoom(0.35)
          const el = containerRef.current
          if (el) {
            const rect = el.getBoundingClientRect()
            setPan({
              x: rect.width / 2 - (WORLD_W / 2) * 0.35,
              y: rect.height / 2 - (WORLD_H / 2) * 0.35,
            })
          }
        }} aria-label="Reset view">⟳</button>
      </div>

      <div className="space-legend">
        {Object.values(conditionMap).map(c => (
          <span className="legend-item" key={c.id}>
            <span className="legend-dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.glow}` }} />
            {c.label}
          </span>
        ))}
      </div>

      <div
        className="space-viewport"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="space-world"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <svg className="space-svg" viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} width={WORLD_W} height={WORLD_H}>
            <Nebulae />
            <BackgroundStars />
            {links.map(l => {
              const ca = conditionMap[l.a.condition]
              const isActive = hovered && (hovered === l.a.id || hovered === l.b.id)
              return (
                <line key={l.key}
                  x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y}
                  stroke={ca.color} strokeWidth={isActive ? 2 : 0.8}
                  strokeOpacity={isActive ? 0.7 : 0.15}
                  style={{ transition: 'stroke-width 0.3s, stroke-opacity 0.3s' }}
                />
              )
            })}
            {notes.map(v => {
              const c = conditionMap[v.condition]
              const isHover = hovered === v.id
              return (
                <g key={v.id}>
                  <circle cx={v.x} cy={v.y} r={v.size * 3} fill={c.color} opacity={0.06}>
                    <animate attributeName="r" values={`${v.size * 3};${v.size * 4};${v.size * 3}`}
                      dur={`${3 + v.hope * 3}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={v.x} cy={v.y} r={v.size * 1.8} fill={c.color} opacity={0.12}>
                    <animate attributeName="opacity" values="0.12;0.2;0.12"
                      dur={`${2.5 + v.hope * 2}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={v.x} cy={v.y} r={v.size}
                    fill={c.color}
                    style={{
                      filter: `drop-shadow(0 0 ${8 + v.hope * 14}px ${c.glow})`,
                      transition: 'r 0.3s',
                    }}
                  />
                  {isHover && (
                    <circle cx={v.x} cy={v.y} r={v.size + 8}
                      fill="none" stroke={c.color} strokeWidth="1.5" strokeOpacity="0.6">
                      <animate attributeName="r" values={`${v.size + 8};${v.size + 16};${v.size + 8}`}
                        dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.6;0.2;0.6"
                        dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>

          {notes.map(v => {
            const c = conditionMap[v.condition]
            const isHover = hovered === v.id
            return (
              <button
                key={v.id}
                className={`space-note ${isHover ? 'is-hover' : ''} ${showCards ? 'show-card' : ''}`}
                style={{
                  left: v.x,
                  top: v.y,
                  '--nc': c.color,
                  '--ng': c.glow,
                }}
                onMouseEnter={() => setHovered(v.id)}
                onMouseLeave={() => setHovered(h => h === v.id ? null : h)}
                onClick={() => handleNoteClick(v)}
                aria-label={`${c.label}: ${v.quote}`}
              >
                {showLabel && (
                  <span className="space-note-label" style={{ color: c.color }}>
                    {c.label}
                  </span>
                )}
                {showCards && (
                  <span className="space-note-preview">
                    "{v.quote.length > 80 ? v.quote.slice(0, 80) + '…' : v.quote}"
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="space-minimap">
          <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="space-minimap-svg">
            {notes.map(v => {
              const c = conditionMap[v.condition]
              return <circle key={v.id} cx={v.x} cy={v.y} r={30} fill={c.color} opacity="0.7" />
            })}
            {containerRef.current && (
              <rect
                x={-pan.x / zoom}
                y={-pan.y / zoom}
                width={containerRef.current.getBoundingClientRect().width / zoom}
                height={containerRef.current.getBoundingClientRect().height / zoom}
                fill="none" stroke="#fff" strokeWidth={12} strokeOpacity="0.5" rx="8"
              />
            )}
          </svg>
        </div>

        <div className="space-hint">
          scroll to zoom · drag to explore · click a star to read
        </div>
      </div>

      <AnimatePresence>
        {selected && (() => {
          const c = conditionMap[selected.condition]
          return (
            <motion.div className="modal-backdrop" onClick={() => setSelected(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="modal" onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                <span className="modal-cond" style={{ color: c.color }}>{c.label}</span>
                <p className="modal-quote serif">"{selected.quote}"</p>
                <p className="modal-note">{selected.note}</p>
                <div className="modal-foot">
                  <span className="modal-handle">— u/{selected.handle}</span>
                  <button className="btn-ghost" onClick={() => setSelected(null)}>close ✕</button>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
