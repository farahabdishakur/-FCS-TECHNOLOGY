import { services as initialServices, Service } from './services'

export interface SiteSettings {
  siteName: string
  tagline: string
  phone: string
  whatsapp: string
  email: string
  address: string
  primaryColor: string
}

const STORAGE_KEYS = {
  SERVICES: 'fcs_services_v2',
  SETTINGS: 'fcs_settings_v2',
}

const defaultSettings: SiteSettings = {
  siteName: 'FCS Technology',
  tagline: 'Websites · Design · Innovation & Tech',
  phone: '+252 63 713 3499',
  whatsapp: '252637133499',
  email: 'farahabdishakurdahir@gmail.com',
  address: 'Borama, Somaliland',
  primaryColor: '#7C3AED',
}

export function getStoredServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error reading stored services:', e)
  }
  return initialServices
}

export function saveStoredServices(list: Service[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list))
  } catch (e) {
    console.error('Error saving services:', e)
  }
}

export function getStoredSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultSettings, ...parsed }
    }
  } catch (e) {
    console.error('Error reading stored settings:', e)
  }
  return defaultSettings
}

export function saveStoredSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (e) {
    console.error('Error saving settings:', e)
  }
}

export function resetDbToDefaults() {
  localStorage.removeItem(STORAGE_KEYS.SERVICES)
  localStorage.removeItem(STORAGE_KEYS.SETTINGS)
}
