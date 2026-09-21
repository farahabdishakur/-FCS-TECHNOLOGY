import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Portfolio from './pages/Portfolio'
import Card3D from './pages/Card3D'
import Team from './pages/Team'
import OfficeProfile from './pages/OfficeProfile'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ChatWidget from './components/ChatWidget'

// Bogga /chat wuxuu leeyahay input-kiisa gaarka ah — floating widget-ka waa in aan halkaas ku dul muuqan.
function GlobalChatWidget() {
  const location = useLocation()
  if (location.pathname.startsWith('/chat')) return null
  return <ChatWidget />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/card-3d" element={<Card3D />} />
        <Route path="/cv/card-3d.html" element={<Card3D />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:office" element={<OfficeProfile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:office" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fcs-panel-7391" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <GlobalChatWidget />
    </BrowserRouter>
  )
}
