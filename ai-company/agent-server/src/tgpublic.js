import { createRateLimiter, detectLang } from './guard.js'

const WELCOME = [
  "Asc! Waxaan ahay caawiyaha AI ee FCS Technology (Borama, Somaliland).",
  "Waxaan kaa caawin karaa qiimaha, waqtiga, waxa ku jira adeegyada iyo dalabka. Qor su'aashaada, ama:",
  '',
  '/adeegyada — liiska adeegyada iyo qiimayaasha',
  '/dalab — dalab samee (waan ku hagayaa)',
  '/xiriir — xiriirka Farah',
].join('\n')

const SHORTCUTS = {
  '/adeegyada': 'maxaad bixin kartaa',
  '/dalab': 'sidee dalab u sameeyaa',
  '/xiriir': 'lambarka xiriirka',
}

export const telegramSessionId = (chatId) => 'tg' + String(chatId).replace('-', 'n').padStart(14, '0')

// Isku xidha bot-ka Telegram ee dadka (macaamiisha) iyo AI-ga: isla socodka website chat-ka.
// `office`: haddii bot-kani u gaar yahay hal xafiis (persona bot), la isticmaalo si outbox-ku (flushOutbox) uu
// isaga u dirin kaliya sesion-nada hadda kula socda BOT-kan (haddii macaamiilku u wareego bot kale, halkaas ayaa loo diraa).
export function createTelegramBridge({ store, orchestrator, bot, welcome = WELCOME, office = 'public', rate = { max: 20, windowMs: 10 * 60 * 1000 } }) {
  const limiter = createRateLimiter(rate)

  function bindSession(chatId, msg) {
    const session = store.getSession(telegramSessionId(chatId))
    session.tgChat = chatId
    session.tgBotOffice = office
    if (msg?.from?.first_name) session.name = msg.from.first_name
    store.save()
    return session
  }

  async function handle(text, chatId, msg) {
    let t = String(text || '').trim()
    if (!t) return ''
    const cmd = t.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, '')
    // /start iyo /help sidoo kale waa la isku-xidhaa (tgChat/tgBotOffice) si Farah uu u dirto fariin xitaa haddii
    // macaamiilku aan weli qorin fariin dhab ah — ma aha oo kaliya markuu wax weydiiyo.
    if (cmd === '/start' || cmd === '/help') {
      bindSession(chatId, msg)
      return welcome
    }
    if (SHORTCUTS[cmd]) t = SHORTCUTS[cmd]
    else if (t.startsWith('/')) return welcome

    if (!limiter.allow(String(chatId))) return 'Fadlan yara sug, fariimo aad u badan ayaad dirtay.'

    const sessionId = telegramSessionId(chatId)
    bindSession(chatId, msg)
    const { reply } = await orchestrator.handleCustomer({ sessionId, text: t, name: msg?.from?.first_name })
    return reply
  }

  // Fariimaha Farah ogolaaday ama u diray (/reply, /answer, OK #id) ayaa loo sii dirayaa macaamiilka Telegram-ka.
  async function flushOutbox() {
    for (const s of Object.values(store.db.sessions)) {
      if (!s.tgChat || (s.tgBotOffice || 'public') !== office) continue
      for (const m of store.readOutbox(s.id, s.tgCursor || 0)) {
        await bot.send(m.text, s.tgChat)
        s.tgCursor = m.id
        store.save()
      }
    }
  }

  return { handle, flushOutbox }
}

// Bot-ka shaqaalaha gudaha (xafiis kasta oo aan ahayn 'sales') — kaliya Farah (OWNER_CHAT_ID) ayaa lagula hadlaa,
// qof kale oo qora waxaa loo sheegayaa in bot-kan uu yahay mid shaqaale gudaha ah, kuma jawaabo dalabyada macaamiisha.
export function createStaffBridge({ orchestrator, office, welcome, ownerChatId }) {
  async function handle(text, chatId) {
    const t = String(text || '').trim()
    if (!t) return ''
    if (!ownerChatId) return "Bot-kan shaqaale gudaha ah lama dejin (OWNER_CHAT_ID lama qorin)."
    if (String(chatId) !== String(ownerChatId)) {
      return 'Waan ka xumahay, bot-kan waa shaqaale gudaha ah oo kaliya Farah la hadlo. Adeegyada iyo dalabka, fadlan la xiriir @FCS_Sales_bot ama WhatsApp +252 63 713 3499.'
    }
    if (t === '/start' || t === '/help') return welcome
    const { reply } = await orchestrator.handleStaff({ office, text: t })
    return reply
  }
  return { handle, flushOutbox: async () => {} }
}

const THANKS = { so: "🙏 Mahadsanid su'aashaada!", en: '🙏 Thanks for your question!', ar: '🙏 شكرًا على سؤالك!' }

const GROUP_WELCOME = [
  'Asc dhammaan! Waxaan ahay caawiyaha AI ee FCS Technology (Borama, Somaliland).',
  "Halkan waxaan ku jawaabi doonaa su'aalaha guud ee adeegyada, qiimaha iyo dalabka marka la i xuso (@mention) ama la ii jawaabo (reply).",
  'Si aad dalab u sameyso, fariin gaar ah (DM) ii soo dir ama nala soo xiriir WhatsApp +252 63 713 3499 — xogtaada gaarka ah yaanay group-ka ku qornaan.',
  '/adeegyada — liiska adeegyada iyo qiimayaasha',
].join('\n')

// Bot-ka group-yada (fan-page/community): ka jawaaba su'aalaha guud, macaamiisha DM ugu celiya dalabka, oo Farah u diri kara ogeysiisyo.
export function createGroupBridge({ store, knowledge }) {
  function registerGroup(chatId, msg) {
    const groups = (store.db.groups ||= {})
    const g = groups[chatId] || { id: chatId, addedAt: Date.now() }
    if (msg?.chat?.title) g.title = msg.chat.title
    g.lastSeenAt = Date.now()
    groups[chatId] = g
    store.save()
    return g
  }

  const wasBotAdded = (msg, botUsername) =>
    botUsername ? (msg?.new_chat_members || []).some((m) => m.username?.toLowerCase() === botUsername.toLowerCase()) : false

  const mentioned = (text, botUsername) => Boolean(botUsername) && new RegExp('@' + botUsername + '\\b', 'i').test(text)

  const isReplyToBot = (msg, botUsername) =>
    Boolean(botUsername) && msg?.reply_to_message?.from?.is_bot && msg.reply_to_message.from.username?.toLowerCase() === botUsername.toLowerCase()

  async function handle(text, chatId, msg, { botUsername = '' } = {}) {
    registerGroup(chatId, msg)
    if (wasBotAdded(msg, botUsername)) return GROUP_WELCOME

    let t = String(text || '').trim()
    if (!t) return ''

    const cmd = t.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, '')
    const addressed = Boolean(SHORTCUTS[cmd]) || mentioned(t, botUsername) || isReplyToBot(msg, botUsername)
    if (SHORTCUTS[cmd]) t = SHORTCUTS[cmd]
    else if (botUsername) t = t.replace(new RegExp('@' + botUsername, 'ig'), '').trim()
    if (!t) return ''
    const wantsOrder = knowledge.orderIntent(t).wants
    if (!addressed && !wantsOrder && !knowledge.looksLikeQuestion(t)) return ''

    const lang = detectLang(t)
    if (wantsOrder) {
      return lang === 'en'
        ? `To place an order, please message me privately (DM)${botUsername ? ' @' + botUsername : ''} or WhatsApp +252 63 713 3499 — let's keep your details out of the group.`
        : `Si aad dalab u sameyso, fadlan ii soo dir fariin gaar ah (DM)${botUsername ? ' @' + botUsername : ''} ama nala soo xiriir WhatsApp +252 63 713 3499 — xogtaada gaarka ah yaanay group-ka ku qornaan.`
    }

    const r = knowledge.answer(t, { lang, llmOn: false })
    if (r.matched) return r.text + '\n\n' + (THANKS[lang] || THANKS.so)
    if (!addressed) return ''
    return knowledge.fallbackText(lang)
  }

  return { handle }
}
