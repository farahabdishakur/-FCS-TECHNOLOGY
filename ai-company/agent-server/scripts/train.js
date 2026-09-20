// Tababaraha AI-ga. Su'aal waydii, arag jawaabta, haddii ay khaldan tahay sax.
// Wixii aad baarto waxay gashaan data/knowledge.json oo server-ku isla markiiba wuu isticmaalaa.
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { loadDotEnv, loadConfig } from '../src/config.js'
import { loadBrain } from '../src/brain.js'
import { createKnowledge } from '../src/knowledge.js'
import { detectLang } from '../src/guard.js'

loadDotEnv()
const cfg = loadConfig()
const brain = loadBrain(cfg.brainFile, { paymentDetails: cfg.paymentDetails })
const knowledge = createKnowledge({ brain, dataDir: cfg.dataDir, seedFile: cfg.seedFile, linksFile: cfg.linksFile, detailFile: cfg.detailFile, siteUrl: cfg.siteUrl, paymentDetails: cfg.paymentDetails })
const rl = readline.createInterface({ input, output })

const help = `
Sida loo isticmaalo:
  1) Qor su'aal sida macaamiil u qori lahaa (Soomaali, English ama Carabi).
  2) Arag jawaabta. Enter = sax. n = khalad, kadibna qor jawaabta saxda ah.
  3) Waxaad ku dari kartaa su'aalo kale oo isku macno ah.
Amarro:  /list  /forget <id>  /help  /exit
`

console.log('\nFCS AI — Tababare (su\'aalo hore loo diyaariyay: ' + knowledge.seedCount + ', aad baartay: ' + knowledge.listTaught().length + ')')
console.log(help)

for (;;) {
  const q = (await rl.question('Su\'aal > ')).trim()
  if (!q) continue
  if (q === '/exit' || q === '/quit') break
  if (q === '/help') {
    console.log(help)
    continue
  }
  if (q === '/list') {
    const list = knowledge.listTaught()
    console.log(list.length ? list.map((t) => `  #${t.id}  ${t.q}\n       -> ${t.a.slice(0, 100)}`).join('\n') : '  (weli waxba lama baran)')
    continue
  }
  if (q.startsWith('/forget')) {
    console.log(knowledge.forget(q.split(/\s+/)[1]) ? '  ✅ waa la tirtiray' : '  ma helin')
    continue
  }

  const r = knowledge.answer(q, { lang: detectLang(q), llmOn: false })
  if (r.matched) console.log(`\n🤖 [${r.kind}] ${r.text}\n`)
  else console.log('\n🤷 Ma aqaan su\'aashan. Macaamiilka waxaa loo sheegi lahaa "Farah ayaa kuu soo jawaabi doona".\n')

  const verdict = (await rl.question(r.matched ? 'Sax miyaa? (Enter = haa, n = maya) > ' : 'Ma baran rabtaa? (Enter = haa, n = maya) > ')).trim().toLowerCase()
  if (r.matched && verdict !== 'n') continue
  if (!r.matched && verdict === 'n') continue

  const correct = (await rl.question('Jawaabta saxda ah (qor, ama Enter si aad uga baxdo) > ')).trim()
  if (!correct) continue
  const item = knowledge.teach(q, correct)
  const more = (await rl.question('Su\'aalo kale oo isku macno ah (ku kala qaad "|", ama Enter) > ')).trim()
  for (const v of more.split('|').map((x) => x.trim()).filter(Boolean)) knowledge.teach(v, correct)
  console.log(`\n✅ Waan bartay (#${item.id}${more ? ' + ' + more.split('|').length + ' su\'aalo oo kale' : ''}). Isku day mar kale si aad u hubiso.\n`)
}

rl.close()
