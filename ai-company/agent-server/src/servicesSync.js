// Isku xidhka: src/data/services.ts (website) <-> ai-company/knowledge/*.json + FCS-AI-Company.md (AI-ga).
// Isticmaalka: scripts/gen-knowledge.js (developer, faylka services.ts) iyo /api/admin/sync-services (Admin dashboard, live).
export const RISKY = /24\/7|HIPAA|100%|\d+\+ (mashaariic|macaamiil)/i

// Website-ku wuxuu isticmaalaa "/mo"; jadwalka AI-gu wuxuu filayaa "/bil" (loadBrain: /\/bil/.test(priceText)).
export function toBrainPriceText(priceLabel) {
  return String(priceLabel || '').replace(/\/mo\b/gi, '/bil')
}

export function buildKnowledgeData(services) {
  const links = {}
  const detail = {}
  const rows = new Map()
  let dropped = 0
  for (const s of services || []) {
    const id = Number(s.id)
    if (!id) continue
    if (s.slug) links[id] = s.slug
    const faq = []
    for (const f of s.faq || []) {
      if (RISKY.test(f.a) || RISKY.test(f.q)) {
        dropped++
        continue
      }
      faq.push({ q: f.q, a: f.a })
    }
    detail[id] = {
      description: RISKY.test(s.description || '') ? '' : s.description || '',
      shortDesc: s.shortDesc || '',
      faq,
    }
    // Kaliya magaca/qiimaha/waqtiga ayaa halkan la isku xidhayaa (xogo bay'ad-ahaan sax ah oo iska bedeli kara).
    // "Waxa ku jira" (column-ka 5aad) waa la taaban maayo — waxaa ku jira digniino iyo faahfaahin gacanta lagu qoray
    // (tusaale: "Code-ka app-ka ma dhisno") oo aan si ammaan ah looga soo saari karin services.ts, oo lumin kara.
    rows.set(id, { name: s.popular ? `${s.name} ⭐` : s.name, priceText: toBrainPriceText(s.priceLabel), delivery: s.delivery || '' })
  }
  return { links, detail, rows, dropped }
}

const firstAmount = (priceText) => Number(priceText.match(/\$\s?(\d+(?:\.\d+)?)/)?.[1])

// Ku beddela magaca/waqtiga had iyo jeer (faahfaahin dheeraad ah oo aan wax lumin); qiimaha column-ka 3aad
// waxaa la beddelaa KALIYA marka lacagta ugu horeysa dhab ahaan isbedesho — haddii kale waxaa la ilaalinayaa
// qoraalka gacanta lagu qoray (tusaale bogga 15: "$20/sawir; 5 = $80; 10 = $150", oo services.ts kuma jiro).
// "Waxa ku jira" (column 5) iyo wax kale oo faylka ku jira lama taabanayo si aan loo lumin digniino muhiim ah.
// Soo celisa { text, changed } — changed waa tirada safafka ee DHAB AHAAN isbedelay (magac/qiimo/waqti), ma aha tirada la eegay.
export function applyRowsToBrainText(text, rows) {
  const ROW = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*$/
  let changed = 0
  const out = text
    .split('\n')
    .map((line) => {
      const m = line.match(ROW)
      if (!m) return line
      const u = rows.get(Number(m[1]))
      if (!u) return line
      const priceChanged = firstAmount(m[3]) !== firstAmount(u.priceText)
      const priceText = priceChanged ? u.priceText : m[3]
      const next = `| ${m[1]} | ${u.name} | ${priceText} | ${u.delivery} | ${m[5]} |`
      if (next !== line) changed++
      return next
    })
    .join('\n')
  return { text: out, changed }
}
