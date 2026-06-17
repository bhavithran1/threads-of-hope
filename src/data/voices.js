// Threads of Hope — voice data
// ----------------------------------------------------------------------------
// SOURCE NOTE: A live pull from public health subreddits (r/ChronicIllness,
// r/cancer, r/depression, r/diabetes_t1, r/MultipleSclerosis, r/lupus,
// r/ChronicPain, r/Anxiety) was attempted at build time. Reddit blocks
// programmatic access from this environment (HTTP 403), so the dataset below is
// the curated fallback: anonymized quotes hand-written in the authentic spirit
// of those communities. The shape mirrors Reddit's API, so `fetchVoices()` in
// reddit.js can drop real posts straight into this structure later.
// ----------------------------------------------------------------------------

export const conditions = [
  { id: 'chronic',  label: 'Chronic Illness',    color: '#5eead4', glow: '#2dd4bf' },
  { id: 'cancer',   label: 'Cancer',             color: '#fb7185', glow: '#f43f5e' },
  { id: 'mental',   label: 'Depression',         color: '#a78bfa', glow: '#8b5cf6' },
  { id: 'pain',     label: 'Chronic Pain',       color: '#fbbf24', glow: '#f59e0b' },
  { id: 'diabetes', label: 'Type 1 Diabetes',    color: '#38bdf8', glow: '#0ea5e9' },
  { id: 'ms',       label: 'Multiple Sclerosis', color: '#34d399', glow: '#10b981' },
  { id: 'lupus',    label: 'Lupus',              color: '#e879f9', glow: '#d946ef' },
  { id: 'anxiety',  label: 'Anxiety',            color: '#22d3ee', glow: '#06b6d4' },
]

export const conditionMap = Object.fromEntries(conditions.map((c) => [c.id, c]))

// hope = a 0..1 measure of how forward-looking the note is; drives brightness.
export const voices = [
  { id: 'v01', handle: 'paper_lanterns', condition: 'chronic', hope: 0.86,
    quote: 'I stopped measuring good days by what I produced and started measuring them by what I noticed.',
    note: 'Diagnosis took four years. Somewhere in the waiting I learned that resting is not quitting. A good day now is a slow coffee, a window of sun, a friend who texts back. That is enough, and it took being this sick to believe it.' },
  { id: 'v02', handle: 'eastwindow', condition: 'cancer', hope: 0.91,
    quote: 'Chemo took my hair. It did not take the part of me that still wanted to plant tomatoes in spring.',
    note: 'Ring the bell day is coming. I made a list of small futures to aim at — not a bucket list, a teaspoon list. Tiny things I can actually reach for. Turns out a teaspoon of future is plenty to hold onto.' },
  { id: 'v03', handle: 'low_tide_again', condition: 'mental', hope: 0.58,
    quote: 'Depression lies in your own voice, which is why it is so hard to catch it lying.',
    note: 'The thing nobody tells you: getting better is boring. It is drinking water and going outside and answering one message. It does not feel like a movie montage. It feels like nothing, repeated, until one day nothing feels survivable.' },
  { id: 'v04', handle: 'thirteen_steps', condition: 'pain', hope: 0.62,
    quote: 'People want a brave story. Mine is just that I counted to ten a lot and the pain eventually blinked first.',
    note: 'Chronic pain made me an expert in the geography of my own house — which chairs forgive me, which stairs are honest. I am tired of explaining the pain scale. Ten out of ten is the day you cannot find a single chair that loves you back.' },
  { id: 'v05', handle: 'sugarcube_pump', condition: 'diabetes', hope: 0.84,
    quote: 'My pancreas quit at 9 years old. I have been doing its homework ever since, and I am acing it.',
    note: 'Twenty years on insulin. The number on the meter is not a grade for my character — it took me a decade to learn that. A high reading is data, not a verdict. I am not bad at this. I am just doing an organ\'s full-time job by hand.' },
  { id: 'v06', handle: 'morning_fog_clearing', condition: 'ms', hope: 0.79,
    quote: 'MS taught me to bank energy like a currency. Some days I am rich. I spend those days loving people loudly.',
    note: 'The lesion on the scan looked so small to make my legs forget themselves. But remission came back, the way mornings do. I keep a list of every time my body surprised me by recovering. The list is longer than the relapses.' },
  { id: 'v07', handle: 'wolfsbane_smiles', condition: 'lupus', hope: 0.71,
    quote: 'Lupus is a wolf, sure. But I have learned to read its footprints before it gets to the door.',
    note: 'Flares used to feel like ambushes. Now I know my own early warnings — the rash before the rash, the tired before the tired. Knowing the wolf is coming means I can lock the windows in time. That is a kind of power they do not warn you about.' },
  { id: 'v08', handle: 'breathe_in_four', condition: 'anxiety', hope: 0.74,
    quote: 'My anxiety is a smoke alarm wired to a toaster. Loud, often wrong, and still trying to protect me.',
    note: 'I used to be ashamed of the panic. Now I thank it and then overrule it. Four counts in, hold, six counts out. It is not gone. It is just no longer the one driving. I am in the front seat now and it is in the back, narrating badly.' },
  { id: 'v09', handle: 'spoonkeeper', condition: 'chronic', hope: 0.69,
    quote: 'I am not lazy. I am running an entire life on a phone at 4% with no charger in sight.',
    note: 'Spoon theory saved my relationships because it gave the invisible a number. When I say I am out of spoons, I am not being dramatic — I am telling you the true weather inside a body you cannot see the sky of.' },
  { id: 'v10', handle: 'second_opinion_sky', condition: 'cancer', hope: 0.88,
    quote: 'They said months. That was three years and one new grandchild ago. Statistics are not prophecies.',
    note: 'I am not in denial about the odds. I just refuse to live inside a percentage. The scan is every twelve weeks. In between, I am fully, ridiculously alive. Hope is not pretending the cliff is not there. It is dancing carefully near it.' },
  { id: 'v11', handle: 'undertow_kid', condition: 'mental', hope: 0.66,
    quote: 'Recovery is not a door you walk through once. It is a hallway you keep choosing to stay in.',
    note: 'I relapsed and felt like I had failed the whole thing. My therapist said relapse is not the opposite of recovery, it is part of it. Nobody learns to swim without going under. The goal was never to stop drowning. It was to learn the way back up.' },
  { id: 'v12', handle: 'titanium_knees', condition: 'pain', hope: 0.77,
    quote: 'I grieve the body I had. Then I make tea for the body I have. Both feelings live here now.',
    note: 'I will not pretend pain made me wiser as a trade I would accept. But it did make me gentle — to myself first, finally, and then to everyone else who is quietly hurting and still showing up anyway. I clock them now. We nod.' },
  { id: 'v13', handle: 'dawn_patrol_bg', condition: 'diabetes', hope: 0.81,
    quote: 'A 3am low is its own kind of lonely. But I have woken up every single time. My streak is one hundred percent.',
    note: 'Burnout is real and nobody talks about the math of it — the constant calculation, the never-a-day-off of it. But I found my people online who count carbs in their sleep too. Suddenly the loneliest disease had the warmest group chat.' },
  { id: 'v14', handle: 'remission_garden', condition: 'ms', hope: 0.83,
    quote: 'I cannot run anymore. So I learned the names of every bird that visits the feeder. Slowness has its own list.',
    note: 'When the diagnosis came I mourned the future I had drawn. Then I drew a different one with the hand that still works fine. It has fewer marathons and more mornings. I would not have chosen this. But I am not empty here.' },
  { id: 'v15', handle: 'butterfly_mask', condition: 'lupus', hope: 0.64,
    quote: 'You look fine is the four-word sentence that follows me into every room. I have stopped flinching at it.',
    note: 'Invisible illness means proving you are sick to people who want you well for their own comfort. I let that go this year. I am not a court case. I do not owe anyone the evidence of my exhaustion. I just owe myself the rest.' },
  { id: 'v16', handle: 'grounding_five', condition: 'anxiety', hope: 0.8,
    quote: 'Five things I can see. Four I can touch. The world is still here and so, it turns out, am I.',
    note: 'The ER visit that turned out to be a panic attack was the most embarrassing night of my life and also the night I finally got help. Sometimes the breakdown is the doorway. I walked through mine shaking and I am still glad I did.' },
  { id: 'v17', handle: 'half_marathon_maybe', condition: 'chronic', hope: 0.72,
    quote: 'My body and I are not at war. We are two old roommates negotiating the thermostat for the hundredth time.',
    note: 'Acceptance is not surrender. I fought that idea for years. Accepting my limits did not make them bigger — it made them mappable. Now I plan around the cliffs instead of falling off them surprised every single afternoon.' },
  { id: 'v18', handle: 'caregiver_too', condition: 'cancer', hope: 0.76,
    quote: 'I held the bucket, learned the meds, lost the same person twice — to the disease, then to remission anxiety.',
    note: 'Nobody hands the caregiver a pamphlet. I am the one who looks fine in the waiting room. But I am in this constellation too. We are the quiet stars holding the bright ones in place while they burn through treatment.' },
]

// scatter helper — gives each voice a stable pseudo-random sky position (0..1)
function seeded(i, salt) {
  const x = Math.sin((i + 1) * 9301 + salt * 49297) * 233280
  return x - Math.floor(x)
}
export const positionedVoices = voices.map((v, i) => ({
  ...v,
  x: 0.08 + seeded(i, 1) * 0.84,
  y: 0.1 + seeded(i, 2) * 0.8,
  size: 2.5 + v.hope * 4,
}))

export const stats = [
  { value: 133, suffix: 'M', label: 'Americans live with a chronic condition' },
  { value: 1, prefix: 'in ', suffix: ' 3', label: 'adults manages multiple at once' },
  { value: 90, suffix: '%', label: 'say being heard changed their outlook' },
  { value: 0, suffix: '', label: 'voices in this sky go unanswered', dynamic: true },
]
