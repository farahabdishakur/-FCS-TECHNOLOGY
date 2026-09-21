import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import AuthPanel from './AuthPanel'

const API = (import.meta.env.VITE_AGENT_API as string | undefined) || (import.meta.env.DEV ? 'http://localhost:8787' : '')
const WHATSAPP = 'https://wa.me/252637133499'
// Isla qoraalka "name" step-ka ee guided.js (QUESTIONS.name) — kaliya markaas ayaan weydiinaynaa xaqiijinta (AuthPanel).
const ASKING_NAME_RE = /Magacaaga\?|Your name\?/
const SIGNED_IN_KEY = 'fcs_chat_signed_in'

const SESSION_KEY = 'fcs_chat_session'
const CURSOR_KEY = 'fcs_chat_cursor'
const MESSAGES_KEY = 'fcs_chat_messages'
const PERSONA_KEY = 'fcs_chat_persona'

type Msg = { from: 'me' | 'bot'; text: string; ts?: number }
type Persona = { name: string; role: string; avatar: string }

const fmtTime = (ts?: number) => (ts ? new Date(ts).toLocaleTimeString('so', { hour: '2-digit', minute: '2-digit' }) : '')

// Wallpaper-ka gudaha chat-ka — dood-farshaxan khafiif ah oo u eg app fariimeed (dark mode), ma aha copy-ga WhatsApp ee dhabta ah.
const CHAT_WALLPAPER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cg fill='none' stroke='%237C3AED' stroke-width='1.1' opacity='0.16'%3E%3Cpath d='M14 16h20a5 5 0 015 5v8a5 5 0 01-5 5H26l-7 6v-6h-5a5 5 0 01-5-5v-8a5 5 0 015-5z'/%3E%3Ccircle cx='72' cy='14' r='3'/%3E%3Cpath d='M58 55h18a4 4 0 014 4v6a4 4 0 01-4 4h-8l-5 4v-4h-5a4 4 0 01-4-4v-6a4 4 0 014-4z'/%3E%3Ccircle cx='18' cy='78' r='2.4'/%3E%3Ccircle cx='90' cy='70' r='2'/%3E%3Ccircle cx='45' cy='90' r='2.4'/%3E%3C/g%3E%3C/svg%3E\")"

const greeting: Msg = {
  from: 'bot',
  text: 'Asc! Waxaan ahay caawiyaha AI ee FCS Technology. Waxaan kaa caawin karaa adeegyada, qiimaha iyo dalabka. Maxaad rabtaa?',
  ts: Date.now(),
}

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

function sessionId(): string {
  const existing = read<string | null>(SESSION_KEY, null)
  if (existing) return existing
  const id = crypto.randomUUID().replace(/-/g, '')
  write(SESSION_KEY, id)
  return id
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>(() => read<Msg[]>(MESSAGES_KEY, [greeting]))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [persona, setPersona] = useState<Persona | null>(() => read<Persona | null>(PERSONA_KEY, null))
  const [signedIn, setSignedIn] = useState(() => read<boolean>(SIGNED_IN_KEY, false))
  const [showAuth, setShowAuth] = useState(false)
  const idRef = useRef<string>('')
  const cursorRef = useRef<number>(read<number>(CURSOR_KEY, 0))
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!API) return
    idRef.current = sessionId()
  }, [])

  // Team.tsx (iyo meel kastoo kale) waxay ka dhigi kartaa dispatch event-kan si ay chat-ka u furaan, su'aal soo jeediyaan,
  // oo ay ku qabsadaan magaca/sawirka shaqaalaha la doortay — chat-ku wuxuu isla markiiba u muuqdaa mid gaar ah.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ prefill?: string; persona?: Persona; auth?: boolean }>).detail
      setOpen(true)
      if (detail?.auth) setShowAuth(true)
      if (detail?.prefill) setInput(detail.prefill)
      if (detail?.persona) {
        setPersona(detail.persona)
        write(PERSONA_KEY, detail.persona)
        setMessages((m) => {
          if (m.length !== 1 || m[0] !== greeting) return m
          const hello: Msg = { from: 'bot', text: `Asc! Waxaan ahay ${detail.persona!.name}, ${detail.persona!.role}. Maxaan kuu qaban karaa?`, ts: Date.now() }
          return [hello]
        })
      }
    }
    window.addEventListener('fcs-chat-open', onOpen)
    return () => window.removeEventListener('fcs-chat-open', onOpen)
  }, [])

  useEffect(() => {
    write(MESSAGES_KEY, messages.slice(-40))
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, open])

  useEffect(() => {
    if (!API) return
    let stopped = false
    const poll = async () => {
      if (!idRef.current) idRef.current = sessionId()
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
    const t = setInterval(poll, open ? 8000 : 30000)
    return () => {
      stopped = true
      clearInterval(t)
    }
  }, [open])

  // Dalabku marka uu gaadho tallaabada magaca (guided.js), waxaan bixinaa panel-ka xaqiijinta (AuthPanel: Sign Up /
  // Log In / Google) halkii qoraal la qori lahaa — kaliya taas, ma khusayso wada-hadalka guud ee su'aalaha/qiimaha.
  const lastBotText = [...messages].reverse().find((m) => m.from === 'bot')?.text || ''
  const needsAuth = !signedIn && ASKING_NAME_RE.test(lastBotText)

  const onAuthed = (reply: string, name: string) => {
    setSignedIn(true)
    write(SIGNED_IN_KEY, true)
    setShowAuth(false)
    void name
    if (reply) setMessages((m) => [...m, { from: 'bot', text: reply, ts: Date.now() }])
  }

  if (!API) return null

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setMessages((m) => [...m, { from: 'me', text, ts: Date.now() }])
    setBusy(true)
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: idRef.current || sessionId(), message: text }),
      })
      const data: { reply?: string } = await res.json().catch(() => ({}))
      if (!data.reply) throw new Error('empty')
      setMessages((m) => [...m, { from: 'bot', text: data.reply as string, ts: Date.now() }])
    } catch {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: 'Hadda ma kuu jawaabi karo. Fadlan nagala soo xiriir WhatsApp: +252 63 713 3499.', ts: Date.now() },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 88,
            zIndex: 60,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, 75vh)',
            display: 'flex',
            flexDirection: 'column',
            background: '#0F172A',
            border: '1px solid rgba(124,58,237,0.35)',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {persona && (
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {persona ? persona.name : 'FCS Technology'}
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {persona ? persona.role : "Caawiyaha AI · Farah ayaa go'aannada muhiimka ah xaqiijiya"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Xidh"
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', flexShrink: 0 }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              backgroundImage: CHAT_WALLPAPER,
              backgroundColor: '#0B1220',
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.from === 'me' ? '#7C3AED' : 'rgba(30,41,59,0.9)',
                    color: '#F1F5F9',
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {renderText(m.text)}
                </div>
                {m.ts && <span style={{ fontSize: 10, color: '#64748B', marginTop: 3, padding: '0 4px' }}>{fmtTime(m.ts)}</span>}
              </div>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', color: '#64748B', fontSize: 13 }}>Waa qorayaa…</div>}
            <div ref={bottomRef} />
          </div>

          {needsAuth && (
            <div style={{ padding: '10px 14px 0', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#A78BFA', padding: '9px 18px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Soo gal / Samee account
              </button>
            </div>
          )}

          <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid rgba(148,163,184,0.12)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Qor fariintaada…"
              maxLength={1500}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: 12,
                padding: '10px 12px',
                color: '#F1F5F9',
                fontSize: 14,
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
                borderRadius: 12,
                width: 44,
                color: 'white',
                cursor: busy ? 'default' : 'pointer',
                opacity: busy || !input.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={18} />
            </button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, padding: '0 12px 10px', flexWrap: 'wrap' }}>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none' }}>
              WhatsApp: +252 63 713 3499
            </a>
            {!signedIn && (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Soo gal / Samee account
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Xidh chat-ka' : 'Fur chat-ka'}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 60,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: persona && !open ? 'rgba(30,41,59,0.9)' : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
          color: 'white',
          boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {open ? (
          <X size={24} />
        ) : persona ? (
          <img src={persona.avatar} alt={persona.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <MessageCircle size={26} />
        )}
      </button>

      {showAuth && <AuthPanel sessionId={idRef.current || sessionId()} onClose={() => setShowAuth(false)} onAuthed={onAuthed} />}
    </>
  )
}
