import { readFileSync } from 'node:fs'

export const OFFICES = ['maskax', 'intake', 'sales', 'amni', 'maaliyad', 'siyaasad', 'hawlgal', 'taageero', 'caawin', 'suuq']

function amountsIn(text) {
  return [...text.matchAll(/\$\s?(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]))
}

export function loadBrain(file, { paymentDetails = '' } = {}) {
  const text = readFileSync(file, 'utf8')
  const a = text.indexOf('## QAYBTA A')
  const b = text.indexOf('## QAYBTA B')
  if (a < 0 || b < a) throw new Error('Brain: Qaybta A/B lama helin ' + file)

  const context = text
    .slice(a, b)
    .replace(/\{\{PAYMENT_DETAILS\}\}/g, paymentDetails || '(lama dejin)')
    .trim()

  const general = text.match(/### GUUD\s*\n```prompt\n([\s\S]*?)```/)?.[1]?.trim()
  if (!general) throw new Error('Brain: ### GUUD prompt lama helin')

  const offices = {}
  for (const m of text.matchAll(/### OFFICE (\w+)[^\n]*\n```prompt\n([\s\S]*?)```/g)) {
    offices[m[1]] = { prompt: m[2].trim() }
  }
  const missing = OFFICES.filter((k) => !offices[k])
  if (missing.length) throw new Error('Brain: xafiisyo maqan: ' + missing.join(', '))

  const catalog = []
  const row = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*$/
  for (const line of context.split('\n')) {
    const m = line.match(row)
    if (!m) continue
    const priceText = m[3]
    const amounts = amountsIn(priceText)
    if (!amounts.length) continue
    catalog.push({
      id: Number(m[1]),
      name: m[2].replace(/⭐/g, '').trim(),
      priceText,
      time: m[4],
      includes: m[5],
      price: amounts[0],
      monthly: /\/bil/.test(priceText) ? amounts[1] || 0 : 0,
      amounts,
    })
  }

  const allowedAmounts = new Set()
  for (const s of catalog) {
    for (const x of s.amounts) {
      allowedAmounts.add(x)
      allowedAmounts.add(x / 2)
    }
    if (s.monthly) allowedAmounts.add(s.price + s.monthly)
  }

  return { context, general, offices, catalog, allowedAmounts }
}
