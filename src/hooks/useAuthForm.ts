import { useEffect, useRef, useState } from 'react'

const API = (import.meta.env.VITE_AGENT_API as string | undefined) || (import.meta.env.DEV ? 'http://localhost:8787' : '')
export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || ''
export const FACEBOOK_APP_ID = (import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined) || ''

type Mode = 'login' | 'signup'

// Isla xaqiijinta (email/password, Google, Facebook) oo la wadaago labada isku-dayga: AuthPanel.tsx (modal-ka
// wada-hadalka gudihiisa ah) iyo Login.tsx (bogga buuxa). Halkan waa manti kaliya — muuqaalka gaar buu leeyahay.
export function useAuthForm(sessionId: string, onAuthed: (reply: string, name: string) => void) {
  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false
    const onCredential = async (response: { credential: string }) => {
      setBusy(true)
      try {
        const r = await fetch(`${API}/api/auth/google`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, credential: response.credential }),
        })
        const data: { reply?: string; name?: string; error?: string } = await r.json().catch(() => ({}))
        if (cancelled) return
        if (!r.ok) throw new Error(data.error || 'Google sign-in failed')
        onAuthed(data.reply || '', data.name || '')
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Khalad ayaa dhacay.')
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    const render = () => {
      const g = (window as unknown as { google?: any }).google
      if (!g?.accounts?.id || !googleBtnRef.current || cancelled) return
      g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onCredential })
      googleBtnRef.current.innerHTML = ''
      g.accounts.id.renderButton(googleBtnRef.current, { theme: 'outline', size: 'large', shape: 'pill', width: 280 })
    }
    const existing = document.getElementById('google-identity-script') as HTMLScriptElement | null
    if ((window as unknown as { google?: any }).google?.accounts?.id) render()
    else if (existing) existing.addEventListener('load', render, { once: true })
    else {
      const script = document.createElement('script')
      script.id = 'google-identity-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = render
      document.head.appendChild(script)
    }
    return () => {
      cancelled = true
    }
  }, [sessionId, mode])

  useEffect(() => {
    if (!FACEBOOK_APP_ID) return
    const existing = document.getElementById('facebook-jssdk') as HTMLScriptElement | null
    const fbReady = () => (window as unknown as { FB?: any }).FB
    if (fbReady() || existing) return
    ;(window as unknown as { fbAsyncInit?: () => void }).fbAsyncInit = () => {
      fbReady().init({ appId: FACEBOOK_APP_ID, cookie: false, xfbml: false, version: 'v19.0' })
    }
    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const facebookLogin = () => {
    const FB = (window as unknown as { FB?: any }).FB
    if (!FB) {
      setError('Facebook weli lama diyaarin, fadlan yara sug oo isku day mar kale.')
      return
    }
    setError('')
    FB.login(
      async (response: { status: string; authResponse?: { accessToken: string } }) => {
        if (response.status !== 'connected' || !response.authResponse) {
          setError('Facebook sign-in lama dhammaystirin.')
          return
        }
        setBusy(true)
        try {
          const r = await fetch(`${API}/api/auth/facebook`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionId, accessToken: response.authResponse.accessToken }),
          })
          const data: { reply?: string; name?: string; error?: string } = await r.json().catch(() => ({}))
          if (!r.ok) throw new Error(data.error || 'Facebook sign-in failed')
          onAuthed(data.reply || '', data.name || '')
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Khalad ayaa dhacay.')
        } finally {
          setBusy(false)
        }
      },
      { scope: 'email' },
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const path = mode === 'signup' ? '/api/auth/register' : '/api/auth/login'
      const body = mode === 'signup' ? { sessionId, name, email, password } : { sessionId, email, password }
      const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data: { reply?: string; name?: string; error?: string } = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Khalad ayaa dhacay.')
      onAuthed(data.reply || '', data.name || name)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Khalad ayaa dhacay.')
    } finally {
      setBusy(false)
    }
  }

  return { mode, setMode, name, setName, email, setEmail, password, setPassword, error, busy, submit, googleBtnRef, facebookLogin }
}
