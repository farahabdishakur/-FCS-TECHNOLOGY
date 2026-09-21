import { Link } from 'react-router-dom'
import { Sparkles, MessageCircle, ShieldCheck, ArrowRight, Workflow } from 'lucide-react'
import { avatar, team, teamByOffice } from '../data/team'

// Socodka dalabka dhabta ah (orchestrator.js) — Xamse ayaa kala saara, Ikraan/Cabdiraxmaan/Xasan/Faadumo/Maxamed/Sagal
// waa tallaabooyinka isku xigxiga ee dalab kasta marayo; Nadiifo waxay hubisaa amniga gudaha, Deeqa/Yoonis waxay
// taageeraan si aan tooska ahayn (suuq-geyn + qabyo shaqo), sidaas darteed lama darin socodka.
const FLOW = ['maskax', 'intake', 'sales', 'maaliyad', 'siyaasad', 'hawlgal', 'taageero']

export default function Team() {
  const openChat = (prefill: string, persona: { name: string; role: string; avatar: string }) => {
    window.dispatchEvent(new CustomEvent('fcs-chat-open', { detail: { prefill, persona } }))
  }

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 90, paddingBottom: 100 }}>
      <section
        style={{
          padding: '40px 24px 60px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              borderRadius: 100,
              padding: '6px 18px',
              color: '#A78BFA',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Sparkles size={15} /> Shaqaalaha FCS Technology
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1.5px', marginBottom: 16 }}>
            Kulan{' '}
            <span style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Shaqaalaheenna
            </span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 18, lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
            Kooxda kuu shaqaynaysa 24 saac maalintii — mid kasta wuxuu ku takhasusay qayb gaar ah oo ka mid ah adeegyada FCS Technology.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#4ADE80', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 14 }}>
          <ShieldCheck size={14} /> MAAMULKA
        </div>
        {/* Founder card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            borderRadius: 24,
            padding: 32,
            marginBottom: 56,
          }}
        >
          <img
            src="/team/farah-abdishakur.jpg"
            alt="Farah Abdishakur"
            style={{ width: 120, height: 120, borderRadius: 20, objectFit: 'cover', border: '2px solid rgba(124, 58, 237, 0.4)' }}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Farah Abdishakur</h3>
            <div style={{ color: '#A78BFA', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Aasaasaha & Isku-duwaha Guud</div>
            <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.6, maxWidth: 620 }}>
              Isagu ayaa xaqiijiya go'aan kasta oo lacag, heshiis ama qiimo ah. Kooxda hoose waxay kaa caawiyaan si degdeg ah wax loogu qabto, laakiin isagaa mas'uulka ugu dambeeya ee FCS Technology.
            </p>
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#A78BFA', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 14 }}>
          <Sparkles size={14} /> SHAQAALAHA AI (10 XAFIIS)
        </div>

        {/* Team grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 22,
          }}
        >
          {team.map((m) => (
            <div
              key={m.office}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: 20,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${m.color}55`
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Link to={`/team/${m.office}`} style={{ textDecoration: 'none' }}>
                <img
                  src={avatar(m.name)}
                  alt={m.name}
                  style={{ width: 92, height: 92, borderRadius: '50%', background: 'rgba(15,23,42,0.6)', marginBottom: 16 }}
                />
                <h3 style={{ color: '#F8FAFC', fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{m.name}</h3>
              </Link>
              <div style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{m.role}</div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: m.color,
                  background: `${m.color}18`,
                  padding: '4px 10px',
                  borderRadius: 100,
                  marginBottom: 14,
                }}
              >
                {m.dept}
              </span>
              <p style={{ color: '#94A3B8', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20, minHeight: 66 }}>{m.blurb}</p>
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                <Link
                  to={`/team/${m.office}`}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    color: '#CBD5E1',
                    padding: '9px 14px',
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 12.5,
                    textDecoration: 'none',
                  }}
                >
                  Bogga <ArrowRight size={13} />
                </Link>
                <button
                  onClick={() =>
                    openChat(`Waxaan rabaa inaan ${m.name} wax weydiiyo oo ku saabsan ${m.role}.`, { name: m.name, role: m.role, avatar: avatar(m.name) })
                  }
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'rgba(124, 58, 237, 0.12)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    color: '#A78BFA',
                    padding: '9px 14px',
                    borderRadius: 100,
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: 'pointer',
                  }}
                >
                  <MessageCircle size={14} /> La Hadal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidee ay u shaqeeyaan — socodka dalabka dhabta ah, xafiis ilaa xafiis */}
        <div style={{ marginTop: 56, background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: 24, padding: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#06B6D4', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 10 }}>
            <Workflow size={14} /> SIDEE AY U SHAQEEYAAN
          </div>
          <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
            Xafiisyada kuma shaqeeyaan gooni-gooni ah — dalab kastaa wuxuu mara tallaabooyin isku xigxiga, xafiis kastana
            wuxuu qabtaa qaybtiisa ka hor inta uu kuu gudbin xafiiska xiga. Xamse ayaa marka hore kala saara xafiiska
            ugu habboon su'aashaada — sidaas darteed meel kastoo aad ka qorto, jawaabta saxda ah ayaad heli.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {FLOW.map((office, i) => {
              const m = teamByOffice(office)
              if (!m) return null
              return (
                <div key={office} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Link
                    to={`/team/${office}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15,23,42,0.5)', border: `1px solid ${m.color}30`, borderRadius: 100, padding: '6px 14px 6px 6px', textDecoration: 'none' }}
                  >
                    <img src={avatar(m.name)} alt={m.name} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                    <span style={{ color: '#F1F5F9', fontSize: 12.5, fontWeight: 700 }}>{m.name}</span>
                  </Link>
                  {i < FLOW.length - 1 && <ArrowRight size={14} color="#475569" />}
                </div>
              )
            })}
          </div>
          <p style={{ color: '#64748B', fontSize: 12.5, marginTop: 18 }}>
            Isla mar ahaan: <strong style={{ color: '#94A3B8' }}>Nadiifo</strong> ayaa gudaha ka hubisa amniga dalab kasta, halka{' '}
            <strong style={{ color: '#94A3B8' }}>Deeqa</strong> iyo <strong style={{ color: '#94A3B8' }}>Yoonis</strong> ay
            taageeraan suuq-geynta iyo qabyada shaqada.
          </p>
        </div>
      </div>
    </div>
  )
}
