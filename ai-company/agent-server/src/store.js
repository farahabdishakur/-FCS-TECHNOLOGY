import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync, appendFileSync } from 'node:fs'
import path from 'node:path'

const emptyDb = () => ({
  sessions: {},
  orders: {},
  approvals: {},
  outbox: {},
  groups: {},
  meta: { seq: {}, paused: false, llm: {}, lastReportDay: '', lastPostsWeek: '' },
})

export function createStore(dir) {
  mkdirSync(dir, { recursive: true })
  const file = path.join(dir, 'db.json')
  const logFile = path.join(dir, 'log.jsonl')

  let db = emptyDb()
  if (existsSync(file)) {
    try {
      db = { ...emptyDb(), ...JSON.parse(readFileSync(file, 'utf8')) }
    } catch {
      renameSync(file, path.join(dir, `db.corrupt-${Date.now()}.json`))
    }
  }

  let timer = null
  const flush = () => {
    clearTimeout(timer)
    timer = null
    const tmp = file + '.tmp'
    writeFileSync(tmp, JSON.stringify(db))
    renameSync(tmp, file)
  }
  const save = () => {
    if (timer) return
    timer = setTimeout(flush, 300)
    timer.unref?.()
  }

  const nextId = (kind) => {
    db.meta.seq[kind] = (db.meta.seq[kind] || 0) + 1
    return db.meta.seq[kind]
  }

  const log = (type, data = {}) => {
    try {
      appendFileSync(logFile, JSON.stringify({ ts: new Date().toISOString(), type, ...data }) + '\n')
    } catch (e) {
      console.error('log failed:', e.message)
    }
  }

  const getSession = (id) => {
    let s = db.sessions[id]
    if (!s) {
      s = db.sessions[id] = {
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lang: 'so',
        name: '',
        phone: '',
        stage: 'cusub',
        brief: {},
        history: [],
        orderId: null,
        strikes: 0,
        followups: {},
        awaitingPaymentRef: false,
      }
      save()
    }
    return s
  }

  const pushHistory = (session, role, text) => {
    session.history.push({ role, text, ts: Date.now() })
    if (session.history.length > 30) session.history.splice(0, session.history.length - 30)
    session.updatedAt = Date.now()
    save()
  }

  const addApproval = ({ type, level = 2, sessionId = null, orderId = null, summary = '', data = {} }) => {
    const id = nextId('approval')
    db.approvals[id] = { id, type, level, status: 'pending', sessionId, orderId, summary, data, createdAt: Date.now() }
    save()
    return db.approvals[id]
  }

  const resolveApproval = (id, status) => {
    const a = db.approvals[id]
    if (!a || a.status !== 'pending') return null
    a.status = status
    a.resolvedAt = Date.now()
    save()
    return a
  }

  const queueOutbox = (sessionId, text) => {
    const id = nextId('outbox')
    const list = (db.outbox[sessionId] ||= [])
    list.push({ id, text, ts: Date.now() })
    if (list.length > 50) list.splice(0, list.length - 50)
    save()
    return id
  }

  const readOutbox = (sessionId, after = 0) => (db.outbox[sessionId] || []).filter((m) => m.id > after)

  const createOrder = (fields) => {
    const id = nextId('order')
    db.orders[id] = { id, createdAt: Date.now(), depositPaid: false, finalPaid: false, ...fields }
    save()
    return db.orders[id]
  }

  const pendingApprovals = () => Object.values(db.approvals).filter((a) => a.status === 'pending')

  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
  const toCsv = () => {
    const head = ['id', 'magac', 'tel', 'luuqad', 'adeeg', 'xaalad', 'qiimo', '50%_horay', '50%_dhammaad', 'deadline', 'qoraal_AI', 'u_gudbi_Farah']
    const pending = new Set(pendingApprovals().map((a) => a.sessionId))
    const rows = Object.values(db.sessions).map((s) => {
      const o = s.orderId ? db.orders[s.orderId] : null
      const lastAi = [...s.history].reverse().find((m) => m.role === 'assistant')?.text || ''
      return [
        s.id.slice(0, 8),
        s.name,
        s.phone,
        s.lang,
        o?.serviceName || s.brief.service || '',
        o?.stage || s.stage,
        o?.price ?? '',
        o ? (o.depositPaid ? 'haa' : 'maya') : '',
        o ? (o.finalPaid ? 'haa' : 'maya') : '',
        s.brief.deadline || '',
        lastAi.slice(0, 200),
        pending.has(s.id) ? 'haa' : '',
      ]
        .map(csvCell)
        .join(',')
    })
    return [head.join(','), ...rows].join('\n')
  }

  return {
    get db() {
      return db
    },
    save,
    flush,
    log,
    nextId,
    getSession,
    pushHistory,
    addApproval,
    resolveApproval,
    queueOutbox,
    readOutbox,
    createOrder,
    pendingApprovals,
    toCsv,
  }
}
