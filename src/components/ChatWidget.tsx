import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

const API = (import.meta.env.VITE_AGENT_API as string | undefined) || (import.meta.env.DEV ? 'http://localhost:8787' : '')
const WHATSAPP = 'https://wa.me/252637133499'

const SESSION_KEY = 'fcs_chat_session'
const CURSOR_KEY = 'fcs_chat_cursor'
const MESSAGES_KEY = 'fcs_chat_messages'

type Msg = { from: 'me' | 'bot'; text: string }

const greeting: Msg = {
  from: 'bot',
  text: 'Asc! Waxaan ahay caawiyaha AI ee FCS Technology. Waxaan kaa caawin karaa adeegyada, qiimaha iyo dalabka. Maxaad rabtaa?',
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
  const idRef = useRef<string>('')
  const cursorRef = useRef<number>(read<number>(CURSOR_KEY, 0))
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!API) return
    idRef.current = sessionId()
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
        setMessages((m) => [...m, ...data.messages.map((x) => ({ from: 'bot' as const, text: x.text }))])
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

  if (!API) return null

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setMessages((m) => [...m, { from: 'me', text }])
    setBusy(true)
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: idRef.current || sessionId(), message: text }),
      })
      const data: { reply?: string } = await res.json().catch(() => ({}))
      if (!data.reply) throw new Error('empty')
      setMessages((m) => [...m, { from: 'bot', text: data.reply as string }])
    } catch {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: 'Hadda ma kuu jawaabi karo. Fadlan nagala soo xiriir WhatsApp: +252 63 713 3499.' },
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
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>FCS Technology</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Caawiyaha AI · Farah ayaa go'aannada muhiimka ah xaqiijiya</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Xidh"
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.from === 'me' ? '#7C3AED' : 'rgba(30,41,59,0.9)',
                  color: '#F1F5F9',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {renderText(m.text)}
              </div>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', color: '#64748B', fontSize: 13 }}>Waa qorayaa…</div>}
            <div ref={bottomRef} />
          </div>

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
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', padding: '0 12px 10px', textDecoration: 'none' }}
          >
            Ama WhatsApp toos ah: +252 63 713 3499
          </a>
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
          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
          color: 'white',
          boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </>
  )
}
