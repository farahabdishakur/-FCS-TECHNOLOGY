// Xaqiijinta "Sign in with Google" — kaliya marka dalabku gaadho tallaabada magaca (guided.js), si loo hubiyo
// macaamiil dhab ah (ma aha spam) ka hor inta aan dalabka la xaqiijin. Isticmaalka Google-ka tokeninfo endpoint-ka
// (bilaash, mid built-in ah) halkii la isticmaali lahaa maktabad JWT ah — waafaqsan qaabka mashruucan (0 dependency).
export class GoogleAuthError extends Error {}

export async function verifyGoogleIdToken(idToken, clientId, fetchImpl = fetch) {
  if (!idToken) throw new GoogleAuthError('id token maqan')
  const res = await fetchImpl(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) throw new GoogleAuthError(data.error_description || data.error || 'token khaldan')
  if (clientId && data.aud !== clientId) throw new GoogleAuthError('aud khaldan (client ID isma waafaqsana)')
  if (!data.email) throw new GoogleAuthError('email lama helin')
  return { name: String(data.name || data.given_name || data.email).slice(0, 80), email: String(data.email).slice(0, 200), emailVerified: data.email_verified === 'true' || data.email_verified === true }
}
