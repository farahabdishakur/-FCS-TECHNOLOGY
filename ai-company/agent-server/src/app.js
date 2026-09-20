import http from 'node:http'
import { readFileSync, writeFileSync } from 'node:fs'
import { createStore } from './store.js'
import { loadBrain } from './brain.js'
import { createLLM } from './llm.js'
import { createAgents } from './agents.js'
import { createKnowledge } from './knowledge.js'
import { createIdeas } from './ideas.js'
import { createOrchestrator } from './orchestrator.js'
import { createRateLimiter } from './guard.js'
import { buildKnowledgeData, applyRowsToBrainText } from './servicesSync.js'

const SESSION_ID = /^[A-Za-z0-9_-]{16,64}$/

export function createApp(cfg, { notify = (t) => console.log('[notify]', t), sendGroup = async () => { throw new Error('bot-ka group-yada lama dejin') }, fetchImpl, retryDelayMs } = {}) {
  const store = createStore(cfg.dataDir)
  const brain = loadBrain(cfg.brainFile, { paymentDetails: cfg.paymentDetails })
  const llm = createLLM(cfg.llm, { store, fetchImpl, retryDelayMs })
  const agents = createAgents({ brain, llm })
  const knowledge = createKnowledge({ brain, store, dataDir: cfg.dataDir, seedFile: cfg.seedFile, linksFile: cfg.linksFile, detailFile: cfg.detailFile, siteUrl: cfg.siteUrl, paymentDetails: cfg.paymentDetails })
  const orchestrator = createOrchestrator({ store, brain, agents, llm, knowledge, notify, sendGroup, cfg })
  const ideas = createIdeas({ store, brain, knowledge, llm })
  const limiter = createRateLimiter(cfg.rate)

  // services.ts/Admin -> AI: jadwalka qiimaha (brain.catalog) iyo aqoonta (knowledge) dib ayaa loo soo raraa iyada oo server-ku aan dib u bilaabmin.
  function reloadBrain() {
    Object.assign(brain, loadBrain(cfg.brainFile, { paymentDetails: cfg.paymentDetails }))
    knowledge.reload()
  }

  const cors = (req, res) => {
    const origin = req.headers.origin
    if (origin && cfg.allowedOrigins.includes(origin)) {
      res.setHeader('access-control-allow-origin', origin)
      res.setHeader('vary', 'origin')
    }
    res.setHeader('access-control-allow-methods', 'GET,POST,OPTIONS')
    res.setHeader('access-control-allow-headers', 'content-type')
  }

  const json = (res, status, body) => {
    res.statusCode = status
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(body))
  }

  const readBody = (req, maxBytes = 8 * 1024) =>
    new Promise((resolve, reject) => {
      let size = 0
      const chunks = []
      req.on('data', (c) => {
        size += c.length
        if (size > maxBytes) {
          reject(Object.assign(new Error('too large'), { status: 413 }))
          req.destroy()
          return
        }
        chunks.push(c)
      })
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      req.on('error', reject)
    })

  const server = http.createServer(async (req, res) => {
    cors(req, res)
    if (req.method === 'OPTIONS') return json(res, 204, {})
    const url = new URL(req.url, 'http://localhost')
    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        return json(res, 200, { ok: true, paused: store.db.meta.paused, llm: llm.provider, llmReady: llm.available() })
      }

      if (req.method === 'POST' && url.pathname === '/api/chat') {
        let body
        try {
          body = JSON.parse(await readBody(req))
        } catch (e) {
          return json(res, e.status || 400, { error: 'bad request' })
        }
        const { sessionId, message, name, phone } = body || {}
        if (!SESSION_ID.test(sessionId || '') || typeof message !== 'string' || !message.trim()) {
          return json(res, 400, { error: 'bad request' })
        }
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress
        if (!limiter.allow(`${ip}|${sessionId}`)) {
          return json(res, 429, { error: 'too many messages', reply: 'Fadlan yara sug, fariimo aad u badan ayaad dirtay.' })
        }
        const { reply } = await orchestrator.handleCustomer({ sessionId, text: message, name, phone })
        return json(res, 200, { reply })
      }

      if (req.method === 'GET' && url.pathname === '/api/messages') {
        const sessionId = url.searchParams.get('sessionId') || ''
        if (!SESSION_ID.test(sessionId)) return json(res, 400, { error: 'bad request' })
        const after = Number(url.searchParams.get('after')) || 0
        return json(res, 200, { messages: store.readOutbox(sessionId, after) })
      }

      // Admin dashboard (website) -> AI: cusboonaysii jadwalka qiimaha + FAQ-yada iyada oo aan server-ka dib loo bilaabin.
      if (req.method === 'POST' && url.pathname === '/api/admin/sync-services') {
        if (cfg.adminSyncToken && req.headers['x-admin-token'] !== cfg.adminSyncToken) {
          return json(res, 401, { error: 'unauthorized' })
        }
        let body
        try {
          body = JSON.parse(await readBody(req, 1024 * 1024))
        } catch (e) {
          return json(res, e.status || 400, { error: 'bad request' })
        }
        if (!Array.isArray(body?.services) || !body.services.length) {
          return json(res, 400, { error: 'services (array) waa loo baahan yahay' })
        }
        const { links, detail, rows, dropped } = buildKnowledgeData(body.services)
        writeFileSync(cfg.linksFile, JSON.stringify(links, null, 2))
        writeFileSync(cfg.detailFile, JSON.stringify(detail, null, 2))
        const before = readFileSync(cfg.brainFile, 'utf8')
        const { text: after, changed } = applyRowsToBrainText(before, rows)
        if (after !== before) writeFileSync(cfg.brainFile, after)
        reloadBrain()
        store.log('admin_sync', { services: body.services.length, priceRowsUpdated: changed, dropped })
        return json(res, 200, { ok: true, services: body.services.length, priceRowsUpdated: changed, dropped })
      }

      return json(res, 404, { error: 'not found' })
    } catch (e) {
      store.log('http_error', { message: e.message })
      return json(res, 500, { error: 'server error' })
    }
  })

  return { server, store, brain, llm, knowledge, ideas, orchestrator }
}
