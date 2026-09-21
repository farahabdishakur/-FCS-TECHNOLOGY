import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Globe, Palette, FileText, Briefcase, ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuthForm, GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '../hooks/useAuthForm'

const SIGNED_IN_KEY = 'fcs_chat_signed_in'

function sessionId(): string {
  const key = 'fcs_chat_session'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID().replace(/-/g, '')
  localStorage.setItem(key, id)
  return id
}

const FEATURES = [
  { icon: Globe, label: 'Websites & Tech' },
  { icon: Palette, label: 'Design & Graphics' },
  { icon: FileText, label: 'Dukumiinti & CV' },
  { icon: Briefcase, label: 'Business Systems' },
]

const FacebookMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
)

const field = (props: React.InputHTMLAttributes<HTMLInputElement>, IconCmp: typeof User) => (
  <div style={{ position: 'relative', marginBottom: 14 }}>
    <IconCmp size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
    <input
      {...props}
      style={{
        width: '100%',
        background: 'rgba(15,23,42,0.05)',
        border: '1px solid rgba(15,23,42,0.12)',
        borderRadius: 100,
        padding: '13px 16px 13px 44px',
        fontSize: 14,
        color: '#0F172A',
        outline: 'none',
      }}
    />
  </div>
)

export default function Login() {
  const idRef = useRef(sessionId())
  const navigate = useNavigate()
  const [welcomeName, setWelcomeName] = useState('')
  const onAuthed = (_reply: string, authedName: string) => {
    try {
      localStorage.setItem(SIGNED_IN_KEY, 'true')
    } catch {
      /* storage can be unavailable in private mode */
    }
    setWelcomeName(authedName || 'adiga')
    setTimeout(() => navigate('/'), 1400)
  }
  const { mode, setMode, name, setName, email, setEmail, password, setPassword, error, busy, submit, googleBtnRef, facebookLogin } = useAuthForm(
    idRef.current,
    onAuthed,
  )
  const signup = mode === 'signup'

  useEffect(() => {
    document.title = `${signup ? 'Samee Account' : 'Soo Gal'} — FCS Technology`
  }, [signup])

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 110, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft size={15} /> Dib ugu noqo Home-ka
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          }}
          className="fcs-login-grid"
        >
          {/* Dhinaca brand-ka — muujinta FCS Technology, isla qaabka hero-ga Home-ka (dark + purple glow) */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0F172A 0%, #1A0A3E 55%, #0C1525 100%)',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
            }}
            className="fcs-login-brand"
          >
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', top: -80, right: -80, pointerEvents: 'none' }} />
            <img src="/logo.png" alt="FCS Technology" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 24, position: 'relative' }} />
            <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, lineHeight: 1.2, position: 'relative' }}>
              {signup ? (
                <>Ku Biir <span style={{ color: '#A78BFA' }}>FCS Technology</span></>
              ) : (
                <>Ku Soo Dhawoow, <span style={{ color: '#A78BFA' }}>FCS Technology</span></>
              )}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 14.5, lineHeight: 1.7, marginBottom: 28, position: 'relative' }}>
              Samee ama soo gal accountkaaga si aad u xaqiijiso dalabkaaga oo aad u la socoto xaaladdiisa — website, design, dukumiinti iyo nidaamyada ganacsigaaga.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, position: 'relative' }}>
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="#A78BFA" />
                  </span>
                  <span style={{ fontSize: 12.5, color: '#CBD5E1', fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(148,163,184,0.15)', position: 'relative', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>✓ Guaranteed</span>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>✓ Jawaab 24 saac</span>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>✓ Fast Delivery</span>
            </div>
          </div>

          {/* Dhinaca foomka */}
          <div style={{ background: '#F8FAFC', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {welcomeName ? (
              <div className="fcs-login-fade" style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 26 }}>
                  ✅
                </div>
                <h2 style={{ color: '#0F172A', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Ku soo dhawoow, {welcomeName}!</h2>
                <p style={{ color: '#64748B', fontSize: 13.5 }}>Waad soo gashay. Waxaan kuu wadnaa bogga hore…</p>
              </div>
            ) : (
              <div key={mode} className="fcs-login-fade">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <img src="/logo.png" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', letterSpacing: '0.06em' }}>FCS TECHNOLOGY</span>
                </div>
                <h2 style={{ color: '#0F172A', fontSize: 24, fontWeight: 900, marginBottom: 6 }}>{signup ? 'Samee Account' : 'Soo Gal'}</h2>
                <p style={{ color: '#64748B', fontSize: 13, marginBottom: 22 }}>
                  {signup ? 'Si aan dalabkaaga u xaqiijino, kaydi xogtaada.' : 'Geli xogtaada si aad u sii wadato dalabkaagii hore.'}
                </p>
                <form onSubmit={submit}>
                {signup && field({ placeholder: 'Magacaaga', value: name, onChange: (e) => setName(e.target.value), required: true }, User)}
                {field({ type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value), required: true }, Mail)}
                {field(
                  {
                    type: 'password',
                    placeholder: signup ? 'Password (ugu yaraan 8 xaraf)' : 'Password',
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    required: true,
                    minLength: signup ? 8 : undefined,
                  },
                  Lock,
                )}
                {error && <div style={{ color: '#DC2626', fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
                <button type="submit" disabled={busy} style={btnStyle(busy)}>
                  {busy ? 'Sugaya…' : signup ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              {(GOOGLE_CLIENT_ID || FACEBOOK_APP_ID) && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 14px', color: '#94A3B8', fontSize: 11 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(15,23,42,0.1)' }} />
                    AMA
                    <div style={{ flex: 1, height: 1, background: 'rgba(15,23,42,0.1)' }} />
                  </div>
                  {GOOGLE_CLIENT_ID && <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 40, marginBottom: FACEBOOK_APP_ID ? 10 : 0 }} />}
                  {FACEBOOK_APP_ID && (
                    <button type="button" onClick={facebookLogin} disabled={busy} style={facebookBtnStyle(busy)}>
                      <FacebookMark />
                      Continue with Facebook
                    </button>
                  )}
                </>
              )}

              <p style={{ textAlign: 'center', fontSize: 12.5, color: '#64748B', marginTop: 20 }}>
                {signup ? 'Account horeba ma leedahay? ' : 'Account ma lihid weli? '}
                <button
                  type="button"
                  onClick={() => setMode(signup ? 'login' : 'signup')}
                  style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12.5 }}
                >
                  {signup ? 'Soo gal' : 'Samee mid'}
                </button>
              </p>
              <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94A3B8', marginTop: 14 }}>
                Password ma xasuusan?{' '}
                <a href="https://wa.me/252637133499" target="_blank" rel="noreferrer" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
                  Nala soo xiriir WhatsApp
                </a>
              </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fcsLoginFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fcs-login-fade { animation: fcsLoginFade 0.4s ease; }
        @media (max-width: 860px) {
          .fcs-login-grid { grid-template-columns: 1fr !important; }
          .fcs-login-brand { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const btnStyle = (busy: boolean): React.CSSProperties => ({
  width: '100%',
  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
  color: 'white',
  border: 'none',
  padding: 14,
  borderRadius: 100,
  fontWeight: 700,
  fontSize: 14,
  cursor: busy ? 'default' : 'pointer',
  opacity: busy ? 0.7 : 1,
  marginBottom: 4,
  boxShadow: '0 8px 20px rgba(124,58,237,0.35)',
})

const facebookBtnStyle = (busy: boolean): React.CSSProperties => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  background: '#1877F2',
  color: 'white',
  border: 'none',
  padding: 12,
  borderRadius: 100,
  fontWeight: 700,
  fontSize: 14,
  cursor: busy ? 'default' : 'pointer',
  opacity: busy ? 0.7 : 1,
})
