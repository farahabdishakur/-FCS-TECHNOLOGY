import { useState } from 'react'
import BusinessCard, { CARD_STYLES } from '../components/BusinessCard'
import { Briefcase, GraduationCap, Code, Download, MessageSquare, Mail, Phone, MapPin, Sparkles, Palette } from 'lucide-react'

export default function Card3D() {
  const [activeStyleId, setActiveStyleId] = useState('original-cyan')
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const WA_NUMBER = '252637133499'
  const activePreset = CARD_STYLES.find((s) => s.id === activeStyleId) || CARD_STYLES[0]
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Asc Farah, waxaan arkay Kaarkaaga 3D ee rasmiga ah (Style: ${activePreset.name}). Waxaan rabaa inaan kuu dalbado.`)}`

  const handleDownloadCV = () => {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 4000)
    window.print()
  }

  return (
    <div className="page-top" style={{ background: '#0F172A', color: '#F8FAFC', minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            className="hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: 100,
              padding: '6px 18px',
              color: '#A78BFA',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            <Sparkles size={15} /> Ultra-Premium 3D Card Engine & CV
          </div>
          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              marginBottom: 14,
            }}
          >
            Kaarka Rasmiga ah &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CV-ga Faarax
            </span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
            Fadlan dooro mid ka mid ah 10-ka style ee hoose si aad u aragto kaarka rasmiga ah — ka dibna riix kaarka si aad uga aragto dambe.
          </p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#CBD5E1', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
            <Palette size={16} color="#A78BFA" /> Dooro Style-ka Kaarka:
          </div>

          <div
            className="style-picker"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              background: 'rgba(30, 41, 59, 0.5)',
              padding: 10,
              borderRadius: 18,
              border: '1px solid rgba(148, 163, 184, 0.12)',
              backdropFilter: 'blur(12px)',
              flexWrap: 'wrap',
            }}
          >
            {CARD_STYLES.map((style) => {
              const active = activeStyleId === style.id
              return (
                <button
                  key={style.id}
                  onClick={(e) => { e.stopPropagation(); setActiveStyleId(style.id) }}
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${style.accentColor}30, ${style.accentColor}15)`
                      : 'rgba(15, 23, 42, 0.6)',
                    border: active
                      ? `2px solid ${style.accentColor}`
                      : '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: 10,
                    padding: '6px 12px',
                    color: active ? 'white' : '#CBD5E1',
                    fontWeight: active ? 800 : 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                    boxShadow: active ? `0 0 12px ${style.accentColor}50` : 'none',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{style.icon}</span>
                  <span>{style.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 50 }}>
          <div className="card-showcase-box">
            <div style={{ marginBottom: 16, color: '#A78BFA', fontSize: 13, fontWeight: 700 }}>
              💡 Riix kaarka si aad u wareejiso (Flip 3D)
            </div>

            <div className="card-3d-wrapper">
              <BusinessCard activeStyleId={activeStyleId} />
            </div>

            <div className="cta-buttons">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                }}
              >
                <MessageSquare size={18} /> Ku Dalbo Kaarkan WhatsApp
              </a>

              <button
                onClick={handleDownloadCV}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Download size={18} /> {downloadSuccess ? 'Daabac/Save CV PDF...' : 'Degso CV (PDF)'}
              </button>
            </div>
          </div>
        </div>

        <div
          className="cv-section"
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: 24,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="cv-header">
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#F8FAFC', marginBottom: 6 }}>
                Farah Abdishakur Dahir
              </h2>
              <div style={{ color: '#F59E0B', fontSize: 16, fontWeight: 700, letterSpacing: '0.5px' }}>
                Software Developer & Digital Solutions Expert
              </div>
              <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 10, maxWidth: 600, lineHeight: 1.6 }}>
                Aqoon-yahan dhanka farsamada & software-ka oo leh khibrad 5+ sano ah oo ku saabsan dhisidda websaydhada, sistamyada ganacsiga (POS, ERP, HMS), iyo xalalka casriga ah ee ganacsiga.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 14, border: '1px solid rgba(148, 163, 184, 0.1)', width: '100%', maxWidth: 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#CBD5E1' }}>
                <Phone size={15} color="#A78BFA" /> +252 63 713 3499
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#CBD5E1', wordBreak: 'break-all' }}>
                <Mail size={15} color="#A78BFA" /> farahabdishakurdahir@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#CBD5E1' }}>
                <MapPin size={15} color="#A78BFA" /> Borama, Somaliland
              </div>
            </div>
          </div>

          <div className="cv-grid">
            <div>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Code size={18} color="#7C3AED" /> Xirfadaha Farsamada (Skills)
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    'React.js & TypeScript',
                    'Tailwind CSS & Modern UI',
                    'WordPress & WooCommerce',
                    'Business Systems (POS, ERP, HMS)',
                    'Node.js & Express',
                    'Database Management (MySQL/Mongo)',
                    'UI/UX Design & Figma',
                    'SEO & Web Performance',
                  ].map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: 'rgba(124, 58, 237, 0.12)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        color: '#CBD5E1',
                        padding: '5px 12px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <GraduationCap size={18} color="#06B6D4" /> Waxbarashada (Education)
                </h3>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: 15 }}>Bachelor of Computer Science & IT</div>
                  <div style={{ color: '#06B6D4', fontSize: 13, fontWeight: 600 }}>Amoud University · Borama</div>
                  <div style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>2017 – 2021</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Briefcase size={18} color="#F59E0B" /> Khibrada Shaqo (Experience)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="exp-header">
                    <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: 15 }}>Lead Developer & Founder</div>
                    <span style={{ fontSize: 11, background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>2021 – Hada</span>
                  </div>
                  <div style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginTop: 2 }}>FCS Technology</div>
                  <ul style={{ color: '#94A3B8', fontSize: 12, marginTop: 8, paddingLeft: 16, lineHeight: 1.6 }}>
                    <li>Dhisidda 30+ websaydhada ganacsiga, dukaamada online-ka ah, iyo sistamyada custom-ka ah.</li>
                    <li>Maaraynta iyo habaynta sistamyada Iskuulada, Huteelada, POS-ka Maqaaxiyaha, iyo Farmasiyada.</li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="exp-header">
                    <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: 15 }}>Full-Stack Software Engineer</div>
                    <span style={{ fontSize: 11, background: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8', padding: '2px 8px', borderRadius: 100 }}>2019 – 2021</span>
                  </div>
                  <div style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginTop: 2 }}>Digital Tech Africa</div>
                  <ul style={{ color: '#94A3B8', fontSize: 12, marginTop: 8, paddingLeft: 16, lineHeight: 1.6 }}>
                    <li>Horumarinta database-yada iyo web application-ada loogu talagalay shirkadaha gobolka.</li>
                    <li>Implemenation-ka EVC Plus & online payment gateways.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
