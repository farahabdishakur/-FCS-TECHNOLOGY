// Ka soo saar xogta adeegyada ee website-ka (src/data/services.ts) → knowledge/service-links.json iyo services-detail.json.
// Orod mar kasta oo aad services.ts wax ka beddesho:  node scripts/gen-knowledge.js
import { writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, loadConfig } from '../src/config.js'
import { buildKnowledgeData, applyRowsToBrainText } from '../src/servicesSync.js'

const servicesTs = path.join(ROOT, '..', '..', 'src', 'data', 'services.ts')
const outDir = path.join(ROOT, '..', 'knowledge')
const { services } = await import(pathToFileURL(servicesTs).href)

const { links, detail, rows, dropped } = buildKnowledgeData(services)

writeFileSync(path.join(outDir, 'service-links.json'), JSON.stringify(links, null, 2))
writeFileSync(path.join(outDir, 'services-detail.json'), JSON.stringify(detail, null, 2))

// Jadwalka qiimaha ee FCS-AI-Company.md (QAYBTA A) sidoo kale la cusboonaysiiyaa si uusan AI-gu u sheegin qiimo duugoobay.
const brainFile = loadConfig({}).brainFile
const before = readFileSync(brainFile, 'utf8')
const { text: after, changed } = applyRowsToBrainText(before, rows)
if (after !== before) writeFileSync(brainFile, after)

console.log(`${services.length} adeeg · ${Object.values(detail).reduce((n, d) => n + d.faq.length, 0)} su'aal (${dropped} la iska ilaaliyay sababtoo ah sheeg khatar ah) · jadwalka qiimaha: ${changed} saf oo la cusboonaysiiyay`)
