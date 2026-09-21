import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function loadDotEnv(file = path.join(ROOT, '.env')) {
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.trim().startsWith('#')) continue
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m) continue
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2')
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}

// "maskax:123:abc,intake:456:def" -> { maskax: '123:abc', intake: '456:def' } (bot token-yadu qudhoodu waxay leeyihiin ':')
function parseOfficeBots(value) {
  const map = {}
  for (const part of String(value || '').split(',')) {
    const i = part.indexOf(':')
    if (i < 0) continue
    const office = part.slice(0, i).trim()
    const token = part.slice(i + 1).trim()
    if (office && token) map[office] = token
  }
  return map
}

export function loadConfig(env = process.env) {
  const num = (key, fallback) => (env[key] ? Number(env[key]) : fallback)
  return {
    port: num('PORT', 8787),
    dataDir: env.DATA_DIR || path.join(ROOT, 'data'),
    brainFile: env.BRAIN_FILE || path.join(ROOT, '..', 'FCS-AI-Company.md'),
    seedFile: env.SEED_FILE || path.join(ROOT, '..', 'knowledge', 'seed-qa.json'),
    detailFile: env.DETAIL_FILE || path.join(ROOT, '..', 'knowledge', 'services-detail.json'),
    linksFile: env.LINKS_FILE || path.join(ROOT, '..', 'knowledge', 'service-links.json'),
    siteUrl: env.SITE_URL || 'https://fcs-tignoolaji.surge.sh',
    paymentDetails: env.PAYMENT_DETAILS || '',
    adminSyncToken: env.ADMIN_SYNC_TOKEN || '',
    googleClientId: env.GOOGLE_CLIENT_ID || '',
    facebookAppId: env.FACEBOOK_APP_ID || '',
    facebookAppSecret: env.FACEBOOK_APP_SECRET || '',
    resendApiKey: env.RESEND_API_KEY || '',
    emailFrom: env.EMAIL_FROM || '',
    allowedOrigins: (env.ALLOWED_ORIGINS || 'http://localhost:8443,http://localhost:5173,https://fcs-tignoolaji.surge.sh')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    llm: {
      provider: env.LLM_PROVIDER || (env.LLM_API_KEY ? 'gemini' : 'none'),
      apiKey: env.LLM_API_KEY || '',
      model: env.LLM_MODEL || '',
      baseUrl: env.LLM_BASE_URL || '',
      dailyLimit: num('LLM_DAILY_LIMIT', 400),
      timeoutMs: num('LLM_TIMEOUT_MS', 30000),
    },
    telegram: {
      token: env.TELEGRAM_BOT_TOKEN || '',
      ideasToken: env.IDEAS_BOT_TOKEN || '',
      publicToken: env.PUBLIC_BOT_TOKEN || '',
      ownerChatId: env.OWNER_CHAT_ID || '',
      officeBots: parseOfficeBots(env.TELEGRAM_OFFICE_BOTS),
    },
    reportHour: num('REPORT_HOUR', 8),
    tzOffsetHours: num('TZ_OFFSET_HOURS', 3),
    rate: { max: num('RATE_MAX', 20), windowMs: num('RATE_WINDOW_MS', 10 * 60 * 1000) },
  }
}

export function writeEnv(updates, file = path.join(ROOT, '.env')) {
  const lines = existsSync(file) ? readFileSync(file, 'utf8').split(/\r?\n/) : []
  while (lines.length && lines[lines.length - 1] === '') lines.pop()
  const remaining = { ...updates }
  const out = lines.map((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=/)
    if (m && m[1] in remaining) {
      const v = remaining[m[1]]
      delete remaining[m[1]]
      return `${m[1]}=${v}`
    }
    return line
  })
  for (const [k, v] of Object.entries(remaining)) out.push(`${k}=${v}`)
  writeFileSync(file, out.join('\n').replace(/\n*$/, '\n'))
}
