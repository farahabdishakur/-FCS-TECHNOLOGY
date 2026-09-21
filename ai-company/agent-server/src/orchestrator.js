import { detectLang, screenInbound, classify, checkOutbound } from './guard.js'
import { createGuidedOrder } from './guided.js'
import { tr, payInstructions, paymentConfirmed, finalPayment, delivered } from './texts.js'

const BIG_ORDER = 300
const DAY = 24 * 60 * 60 * 1000
const STAGES = ['cusub', 'iibin', 'sugaya_farah', 'sugaya_lacag', 'lacag_la_sheegay', 'socda', 'tijaabo', 'sugaya_lacag_2', 'dhiibay', 'taageero']
const ORDER_STAGES = new Set(['socda', 'tijaabo', 'sugaya_lacag_2', 'dhiibay', 'taageero'])
const ESCALATION_KEY = {
  complaint: 'escalate_complaint',
  discount: 'escalate_discount',
  medical: 'escalate_medical',
  legal: 'escalate_legal',
}
const ESCALATION_LABEL = { complaint: 'Cabasho', discount: 'Codsi dhimis', medical: 'Hospital/Clinic', legal: 'Sharci', other: 'Go\'aan loo baahan yahay' }

const short = (text, n = 300) => (text.length > n ? text.slice(0, n) + '…' : text)

export function createOrchestrator({ store, brain, agents, llm, knowledge, notify, sendGroup = async () => { throw new Error('bot-ka group-yada lama dejin') }, cfg }) {
  const meta = () => store.db.meta
  const stat = (key) => {
    const st = (meta().stats ||= { total: 0, unknown: 0, escalated: 0, held: 0 })
    st[key] = (st[key] || 0) + 1
  }
  const service = (id) => brain.catalog.find((s) => s.id === Number(id))
  const orderOf = (s) => (s.orderId ? store.db.orders[s.orderId] : null)
  const who = (s) => (s.name ? `${s.name}${s.phone ? ' ' + s.phone : ''}` : `#${s.id.slice(0, 6)}`)

  const say = (text) => {
    Promise.resolve()
      .then(() => notify(text))
      .catch((e) => store.log('notify_error', { message: e.message }))
  }

  const notifyOnce = (s, key, text, everyMs = 30 * 60 * 1000) => {
    const last = (s.lastNotify ||= {})
    if (Date.now() - (last[key] || 0) < everyMs) return
    last[key] = Date.now()
    say(text)
  }

  function sessionContext(s) {
    const o = orderOf(s)
    return [
      `Xaaladda wada-hadalka: ${s.stage}`,
      `Luuqadda macaamiilka: ${s.lang}`,
      s.name ? `Magaca macaamiilka: ${s.name}` : '',
      Object.keys(s.brief).length ? `Brief-ka ilaa hadda: ${JSON.stringify(s.brief)}` : '',
      o ? `Dalabka: #${o.id} ${o.serviceName}, qiimo $${o.price}, xaalad ${o.stage}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  }

  function mergeBrief(s, brief) {
    if (!brief || typeof brief !== 'object') return
    for (const [k, v] of Object.entries(brief)) {
      if (v !== null && v !== undefined && String(v).trim() !== '') s.brief[k] = String(v).slice(0, 300)
    }
    store.save()
  }

  function hold(s, draft, reasons, question) {
    const a = store.addApproval({
      type: 'held_reply',
      level: 2,
      sessionId: s.id,
      summary: `Jawaab la hakiyay: ${reasons.join('; ')}`,
      data: { draft, reasons },
    })
    say(
      `⏸ Jawaab la hakiyay #${a.id}\nMacaamiil: ${who(s)}\nSu'aasha: ${short(question, 200)}\nSababta: ${reasons.join('; ')}\n\nQabyada AI:\n${short(draft, 700)}\n\nOK #${a.id} = u dir sidaan ah · /reply #${a.id} qoraal = qoraalkaaga u dir · NO #${a.id} = ha diriyin`,
    )
    stat('held')
    store.log('held', { session: s.id, approval: a.id, reasons })
    return tr('holding', s.lang)
  }

  function sendChecked(s, draft, question) {
    const text = String(draft || '').trim().slice(0, 1200)
    if (!text) return degraded(s, question)
    const check = checkOutbound(text, { allowedAmounts: brain.allowedAmounts })
    return check.ok ? text : hold(s, text, check.violations, question)
  }

  function escalate(s, kind, text, reason = '') {
    stat('escalated')
    const a = store.addApproval({
      type: 'escalation',
      level: 3,
      sessionId: s.id,
      summary: `${kind}: ${short(text, 200)}`,
    })
    say(
      `⚠️ ${ESCALATION_LABEL[kind] || ESCALATION_LABEL.other} #${a.id}\nMacaamiil: ${who(s)}\nFariin: ${short(text, 400)}${reason ? '\nSabab: ' + reason : ''}\n\n/reply #${a.id} qoraal = jawaab u dir · OK #${a.id} = la eegay`,
    )
    return tr(ESCALATION_KEY[kind] || 'holding', s.lang)
  }

  function degraded(s, text) {
    stat('unknown')
    const u = knowledge.recordUnanswered(s.id, text)
    say(
      `❓ Su'aal aan la aqoon${u ? ' #u' + u.id : ''}\nMacaamiil: ${who(s)}\nSu'aal: ${short(text, 300)}\n\n${u ? `/answer ${u.id} jawaabta saxda ah = macaamiilka u dir + AI-ga baro\n` : ''}Ama ku baro: /teach su'aal => jawaab`,
    )
    return knowledge.fallbackText(s.lang)
  }

  function extractPhone(text) {
    const m = text.match(/(\+?\d[\d\s().-]{7,18}\d)/)
    if (!m) return null
    const digits = m[1].replace(/\D/g, '')
    return digits.length >= 8 && digits.length <= 15 ? m[1].trim() : null
  }

  function captureLead(s, phone, details = null) {
    if (phone) s.phone = phone
    if (s.stage === 'cusub') s.stage = 'iibin'
    const service = s.lastService ? knowledge.catalogById.get(Number(s.lastService))?.name : s.brief.service
    const recent = s.history
      .filter((m) => m.role === 'user')
      .slice(-4)
      .map((m) => '- ' + short(m.text, 160))
      .join('\n')
    const extra = details ? `\nUjeedo: ${details.goal || '—'}\nFaahfaahin: ${details.details || '—'}\nWaqti: ${details.deadline || '—'}` : ''
    const a = store.addApproval({
      type: 'lead',
      level: 1,
      sessionId: s.id,
      summary: `Lead: ${who(s)}${service ? ' — ' + service : ''}`,
    })
    say(`📇 Lead cusub #${a.id}\nMacaamiil: ${who(s)}\nAdeeg: ${service || 'lama sheegin'}${extra}\nFariimihii ugu dambeeyay:\n${recent}\n\n/reply #${a.id} qoraal = jawaab u dir · OK #${a.id} = la xiriiray`)
    store.save()
    return tr('leadThanks', s.lang, { phone: s.phone || '—' })
  }

  function recordUnknown(s, text) {
    stat('unknown')
    const u = knowledge.recordUnanswered(s.id, text)
    say(`❓ Su'aal aan la aqoon (dalab socda)${u ? ' #u' + u.id : ''}\nMacaamiil: ${who(s)}\nSu'aal: ${short(text, 300)}${u ? `\n\n/answer ${u.id} jawaabta saxda ah` : ''}`)
  }

  function startOrder(s, svc) {
    const big = svc.price > BIG_ORDER || svc.id === 15
    const order = store.createOrder({
      sessionId: s.id,
      serviceId: svc.id,
      serviceName: svc.name,
      price: svc.price,
      monthly: svc.monthly,
      deposit: svc.price / 2,
      stage: big ? 'sugaya_farah' : 'sugaya_lacag',
      brief: { ...s.brief },
    })
    s.orderId = order.id
    s.stage = order.stage
    store.save()
    if (big) {
      const a = store.addApproval({
        type: 'order_big',
        level: 3,
        sessionId: s.id,
        orderId: order.id,
        summary: `Dalab weyn: ${svc.name} $${svc.price}`,
      })
      say(`🛒 Dalab weyn #${a.id} (dalab O${order.id})\nMacaamiil: ${who(s)}\nAdeeg: ${svc.name} — ${svc.priceText}\n\nOK #${a.id} = u dir habka lacag-bixinta · NO #${a.id} = ha diriyin`)
      return tr('orderPending', s.lang)
    }
    say(`🛒 Dalab cusub O${order.id}\nMacaamiil: ${who(s)}\nAdeeg: ${svc.name} — ${svc.priceText}\nWaxaa loo diray habka lacag-bixinta (50% = $${order.deposit}).`)
    return payInstructions({ deposit: order.deposit, total: svc.price, monthly: svc.monthly, details: cfg.paymentDetails }, s.lang)
  }

  const guided = createGuidedOrder({ knowledge, brain, startOrder, say, who, extractPhone, recordUnknown })

  function paymentClaim(s, text) {
    const order = orderOf(s)
    const open = order && ['sugaya_lacag', 'sugaya_lacag_2', 'lacag_la_sheegay'].includes(order.stage)
    if (!open) {
      s.awaitingPaymentRef = false
      const a = store.addApproval({ type: 'escalation', level: 3, sessionId: s.id, summary: `Lacag la sheegay, dalab la'aan: ${short(text, 200)}` })
      say(`💰 Lacag la sheegay laakiin dalab furan ma jiro #${a.id}\nMacaamiil: ${who(s)}\nFariin: ${short(text, 300)}`)
      return tr('holding', s.lang)
    }
    const phoneDigits = (s.phone || '').replace(/\D/g, '')
    const recentClaim = s.history
      .filter((m) => m.role === 'user' && m.ts >= order.createdAt)
      .slice(-4)
      .map((m) => (phoneDigits ? m.text.split(s.phone).join(' ') : m.text))
      .join(' ')
    const hasRef = /\d{6,}/.test(recentClaim)
    if (!hasRef && !s.awaitingPaymentRef) {
      s.awaitingPaymentRef = true
      store.save()
      return tr('paymentAsk', s.lang)
    }
    s.awaitingPaymentRef = false
    if (order.stage === 'sugaya_lacag_2') order.claimFor = 'final'
    else if (order.stage === 'sugaya_lacag') order.claimFor = 'deposit'
    order.stage = 'lacag_la_sheegay'
    s.stage = 'lacag_la_sheegay'
    const amount = order.claimFor === 'final' ? order.price / 2 : order.deposit
    const claimText = s.history.filter((m) => m.role === 'user' && m.ts >= order.createdAt).slice(-4).map((m) => m.text).join(' | ')
    const a = store.addApproval({
      type: 'payment',
      level: 2,
      sessionId: s.id,
      orderId: order.id,
      summary: `Lacag la sheegay: $${amount} (${order.claimFor})`,
      data: { amount, claimText },
    })
    say(
      `💰 Lacag la sheegay #${a.id} (dalab O${order.id}, ${order.serviceName})\nMacaamiil: ${who(s)}\nQaddarka la filayo: $${amount} (${order.claimFor === 'final' ? '50% dhammaad' : '50% horay'})\nWaxa uu qoray: ${short(claimText, 400)}\n\nKa eeg akoonkaaga DHABTA AH (ha aamin screenshot keliya).\nOK #${a.id} = xaqiiji · NO #${a.id} = ma helin`,
    )
    store.save()
    return tr('paymentChecking', s.lang)
  }

  function afterSales(s, r, question) {
    if (r.escalate) return escalate(s, 'other', question, r.reason)
    const id = r.serviceId ?? s.brief.serviceId
    if (r.customerAccepted) {
      const svc = service(id)
      if (svc && !orderOf(s)) return startOrder(s, svc)
    }
    if (r.serviceId) s.brief.serviceId = String(r.serviceId)
    return sendChecked(s, r.reply, question)
  }

  async function converse(s, text) {
    const history = s.history.slice(0, -1)
    const ctx = { history, input: text, extra: sessionContext(s) }

    const route = (await agents.route(ctx)) || { office: s.stage === 'cusub' ? 'intake' : 'sales' }
    if (route.escalate) {
      const kind = ['complaint', 'discount'].includes(route.intent) ? route.intent : 'other'
      return escalate(s, kind, text, route.reason)
    }
    if (route.language && ['so', 'en', 'ar'].includes(route.language)) s.lang = route.language

    let office = route.office
    const o = orderOf(s)
    if (o && ORDER_STAGES.has(o.stage) && office !== 'maaliyad') office = 'taageero'

    if (office === 'maskax') return sendChecked(s, route.reply || tr('holding', s.lang), text)

    if (office === 'maaliyad') {
      const r = await agents.maaliyad(ctx)
      return sendChecked(s, r?.reply, text)
    }

    if (office === 'taageero') {
      const r = await agents.taageero(ctx)
      if (!r) return degraded(s, text)
      if (r.escalate) return escalate(s, 'other', text, r.reason)
      return sendChecked(s, r.reply, text)
    }

    if (office === 'intake') {
      const r = await agents.intake(ctx)
      if (!r?.reply) return degraded(s, text)
      mergeBrief(s, r.brief)
      if (s.stage === 'cusub') s.stage = 'iibin'
      if (r.briefReady && r.customerConfirmed) {
        say(`📝 Brief cusub la xaqiijiyay\nMacaamiil: ${who(s)}\n${JSON.stringify(s.brief)}`)
        const quote = await agents.sales({
          ...ctx,
          extra: ctx.extra + '\nBrief-ka waa la xaqiijiyay. Bandhig adeegga ugu habboon + qiimo + waqti (kaliya kuwa Brain-ka).',
        })
        if (quote?.reply) return afterSales(s, quote, text)
      }
      return sendChecked(s, r.reply, text)
    }

    const r = await agents.sales(ctx)
    if (!r) return degraded(s, text)
    if (s.stage === 'cusub') s.stage = 'iibin'
    return afterSales(s, r, text)
  }

  // Wada-hadalka shaqaalaha (Farah + xafiis kasta oo Telegram bot u leh, aan ahayn 'sales') — halkan customer
  // guided/order flow-ku ma jiro; waa kaliya wada-hadal xor ah oo u dhexeeya Farah iyo xafiiska (agents.staffChat).
  async function handleStaff({ office, text }) {
    const clean = String(text || '').trim().slice(0, 1500)
    if (!clean) return { reply: '' }
    const chat = store.getStaffChat(office)
    store.pushStaffMessage(office, 'user', clean)
    let reply
    try {
      if (!llm.available()) {
        reply = 'LLM lama dejin (LLM_API_KEY), sidaas darteed hadda kaama caawin karo. Farah, hubi Render → LLM_API_KEY.'
      } else {
        reply = await agents.staffChat(office, {
          history: chat.history.slice(0, -1),
          input: clean,
          extra: `Kan waa Farah, milkiilaha FCS Technology — ma aha macaamiil, waa saaxiibkaa/madaxaaga. Wuxuu kula hadlayaa si toos ah oo shaqo ah (ma aha dalab/qiimo macaamiil). Ku jawaab si xor ah, waxtar leh, gaaban.`,
        })
      }
    } catch (e) {
      store.log('staff_chat_error', { office, message: e.message })
      reply = 'Khalad ayaa dhacay, isku day mar kale.'
    }
    store.pushStaffMessage(office, 'assistant', reply)
    return { reply }
  }

  async function handleCustomer({ sessionId, text, name, phone }) {
    const s = store.getSession(sessionId)
    if (name) s.name = String(name).slice(0, 80)
    if (phone) s.phone = String(phone).slice(0, 30)
    const clean = String(text || '').trim().slice(0, 1500)
    if (!clean) return { reply: '' }
    if (!s.flow) s.lang = detectLang(clean)
    stat('total')
    store.pushHistory(s, 'user', clean)
    store.log('in', { session: s.id, text: clean })

    let reply
    try {
      reply = await decide(s, clean)
    } catch (e) {
      store.log('error', { session: s.id, message: e.message, kind: e.kind })
      reply = degraded(s, clean)
    }
    store.pushHistory(s, 'assistant', reply)
    store.log('out', { session: s.id, text: reply })
    return { reply }
  }

  async function decide(s, text) {
    if (meta().paused) {
      notifyOnce(s, 'paused', `⏸ Nidaamku waa la hakiyay (/stop). Macaamiil: ${who(s)} ayaa qoray: ${short(text, 200)}`)
      return tr('holding', s.lang)
    }
    const sec = screenInbound(text)
    if (sec.blocked) {
      s.strikes = (s.strikes || 0) + 1
      store.log('blocked', { session: s.id, reason: sec.reason })
      if (s.strikes === 3) say(`🛡 Amni: macaamiil ${who(s)} ayaa 3 jeer isku dayay inuu beddelo xeerarka. Fariintii ugu dambeysay: ${short(text, 200)}`)
      return tr('refuse', s.lang)
    }
    const cls = classify(text)
    if (cls.escalate) return escalate(s, cls.escalate, text)
    if (s.awaitingPaymentRef || cls.paymentClaim) return paymentClaim(s, text)

    if (s.flow) return guided.handle(s, text, { leadFor: (sess, d) => captureLead(sess, sess.phone, d) })

    const faq = knowledge.answer(text, { lang: s.lang, lastService: s.lastService, llmOn: llm.available() })
    if (faq.matched && faq.kind === 'taught') return faq.text

    const oi = knowledge.orderIntent(text, { lastService: s.lastService })
    if (oi.wants) {
      const given = extractPhone(text)
      if (given) s.phone = given
      return guided.start(s, { serviceId: oi.serviceId })
    }

    const phone = extractPhone(text)
    if (phone && !orderOf(s)) return captureLead(s, phone)

    if (faq.matched) {
      if (faq.serviceId) s.lastService = String(faq.serviceId)
      store.log('faq', { session: s.id, kind: faq.kind })
      return faq.text
    }
    if (!llm.available()) return degraded(s, text)
    if (sec.suspicious) {
      const verdict = await agents.amni({ input: text })
      if (verdict && verdict.safe === false) {
        store.log('blocked', { session: s.id, reason: verdict.threat })
        return tr('refuse', s.lang)
      }
    }
    return converse(s, text)
  }

  const queue = (s, text) => store.queueOutbox(s.id, text)

  async function contractDraft(order, s) {
    if (!llm.available()) return null
    try {
      return await agents.contract({
        input: 'Diyaari qabyo heshiis.',
        extra: `Macaamiilka: ${who(s)}\nAdeegga: ${order.serviceName} (${order.price ? '$' + order.price : ''}${order.monthly ? ' + $' + order.monthly + '/bil' : ''})\nBrief: ${JSON.stringify(order.brief)}\nLacag: 50% horay ($${order.deposit}), 50% dhammaad ($${order.price / 2})`,
      })
    } catch (e) {
      store.log('error', { message: e.message })
      return null
    }
  }

  async function approve(id) {
    const a = store.db.approvals[id]
    if (!a || a.status !== 'pending') return `#${id} lama helin, ama hore ayaa loo xalliyay.`
    const s = a.sessionId ? store.db.sessions[a.sessionId] : null
    const order = a.orderId ? store.db.orders[a.orderId] : null
    store.resolveApproval(id, 'ok')

    switch (a.type) {
      case 'payment': {
        if (!order || !s) return `#${id} waa la xaqiijiyay, laakiin dalabka lama helin.`
        if (order.claimFor === 'final') {
          order.finalPaid = true
          order.stage = 'dhiibay'
          order.followupAt = Date.now() + 7 * DAY
          s.stage = 'dhiibay'
          queue(s, delivered(s.lang))
          store.save()
          return `✅ 50% dhammaad waa la xaqiijiyay (O${order.id}). Macaamiilka waa la wargeliyay; follow-up 7 maalmood kadib.`
        }
        order.depositPaid = true
        order.stage = 'socda'
        s.stage = 'socda'
        queue(s, paymentConfirmed(a.data.amount, s.lang))
        const draft = await contractDraft(order, s)
        store.save()
        if (!draft) return `✅ 50% horay waa la xaqiijiyay (O${order.id}); macaamiilka waa la wargeliyay.\nHeshiiska gacanta ku diyaari (AI ma diyaarin karin).`
        const c = store.addApproval({ type: 'contract', level: 2, sessionId: s.id, orderId: order.id, summary: 'Qabyo heshiis', data: { draft } })
        return `✅ 50% horay waa la xaqiijiyay (O${order.id}); macaamiilka waa la wargeliyay.\n\n📄 Qabyo heshiis #${c.id} (qareen ha eego):\n${draft}\n\nOK #${c.id} = u dir macaamiilka · NO #${c.id} = ha diriyin`
      }
      case 'contract':
        if (s) queue(s, `${a.data.draft}\n\n—\nHaddii aad ku raacsan tahay, ii jawaab "Waan aqbalay" oo Farah ayaa saxiixa la socda.`)
        return `✅ Heshiiska waa loo diray macaamiilka (#${id}).`
      case 'order_big':
        if (order && s) {
          order.stage = 'sugaya_lacag'
          s.stage = 'sugaya_lacag'
          queue(s, payInstructions({ deposit: order.deposit, total: order.price, monthly: order.monthly, details: cfg.paymentDetails }, s.lang))
          store.save()
        }
        return `✅ Habka lacag-bixinta waa loo diray macaamiilka (dalab O${order?.id}).`
      case 'held_reply':
        if (s) queue(s, a.data.draft)
        return `✅ Jawaabta la hakiyay waa la diray (#${id}).`
      case 'delivery':
        if (order && s) {
          order.stage = 'sugaya_lacag_2'
          s.stage = 'sugaya_lacag_2'
          queue(s, finalPayment(order.price / 2, s.lang))
          store.save()
        }
        return `✅ Macaamiilka waa la weydiiyay 50% dhammaadka (O${order?.id}).`
      default:
        return `✅ #${id} waa la xaliyay.`
    }
  }

  function reject(id) {
    const a = store.db.approvals[id]
    if (!a || a.status !== 'pending') return `#${id} lama helin, ama hore ayaa loo xalliyay.`
    store.resolveApproval(id, 'no')
    const s = a.sessionId ? store.db.sessions[a.sessionId] : null
    const order = a.orderId ? store.db.orders[a.orderId] : null
    if (a.type === 'payment' && order && s) {
      order.stage = order.claimFor === 'final' ? 'sugaya_lacag_2' : 'sugaya_lacag'
      s.stage = order.stage
      queue(s, tr('paymentRejected', s.lang))
      store.save()
      return `❌ Lacagta lama xaqiijin (#${id}); macaamiilka waa la wargeliyay.`
    }
    if (a.type === 'order_big' && order) {
      order.stage = 'joojiyay'
      store.save()
    }
    return `❌ #${id} waa la diiday.`
  }

  function replyTo(id, text) {
    const a = store.db.approvals[id]
    const s = a?.sessionId ? store.db.sessions[a.sessionId] : null
    if (!a || !s) return `#${id} macaamiil kuma xidhna.`
    queue(s, text)
    if (a.status === 'pending') store.resolveApproval(id, 'ok')
    return `✅ Fariinta waa loo diray macaamiilka (#${id}).`
  }

  function pendingList() {
    const list = store.pendingApprovals()
    if (!list.length) return 'Wax sugaya ma jiraan. ✅'
    return list.map((a) => `#${a.id} [heer ${a.level}] ${a.type}: ${short(a.summary, 100)}`).join('\n')
  }

  function ordersList() {
    const list = Object.values(store.db.orders).filter((o) => !['dhiibay', 'joojiyay'].includes(o.stage))
    if (!list.length) return 'Dalab furan ma jiro.'
    return list.map((o) => `O${o.id} ${o.serviceName} $${o.price} — ${o.stage}${o.depositPaid ? ' · 50% horay ✔' : ''}`).join('\n')
  }

  function buildReport(now = Date.now()) {
    const sessions = Object.values(store.db.sessions)
    const orders = Object.values(store.db.orders)
    const since = now - DAY
    const newSessions = sessions.filter((s) => s.createdAt >= since).length
    const deposits = orders.filter((o) => o.depositPaid).reduce((n, o) => n + o.price / 2, 0)
    const finals = orders.filter((o) => o.finalPaid).reduce((n, o) => n + o.price / 2, 0)
    const byStage = {}
    for (const o of orders) byStage[o.stage] = (byStage[o.stage] || 0) + 1
    const services = {}
    for (const s of sessions) if (s.brief.service) services[s.brief.service] = (services[s.brief.service] || 0) + 1
    const top = Object.entries(services).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} (${v})`).join(', ') || '—'
    const calls = meta().llm?.calls || 0
    const st = { total: 0, unknown: 0, escalated: 0, held: 0, ...meta().stats }
    const autoRate = st.total ? Math.round(((st.total - st.unknown - st.escalated - st.held) / st.total) * 100) : 0
    return [
      '📊 Warbixinta maalinlaha ah — FCS Technology',
      `Macaamiil cusub (24h): ${newSessions} · Wadar wada-hadal: ${sessions.length}`,
      `Dalabyada: ${orders.length} (${Object.entries(byStage).map(([k, v]) => `${k}: ${v}`).join(', ') || '—'})`,
      `Lacag la xaqiijiyay: $${deposits + finals} (50% horay: $${deposits}, dhammaad: $${finals})`,
      `Adeegyada la weydiiyay: ${top}`,
      `Sugaya go'aankaaga: ${store.pendingApprovals().length}`,
      `Si toos ah loo jawaabay: ${autoRate}% (${st.total - st.unknown - st.escalated - st.held}/${st.total}) — bartilmaameedka 80%`,
      `Su'aalo aan la aqoon: ${st.unknown} · U gudbay Farah: ${st.escalated} · La hakiyay: ${st.held}`,
      `Codsiyada AI maanta: ${calls}${meta().paused ? '\n⏸ NIDAAMKU WAA HAKIYAY (/resume)' : ''}`,
    ].join('\n')
  }

  const help = [
    'Amarrada:',
    'OK #id · NO #id — ogolow / diid',
    '/reply #id qoraal — macaamiilka u dir',
    '/pending · /orders · /status · /report · /crm',
    "/teach su'aal => jawaab — AI-ga baro",
    '/unanswered · /answer <id> jawaab — su\'aalaha aan la aqoon',
    '/faq · /forget <id> — liiska wixii la baray',
    'Qor su\'aal caadi ah (ma aha amar) si aad u tijaabiso sida AI-gu u jawaabayo',
    '/stage <orderId> <xaalad> — ' + STAGES.join(', '),
    '/deliver <orderId> — hubinta tayada + codsi ogolaansho dhiibis',
    '/draft <orderId> — qabyo shaqo (CV, plan…)',
    '/posts — 5 post toddobaadka',
    '/groups — liiska group-yada AI-gu ku jiro',
    '/announce <groupId|dhammaan> qoraal — u dir ogeysiis group(s)',
    '/stop · /resume — xidh/fur dhammaan agents-ka',
  ].join('\n')

  async function handleOwner(raw) {
    const text = String(raw || '').trim()
    let m
    if ((m = text.match(/^(?:ok|yes|haa)\s*#?(\d+)\b/i))) return approve(Number(m[1]))
    if ((m = text.match(/^(?:no|maya)\s*#?(\d+)\b/i))) return reject(Number(m[1]))
    if ((m = text.match(/^\/reply\s+#?(\d+)\s+([\s\S]+)/i))) return replyTo(Number(m[1]), m[2].trim())

    if (text && !text.startsWith('/')) {
      const r = knowledge.answer(text, { lang: detectLang(text), llmOn: false })
      return r.matched
        ? `🧪 Tijaabo — sidan ayaa macaamiilka loogu jawaabi lahaa [${r.kind}]:\n\n${r.text}\n\nKhalad miyaa? /teach ${short(text, 60)} => jawaabta saxda ah`
        : `🤷 Ma aqaan. Macaamiilka waxaa loo sheegi lahaa in Farah soo laabanayo.\nKu baro: /teach ${short(text, 60)} => jawaabta saxda ah`
    }

    const [cmdRaw, ...args] = text.split(/\s+/)
    const cmd = cmdRaw.toLowerCase().replace(/@\w+$/, '')
    switch (cmd) {
      case '/start':
      case '/help':
        return help
      case '/stop':
        meta().paused = true
        store.save()
        return '⏸ Dhammaan agents-ka waa la hakiyay. Macaamiisha waxaa loo sheegayaa "waan hubinayaa". /resume si aad u furto.'
      case '/resume':
        meta().paused = false
        store.save()
        return '▶️ Agents-ku waa shaqeynayaan.'
      case '/pending':
        return pendingList()
      case '/orders':
        return ordersList()
      case '/status':
        return `${meta().paused ? '⏸ Waa la hakiyay' : '▶️ Shaqeynaya'} · LLM: ${llm.provider}${llm.available() ? '' : ' (lama dejin)'}\n${pendingList()}`
      case '/report':
        return buildReport()
      case '/crm':
        return { text: 'CRM', document: { name: 'fcs-crm.csv', content: store.toCsv() } }
      case '/teach': {
        const parts = text.slice(cmdRaw.length).trim().split(/\s*=>\s*/)
        if (parts.length < 2 || !parts[0] || !parts[1]) return "Isticmaal: /teach su'aal => jawaabta saxda ah\nTusaale: /teach ma la kulmi karaa xafiiska => Haa, Borama ayaan joognaa, ballan ka qaado WhatsApp."
        const item = knowledge.teach(parts[0], parts.slice(1).join(' => '))
        return `✅ Waan bartay (#${item.id}). Mar dambe su'aal la mid ah macaamiilka wuu ku jawaabayaa.`
      }
      case '/forget':
        return knowledge.forget(args[0]) ? `🗑 #${args[0]} waa la tirtiray.` : 'Lama helin. /faq si aad u aragto liiska.'
      case '/faq': {
        const list = knowledge.listTaught()
        return `📚 Aasaaska: ${knowledge.seedCount} su'aal oo hore loo diyaariyay + ${list.length} aad baartay.\n${list.slice(-10).map((t) => `#${t.id} ${short(t.q, 60)} → ${short(t.a, 60)}`).join('\n') || '(weli waxaad waxba baraynin)'}`
      }
      case '/unanswered': {
        const open = Object.values(store.db.knowledge?.unanswered || {}).filter((u) => u.status === 'open').slice(-10)
        return open.length ? open.map((u) => `#u${u.id} ${short(u.text, 100)}`).join('\n') + '\n\n/answer <id> jawaab' : 'Su\'aal aan la jawaabin ma jirto. ✅'
      }
      case '/answer': {
        const u = store.db.knowledge?.unanswered?.[Number(args[0])]
        const reply = args.slice(1).join(' ').trim()
        if (!u || u.status !== 'open' || !reply) return "Isticmaal: /answer <id> jawaabta saxda ah (id-ga ka eeg /unanswered)"
        const sess = store.db.sessions[u.sessionId]
        if (sess) queue(sess, reply)
        knowledge.teach(u.text, reply)
        u.status = 'answered'
        store.save()
        return `✅ Macaamiilka waa loo diray, AI-gu wuu bartay ("${short(u.text, 60)}").`
      }
      case '/stage': {
        const order = store.db.orders[Number(args[0])]
        if (!order || !STAGES.includes(args[1])) return 'Isticmaal: /stage <orderId> <xaalad>\nXaaladaha: ' + STAGES.join(', ')
        order.stage = args[1]
        const sess = store.db.sessions[order.sessionId]
        if (sess) sess.stage = args[1]
        store.save()
        return `O${order.id} → ${args[1]}`
      }
      case '/deliver': {
        const order = store.db.orders[Number(args[0])]
        if (!order) return 'Isticmaal: /deliver <orderId>'
        let report = 'Hubinta AI ma jirto (LLM lama dejin).'
        if (llm.available()) {
          try {
            const qa = await agents.qa({ input: 'Hubi tayada ka hor dhiibista.', extra: `Adeegga: ${order.serviceName}\nBrief: ${JSON.stringify(order.brief)}` })
            if (qa) report = `Talo: ${qa.recommendation}\nLa hubiyay: ${(qa.checklist || []).join('; ')}\nMaqan: ${(qa.missing || []).join('; ') || '—'}\n${qa.notes || ''}`
          } catch (e) {
            report = 'Hubinta AI waa fashilantay: ' + e.message
          }
        }
        const a = store.addApproval({ type: 'delivery', level: 2, sessionId: order.sessionId, orderId: order.id, summary: `Dhiibis O${order.id}` })
        return `🔍 Hubinta tayada O${order.id} — ${order.serviceName}\n${report}\n\nOK #${a.id} = weydii macaamiilka 50% dhammaadka · NO #${a.id} = ha diriyin`
      }
      case '/draft': {
        const order = store.db.orders[Number(args[0])]
        if (!order) return 'Isticmaal: /draft <orderId>'
        if (!llm.available()) return 'LLM lama dejin.'
        const draft = await agents.draft({ input: 'Diyaari qabyada shaqada.', extra: `Adeegga: ${order.serviceName}\nBrief: ${JSON.stringify(order.brief)}` })
        return `📝 Qabyo O${order.id} (macaamiilka LAMA DIRIN):\n\n${draft}`
      }
      case '/posts': {
        if (!llm.available()) return 'LLM lama dejin.'
        return '📣 Post-yada toddobaadka (lama daabicin):\n\n' + (await agents.posts({ input: 'Diyaari 5 post oo toddobaadkan ah.' }))
      }
      case '/groups': {
        const list = Object.values(store.db.groups || {})
        if (!list.length) return 'Group aan la diiwaan gelinin ma jiro. Bot-ka (@publicBot) ku dar group, wuu is diiwaan gelinayaa.'
        return list
          .sort((a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0))
          .map((g) => `#${g.id} ${g.title || '(magac la\'aan)'} — ugu dambeyn ${new Date(g.lastSeenAt || g.addedAt).toISOString().slice(0, 10)}`)
          .join('\n')
      }
      case '/announce': {
        const target = args[0]
        const body = args.slice(1).join(' ').trim()
        if (!target || !body) return 'Isticmaal: /announce <groupId|dhammaan> qoraalka\n/groups si aad u aragto liiska.'
        const groups = store.db.groups || {}
        const targets = ['dhammaan', 'all'].includes(target) ? Object.keys(groups) : [target]
        let sent = 0
        for (const id of targets) {
          if (!groups[id]) continue
          try {
            await sendGroup(id, body)
            sent++
          } catch (e) {
            store.log('error', { message: e.message })
          }
        }
        return sent ? `✅ Ogeysiiska waxaa loo diray ${sent} group.` : 'Group lama helin ama bot-ka group-yada lama dejin (/groups).'
      }
      default:
        return 'Amarkaas ma aqaan. /help'
    }
  }

  async function tick(now = Date.now()) {
    const local = new Date(now + cfg.tzOffsetHours * 3600 * 1000)
    const day = local.toISOString().slice(0, 10)
    if (local.getUTCHours() >= cfg.reportHour && meta().lastReportDay !== day) {
      meta().lastReportDay = day
      store.save()
      say(buildReport(now))
      if (local.getUTCDay() === 1 && meta().lastPostsWeek !== day && llm.available()) {
        meta().lastPostsWeek = day
        try {
          say('📣 Post-yada toddobaadka (lama daabicin):\n\n' + (await agents.posts({ input: 'Diyaari 5 post oo toddobaadkan ah.' })))
        } catch (e) {
          store.log('error', { message: e.message })
        }
      }
    }

    const steps = [
      ['f24', DAY],
      ['f72', 3 * DAY],
      ['f168', 7 * DAY],
    ]
    for (const s of Object.values(store.db.sessions)) {
      if (s.orderId || s.stage !== 'iibin') continue
      for (const [key, after] of steps) {
        if (!s.followups[key] && now - s.updatedAt >= after) {
          s.followups[key] = now
          queue(s, tr('followup', s.lang))
          store.save()
          break
        }
      }
    }
    for (const o of Object.values(store.db.orders)) {
      if (o.stage === 'dhiibay' && o.followupAt && !o.followupDone && now >= o.followupAt) {
        o.followupDone = true
        const s = store.db.sessions[o.sessionId]
        if (s) queue(s, tr('followup', s.lang))
        say(`🔔 Follow-up 7 maalmood: O${o.id} ${o.serviceName} — macaamiilka waa la xusuusiyay. Weydii adeeg kale?`)
        store.save()
      }
    }
  }

  return { handleCustomer, handleStaff, handleOwner, tick, buildReport, approve, reject }
}
