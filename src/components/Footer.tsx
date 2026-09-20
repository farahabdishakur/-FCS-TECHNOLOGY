import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Share2, MessageSquare, PlayCircle } from 'lucide-react'

const WA_NUMBER = '252637133499'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
        borderTop: '1px solid rgba(124,58,237,0.2)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
        paddingBottom: 32,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 48,
            marginBottom: 56,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src="/logo.png"
                alt="FCS Technology Logo"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))',
                }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#F8FAFC' }}>FCS Technology</div>
                <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.05em' }}>
                  Websites · Design · Hal-abuur & Khibrad
                </div>
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Adeegyo dijital oo xirfadleh oo loogu talagalay ganacsiyada Soomaalida. Waxaan
              gargaaraa ganacsiga uu online u muuqdo.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: Share2, href: '#' },
                { icon: MessageSquare, href: 'https://wa.me/252637133499' },
                { icon: PlayCircle, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(124, 58, 237, 0.12)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: 16, fontSize: 14 }}>
              Adeegyada
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['WordPress Website', '/services/wordpress-business-website'],
                ['WooCommerce Store', '/services/woocommerce-store'],
                ['AI Chatbot', '/services/ai-chatbot'],
                ['Logo Design', '/services/logo-design'],
                ['Business Dashboard', '/services/business-dashboard'],
                ['Social Media', '/services/social-media-management'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    style={{
                      color: '#64748B',
                      textDecoration: 'none',
                      fontSize: 14,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A78BFA')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#64748B')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: 16, fontSize: 14 }}>
              Xiriiriyaha Degdega
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Kaarka 3D & CV', '/cv/card-3d.html'],
                ['Portfolio & Systems', '/cv/portfolio.html'],
                ['Adeegyada', '/services'],
                ['Qiimaha', '/pricing'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    style={{ color: '#64748B', textDecoration: 'none', fontSize: 14 }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A78BFA')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#64748B')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: 16, fontSize: 14 }}>
              Xiriir
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: Phone, text: '+252 63 713 3499', href: `tel:+${WA_NUMBER}` },
                { icon: Mail, text: 'farahabdishakurdahir@gmail.com', href: 'mailto:farahabdishakurdahir@gmail.com' },
                { icon: MapPin, text: 'Borama, Somaliland', href: '#' },
              ].map(({ icon: Icon, text, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#64748B',
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'color 0.2s ease',
                    wordBreak: 'break-all',
                  }}
                >
                  <Icon size={15} color="#7C3AED" style={{ flexShrink: 0 }} />
                  {text}
                </a>
              ))}
            </div>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Asc, waxaan xiisaynayaa adeegyada FCS Technology. Fadlan ii soo dir faahfaahinta.')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 20,
                background: '#25D366',
                color: 'white',
                padding: '10px 16px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp noo soo dir
            </a>

            <div style={{ marginTop: 24 }}>
              <p style={{ color: '#64748B', fontSize: 12, marginBottom: 10 }}>
                Hel wararka cusub:
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  type="email"
                  placeholder="Email-kaaga"
                  style={{
                    flex: 1,
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148,163,184,0.15)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#F1F5F9',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Dir
                </button>
              </form>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(148,163,184,0.08)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ color: '#475569', fontSize: 13 }}>
            © {new Date().getFullYear()} FCS Technology. Xuquuqda oo dhan way xidantahay.
          </p>
          <p style={{ color: '#334155', fontSize: 12 }}>
            Built with ❤️ in Somalia
          </p>
        </div>
      </div>
    </footer>
  )
}
