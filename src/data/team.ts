// Xafiisyada AI-ga — isla magacyada (office key) ee backend-ka (agent-server/src/personas.js) si loo isticmaalo
// labada dhinac (chat routing iyo /team/:office bogagga). Ha bedelin office key-yada keligaa — waa isku xidhan.
export const avatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=7c3aed,4f46e5,a78bfa,06b6d4&radius=20`

export type TeamMember = {
  office: string
  name: string
  role: string
  dept: string
  blurb: string
  color: string
}

export const team: TeamMember[] = [
  {
    office: 'intake',
    name: 'Ikraan',
    role: 'Xiriirka & Fahamka Baahida',
    dept: 'INTAKE',
    blurb: "Waxay ku dhagaysataa baahidaada si xushmad leh, kadibna kuu weydiisaa isla su'aalaha muhiimka ah ilaa ay si sax ah u fahmato waxa aad rabto.",
    color: '#06B6D4',
  },
  {
    office: 'sales',
    name: 'Cabdiraxmaan',
    role: 'Maamulaha Iibka',
    dept: 'IIBINTA',
    blurb: 'Wuxuu kuu sheegaa qiimaha, waqtiga iyo adeegga kuugu habboon si degdeg ah — hal-abuur badan, mana kaa qariyo faahfaahin.',
    color: '#7C3AED',
  },
  {
    office: 'amni',
    name: 'Nadiifo',
    role: 'Ilaaliyaha Amniga',
    dept: 'AMNIGA',
    blurb: 'Wax kastoo dhinaca lacagta, heshiisyada iyo xogta macaamiisha ah, marka hore ayay hubisaa inay ammaan yihiin ka hor inta aan la gudbin.',
    color: '#EF4444',
  },
  {
    office: 'maaliyad',
    name: 'Xasan',
    role: 'Maamulaha Maaliyadda',
    dept: 'MAALIYADDA',
    blurb: 'Sax ah oo aan iska dayn — ma xaqiijiyo lacag ilaa uu isagu (iyo Farah) ka eego akoonka dhabta ah.',
    color: '#22C55E',
  },
  {
    office: 'siyaasad',
    name: 'Faadumo',
    role: 'Xarunta Heshiisyada',
    dept: 'SIYAASADDA',
    blurb: 'Waxay diyaarisaa heshiisyada iyo qoraallada sharciga ah, si labada dhinac -- adiga iyo macaamiilka -- xaqiijiyaan waxa la isugu heshiiyay.',
    color: '#F59E0B',
  },
  {
    office: 'hawlgal',
    name: 'Maxamed',
    role: 'Hubiyaha Tayada',
    dept: 'HAWLGALKA',
    blurb: 'Indho-yaqaan faahfaahinta ah — ka hor inta shaqadu aan gaarin macaamiisha, wuu hubiyaa in wax kastaa sax yahay.',
    color: '#A78BFA',
  },
  {
    office: 'taageero',
    name: 'Sagal',
    role: 'Taageeraha Macaamiisha',
    dept: 'TAAGEERADA',
    blurb: 'Naxariis iyo dulqaad badan — kaaga jirta xitaa marka mashruucu dhamaaday, haddii su’aal ama caqabad kale soo baxdo.',
    color: '#EC4899',
  },
  {
    office: 'caawin',
    name: 'Yoonis',
    role: 'Kaaliyaha Guud',
    dept: 'CAAWINTA',
    blurb: 'Wuxuu diyaariyaa qabyada shaqada (CV, qorshe ganacsi, warbixin) oo kuu xasuusiya wixii socda si aanad wax uga dhicin.',
    color: '#06B6D4',
  },
  {
    office: 'suuq',
    name: 'Deeqa',
    role: 'Maamulaha Suuq-geynta',
    dept: 'SUUQ-GEYNTA',
    blurb: 'Firfircoon oo hal-abuur badan — waxay diyaarisaa qoraallada bulshada iyo aragtiyaha suuqa ee toddobaad kasta.',
    color: '#F59E0B',
  },
  {
    office: 'maskax',
    name: 'Xamse',
    role: 'Isku-duwaha Guud',
    dept: 'MASKAXDA',
    blurb: 'Isagu ayaa shaqada u qaybiya xafiiska ku habboon marka aad wax na weydiiso — si aadan meel kasta isu weydiin.',
    color: '#4F46E5',
  },
]

export const teamByOffice = (office: string) => team.find((m) => m.office === office)
