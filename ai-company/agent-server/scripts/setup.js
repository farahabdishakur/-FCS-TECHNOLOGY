// Habeyn fudud: wuxuu weydiiyaa furayaasha oo ku qoraa .env (adiga ayaa geliya, anigu ma arko).
//   npm run setup
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { ROOT, writeEnv } from '../src/config.js'
import { detectChatId } from '../src/telegram.js'

const envFile = path.join(ROOT, '.env')
if (!existsSync(envFile)) copyFileSync(path.join(ROOT, '.env.example'), envFile)

const rl = readline.createInterface({ input, output })
const ask = async (text) => (await rl.question(`\n${text}\n> `)).trim()
const mask = (v) => (v ? v.slice(0, 4) + '…' + v.slice(-3) : '(madhan)')

console.log('FCS AI — habeyn. Meel kasta Enter ku riix si aad ugu gudubto.')

const staff = await ask('1) Telegram bot-ka SHAQAALAHA (kii aad @BotFather ka samaysay): dhig token-ka')
const ideas = await ask('2) Telegram bot-ka FIKRADAHA (bot labaad): dhig token-ka')
const publicTok = await ask('3) Telegram bot-ka DADKA/macaamiisha (bot saddexaad oo @BotFather ka samee): dhig token-ka')
const gemini = await ask('4) Gemini API key (ikhtiyaari; AI-gu key la\'aan wuu shaqeeyaa): dhig key-ga')
const payment = await ask('5) Lambarka lacag-bixinta ee macaamiilka loo sheegayo (tusaale: EVC Plus: 06xxxxxxx (Farah Abdishakur))')

const updates = {}
if (staff) updates.TELEGRAM_BOT_TOKEN = staff
if (ideas) updates.IDEAS_BOT_TOKEN = ideas
if (publicTok) updates.PUBLIC_BOT_TOKEN = publicTok
if (gemini) Object.assign(updates, { LLM_PROVIDER: 'gemini', LLM_API_KEY: gemini })
if (payment) updates.PAYMENT_DETAILS = payment

if (staff || ideas) {
  await ask('Hadda Telegram-ka fur bot-ka SHAQAALAHA, u qor /start, kadibna halkan Enter ku riix')
  try {
    const id = await detectChatId(staff || ideas)
    if (id) {
      updates.OWNER_CHAT_ID = id
      console.log('✅ Chat id-gaaga waa la helay.')
    } else {
      console.log('⚠️ Chat id lama helin. Hubi inaad bot-ka /start u qortay, kadibna mar kale orod: npm run setup')
    }
  } catch (e) {
    console.log('⚠️ Telegram wuu diiday token-ka: ' + e.message)
  }
}

writeEnv(updates)
rl.close()

console.log('\nWaa la kaydiyay (.env):')
for (const [k, v] of Object.entries(updates)) console.log(`  ${k} = ${k === 'PAYMENT_DETAILS' || k === 'OWNER_CHAT_ID' || k === 'LLM_PROVIDER' ? v : mask(v)}`)
console.log('\nKadib: server-ka dib u bilow (start-ai.cmd).')
