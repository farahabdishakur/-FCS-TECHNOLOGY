import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { avatar, teamByOffice, team } from '../data/team'

export default function OfficeProfile() {
  const { office } = useParams<{ office: string }>()
  const member = office ? teamByOffice(office) : undefined

  useEffect(() => {
    if (member) document.title = `${member.name} — ${member.role} — FCS Technology`
  }, [member])

  if (!member) return <Navigate to="/team" replace />

  const openChat = () => {
    window.dispatchEvent(
      new CustomEvent('fcs-chat-open', {
        detail: { prefill: `Waxaan rabaa inaan ${member.name} wax weydiiyo.`, persona: { name: member.name, role: member.role, avatar: avatar(member.name) } },
      }),
    )
  }

  const others = team.filter((m) => m.office !== member.office)

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 110, paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <Link to="/team" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 28 }}>
          <ArrowLeft size={15} /> Dib ugu noqo Shaqaalaha
        </Link>

        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: `1px solid ${member.color}40`,
            borderRadius: 28,
            padding: '48px 40px',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          <img
            src={avatar(member.name)}
            alt={member.name}
            style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(15,23,42,0.6)', margin: '0 auto 24px', border: `3px solid ${member.color}55` }}
          />
          <h1 style={{ color: '#F8FAFC', fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{member.name}</h1>
          <div style={{ color: member.color, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{member.role}</div>
          <span
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: member.color,
              background: `${member.color}18`,
              padding: '5px 14px',
              borderRadius: 100,
              marginBottom: 20,
            }}
          >
            XAFIISKA {member.dept}
          </span>
          <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 28px' }}>{member.blurb}</p>
          <button
            onClick={openChat}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              border: 'none',
              color: 'white',
              padding: '14px 28px',
              borderRadius: 100,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${member.color}30`,
            }}
          >
            <MessageCircle size={17} /> La Hadal {member.name}
          </button>
          <p style={{ color: '#64748B', fontSize: 12.5, marginTop: 16 }}>
            Su'aal aan xafiiskan khusayn? Wuu ku hagi doonaa xafiiska ugu habboon.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 16 }}>
          XAFIISYADA KALE
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {others.map((m) => (
            <Link
              key={m.office}
              to={`/team/${m.office}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: 100,
                padding: '6px 14px 6px 6px',
                textDecoration: 'none',
              }}
            >
              <img src={avatar(m.name)} alt={m.name} style={{ width: 26, height: 26, borderRadius: '50%' }} />
              <span style={{ color: '#CBD5E1', fontSize: 12.5, fontWeight: 600 }}>{m.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
