import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Starfield from './components/Starfield.jsx'
import Hero from './components/Hero.jsx'
import Constellation from './components/Constellation.jsx'
import SpaceExplorer from './components/SpaceExplorer.jsx'
import Stats from './components/Stats.jsx'
import ShareThread from './components/ShareThread.jsx'
import { Nav, ScrollProgress, Footer, Marquee } from './components/Chrome.jsx'
import { voices } from './data/voices.js'
import './App.css'

export default function App() {
  const [liveCount, setLiveCount] = useState(voices.length)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf
    function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <>
      <div className="nebula" aria-hidden="true" />
      <Starfield />
      <ScrollProgress />
      <Nav />
      <main id="top">
        <Hero />
        <Constellation />
        <Marquee />
        <Stats liveCount={liveCount} />
        <SpaceExplorer />
        <ShareThread onAdd={() => setLiveCount((c) => c + 1)} />
      </main>
      <Footer />
    </>
  )
}
