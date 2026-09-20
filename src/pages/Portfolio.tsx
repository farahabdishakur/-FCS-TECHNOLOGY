import { useState } from 'react'
import { Sparkles, CheckCircle2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollFade from '../components/ScrollFade'

const portfolioCategories = ['All', 'Systems', 'Web Design', '3D Card & CV', 'E-commerce', 'Branding']

const portfolioItems = [
  {
    id: 'card-3d-cv',
    title: 'Farah Abdishakur - 3D Interactive Card & CV',
    category: '3D Card & CV',
    desc: '3D Business Card casri ah oo leh interactive flip animation iyo resume buuxa oo lagu daabacan karo.',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&fit=crop&auto=format',
    tags: ['React 3D', 'Figma', 'Interactive Resume', 'CSS Transforms'],
    result: 'Featured CV Project',
    resultColor: '#A78BFA',
    wide: true,
    link: '/card-3d',
  },
  {
    id: 'school-sys',
    title: 'Sistamka Iskuulada (School Management System)',
    category: 'Systems',
    desc: 'Sistam buuxa oo loogu talagalay maamulka ardayda, natiijooyinka, fiiga, iyo jadwalka fasallada.',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&fit=crop&auto=format',
    tags: ['School ERP', 'Student Portal', 'Exam Grading', 'EVC Payment'],
    result: '1,500+ Students Managed',
    resultColor: '#7C3AED',
    wide: false,
    link: '/services/school-management-system',
  },
  {
    id: 'hotel-sys',
    title: 'Sistamka Huteelada (Hotel Management System)',
    category: 'Systems',
    desc: 'Sistamka qolalka kirooyinka, reservations-ka, lacag-bixinta, iyo warbixinnada maalinlaha ah.',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop&auto=format',
    tags: ['Hotel Booking', 'Room Calendar', 'Invoice Billing'],
    result: '100% Automated Booking',
    resultColor: '#06B6D4',
    wide: false,
    link: '/services/hotel-management-system',
  },
  {
    id: 'pos-sys',
    title: 'Sistamka Maqaaxiyaha & Cafe (Restaurant POS)',
    category: 'Systems',
    desc: 'Sistamka POS-ka ee miisaska, dalabaadka jikada (KDS), iyo xisaabaadka rasiidhada.',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&fit=crop&auto=format',
    tags: ['POS Touchscreen', 'Kitchen Display', 'Receipt Printer'],
    result: '3x Faster Service',
    resultColor: '#F59E0B',
    wide: false,
    link: '/services/pos-kitchen-system',
  },
  {
    id: 'noor-trading',
    title: 'Noor Trading Co. E-Commerce',
    category: 'E-commerce',
    desc: 'WooCommerce store oo buuxda loogu talagalay ganacsiga dharka Soomaalida. Iibka wuxuu korodhay 200%.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&fit=crop&auto=format',
    tags: ['WooCommerce', 'WordPress', 'EVC Payment'],
    result: '+200% Growth',
    resultColor: '#22C55E',
    wide: true,
    link: '/services/woocommerce-store',
  },
  {
    id: 'techstart',
    title: 'TechStart Somali Corporate Web',
    category: 'Web Design',
    desc: 'Website casri ah oo loogu talagalay shirkadda teknoolajiyada gobolka.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&auto=format',
    tags: ['React', 'Node.js', 'SEO Optimization'],
    result: '98% Performance',
    resultColor: '#06B6D4',
    wide: false,
    link: '/services/wordpress-website',
  },
  {
    id: 'hospital-sys',
    title: 'Sistamka Xarumaha Caafimaadka (Hospital HMS)',
    category: 'Systems',
    desc: 'Maaraynta bukaanada, kaadhadhka dhakhaatiirta, dawooyinka, iyo shaybaadhka.',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&fit=crop&auto=format',
    tags: ['EMR / HMS', 'Patient Records', 'Pharmacy Sync'],
    result: 'Full Clinic Management',
    resultColor: '#EC4899',
    wide: false,
    link: '/services/hospital-clinic-management',
  },
  {
    id: 'haybe-brand',
    title: 'Haybe Boutique Brand Identity',
    category: 'Branding',
    desc: 'Summad iyo brand-ka oo dhan oo loogu talagalay boutique casri ah.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format',
    tags: ['Logo Design', 'Brand Package', 'Social Media'],
    result: 'Complete Rebrand',
    resultColor: '#F59E0B',
    wide: false,
    link: '/services/logo-design',
  },
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === activeCategory)

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
            <Sparkles size={15} /> Mashaariicda & Khibradayada (Portfolio)
          </div>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 900,
              color: '#F8FAFC',
              letterSpacing: '-1.5px',
              marginBottom: 16,
            }}
          >
            Shaqooyinkii Ugu{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cajaiibka Ahaa
            </span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 18, lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
            Halkan ka bogo mashaariicdii u dambeeyay oo aan u dhisnay macaamiishayada, oo ay ku jiraan Websaydhada, Sistamyada Ganacsiga, iyo Kaarka 3D-ga ah.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 50,
            flexWrap: 'wrap',
          }}
        >
          {portfolioCategories.map((cat) => {
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 100,
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? 'white' : '#94A3B8',
                  background: active
                    ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                    : 'rgba(30, 41, 59, 0.6)',
                  border: active
                    ? '1px solid rgba(167, 139, 250, 0.5)'
                    : '1px solid rgba(148, 163, 184, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: active ? '0 8px 24px rgba(124, 58, 237, 0.35)' : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 32,
          }}
        >
          {filtered.map((item, idx) => (
            <ScrollFade key={item.id} delay={idx * 80}>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backdropFilter: 'blur(12px)',
                }}
                className="hover-card-glow"
              >
                <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(15, 23, 42, 0.9) 100%)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${item.resultColor}40`,
                      borderRadius: 100,
                      padding: '6px 14px',
                      color: item.resultColor,
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={14} /> {item.result}
                  </div>
                </div>

                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                      {item.category}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', marginBottom: 12, lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                      {item.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: 'rgba(148, 163, 184, 0.08)',
                            color: '#CBD5E1',
                            padding: '4px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={item.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <Eye size={16} /> Angaad Daawo Mashaariicda →
                  </Link>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>

        <div
          style={{
            marginTop: 80,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: 32,
            padding: '50px 32px',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#F8FAFC', marginBottom: 12 }}>
            Ma leedahay Mashruuc ama Sistam aad rabtid inaan kuu dhisno?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 600, margin: '0 auto 28px' }}>
            Nala soo xiriir hadda si aan kuu siinno la-talin bilaash ah iyo qiimaynta shaqadaada.
          </p>
          <a
            href="https://wa.me/252637133499?text=Asc%20FCS%20Technology%2C%20waxaan%20rabaa%20inaan%20kula%20tashado%20mashruuc%20cusub."
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 16,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
            }}
          >
            Nala Soo Xiriir WhatsApp →
          </a>
        </div>
      </div>
    </div>
  )
}
