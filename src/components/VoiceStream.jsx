import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { voices, conditionMap } from '../data/voices.js'

function VoiceCard({ v, i }) {
  const ref = useRef(null)
  const c = conditionMap[v.condition]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const side = i % 2 === 0 ? -1 : 1
  const x = useTransform(scrollYProgress, [0, 0.5], [side * 70, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [side * 3, 0, side * -2])

  return (
    <motion.article
      ref={ref}
      className={`vcard ${i % 2 === 0 ? 'left' : 'right'}`}
      style={{ x, rotate, ['--c']: c.color, ['--g']: c.glow }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <span className="vcard-cond">{c.label}</span>
      <p className="vcard-quote serif">“{v.quote}”</p>
      <p className="vcard-note">{v.note}</p>
      <div className="vcard-foot">
        <span className="vcard-handle">u/{v.handle}</span>
        <span className="vcard-hope">
          <span className="vcard-hope-bar"><span style={{ width: `${v.hope * 100}%` }} /></span>
          hope
        </span>
      </div>
    </motion.article>
  )
}

export default function VoiceStream() {
  return (
    <section className="voices" id="voices">
      <div className="wrap voices-head">
        <p className="eyebrow">Read the threads</p>
        <h2 className="serif section-title">Stories that travel<br />the length of the dark.</h2>
        <p className="section-lead">
          Pulled from the spirit of the communities where people go when the waiting room
          empties and it's just them and the diagnosis at 2am. Different illnesses, one frequency.
        </p>
      </div>
      <div className="wrap voices-grid">
        {voices.map((v, i) => <VoiceCard v={v} i={i} key={v.id} />)}
      </div>
    </section>
  )
}
