import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync, appendFileSync } from 'node:fs'
import path from 'node:path'

const emptyDb = () => ({
  sessions: {},
  orders: {},
  approvals: {},
  outbox: {},
  groups: {},
  users: {},
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

  // Index (email -> userId) oo memory ku jira — si raadinta email-ka aanay noqonin "Table Scan" (Object.values().find())
  // marka macaamiisha ay kordhaan; waa la dhisaa mar kaliya markii la load-gareynayo, lagumana kaydiyo faylka (waa la soo saari karaa).
  const emailIndex = new Map(Object.values(db.users).map((u) => [u.email, u.id]))

  const findUserByEmail = (email) => {
    const id = emailIndex.get(email)
    const u = id != null ? db.users[id] || null : null
    return u && !u.deletedAt ? u : null
  }

  const listUsers = () => Object.values(db.users).sort((a, b) => b.createdAt - a.createdAt)

  // Tirtir "nabdoon" (soft-delete): user-ka wuu joogaa xogta, laakiin ma soo geli karo mar dambe ilaa la soo celiyo.
  const deleteUser = (id) => {
    const u = db.users[id]
    if (!u || u.deletedAt) return null
    u.deletedAt = Date.now()
    save()
    return u
  }

  const restoreUser = (id) => {
    const u = db.users[id]
    if (!u || !u.deletedAt) return null
    u.deletedAt = null
    save()
    return u
  }

  const createUser = ({ name, email, passwordHash = null, provider = 'password', emailVerified = provider !== 'password' }) => {
    const id = nextId('user')
    db.users[id] = {
      id,
      name,
      email,
      passwordHash,
      provider,
      createdAt: Date.now(),
      deletedAt: null,
      emailVerified,
      verifyCode: null,
      verifyCodeExpires: 0,
      verifyAttempts: 0,
    }
    emailIndex.set(email, id)
    save()
    return db.users[id]
  }

  // Koodhka xaqiijinta (4 xaraf, 15 daqiiqo, ugu badnaan 5 isku day) — password-based accounts kaliya
  // (Google/Facebook waxay la yimaadaan email horeba la xaqiijiyay, sidaas darteed uma baahna).
  const setVerifyCode = (id, code) => {
    const u = db.users[id]
    if (!u) return null
    u.verifyCode = code
    u.verifyCodeExpires = Date.now() + 15 * 60 * 1000
    u.verifyAttempts = 0
    save()
    return u
  }

  const VERIFY_RESULT = { ok: 'ok', wrong: 'wrong', expired: 'expired', locked: 'locked' }
  const checkVerifyCode = (id, code) => {
    const u = db.users[id]
    if (!u || !u.verifyCode) return VERIFY_RESULT.expired
    if (u.verifyAttempts >= 5) return VERIFY_RESULT.locked
    if (Date.now() > u.verifyCodeExpires) return VERIFY_RESULT.expired
    if (String(code) !== u.verifyCode) {
      u.verifyAttempts++
      save()
      return VERIFY_RESULT.wrong
    }
    u.emailVerified = true
    u.verifyCode = null
    u.verifyAttempts = 0
    save()
    return VERIFY_RESULT.ok
  }

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
    findUserByEmail,
    createUser,
    listUsers,
    deleteUser,
    restoreUser,
    setVerifyCode,
    checkVerifyCode,
    VERIFY_RESULT,
  }
}
