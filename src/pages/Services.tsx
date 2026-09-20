import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { services, categories } from '../data/services'
import ScrollFade from '../components/ScrollFade'

const WA_NUMBER = '252637133499'

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = categories.slice(1).map((cat) => ({
    ...cat,
    services: filtered.filter((s) => s.category === cat.key),
  }))

  const showGrouped = activeCategory === 'All' && !search

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 72 }}>

      <section
        style={{
          padding: '80px 24px 60px',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.1) 0%, transparent 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124, 58, 237, 0.12)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600 }}>{services.length} Adeeg oo Diyaar ah</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900, color: '#F8FAFC',
            letterSpacing: '-1.5px', marginBottom: 16,
          }}>
            Adeegyadayada{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Dhammaystiran</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            Web, Documents, Design, iyo Automation — wax kasta oo aad u baahato, waxaan heli kartaa
          </p>

          <div style={{
            position: 'relative', maxWidth: 480, margin: '0 auto',
          }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Raadi adeeg…"
              style={{
                width: '100%', paddingLeft: 48, paddingRight: 20, paddingTop: 14, paddingBottom: 14,
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: 14, color: '#F1F5F9', fontSize: 15, outline: 'none',
                backdropFilter: 'blur(12px)',
              }}
            />
          </div>
        </div>
      </section>

      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        justifyContent: 'center', padding: '0 24px 40px',
      }}>
        {categories.map((cat) => {
          const active = activeCategory === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '10px 22px',
                borderRadius: 100,
                border: active ? `1px solid ${cat.color}80` : '1px solid rgba(148,163,184,0.12)',
                background: active ? `${cat.color}20` : 'rgba(30,41,59,0.5)',
                color: active ? cat.color : '#64748B',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
              {cat.key !== 'All' && (
                <span style={{
                  background: active ? `${cat.color}30` : 'rgba(100,116,139,0.2)',
                  borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 700,
                  color: active ? cat.color : '#64748B',
                }}>
                  {services.filter(s => s.category === cat.key).length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>

        {showGrouped ? (
          <>
            {grouped.map((group) => group.services.length > 0 && (
              <div key={group.key} style={{ marginBottom: 72 }}>
                <ScrollFade>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    marginBottom: 32, paddingBottom: 20,
                    borderBottom: `1px solid ${group.color}20`,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `${group.color}18`,
                      border: `1px solid ${group.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>
                      {group.icon}
                    </div>
                    <div>
                      <h2 style={{ color: '#F8FAFC', fontSize: 22, fontWeight: 800 }}>
                        {group.label}
                      </h2>
                      <p style={{ color: '#64748B', fontSize: 13 }}>
                        {group.services.length} adeeg
                      </p>
                    </div>
                  </div>
                </ScrollFade>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 20,
                }}>
                  {group.services.map((service, i) => (
                    <ServiceCard key={service.id} service={service} delay={i * 0.08} />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748B' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 18 }}>Wax la mid ah "{search}" lama helin</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All') }}
                  style={{
                    marginTop: 20, background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#A78BFA', padding: '10px 24px', borderRadius: 10,
                    cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  }}
                >
                  Dhamaan u soo celi
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}>
                {filtered.map((service, i) => (
                  <ServiceCard key={service.id} service={service} delay={i * 0.06} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <section style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
        borderTop: '1px solid rgba(148,163,184,0.08)',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <h2 style={{ color: '#F8FAFC', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Adeeg Kama Arkin?
        </h2>
        <p style={{ color: '#64748B', fontSize: 16, marginBottom: 28 }}>
          Nala soo xiriir — waxaan samayn karnaa wax kasta oo aad u baahato!
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Asc, waxaan xiisaynayaa adeeg aan liiska kaga jirin. Fadlan ii caawin.')}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: 'white', padding: '16px 36px', borderRadius: 14,
            fontWeight: 700, fontSize: 16, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(37,211,102,0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp Nala Soo Xiriir
        </a>
      </section>
    </div>
  )
}

function ServiceCard({ service, delay }: { service: typeof services[0]; delay: number }) {
  const WA = '252637133499'
  const getFallbackImage = (category: string) => {
    if (category === 'Web & Tech') return '/cat-web-tech.png'
    if (category === 'Documents & Career') return '/cat-documents.png'
    if (category === 'Design & Graphics') return '/cat-design.png'
    if (category === 'Data & Automation') return '/cat-data.png'
    return '/cat-web-tech.png'
  }

  const cardImage = service.image || getFallbackImage(service.category)

  return (
    <ScrollFade>
      <div
        className="card-hover"
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          transition: 'all 0.3s ease',
          animationDelay: `${delay}s`,
        }}
      >
        <div style={{ height: 4, background: service.gradient }} />

        <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
          <img
            src={cardImage}
            alt={service.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.8) 100%)',
          }} />
        </div>

        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, fontSize: 22,
                background: `${service.color}15`,
                border: `1px solid ${service.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {service.icon}
              </div>
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: service.color,
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2,
                }}>
                  {service.categoryLabel}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.3 }}>
                  {service.name}
                </h3>
              </div>
            </div>
            {service.popular && (
              <span style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white', fontSize: 10, fontWeight: 800,
                padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap',
              }}>
                ⭐ Popular
              </span>
            )}
          </div>

          <p style={{
            color: '#64748B', fontSize: 13, lineHeight: 1.7, flex: 1,
          }}>
            {service.shortDesc}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {service.includes.slice(0, 3).map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={12} color="#22C55E" style={{ flexShrink: 0 }} />
                <span style={{ color: '#94A3B8', fontSize: 12 }}>{item}</span>
              </div>
            ))}
            {service.includes.length > 3 && (
              <span style={{ color: '#64748B', fontSize: 12, marginLeft: 20 }}>
                +{service.includes.length - 3} waxyaalo kale…
              </span>
            )}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 14, borderTop: '1px solid rgba(148,163,184,0.08)',
            flexWrap: 'wrap', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: service.color }}>
                {service.priceLabel}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Clock size={11} color="#64748B" />
                <span style={{ color: '#64748B', fontSize: 11 }}>{service.delivery}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                to={`/services/${service.slug}`}
                style={{
                  padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  color: '#A78BFA', textDecoration: 'none',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'all 0.2s ease',
                }}
              >
                Faahfaahin <ArrowRight size={13} />
              </Link>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(service.whatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  color: 'white', textDecoration: 'none',
                  background: service.gradient,
                  boxShadow: `0 4px 16px ${service.color}35`,
                  transition: 'all 0.2s ease',
                }}
              >
                Dalbo
              </a>
            </div>
          </div>
        </div>
      </div>
    </ScrollFade>
  )
}
