import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, ArrowLeft } from 'lucide-react'
import { avatar, team, teamByOffice } from '../data/team'

const API = (import.meta.env.VITE_AGENT_API as string | undefined) || (import.meta.env.DEV ? 'http://localhost:8787' : '')
const SESSION_KEY = 'fcs_chat_session'
const CURSOR_KEY = 'fcs_chat_cursor'
const MESSAGES_KEY = 'fcs_chat_messages'
const PERSONA_KEY = 'fcs_chat_persona'
const RECENT_Q_KEY = 'fcs_recent_questions'
const SIGNED_IN_KEY = 'fcs_chat_signed_in'

type Msg = { from: 'me' | 'bot'; text: string; ts?: number }
type RecentQ = { text: string; ts: number }

const fmtTime = (ts?: number) => (ts ? new Date(ts).toLocaleTimeString('so', { hour: '2-digit', minute: '2-digit' }) : '')

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage can be unavailable in private mode */
  }
}

function sessionId(): string {
  const existing = read<string | null>(SESSION_KEY, null)
  if (existing) return existing
  const id = crypto.randomUUID().replace(/-/g, '')
  write(SESSION_KEY, id)
  return id
}

const URL_RE = /(https?:\/\/[^\s)]+)/g
function renderText(text: string) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: '#A78BFA', textDecoration: 'underline' }}>
        {part}
      </a>
    ) : (
      part
    ),
  )
}

const defaultGreeting = (name?: string, role?: string): Msg => ({
  from: 'bot',
  text: name ? `Asc! Waxaan ahay ${name}, ${role}. Maxaan kuu qaban karaa?` : 'Asc! Waxaan ahay caawiyaha AI ee FCS Technology. Maxaad rabtaa?',
  ts: Date.now(),
})

// Bog buuxa oo kale (isla qaabka ChatGPT) — isla session/messages/persona ee ChatWidget-ka (localStorage isku mid
// ah), sidaas darteed wada-hadalku waa isku mid meel kastoo laga bilaabo. Sidebar-ku wuxuu tusayaa 10-da xafiis.
export default function Chat() {
  const { office } = useParams<{ office?: string }>()
  const navigate = useNavigate()
  const idRef = useRef(sessionId())
  const activeOffice = office && teamByOffice(office) ? office : read<string | null>(PERSONA_KEY + '_office', null)
  const activeMember = activeOffice ? teamByOffice(activeOffice) : undefined

  const [messages, setMessages] = useState<Msg[]>(() => read<Msg[]>(MESSAGES_KEY, [defaultGreeting()]))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [signedIn] = useState(() => read<boolean>(SIGNED_IN_KEY, false))
  const [recentQuestions] = useState<RecentQ[]>(() => read<RecentQ[]>(RECENT_Q_KEY, []))
  const cursorRef = useRef<number>(read<number>(CURSOR_KEY, 0))
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${activeMember ? activeMember.name : 'Chat'} — FCS Technology`
  }, [activeMember])

  // Marka la beddelo xafiiska (sidebar-ka), haddii wada-hadalku weli yahay bilowga (greeting kaliya), salaan
  // gaar ah bixi — si aan macaamiilka lagu qasbin inuu isaga qoro cid uu la hadlayo.
  useEffect(() => {
    if (!activeMember) return
    write(PERSONA_KEY + '_office', activeMember.office)
    setMessages((m) => {
      if (m.length !== 1 || m[0].from !== 'bot') return m
      return [defaultGreeting(activeMember.name, activeMember.role)]
    })
  }, [activeMember?.office])

  useEffect(() => {
    write(MESSAGES_KEY, messages.slice(-40))
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  useEffect(() => {
    if (!API) return
    let stopped = false
    const poll = async () => {
      try {
        const res = await fetch(`${API}/api/messages?sessionId=${idRef.current}&after=${cursorRef.current}`)
        if (!res.ok) return
        const data: { messages: { id: number; text: string }[] } = await res.json()
        if (stopped || !data.messages.length) return
        cursorRef.current = data.messages[data.messages.length - 1].id
        write(CURSOR_KEY, cursorRef.current)
        setMessages((m) => [...m, ...data.messages.map((x) => ({ from: 'bot' as const, text: x.text, ts: Date.now() }))])
      } catch {
        /* server offline: try again on the next tick */
      }
    }
    poll()
    const t = setInterval(poll, 8000)
    return () => {
      stopped = true
      clearInterval(t)
    }
  }, [])

  if (!API) return null

  const sendText = async (text: string) => {
    if (!text.trim() || busy) return
    setMessages((m) => [...m, { from: 'me', text, ts: Date.now() }])
    setBusy(true)
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: idRef.current, message: text }),
      })
      const data: { reply?: string } = await res.json().catch(() => ({}))
      if (!data.reply) throw new Error('empty')
      setMessages((m) => [...m, { from: 'bot', text: data.reply as string, ts: Date.now() }])
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Hadda ma kuu jawaabi karo. Fadlan nagala soo xiriir WhatsApp: +252 63 713 3499.', ts: Date.now() }])
    } finally {
      setBusy(false)
    }
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    sendText(text)
  }

  const showWelcome = messages.length <= 1

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 72, display: 'flex' }}>
      {/* Sidebar — liiska 10-da xafiis */}
      <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid rgba(148,163,184,0.12)', padding: 16, overflowY: 'auto', height: 'calc(100vh - 72px)', position: 'sticky', top: 72 }} className="fcs-chat-sidebar">
        <button
          onClick={() => navigate('/team')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#94A3B8', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginBottom: 16 }}
        >
          <ArrowLeft size={14} /> Shaqaalaha
        </button>
        {team.map((m) => (
          <button
            key={m.office}
            onClick={() => navigate(`/chat/${m.office}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              background: activeMember?.office === m.office ? 'rgba(124,58,237,0.15)' : 'transparent',
              border: 'none',
              borderRadius: 10,
              padding: '9px 10px',
              cursor: 'pointer',
              marginBottom: 2,
              textAlign: 'left',
            }}
          >
            <img src={avatar(m.name)} alt={m.name} style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: activeMember?.office === m.office ? '#F1F5F9' : '#CBD5E1', fontSize: 13, fontWeight: 700 }}>{m.name}</div>
              <div style={{ color: '#64748B', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.role}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(148,163,184,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {activeMember ? (
            <>
              <img src={avatar(activeMember.name)} alt={activeMember.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div>
                <div style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15 }}>{activeMember.name}</div>
                <div style={{ color: '#94A3B8', fontSize: 12 }}>{activeMember.role}</div>
              </div>
            </>
          ) : (
            <div style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15 }}>FCS Technology — Caawiyaha AI</div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          {showWelcome ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              {activeMember && <img src={avatar(activeMember.name)} alt={activeMember.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 16 }} />}
              <h1 style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
                {activeMember ? `Maxaad ${activeMember.name} weydiin lahayd?` : 'Maxaad rabtaa inaan kuu caawiyo?'}
              </h1>
              {signedIn && recentQuestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480 }}>
                  <div style={{ color: '#64748B', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>SU'AALAHAAGII UGU DAMBEEYAY</div>
                  {recentQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendText(q.text)}
                      style={{
                        textAlign: 'left',
                        background: 'rgba(30,41,59,0.6)',
                        border: '1px solid rgba(148,163,184,0.15)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        color: '#CBD5E1',
                        fontSize: 13.5,
                        cursor: 'pointer',
                      }}
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '70%', alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
                <div
                  style={{
                    padding: '11px 16px',
                    borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.from === 'me' ? '#7C3AED' : 'rgba(30,41,59,0.9)',
                    color: '#F1F5F9',
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {renderText(m.text)}
                </div>
                {m.ts && <span style={{ fontSize: 10, color: '#64748B', marginTop: 3, padding: '0 4px' }}>{fmtTime(m.ts)}</span>}
              </div>
            ))
          )}
          {busy && <div style={{ color: '#64748B', fontSize: 13 }}>Waa qorayaa…</div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '16px 24px', borderTop: '1px solid rgba(148,163,184,0.12)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeMember ? `Weydii ${activeMember.name}...` : 'Qor fariintaada…'}
            maxLength={1500}
            style={{
              flex: 1,
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 100,
              padding: '13px 18px',
              color: '#F1F5F9',
              fontSize: 14.5,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Dir"
            style={{
              background: '#7C3AED',
              border: 'none',
              borderRadius: '50%',
              width: 46,
              height: 46,
              color: 'white',
              cursor: busy ? 'default' : 'pointer',
              opacity: busy || !input.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .fcs-chat-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
