import { useEffect, useRef } from 'react'

// Full-page animated starfield: depth-layered twinkling stars, slow drift,
// the occasional shooting star, and gentle parallax that follows the pointer
// and the scroll position. Pure canvas for performance.
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, dpr
    let stars = []
    let shooters = []
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let scrollY = 0
    let raf

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.width = innerWidth * dpr
      h = canvas.height = innerHeight * dpr
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
      const count = Math.min(260, Math.floor((innerWidth * innerHeight) / 6500))
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z: depth,
          r: (0.3 + depth * 1.7) * dpr,
          base: 0.25 + depth * 0.6,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.6,
          hue: Math.random() < 0.18 ? 265 : Math.random() < 0.3 ? 190 : 220,
          sat: Math.random() < 0.4 ? 40 : 12,
        }
      })
    }

    function spawnShooter() {
      if (reduce) return
      const fromLeft = Math.random() < 0.5
      shooters.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.5,
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 4) * dpr,
        vy: (1.2 + Math.random() * 1.5) * dpr,
        life: 1,
        len: (120 + Math.random() * 120) * dpr,
      })
    }

    let t = 0
    function draw() {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      const px = (pointer.x - 0.5)
      const py = (pointer.y - 0.5)
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      for (const s of stars) {
        const par = s.z * 26 * dpr
        const sx = s.x + px * par - (scrollY * dpr * (0.02 + s.z * 0.08)) % h
        let yy = s.y + py * par
        yy = ((yy % h) + h) % h
        const xx = ((sx % w) + w) % w
        const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * s.tws + s.tw)
        const a = s.base * tw
        ctx.beginPath()
        ctx.arc(xx, yy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, ${80}%, ${a})`
        ctx.fill()
        if (s.z > 0.7) {
          ctx.beginPath()
          ctx.arc(xx, yy, s.r * 2.6, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 80%, ${a * 0.12})`
          ctx.fill()
        }
      }

      // shooting stars
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i]
        sh.x += sh.vx
        sh.y += sh.vy
        sh.life -= 0.012
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx / Math.hypot(sh.vx, sh.vy) * sh.len, sh.y - sh.vy / Math.hypot(sh.vx, sh.vy) * sh.len)
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * sh.life})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6 * dpr
        ctx.beginPath()
        ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(sh.x - sh.vx / Math.hypot(sh.vx, sh.vy) * sh.len, sh.y - sh.vy / Math.hypot(sh.vx, sh.vy) * sh.len)
        ctx.stroke()
        if (sh.life <= 0 || sh.x < -100 || sh.x > w + 100) shooters.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      pointer.tx = e.clientX / innerWidth
      pointer.ty = e.clientY / innerHeight
    }
    function onScroll() { scrollY = window.scrollY }

    resize()
    draw()
    const shooterTimer = setInterval(() => { if (Math.random() < 0.6) spawnShooter() }, 4200)
    addEventListener('resize', resize)
    addEventListener('mousemove', onMove)
    addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(shooterTimer)
      removeEventListener('resize', resize)
      removeEventListener('mousemove', onMove)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={ref} className="sky-canvas" aria-hidden="true" />
}
