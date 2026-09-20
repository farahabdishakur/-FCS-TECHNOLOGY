import { checkOutbound } from './guard.js'

const STATUS_LABEL = { cusub: 'cusub', qorshaysan: 'qorshaysan', mashruuc: 'mashruuc', dhammaaday: 'dhammaaday' }
const short = (t, n = 80) => (t.length > n ? t.slice(0, n) + '…' : t)

const HELP = [
  'Bot-ka Fikradaha & Mashaariicda',
  'Qor fikrad kasta (qoraal caadi ah) oo waan kaydinayaa, waxaanan kuu tusayaa adeegyada FCS ee ku habboon.',
  '',
  '/ideas — fikradaha furan',
  '/idea <id> — faahfaahin',
  '/plan <id> — qorshe (qabyo) u samee',
  '/note <id> qoraal — ku dar xusuus',
  '/promote <id> — ka dhig mashruuc',
  '/projects — mashaariicda',
  '/done <id> · /del <id>',
].join('\n')

export function createIdeas({ store, brain, knowledge, llm }) {
  const db = () => (store.db.ideas ||= { items: {} })
  const get = (id) => db().items[Number(id)]

  function suggestions(text) {
    return knowledge
      .detectServices(text)
      .filter((s) => s.score >= 2)
      .slice(0, 3)
      .map((s) => knowledge.catalogById.get(s.id))
      .filter(Boolean)
  }

  const priceLine = (services) =>
    services.length
      ? services.map((s) => `${s.name} (${s.priceText}, ${s.time})`).join('\n  • ')
      : ''

  function templatePlan(idea) {
    const services = suggestions(idea.body)
    const total = services.reduce((n, s) => n + s.price, 0)
    return [
      `📌 Qorshe (qabyo) — Fikrad #${idea.id}: ${short(idea.title, 60)}`,
      '1. Cadee ujeedada: yaa isticmaali doona iyo dhibaatada la xallinayo?',
      services.length
        ? `2. Adeegyada FCS ee ku habboon:\n  • ${priceLine(services)}`
        : '2. Adeeg FCS oo toos u khuseeya lama helin; fikraddu waxay u baahan tahay qiimeyn gaar ah (Farah).',
      services.length ? `3. Qiyaas qiimo (liiska, setup): $${total}. Nidaamyada waxaa lagu daraa bille.` : '3. Qiimo: la qiimeeyo.',
      '4. Tallaabo: qor 3 su\'aalood oo aad weydiin lahayd macaamiilka, kadibna /promote ' + idea.id + ' si ay u noqoto mashruuc.',
      '(Qorshe buuxa oo AI ah wuxuu u baahan yahay LLM; hadda waa qabyo ku salaysan liiska adeegyada.)',
    ].join('\n')
  }

  async function llmPlan(idea) {
    const system = [
      'Waxaad tahay caawiyaha fikradaha Farah Abdishakur (FCS Technology, Borama). Ka dhig fikradda qorshe gaaban oo Soomaali fudud ah: ujeedo, 5 tallaabo, adeegyada FCS ee ku habboon, qiyaas qiimo, khataro, tallaabada xigta.',
      'Qiimayaasha isticmaal KALIYA kuwa Brain-ka; ha abuurin. Haddii adeeg aan Brain-ka ku jirin loo baahan yahay, dheh "Farah ayaa qiimeeya".',
      '# BRAIN\n' + brain.context,
    ].join('\n\n')
    const text = await llm.generate({
      system,
      messages: [{ role: 'user', content: `Fikradda: ${idea.body}\nXusuusaha: ${(idea.notes || []).join('; ')}` }],
      temperature: 0.5,
      maxTokens: 1500,
    })
    const check = checkOutbound(text, { allowedAmounts: brain.allowedAmounts, paymentVerified: true })
    return check.ok ? text : text + `\n\n⚠️ Hubi qiimayaasha (${check.violations.join('; ')}) — ha aamin ilaa aad liiska ka eegto.`
  }

  function add(text) {
    const id = store.nextId('idea')
    const first = text.split('\n')[0]
    const idea = { id, title: short(first, 60), body: text, status: 'cusub', notes: [], createdAt: Date.now() }
    db().items[id] = idea
    store.save()
    const services = suggestions(text)
    return (
      `✅ Fikrad #${id} waa la kaydiyay.` +
      (services.length ? `\nAdeegyada FCS ee la xiriira:\n  • ${priceLine(services)}` : '\nAdeeg FCS oo toos ah lagama helin; /plan ${id} si aan u qorshaynno.'.replace('${id}', id)) +
      `\n\n/plan ${id} = qorshe · /promote ${id} = mashruuc`
    )
  }

  const line = (i) => `#${i.id} [${STATUS_LABEL[i.status]}] ${short(i.title, 60)}`

  async function handle(raw) {
    const text = String(raw || '').trim()
    if (!text) return 'Qor fikrad.'
    if (!text.startsWith('/')) return add(text.slice(0, 3000))

    const [cmdRaw, ...args] = text.split(/\s+/)
    const cmd = cmdRaw.toLowerCase().replace(/@\w+$/, '')
    const idea = get(args[0])
    const needId = () => `Isticmaal: ${cmd} <id>. Liiska: /ideas`

    switch (cmd) {
      case '/start':
      case '/help':
        return HELP
      case '/ideas': {
        const list = Object.values(db().items).filter((i) => i.status === 'cusub' || i.status === 'qorshaysan')
        return list.length ? list.map(line).join('\n') : 'Fikrad furan ma jirto. Qor mid!'
      }
      case '/projects': {
        const list = Object.values(db().items).filter((i) => i.status === 'mashruuc')
        return list.length ? list.map(line).join('\n') : 'Weli mashruuc ma jiro. /promote <id>'
      }
      case '/idea':
        if (!idea) return needId()
        return `${line(idea)}\n\n${idea.body}${idea.notes.length ? '\n\nXusuusaha:\n- ' + idea.notes.join('\n- ') : ''}${idea.plan ? '\n\n' + idea.plan : ''}`
      case '/plan': {
        if (!idea) return needId()
        let plan
        if (llm.available()) {
          try {
            plan = await llmPlan(idea)
          } catch {
            plan = templatePlan(idea) + '\n(AI ma shaqeynin; qabyo ayaa la bixiyay.)'
          }
        } else plan = templatePlan(idea)
        idea.plan = plan
        if (idea.status === 'cusub') idea.status = 'qorshaysan'
        store.save()
        return plan
      }
      case '/note': {
        const note = args.slice(1).join(' ').trim()
        if (!idea || !note) return 'Isticmaal: /note <id> qoraal'
        idea.notes.push(note)
        store.save()
        return `📝 Xusuus lagu daray #${idea.id}.`
      }
      case '/promote':
        if (!idea) return needId()
        idea.status = 'mashruuc'
        store.save()
        return `🚀 #${idea.id} hadda waa mashruuc. /projects`
      case '/done':
        if (!idea) return needId()
        idea.status = 'dhammaaday'
        store.save()
        return `✔ #${idea.id} waa dhammaaday.`
      case '/del':
        if (!idea) return needId()
        delete db().items[idea.id]
        store.save()
        return `🗑 #${idea.id} waa la tirtiray.`
      default:
        return 'Amarkaas ma aqaan. /help'
    }
  }

  return { handle }
}
