import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  Rocket,
  Shield,
  Clock,
  TrendingUp,
  Zap,
  Globe,
  Bot,
  ShoppingCart,
  Palette,
  BarChart3,
  Smartphone,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import ScrollFade from '../components/ScrollFade'
import BusinessCard from '../components/BusinessCard'
import { services, stats } from '../data/services'
import { getStoredSettings } from '../data/dbStore'

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <div ref={ref}>{count}{suffix}</div>
}

function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    dx: (Math.random() - 0.5) * 120 + 'px',
    dy: (Math.random() - 0.5) * 120 + 'px',
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 4,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x + '%',
            top: p.y + '%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background:
              p.id % 3 === 0
                ? 'rgba(124, 58, 237, 0.6)'
                : p.id % 3 === 1
                ? 'rgba(6, 182, 212, 0.5)'
                : 'rgba(245, 158, 11, 0.4)',
            animation: `particle-drift ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            '--dx': p.dx,
            '--dy': p.dy,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

const serviceIcons: Record<string, typeof Globe> = {
  '1': Globe,
  '2': ShoppingCart,
  '3': Rocket,
  '4': Smartphone,
  '5': Zap,
  '6': Bot,
  '7': BarChart3,
  '8': TrendingUp,
  '9': MessageCircle,
  '10': Globe,
  '11': TrendingUp,
  '12': TrendingUp,
  '13': Palette,
  '14': Palette,
  '15': Palette,
  '16': Palette,
  '17': BarChart3,
  '18': BarChart3,
  '19': Palette,
  '20': BarChart3,
}

const faqs = [
  {
    q: 'Sidee baan dalabka ku soo sameeyn karaa?',
    a: "Waxaad nagula soo xiriiri kartaa WhatsApp ama foomka website-ga. Waxaan ku soo wacaynaa 24 saac gudahood.",
  },
  {
    q: 'Maxaa lacagta la bixiyaa?',
    a: "Lacagta waxaa lagu bixiyaa EVC Plus, Hormuud, ama Western Union. 50% galmudna, 50% dhamaadka mashruuca.",
  },
  {
    q: 'Miyaad garanteed bixisaan?',
    a: "Haa. Revision-ka waxaa lagu qeexay adeeg kasta bogga adeegga (tusaale, logo waxay leedahay revision aan xad lahayn). Wixii ka badan xadka waa la heshiiyaa.",
  },
  {
    q: 'Miyaad ka shaqaysan kartaan meel kasta?',
    a: "Haa! Waxaan online ka shaqaynaynaa macaamiil Soomaaliya, Galbeedka, iyo adduunka oo dhan.",
  },
  {
    q: 'Intee ayay qaadanaysaa shaqadu?',
    a: "Xawlaha ayaa kala duwan — logo waxaa qaadata 2-3 maalmood, website 5-7 maalmood, store 7-14 maalmood.",
  },
  {
    q: 'Ma leedahay taageero kadib shaqada?',
    a: "Haa! Dhammaan adeegyadeenu waxaa ku jira muddada taageerada. Waxaan kaa caawin karnaa xitaa kadib.",
  },
  {
    q: 'Miyaad samaysan kartaa afaf kala duwan?',
    a: "Haa! Waxaan samayn karnaa Somali, English, Arabic, iyo luuqado kale oo aad rabto.",
  },
  {
    q: 'Ma leedahay portfolio aan arki karo?',
    a: "Haa! Booqo bogga Portfolio si aad u aragto shaqadeena hore.",
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'La Xiriir',
    desc: 'Noo soo qor WhatsApp ama foomka hoose, oo noo sheeg waxaad rabto.',
    icon: MessageCircle,
  },
  {
    step: '02',
    title: 'Qorshe iyo Qiime',
    desc: 'Waxaan isla meel dhigaynaa qorshaha, qiimaha iyo waqtiga la dhammaystirayo.',
    icon: Rocket,
  },
  {
    step: '03',
    title: 'Dhisid',
    desc: 'Waan dhisnaa mashruuca, adna waxaad arkaysaa horumarka intaan shaqeynayno.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Gacan-gelin',
    desc: 'Waxaan kuu dhiibnaa mashruuca oo dhammaystiran, waxaanan kuu tusnaa sida loo isticmaalo.',
    icon: CheckCircle,
  },
]

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: '#94A3B8',
} as const

const fieldStyle = {
  background: 'rgba(15,23,42,0.8)',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: 12,
  padding: '12px 14px',
  color: '#F1F5F9',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
} as const

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)


  const settings = getStoredSettings()
  const [form, setForm] = useState({ name: '', service: '', message: '' })

  const contactRows = [
    { icon: Phone, label: 'Taleefan / WhatsApp', value: settings.phone, href: `tel:+${settings.whatsapp}` },
    { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: 'Goobta', value: settings.address, href: '' },
  ]

  const sendContactForm = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      `Asc, waxaan ahay ${form.name}.`,
      form.service ? `Waxaan xiisaynayaa: ${form.service}.` : '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer')
  }

  const waLink = (service?: string) => {
    const msg = service
      ? `Asc, waxaan xiisaynayaa adeegga ${service}. Fadlan ii soo dir faahfaahinta.`
      : 'Asc, waxaan xiisaynayaa adeegyada FCS Technology. Fadlan ii soo dir faahfaahinta.'
    return `https://wa.me/252637133499?text=${encodeURIComponent(msg)}`
  }

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh' }}>

      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F172A 0%, #1A0A3E 50%, #0C1525 100%)',
        }}
      >
        <Particles />

        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            top: -100,
            right: -100,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
            bottom: 50,
            left: -80,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '120px 24px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
            width: '100%',
          }}
          className="hero-grid"
        >
          <div style={{ animation: 'fadeInUp 0.8s ease forwards' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                borderRadius: 100,
                padding: '6px 16px',
                marginBottom: 24,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              <span style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600 }}>
                Fursan Cusub — Bilaabo Maanta
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: '-1.5px',
                color: '#F8FAFC',
              }}
            >
              Adeegyo{' '}
              <span className="gradient-text">Khibrad & Hal-abuur</span>
              <br />
              Ku Fadhiya
            </h1>

            <p
              style={{
                color: '#94A3B8',
                fontSize: 18,
                lineHeight: 1.8,
                marginBottom: 36,
                maxWidth: 520,
              }}
            >
              Aniga ayaa si xirfadleh kuugu qabanaya dhismaha website-yada, diyaarinta dukumiintiyada, naqshadaynta logo-yada, iyo xisaabaadka. Keliya ii sheeg baahidaada, anigaana kuu xallinaya!
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.45)',
                }}
                className="glow-hover"
              >
                <MessageCircle size={18} />
                Bilow Mashruuca
              </a>
              <Link
                to="/services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'transparent',
                  color: '#CBD5E1',
                  padding: '14px 28px',
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: 'none',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                Adeegyada Dhamaan
                <ArrowRight size={18} />
              </Link>
              
              <a
                href="/cv/card-3d.html"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06B6D4',
                  padding: '14px 28px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: 'none',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
                className="glow-hover"
              >
                💼 Kaarkayga & CV-ga
              </a>
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 44, flexWrap: 'wrap' }}>
              {[
                { icon: Shield, label: 'Guaranteed' },
                { icon: Clock, label: 'Jawaab 24 saac' },
                { icon: TrendingUp, label: 'Fast Delivery' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color="#22C55E" />
                  <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{ position: 'relative', height: 480, animation: 'fadeInUp 1s 0.2s ease both' }}
            className="hero-visual"
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 260,
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 20,
                padding: 24,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  💼
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9' }}>Xirfadle Diyaar ah</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Jawaab Degdeg ah</div>
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 12,
                  color: '#94A3B8',
                  lineHeight: 1.6,
                }}
              >
                "Asc! Adeeg noocee ah ayaad u baahan tahay maanta? Waan ku caawinayaa."
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  fontSize: 12,
                  color: '#64748B',
                }}
              >
                <span>98% Accuracy</span>
                <span style={{ color: '#22C55E' }}>● Online</span>
              </div>
            </div>

            {[
              { label: '30 Adeeg', top: '8%', left: '5%', color: '#7C3AED', delay: '1s' },
              { label: '3 Luqadood', top: '10%', right: '5%', color: '#06B6D4', delay: '2s' },
              { label: '5★ Rating', bottom: '15%', left: '5%', color: '#F59E0B', delay: '1.5s' },
              { label: 'Fast Delivery', bottom: '12%', right: '5%', color: '#22C55E', delay: '2.5s' },
            ].map(({ label, color, delay, ...pos }) => (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  ...pos,
                  background: 'rgba(15,23,42,0.85)',
                  border: `1px solid ${color}44`,
                  borderRadius: 12,
                  padding: '10px 14px',
                  backdropFilter: 'blur(12px)',
                  animation: `float 5s ${delay} ease-in-out infinite`,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: color,
                    marginBottom: 4,
                  }}
                />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            animation: 'float 2s ease-in-out infinite',
          }}
        >
          <span style={{ color: '#475569', fontSize: 11, letterSpacing: '0.1em' }}>HOOS U ROLL</span>
          <ChevronDown size={18} color="#475569" />
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; padding-top: 100px !important; }
            .hero-visual { display: none; }
          }
        `}</style>
      </section>

      <section style={{ background: 'rgba(124,58,237,0.06)', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '48px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            textAlign: 'center',
          }}
          className="stats-grid"
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 900,
                  color: '#A78BFA',
                  letterSpacing: '-1px',
                }}
              >
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ color: '#64748B', fontSize: 14, fontWeight: 500, marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 600px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 56 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)',
                borderRadius: 100,
                padding: '4px 16px',
                color: '#06B6D4',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: 16,
                textTransform: 'uppercase',
              }}
            >
              Adeegyadeena
            </span>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 900,
                color: '#F8FAFC',
                marginBottom: 16,
                letterSpacing: '-1px',
              }}
            >
              {services.length} Adeeg — Hal Meel
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Web, Documents, Design, iyo Automation — wax kasta oo aad u baahato
            </p>
          </ScrollFade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
            {[
              { cat: 'Web & Tech', icon: '💻', count: 7, color: '#7C3AED', img: '/cat-web-tech.png', desc: 'WordPress, Store, App, Chatbot' },
              { cat: 'Documents & Career', icon: '📄', count: 5, color: '#F59E0B', img: '/cat-documents.png', desc: 'CV, Cover Letter, Business Plan' },
              { cat: 'Design & Graphics', icon: '🎨', count: 7, color: '#EC4899', img: '/cat-design.png', desc: 'Logo, Poster, Menu, Brochure' },
              { cat: 'Data & Automation', icon: '📊', count: 1, color: '#10B981', img: '/cat-data.png', desc: 'Excel/Sheets Automated' },
            ].map((cat) => (
              <ScrollFade key={cat.cat}>
                <Link
                  to={`/services`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => {}}
                >
                  <div
                    className="card-hover"
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: `1px solid ${cat.color}25`,
                      borderRadius: 20,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                      <img src={cat.img} alt={cat.cat} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 20%, rgba(15,23,42,0.85) 100%)` }} />
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        background: `${cat.color}25`, border: `1px solid ${cat.color}40`,
                        borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: cat.color,
                      }}>
                        {cat.count} Adeeg
                      </div>
                    </div>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{cat.icon} <span style={{ fontWeight: 800, fontSize: 15, color: '#F1F5F9' }}>{cat.cat}</span></div>
                      <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.6 }}>{cat.desc}</p>
                    </div>
                  </div>
                </Link>
              </ScrollFade>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {services.filter(s => s.popular).map((service, i) => {
              const Icon = serviceIcons[service.id] || Globe
              return (
                <ScrollFade key={service.id} delay={i * 80}>
                  <div
                    className="card-hover"
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(148,163,184,0.08)',
                      borderRadius: 20,
                      padding: 28,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {service.popular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          color: 'white',
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 100,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ⭐ Popular
                      </div>
                    )}

                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: service.color + '22',
                        border: `1px solid ${service.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        fontSize: 24,
                      }}
                    >
                      <Icon size={26} color={service.color} />
                    </div>

                    <h3 style={{ fontWeight: 800, fontSize: 17, color: '#F1F5F9', marginBottom: 8 }}>
                      {service.name}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                      {service.shortDesc}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div>
                        <span
                          style={{ fontSize: 22, fontWeight: 900, color: '#A78BFA' }}
                        >
                          {service.priceLabel}
                        </span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(6,182,212,0.1)',
                          color: '#06B6D4',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 100,
                        }}
                      >
                        ⏱ {service.delivery}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link
                        to={`/services/${service.slug}`}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                          color: 'white',
                          padding: '10px',
                          borderRadius: 10,
                          textAlign: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Faahfaahin
                      </Link>
                      <a
                        href={waLink(service.name)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#25D36622',
                          border: '1px solid #25D36644',
                          color: '#25D366',
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        WA
                      </a>
                    </div>
                  </div>
                </ScrollFade>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link
              to="/services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#A78BFA',
                padding: '12px 28px',
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Adeegyada Dhamaan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '96px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1px', marginBottom: 16 }}>
              Maxaad Aniga Ii Dooranaysaa?
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Waxaan bixiyaa khibrad dhab ah iyo shaqo tayo leh oo natiijooyin laga arki karo
            </p>
          </ScrollFade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '🎯',
                title: 'Khibrad & Xirfad',
                desc: 'Waxaan leeyahay 5+ sano oo khibrad ah dhanka xalalka dijitaalka ah.',
                color: '#7C3AED',
              },
              {
                icon: '⚡',
                title: 'Degdeg & Xog-ogaal',
                desc: 'Waxaan kugu wareejinayaa shaqada ka hor waqtigii lagu heshiiyay.',
                color: '#06B6D4',
              },
              {
                icon: '💰',
                title: 'Qiime Habboon',
                desc: 'Waxaan bixiyaa adeegyo xirfadaysan oo leh qiimo macquul ah.',
                color: '#F59E0B',
              },
              {
                icon: '🤝',
                title: 'Taageero Joogto',
                desc: 'Waan ku garab taaganahay, su\'aal kasta oo aad qabto waan kaaga jawaabayaa.',
                color: '#22C55E',
              },
            ].map((item, i) => (
              <ScrollFade key={i} delay={i * 100}>
                <div
                  className="card-hover"
                  style={{
                    background: 'rgba(30,41,59,0.5)',
                    border: '1px solid rgba(148,163,184,0.08)',
                    borderRadius: 20,
                    padding: 32,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      marginBottom: 16,
                      filter: 'drop-shadow(0 4px 16px rgba(124,58,237,0.4))',
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F1F5F9', marginBottom: 10 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1px', marginBottom: 16 }}>
              Waa Kuma Naqshadeeyahaagu?
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Xirfadle aad ku aamini karto ganacsigaaga inuu ka dhigo mid casri ah oo online laga heli karo.
            </p>
          </ScrollFade>

          <ScrollFade delay={200}>
            <BusinessCard />
          </ScrollFade>
        </div>
      </section>

      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1px', marginBottom: 16 }}>
              Habka Aan U Shaqeyno
            </h2>
            <p style={{ color: '#64748B', fontSize: 16 }}>
              Afar tallaabo, fariin ilaa gacan-gelin
            </p>
          </ScrollFade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, position: 'relative' }}>
            {howItWorks.map((step, i) => {
              const Icon = step.icon
              return (
                <ScrollFade key={i} delay={i * 120}>
                  <div style={{ textAlign: 'center', position: 'relative' }}>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
                        border: '2px solid rgba(124,58,237,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        position: 'relative',
                      }}
                    >
                      <Icon size={28} color="#A78BFA" />
                      <div
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 900,
                          color: 'white',
                        }}
                      >
                        {step.step}
                      </div>
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F1F5F9', marginBottom: 10 }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </ScrollFade>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1px', marginBottom: 16 }}>
              Su'aalaha Inta Badan La Weydiiyo
            </h2>
          </ScrollFade>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <ScrollFade key={i} delay={i * 60}>
                <div
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: `1px solid ${openFaq === i ? 'rgba(124,58,237,0.4)' : 'rgba(148,163,184,0.08)'}`,
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#F1F5F9',
                      fontWeight: 700,
                      fontSize: 15,
                      textAlign: 'left',
                      gap: 12,
                    }}
                  >
                    {faq.q}
                    <ChevronDown
                      size={18}
                      color="#A78BFA"
                      style={{
                        transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  <div className={`accordion-content${openFaq === i ? ' open' : ''}`}>
                    <p style={{ padding: '0 24px 20px', color: '#94A3B8', fontSize: 14, lineHeight: 1.8 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollFade style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-1px', marginBottom: 16 }}>
              Nala Soo Xiriir
            </h2>
            <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Noo sheeg waxaad rabto, waxaan kuugu soo jawaabnaa 24 saac gudahood.
            </p>
          </ScrollFade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
            <ScrollFade>
              <div
                style={{
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: 24,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {contactRows.map(({ icon: Icon, label, value, href }) => {
                  const body = (
                    <>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'rgba(124,58,237,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={20} color="#A78BFA" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 15, color: '#F1F5F9', fontWeight: 600, overflowWrap: 'anywhere' }}>{value}</div>
                      </div>
                    </>
                  )
                  const rowStyle = { display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }
                  return href ? (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={rowStyle}>
                      {body}
                    </a>
                  ) : (
                    <div key={label} style={rowStyle}>
                      {body}
                    </div>
                  )
                })}

                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: '#25D366',
                    color: 'white',
                    padding: '14px 24px',
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: 16,
                    textDecoration: 'none',
                    marginTop: 4,
                  }}
                >
                  <MessageCircle size={20} />
                  WhatsApp Noo Qor
                </a>
              </div>
            </ScrollFade>

            <ScrollFade delay={120}>
              <form
                onSubmit={sendContactForm}
                style={{
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  borderRadius: 24,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <label style={labelStyle}>
                  Magacaaga
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={fieldStyle}
                  />
                </label>
                <label style={labelStyle}>
                  Adeegga aad rabto
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    style={fieldStyle}
                  >
                    <option value="">Ma hubo weli</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={labelStyle}>
                  Fariintaada
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...fieldStyle, resize: 'vertical' }}
                  />
                </label>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 14,
                    padding: '14px 24px',
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Dir Fariinta <ArrowRight size={18} />
                </button>
                <p style={{ fontSize: 12, color: '#64748B', textAlign: 'center' }}>
                  Fariinta waxay ku furmaysaa WhatsApp, adigoo dirista xaqiijinaya.
                </p>
              </form>
            </ScrollFade>
          </div>
        </div>
      </section>
    </div>
  )
}
