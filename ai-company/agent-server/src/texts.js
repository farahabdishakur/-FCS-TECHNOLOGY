const T = {
  refuse: {
    so: 'Waan ka xumahay, arrintaas kuma caawin karo. Haddii aad rabto adeeg (website, logo, CV, nidaam), ii sheeg oo waan ku caawinayaa.',
    en: "Sorry, I can't help with that. If you need a service (website, logo, CV, business system), tell me and I'll help.",
    ar: 'عذرًا، لا أستطيع المساعدة في هذا الطلب. إن كنت تحتاج خدمة (موقع، شعار، سيرة ذاتية، نظام) فأخبرني.',
  },
  holding: {
    so: 'Waan hubinayaa oo waan ku soo laabanayaa. Farah ayaa fariintaada eegaya.',
    en: "I'll check this and get back to you. Farah is reviewing your message.",
    ar: 'سأتأكد من ذلك وأعود إليك. فرح يراجع رسالتك.',
  },
  escalate_complaint: {
    so: 'Waan ka xumahay dhibaatadaas. Farah ayaa si toos ah u eegaya oo wuu kula soo xiriiri doonaa dhawaan.',
    en: "I'm sorry about this. Farah will review it personally and get back to you soon.",
    ar: 'نعتذر عن ذلك. سيراجع فرح الأمر شخصيًا ويعود إليك قريبًا.',
  },
  escalate_discount: {
    so: 'Qiimaha liiska waan sheegi karnaa, laakiin dhimista Farah keliya ayaa go\'aamiya. Waan u gudbinayaa, wuuna ku soo laabanayaa.',
    en: 'We can share the list price, but only Farah can decide on any discount. I have passed your request to him and he will get back to you.',
    ar: 'يمكننا ذكر السعر المعلن، أما الخصومات فيقررها فرح وحده. لقد أحلت طلبك إليه وسيعود إليك.',
  },
  escalate_medical: {
    so: 'Nidaamyada caafimaadka (Hospital/Clinic) waxay u baahan yihiin Farah si toos ah. Fadlan xog bukaan halkan ha ku qorin; Farah ayaa kula soo xiriiri doona.',
    en: 'Health-related systems (Hospital/Clinic) need Farah directly. Please do not share patient data here; Farah will contact you.',
    ar: 'أنظمة الرعاية الصحية تحتاج إلى فرح مباشرة. من فضلك لا تشارك بيانات المرضى هنا؛ سيتواصل معك فرح.',
  },
  escalate_legal: {
    so: 'Arrimaha sharciga waxaa eegaya Farah keliya. Waan u gudbinayaa, wuuna kula soo xiriiri doonaa.',
    en: 'Legal matters are handled by Farah only. I have passed this on and he will contact you.',
    ar: 'المسائل القانونية يتولاها فرح وحده. لقد أحلتها إليه وسيتواصل معك.',
  },
  paymentAsk: {
    so: 'Mahadsanid. Si Farah u xaqiijiyo, fadlan noo dir: lambarka macaamilka (reference), magaca dirayaasha iyo qaddarka.',
    en: 'Thank you. So Farah can verify it, please send the transaction reference, the sender name and the amount.',
    ar: 'شكرًا. ليتحقق فرح، أرسل رقم العملية واسم المرسل والمبلغ.',
  },
  paymentChecking: {
    so: 'Waan helnay xogtaada. Farah ayaa ka eegaya akoonkiisa oo wuu ku soo laabanayaa. Lacagta weli lama xaqiijin.',
    en: 'We have your details. Farah is checking his account and will get back to you. The payment is not confirmed yet.',
    ar: 'استلمنا بياناتك. فرح يتحقق من حسابه وسيعود إليك. لم يتم تأكيد الدفعة بعد.',
  },
  paymentRejected: {
    so: 'Weli ma aan helin lacagta lagu sheegay. Fadlan hubi lambarka macaamilka oo noo soo dir mar kale.',
    en: "We haven't found the payment you mentioned yet. Please check the reference and send it again.",
    ar: 'لم نجد الدفعة المذكورة بعد. يرجى التحقق من رقم العملية وإرساله مرة أخرى.',
  },
  orderPending: {
    so: 'Mahadsanid! Dalabkaagu wuxuu u baahan yahay xaqiijin Farah. Wuu ku soo laabanayaa dhawaan.',
    en: 'Thank you! Your order needs Farah\'s confirmation. He will get back to you soon.',
    ar: 'شكرًا! طلبك يحتاج إلى تأكيد من فرح، وسيعود إليك قريبًا.',
  },
  followup: {
    so: 'Asc! Waxaan rabnay inaan hubinno haddii aad weli xiisaynayso mashruucaaga. Haddii aad su\'aal qabto, halkan ayaan joognaa.',
    en: "Hi! We wanted to check if you're still interested in your project. If you have any questions, we're here.",
    ar: 'مرحبًا! أردنا التأكد إن كنت لا تزال مهتمًا بمشروعك. إن كانت لديك أسئلة فنحن هنا.',
  },
  leadThanks: {
    so: 'Mahadsanid! Lambarkaaga ({phone}) waan helnay. Farah ayaa kuula soo xiriiri doona WhatsApp gudaha 24 saac.',
    en: 'Thank you! We have your number ({phone}). Farah will contact you on WhatsApp within 24 hours.',
    ar: 'شكرًا! استلمنا رقمك ({phone}). سيتواصل معك فرح عبر واتساب خلال 24 ساعة.',
  },
  degraded: {
    so: 'Mahadsanid fariintaada. Waan helnay, Farah ayaa dhawaan kugu soo jawaabi doona. Haddii ay degdeg tahay, WhatsApp: +252 63 713 3499.',
    en: 'Thanks for your message. We got it and Farah will reply soon. If it is urgent, WhatsApp: +252 63 713 3499.',
    ar: 'شكرًا على رسالتك. استلمناها وسيرد عليك فرح قريبًا. للأمور العاجلة واتساب: 3499 713 63 252+',
  },
}

export function tr(key, lang = 'so', args = {}) {
  const entry = T[key]
  const text = entry?.[lang] || entry?.en || entry?.so || ''
  return text.replace(/\{(\w+)\}/g, (_, k) => args[k] ?? '')
}

export function payInstructions({ deposit, total, monthly, details }, lang = 'so') {
  const monthlyLine = monthly ? { so: ` Bille: $${monthly}/bil.`, en: ` Monthly fee: $${monthly}/month.`, ar: ` الرسوم الشهرية: $${monthly}/شهر.` }[lang] || '' : ''
  const how = details
    ? details
    : { so: 'Farah ayaa kuu soo diri doona lambarka lacag-bixinta.', en: 'Farah will send you the payment number.', ar: 'سيرسل لك فرح رقم الدفع.' }[lang]
  return {
    so: `Mahadsanid! Adeegga qiimihiisu waa $${total}.${monthlyLine} Si aan u bilowno waxaan u baahanahay 50% horay ($${deposit}). Habka: EVC Plus, Hormuud ama Western Union. ${how} Marka aad bixiso, noo sheeg lambarka macaamilka.`,
    en: `Thank you! The service price is $${total}.${monthlyLine} To start, we need 50% upfront ($${deposit}). Methods: EVC Plus, Hormuud or Western Union. ${how} Once you pay, send us the transaction reference.`,
    ar: `شكرًا! سعر الخدمة $${total}.${monthlyLine} للبدء نحتاج إلى 50% مقدمًا ($${deposit}). الطرق: EVC Plus أو Hormuud أو Western Union. ${how} بعد الدفع أرسل لنا رقم العملية.`,
  }[lang]
}

export function paymentConfirmed(amount, lang = 'so') {
  return {
    so: `Farah wuxuu xaqiijiyay lacagtaada ($${amount}). Waan bilaabaynaa; heshiiska ayaan kuu soo diri doonaa.`,
    en: `Farah has confirmed your payment ($${amount}). We are starting; we will send you the agreement.`,
    ar: `أكد فرح دفعتك ($${amount}). سنبدأ العمل وسنرسل لك الاتفاقية.`,
  }[lang]
}

export function finalPayment(amount, lang = 'so') {
  return {
    so: `Shaqadaadu waa diyaar. Si aan kuu dhiibno, 50% dhammaadka ($${amount}) ayaa la bixinayaa. Marka aad bixiso noo sheeg lambarka macaamilka.`,
    en: `Your work is ready. To hand it over, the final 50% ($${amount}) is due. Once you pay, send us the transaction reference.`,
    ar: `عملك جاهز. للتسليم يجب دفع الـ50% المتبقية ($${amount}). بعد الدفع أرسل لنا رقم العملية.`,
  }[lang]
}

export function delivered(lang = 'so') {
  return {
    so: 'Mahadsanid! Lacagtaadii dhammaystiran waa la xaqiijiyay, faylasha Farah ayaa kuu soo dhiibaya. Toddobaad kadib ayaan ku soo laaban doonnaa.',
    en: 'Thank you! Your full payment is confirmed and Farah is handing over the files. We will check in with you in a week.',
    ar: 'شكرًا! تم تأكيد دفعتك كاملة وسيسلمك فرح الملفات. سنتواصل معك بعد أسبوع.',
  }[lang]
}
