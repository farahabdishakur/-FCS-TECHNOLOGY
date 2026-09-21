import { loadDotEnv, loadConfig } from './config.js'
import { createTelegram } from './telegram.js'
import { createApp } from './app.js'
import { createTelegramBridge, createGroupBridge, createStaffBridge } from './tgpublic.js'
import { PERSONAS, personaWelcome, staffWelcome } from './personas.js'

loadDotEnv()
const cfg = loadConfig()

const telegram = createTelegram({
  token: cfg.telegram.token,
  ownerChatId: cfg.telegram.ownerChatId,
  log: (type, data) => app.store.log(type, data),
})
const ideasBot = createTelegram({
  token: cfg.telegram.ideasToken,
  ownerChatId: cfg.telegram.ownerChatId,
  log: (type, data) => app.store.log('ideas_' + type, data),
})
const publicBot = createTelegram({
  token: cfg.telegram.publicToken,
  ownerChatId: '',
  log: (type, data) => app.store.log('public_' + type, data),
})
const app = createApp(cfg, { notify: (text) => telegram.send(text), sendGroup: (chatId, text) => publicBot.send(text, chatId) })
const bridge = createTelegramBridge({ store: app.store, orchestrator: app.orchestrator, bot: publicBot })
const groupBridge = createGroupBridge({ store: app.store, knowledge: app.knowledge })

// Xafiis kasta oo TELEGRAM_OFFICE_BOTS ku qoran (.env) wuxuu helayaa bot Telegram gaar ah. 'sales' kaliya ayaa
// macaamiisha la hadla (customer flow, isla orchestrator.handleCustomer); intiisa kale waa shaqaale gudaha ah oo
// Farah oo kaliya (OWNER_CHAT_ID) la hadli karo — orchestrator.handleStaff, taariikh gaar ah xafiis kasta.
const officeBots = {}
for (const [office, token] of Object.entries(cfg.telegram.officeBots)) {
  const bot = createTelegram({ token, ownerChatId: '', log: (type, data) => app.store.log(`office_${office}_${type}`, data) })
  const bridge =
    office === 'sales'
      ? createTelegramBridge({ store: app.store, orchestrator: app.orchestrator, bot, welcome: personaWelcome(office), office })
      : createStaffBridge({ orchestrator: app.orchestrator, office, welcome: staffWelcome(office), ownerChatId: cfg.telegram.ownerChatId })
  officeBots[office] = { bot, bridge }
}

app.server.listen(cfg.port, () => {
  const b = app.brain
  console.log(`FCS agent-server: http://localhost:${cfg.port}`)
  console.log(`Brain: ${b.catalog.length} adeeg, ${Object.keys(b.offices).length} xafiis`)
  console.log(`LLM: ${app.llm.provider}${app.llm.available() ? '' : ' (LAMA DEJIN — macaamiisha waxaa loo jawaabayaa "waan ku soo laabanaynaa")'}`)
  console.log(`Bot-ka dadka (macaamiisha): ${publicBot.enabled ? 'shidan' : 'lama dejin (PUBLIC_BOT_TOKEN)'}`)
  console.log(`Bot-ka group-yada: ${publicBot.enabled ? 'shidan (isla PUBLIC_BOT_TOKEN, ku dar group)' : 'lama dejin (PUBLIC_BOT_TOKEN)'}`)
  console.log(`Bot fikradaha: ${ideasBot.enabled ? 'shidan' : 'lama dejin (IDEAS_BOT_TOKEN)'}`)
  const officeCount = Object.keys(officeBots).length
  console.log(
    officeCount
      ? `Bot-yada xafiisyada (${officeCount}): ${Object.entries(officeBots).map(([o, x]) => `${PERSONAS[o]?.name || o}${o === 'sales' ? ' [macaamiisha]' : ' [shaqaale-Farah]'}${x.bot.enabled ? '' : ' (token khaldan)'}`).join(', ')}`
      : 'Bot-yada xafiisyada: lama dejin (TELEGRAM_OFFICE_BOTS)',
  )
  console.log(`Aasaaska AI-ga: ${app.knowledge.seedCount} su'aal oo hore loo diyaariyay + ${app.knowledge.listTaught().length} aad baartay`)
  console.log(`Telegram: ${telegram.enabled ? (cfg.telegram.ownerChatId ? 'diyaar' : 'bot waa shidan yahay; /start u qor si aad u hesho chat id') : 'lama dejin (digniinaha waxaa lagu qorayaa console)'}`)
  if (!cfg.paymentDetails) console.log('DIGNIIN: PAYMENT_DETAILS lama dejin — macaamiisha waxaa loo sheegayaa in Farah lambarka soo diri doono.')
})

telegram.poll((text) => app.orchestrator.handleOwner(text))
ideasBot.poll((text) => app.ideas.handle(text))
publicBot.poll(bridge.handle, { public: true, onGroupText: groupBridge.handle })
if (publicBot.enabled) setInterval(() => bridge.flushOutbox().catch((e) => app.store.log('flush_error', { message: e.message })), 5000).unref()
for (const [office, x] of Object.entries(officeBots)) {
  x.bot.poll(x.bridge.handle, { public: true })
  if (x.bot.enabled) setInterval(() => x.bridge.flushOutbox().catch((e) => app.store.log('flush_error', { office, message: e.message })), 5000).unref()
}
setInterval(() => app.orchestrator.tick().catch((e) => app.store.log('tick_error', { message: e.message })), 60 * 1000).unref()

const shutdown = () => {
  telegram.stop()
  ideasBot.stop()
  publicBot.stop()
  for (const x of Object.values(officeBots)) x.bot.stop()
  app.store.flush()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
