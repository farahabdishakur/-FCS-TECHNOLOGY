import { Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useState } from 'react'

export interface CardStylePreset {
  id: string
  name: string
  icon: string
  accentColor: string
  gradientPanel: string
  bgLeft: string
  textColor: string
  subtextColor: string
  glowColor: string
  borderAccent: string
}

export const CARD_STYLES: CardStylePreset[] = [
  {
    id: 'original-cyan',
    name: 'Original Cyan & Purple',
    icon: '💎',
    accentColor: '#00D8F6',
    gradientPanel: 'linear-gradient(135deg, rgba(124, 92, 246, 0.85) 0%, rgba(225, 29, 72, 0.85) 50%, rgba(0, 216, 246, 0.85) 100%)',
    bgLeft: '#090B11',
    textColor: '#FFFFFF',
    subtextColor: '#94A3B8',
    glowColor: 'rgba(0, 216, 246, 0.45)',
    borderAccent: 'rgba(0, 216, 246, 0.5)',
  },
  {
    id: 'gold-amber',
    name: 'Luxury Gold & Amber',
    icon: '👑',
    accentColor: '#F59E0B',
    gradientPanel: 'linear-gradient(135deg, rgba(120, 53, 15, 0.85) 0%, rgba(217, 119, 6, 0.85) 50%, rgba(245, 158, 11, 0.85) 100%)',
    bgLeft: '#0C0A06',
    textColor: '#FFFFFF',
    subtextColor: '#A3A3A3',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderAccent: 'rgba(245, 158, 11, 0.5)',
  },
  {
    id: 'emerald-teal',
    name: 'Executive Emerald',
    icon: '💚',
    accentColor: '#10B981',
    gradientPanel: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(5, 150, 105, 0.85) 50%, rgba(16, 185, 129, 0.85) 100%)',
    bgLeft: '#040C09',
    textColor: '#FFFFFF',
    subtextColor: '#94A3B8',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderAccent: 'rgba(16, 185, 129, 0.5)',
  },
  {
    id: 'cyber-magenta',
    name: 'Cyberpunk Pink',
    icon: '💖',
    accentColor: '#F43F5E',
    gradientPanel: 'linear-gradient(135deg, rgba(136, 19, 55, 0.85) 0%, rgba(190, 18, 60, 0.85) 50%, rgba(244, 63, 94, 0.85) 100%)',
    bgLeft: '#14080E',
    textColor: '#FFFFFF',
    subtextColor: '#F1F5F9',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    borderAccent: 'rgba(244, 63, 94, 0.5)',
  },
  {
    id: 'royal-blue',
    name: 'Royal Sapphire',
    icon: '🔷',
    accentColor: '#3B82F6',
    gradientPanel: 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(29, 78, 216, 0.85) 50%, rgba(59, 130, 246, 0.85) 100%)',
    bgLeft: '#070D1D',
    textColor: '#FFFFFF',
    subtextColor: '#E2E8F0',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    borderAccent: 'rgba(59, 130, 246, 0.5)',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Crimson',
    icon: '🌅',
    accentColor: '#F97316',
    gradientPanel: 'linear-gradient(135deg, rgba(194, 65, 12, 0.85) 0%, rgba(234, 88, 12, 0.85) 50%, rgba(249, 115, 22, 0.85) 100%)',
    bgLeft: '#140A05',
    textColor: '#FFFFFF',
    subtextColor: '#F1F5F9',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    borderAccent: 'rgba(249, 115, 22, 0.5)',
  },
  {
    id: 'ultra-violet',
    name: 'Ultra Violet',
    icon: '💜',
    accentColor: '#A78BFA',
    gradientPanel: 'linear-gradient(135deg, rgba(91, 33, 182, 0.85) 0%, rgba(124, 90, 237, 0.85) 50%, rgba(167, 139, 250, 0.85) 100%)',
    bgLeft: '#0F091A',
    textColor: '#FFFFFF',
    subtextColor: '#F1F5F9',
    glowColor: 'rgba(167, 139, 250, 0.45)',
    borderAccent: 'rgba(167, 139, 250, 0.5)',
  },
  {
    id: 'pure-white',
    name: 'Modern Slate',
    icon: '⚪',
    accentColor: '#38BDF8',
    gradientPanel: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(51, 65, 85, 0.85) 50%, rgba(100, 116, 139, 0.85) 100%)',
    bgLeft: '#090D16',
    textColor: '#FFFFFF',
    subtextColor: '#CBD5E1',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    borderAccent: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'icy-cyan',
    name: 'Icy Arctic Cyan',
    icon: '❄️',
    accentColor: '#06B6D4',
    gradientPanel: 'linear-gradient(135deg, rgba(21, 94, 117, 0.85) 0%, rgba(8, 145, 178, 0.85) 50%, rgba(6, 182, 212, 0.85) 100%)',
    bgLeft: '#061118',
    textColor: '#FFFFFF',
    subtextColor: '#E0F2FE',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderAccent: 'rgba(6, 182, 212, 0.5)',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold Premium',
    icon: '🌸',
    accentColor: '#FB7185',
    gradientPanel: 'linear-gradient(135deg, rgba(159, 18, 57, 0.85) 0%, rgba(225, 29, 72, 0.85) 50%, rgba(251, 113, 133, 0.85) 100%)',
    bgLeft: '#170910',
    textColor: '#FFFFFF',
    subtextColor: '#FFE4E6',
    glowColor: 'rgba(251, 113, 133, 0.45)',
    borderAccent: 'rgba(251, 113, 133, 0.5)',
  },
]

interface BusinessCardProps {
  activeStyleId?: string
}

export default function BusinessCard({ activeStyleId = 'original-cyan' }: BusinessCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const preset = CARD_STYLES.find((s) => s.id === activeStyleId) || CARD_STYLES[0]

  const WA_NUMBER = '252637133499'
  
  const frontWaLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Asc Farah, waxaan xiisaynayaa adeegyada FCS Technology.')}`
  const qrUrlFront = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(frontWaLink)}&color=0F172A&bgcolor=FFFFFF`

  const backWebLink = 'https://fcs-tignoolaji.surge.sh'
  const qrUrlBack = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(backWebLink)}&color=0F172A&bgcolor=FFFFFF`

  const wpShowcaseImage = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&fit=crop&auto=format'
  const backNightImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format'

  return (
    <div
      style={{
        perspective: 1500,
        width: 720,
        height: 400,
        margin: '0 auto',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: 24,
            background: preset.bgLeft,
            border: `1.5px solid ${preset.borderAccent}`,
            overflow: 'hidden',
            boxShadow: isHovered 
              ? `0 40px 80px -20px ${preset.glowColor}, 0 0 45px ${preset.glowColor}`
              : `0 25px 50px -15px ${preset.glowColor}`,
            display: 'flex',
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.9,
              zIndex: 1,
            }}
          />

          <div
            style={{
              flex: 1.25,
              padding: '38px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: `1.5px solid ${preset.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 16px ${preset.accentColor}60`,
                }}
              >
                <img src="/logo.png" alt="FCS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontWeight: 950, fontSize: 22, letterSpacing: '1px', lineHeight: 1 }}>
                  FCS
                </div>
                <div style={{ color: preset.accentColor, fontSize: 11, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginTop: 2 }}>
                  TECHNOLOGY
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
                Farah Abdishakur
              </h2>
              <div style={{ color: preset.accentColor, fontSize: 15, fontWeight: 750, letterSpacing: '0.5px', marginBottom: 16 }}>
                Digital Solutions Expert
              </div>
              <div style={{ width: 44, height: 4, background: preset.accentColor, borderRadius: 10, boxShadow: `0 0 10px ${preset.accentColor}` }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: preset.subtextColor, fontSize: 13, fontWeight: 600 }}>
                <Phone size={15} color={preset.accentColor} /> <span>+252 63 713 3499</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: preset.subtextColor, fontSize: 13, fontWeight: 600 }}>
                <Mail size={15} color={preset.accentColor} /> <span>farahabdishakurdahir@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: preset.subtextColor, fontSize: 13, fontWeight: 600 }}>
                <Globe size={15} color={preset.accentColor} /> <span>fcs-tignoolaji.so</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: preset.subtextColor, fontSize: 13, fontWeight: 600 }}>
                <MapPin size={15} color={preset.accentColor} /> <span>Borama, Somaliland</span>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 0.95,
              position: 'relative',
              backgroundImage: `url(${wpShowcaseImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 75%, 2% 50%, 20% 25%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '38px 32px',
              zIndex: 2,
              transition: 'all 0.4s ease',
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: preset.gradientPanel, 
                mixBlendMode: 'multiply',
                zIndex: 1, 
                pointerEvents: 'none' 
              }} 
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)', zIndex: 1, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 2 }}>
              <div
                style={{
                  background: 'white',
                  padding: 8,
                  borderRadius: 18,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
                  border: '2px solid rgba(255,255,255,0.9)',
                  transform: isHovered ? 'scale(1.05) rotate(1deg)' : 'scale(1) rotate(0)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <img src={qrUrlFront} alt="WhatsApp QR" style={{ width: 84, height: 84, display: 'block' }} />
              </div>
            </div>

            <div style={{ textAlign: 'right', zIndex: 2 }}>
              <div style={{ color: 'white', fontSize: 11, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 3px 8px rgba(0,0,0,0.6)' }}>
                SCAN TO MESSAGE
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 24,
            backgroundImage: `url(${backNightImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `1.5px solid ${preset.borderAccent}`,
            overflow: 'hidden',
            boxShadow: `0 30px 60px -15px ${preset.glowColor}`,
            padding: 44,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: `radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.94) 0%, rgba(5, 6, 10, 0.98) 100%)`,
              zIndex: 1,
              pointerEvents: 'none'
            }} 
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(10, 15, 30, 0.9)',
                  border: `1px solid ${preset.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src="/logo.png" alt="Logo" style={{ width: 30, height: 30 }} />
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontWeight: 950, fontSize: 18 }}>FCS Technology</div>
                <div style={{ color: preset.accentColor, fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>Smart Digital Solutions</div>
              </div>
            </div>
            <span style={{ background: preset.accentColor, color: '#0F172A', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 900 }}>
              VERIFIED PRO
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, zIndex: 2 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Websites & Online Stores',
                'Business POS & ERP Systems',
                'School & Hotel Systems',
                'UI/UX & Branding Design',
              ].map((feature) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#CBD5E1', fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: preset.accentColor, fontSize: 14 }}>✦</span> {feature}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  background: 'white',
                  padding: 6,
                  borderRadius: 14,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  border: '1.5px solid rgba(255,255,255,0.8)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <img src={qrUrlBack} alt="Website QR" style={{ width: 72, height: 72, display: 'block' }} />
              </div>
              <span style={{ color: preset.accentColor, fontSize: 10, fontWeight: 800, letterSpacing: '1.5px' }}>SCAN WEBSITE</span>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${preset.accentColor}30`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: preset.subtextColor, zIndex: 2 }}>
            <span>© 2026 FCS Technology. All Rights Reserved.</span>
            <span style={{ color: preset.accentColor, fontWeight: 800 }}>Theme: {preset.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
