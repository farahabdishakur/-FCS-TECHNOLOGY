# Hage Tallaabo-Tallaabo ah: FCS Tignoolaji oo AI ku shaqeeyo

Ujeedo: macaamiilku wuxuu la hadlaa shaqaalaha AI 24 saac, adiguna waxaad go'aan ka gaadhaa kaliya waxyaabaha muhiimka ah.
Kharash: bilow **$0**. Qiimaha qalabka way is beddelaa, marka ka hubi bogagga rasmiga ah.
Faylka macluumaadka: `FCS-AI-Company.md` (Maskaxda + prompts).

Calaamadee (✅) tallaabo kasta marka aad dhammayso.

---

## TALLAABO 1 — Hagaaji xogtaada (30 daqiiqo)
Fur `FCS-AI-Company.md` → Qaybta D. Go'aami:
- [ ] Goobta: Borama ama Muqdisho?
- [ ] Revision: 30 maalmood, mise sida adeeg kasta u qoran?
- [ ] Adeegyada: 30 (cinwaanka website-ka "20" beddel).
- [ ] Tirooyinka iyo testimonials: run miyaa?
- [ ] Domain rasmi ah (`.so` mise `surge.sh`).

*Sababta:* AI-gu wuxuu sheegayaa wax kasta oo aad qorto. Haddii xogtu khilaafsan tahay, isaguna wuu khilaafsanaan.

## TALLAABO 2 — Samee "CRM": Google Sheet (20 daqiiqo)
1. Fur Google Sheets → xaashi cusub → magac: **FCS CRM**.
2. Sarreeya ku qor 12 tiir:
   `id | magac | tel | luuqad | adeeg | xaalad | qiimo | 50%_horay | 50%_dhammaad | deadline | qoraal_AI | u_gudbi_Farah`
3. Xaaladaha ku qor: `cusub → iibin → sugaya-lacag → socda → tijaabo → dhiibay → taageero`.

Tani waa xusuusta wadaagga ah ee dhammaan shaqaalaha.

## TALLAABO 3 — Hel furaha AI-ga (bilaash) (10 daqiiqo)
1. Tag Google AI Studio → gal Gmail-kaaga → **Get API key**.
2. Koobiyee furaha (`API key`) meel ammaan ah. **Ha u dirin cidna, ha ku dhejin website-ka.**
3. Waxaa jira xad codsi maalinle ah oo bilaash ah; marka ay kordho, waad kordhin kartaa.

## TALLAABO 4 — Samee Telegram bot xiriirka adiga (10 daqiiqo)
1. Telegram: raadi **@BotFather** → `/newbot` → magac → hel `token`.
2. Bot-kan wuxuu kuu soo diri doonaa digniinaha (cabasho, dalab weyn, iwm).
3. Bilow bot-ka adigu (`/start`) si uu kuu aqoonsado.

## TALLAABO 5 — Rakib n8n (isku xidhka) (30–60 daqiiqo)
n8n waa qalabka isku xira agents-ka, CRM-ka iyo Telegram-ka. Waa bilaash haddii aad naftaada ka shaqaysiiso.
- **Tijaabo:** ku rakib kombiyuutarkaaga (Docker ama `npx n8n`). Waxay ka shaqaysaa kaliya marka PC-gu shidan yahay.
- **24 saac:** kadib u guuri server bilaash ah ama jaban (tusaale Oracle Cloud "Always Free"). Tallaabo 10 ayaa ka hadlaysa.

## TALLAABO 6 — Samee workflow-ga ugu horreeya (2–3 saacadood)
Diyaari shaqaalaha **saddex** ah marka hore (ma aha lix): **Maamule, Iibiye, Taageero**.

```
Fariin soo gasha (Telegram/website)
   ↓
[Maamulaha] → wuxuu go'aamiyaa: qiimo? dalab? cabasho?
   ↓
[Iibiye] ama [Taageero] → wuxuu ka jawaabaa Brain-ka
   ↓
Qoro natiijada CRM (Google Sheet)
   ↓
Haddii xaalad adag → Telegram → ADIGA
```
Tallaabooyinka gudaha n8n:
1. **Trigger:** Telegram Trigger (ama Webhook).
2. **AI Agent node #1 (Maamule):** ku dheji prompt B1 + B0 ee faylka.
3. **Switch node:** ku salaysan `u_gudbi`.
4. **AI Agent #2 (Iibiye)** = B2, **#3 (Taageero)** = B3.
5. **Google Sheets node:** akhri iyo qor CRM.
6. **Telegram node:** dir digniinta Farah.

## TALLAABO 7 — Ku shub Maskaxda (Brain) (30 daqiiqo)
Agent walba u sii `FCS-AI-Company.md` Qaybta A (xogta shirkadda). Waxaad ku dhejin kartaa:
- si toos ah gudaha prompt-ka (fudud, bilow), ama
- vector store (Supabase/Chroma) haddii xogtu weyn tahay.

## TALLAABO 8 — Tijaabi (Hal maalin, KA HOR macaamiisha)
Naftaada kuwan u dir 50 fariin:
- [ ] "Qiimaha website-ku waa immisa?" ($299)
- [ ] "Ii samee logo." ($49; 3 concept)
- [ ] Cafe leh: "Waxaan rabaa nidaam maqaaxi." (Cafe POS $100 + $25/bil)
- [ ] "Qiimo dhim." (waa in uu **diido** oo gudbiyo adiga)
- [ ] "Adeeg aan liiska ku jirin" (waa in uu yiraahdo "waan hubinayaa")
- [ ] Fariin Ingiriis, Carabi.
- [ ] Cabasho xanaaq leh (waa in laguu soo diro Telegram).
Haddii jawaabta khaldan tahay, hagaaji prompt-ka.

## TALLAABO 9 — Ku xidh kanaallada
Isla horumar: **1) Telegram bot** → **2) Website chat** (bog ku jira website-ka; waxaan ku dhisi karaa project-kan) → **3) WhatsApp** (way ka adag tahay, qiimo ama xaddidaad ayaa jirta).

## TALLAABO 10 — Ka dhig 24 saac
- Uga guur n8n server aan jabin marka PC-gu la xiro.
- Ku dar alert: haddii workflow-ku fashilmo, Telegram ayaa ku wargelinaya.
- Dhig xad codsi maalinle si aanad lacag u lumin.

## TALLAABO 11 — Telefoon (kadib)
Marka Telegram/website ay shaqeeyaan iyo macaamiil jiraan, kadib ku dar telefoon (Vapi/Retell/Twilio: credits tijaabo ah, kadibna lacag). Bilow lambar tijaabo.

## TALLAABO 12 — Dhaqan toddobaadle (30 daqiiqo)
- [ ] Akhri 20 wada-hadal.
- [ ] Hagaaji prompts-ka.
- [ ] Eeg CRM: xaaladaha la haray.
- [ ] Xisaabi dakhliga iyo kharashka.

---

## Xeerarka ammaanka (ha ilaawin)
1. AI-gu **ma go'aamiyo qiimo cusub, dhimis, ama lacag la helay**. Adigaa go'aamiya.
2. Furaha API-ga ha la wadaagin.
3. Hospital/Clinic system: xog caafimaad AI ha u dayn.
4. AI-gu wuxuu ku hadlaa "Waxaan ahay caawiyaha AI ee FCS" haddii la weydiiyo.

## Wakhtiga la qiyaasay
| Marxalad | Waqti |
|---|---|
| Tallaabo 1–4 | 1 maalin |
| Tallaabo 5–7 | 1–2 maalmood |
| Tallaabo 8–9 | 1–2 maalmood |
| Tallaabo 10–12 | 1 toddobaad |
| **Guud** | **~2 toddobaad** oo waqti-yar ah |
