import { tr } from './texts.js'

const YES = /^(haa|haye|sax|waa sax|saxan|ok|okay|yes|y|xaqiiji|hubaa|aqbalay|waan aqbalay|نعم|تمام)\b/i
const NO = /^(maya|no|n|khalad|beddel|change|لا)\b/i
const CANCEL = /^(jooji|ka noqo|cancel|stop|ha dalban|ma rabo|إلغاء)\b/i
const CHANGE_SERVICE = /(beddel adeegga|adeeg kale|change service|another service)/i

const L = (lang, o) => o[lang] ?? o.en ?? o.so

const GROUPS = [
  {
    ids: [1, 2, 3, 10, 28],
    q: {
      so: 'Magaca ganacsigaaga iyo bogag intee ayaad u baahan tahay (iyo midabada aad jeceshahay)?',
      en: 'What is your business name, how many pages do you need, and any colours you like?',
    },
  },
  {
    ids: [13, 14, 15, 16, 17, 18, 19],
    q: {
      so: 'Magaca saxda ah ee ganacsigaaga, waxa lagu qorayo, iyo midabada aad jeceshahay?',
      en: 'The exact business name, what should be written on it, and any colours you like?',
    },
  },
  {
    ids: [8, 9],
    q: {
      so: 'Shaqada aad codsanayso iyo khibradaada/waxbarashadaada ugu muhiimsan?',
      en: 'Which job are you applying for, and what are your key experience and education?',
    },
  },
  {
    ids: [11, 12],
    q: {
      so: 'Ujeedada (bank, maalgashade, jaamacad) iyo qiyaastii dhererka?',
      en: 'The purpose (bank, investor, university) and roughly how long should it be?',
    },
  },
  {
    ids: [21, 22, 23, 24, 25, 26, 27, 29, 30],
    q: {
      so: 'Immisa shaqaale/ardayda/alaab ayaad haysaa, iyo xog hore ma leedahay (Excel/warqad)?',
      en: 'How many staff/students/items do you have, and do you already have data (Excel/paper)?',
    },
  },
  {
    ids: [4, 5, 6, 7, 20],
    q: {
      so: 'Si kooban u sharax waxa aad rabto in uu sameeyo (iyo kanaalka: website ama WhatsApp haddii ay khuseyso).',
      en: 'Briefly describe what you want it to do (and the channel: website or WhatsApp, if relevant).',
    },
  },
]

const detailsQuestion = (id, lang) => L(lang, (GROUPS.find((g) => g.ids.includes(Number(id))) || GROUPS[5]).q)

const QUESTIONS = {
  goal: {
    so: 'Waa maxay ujeedadaada ama ganacsigaaga? (tusaale: dukaan dhar, iskuul, cafe…)',
    en: 'What is your goal or business? (e.g. clothing shop, school, cafe…)',
  },
  deadline: {
    so: 'Goorma ayaad u baahan tahay? (tusaale: 1 toddobaad, ama taariikh)',
    en: 'When do you need it? (e.g. 1 week, or a date)',
  },
  name: { so: 'Magacaaga?', en: 'Your name?' },
  phone: { so: 'Lambarkaaga WhatsApp? (tusaale 0634567890)', en: 'Your WhatsApp number? (e.g. 0634567890)' },
}

const ORDER = ['goal', 'details', 'deadline', 'name', 'phone', 'confirm']

export function createGuidedOrder({ knowledge, brain, startOrder, say, who, extractPhone, recordUnknown }) {
  const svcOf = (id) => brain.catalog.find((s) => s.id === Number(id))

  function questionFor(f, s) {
    const lang = s.lang
    const n = ORDER.filter((x) => x !== 'confirm').indexOf(f.step) + 1
    const tag = n > 0 ? `(${n}/5) ` : ''
    if (f.step === 'service')
      return L(lang, {
        so: 'Adeegga kee ayaad rabtaa? Tusaale: logo, website, CV, nidaam maqaaxi…',
        en: 'Which service do you want? For example: logo, website, CV, cafe system…',
      })
    if (f.step === 'details') return tag + detailsQuestion(f.serviceId, lang)
    if (QUESTIONS[f.step]) return tag + L(lang, QUESTIONS[f.step])
    return ''
  }

  function intro(svc, lang) {
    const link = knowledge.serviceLink(svc.id)
    return L(lang, {
      so: `Waan ku caawinaa: ${svc.name} (${svc.priceText}, ${svc.time.replace(/(\d)\s*m$/, '$1 maalmood')}).${link ? `\n🔗 Bogga adeegga: ${link}` : ''}\nSi aan dalabkaaga u diyaarino, waxaan ku weydiinayaa 5 su'aalood oo kooban. (Qor "jooji" si aad u joojiso, ama "beddel adeegga".)`,
      en: `Happy to help: ${svc.name} (${svc.priceText.replace('/bil', '/month')}, ${svc.time.replace(/(\d)\s*m$/, '$1 days').replace('maalmood', 'days')}).${link ? `\n🔗 Service page: ${link}` : ''}\nTo prepare your order I will ask 5 short questions. (Type "cancel" to stop, or "change service".)`,
    })
  }

  function afterAnswer(f, s) {
    if (f.returnToConfirm) {
      f.returnToConfirm = false
      f.step = 'confirm'
      return summary(f, s)
    }
    let i = ORDER.indexOf(f.step) + 1
    while (ORDER[i] === 'name' && s.name) i++
    while (ORDER[i] === 'phone' && s.phone) i++
    f.step = ORDER[i]
    return f.step === 'confirm' ? summary(f, s) : questionFor(f, s)
  }

  function summary(f, s) {
    const svc = f.serviceId ? svcOf(f.serviceId) : null
    const d = f.data
    const name = d.name || s.name || '—'
    const phone = d.phone || s.phone || '—'
    return L(s.lang, {
      so: `Soo koob:\n• Adeeg: ${svc ? `${svc.name} (${svc.priceText})` : 'Farah ayaa kuu doorayaa'}\n• Ujeedo: ${d.goal || '—'}\n• Faahfaahin: ${d.details || '—'}\n• Waqti: ${d.deadline || '—'}\n• Magac: ${name}\n• Lambar: ${phone}\n\nSax miyaa? (haa / maya)`,
      en: `Summary:\n• Service: ${svc ? `${svc.name} (${svc.priceText.replace('/bil', '/month')})` : 'Farah will choose for you'}\n• Goal: ${d.goal || '—'}\n• Details: ${d.details || '—'}\n• Deadline: ${d.deadline || '—'}\n• Name: ${name}\n• Phone: ${phone}\n\nIs this correct? (yes / no)`,
    })
  }

  function start(s, { serviceId = null } = {}) {
    s.flow = { step: serviceId ? 'goal' : 'service', serviceId, data: {}, tries: 0, returnToConfirm: false }
    if (serviceId) return `${intro(svcOf(serviceId), s.lang)}\n\n${questionFor(s.flow, s)}`
    const lead = L(s.lang, {
      so: 'Waan ku hagi karaa dalabka tallaabo-tallaabo. ',
      en: 'I can guide you through the order step by step. ',
    })
    return `${lead}${questionFor(s.flow, s)}\n\n${knowledge.catalogueText(s.lang)}`
  }

  function finish(s, f) {
    const d = f.data
    if (d.name) s.name = d.name
    if (d.phone) s.phone = d.phone
    const svc = f.serviceId ? svcOf(f.serviceId) : null
    s.brief = { ...s.brief, service: svc?.name || '', serviceId: svc ? String(svc.id) : '', purpose: d.goal || '', assets: d.details || '', deadline: d.deadline || '', contact: s.phone || '' }
    s.flow = null
    say(
      `📝 Brief cusub (hagaha dalabka)\nMacaamiil: ${who(s)}\nAdeeg: ${svc ? `${svc.name} — ${svc.priceText}` : 'lama doorin (Farah ha u doorto)'}\nUjeedo: ${d.goal || '—'}\nFaahfaahin: ${d.details || '—'}\nWaqti: ${d.deadline || '—'}`,
    )
    const ack = L(s.lang, { so: 'Dalabkaaga waa la diiwaangeliyay ✅', en: 'Your order has been recorded ✅' })
    return `${ack}\n\n${startOrder(s, svc)}`
  }

  function handle(s, text, { leadFor }) {
    const f = s.flow
    const lang = s.lang

    if (CANCEL.test(text)) {
      s.flow = null
      return L(lang, {
        so: 'Waa hagaag, dalabka waan joojinnay. Marka aad rabto, ii sheeg mar kale.',
        en: 'Okay, the order is cancelled. Tell me whenever you want to start again.',
      })
    }
    if (CHANGE_SERVICE.test(text)) {
      f.step = 'service'
      f.serviceId = null
      return questionFor(f, s)
    }

    const isFreeTextStep = ['goal', 'details', 'deadline', 'name', 'phone', 'service'].includes(f.step)
    if (isFreeTextStep && knowledge.looksLikeQuestion(text)) {
      const a = knowledge.answer(text, { lang, lastService: f.serviceId, llmOn: false })
      if (a.matched) return `${a.text}\n\n↩️ ${questionFor(f, s)}`
      recordUnknown(s, text)
      return L(lang, {
        so: `Su'aashaas Farah ayaa kuu jawaabi doona. Hadda:\n↩️ ${questionFor(f, s)}`,
        en: `Farah will answer that question for you. For now:\n↩️ ${questionFor(f, s)}`,
      })
    }

    switch (f.step) {
      case 'service': {
        const found = knowledge.detectServices(text)
        const top = found[0]
        const ambiguous = top && found[1] && found[1].score === top.score && top.score < 3
        if (top && !ambiguous) {
          f.serviceId = top.id
          f.step = 'goal'
          return `${intro(svcOf(top.id), lang)}\n\n${questionFor(f, s)}`
        }
        if (ambiguous) {
          const opts = found.filter((x) => x.score === top.score).map((x) => svcOf(x.id))
          return L(lang, {
            so: `Waxaan haynaa: ${opts.map((o) => `${o.name} (${o.priceText})`).join(' iyo ')}. Kee ayaad rabtaa?`,
            en: `We have: ${opts.map((o) => `${o.name} (${o.priceText.replace('/bil', '/month')})`).join(' and ')}. Which one do you want?`,
          })
        }
        f.tries += 1
        if (f.tries >= 2) {
          f.data.goal = text.slice(0, 300)
          f.serviceId = null
          f.step = 'name'
          const prefix = L(lang, { so: 'Waa hagaag, Farah ayaa kuu caawin doona inaad adeegga saxda ah doorato. ', en: 'No problem, Farah will help you pick the right service. ' })
          if (s.name) {
            f.data.name = s.name
            f.step = 'phone'
          }
          if (f.step === 'phone' && s.phone) {
            f.data.phone = s.phone
            f.step = 'confirm'
            return prefix + summary(f, s)
          }
          return prefix + questionFor(f, s)
        }
        return `${L(lang, { so: 'Adeeggaas ma helin. ', en: "I couldn't find that service. " })}${questionFor(f, s)}\n\n${knowledge.catalogueText(lang)}`
      }
      case 'goal':
      case 'details':
      case 'deadline':
        f.data[f.step] = text.slice(0, 300)
        return afterAnswer(f, s)
      case 'name':
        f.data.name = text.slice(0, 80)
        s.name = f.data.name
        return afterAnswer(f, s)
      case 'phone': {
        const phone = extractPhone(text)
        if (!phone && !/^(ma haysto|skip|no phone)/i.test(text)) {
          return L(lang, {
            so: 'Fadlan qor lambar sax ah (tusaale 0634567890), ama qor "ma haysto".',
            en: 'Please send a valid number (e.g. 0634567890), or type "skip".',
          })
        }
        f.data.phone = phone || ''
        if (phone) s.phone = phone
        return afterAnswer(f, s)
      }
      case 'confirm':
        if (YES.test(text)) {
          if (!f.serviceId) {
            const d = f.data
            if (d.name) s.name = d.name
            s.flow = null
            return leadFor(s, d)
          }
          return finish(s, f)
        }
        if (NO.test(text)) {
          f.step = 'edit'
          return L(lang, {
            so: 'Maxaad rabtaa inaad beddesho? Qor: adeegga / ujeedada / faahfaahinta / waqtiga / magaca / lambarka',
            en: 'What would you like to change? Type: service / goal / details / deadline / name / phone',
          })
        }
        return L(lang, { so: 'Fadlan ku jawaab "haa" ama "maya".', en: 'Please answer "yes" or "no".' })
      case 'edit': {
        const map = [
          [/adeeg|service/i, 'service'],
          [/ujeed|goal/i, 'goal'],
          [/faahfaah|detail/i, 'details'],
          [/waqti|deadline|when/i, 'deadline'],
          [/magac|name/i, 'name'],
          [/lambar|phone|number/i, 'phone'],
        ]
        const hit = map.find(([rx]) => rx.test(text))
        if (!hit) return L(lang, { so: 'Qor mid ka mid ah: adeegga, ujeedada, faahfaahinta, waqtiga, magaca, lambarka.', en: 'Type one of: service, goal, details, deadline, name, phone.' })
        f.step = hit[1]
        f.returnToConfirm = hit[1] !== 'service'
        if (hit[1] === 'service') f.serviceId = null
        return questionFor(f, s)
      }
      default:
        s.flow = null
        return tr('holding', lang)
    }
  }

  return { start, handle, active: (s) => Boolean(s.flow) }
}
