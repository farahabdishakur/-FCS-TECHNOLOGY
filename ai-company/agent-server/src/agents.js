import { parseJson } from './llm.js'

const SCHEMAS = {
  maskax:
    '{"intent":"greeting|price_question|new_order|project_status|payment_claim|complaint|discount|contract|other","language":"so|en|ar","office":"intake|sales|maaliyad|taageero|maskax","escalate":false,"reason":"","reply":"kaliya haddii office=maskax"}',
  intake:
    '{"reply":"","brief":{"service":"","serviceId":null,"purpose":"","users":"","deadline":"","budget":"","examples":"","assets":"","contact":""},"briefReady":false,"customerConfirmed":false}\nbriefReady=true marka Brief-ku buuxo oo aad weydiisay xaqiijin. customerConfirmed=true KALIYA marka macaamiilku fariintiisa u dambeysay uu xaqiijiyay Brief-ka.',
  sales:
    '{"reply":"","serviceId":null,"customerAccepted":false,"escalate":false,"reason":""}\nserviceId = lambarka adeegga Brain-ka. customerAccepted=true KALIYA marka macaamiilku si cad u aqbalay qiimaha/adeegga.',
  amni: '{"safe":true,"threat":"none|injection|secret_request|fraud|abuse","reason":""}',
  maaliyad: '{"reply":""}',
  taageero: '{"reply":"","escalate":false,"reason":""}',
  hawlgal: '{"checklist":["..."],"missing":["..."],"recommendation":"deliver|fix","notes":""}',
}

export function createAgents({ brain, llm }) {
  const buildSystem = (office, extra) =>
    [
      `[[OFFICE:${office}]]`,
      brain.general,
      brain.offices[office].prompt,
      '# BRAIN\n' + brain.context,
      extra ? '# XAALADDA HADDA\n' + extra : '',
      SCHEMAS[office]
        ? '# QAABKA NATIIJADA\nKu jawaab JSON kaliya (qoraal kale ha ku darin). Qaabka:\n' + SCHEMAS[office]
        : '',
    ]
      .filter(Boolean)
      .join('\n\n')

  async function call(office, { history = [], input, extra = '', json = true, maxTokens }) {
    const messages = [...history.slice(-12).map((m) => ({ role: m.role, content: m.text })), { role: 'user', content: input }]
    const raw = await llm.generate({
      system: buildSystem(office, extra),
      messages,
      json,
      temperature: json ? 0.2 : 0.5,
      maxTokens,
    })
    return json ? parseJson(raw) : raw.trim()
  }

  return {
    route: (ctx) => call('maskax', ctx),
    intake: (ctx) => call('intake', ctx),
    sales: (ctx) => call('sales', ctx),
    amni: (ctx) => call('amni', ctx),
    maaliyad: (ctx) => call('maaliyad', ctx),
    taageero: (ctx) => call('taageero', ctx),
    qa: (ctx) => call('hawlgal', ctx),
    contract: (ctx) => call('siyaasad', { ...ctx, json: false, maxTokens: 1800 }),
    draft: (ctx) => call('caawin', { ...ctx, json: false, maxTokens: 1800 }),
    posts: (ctx) => call('suuq', { ...ctx, json: false, maxTokens: 1500 }),
    // Wada-hadal xor ah (qoraal, ma aha JSON) — xafiis kasta, isticmaalka Farah (shaqaale, ma aha macaamiil).
    // office kasta wuu shaqeeyaa (10-da oo dhan), isla brain.offices[office].prompt ayaa la isticmaalaa.
    staffChat: (office, ctx) => call(office, { ...ctx, json: false, maxTokens: 1200 }),
  }
}
