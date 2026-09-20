const DEFAULT_GEMINI_MODEL = 'gemini-flash-latest'

export class LLMError extends Error {
  constructor(message, kind = 'error') {
    super(message)
    this.kind = kind
  }
}

export function parseJson(text) {
  if (typeof text !== 'string') return text ?? null
  const cleaned = text.replace(/```(?:json)?/gi, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function mergeSameRole(messages) {
  const out = []
  for (const m of messages) {
    const last = out[out.length - 1]
    if (last && last.role === m.role) last.content += '\n' + m.content
    else out.push({ role: m.role, content: m.content })
  }
  return out
}

export function createLLM(cfg, { store, fetchImpl = fetch, retryDelayMs = 800 } = {}) {
  const provider = cfg.provider
  let mockHandler = null

  const available = () => provider === 'mock' || ((provider === 'gemini' || provider === 'openai') && Boolean(cfg.apiKey))

  const chargeBudget = () => {
    if (!store) return
    const day = new Date().toISOString().slice(0, 10)
    const meta = store.db.meta
    if (meta.llm.day !== day) meta.llm = { day, calls: 0 }
    if (meta.llm.calls >= cfg.dailyLimit) throw new LLMError('daily limit reached', 'budget')
    meta.llm.calls += 1
    store.save()
  }

  async function post(url, headers, body) {
    let lastErr
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetchImpl(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...headers },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(cfg.timeoutMs),
        })
        if (res.status === 429 || res.status >= 500) {
          lastErr = new LLMError(`http ${res.status}`, 'transient')
        } else if (!res.ok) {
          throw new LLMError(`http ${res.status}`, 'fatal')
        } else {
          return await res.json()
        }
      } catch (e) {
        if (e instanceof LLMError && e.kind === 'fatal') throw e
        lastErr = e instanceof LLMError ? e : new LLMError(e.message || 'network', 'transient')
      }
      await sleep(retryDelayMs * (attempt + 1))
    }
    throw lastErr
  }

  async function gemini({ system, messages, json, temperature, maxTokens }) {
    const model = cfg.model || DEFAULT_GEMINI_MODEL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    const data = await post(
      url,
      { 'x-goog-api-key': cfg.apiKey },
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: mergeSameRole(messages).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          ...(json ? { responseMimeType: 'application/json' } : {}),
        },
      },
    )
    const parts = data?.candidates?.[0]?.content?.parts
    const text = parts?.map((p) => p.text || '').join('')
    if (!text) throw new LLMError('empty response', 'empty')
    return text
  }

  async function openai({ system, messages, json, temperature, maxTokens }) {
    if (!cfg.baseUrl || !cfg.model) throw new LLMError('LLM_BASE_URL iyo LLM_MODEL waa loo baahan yahay', 'fatal')
    const data = await post(
      cfg.baseUrl.replace(/\/$/, '') + '/chat/completions',
      { authorization: `Bearer ${cfg.apiKey}` },
      {
        model: cfg.model,
        temperature,
        max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, ...mergeSameRole(messages)],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      },
    )
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new LLMError('empty response', 'empty')
    return text
  }

  async function generate({ system, messages, json = false, temperature = 0.3, maxTokens = 900 }) {
    if (!available()) throw new LLMError('LLM lama dejin', 'unavailable')
    chargeBudget()
    const args = { system, messages, json, temperature, maxTokens }
    if (provider === 'mock') {
      if (!mockHandler) throw new LLMError('mock handler maqan', 'unavailable')
      const out = await mockHandler(args)
      return typeof out === 'string' ? out : JSON.stringify(out)
    }
    return provider === 'gemini' ? gemini(args) : openai(args)
  }

  return {
    provider,
    available,
    generate,
    setMock(fn) {
      mockHandler = fn
    },
  }
}
