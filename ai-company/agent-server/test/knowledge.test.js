import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { ROOT, loadConfig, writeEnv } from '../src/config.js'
import { createApp } from '../src/app.js'
import { detectLang } from '../src/guard.js'
import { detectChatId } from '../src/telegram.js'

const flush = () => new Promise((r) => setImmediate(r))
const sid = () => 'sess' + Math.random().toString(36).slice(2).padEnd(14, 'x')

// Server la'aan LLM: sida macaamiilku u arko marka aan key la dejin
function setup(over = {}) {
  const cfg = {
    ...loadConfig({}),
    dataDir: mkdtempSync(path.join(tmpdir(), 'fcs-kn-')),
    paymentDetails: 'EVC Plus: 0630000000 (Test)',
    llm: { provider: 'none', apiKey: '', model: '', baseUrl: '', dailyLimit: 100, timeoutMs: 1000 },
    ...over,
  }
  const notes = []
  const app = createApp(cfg, { notify: (t) => notes.push(t) })
  const say = async (sessionId, text) => {
    const r = await app.orchestrator.handleCustomer({ sessionId, text })
    await flush()
    return r.reply
  }
  const owner = async (text) => {
    const r = await app.orchestrator.handleOwner(text)
    await flush()
    return r
  }
  return { app, notes, say, owner, store: app.store, cfg }
}

test('Key la\'aan: AI-gu wuu jawaabaa su\'aalaha caadiga ah (qiimo, catalogue, dalab)', async () => {
  const t = setup()
  assert.match(await t.say(sid(), 'maxaad bixin kartaa'), /30 adeeg/)
  assert.match(await t.say(sid(), 'Qiimaha logo waa immisa?'), /\$49/)
  assert.match(await t.say(sid(), 'Waxaan rabaa nidaam maqaaxi'), /\$100 \+ \$25\/bil/)
  assert.match(await t.say(sid(), 'How much is a business card?'), /\$20/)
  assert.deepEqual(t.notes, [])
})

test('Macnaha wada-hadalka: "waqtigu intee yahay" wuxuu la xiriiraa adeeggii hore', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'Qiimaha CV-ga')
  assert.match(await t.say(s, 'waqtigu intee yahay?'), /1–2 Maalmood/)
})

test('Su\'aal aan la aqoon: Farah ayaa la wargelinayaa, /answer wuu jawaabaa oo AI-gu wuu barayaa', async () => {
  const t = setup()
  const s = sid()
  const q = 'Ma sameysaan ilaalinta gaadhiga?'
  const reply = await t.say(s, q)
  assert.match(reply, /Farah ayaa kuu soo jawaabi/)
  assert.match(t.notes[0], /Su'aal aan la aqoon #u1/)

  const out = await t.owner('/answer 1 Maya, adeeggaas ma bixinno; waxaan ku takhasusnahay dijital.')
  assert.match(out, /AI-gu wuu bartay/)
  assert.match(t.store.readOutbox(s)[0].text, /adeeggaas ma bixinno/)

  const again = await t.say(sid(), q)
  assert.match(again, /ma bixinno/)
  assert.equal(t.notes.length, 1)
})

test('/teach iyo /forget iyo tijaabo: Farah ayaa baraya', async () => {
  const t = setup()
  assert.match(await t.owner('/teach ma la kulmi karaa xafiiska => Haa, Borama ayaan joognaa; ballan ka qaado WhatsApp.'), /Waan bartay/)
  assert.match(await t.say(sid(), 'ma la kulmi karaa xafiiska?'), /ballan ka qaado/)
  const preview = await t.owner('ma la kulmi karaa xafiiska')
  assert.match(preview, /Tijaabo/)
  assert.match(preview, /ballan ka qaado/)
  assert.match(await t.owner('/faq'), /1 aad baartay/)
  assert.match(await t.owner('/forget 1'), /la tirtiray/)
  assert.doesNotMatch(await t.say(sid(), 'ma la kulmi karaa xafiiska?'), /ballan ka qaado/)
  assert.match(await t.owner('waxaan rabaa sawir cirka'), /Ma aqaan|Tijaabo/)
})

test('Wax la baray waxay dhaafaan xogta hore (Farah ayaa saxa)', async () => {
  const t = setup()
  await t.owner('/teach logo waa immisa => Logo hadda waa $45 (ololaha).')
  assert.match(await t.say(sid(), 'logo waa immisa'), /\$45/)
})

test('Lambar telefoon: lead ayaa la kaydiyaa, Farah ayaa la wargelinayaa', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'Qiimaha logo?')
  const reply = await t.say(s, 'Magaca Cali, WhatsApp 0634567890')
  assert.match(reply, /Lambarkaaga/)
  assert.match(t.notes[0], /Lead cusub/)
  assert.match(t.notes[0], /Logo Design/)
  assert.equal(t.store.db.sessions[s].phone, '0634567890')
})

test('Adeeg aan cadayn (pos): waa la weydiiyaa kee', async () => {
  const t = setup()
  assert.match(await t.say(sid(), 'pos ma haysaan'), /Kee ayaad rabtaa/)
})

test('Su\'aalaha caadiga ah: 90%+ way jawaabaan (eval-cases.json)', () => {
  const t = setup()
  const cases = JSON.parse(readFileSync(path.join(ROOT, '..', 'knowledge', 'eval-cases.json'), 'utf8'))
  const failed = cases.filter((c) => {
    const r = t.app.knowledge.answer(c.q, { lang: detectLang(c.q), llmOn: false })
    return c.unmatched ? r.matched : !(r.matched && new RegExp(c.re, 'i').test(r.text))
  })
  assert.ok(failed.length / cases.length <= 0.1, 'fashilmay: ' + failed.map((c) => c.q).join(' | '))
})

test('Warbixinta: heerka jawaabta toos ah (bartilmaameed 80%)', async () => {
  const t = setup()
  await t.say(sid(), 'Qiimaha logo?')
  await t.say(sid(), 'maxaad bixin kartaa')
  await t.say(sid(), 'sidee lacagta u bixiyaa')
  await t.say(sid(), 'wax aan la aqoon oo ku saabsan gaadhiga')
  const report = await t.owner('/report')
  assert.match(report, /Si toos ah loo jawaabay: 75% \(3\/4\)/)
})

test('Bot-ka fikradaha: kaydi, qorshee, mashruuc ka dhig', async () => {
  const t = setup()
  const ideas = t.app.ideas
  const saved = await ideas.handle('Waxaan rabaa logo iyo business card ganacsi cusub')
  assert.match(saved, /Fikrad #1/)
  assert.match(saved, /Logo Design/)
  assert.match(await ideas.handle('/ideas'), /#1 \[cusub\]/)
  const plan = await ideas.handle('/plan 1')
  assert.match(plan, /Qorshe/)
  assert.match(plan, /\$69/)
  assert.match(await ideas.handle('/note 1 weydii midabada'), /Xusuus/)
  assert.match(await ideas.handle('/promote 1'), /mashruuc/)
  assert.match(await ideas.handle('/projects'), /#1/)
  assert.match(await ideas.handle('/done 1'), /dhammaaday/)
  assert.match(await ideas.handle('/del 1'), /la tirtiray/)
  assert.match(await ideas.handle('/ideas'), /ma jirto/)
})

test('Telegram chat id: getUpdates ayaa la akhriyaa; .env waa la cusboonaysiiyaa', async () => {
  const fake = async () => new Response(JSON.stringify({ ok: true, result: [{ message: { chat: { id: 111 } } }, { message: { chat: { id: 987654 } } }] }), { status: 200 })
  assert.equal(await detectChatId('TOKEN', fake), '987654')
  const empty = async () => new Response(JSON.stringify({ ok: true, result: [] }), { status: 200 })
  assert.equal(await detectChatId('TOKEN', empty), null)

  const file = path.join(mkdtempSync(path.join(tmpdir(), 'fcs-env-')), '.env')
  writeEnv({ A: '1', B: '2' }, file)
  writeEnv({ B: '3', C: '4' }, file)
  assert.equal(readFileSync(file, 'utf8'), 'A=1\nB=3\nC=4\n')
})


test('Linki: jawaabta adeegga waxay leedahay linkiga bogga adeegga', async () => {
  const t = setup({ siteUrl: 'https://example.test' })
  assert.match(await t.say(sid(), 'Qiimaha logo waa immisa?'), /https:\/\/example\.test\/services\/logo-design/)
  assert.match(await t.say(sid(), 'ii sheeg cafe system waqtiga'), /\/services\/cafe-pos/)
  assert.match(await t.say(sid(), 'maxaad bixin kartaa'), /https:\/\/example\.test\/services/)
})

test('Hagaha dalabka: qofka aan aqoon sida loo dalbado ayaa la hagayaa ilaa dalabka la diiwaangeliyo', async () => {
  const t = setup({ siteUrl: 'https://example.test' })
  const s = sid()
  const first = await t.say(s, 'sidee dalab u sameeyaa?')
  assert.match(first, /Adeegga kee ayaad rabtaa/)
  assert.match(first, /30 adeeg/)

  const intro = await t.say(s, 'logo')
  assert.match(intro, /Logo Design \(\$49/)
  assert.match(intro, /example\.test\/services\/logo-design/)
  assert.match(intro, /\(1\/5\)/)

  assert.match(await t.say(s, 'dukaan dhar ah'), /\(2\/5\)/)
  assert.match(await t.say(s, 'Magaca Bariis, midab cagaar'), /\(3\/5\)/)
  assert.match(await t.say(s, '3 maalmood gudahood'), /\(4\/5\)/)
  assert.match(await t.say(s, 'Cali Axmed'), /\(5\/5\)/)
  const bad = await t.say(s, 'ma xasuusto')
  assert.match(bad, /lambar sax ah/)
  const confirm = await t.say(s, '0634567890')
  assert.match(confirm, /Adeeg: Logo Design/)
  assert.match(confirm, /Magac: Cali Axmed/)
  assert.match(confirm, /Lambar: 0634567890/)

  const done = await t.say(s, 'haa')
  assert.match(done, /waa la diiwaangeliyay/)
  assert.match(done, /\$24\.5/)
  const order = Object.values(t.store.db.orders)[0]
  assert.equal(order.serviceId, 13)
  assert.equal(order.stage, 'sugaya_lacag')
  assert.equal(t.store.db.sessions[s].flow, null)
  assert.ok(t.notes.some((n) => /Brief cusub/.test(n)))
  assert.ok(t.notes.some((n) => /Dalab cusub/.test(n)))
})

test('Hagaha: su\'aal la weydiiyo dhexdiisa waa la jawaabaa, kadibna su\'aashii dib ayaa loo celiyaa', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'Waxaan rabaa logo')
  const mid = await t.say(s, 'logo waa immisa?')
  assert.match(mid, /\$49/)
  assert.match(mid, /↩️/)
  assert.match(mid, /\(1\/5\)/)
})

test('Hagaha: jooji, beddel adeegga, iyo dalab weyn ($499) oo Farah sugaya', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'Waxaan rabaa logo')
  assert.match(await t.say(s, 'jooji'), /joojinnay/)
  assert.equal(t.store.db.sessions[s].flow, null)

  const s2 = sid()
  await t.say(s2, 'Waxaan rabaa logo')
  assert.match(await t.say(s2, 'beddel adeegga'), /Adeegga kee/)
  const intro = await t.say(s2, 'dukaan online')
  assert.match(intro, /\$499/)
  for (const a of ['dukaan alaab', 'magaca Nuur', 'bil', 'Nuur', '0634567890']) await t.say(s2, a)
  const done = await t.say(s2, 'haa')
  assert.match(done, /xaqiijin Farah/)
  assert.equal(Object.values(t.store.db.orders).at(-1).stage, 'sugaya_farah')
})

test('Hagaha: adeeg aan la helin laba jeer → Farah ayaa u doorta (lead)', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'sidee dalab u sameeyaa')
  await t.say(s, 'wax aan la aqoon')
  const after = await t.say(s, 'wax kale oo aan la aqoon')
  assert.match(after, /Farah ayaa kuu caawin/)
  await t.say(s, 'Cali')
  await t.say(s, '0634567890')
  const done = await t.say(s, 'haa')
  assert.match(done, /Lambarkaaga/)
  assert.match(t.notes.at(-1), /Lead cusub/)
  assert.equal(Object.values(t.store.db.orders).length, 0)
})

test('Hagaha: lambarka la bixiyay bilowga wuu la xasuustaa (su\'aal lambar ah lama weydiiyo)', async () => {
  const t = setup()
  const s = sid()
  await t.say(s, 'Waxaan rabaa CV, lambarkayga waa 0634567890')
  await t.say(s, 'macallin')
  await t.say(s, 'jaamacad')
  const q = await t.say(s, 'toddobaad')
  assert.match(q, /\(4\/5\)/)
  const confirm = await t.say(s, 'Cali')
  assert.match(confirm, /Lambar: 0634567890/)
})

test('Qoraal khaldan: AI-gu wuxuu qabtaa kan ugu dhow', async () => {
  const t = setup()
  assert.match(await t.say(sid(), 'webiste qimo'), /\$299/)
  assert.match(await t.say(sid(), 'maxad bixin karta'), /30 adeeg/)
  assert.match(await t.say(sid(), 'kafe system qimo'), /\$100 \+ \$25\/bil/)
  assert.match(await t.say(sid(), 'imisa yahay wordpres'), /\$299/)
  const guess = await t.say(sid(), 'ma sameysaan aap dhab ah')
  assert.match(guess, /Waxaan u malaynayaa inaad ula jeedo/)
  assert.match(guess, /Design & Prototype/)
  assert.deepEqual(t.notes, [])
})

test('Fahamka mashruuca: su\'aalaha gaarka ah ee adeeg kasta (services-detail.json)', async () => {
  const t = setup()
  assert.match(await t.say(sid(), 'Haddaan jeclaan waayo design-ka logo?'), /qanacsantahay/)
  assert.match(await t.say(sid(), 'logo waa maxay'), /Summad xirfadleh/)
})

test('Bot-ka Telegram ee dadka: wada-hadal, hagaha dalabka, iyo fariimaha Farah oo loo sii dirayo', async () => {
  const { createTelegramBridge, telegramSessionId } = await import('../src/tgpublic.js')
  const t = setup()
  const sent = []
  const bridge = createTelegramBridge({ store: t.store, orchestrator: t.app.orchestrator, bot: { send: async (text, chat) => sent.push([chat, text]) } })
  const from = { from: { first_name: 'Cali' } }

  assert.match(await bridge.handle('/start', 555, from), /caawiyaha AI/)
  assert.match(await bridge.handle('/dalab', 555, from), /Adeegga kee ayaad rabtaa/)
  assert.match(await bridge.handle('logo', 555, from), /\(1\/5\)/)
  assert.match(await bridge.handle('Qiimaha CV?', 777, from), /\$25/)
  assert.equal(t.store.db.sessions[telegramSessionId(555)].name, 'Cali')

  await t.owner('/reply #' + (t.store.pendingApprovals()[0]?.id ?? 1) + ' hello')
  t.store.queueOutbox(telegramSessionId(555), 'Farah: waan ku soo laabanay')
  await bridge.flushOutbox()
  assert.deepEqual(sent, [[555, 'Farah: waan ku soo laabanay']])
  await bridge.flushOutbox()
  assert.equal(sent.length, 1)
})

test('Bot-yada xafiisyada: salaan gaar ah oo persona ah, iyo outbox oo aan isku dhex-galin bot-yada kala duwan', async () => {
  const { createTelegramBridge, telegramSessionId } = await import('../src/tgpublic.js')
  const { personaWelcome } = await import('../src/personas.js')
  const t = setup()
  const from = { from: { first_name: 'Sahra' } }

  const salesSent = []
  const salesBridge = createTelegramBridge({
    store: t.store,
    orchestrator: t.app.orchestrator,
    bot: { send: async (text, chat) => salesSent.push([chat, text]) },
    welcome: personaWelcome('sales'),
    office: 'sales',
  })
  const supportSent = []
  const supportBridge = createTelegramBridge({
    store: t.store,
    orchestrator: t.app.orchestrator,
    bot: { send: async (text, chat) => supportSent.push([chat, text]) },
    welcome: personaWelcome('taageero'),
    office: 'taageero',
  })

  assert.match(await salesBridge.handle('/start', 900, from), /Cabdiraxmaan/)
  assert.match(await supportBridge.handle('/start', 900, from), /Sagal/)

  // Isla macaamiilka (chatId 900) — bot-kii ugu dambeeyay uu la hadlay (taageero) ayaa haysta xiriirka.
  t.store.queueOutbox(telegramSessionId(900), 'Farah: fariin cusub')
  await salesBridge.flushOutbox()
  assert.deepEqual(salesSent, [])
  await supportBridge.flushOutbox()
  assert.deepEqual(supportSent, [[900, 'Farah: fariin cusub']])
})

test('Bot-ka group-yada: FAQ toos ah, dalab → DM redirect, salaan marka la ku daro, aamusnaan haddii aan la weyddiinin', async () => {
  const { createGroupBridge } = await import('../src/tgpublic.js')
  const t = setup()
  const bridge = createGroupBridge({ store: t.store, knowledge: t.app.knowledge })
  const groupMsg = (extra = {}) => ({ chat: { id: -100123, type: 'supergroup', title: 'FCS Fan Group' }, ...extra })

  // Bot-ka oo group loo daray
  const welcome = await bridge.handle('', -100123, groupMsg({ new_chat_members: [{ username: 'FCSHelperBot' }] }), { botUsername: 'FCSHelperBot' })
  assert.match(welcome, /caawiyaha AI/)
  assert.equal(t.store.db.groups['-100123'].title, 'FCS Fan Group')

  // Su'aal aan la weyddiinin, aan is-u-jeedin bot-ka -> aamusnaan
  assert.equal(await bridge.handle('subax wanaagsan dhammaan', -100123, groupMsg(), { botUsername: 'FCSHelperBot' }), '')

  // Loo jeediyay (@mention) -> FAQ toos ah + mahadnaq
  const priceReply = await bridge.handle('@FCSHelperBot logo waa immisa?', -100123, groupMsg(), { botUsername: 'FCSHelperBot' })
  assert.match(priceReply, /\$49/)
  assert.match(priceReply, /Mahadsanid/)

  // Dalab group-ka gudihiisa -> DM loo celiyaa, magac/lambar lagama weyddiinin
  const orderReply = await bridge.handle('waan rabaa in aan logo dalbado', -100123, groupMsg(), { botUsername: 'FCSHelperBot' })
  assert.match(orderReply, /fariin gaar ah \(DM\)/)
  assert.doesNotMatch(orderReply, /magacaaga/)

  // Su'aal aan la aqoon, loo jeediyay -> fallback (Farah)
  const unknown = await bridge.handle('@FCSHelperBot ma taageertaan sistem-ka bangiga?', -100123, groupMsg(), { botUsername: 'FCSHelperBot' })
  assert.match(unknown, /Farah/)
})

test('Owner: /groups iyo /announce', async () => {
  const sent = []
  const cfg = {
    ...loadConfig({}),
    dataDir: mkdtempSync(path.join(tmpdir(), 'fcs-kn-')),
    llm: { provider: 'none', apiKey: '', model: '', baseUrl: '', dailyLimit: 100, timeoutMs: 1000 },
  }
  const app = createApp(cfg, { notify: () => {}, sendGroup: async (id, text) => sent.push([id, text]) })
  const owner = async (text) => {
    const r = await app.orchestrator.handleOwner(text)
    await flush()
    return r
  }
  app.store.db.groups['-100999'] = { id: '-100999', title: 'Suuqa Boorama', addedAt: Date.now(), lastSeenAt: Date.now() }

  assert.match(await owner('/groups'), /Suuqa Boorama/)
  assert.match(await owner('/announce'), /Isticmaal/)

  const reply = await owner('/announce -100999 Cusbooneysiin: adeeg cusub ayaan bixineynaa!')
  assert.match(reply, /✅ Ogeysiiska/)
  assert.deepEqual(sent, [['-100999', 'Cusbooneysiin: adeeg cusub ayaan bixineynaa!']])

  assert.match(await owner('/announce -1 hello'), /lama helin/)
})
