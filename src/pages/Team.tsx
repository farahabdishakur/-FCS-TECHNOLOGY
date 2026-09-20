import { Sparkles, MessageCircle, ShieldCheck } from 'lucide-react'

const avatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=7c3aed,4f46e5,a78bfa,06b6d4&radius=20`

const team = [
  {
    name: 'Ikraan',
    role: 'Xiriirka & Fahamka Baahida',
    dept: 'INTAKE',
    blurb: "Waxay ku dhagaysataa baahidaada si xushmad leh, kadibna kuu weydiisaa isla su'aalaha muhiimka ah ilaa ay si sax ah u fahmato waxa aad rabto.",
    color: '#06B6D4',
  },
  {
    name: 'Cabdiraxmaan',
    role: 'Maamulaha Iibka',
    dept: 'IIBINTA',
    blurb: 'Wuxuu kuu sheegaa qiimaha, waqtiga iyo adeegga kuugu habboon si degdeg ah — hal-abuur badan, mana kaa qariyo faahfaahin.',
    color: '#7C3AED',
  },
  {
    name: 'Nadiifo',
    role: 'Ilaaliyaha Amniga',
    dept: 'AMNIGA',
    blurb: 'Wax kastoo dhinaca lacagta, heshiisyada iyo xogta macaamiisha ah, marka hore ayay hubisaa inay ammaan yihiin ka hor inta aan la gudbin.',
    color: '#EF4444',
  },
  {
    name: 'Xasan',
    role: 'Maamulaha Maaliyadda',
    dept: 'MAALIYADDA',
    blurb: 'Sax ah oo aan iska dayn — ma xaqiijiyo lacag ilaa uu isagu (iyo Farah) ka eego akoonka dhabta ah.',
    color: '#22C55E',
  },
  {
    name: 'Faadumo',
    role: 'Xarunta Heshiisyada',
    dept: 'SIYAASADDA',
    blurb: 'Waxay diyaarisaa heshiisyada iyo qoraallada sharciga ah, si labada dhinac -- adiga iyo macaamiilka -- xaqiijiyaan waxa la isugu heshiiyay.',
    color: '#F59E0B',
  },
  {
    name: 'Maxamed',
    role: 'Hubiyaha Tayada',
    dept: 'HAWLGALKA',
    blurb: 'Indho-yaqaan faahfaahinta ah — ka hor inta shaqadu aan gaarin macaamiisha, wuu hubiyaa in wax kastaa sax yahay.',
    color: '#A78BFA',
  },
  {
    name: 'Sagal',
    role: 'Taageeraha Macaamiisha',
    dept: 'TAAGEERADA',
    blurb: 'Naxariis iyo dulqaad badan — kaaga jirta xitaa marka mashruucu dhamaaday, haddii su’aal ama caqabad kale soo baxdo.',
    color: '#EC4899',
  },
  {
    name: 'Yoonis',
    role: 'Kaaliyaha Guud',
    dept: 'CAAWINTA',
    blurb: 'Wuxuu diyaariyaa qabyada shaqada (CV, qorshe ganacsi, warbixin) oo kuu xasuusiya wixii socda si aanad wax uga dhicin.',
    color: '#06B6D4',
  },
  {
    name: 'Deeqa',
    role: 'Maamulaha Suuq-geynta',
    dept: 'SUUQ-GEYNTA',
    blurb: 'Firfircoon oo hal-abuur badan — waxay diyaarisaa qoraallada bulshada iyo aragtiyaha suuqa ee toddobaad kasta.',
    color: '#F59E0B',
  },
  {
    name: 'Xamse',
    role: 'Isku-duwaha Guud',
    dept: 'MASKAXDA',
    blurb: 'Isagu ayaa shaqada u qaybiya xafiiska ku habboon marka aad wax na weydiiso — si aadan meel kasta isu weydiin.',
    color: '#4F46E5',
  },
]

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
            marginBottom: 48,
          }}
        >
          <img
            src="/team/farah-abdishakur.jpg"
            alt="Farah Abdishakur"
            style={{ width: 120, height: 120, borderRadius: 20, objectFit: 'cover', border: '2px solid rgba(124, 58, 237, 0.4)' }}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4ADE80', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              <ShieldCheck size={14} /> AASAASAHA & AGAASIMAHA
            </div>
            <h3 style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Farah Abdishakur</h3>
            <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.6, maxWidth: 620 }}>
              Isagu ayaa xaqiijiya go'aan kasta oo lacag, heshiis ama qiimo ah. Kooxda hoose waxay kaa caawiyaan si degdeg ah wax loogu qabto, laakiin isagaa mas'uulka ugu dambeeya ee FCS Technology.
            </p>
          </div>
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
              key={m.name}
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
              <img
                src={avatar(m.name)}
                alt={m.name}
                style={{ width: 92, height: 92, borderRadius: '50%', background: 'rgba(15,23,42,0.6)', marginBottom: 16 }}
              />
              <h3 style={{ color: '#F8FAFC', fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{m.name}</h3>
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
              <button
                onClick={() =>
                  openChat(`Waxaan rabaa inaan ${m.name} wax weydiiyo oo ku saabsan ${m.role}.`, { name: m.name, role: m.role, avatar: avatar(m.name) })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: '#A78BFA',
                  padding: '9px 18px',
                  borderRadius: 100,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={14} /> La Hadal
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
