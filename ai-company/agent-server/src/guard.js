const ARABIC = /[؀-ۿ]/
const EN_WORDS = /\b(the|and|you|your|how|much|price|want|need|please|hello|hi|can|what|is|for|my|do|i|are|does|have|order|pay|cost|long|take|much)\b/gi
const SO_WORDS = /\b(waxaan|rabaa|iyo|waa|maxay|maxaad|immisa|qiimaha|qiimo|fadlan|asc|salaan|ma|sidee|ayaa|ayaad|ayaan|oo|adeeg|adeegga|adeegyada|dalab|waqtiga|waqti|intee|qaadataa|muddo|kartaa|karaa|bixin|lacagta|lacag|ku|leedahay|jiraa|jira|yahay|tahay|noo|kuu|baan|aan|waxa|halkee|maalmood|mahadsanid|ii|sameysaan|samayn|haysaa|haysaan|dukaan|nidaam|iskuul|maqaaxi)\b/gi

export function detectLang(text) {
  if (ARABIC.test(text)) return 'ar'
  const en = (text.match(EN_WORDS) || []).length
  const so = (text.match(SO_WORDS) || []).length
  return en > so ? 'en' : 'so'
}

const INJECTION = [
  /ignore (all |any |the |your )?(previous|prior|above|earlier)?\s*(instructions|rules|prompt)/i,
  /disregard (all |the |your )?(previous|prior)?\s*(instructions|rules)/i,
  /(reveal|show|print|repeat|leak|muuji|soo bandhig|i sii)\b.{0,30}\b(system prompt|prompt|instructions|api[ _-]?key|token|furaha|brain)/i,
  /you are (now|no longer)\b/i,
  /\b(act as|pretend to be|noqo)\b.{0,20}\b(farah|owner|admin|milkiile|maamule)/i,
  /developer mode|jailbreak|\bDAN mode\b/i,
  /iska indha tir|iska warran|ka tag xeerarka|xeerarka ha (ka )?raacin|dhaafso xeerarka/i,
  /(تجاهل|تجاهلي).{0,20}(التعليمات|القواعد)/,
]

const SOFT = [/```/, /\bsystem\s*:/i, /\binstruction/i, /<\/?(system|assistant|prompt)>/i]

export function screenInbound(text) {
  if (INJECTION.some((rx) => rx.test(text))) return { blocked: true, reason: 'injection' }
  return { blocked: false, suspicious: SOFT.some((rx) => rx.test(text)) }
}

const CLASSES = {
  legal: /\b(sharci\w*|maxkamad\w*|court|lawyer|qareen\w*|sue|dacwad\w*|legal)\b|محكمة|محامي/i,
  medical: /\b(hospital|clinic|bukaan\w*|patient\w*|isbitaal|caafimaad)\b|مستشفى|عيادة/i,
  complaint: /\b(cabasho\w*|complain\w*|xanaaq\w*|angry|scam|fraud|khiyaano\w*|refund|celin)\b|شكوى|احتيال/i,
  discount: /\b(dhimis|discount|ka dhim\w*|qiimo yar|qiimo jaban|cheaper|lower (the )?price|negotiat\w*|bargain|half price)\b|خصم/i,
}

const PAYMENT_CLAIM =
  /\b(waan bixiyay|waan (direy|diray|dirtay)|dirtay lacagta|i paid|i('ve| have) paid|i sent|payment (sent|done|made)|txn|transaction|reference no|lacagta waan)\b|دفعت|تم الدفع|حولت/i

export function classify(text) {
  const kinds = Object.keys(CLASSES).filter((k) => CLASSES[k].test(text))
  return { escalate: kinds[0] || null, kinds, paymentClaim: PAYMENT_CLAIM.test(text) }
}

const LEAKS = [/AIza[0-9A-Za-z_-]{20,}/, /\bsk-[A-Za-z0-9]{20,}/, /\d{8,10}:[A-Za-z0-9_-]{30,}/, /system prompt/i, /api[_ -]?key/i, /\[\[OFFICE:/i]
const PAYMENT_RECEIVED = /(lacagta|lacagtaadii)[^.!?\n]{0,25}(waa|way|la) (timid|la helay|helnay)|payment (was |has been )?received|we (have )?received your payment|تم استلام/i
const DISCOUNT_PROMISE = /(dhimis (ah|la sii|waan)|waan ku dhimay|discount (of|applied)|i can lower the price)/i

function amountsIn(text) {
  const found = []
  const rx = /(?:\$|USD\s?)\s?(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s?(?:\$|USD|dollar|doolar)/gi
  for (const m of text.matchAll(rx)) found.push(Number((m[1] || m[2]).replace(/,/g, '')))
  return found
}

export function checkOutbound(text, { allowedAmounts, paymentVerified = false }) {
  const violations = []
  for (const x of amountsIn(text)) {
    if (!allowedAmounts.has(x)) violations.push(`qiimo aan liiska ku jirin: $${x}`)
  }
  if (!paymentVerified && PAYMENT_RECEIVED.test(text)) violations.push('sheegay lacag la helay')
  if (DISCOUNT_PROMISE.test(text)) violations.push('ballan dhimis')
  if (LEAKS.some((rx) => rx.test(text))) violations.push('xog gudaha ah')
  return { ok: violations.length === 0, violations }
}

export function createRateLimiter({ max, windowMs }) {
  const hits = new Map()
  return {
    allow(key, now = Date.now()) {
      const list = (hits.get(key) || []).filter((t) => now - t < windowMs)
      if (list.length >= max) {
        hits.set(key, list)
        return false
      }
      list.push(now)
      hits.set(key, list)
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
      return true
    },
  }
}
