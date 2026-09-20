import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
} from 'lucide-react'
import { services } from '../data/services'
import ScrollFade from '../components/ScrollFade'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find((s) => s.slug === slug)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    details: '',
    budget: '',
    timeline: '',
  })

  if (!service) return <Navigate to="/services" replace />

  const waLink = `https://wa.me/252637133499?text=${encodeURIComponent(service.whatsappMsg)}`
  const related = services.filter((s) => s.id !== service.id && s.category === service.category).slice(0, 3)
  const fallbackRelated = services.filter((s) => s.id !== service.id).slice(0, 3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Asc, magaceygu waa ${formData.name}. Waxaan dalbanayaa adeegga *${service.name}*.\n\nFaahfaahin: ${formData.details}\nBudget: ${formData.budget}\nTelefon: ${formData.phone}`
    window.open(
      `https://wa.me/252637133499?text=${encodeURIComponent(msg)}`,
      '_blank'
    )
  }

  const caseStudies = [
    { title: 'Noor Trading Co.', type: service.category, result: 'Waxay helaan 3x macaamiil badan', img: 'photo-1460925895917-afdab827c52f' },
    { title: 'Haybe Store', type: service.category, result: 'Iibka wuxuu korodhay 150%', img: 'photo-1556742049-0cfed4f6a45d' },
    { title: 'Dahab Tech', type: service.category, result: 'Website si degdeg ah u dhismay', img: 'photo-1551650975-87deedd944c3' },
  ]

  const getFallbackImage = (category: string) => {
    if (category === 'Web & Tech') return '/cat-web-tech.png'
    if (category === 'Documents & Career') return '/cat-documents.png'
    if (category === 'Design & Graphics') return '/cat-design.png'
    if (category === 'Data & Automation') return '/cat-data.png'
    return '/cat-web-tech.png'
  }

  const bgImage = service.image || getFallbackImage(service.category)

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 72 }}>
      <section
        style={{
          padding: '72px 24px 64px',
          backgroundColor: '#0F172A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 70% 50%, ${service.color}25 0%, #0F172A 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <Link
            to="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748B',
              textDecoration: 'none',
              fontSize: 14,
              marginBottom: 32,
              transition: 'color 0.2s ease',
            }}
          >
            <ArrowLeft size={16} /> Adeegyada Dhamaan
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 60,
              alignItems: 'center',
            }}
            className="detail-hero-grid"
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: service.color + '22',
                  border: `1px solid ${service.color}44`,
                  borderRadius: 100,
                  padding: '4px 14px',
                  color: service.color,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 20,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {service.category}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontWeight: 900,
                  color: '#F8FAFC',
                  letterSpacing: '-1.5px',
                  marginBottom: 20,
                  lineHeight: 1.1,
                }}
              >
                {service.name}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 17, lineHeight: 1.8, marginBottom: 36 }}>
                {service.description}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#25D366',
                    color: 'white',
                    padding: '14px 28px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 16,
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(37,211,102,0.35)',
                  }}
                >
                  <MessageCircle size={18} />
                  Dalbo Hadda
                </a>
              </div>
            </div>

            <div>
              <div
                style={{
                  background: 'rgba(30,41,59,0.8)',
                  border: `1px solid ${service.color}33`,
                  borderRadius: 24,
                  padding: 36,
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ color: '#64748B', fontSize: 14, marginBottom: 8 }}>Bilaabista Qiimaha</div>
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: '#A78BFA',
                      letterSpacing: '-2px',
                      lineHeight: 1,
                    }}
                  >
                    ${service.price}
                  </div>
                  <div style={{ color: '#475569', fontSize: 13, marginTop: 6 }}>
                    Qiimaha kama badana sida aad rabto
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingBottom: 24,
                    marginBottom: 24,
                    borderBottom: '1px solid rgba(148,163,184,0.08)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Clock size={18} color={service.color} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>
                      {service.delivery}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Xawli</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <DollarSign size={18} color={service.color} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>50% Galmudna</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Lacag-bixinta</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Star size={18} color={service.color} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>5.0/5</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Rating</div>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {service.includes.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                      <span style={{ color: '#94A3B8', fontSize: 14 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    marginTop: 24,
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    color: 'white',
                    padding: '14px',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    textDecoration: 'none',
                    boxShadow: '0 6px 24px rgba(124,58,237,0.35)',
                  }}
                  className="glow-hover"
                >
                  Bilaaw Mashruuca
                </a>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .detail-hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>
        <ScrollFade style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#F8FAFC', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Shaqadeena Hore
          </h2>
          <p style={{ color: '#64748B', marginBottom: 32 }}>Tusaalayaasha mashaaricta aan dhisay</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {caseStudies.map((cs, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 180,
                    background: `#1E293B url(https://images.unsplash.com/${cs.img}?w=600&h=360&fit=crop&auto=format) center/cover`,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 16,
                      fontSize: 11,
                      fontWeight: 700,
                      color: service.color,
                      background: service.color + '22',
                      border: `1px solid ${service.color}44`,
                      borderRadius: 100,
                      padding: '2px 10px',
                    }}
                  >
                    {cs.type}
                  </div>
                </div>
                <div style={{ padding: '20px 20px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: '#F1F5F9', marginBottom: 8 }}>
                    {cs.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14} color="#22C55E" />
                    <span style={{ color: '#94A3B8', fontSize: 13 }}>{cs.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollFade>

        <ScrollFade style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#F8FAFC', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Su'aalaha Badanaa La Weydiiyo
          </h2>
          <p style={{ color: '#64748B', marginBottom: 32 }}>Ku saabsan adeeggan</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {service.faq.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(30,41,59,0.6)',
                  border: `1px solid ${openFaq === i ? service.color + '44' : 'rgba(148,163,184,0.08)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
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
                    size={16}
                    color={service.color}
                    style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>
                <div className={`accordion-content${openFaq === i ? ' open' : ''}`}>
                  <p style={{ padding: '0 22px 18px', color: '#94A3B8', fontSize: 14, lineHeight: 1.8 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollFade>

        <ScrollFade style={{ marginBottom: 64 }}>
          <div
            style={{
              background: 'rgba(30,41,59,0.6)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 24,
              padding: 40,
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>
              Dalbo {service.name}
            </h2>
            <p style={{ color: '#64748B', marginBottom: 32 }}>
              Buuxi foomka, waxaan kugu soo wacaynaa 24 saac gudahood
            </p>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                  marginBottom: 20,
                }}
                className="form-grid"
              >
                {[
                  { key: 'name', label: 'Magacaaga', placeholder: 'Axmed Cali', type: 'text' },
                  { key: 'phone', label: 'Telefon', placeholder: '+252 61 xxxxxxx', type: 'tel' },
                  { key: 'email', label: 'Email (optional)', placeholder: 'email@example.com', type: 'email' },
                  { key: 'budget', label: 'Budget-gaaga', placeholder: '$300 - $500', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label
                      style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(formData as Record<string, string>)[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(15,23,42,0.6)',
                        border: '1px solid rgba(148,163,184,0.12)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: '#F1F5F9',
                        fontSize: 14,
                        outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Faahfaahinta Mashruuca
                </label>
                <textarea
                  rows={4}
                  placeholder="Noo sheeg waxa aad rabto..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(148,163,184,0.12)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    color: '#F1F5F9',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  style={{
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 6px 24px rgba(37,211,102,0.3)',
                  }}
                >
                  <MessageCircle size={17} /> Soo Dir WhatsApp
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#A78BFA',
                    padding: '14px 24px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: 'none',
                  }}
                >
                  Toos WhatsApp
                </a>
              </div>
            </form>
          </div>
          <style>{`
            @media (max-width: 600px) {
              .form-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </ScrollFade>

        {(related.length > 0 || fallbackRelated.length > 0) && (
          <ScrollFade>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>
              Adeegyo La Xidhiidha
            </h2>
            <p style={{ color: '#64748B', marginBottom: 32 }}>Waxa kale ee aad u baahan kartid</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {(related.length > 0 ? related : fallbackRelated).map((s, i) => (
                <Link
                  key={i}
                  to={`/services/${s.slug}`}
                  className="card-hover"
                  style={{
                    background: 'rgba(30,41,59,0.5)',
                    border: '1px solid rgba(148,163,184,0.08)',
                    borderRadius: 16,
                    padding: '20px 20px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      width: 52,
                      height: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: s.color + '18',
                      borderRadius: 12,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#F1F5F9', marginBottom: 4 }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#475569' }}>${s.price} ~</div>
                  </div>
                  <ArrowRight size={16} color="#475569" />
                </Link>
              ))}
            </div>
          </ScrollFade>
        )}
      </div>
    </div>
  )
}
