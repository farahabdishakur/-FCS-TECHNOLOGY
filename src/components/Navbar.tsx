import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: '3D Card & CV', href: '/card-3d' },
  { label: 'Portfolio', href: '/portfolio' },
]

const WA_NUMBER = '252637133499'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? 'rgba(10, 15, 30, 0.75)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
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
            <span style={{ fontWeight: 800, fontSize: 16, color: '#F8FAFC', letterSpacing: '-0.3px' }}>
              FCS Technology
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 500,
                color: '#94A3B8',
                letterSpacing: '0.05em',
                marginTop: -2,
              }}
            >
              Websites · Design · Innovation & Tech
            </span>
          </div>
        </Link>

        <ul
          style={{
            display: 'flex',
            gap: 4,
            listStyle: 'none',
            alignItems: 'center',
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => {
            const active = location.pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#A78BFA' : '#CBD5E1',
                    textDecoration: 'none',
                    background: active ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Asc, waxaan xiisaynayaa adeegyada FCS Technology. Fadlan ii soo dir faahfaahinta.')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
            }}
            className="glow-hover hidden-mobile"
          >
            Contact Us
          </a>

          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: 8,
              color: '#A78BFA',
              padding: '8px',
              cursor: 'pointer',
              display: 'none',
            }}
            className="show-mobile"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            padding: '16px 24px 24px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                display: 'block',
                padding: '14px 16px',
                color: location.pathname === link.href ? '#A78BFA' : '#CBD5E1',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 10,
                marginBottom: 4,
                background:
                  location.pathname === link.href ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Asc, waxaan xiisaynayaa adeegyada FCS Technology.')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              padding: '14px',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: 700,
              textDecoration: 'none',
              marginTop: 12,
            }}
          >
            Contact Us on WhatsApp
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
