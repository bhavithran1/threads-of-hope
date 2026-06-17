// Optional live Reddit feed. Attempts a public-JSON pull; on any failure the
// app keeps the curated voices from voices.js. Reddit blocks server/datacenter
// IPs (HTTP 403), so this usually no-ops in dev — it's wired for when the site
// is deployed somewhere that can reach Reddit, or behind a small proxy.

const SUBS = {
  chronic: 'ChronicIllness',
  cancer: 'cancer',
  mental: 'depression',
  diabetes: 'diabetes_t1',
  ms: 'MultipleSclerosis',
}

function clean(text = '') {
  return text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchVoices(condition) {
  const sub = SUBS[condition]
  if (!sub) return []
  const url = `https://www.reddit.com/r/${sub}/top/.json?t=year&limit=10&raw_json=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`reddit ${res.status}`)
  const json = await res.json()
  return (json?.data?.children || [])
    .map((c) => c.data)
    .filter((p) => p.selftext && p.selftext.length > 80 && !p.over_18)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      handle: p.author === '[deleted]' ? 'a_quiet_voice' : p.author,
      condition,
      hope: 0.5 + Math.min(0.4, (p.score || 0) / 5000),
      quote: clean(p.title),
      note: clean(p.selftext).slice(0, 320),
    }))
}
