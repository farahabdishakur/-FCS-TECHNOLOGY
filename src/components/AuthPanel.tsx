import { X, User, Mail, Lock, Check } from 'lucide-react'
import { useAuthForm, GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '../hooks/useAuthForm'

const EASE = 'transform 0.6s ease-in-out, opacity 0.5s ease-in-out'

const SERVICES = ['Websites & Tech', 'Design & Graphics', 'Dukumiinti & CV']

const BrandList = () => (
  <div style={{ textAlign: 'left', margin: '4px 0 20px' }}>
    {SERVICES.map((s) => (
      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, opacity: 0.9, marginBottom: 6 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={10} />
        </span>
        {s}
      </div>
    ))}
  </div>
)

const FacebookMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
)

type Props = {
  sessionId: string
  onClose: () => void
  onAuthed: (reply: string, name: string) => void
}

const field = (props: React.InputHTMLAttributes<HTMLInputElement>, IconCmp: typeof User) => (
  <div style={{ position: 'relative', marginBottom: 12 }}>
    <IconCmp size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
    <input
      {...props}
      style={{
        width: '100%',
        background: 'rgba(15,23,42,0.06)',
        border: '1px solid rgba(15,23,42,0.12)',
        borderRadius: 100,
        padding: '11px 14px 11px 40px',
        fontSize: 14,
        color: '#0F172A',
        outline: 'none',
      }}
    />
  </div>
)

// Panel-ka is-diiwaangelinta/gelitaanka — qaabka "sliding overlay" ee caanka ah (2 foom oo isku dul jira, overlay-ga
// midabka lihina wuu u dhaqaaqaa dhinac ilaa dhinaca kale). Waxaa la soo bandhigaa marka dalabku u baahdo in
// macaamiilku la xaqiijiyo (ChatWidget) — Sign Up, Log In, Google ama Facebook, dhammaantoodba isla backend-ka.
export default function AuthPanel({ sessionId, onClose, onAuthed }: Props) {
  const { mode, setMode, name, setName, email, setEmail, password, setPassword, error, busy, submit, googleBtnRef, facebookLogin } = useAuthForm(
    sessionId,
    onAuthed,
  )
  const active = mode === 'signup' // "right-panel-active" ee qaabka caadiga ah

  const socialBlock = (GOOGLE_CLIENT_ID || FACEBOOK_APP_ID) && (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px', color: '#94A3B8', fontSize: 11 }}>
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
  )

  return (
    <div
      role="dialog"
      aria-label="Xaqiijinta macaamiilka"
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,6,23,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(720px, 100%)',
          height: 'min(480px, 90vh)',
          background: '#F8FAFC',
          borderRadius: 24,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="fcs-auth-card"
      >
        <button
          onClick={onClose}
          aria-label="Xidh"
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 200, background: 'rgba(15,23,42,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155' }}
        >
          <X size={16} />
        </button>

        {/* Log In form — bilowga wuxuu ku yaal dhinaca bidix; markii signup la doorto wuxuu u dhaqaaqaa midig oo qariyaa */}
        <div
          className={`fcs-auth-form${active ? '' : ' fcs-auth-form-visible'}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            padding: '40px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto',
            transition: EASE,
            transform: active ? 'translateX(100%)' : 'translateX(0)',
            opacity: active ? 0 : 1,
            zIndex: active ? 1 : 5,
            pointerEvents: active ? 'none' : 'auto',
          }}
        >
          <h2 style={{ color: '#0F172A', fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Soo Gal</h2>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 18 }}>Ku soo noqo dalabkaagii hore.</p>
          <form onSubmit={submit}>
            {field({ type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value), required: true }, Mail)}
            {field({ type: 'password', placeholder: 'Password', value: password, onChange: (e) => setPassword(e.target.value), required: true }, Lock)}
            {!active && error && <div style={{ color: '#DC2626', fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={busy} style={btnStyle(busy)}>
              {busy ? 'Sugaya…' : 'Log In'}
            </button>
          </form>
          {!active && socialBlock}
          <div className="fcs-auth-dots" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <span style={dotStyle(!active)} />
            <span style={dotStyle(active)} />
          </div>
          <p className="fcs-auth-mobile-toggle" style={{ display: 'none', textAlign: 'center', fontSize: 12.5, color: '#64748B', marginTop: 14 }}>
            Account ma lihid weli?{' '}
            <button type="button" onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12.5 }}>
              Samee mid
            </button>
          </p>
        </div>

        {/* Sign Up form — bilowga waa qarsan yahay dhinaca bidix; markii la doorto wuxuu u dhaqaaqaa midig oo muuqdaa */}
        <div
          className={`fcs-auth-form${active ? ' fcs-auth-form-visible' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            padding: '40px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto',
            transition: EASE,
            transform: active ? 'translateX(100%)' : 'translateX(0)',
            opacity: active ? 1 : 0,
            zIndex: active ? 5 : 1,
            pointerEvents: active ? 'auto' : 'none',
          }}
        >
          <h2 style={{ color: '#0F172A', fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Samee Account</h2>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 18 }}>Si aan dalabkaaga u xaqiijino, kaydi xogtaada.</p>
          <form onSubmit={submit}>
            {field({ placeholder: 'Magacaaga', value: name, onChange: (e) => setName(e.target.value), required: true }, User)}
            {field({ type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value), required: true }, Mail)}
            {field({ type: 'password', placeholder: 'Password (ugu yaraan 8 xaraf)', value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8 }, Lock)}
            {active && error && <div style={{ color: '#DC2626', fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={busy} style={btnStyle(busy)}>
              {busy ? 'Sugaya…' : 'Sign Up'}
            </button>
          </form>
          {active && socialBlock}
          <div className="fcs-auth-dots" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            <span style={dotStyle(!active)} />
            <span style={dotStyle(active)} />
          </div>
          <p className="fcs-auth-mobile-toggle" style={{ display: 'none', textAlign: 'center', fontSize: 12.5, color: '#64748B', marginTop: 14 }}>
            Account horeba ma leedahay?{' '}
            <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12.5 }}>
              Soo gal
            </button>
          </p>
        </div>

        {/* Overlay-ga midabka leh — wuxuu u dhaqaaqaa 50%-ka kale, isagoo si isugu xigta u soo bandhigaya labada dhinac */}
        <div
          className="fcs-auth-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            transition: 'transform 0.6s ease-in-out',
            transform: active ? 'translateX(-100%)' : 'translateX(0)',
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: 'relative',
              left: '-100%',
              width: '200%',
              height: '100%',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              transition: 'transform 0.6s ease-in-out',
              transform: active ? 'translateX(50%)' : 'translateX(0)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 34px',
                transition: 'transform 0.6s ease-in-out',
                transform: active ? 'translateX(0)' : 'translateX(-20%)',
              }}
            >
              <img src="/logo.png" alt="FCS Technology" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 14 }} />
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>Ku Soo Dhawoow!</h3>
              <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6, marginBottom: 16 }}>Account horeba ma leedahay? Soo gal si aad u sii wadato.</p>
              <BrandList />
              <button type="button" onClick={() => setMode('login')} style={ghostBtnStyle}>
                Soo Gal
              </button>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 34px',
                transition: 'transform 0.6s ease-in-out',
                transform: active ? 'translateX(20%)' : 'translateX(0)',
              }}
            >
              <img src="/logo.png" alt="FCS Technology" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 14 }} />
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>Salaan!</h3>
              <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6, marginBottom: 16 }}>Samee account si aad dalabkaaga u xaqiijiso oo aad la socoto xaaladdiisa.</p>
              <BrandList />
              <button type="button" onClick={() => setMode('signup')} style={ghostBtnStyle}>
                Samee Account
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 620px) {
            .fcs-auth-card { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; }
            .fcs-auth-form {
              width: 100% !important;
              padding: 32px 24px !important;
              position: relative !important;
              transform: none !important;
              opacity: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
              pointer-events: none !important;
            }
            .fcs-auth-form.fcs-auth-form-visible {
              opacity: 1 !important;
              height: 100% !important;
              overflow-y: auto !important;
              pointer-events: auto !important;
            }
            .fcs-auth-overlay { display: none !important; }
            .fcs-auth-mobile-toggle { display: block !important; }
          }
        `}</style>
      </div>
    </div>
  )
}

const btnStyle = (busy: boolean): React.CSSProperties => ({
  width: '100%',
  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
  color: 'white',
  border: 'none',
  padding: 13,
  borderRadius: 100,
  fontWeight: 700,
  fontSize: 14,
  cursor: busy ? 'default' : 'pointer',
  opacity: busy ? 0.7 : 1,
  marginBottom: 4,
  boxShadow: '0 8px 20px rgba(124,58,237,0.35)',
})

const dotStyle = (active: boolean): React.CSSProperties => ({
  width: active ? 18 : 6,
  height: 6,
  borderRadius: 100,
  background: active ? '#7C3AED' : 'rgba(15,23,42,0.15)',
  transition: 'all 0.3s ease',
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
  padding: 11,
  borderRadius: 100,
  fontWeight: 700,
  fontSize: 14,
  cursor: busy ? 'default' : 'pointer',
  opacity: busy ? 0.7 : 1,
})

const ghostBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.7)',
  color: 'white',
  padding: '10px 30px',
  borderRadius: 100,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
}
