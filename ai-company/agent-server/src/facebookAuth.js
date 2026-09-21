// Xaqiijinta "Continue with Facebook" — isla habka googleAuth.js (0 dependency, raw fetch). Facebook uma haysto
// endpoint tokeninfo oo bilaash ah sida Google, ee waxaa loo baahan yahay debug_token + app access token
// (APP_ID|APP_SECRET) si loo hubiyo in access token-ku sax yahay oo uu ka yimid app-kan (ma aha mid la xaday).
export class FacebookAuthError extends Error {}

export async function verifyFacebookAccessToken(accessToken, appId, appSecret, fetchImpl = fetch) {
  if (!accessToken) throw new FacebookAuthError('access token maqan')
  if (!appId || !appSecret) throw new FacebookAuthError('Facebook lama dejin (FACEBOOK_APP_ID/FACEBOOK_APP_SECRET)')

  const appToken = `${appId}|${appSecret}`
  const debugRes = await fetchImpl(
    `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`,
  )
  const debug = await debugRes.json().catch(() => ({}))
  const info = debug?.data
  if (!debugRes.ok || !info?.is_valid || String(info.app_id) !== String(appId)) {
    throw new FacebookAuthError('token khaldan')
  }

  const meRes = await fetchImpl(`https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`)
  const me = await meRes.json().catch(() => ({}))
  if (!meRes.ok || me.error) throw new FacebookAuthError(me.error?.message || 'profile lama helin')
  if (!me.email) throw new FacebookAuthError('Account-kaaga Facebook email kuma jiro. Fadlan isticmaal Google ama email/password.')

  return { name: String(me.name || me.email).slice(0, 80), email: String(me.email).slice(0, 200) }
}
