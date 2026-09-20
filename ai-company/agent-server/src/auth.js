// Password hashing (scrypt, built-in Node crypto — 0 dependency, isla habka mashruucan). Ha isticmaalin MD5/SHA plain.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEYLEN).toString('hex')
  return { salt, hash }
}

export function verifyPassword(password, salt, hash) {
  try {
    const check = scryptSync(password, salt, KEYLEN)
    const stored = Buffer.from(hash, 'hex')
    return check.length === stored.length && timingSafeEqual(check, stored)
  } catch {
    return false
  }
}

export function validateRegistration({ name, email, password }) {
  const errors = []
  if (!name || String(name).trim().length < 2) errors.push('Magaca waa in uu ka koobnaadaa ugu yaraan 2 xaraf.')
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('Email-ka sax uma qorna.')
  if (!password || String(password).length < 8) errors.push('Password-ku waa in uu ka koobnaadaa ugu yaraan 8 xaraf.')
  return errors
}

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase()
