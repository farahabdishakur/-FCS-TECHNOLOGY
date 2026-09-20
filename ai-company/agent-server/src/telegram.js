const API = 'https://api.telegram.org'

export function createTelegram({ token, ownerChatId, fetchImpl = fetch, log = () => {} }) {
  let stopped = false
  let offset = 0
  const enabled = Boolean(token)

  async function call(method, body, isForm = false) {
    const res = await fetchImpl(`${API}/bot${token}/${method}`, {
      method: 'POST',
      ...(isForm ? { body } : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(40000),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.ok === false) throw new Error(`telegram ${method}: ${data.description || res.status}`)
    return data.result
  }

  async function send(text, chatId = ownerChatId) {
    if (!enabled || !chatId) {
      console.log('[notify]', text)
      return
    }
    for (let i = 0; i < text.length || i === 0; i += 3900) {
      await call('sendMessage', { chat_id: chatId, text: text.slice(i, i + 3900), disable_web_page_preview: true })
    }
  }

  async function sendDocument(name, content, caption = '', chatId = ownerChatId) {
    if (!enabled || !chatId) {
      console.log('[document]', name, content.length, 'bytes')
      return
    }
    const form = new FormData()
    form.append('chat_id', String(chatId))
    form.append('caption', caption)
    form.append('document', new Blob([content], { type: 'text/csv' }), name)
    await call('sendDocument', form, true)
  }

  async function poll(onOwnerText, { public: isPublic = false, onGroupText } = {}) {
    if (!enabled) return
    let botUsername = ''
    if (isPublic && onGroupText) {
      try {
        botUsername = (await call('getMe', {})).username || ''
      } catch (e) {
        log('telegram_getme_error', { message: e.message })
      }
    }
    while (!stopped) {
      try {
        const updates = await call('getUpdates', { offset, timeout: 25, allowed_updates: ['message'] })
        for (const u of updates) {
          offset = u.update_id + 1
          const msg = u.message
          if (!msg) continue
          const chatId = String(msg.chat.id)
          if (isPublic && msg.chat.type !== 'private') {
            if (!onGroupText) continue
            try {
              const out = await onGroupText(msg.text || '', chatId, msg, { botUsername })
              if (out) await send(out, chatId)
            } catch (e) {
              log('telegram_group_error', { message: e.message })
            }
            continue
          }
          if (!msg.text) continue
          if (isPublic) {
            try {
              const out = await onOwnerText(msg.text, chatId, msg)
              if (out) await send(out, chatId)
            } catch (e) {
              log('telegram_public_error', { message: e.message })
              await send('Waan ka xumahay, khalad ayaa dhacay. Fadlan mar kale isku day.', chatId).catch(() => {})
            }
            continue
          }
          if (!ownerChatId) {
            if (msg.text.startsWith('/start')) {
              await send(`Chat ID-gaagu waa: ${chatId}\nKu dar faylka .env: OWNER_CHAT_ID=${chatId} kadibna server-ka dib u bilow.`, chatId)
            }
            continue
          }
          if (chatId !== String(ownerChatId)) {
            log('telegram_ignored', { chatId })
            continue
          }
          try {
            const out = await onOwnerText(msg.text)
            if (typeof out === 'string') await send(out)
            else if (out?.document) await sendDocument(out.document.name, out.document.content, out.text || '')
          } catch (e) {
            await send('Khalad: ' + e.message)
          }
        }
      } catch (e) {
        log('telegram_error', { message: e.message })
        await new Promise((r) => setTimeout(r, 5000))
      }
    }
  }

  return {
    enabled,
    send,
    sendDocument,
    poll,
    stop() {
      stopped = true
    },
  }
}

export async function detectChatId(token, fetchImpl = fetch) {
  const res = await fetchImpl(`${API}/bot${token}/getUpdates`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ timeout: 0, allowed_updates: ['message'] }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.ok === false) throw new Error(data.description || `http ${res.status}`)
  const last = [...(data.result || [])].reverse().find((u) => u.message?.chat?.id)
  return last ? String(last.message.chat.id) : null
}
