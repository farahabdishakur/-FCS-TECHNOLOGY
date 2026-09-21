// Diridda email-ka xaqiijinta (Resend API — raw fetch, 0 dependency, isla habka Telegram/Google/Facebook).
// Haddii RESEND_API_KEY aan la dejin (bilaash weli), koodhka waxaa lagu qorayaa console-ka + log-ka halkii la
// diri lahaa — sidaas ayay tijaabada iyo horumarinta ugu socon karaan LLM/Telegram akhrigooda oo kale.
export async function sendVerifyCodeEmail({ to, name, code }, cfg, fetchImpl = fetch) {
  if (!cfg.resendApiKey) {
    console.log(`[email lama dejin] Koodhka xaqiijinta ee ${to}: ${code}`)
    return { sent: false, reason: 'RESEND_API_KEY lama dejin' }
  }
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.resendApiKey}` },
    body: JSON.stringify({
      from: cfg.emailFrom || 'FCS Technology <onboarding@resend.dev>',
      to: [to],
      subject: `${code} waa koodhkaaga xaqiijinta — FCS Technology`,
      text: `Asc ${name || ''},\n\nKoodhkaaga xaqiijinta waa: ${code}\n\nWuxuu shaqeynayaa 15 daqiiqo. Haddii aadan samayn codsigan, iska indho tir fariintan.\n\nFCS Technology`,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`)
  }
  return { sent: true }
}
