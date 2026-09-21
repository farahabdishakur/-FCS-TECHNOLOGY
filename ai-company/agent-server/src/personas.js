// Aqoonsiga shaqaalaha AI ee xafiis kasta — isla magacyada ee bogga website-ka (src/pages/Team.tsx),
// si macaamiisha Telegram-ka ugu jiraan iyo kuwa website-ka isku mid ay u arkaan shaqaalaha.
export const PERSONAS = {
  maskax: { name: 'Xamse', role: 'Isku-duwaha Guud' },
  intake: { name: 'Ikraan', role: 'Xiriirka & Fahamka Baahida' },
  sales: { name: 'Cabdiraxmaan', role: 'Maamulaha Iibka' },
  amni: { name: 'Nadiifo', role: 'Ilaaliyaha Amniga' },
  maaliyad: { name: 'Xasan', role: 'Maamulaha Maaliyadda' },
  siyaasad: { name: 'Faadumo', role: 'Xarunta Heshiisyada' },
  hawlgal: { name: 'Maxamed', role: 'Hubiyaha Tayada' },
  taageero: { name: 'Sagal', role: 'Taageeraha Macaamiisha' },
  caawin: { name: 'Yoonis', role: 'Kaaliyaha Guud' },
  suuq: { name: 'Deeqa', role: 'Maamulaha Suuq-geynta' },
}

// Salaanta bot-yada shaqaalaha gudaha (Farah oo kaliya) — ma khusayso macaamiisha, sidaas darteed lama darin
// /dalab iyo /adeegyada (kuwaas waa amarrada macaamiisha).
export const staffWelcome = (office) => {
  const p = PERSONAS[office]
  const who = p ? `${p.name}, ${p.role}` : 'shaqaale AI ah'
  return `Asc Farah! Waxaan ahay ${who}. Maxaan kuu qaban karaa maanta?`
}

export const personaWelcome = (office) => {
  const p = PERSONAS[office]
  const who = p ? `Waxaan ahay ${p.name}, ${p.role} ee FCS Technology.` : 'Waxaan ahay caawiyaha AI ee FCS Technology.'
  return [
    `Asc! ${who}`,
    "Waxaan kaa caawin karaa qiimaha, waqtiga, waxa ku jira adeegyada iyo dalabka. Qor su'aashaada, ama:",
    '',
    '/adeegyada — liiska adeegyada iyo qiimayaasha',
    '/dalab — dalab samee (waan ku hagayaa)',
    '/xiriir — xiriirka Farah',
  ].join('\n')
}
