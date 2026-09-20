# FCS Technology — AI Server

Wuxuu shaqeeyaa **key la'aan**. Macaamiilku wuxuu chat-ka website-ka weydiin karaa qiimaha, waqtiga, waxa ku jira adeegga, lacag-bixinta, dalabka; haddii AI-gu ogayn waayo, wuxuu Farah la wargelinayaa, Farah-na isaga ayuu baraya.

## Bilow (Windows)
| Fayl (folder-ka ugu weyn) | Waxa uu qabto |
|---|---|
| `start-ai.cmd` | Wuxuu shidaa website-ka (`:8443`) iyo AI-ga (`:8787`) |
| `train-ai.cmd` | **Tababaraha**: su'aal waydii, sax jawaabta |
| `setup-ai.cmd` | Wuxuu ku weydiiyaa Telegram tokens, key, lambarka lacag-bixinta |

Kombuyuutarku waa inuu shidnaa marka macaamiil weydiinayo. Online 24 saac: eeg "Geynta".

## Sida AI-gu u jawaabo (ugu horreysa ilaa ugu dambeysa)
1. **Amniga** (koodh): isku-day injection, dhimis, cabasho, sharci, hospital/clinic → toos Farah.
2. **Lacag la sheegay** → Farah ayaa xaqiijiya (`OK #id`); AI-gu weligiis ma yiraahdo "lacagta waa timid".
3. **Hagaha dalabka** (`guided.js`): haddii qofku dalbanayo ama ogayn waayo sida loo dalbado, AI-gu wuxuu ku hagayaa tallaabo-tallaabo: adeegga → ujeedada → faahfaahinta → waqtiga → magaca → lambarka → soo koob → "haa" → dalab la diiwaangeliyay (habka 50% lacag-bixinta). Dhexda su'aal la weydiin karaa (waa la jawaabayaa, kadibna su'aashii dib ayaa loo celiyaa); "jooji" ama "beddel adeegga" waa shaqeeyaan.
4. **Lambar telefoon** oo si kale loo qoray → lead ayaa la kaydiyaa, Farah ayaa la wargelinayaa.
5. **Aasaaska aqoonta** (`knowledge.js`): wixii Farah baray → 24 su'aal oo hore loo diyaariyay → **su'aalaha gaarka ah ee adeeg kasta** ee website-ka (`services-detail.json`) → qiimo/waqti/waxa ku jira ee 30-ka adeeg (si toos ah looga qaado Brain-ka, sidaa darteed qiimuhu had iyo jeer waa sax) → lacag, xiriir, portfolio, hosting, luuqad. **Jawaab kasta oo adeeg ah waxay leedahay linkiga bogga adeegga** (halkaas ayaa laga dalban karaa).
6. **Qoraal khaldan**: "qimaha logoo", "webiste", "dukan", "kafe" → AI-gu wuu sixayaa (xarfaha, xasuusinta erayada muhiimka ah); haddii aan hubin, wuxuu yiraahdaa *"Waxaan u malaynayaa inaad ula jeedo: «…»"* oo jawaabta ayuu bixiyaa.
7. **LLM (ikhtiyaari)**: haddii Gemini key la dejiyo, wuxuu qaabilaa wada-hadallada adag. Ma aha lagama maarmaan.
8. Haddii dhammaan waxay ogayn waayaan → *"Farah ayaa kuu soo jawaabi doona"*, Telegram ayaa lagu wargelinayaa `#u12`, adiguna `/answer 12 jawaab` ayaad ku jawaabaysaa; jawaabta macaamiilka ayaa loo diraa **AI-gu wuu barayaa**.

Bartilmaameedka **80%** waxaa lagu arkaa `/report` (Si toos ah loo jawaabay: X%).

**Linkiyada:** `SITE_URL` (`.env`) waa cinwaanka website-ka (`https://fcs-tignoolaji.surge.sh`). Bogagga adeegyada (`/services/logo-design`) waxay ku shaqeeyaan live-ka kadib marka aad dib u dhisto (`npm run build`, wuxuu sameeyaa `200.html`) oo aad dib u geyso surge. Marka services.ts wax laga beddelo: `node scripts/gen-knowledge.js`.

## Sida aad u barto AI-ga
**A) Terminal (Telegram la'aan):** `train-ai.cmd`
```
Su'aal > maxaad bixin kartaa
🤖 [general] Waxaan bixinnaa 30 adeeg: ...
Sax miyaa? (Enter = haa, n = maya) > n
Jawaabta saxda ah > ...
```
**B) Telegram (bot-ka shaqaalaha):** qor su'aal caadi ah → arag sida AI-gu u jawaabo → `/teach su'aal => jawaabta saxda ah`. Amarro kale: `/unanswered`, `/answer <id> jawaab`, `/faq`, `/forget <id>`.

Wax kasta oo la baray waxay gashaan `data/knowledge.json`; server-ku isla markiiba wuu isticmaalaa (dib u bilaabis ma u baahna).

`npm run eval` wuxuu tijaabiyaa 78 su'aal oo la diyaariyay (oo ay ku jiraan qoraal khaldan). **Ogow:** su'aalahaas anigu ayaa qoray, sidaa darteed 100%-kiisu macnaheedu ma aha inuu macaamiisha dhabta ah u jawaabi doono 100%. Tirada dhabta ah waxaad ka arkaysaa `/report` kadib macaamiil dhab ah.

## Saddex bot oo Telegram
1. **Bot-ka Shaqaalaha** (`TELEGRAM_BOT_TOKEN`): digniinaha (lead, dalab, lacag, cabasho), `OK #id`, `/reply`, `/teach`, `/report`, `/crm`, `/stop`.
2. **Bot-ka Fikradaha** (`IDEAS_BOT_TOKEN`): fikrad kasta qor → waa la kaydiyaa + adeegyada FCS ee la xiriira; `/plan <id>`, `/promote <id>` (mashruuc), `/ideas`, `/projects`, `/note`, `/done`, `/del`.
3. **Bot-ka Dadka/macaamiisha** (`PUBLIC_BOT_TOKEN`): qof kasta wuu la hadli karaa AI-ga Telegram-ka (isla maskaxdii website chat-ka): su'aalo, `/adeegyada`, `/dalab` (hagaha dalabka), `/xiriir`. Jawaabaha aad adigu u dirto (`/reply`, `/answer`, `OK #id`) macaamiilka Telegram-ka ayaa loo sii dirayaa.

Bot-ka 1 iyo 2 waxay dhegaystaan **adiga keliya** (`OWNER_CHAT_ID`); bot-ka 3 waa u furan yahay dadka (fariimaha shakhsiga ah oo keliya, ma aha groups).

**Habeynta:** @BotFather → `/newbot` (saddex jeer) → `setup-ai.cmd` → dhig saddexda token; script-ku chat id-gaaga ayuu helayaa.

## Amniga
- Qiime kasta oo jawaabta ku jira waa in uu ku jiraa Brain-ka; haddii kale waa la hakiyaa.
- Dalab > $300 → habka lacag-bixinta lama diro ilaa aad ogolaato.
- `/stop` wuxuu xidhaa dhammaan agents-ka.
- Xad fariimo: 20 / 10 daqiiqo qof kasta; `LLM_DAILY_LIMIT` LLM-ka.

## Geynta 24 saac
Server-ku wuxuu u baahan yahay disk joogto ah (`DATA_DIR`). `Dockerfile` waa diyaar (Fly.io/Railway volume, ama Oracle Free VM + `pm2`). Render free ha isticmaalin (disk-gu waa ku-meel-gaar). Kadib website-ka ku dhis `VITE_AGENT_API=https://server-kaaga` oo `ALLOWED_ORIGINS` ku dar domain-ka.

## Waxa aan weli la tijaabin
- **Telegram dhab ah** (labada bot): koodhka waa qoran yahay, chat-id detection waa la tijaabiyay (fake fetch); bot dhab ah lama tijaabin.
- **Gemini dhab ah**: adapter-ka request-kiisa waa la tijaabiyay (fake fetch); tayada jawaabaha dhabta ah ma aha.
- **Bot-ka dadka**: koodhka iyo isku xidhka fariimaha waa la tijaabiyay (fake bot); bot dhab ah lama tijaabin.
- **WhatsApp, Google Sheets toos ah, telefoon (wicitaan codka)**: weli ma jiraan.
