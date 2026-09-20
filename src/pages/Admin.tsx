import { useState, useEffect } from 'react'
import { Service } from '../data/services'
import { getStoredServices, saveStoredServices, getStoredSettings, saveStoredSettings, resetDbToDefaults, SiteSettings } from '../data/dbStore'
import { Plus, Trash2, Edit3, LogOut, CheckCircle, ShieldCheck, Eye, EyeOff, LayoutDashboard, Database, MessageSquare, Settings, DollarSign, Users, ShoppingBag, RefreshCw, BrainCircuit } from 'lucide-react'

// Isla agent-server-ka ChatWidget-ku isticmaalo — halkan waxaan ku diraynaa adeegyada si AI-gu (Telegram, group-ka) u helo qiimaha/faahfaahinta ugu dambeysa.
const AI_API = (import.meta.env.VITE_AGENT_API as string | undefined) || (import.meta.env.DEV ? 'http://localhost:8787' : '')
const AI_SYNC_TOKEN = (import.meta.env.VITE_ADMIN_SYNC_TOKEN as string | undefined) || ''

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'orders' | 'settings'>('overview')
  const [servicesList, setServicesList] = useState<Service[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getStoredSettings())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  
  const [svcName, setSvcName] = useState('')
  const [svcCategory, setSvcCategory] = useState('Web & Tech')
  const [svcPrice, setSvcPrice] = useState('')
  const [svcDelivery, setSvcDelivery] = useState('5–7 Maalmood')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcImage, setSvcImage] = useState('')
  const [svcWaMsg, setSvcWaMsg] = useState('')

  const [toastMessage, setToastMessage] = useState('')
  const [syncingAI, setSyncingAI] = useState(false)

  useEffect(() => {
    setServicesList(getStoredServices())
    setSiteSettings(getStoredSettings())
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Halkan waxaa loo baahan yahay email/password gaar ah — labadaba waa in ay saxan yihiin, sidoo kale bogga /fcs-panel-7391
  // (ma jiro link muuqda) — ha la wadaagin cid kale. Beddel haddii aad rabto.
  const ADMIN_EMAIL = 'farah@fcs-technology.so'
  const ADMIN_PASSWORD = 'Farah-FCS-2026!'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Email-ka ama password-ka waa khalad.')
    }
  }

  const handleOpenAddModal = () => {
    setEditingServiceId(null)
    setSvcName('')
    setSvcCategory('Web & Tech')
    setSvcPrice('')
    setSvcDelivery('5–7 Maalmood')
    setSvcDesc('')
    setSvcImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&auto=format')
    setSvcWaMsg('Asc, waxaan xiisaynayaa adeeggan.')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (svc: Service) => {
    setEditingServiceId(svc.id)
    setSvcName(svc.name)
    setSvcCategory(svc.category)
    setSvcPrice(String(svc.price))
    setSvcDelivery(svc.delivery)
    setSvcDesc(svc.description)
    setSvcImage(svc.image || '')
    setSvcWaMsg(svc.whatsappMsg)
    setIsModalOpen(true)
  }

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault()
    if (!svcName || !svcPrice) return

    if (editingServiceId) {
      const updated = servicesList.map((s) => {
        if (s.id === editingServiceId) {
          return {
            ...s,
            name: svcName,
            category: svcCategory,
            categoryLabel: svcCategory,
            price: Number(svcPrice),
            priceLabel: `$${svcPrice}`,
            delivery: svcDelivery,
            description: svcDesc,
            shortDesc: svcDesc.slice(0, 100),
            image: svcImage || s.image,
            whatsappMsg: svcWaMsg,
          }
        }
        return s
      })
      setServicesList(updated)
      saveStoredServices(updated)
      showToast('Adeeggii waa la cusboonaysiiyay!')
    } else {
      const newSvc: Service = {
        id: String(Date.now()),
        name: svcName,
        slug: svcName.toLowerCase().replace(/\s+/g, '-'),
        category: svcCategory,
        categoryLabel: svcCategory,
        description: svcDesc || 'Adeeg cusub oo xirfadleh.',
        shortDesc: svcDesc || 'Adeeg cusub oo xirfadleh.',
        price: Number(svcPrice) || 99,
        priceLabel: `$${svcPrice}`,
        delivery: svcDelivery,
        icon: '⚡',
        color: '#7C3AED',
        gradient: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        image: svcImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&fit=crop&auto=format',
        whatsappMsg: svcWaMsg || `Asc, waxaan xiisaynayaa ${svcName}`,
        includes: ['Custom Design', 'Mobile Responsive', '1 Month Taageero'],
        faq: [{ q: 'Sida loo dalbado?', a: 'Geli WhatsApp si aad ugu dalbato.' }],
      }

      const updated = [newSvc, ...servicesList]
      setServicesList(updated)
      saveStoredServices(updated)
      showToast('Adeeg cusub waa lagu daray!')
    }

    setIsModalOpen(false)
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Ma ziirtaa inaad tirto adeeggan?')) {
      const updated = servicesList.filter((s) => s.id !== id)
      setServicesList(updated)
      saveStoredServices(updated)
      showToast('Adeeggii waa la tiray!')
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredSettings(siteSettings)
    showToast('Xogta ganacsiga waa la kaydiyay!')
  }

  const handleSyncToAI = async () => {
    if (!AI_API) {
      showToast('AI server (VITE_AGENT_API) lama dejin.')
      return
    }
    setSyncingAI(true)
    try {
      const res = await fetch(`${AI_API}/api/admin/sync-services`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(AI_SYNC_TOKEN ? { 'x-admin-token': AI_SYNC_TOKEN } : {}) },
        body: JSON.stringify({ services: servicesList }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      showToast(`AI-ga waa la cusboonaysiiyay! Qiimo isbedelay: ${data.priceRowsUpdated ?? 0}/${data.services ?? 0} adeeg.`)
    } catch (e) {
      showToast(`Khalad: AI-ga lama gaarin (${e instanceof Error ? e.message : 'unknown'}). Ma socdaa agent-server-ka?`)
    } finally {
      setSyncingAI(false)
    }
  }

  const handleResetDefaults = () => {
    if (confirm('Ma ziirtaa inaad xogta oo dhan ku celiso horey (Reset to defaults)?')) {
      resetDbToDefaults()
      setServicesList(getStoredServices())
      setSiteSettings(getStoredSettings())
      showToast('Xogtu waxay ku noqotay koodhkii hore!')
    }
  }

  const filteredServices = servicesList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory
    return matchesSearch && matchesCat
  })

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.75)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: 24,
            padding: '48px 40px',
            maxWidth: 440,
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: 16,
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 900 }}>Admin Dashboard Login</h1>
            <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 6 }}>
              Geli email-ka iyo password-ka maamulka FCS Technology.
            </p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FCA5A5', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 20 }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="email-kaaga"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  color: 'white',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 12,
                    padding: '14px 44px 14px 16px',
                    color: 'white',
                    fontSize: 15,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                marginTop: 8,
              }}
            >
              Soo Gal Dashboard-ka →
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0F172A', color: '#F8FAFC', minHeight: '100vh', paddingTop: 90, paddingBottom: 80 }}>
      {toastMessage && (
        <div style={{ position: 'fixed', top: 90, right: 24, zIndex: 1000, background: '#22C55E', color: 'white', padding: '14px 24px', borderRadius: 14, fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={20} /> {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#F8FAFC' }}>
              FCS Technology <span style={{ color: '#A78BFA' }}>Admin CMS</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
              Maamul adeegyada, xogta ganacsiga, iyo dalabaadka (isbeddelku halkan (browser-kan) ayuu ku kaydsamayaa).
              Marka aad qiimo/adeeg bedesho, riix <b>"Cusboonaysii AI-ga"</b> si Telegram/group-ku isla qiimahaas u helaan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleSyncToAI}
              disabled={syncingAI}
              title="U dir adeegyada agent-server-ka si AI-ga (Telegram, group-yada) uu qiimo/faahfaahin ugu dambeeyay u helo"
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#4ADE80',
                padding: '10px 18px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                cursor: syncingAI ? 'wait' : 'pointer',
                opacity: syncingAI ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <BrainCircuit size={15} /> {syncingAI ? 'Cusboonaysiinaya...' : 'Cusboonaysii AI-ga'}
            </button>

            <button
              onClick={handleResetDefaults}
              style={{
                background: 'rgba(148, 163, 184, 0.12)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#CBD5E1',
                padding: '10px 18px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <RefreshCw size={15} /> Reset Defaults
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                padding: '10px 18px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
          {[
            { label: 'Dhammaan Adeegyada', val: servicesList.length, icon: Database, color: '#7C3AED' },
            { label: 'Dalabaadka Active-ka', val: '14 Active', icon: ShoppingBag, color: '#06B6D4' },
            { label: 'Dakhliga Qiyaasta', val: '$8,450', icon: DollarSign, color: '#22C55E' },
            { label: 'Booqdayaasha Bisha', val: '1,840', icon: Users, color: '#F59E0B' },
          ].map((stat) => {
            const IconComp = stat.icon
            return (
              <div key={stat.label} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{stat.label}</span>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    <IconComp size={20} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC' }}>{stat.val}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(148, 163, 184, 0.15)', marginBottom: 32, paddingBottom: 12, flexWrap: 'wrap' }}>
          {[
            { id: 'services', label: `Maaraynta Adeegyada (${servicesList.length})`, icon: Database },
            { id: 'settings', label: 'Xogta Ganacsiga (Site Info)', icon: Settings },
            { id: 'orders', label: 'Dalabaadka WhatsApp', icon: MessageSquare },
            { id: 'overview', label: 'Overview Stats', icon: LayoutDashboard },
          ].map((tab) => {
            const IconComp = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: active ? 'linear-gradient(135deg, #7C3AED, #4F46E5)' : 'rgba(30, 41, 59, 0.4)',
                  color: active ? 'white' : '#94A3B8',
                  border: active ? 'none' : '1px solid rgba(148, 163, 184, 0.1)',
                  padding: '10px 20px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <IconComp size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        {(activeTab === 'services' || activeTab === 'overview') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, flex: 1, maxWidth: 600 }}>
                <input
                  type="text"
                  placeholder="Raadi adeeg..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    color: 'white',
                    outline: 'none',
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    color: 'white',
                    outline: 'none',
                  }}
                >
                  <option value="All">Dhammaan Qaybaha</option>
                  <option value="Web & Tech">Web & Tech</option>
                  <option value="Business Systems">Business Systems</option>
                  <option value="Design & Graphics">Design & Graphics</option>
                  <option value="Documents & Career">Documents & Career</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Plus size={18} /> Ku Dar Adeeg Cusub
              </button>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: 20, border: '1px solid rgba(148, 163, 184, 0.1)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', color: '#94A3B8' }}>
                      <th style={{ padding: '16px 20px' }}>Adeegga</th>
                      <th style={{ padding: '16px 20px' }}>Qaybta</th>
                      <th style={{ padding: '16px 20px' }}>Qiimaha</th>
                      <th style={{ padding: '16px 20px' }}>Muddada</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((svc) => (
                      <tr key={svc.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)', color: '#CBD5E1' }}>
                        <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={svc.image} alt={svc.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{svc.name}</div>
                            <div style={{ fontSize: 12, color: '#64748B' }}>{svc.slug}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#A78BFA', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                            {svc.category}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: '#22C55E' }}>{svc.priceLabel}</td>
                        <td style={{ padding: '16px 20px' }}>{svc.delivery}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleOpenEditModal(svc)}
                              style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <Edit3 size={14} /> Wax ka Bedel
                            </button>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: 36, borderRadius: 24, border: '1px solid rgba(148, 163, 184, 0.1)', maxWidth: 680 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Xogta Ganacsiga (Site Branding & Info)</h2>
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Magaca Ganacsiga</label>
                <input type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Nambarka WhatsApp-ka (Digits only)</label>
                <input type="text" value={siteSettings.whatsapp} onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Email-ka Ganacsiga</label>
                <input type="email" value={siteSettings.email} onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Goobta (Location Address)</label>
                <input type="text" value={siteSettings.address} onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}
              >
                Kaydi Xogta (Save Settings to LocalStorage)
              </button>
            </form>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#1E293B', border: '1px solid rgba(124, 58, 237, 0.4)', borderRadius: 24, padding: 36, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
              {editingServiceId ? 'Wax ka Bedel Adeegga' : 'Ku Dar Adeeg Cusub'}
            </h2>

            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Magaca Adeegga</label>
                <input type="text" required value={svcName} onChange={(e) => setSvcName(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Qaybta (Category)</label>
                  <select value={svcCategory} onChange={(e) => setSvcCategory(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }}>
                    <option value="Web & Tech">Web & Tech</option>
                    <option value="Business Systems">Business Systems</option>
                    <option value="Design & Graphics">Design & Graphics</option>
                    <option value="Documents & Career">Documents & Career</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Qiimaha ($)</label>
                  <input type="number" required value={svcPrice} onChange={(e) => setSvcPrice(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Sawirka URL (Image URL)</label>
                <input type="text" value={svcImage} onChange={(e) => setSvcImage(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Sharaxaadda</label>
                <textarea value={svcDesc} onChange={(e) => setSvcDesc(e.target.value)} rows={3} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: 10, padding: 12, color: 'white' }} />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Ka Noqo</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                  {editingServiceId ? 'Kaydi Bedelka' : 'Ku Dar Adeegga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
