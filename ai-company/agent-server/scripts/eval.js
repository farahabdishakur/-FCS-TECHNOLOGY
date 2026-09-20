// Cabbir sida AI-gu u jawaabayo su'aalaha caadiga ah (LLM la'aan).
//   node scripts/eval.js          -> aasaaska iyo su'aalaha hore loo diyaariyay kaliya
//   node scripts/eval.js --live   -> ku dar wixii aad baartay (data/knowledge.json)
import { readFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { loadDotEnv, loadConfig, ROOT } from '../src/config.js'
import { loadBrain } from '../src/brain.js'
import { createKnowledge } from '../src/knowledge.js'
import { detectLang } from '../src/guard.js'

loadDotEnv()
const cfg = loadConfig()
const brain = loadBrain(cfg.brainFile, { paymentDetails: cfg.paymentDetails })
const dataDir = process.argv.includes('--live') ? cfg.dataDir : mkdtempSync(path.join(tmpdir(), 'fcs-eval-'))
const knowledge = createKnowledge({ brain, dataDir, seedFile: cfg.seedFile, linksFile: cfg.linksFile, detailFile: cfg.detailFile, siteUrl: cfg.siteUrl, paymentDetails: cfg.paymentDetails })
const cases = JSON.parse(readFileSync(path.join(ROOT, '..', 'knowledge', 'eval-cases.json'), 'utf8'))

let pass = 0
const failures = []
for (const c of cases) {
  const r = knowledge.answer(c.q, { lang: detectLang(c.q), llmOn: false })
  const ok = c.unmatched ? !r.matched : r.matched && new RegExp(c.re, 'i').test(r.text)
  if (ok) pass++
  else failures.push({ q: c.q, want: c.unmatched ? '(waa in aan la aqoon)' : c.re, got: r.matched ? r.text.replace(/\n/g, ' ').slice(0, 120) : '(ma aqaan)' })
}

const pct = Math.round((pass / cases.length) * 100)
console.log(`\nJawaab sax ah: ${pass}/${cases.length} (${pct}%)   [seed: ${knowledge.seedCount}, la baray: ${knowledge.listTaught().length}]\n`)
for (const f of failures) console.log(`✗ ${f.q}\n    la rabay: ${f.want}\n    la helay: ${f.got}`)
console.log('\nSu\'aalaha kiiskan waxaa qoray Claude; ma aha su\'aalaha macaamiisha dhabta ah. Tijaabada dhabta ah waa marka macaamiil dhab ah la weydiiyo.')
process.exit(failures.length ? 1 : 0)
