import { readFileSync, writeFileSync, existsSync, statSync, renameSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const STOP = new Set(
  'iyo ama oo waa ma ka ku la u uu aan aad ayaa ayaan waxaan waxaad wuxuu waxay the a an is are to of for in on and or it my me i you your do does can what how ah ee iga igu kuu noo ii na si sida ha hadda fadlan please karaa kartaa karo karin kara will'.split(' '),
)

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .replace(/(^| )ال(?=[؀-ۿ]{2,})/g, '$1')
    .trim()
}

const stem = (t) => (/^[a-z]+$/.test(t) && t.length > 5 ? t.replace(/(yada|yaha|ka|ga|ha|da|ta|sha|ku|gu)$/, '') : t)

export function tokens(text) {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length >= 2 && !STOP.has(t))
    .map(stem)
}

const SERVICE_ALIASES = {
  1: [['wordpress', 3], ['ووردبريس', 3], ['website', 1], ['web site', 1], ['bog web', 1], ['mareeg', 1], ['موقع', 1]],
  2: [['woocommerce', 3], ['online store', 3], ['dukaan online', 3], ['store online', 3], ['iibi online', 2], ['متجر', 2]],
  3: [['landing', 3], ['hal bog', 2]],
  4: [['mobile app', 3], ['application', 2], ['app', 2], ['تطبيق', 2]],
  5: [['software', 2], ['calculator', 2], ['tracker', 2], ['barnaamij', 2]],
  6: [['chatbot', 3], ['chat bot', 3], ['whatsapp bot', 3], ['bot', 2]],
  7: [['database', 3], ['management system', 2], ['nidaam maamul', 2], ['admin dashboard', 2]],
  8: [['cv', 3], ['resume', 3], ['سيرة', 3]],
  9: [['cover letter', 3], ['warqad codsi', 3]],
  10: [['portfolio', 3]],
  11: [['business plan', 3], ['proposal', 3], ['qorshe ganacsi', 3], ['qorshaha ganacsi', 3]],
  12: [['research', 3], ['report', 2], ['warbixin', 2]],
  13: [['logo', 3], ['شعار', 3], ['calaamad', 1]],
  14: [['menu', 3], ['liiska cuntada', 2]],
  15: [['social media', 3], ['graphics', 2], ['sawir social', 2], ['instagram', 1], ['facebook', 1], ['tiktok', 1]],
  16: [['business card', 3], ['kaarka ganacsi', 3], ['kaar ganacsi', 3], ['visiting card', 3], ['card', 1]],
  17: [['presentation', 3], ['pitch deck', 3], ['slides', 2], ['powerpoint', 2]],
  18: [['infographic', 3]],
  19: [['brochure', 3], ['flyer', 3]],
  20: [['spreadsheet', 3], ['google sheets', 3], ['excel', 2], ['sheets', 2]],
  21: [['school', 3], ['iskuul', 3], ['madrasad', 2]],
  22: [['hotel', 3], ['huteel', 3]],
  23: [['cafe', 3], ['maqaaxi', 3], ['restaurant', 3], ['pos', 1]],
  24: [['hospital', 3], ['clinic', 3], ['isbitaal', 3], ['xarun caafimaad', 3]],
  25: [['supermarket', 3], ['dukaan', 2], ['dukaamo', 2], ['barcode', 2], ['shop', 1], ['pos', 1]],
  26: [['pharmacy', 3], ['farmasi', 3], ['farmaasi', 3]],
  27: [['real estate', 3], ['guryo', 3], ['guri kiro', 3], ['tenant', 3], ['kiro', 2]],
  28: [['e commerce', 3], ['ecommerce', 3], ['order system', 2], ['nidaam dalab', 2]],
  29: [['gym', 3], ['fitness', 3], ['jimicsi', 3]],
  30: [['tailor', 3], ['harqaan', 3], ['dhar', 2]],
}

const CATEGORIES = [
  { ids: [1, 2, 3, 4, 5, 6, 7], so: 'Web & Tech', en: 'Web & Tech', ar: 'الويب والتقنية' },
  { ids: [8, 9, 10, 11, 12], so: 'Dukumiintiyo & Shaqo', en: 'Documents & Career', ar: 'المستندات والوظائف' },
  { ids: [13, 14, 15, 16, 17, 18, 19], so: 'Design', en: 'Design', ar: 'التصميم' },
  { ids: [20], so: 'Xogta & Automation', en: 'Data & Automation', ar: 'البيانات والأتمتة' },
  { ids: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], so: 'Nidaamyada Ganacsiga', en: 'Business Systems', ar: 'أنظمة الأعمال' },
]
const HIGHLIGHT = { 1: 1, 2: 1, 3: 1, 6: 1, 8: 1, 9: 1, 11: 1, 13: 1, 16: 1, 14: 1, 20: 1, 21: 1, 23: 1, 25: 1, 26: 1 }

const INTENT = {
  price: /(qiim|immisa|imisa|sacar|price|cost|how much|kharash|lacag ah|كم سعر|سعر|ثمن|بكم)/,
  time: /(waqti|muddo|intee|maalmo|malmo|how long|delivery|deliver|duration|goorma la dhamays|مدة|كم يوم)/,
  includes: /(ku jir|waxa ku|leedahay|include|features|sifo|ka kooban|what do i get|what is|waa maxay|sharax|explain|tell me about|details|faahfaahin|تشمل|ماذا)/,
  revision: /(revision|beddel|hagaaj|isbeddel|ku qanac|garanti|guarantee|تعديل)/,
  order: /(dalbo|dalbanayaa|dalbasho|rabaa|rabaan|rabo|i want|i need|order|buy|iibso|ii samee|noo samee|bilow|start|أريد|اريد|اطلب)/,
}

const TOPIC = {
  catalogue: /(maxaad bixi|maxaad sameys|maxaad haysaa|adeegyada|adeegyo|adeegyadiinna|services|what do you (offer|do|provide)|what can you|maxaad kaa caawin|ماذا تقدمون|خدماتكم)/,
  payment: /(lacag\w*\s+(?:\w+\s+){0,2}bixi|bixi\w*\s+(?:\w+\s+){0,2}lacag|bixin|sidee ku bixi|evc|hormuud|western|zaad|payment|how do i pay|deposit|الدفع)/,
  contact: /(xiriir|contact|whatsapp|telefoon|taleefan|lambar|number|email|cinwaan|address|halkee|location|meesha|borama|اتصال|رقم|عنوان)/,
  portfolio: /(portfolio|shaqooyin hore|tusaale|examples|sample|أعمال)/,
  hosting: /(hosting|domain|host)/,
  language: /(luuqad|afaf|language|arabic|english|somali|لغة)/,
  support: /(taageero|support|after sale|kadib dhamaadka)/,
  howOrder: /(sidee.*(dalab|dalbo|bilow)|how (do i|to|can i) (order|start|buy)|dalab sameyn)/,
  greeting: /^(asc|assalaamu|salaan|hello|hi|hey|iska warran|subax|galab|marhaba|مرحبا|السلام)/,
  thanks: /(mahadsanid|mahad|thanks|thank you|شكرا)/,
  who: /(yaa tahay|maxaad tahay|who are you|qof dhab|robot|aadane|human|ai ma tahay|من انت)/,
}

const INFO_INTENTS = new Set(['price', 'time', 'includes', 'revision'])
const SOCIAL = ['greeting', 'thanks', 'who']
const INFO_TOPICS_WITH_LLM = new Set(['catalogue', 'payment', 'contact', 'portfolio', 'hosting', 'language', 'support', 'howOrder'])

const ONLY = (lang, o) => o[lang] ?? o.en ?? o.so

function fmtTime(t, lang) {
  const so = t.replace(/(\d)\s*m\b/i, '$1 maalmood')
  return lang === 'en'
    ? so.replace(/maalmood/gi, 'days').replace(/\bmaalin\b/gi, 'day').replace(/saacadood/gi, 'hours').replace(/\bsaac\b/gi, 'hours')
    : so
}

export function createKnowledge({ brain, store = null, dataDir, seedFile = null, linksFile = null, detailFile = null, siteUrl = '', paymentDetails = '' }) {
  let catalogById = new Map(brain.catalog.map((s) => [s.id, s]))
  const price = (svc, lang) => (lang === 'en' ? svc.priceText.replace('/bil', '/month').replace('(Hal Mar)', '(one-time)') : svc.priceText)

  const taughtFile = path.join(dataDir, 'knowledge.json')
  let cache = { mtime: -1, data: { seq: 0, taught: [] } }
  function loadTaught() {
    try {
      const mtime = statSync(taughtFile).mtimeMs
      if (mtime !== cache.mtime) cache = { mtime, data: JSON.parse(readFileSync(taughtFile, 'utf8')) }
    } catch {
      cache = { mtime: -1, data: { seq: 0, taught: [] } }
    }
    return cache.data
  }
  function saveTaught(data) {
    mkdirSync(dataDir, { recursive: true })
    const tmp = taughtFile + '.tmp'
    writeFileSync(tmp, JSON.stringify(data, null, 2))
    renameSync(tmp, taughtFile)
    cache = { mtime: statSync(taughtFile).mtimeMs, data }
  }

  let links = {}
  if (linksFile && existsSync(linksFile)) links = JSON.parse(readFileSync(linksFile, 'utf8'))
  const base = siteUrl.replace(/\/$/, '')
  const serviceLink = (id) => (base && links[id] ? `${base}/services/${links[id]}` : '')
  const linkLabel = (lang) => ONLY(lang, { so: 'Faahfaahin iyo dalab toos ah', en: 'Details and direct order', ar: 'التفاصيل والطلب المباشر' })

  let detail = {}
  if (detailFile && existsSync(detailFile)) detail = JSON.parse(readFileSync(detailFile, 'utf8'))

  let seed = []
  if (seedFile && existsSync(seedFile)) seed = JSON.parse(readFileSync(seedFile, 'utf8'))

  // Marka services.ts/Admin la beddelo oo brain.catalog dib loo soo rareeyo (app.js: reloadBrain), taas oo la socota.
  function reload() {
    catalogById = new Map(brain.catalog.map((s) => [s.id, s]))
    links = linksFile && existsSync(linksFile) ? JSON.parse(readFileSync(linksFile, 'utf8')) : {}
    detail = detailFile && existsSync(detailFile) ? JSON.parse(readFileSync(detailFile, 'utf8')) : {}
    seed = seedFile && existsSync(seedFile) ? JSON.parse(readFileSync(seedFile, 'utf8')) : []
    vocab = { key: null, set: new Set(), list: [] }
  }

  function detectServices(text) {
    const n = ' ' + normalize(text) + ' '
    const scores = []
    for (const [id, aliases] of Object.entries(SERVICE_ALIASES)) {
      let score = 0
      for (const [alias, w] of aliases) if (n.includes(' ' + alias) || n.startsWith(alias)) score += w
      if (score > 0) scores.push({ id: Number(id), score })
    }
    scores.sort((a, b) => b.score - a.score || a.id - b.id)
    return scores
  }

  function detectIntent(n) {
    for (const k of ['price', 'revision', 'time', 'includes', 'order']) if (INTENT[k].test(n)) return k
    return null
  }

  function revisionInfo(svc) {
    return svc.includes.match(/revision aan xad lahayn|\d+\s*revision|unlimited text changes/i)?.[0] || ''
  }

  function serviceText(svc, intent, lang) {
    const time = fmtTime(svc.time, lang)
    const inc = svc.includes.length > 380 ? svc.includes.slice(0, 380) + '…' : svc.includes
    const monthlyNote = svc.monthly
      ? ONLY(lang, {
          so: ' Bilaha waa kirada server-ka daruuriga ah, database iyo taageero farsamo.',
          en: ' The monthly fee covers cloud server, database and technical support.',
        })
      : ''
    const cta = ONLY(lang, {
      so: '\nMa rabtaa inaan bilowno? Ii sheeg waxaad u baahan tahay.',
      en: '\nWould you like to start? Tell me what you need.',
      ar: '\nهل تريد أن نبدأ؟ أخبرني ماذا تحتاج.',
    })
    const desc = detail[svc.id]?.description || ''
    const url = serviceLink(svc.id)
    const link = url ? `\n🔗 ${linkLabel(lang)}: ${url}` : ''
    if (lang === 'ar') return `${svc.name}: ${svc.priceText}. ${time}.${link}${cta}`
    if (intent === 'time')
      return ONLY(lang, {
        so: `${svc.name} waxay qaadataa ${time}.${link}${cta}`,
        en: `${svc.name} takes ${time}.${link}${cta}`,
      })
    if (intent === 'includes')
      return ONLY(lang, {
        so: `${svc.name} (${price(svc, lang)})${desc ? ': ' + desc : ''}\nWaxaa ku jira: ${inc}.${monthlyNote}${link}${cta}`,
        en: `${svc.name} (${price(svc, lang)})${desc ? ': ' + desc : ''}\nIncludes: ${inc}.${monthlyNote}${link}${cta}`,
      })
    if (intent === 'revision') {
      const rev = revisionInfo(svc)
      return ONLY(lang, {
        so: rev
          ? `${svc.name}: ${rev}. Wixii ka badan xadkaas Farah ayaa kula heshiinaya.`
          : `${svc.name}: revision gaar ah lama qorin. Farah ayaa kuu sheegi doona xadka saxda ah.`,
        en: rev
          ? `${svc.name}: ${rev}. Anything beyond that limit is agreed with Farah.`
          : `${svc.name}: no specific revision limit is listed. Farah will confirm the exact limit.`,
      })
    }
    return ONLY(lang, {
      so: `${svc.name}: ${price(svc, lang)}. Waqtiga: ${time}.${monthlyNote}\nWaxaa ku jira: ${inc}.${link}${cta}`,
      en: `${svc.name}: ${price(svc, lang)}. Delivery: ${time}.${monthlyNote}\nIncludes: ${inc}.${link}${cta}`,
    })
  }

  function catalogueText(lang) {
    const lines = CATEGORIES.map((c) => {
      const picks = c.ids.filter((id) => HIGHLIGHT[id]).map((id) => catalogById.get(id)).filter(Boolean)
      const list = picks.map((s) => `${s.name} ${price(s, lang)}`).join(', ')
      return `• ${c[lang] || c.so}: ${list}`
    })
    const all = base ? ONLY(lang, { so: `\n🔗 Dhammaan adeegyada: ${base}/services`, en: `\n🔗 All services: ${base}/services`, ar: `\n🔗 كل الخدمات: ${base}/services` }) : ''
    return ONLY(lang, {
      so: `Waxaan bixinnaa ${brain.catalog.length} adeeg:\n${lines.join('\n')}\nSheeg midka aad rabto (tusaale: "logo" ama "nidaam maqaaxi") oo waan sharaxayaa.${all}`,
      en: `We offer ${brain.catalog.length} services:\n${lines.join('\n')}\nTell me which one you want (e.g. "logo" or "cafe system") and I will explain.${all}`,
      ar: `نقدم ${brain.catalog.length} خدمة:\n${lines.join('\n')}\nأخبرني أيها تريد وسأشرحها.${all}`,
    })
  }

  function topicText(topic, lang) {
    const pay = paymentDetails
    switch (topic) {
      case 'payment':
        return ONLY(lang, {
          so: `Lacag-bixinta: 50% horay, 50% marka shaqada la dhammeeyo. Habka: EVC Plus, Hormuud ama Western Union.${pay ? ' ' + pay : ' Farah ayaa kuu soo diri doona lambarka marka dalabka la xaqiijiyo.'}`,
          en: `Payment: 50% upfront and 50% on completion, via EVC Plus, Hormuud or Western Union.${pay ? ' ' + pay : ' Farah will send you the number once the order is confirmed.'}`,
          ar: 'الدفع: 50% مقدمًا و50% عند التسليم عبر EVC Plus أو Hormuud أو Western Union.',
        })
      case 'contact':
        return ONLY(lang, {
          so: 'Nala soo xiriir: WhatsApp/Tel +252 63 713 3499, email farahabdishakurdahir@gmail.com. Goobta: Borama, Somaliland.',
          en: 'Contact us: WhatsApp/Tel +252 63 713 3499, email farahabdishakurdahir@gmail.com. Location: Borama, Somaliland.',
          ar: 'تواصل معنا: واتساب +252 63 713 3499، البريد farahabdishakurdahir@gmail.com. الموقع: بوراما، أرض الصومال.',
        })
      case 'portfolio':
        return ONLY(lang, {
          so: 'Shaqooyinkeena hore waxaad ka arki kartaa bogga Portfolio ee website-ka.',
          en: 'You can see our previous work on the Portfolio page of the website.',
          ar: 'يمكنك مشاهدة أعمالنا السابقة في صفحة Portfolio بالموقع.',
        })
      case 'hosting':
        return ONLY(lang, {
          so: 'WordPress website-ka kuma jiro hosting; waan kaa caawinaa inaad hesho mid jaban. Nidaamyada ganacsiga bilaha ($/bil) waxay daboolaan server-ka daruuriga ah.',
          en: 'The WordPress website price does not include hosting; we help you find an affordable one. For business systems, the monthly fee covers the cloud server.',
        })
      case 'language':
        return ONLY(lang, {
          so: 'Waxaan ka shaqaynnaa Somali, English iyo Arabic.',
          en: 'We work in Somali, English and Arabic.',
          ar: 'نعمل بالصومالية والإنجليزية والعربية.',
        })
      case 'support':
        return ONLY(lang, {
          so: 'Adeeg kasta wuxuu leeyahay muddo taageero (tusaale website 1 bil, dukaan 2 bil, chatbot 3 bil). Nidaamyada ganacsiga waxaa taageerada ku jira bilaha.',
          en: 'Each service includes a support period (e.g. website 1 month, store 2 months, chatbot 3 months). Business systems are supported through the monthly fee.',
        })
      case 'howOrder':
        return ONLY(lang, {
          so: 'Dalab sameyn waa fudud: (1) ii sheeg adeegga aad rabto iyo ujeedadaada, (2) waan kuu sheegnaa qiimaha iyo waqtiga, (3) magacaaga iyo lambarkaaga qor, Farah ayaa xaqiijinaya, (4) 50% horay ayaa la bixiyaa.',
          en: 'Ordering is simple: (1) tell me the service and your goal, (2) we give you the price and time, (3) leave your name and number so Farah can confirm, (4) 50% is paid upfront.',
        })
      case 'greeting':
        return ONLY(lang, {
          so: 'Asc! Waxaan ahay caawiyaha AI ee FCS Technology. Waxaan kaa caawin karaa qiimaha, waqtiga, waxa ku jira adeegyada iyo dalabka. Maxaad rabtaa?',
          en: 'Hello! I am the AI assistant of FCS Technology. I can help with prices, delivery times, what each service includes, and orders. What do you need?',
          ar: 'أهلاً! أنا المساعد الذكي لشركة FCS Technology. يمكنني مساعدتك في الأسعار والمدد والطلبات. ماذا تحتاج؟',
        })
      case 'thanks':
        return ONLY(lang, { so: 'Adigaa mudan! Haddii aad wax kale u baahato, halkan ayaan joognaa.', en: "You're welcome! If you need anything else, we're here.", ar: 'على الرحب والسعة! نحن هنا إن احتجت شيئًا آخر.' })
      case 'who':
        return ONLY(lang, {
          so: 'Waxaan ahay caawiyaha AI ee FCS Technology, ma aha qof. Farah Abdishakur ayaa xaqiijiya go\'aannada muhiimka ah (lacag, dhimis, heshiis).',
          en: 'I am the AI assistant of FCS Technology, not a person. Farah Abdishakur confirms the important decisions (payment, discounts, contracts).',
          ar: 'أنا المساعد الذكي لشركة FCS Technology ولست شخصًا. فرح عبد الشكور يؤكد القرارات المهمة.',
        })
      default:
        return ''
    }
  }

  function orderText(svc, lang) {
    if (!svc) return catalogueText(lang)
    const head = serviceText(svc, 'price', lang).replace(/\n(Ma rabtaa|Would you|هل تريد).*$/s, '')
    return ONLY(lang, {
      so: `${head}\n\nSi aan u bilowno ii sheeg: (1) waxa aad u rabto iyo ujeedada, (2) goorma u baahan tahay. Kadib qor magacaaga iyo lambarkaaga (WhatsApp), Farah ayaa kuu xaqiijinaya dalabka.`,
      en: `${head}\n\nTo get started, tell me: (1) what you need and the goal, (2) when you need it. Then leave your name and WhatsApp number and Farah will confirm the order.`,
      ar: `${head}\n\nللبدء أخبرني: (1) ماذا تحتاج، (2) متى تحتاجه. ثم اترك اسمك ورقم واتساب وسيؤكد فرح الطلب.`,
    })
  }

  function matchList(text, entries) {
    const q = new Set(tokens(text))
    if (!q.size) return null
    let best = null
    for (const entry of entries) {
      const variants = Array.isArray(entry.q) ? entry.q : [entry.q]
      for (const v of variants) {
        const tok = new Set(tokens(v))
        if (!tok.size) continue
        let inter = 0
        for (const x of tok) if (q.has(x)) inter++
        const dice = (2 * inter) / (tok.size + q.size)
        const contain = inter / tok.size
        const score = dice >= 0.6 || (contain >= 0.8 && tok.size >= 2) ? Math.max(dice, contain) : 0
        if (score && (!best || score > best.score)) best = { entry, score }
      }
    }
    return best
  }

  function answerExact(text, { lang = 'so', lastService = null, llmOn = false } = {}) {
    const n = normalize(text)
    if (!n) return { matched: false }

    const taught = matchList(text, loadTaught().taught)
    if (taught) return { matched: true, text: taught.entry.a, kind: 'taught', id: taught.entry.id }
    const services = detectServices(text)
    const top = services[0]
    const ambiguous = top && services[1] && services[1].score === top.score && top.score < 3
    const intent = detectIntent(n)
    const infoTopic = Object.keys(TOPIC).find((k) => !SOCIAL.includes(k) && TOPIC[k].test(n))
    const socialTopic = SOCIAL.find((k) => TOPIC[k].test(n))

    const useContext = !top && lastService && INFO_INTENTS.has(intent)
    const serviceId = top && !ambiguous ? top.id : useContext ? Number(lastService) : null

    if (serviceId && INFO_INTENTS.has(intent)) {
      return { matched: true, text: serviceText(catalogById.get(serviceId), intent, lang), kind: 'service', serviceId, intent }
    }

    const faqOwner = top && !ambiguous ? top.id : lastService ? Number(lastService) : null
    const svcFaq = faqOwner && detail[faqOwner]?.faq?.length ? matchList(text, detail[faqOwner].faq) : null
    if (svcFaq) {
      const url = serviceLink(faqOwner)
      return { matched: true, text: svcFaq.entry.a + (url ? `\n🔗 ${linkLabel(lang)}: ${url}` : ''), kind: 'service-faq', serviceId: faqOwner }
    }

    const seeded = matchList(text, seed)
    if (seeded) return { matched: true, text: (lang === 'en' && seeded.entry.en) || seeded.entry.a, kind: 'seed' }

    if (ambiguous && (INFO_INTENTS.has(intent) || intent === 'order' || !llmOn)) {
      const options = services.filter((s) => s.score === top.score).map((s) => catalogById.get(s.id))
      return {
        matched: true,
        kind: 'clarify',
        text: ONLY(lang, {
          so: `Waxaan haynaa: ${options.map((s) => `${s.name} (${price(s, lang)})`).join(' iyo ')}. Kee ayaad rabtaa?`,
          en: `We have: ${options.map((s) => `${s.name} (${price(s, lang)})`).join(' and ')}. Which one do you need?`,
        }),
      }
    }

    if (infoTopic && (INFO_TOPICS_WITH_LLM.has(infoTopic) || !llmOn)) {
      const reply = infoTopic === 'catalogue' ? catalogueText(lang) : topicText(infoTopic, lang)
      return { matched: true, text: reply, kind: 'general' }
    }

    if (llmOn) return { matched: false }

    if (serviceId) {
      const svc = catalogById.get(serviceId)
      return { matched: true, text: intent === 'order' ? orderText(svc, lang) : serviceText(svc, 'price', lang), kind: 'service', serviceId, intent }
    }
    if (intent === 'order') return { matched: true, text: orderText(null, lang), kind: 'general' }
    if (socialTopic) return { matched: true, text: topicText(socialTopic, lang), kind: 'general' }
    return { matched: false }
  }


  const KEYWORDS = 'qiimo qiimaha immisa sacar price cost kharash waqti waqtiga muddo intee maalmood delivery revision dalab dalbo rabaa order buy lacag lacagta bixin bixiyaa evc hormuud western zaad payment xiriir contact whatsapp telefoon taleefan lambar number email cinwaan address portfolio hosting domain luuqad language taageero support adeegyada adeegyo services maxaad kartaa sameysaan haysaa include features sharax faahfaahin dhimis discount iskuul maqaaxi huteel farmasi dukaan guryo harqaan jimicsi caafimaad bille server mahadsanid salaan sidee fadlan website wordpress woocommerce landing chatbot database resume cover letter business proposal report research logo menu presentation infographic brochure flyer spreadsheet excel hospital clinic pharmacy supermarket tailor cafe restaurant school hotel store online mobile software'.split(' ')
  const VARIANTS = { kafe: 'cafe', iskool: 'iskuul', skool: 'iskuul', websait: 'website', sistem: 'nidaam', sistam: 'nidaam' }

  let vocab = { key: null, set: new Set(), list: [] }
  function getVocab() {
    const key = cache.mtime
    if (vocab.key === key && vocab.set.size) return vocab
    const set = new Set(KEYWORDS)
    for (const aliases of Object.values(SERVICE_ALIASES)) for (const [alias] of aliases) for (const w of alias.split(' ')) set.add(w)
    for (const svc of brain.catalog) for (const w of normalize(svc.name).split(' ')) set.add(w)
    for (const entry of [...seed, ...loadTaught().taught]) for (const q of Array.isArray(entry.q) ? entry.q : [entry.q]) for (const w of normalize(q).split(' ')) set.add(w)
    const strong = new Set(KEYWORDS)
    for (const aliases of Object.values(SERVICE_ALIASES)) for (const [alias] of aliases) for (const w of alias.split(' ')) strong.add(w)
    vocab = { key, set, strong, list: [...set].filter((w) => w.length >= 4 && !STOP.has(w)) }
    return vocab
  }

  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1
    const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
    for (let j = 1; j <= b.length; j++) rows[0][j] = j
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
      }
    }
    return rows[a.length][b.length]
  }

  function correctToken(t) {
    if (t.length < 4 || STOP.has(t) || /\d/.test(t) || /[\u0600-\u06ff]/.test(t)) return t
    const v = getVocab()
    if (v.set.has(t)) return t
    if (VARIANTS[t]) return VARIANTS[t]
    const maxD = t.length <= 5 ? 1 : 2
    let bestD = maxD + 1
    let cands = []
    for (const w of v.list) {
      const d = distance(t, w, maxD)
      if (d < bestD) {
        bestD = d
        cands = [w]
      } else if (d === bestD && d <= maxD) cands.push(w)
    }
    if (bestD > maxD) return t
    const sameFirst = cands.filter((w) => w[0] === t[0])
    if (sameFirst.length === 1) return sameFirst[0]
    const strongOnes = sameFirst.filter((w) => v.strong.has(w))
    if (strongOnes.length === 1) return strongOnes[0]
    if (cands.length === 1 && t.length > 5) return cands[0]
    return t
  }

  const correctText = (text) => normalize(text).split(' ').map(correctToken).join(' ')

  const trigrams = (str) => {
    const p = `  ${str} `
    const out = new Set()
    for (let i = 0; i < p.length - 2; i++) out.add(p.slice(i, i + 3))
    return out
  }
  function trigramSim(a, b) {
    const A = trigrams(a)
    const B = trigrams(b)
    let inter = 0
    for (const x of A) if (B.has(x)) inter++
    return inter / (A.size + B.size - inter)
  }

  function fuzzyGuess(corrected, lang) {
    let best = null
    for (const entry of [...loadTaught().taught, ...seed]) {
      for (const q of Array.isArray(entry.q) ? entry.q : [entry.q]) {
        const sim = trigramSim(corrected, normalize(q))
        if (sim >= 0.45 && (!best || sim > best.sim)) best = { sim, q, entry }
      }
    }
    if (!best) return null
    const lead = ONLY(lang, { so: 'Waxaan u malaynayaa inaad ula jeedo', en: 'I think you mean' })
    const reply = (lang === 'en' && best.entry.en) || best.entry.a
    return { matched: true, kind: 'guess', text: `${lead}: «${best.q}»\\n${reply}` }
  }

  const STRONG_KINDS = new Set(['taught', 'seed', 'service-faq'])

  function answer(text, opts = {}) {
    const exact = answerExact(text, opts)
    if (exact.matched && STRONG_KINDS.has(exact.kind)) return exact
    const corrected = correctText(text)
    if (corrected && corrected !== normalize(text)) {
      const fixed = answerExact(corrected, opts)
      if (fixed.matched) return { ...fixed, corrected: true }
    }
    if (exact.matched) return exact
    return fuzzyGuess(corrected || normalize(text), opts.lang || 'so') || { matched: false }
  }

  const detectServicesExact = detectServices
  function detectServicesFuzzy(text) {
    const found = detectServicesExact(text)
    if (found.length) return found
    const corrected = correctText(text)
    return corrected && corrected !== normalize(text) ? detectServicesExact(corrected) : found
  }

  function teach(q, a) {
    const data = loadTaught()
    const item = { id: ++data.seq, q: q.trim(), a: a.trim(), createdAt: Date.now() }
    data.taught.push(item)
    saveTaught(data)
    return item
  }

  function forget(id) {
    const data = loadTaught()
    const i = data.taught.findIndex((t) => t.id === Number(id))
    if (i < 0) return false
    data.taught.splice(i, 1)
    saveTaught(data)
    return true
  }

  const listTaught = () => loadTaught().taught

  function recordUnanswered(sessionId, text) {
    if (!store) return null
    const kb = (store.db.knowledge ||= { unanswered: {} })
    const id = store.nextId('unanswered')
    kb.unanswered[id] = { id, sessionId, text: text.slice(0, 500), createdAt: Date.now(), status: 'open' }
    store.save()
    return kb.unanswered[id]
  }

  function fallbackText(lang) {
    return ONLY(lang, {
      so: "Su'aashaas si sax ah uma hubo, si aanan kuu khaldin. Farah ayaa kuu soo jawaabi doona dhawaan (jawaabta halkan ayaad ka heli doontaa) ama WhatsApp: +252 63 713 3499. Hadda waxaan kaa caawin karaa qiimaha, waqtiga, waxa ku jira adeegyada iyo dalabka.",
      en: "I'm not sure about that, and I don't want to mislead you. Farah will get back to you soon (the answer will appear here) or WhatsApp: +252 63 713 3499. Right now I can help with prices, delivery times, what each service includes, and orders.",
      ar: 'لست متأكدًا من ذلك ولا أريد أن أضللك. سيرد عليك فرح قريبًا (ستظهر الإجابة هنا) أو واتساب: +252 63 713 3499.',
    })
  }

  function orderIntent(text, { lastService = null } = {}) {
    const n = normalize(text)
    if (!n) return { wants: false }
    const services = detectServicesFuzzy(text)
    const top = services[0]
    const ambiguous = Boolean(top && services[1] && services[1].score === top.score && top.score < 3)
    const intent = detectIntent(n) || detectIntent(correctText(text))
    const how = TOPIC.howOrder.test(n) || TOPIC.howOrder.test(correctText(text))
    const accept = Boolean(lastService) && /(aqbal|waan rabaa|i accept|yes please)/.test(n)
    const wants = intent === 'order' || how || accept
    const fromText = top && !ambiguous ? top.id : null
    return { wants, ambiguous, serviceId: wants ? fromText ?? (lastService ? Number(lastService) : null) : null }
  }

  const looksLikeQuestion = (text) => /\?\s*$/.test(text.trim()) || /^(maxaa|maxay|sidee|immisa|intee|goorma|yaa|meesha|halkee|waa maxay|how|what|when|where|can|do|is|كم|ما|كيف)\b/i.test(normalize(text))

  return {
    orderIntent,
    looksLikeQuestion,
    serviceLink,
    catalogueText,
    answer,
    detectServices: detectServicesFuzzy,
    correctText,
    teach,
    forget,
    listTaught,
    recordUnanswered,
    fallbackText,
    reload,
    get catalogById() {
      return catalogById
    },
    get seedCount() {
      return seed.length
    },
  }
}
