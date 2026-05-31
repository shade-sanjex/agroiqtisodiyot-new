# Requirements Document

## Introduction

Ushbu hujjat ISCAD "Agroiqtisodiyot" ilmiy-amaliy jurnali saytining **to'liq, jasur (bold) vizual redizaynini** belgilaydi. Loyiha egasi to'liq ijodiy erkinlik berdi: yangi dizayn yo'nalishi avvalgisidan tubdan (180 gradusgacha) farq qilishi mumkin, asosiy maqsad — tashrif buyuruvchida "wow" taassurotini uyg'otadigan, zamonaviy va professional vizual identifikatsiya yaratish. Aniq rang, shrift va kompozitsiya tanlovlari implementatsiya bosqichiga ochiq qoldiriladi; biroq tanlangan yechim tizimli, izchil va barcha sahifalarda yagona bo'lishi shart.

ENG MUHIM CHEKLOV: redizayn faqat **taqdimot (presentation) qatlamini** o'zgartiradi. Saytning barcha mavjud funksionalligi va foydalanuvchi oqimlari (flows) o'zgarishsiz, regressiyasiz ishlashi shart. Bunga Supabase autentifikatsiyasi (kirish/ro'yxatdan o'tish/Google/parol tiklash), jurnal CRUD amallari (yuklash/tahrirlash/o'chirish, Telegram CDN orqali fayl yuklash), AI maqola tekshirish (Gemini API + lokal zaxira tahlil, fayl ekstraksiyasi docx/pdf/txt), kontakt formasi, tahrir hay'ati boshqaruvi, Telegram Web App, pagination, qidiruv, boshlang'ich yuklash ekrani (LoadingScreen) va blurhash asosidagi rasm yuklash kiradi.

Sayt React 18, Vite, TypeScript, Tailwind CSS va shadcn/ui (Radix) texnologiyalarida qurilgan; react-router-dom v6 marshrutlash, Supabase autentifikatsiya/ma'lumotlar bazasi, TanStack Query so'rovlar boshqaruvi, Telegram CDN fayl saqlash va Gemini API AI tekshirish uchun ishlatiladi. Bu texnologiya to'plami o'zgarmaydi. Sayt o'zbek tilida ishlaydi.

## Glossary

- **Sayt**: ISCAD "Agroiqtisodiyot" jurnalining React asosidagi veb-ilovasi (barcha sahifalar va umumiy komponentlar).
- **Dizayn_Tili**: Redizaynda yaratiladigan yagona vizual identifikatsiya — rang palitrasi (design token'lar), tipografika tizimi (shrift oilalari, o'lcham va og'irlik shkalasi), bo'shliq (spacing) shkalasi, burchak radiusi, soya (elevation) va sirt (surface) uslublari hamda micro-interaction qoidalari majmuasi.
- **Komponent_Tizimi**: Dizayn_Tilini amalga oshiruvchi qayta ishlatiladigan UI komponentlari va Tailwind/shadcn token'lari to'plami (masalan, button, card, badge, input variantlari, hero blok, bo'lim (section) sarlavhalari).
- **Sahifa**: Saytdagi alohida marshrutga (route) mos keluvchi ekran. To'liq ro'yxat: Bosh_Sahifa (`/`), About_Sahifasi (`/about`), Tahrir_Hayati_Sahifasi (`/editorial-board`), Jurnallar_Sahifasi (`/journals`), Talablar_Sahifasi (`/requirements`), Kontakt_Sahifasi (`/contact`), Auth_Sahifasi (`/auth`), Admin_Panel (`/admin`), Maqola_Tekshiruvchi_Sahifasi (`/article-checker`), Telegram_Ilova_Sahifasi (`/tg-app`), NotFound_Sahifasi (`*`).
- **Bosh_Sahifa**: `/` yo'lidagi asosiy kirish sahifasi (`src/pages/Index.tsx`).
- **About_Sahifasi**: `/about` yo'lidagi markaz va jurnal haqidagi sahifa (`src/pages/About.tsx`).
- **Tahrir_Hayati_Sahifasi**: `/editorial-board` yo'lidagi tahrir hay'ati a'zolarini ko'rsatuvchi sahifa (`src/pages/EditorialBoard.tsx`).
- **Jurnallar_Sahifasi**: `/journals` yo'lidagi, nashr etilgan jurnallar ro'yxatini ko'rsatuvchi sahifa (`src/pages/Journals.tsx`).
- **Talablar_Sahifasi**: `/requirements` yo'lidagi, maqola talablarini ko'rsatuvchi sahifa (`src/pages/Requirements.tsx`).
- **Kontakt_Sahifasi**: `/contact` yo'lidagi, kontakt formasi va aloqa ma'lumotlari sahifasi (`src/pages/Contact.tsx`).
- **Auth_Sahifasi**: `/auth` yo'lidagi kirish/ro'yxatdan o'tish/parol tiklash sahifasi (`src/pages/Auth.tsx`).
- **Admin_Panel**: `/admin` yo'lidagi, jurnallar, xabarlar va tahrir hay'atini boshqarish sahifasi (`src/pages/Admin.tsx`).
- **Maqola_Tekshiruvchi_Sahifasi**: `/article-checker` yo'lidagi AI maqola tekshirish sahifasi (`src/pages/ArticleChecker.tsx`).
- **Telegram_Ilova_Sahifasi**: `/tg-app` yo'lidagi Telegram Web App ko'rinishi (`src/pages/TelegramApp.tsx`).
- **NotFound_Sahifasi**: mavjud bo'lmagan marshrutlar uchun 404 sahifasi (`src/pages/NotFound.tsx`).
- **Navbar**: Saytning yuqorisida joylashgan, qatlamlanadigan (collapse bo'ladigan) navigatsiya paneli (`src/components/Navbar.tsx`).
- **Footer**: Saytning pastki qismidagi umumiy sarlavha osti bloki (`src/components/Footer.tsx`).
- **Sticky_Qidiruv_Paneli**: Jurnallar_Sahifasidagi, scroll paytida ekran yuqorisiga yopishib qoladigan qidiruv bloki.
- **Spacer**: Navbar fixed bo'lgani uchun kontentni pastga suruvchi bo'sh balandlik elementi.
- **AnimatedCounter**: Raqamlarni noldan belgilangan qiymatgacha animatsiya bilan ko'rsatuvchi komponent (`src/components/AnimatedCounter.tsx`).
- **Statistik_Bloklar**: Saytdagi son ko'rsatkichlarini (masalan, maqolalar soni, ekspertlar soni) ko'rsatadigan elementlar.
- **Mock_Jurnal**: Haqiqiy bo'lmagan, namoyish yoki test uchun dasturda generatsiya qilingan soxta jurnal yozuvi.
- **Bosh_Holat**: Ma'lumot mavjud bo'lmaganda ko'rsatiladigan ma'noli bo'sh holat (empty state) bloki.
- **Skeleton_Yuklash**: Ma'lumot yuklanayotganda ko'rsatiladigan shimmer/placeholder yuklash ko'rsatkichi.
- **Mavjud_Funksionallik**: Redizaynga qadar mavjud bo'lgan barcha xulq-atvor va foydalanuvchi oqimlari (autentifikatsiya, jurnal CRUD, AI tekshirish, kontakt formasi, tahrir hay'ati boshqaruvi, Telegram ilova, pagination, qidiruv, yuklash ekrani, blurhash rasm yuklash).
- **Tizim_Rejimi**: Foydalanuvchining operatsion tizimida tanlangan dark yoki light ko'rinish sozlamasi (`prefers-color-scheme`).
- **Mavzu_Ta'minlovchi**: light va dark rejimni boshqaruvchi `next-themes` komponenti (`src/App.tsx`).
- **Reduced_Motion**: Foydalanuvchining "harakatni kamaytirish" tizim sozlamasi (`prefers-reduced-motion: reduce`).
- **Interaktiv_Element**: Bosish yoki tanlash orqali harakat bajaradigan, lekin tabiiy `<button>` yoki `<a>` bo'lmagan element (masalan, `onClick` biriktirilgan `<div>`).
- **WCAG**: Veb-kontentga foydalanish qulayligi bo'yicha xalqaro ko'rsatma (Web Content Accessibility Guidelines) 2.1, AA darajasi.
- **Gemini_API**: Maqola_Tekshiruvchi_Sahifasi ishlatadigan Google AI tekshirish xizmati.

## Requirements

### Requirement 1: Yangi yagona Dizayn_Tili (vizual identifikatsiya)

**User Story:** Loyiha egasi sifatida men saytning butunlay yangi, jasur va zamonaviy vizual identifikatsiyaga ega bo'lishini xohlayman, shunda tashrif buyuruvchilarda kuchli ijobiy ("wow") taassurot uyg'onadi.

#### Acceptance Criteria

1. THE Sayt SHALL yagona Dizayn_Tilini belgilovchi rang palitrasini, tipografika shkalasini, bo'shliq (spacing) shkalasini, burchak radiusi va sirt (surface)/soya uslublarini markazlashgan design token'lar sifatida (Tailwind konfiguratsiyasi va/yoki CSS o'zgaruvchilari) ta'riflashi kerak.
2. THE Dizayn_Tili SHALL avvalgi dizayndan ajralib turadigan, qayta ixtiro qilingan vizual yo'nalishni ifodalashi kerak (rang palitrasi, tipografika yoki kompozitsiya tamoyillaridan kamida bittasi tubdan yangilanishi kerak).
3. THE Sayt SHALL rang qiymatlarini, shrift o'lchamlarini va bo'shliq qiymatlarini bevosita (hardcoded inline) takrorlash o'rniga belgilangan design token'lar orqali qo'llashi kerak.
4. THE Sayt SHALL barcha Sahifalarda Dizayn_Tilini izchil qo'llashi va sahifalararo qarama-qarshi (bir-biriga mos kelmaydigan) vizual uslublarni qoldirmasligi kerak.
5. THE Dizayn_Tili SHALL barcha Sahifalar yangi Dizayn_Tiliga o'tkazilgandan keyingina to'liq (yakunlangan) hisoblanishi kerak; qisman o'tkazilgan holat to'liq hisoblanmaydi.
6. THE Dizayn_Tili SHALL light va dark rejimlarning ikkalasi uchun ham to'liq token to'plamini belgilashi kerak.

### Requirement 2: Qayta ishlatiladigan Komponent_Tizimi

**User Story:** Dasturchi sifatida men yangi dizaynni qayta ishlatiladigan komponentlar orqali qurishni xohlayman, shunda barcha sahifalar izchil bo'ladi va kelajakda saqlash osonlashadi.

#### Acceptance Criteria

1. THE Komponent_Tizimi SHALL Dizayn_Tilini amalga oshiruvchi qayta ishlatiladigan UI komponentlarini (kamida tugma, karta, badge/teg, input, bo'lim sarlavhasi va hero blok uslublari) taqdim etishi kerak.
2. THE Sayt SHALL takrorlanuvchi vizual naqshlar uchun bir xil ko'rinishni qo'lda nusxalash o'rniga Komponent_Tizimi elementlaridan foydalanishi kerak.
3. WHERE Komponent_Tizimi kerakli komponent turini taqdim etmasa, THE Sayt SHALL bunday komponentni istisno tariqasida qo'lda amalga oshirishi mumkin.
3. THE Komponent_Tizimi SHALL mavjud shadcn/ui (Radix) komponentlari ustiga qurilishi va ularning xulq-atvori hamda foydalanish qulayligi xususiyatlarini saqlashi kerak.
4. WHERE komponentning bir nechta vizual ko'rinishi (variant) talab qilinsa, THE Komponent_Tizimi SHALL variantlarni token asosidagi uslublar orqali ta'riflashi kerak.

### Requirement 3: Har bir Sahifani professional qayta dizayn qilish

**User Story:** Tashrif buyuruvchi sifatida men har bir sahifa o'ziga xos, professional va chiroyli kompozitsiyaga ega bo'lishini xohlayman, shunda sayt bo'ylab harakatlanish yoqimli va ishonchli tuyuladi.

#### Acceptance Criteria

1. THE Bosh_Sahifa SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani (hero, mazmun bo'limlari va Statistik_Bloklar) ko'rsatishi kerak.
2. THE About_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani ko'rsatishi kerak.
3. THE Tahrir_Hayati_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani ko'rsatishi kerak.
4. THE Jurnallar_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani (jurnal kartalari, qidiruv va pagination) ko'rsatishi kerak.
5. THE Talablar_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani ko'rsatishi kerak.
6. THE Kontakt_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani (kontakt formasi va aloqa ma'lumotlari) ko'rsatishi kerak.
7. THE Auth_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani (kirish, ro'yxatdan o'tish va parol tiklash) ko'rsatishi kerak.
8. THE Admin_Panel SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani ko'rsatishi va saytning qolgan qismi bilan bir xil professional ko'rinishga ega bo'lishi kerak.
9. THE Maqola_Tekshiruvchi_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani (matn/fayl kiritish paneli va natija paneli) ko'rsatishi kerak.
10. THE Telegram_Ilova_Sahifasi SHALL yangi Dizayn_Tiliga mos, Telegram Web App muhitiga moslashtirilgan kompozitsiyani ko'rsatishi kerak.
11. THE NotFound_Sahifasi SHALL yangi Dizayn_Tilida qayta ishlangan kompozitsiyani va Bosh_Sahifaga qaytish havolasini ko'rsatishi kerak.
12. THE Navbar va Footer SHALL yangi Dizayn_Tilida qayta ishlanishi va barcha Sahifalarda izchil ko'rinishi kerak.

### Requirement 4: Mavjud_Funksionallikni to'liq saqlash (regressiyasiz)

**User Story:** Loyiha egasi sifatida men dizayn o'zgargani bilan saytning hech qaysi funksiyasi buzilmasligini xohlayman, shunda foydalanuvchilar avvalgi barcha imkoniyatlardan to'siqsiz foydalanaveradi. Bu eng muhim acceptance mezoni.

#### Acceptance Criteria

1. WHEN tashrif buyuruvchi Auth_Sahifasida kirish, ro'yxatdan o'tish, Google orqali kirish yoki parol tiklash amallarini bajarsa, THE Sayt SHALL redizayndan oldingi bilan bir xil natijani (Supabase autentifikatsiya chaqiruvlari va yo'naltirishlar) ta'minlashi kerak.
2. WHEN Administrator Admin_Panelda jurnal yuklasa, tahrirlasa yoki o'chirsa, THE Sayt SHALL faylni Telegram CDN orqali yuklash va Supabase yozuvini yangilashni redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
3. WHEN foydalanuvchi Maqola_Tekshiruvchi_Sahifasida matn yoki fayl yuborsa, THE Sayt SHALL maqolani Gemini_API orqali tekshirishi va Gemini_API mavjud bo'lmaganda lokal zaxira tahlilga o'tishi (fallback) redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
4. WHEN foydalanuvchi Maqola_Tekshiruvchi_Sahifasiga `.docx`, `.pdf` yoki `.txt` fayl yuklasa, THE Sayt SHALL fayldan matn ekstraksiyasini redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
5. WHEN tashrif buyuruvchi Kontakt_Sahifasidagi formani yuborsa, THE Sayt SHALL xabarni redizayndan oldingi bilan bir xil tarzda saqlashi va tasdiq holatini ko'rsatishi kerak.
6. WHEN Administrator tahrir hay'ati a'zolarini boshqarsa, THE Sayt SHALL qo'shish, tahrirlash va o'chirish amallarini redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
7. WHEN foydalanuvchi Telegram_Ilova_Sahifasini Telegram muhitida ochsa, THE Sayt SHALL Telegram Web App initsializatsiyasini va jurnal yuklashni redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
8. THE Jurnallar_Sahifasi SHALL qidiruv va pagination xatti-harakatlarini redizayndan oldingi bilan bir xil tarzda saqlashi kerak.
9. WHEN Sayt birinchi marta sessiyada yuklansa, THE Sayt SHALL LoadingScreen orqali resurslarni oldindan yuklashni (preloading) redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
10. WHEN jurnal muqovasi ko'rsatilsa, THE Sayt SHALL blurhash placeholder'dan haqiqiy rasmga o'tishni redizayndan oldingi bilan bir xil tarzda bajarishi kerak.
11. THE Sayt SHALL barcha mavjud marshrutlarni (`/`, `/about`, `/editorial-board`, `/journals`, `/requirements`, `/contact`, `/auth`, `/admin`, `/article-checker`, `/tg-app` va 404) redizayndan keyin ham o'zgarishsiz saqlashi kerak.
12. THE Sayt SHALL ProtectedRoute orqali himoyalangan sahifalarga kirishni cheklash xatti-harakatini redizayndan oldingi bilan bir xil tarzda saqlashi kerak.

### Requirement 5: Responsivlik (mobil, planshet, desktop)

**User Story:** Tashrif buyuruvchi sifatida men saytni istalgan qurilmada qulay ko'rishni xohlayman, shunda mobil, planshet va desktopda bir xil sifatli tajriba olaman.

#### Acceptance Criteria

1. THE Sayt SHALL barcha Sahifalarni mobil (kichik), planshet (o'rta) va desktop (katta) ekran kengliklarida gorizontal scroll yoki kontent kesilishisiz ko'rsatishi kerak.
2. THE Navbar SHALL fixed navbar balandligi bilan mos keladigan Spacer balandligini ta'minlashi va natijada sahifa kontenti navbar bilan ustma-ust tushmagan holda navbar ostida boshlanishini kafolatlashi kerak.
3. WHILE tashrif buyuruvchi Jurnallar_Sahifasini scroll qilmoqda, THE Sticky_Qidiruv_Paneli SHALL Navbar ostiga, ular orasida ko'rinadigan bo'shliq yoki ustma-ust tushish bo'lmagan holda yopishishi kerak.
4. THE Sticky_Qidiruv_Paneli SHALL mobil ko'rinishda Navbar'ning mobil balandligiga mos keladigan yuqori siljish (top offset) qiymatidan foydalanishi kerak.
5. THE Sticky_Qidiruv_Paneli SHALL desktop ko'rinishida Navbar'ning desktop balandligiga mos keladigan yuqori siljish (top offset) qiymatidan foydalanishi kerak.
6. THE Navbar SHALL mobil ko'rinishda navigatsiya havolalarini ochiladigan (collapsible) menyu orqali taqdim etishi kerak.

### Requirement 6: Light va dark rejimni yangi dizaynda to'liq qo'llab-quvvatlash

**User Story:** Tashrif buyuruvchi sifatida men sayt mening tizim dark yoki light sozlamamga moslashishini va tanlovimni eslab qolishini xohlayman, shunda sayt birinchi ochilishidanoq ko'zimga qulay ko'rinadi.

#### Acceptance Criteria

1. THE Sayt SHALL barcha Sahifalarni light rejimda ham, dark rejimda ham yangi Dizayn_Tilida to'liq o'qiladigan va izchil ko'rsatishi kerak.
2. WHEN tashrif buyuruvchi saytni birinchi marta ochsa va hech qanday mavzu tanlamagan bo'lsa, THE Mavzu_Ta'minlovchi SHALL Tizim_Rejimiga mos rejimni (dark yoki light) qo'llashi kerak.
3. WHEN tashrif buyuruvchi mavzuni qo'lda tanlasa, THE Mavzu_Ta'minlovchi SHALL tashrif buyuruvchining tanlovini Tizim_Rejimidan ustun qo'yishi va o'zgarishni sahifa yangilanishisiz darhol qo'llashi kerak.
4. THE Mavzu_Ta'minlovchi SHALL tashrif buyuruvchining qo'lda tanlagan mavzusini keyingi tashriflarda ham saqlab qolishi kerak.
5. IF qo'lda tanlangan mavzuni texnik sabablarga ko'ra qo'llab bo'lmasa, THEN THE Mavzu_Ta'minlovchi SHALL Tizim_Rejimiga qaytishi kerak.

### Requirement 7: Foydalanish qulayligi — o'qish va kontrast

**User Story:** Ko'rish qobiliyati cheklangan tashrif buyuruvchi sifatida men matnlarni qiynalmasdan o'qiy olishni xohlayman, shunda saytdan barcha foydalanuvchilar foydalana oladi.

#### Acceptance Criteria

1. THE Sayt SHALL barcha mazmunli matn elementlari uchun kamida 12px (text-xs) o'lchamidagi shriftdan foydalanishi kerak.
2. THE Sayt SHALL matn va uning fon rangi o'rtasidagi rang kontrastini WCAG 2.1 AA darajasidagi normal matn uchun belgilangan kamida 4.5:1 nisbatda ta'minlashi kerak.
3. WHERE element sof bezak (dekorativ) maqsadda ishlatilsa va hech qanday mazmunli ma'lumot bermasa, THE Sayt SHALL bunday elementni 12px va 4.5:1 chegaralaridan ozod tutishi mumkin.
4. THE Sayt SHALL barcha mazmunli rasmlar uchun ma'noli `alt` matnini va bezakli rasmlar uchun bo'sh `alt` qiymatini taqdim etishi kerak.
5. WHERE rasm na sof mazmunli, na sof bezakli (masalan, UI elementi yoki ikona) bo'lsa, THE Sayt SHALL uni mazmunli rasm sifatida hisoblab, ma'noli `alt` matnini taqdim etishi kerak.

### Requirement 8: Foydalanish qulayligi — klaviatura va fokus

**User Story:** Klaviatura orqali harakatlanadigan tashrif buyuruvchi sifatida men barcha interaktiv elementlarni klaviatura bilan boshqara olishni xohlayman, shunda sichqonchasiz ham saytdan to'liq foydalanaman.

#### Acceptance Criteria

1. THE Sayt SHALL har bir Interaktiv_Element uchun klaviatura fokusini qabul qilish imkonini (tabindex) ta'minlashi kerak.
2. WHEN tashrif buyuruvchi fokuslangan Interaktiv_Element ustida Enter yoki Space tugmasini bossa, THE Sayt SHALL bosish (click) bilan bir xil harakatni bajarishi kerak.
3. THE Sayt SHALL har bir Interaktiv_Element uchun uning vazifasini ifodalovchi ARIA role yoki ma'noli matnli yorliq (label) taqdim etishi kerak.
4. WHEN Interaktiv_Element klaviatura fokusiga ega bo'lsa, THE Sayt SHALL ko'rinadigan fokus ko'rsatkichini (focus indicator) ko'rsatishi kerak.

### Requirement 9: Animatsiya va micro-interaction tizimi

**User Story:** Tashrif buyuruvchi sifatida men maqsadli va silliq animatsiyalarni xohlayman, lekin harakatga sezgir bo'lganimda ularni kamaytirishni xohlayman, shunda sayt jonli, ammo bosh aylantirmaydigan bo'ladi.

#### Acceptance Criteria

1. THE Sayt SHALL animatsiyalar va micro-interaction'larni Dizayn_Tili qoidalariga muvofiq, maqsadli va izchil tarzda qo'llashi kerak.
2. WHILE Reduced_Motion sozlamasi yoqilgan, THE Sayt SHALL doimiy takrorlanuvchi va diqqatni chalg'ituvchi animatsiyalarni o'chirishi yoki minimal darajaga tushirishi kerak.
3. WHILE Reduced_Motion sozlamasi yoqilgan, THE Sayt SHALL barcha mazmunni animatsiyalarsiz to'liq va o'qiladigan holatda ko'rsatishi kerak. WHERE vizual qaytarish nozik va chalg'itmaydigan bo'lsa (masalan, yengil ajratish (highlight) yoki yumshoq o'tish), THE Sayt SHALL bunday qaytarishni saqlashi mumkin.
4. WHERE Reduced_Motion sozlamasi yoqilmagan, THE Sayt SHALL animatsiyalarni odatdagidek ko'rsatishi kerak.
5. WHEN Statistik_Bloklar ko'rinish maydoniga (viewport) kirsa, THE Sayt SHALL son qiymatlarini AnimatedCounter komponenti orqali izchil animatsiya bilan ko'rsatishi va animatsiya tugagach yakuniy qiymatni to'liq ko'rsatishi kerak.

### Requirement 10: Performans

**User Story:** Tashrif buyuruvchi sifatida men saytning tez yuklanishini va silliq scroll bo'lishini xohlayman, shunda yangi dizayn tajribani sekinlashtirmaydi.

#### Acceptance Criteria

1. THE Sayt SHALL yangi dizayn vizual effektlarini scroll silliqligini sezilarli pasaytirmaydigan tarzda amalga oshirishi kerak.
2. THE Sayt SHALL og'ir vizual effektlarni (masalan, parallax, blur, particle) Reduced_Motion yoqilganda kamaytirishi yoki o'chirishi kerak.
3. THE Sayt SHALL rasmlarni mavjud preloading va blurhash mexanizmlari orqali ko'rsatishni davom ettirishi va ortiqcha bloklovchi tarmoq so'rovlarini qo'shmasligi kerak.

### Requirement 11: Mock ma'lumotlarni olib tashlash, Bosh_Holat va Skeleton_Yuklash

**User Story:** Tashrif buyuruvchi sifatida men faqat haqiqiy ma'lumotlarni ko'rishni va yuklanish hamda bo'sh holatlar toza ko'rinishini xohlayman, shunda soxta ma'lumotlar meni chalg'itmaydi.

#### Acceptance Criteria

1. THE Jurnallar_Sahifasi SHALL faqat Supabase ma'lumotlar bazasidan kelgan haqiqiy jurnallarni ko'rsatishi va Mock_Jurnal yozuvlarini generatsiya qilmasligi kerak.
2. IF Supabase'dan hech qanday jurnal qaytmasa, THEN THE Jurnallar_Sahifasi SHALL "Hozircha jurnallar mavjud emas" mazmunidagi Bosh_Holat blokini yangi Dizayn_Tilida ko'rsatishi kerak.
3. WHILE jurnallar Supabase'dan yuklanmoqda, THE Jurnallar_Sahifasi SHALL yuklash tugaguniga qadar Skeleton_Yuklash ko'rsatkichlarini yangi Dizayn_Tilida ko'rsatishi kerak.
4. IF jurnallarni yuklash davomida xatolik yuz bersa, THEN THE Jurnallar_Sahifasi SHALL xatolikni konsolga yozib qo'yishi va tashrif buyuruvchiga Bosh_Holat blokini ko'rsatishi kerak.

### Requirement 12: Kod sifati va dizayn tizimidan izchil foydalanish

**User Story:** Dasturchi sifatida men kod toza va izchil bo'lishini xohlayman, shunda redizayndan keyin loyihani saqlash oson bo'ladi.

#### Acceptance Criteria

1. THE Sayt SHALL redizayn doirasida o'zgartirilgan fayllarda ishlatilmagan importlarni saqlamasligi kerak.
2. THE Sayt SHALL uslublarni Tailwind klass nomlari va Dizayn_Tili token'lari orqali qo'llashi, zarurat bo'lmaganda inline `style` atributlaridan qochishi kerak.
3. THE Sayt SHALL takroriy yoki ortiqcha izohlarni har bir holatda aniq bitta nusxada saqlashi kerak.
4. THE Sayt SHALL kod tozalashdan keyin barcha Mavjud_Funksionallikni o'zgarishsiz saqlashi kerak.

### Requirement 13: Gemini API kaliti fosh bo'lishi xavfini hujjatlashtirish

**User Story:** Loyiha egasi sifatida men frontend'da fosh bo'ladigan Gemini API kaliti xavfidan xabardor bo'lishni xohlayman, shunda xavfsizlik bo'yicha ongli qaror qabul qila olaman.

#### Acceptance Criteria

1. THE Sayt SHALL Gemini_API kaliti `VITE_` prefiksi bilan frontend bundle'iga kiritilganda u brauzerda ochiq ko'rinishini hujjatda eslatib o'tishi kerak.
2. WHERE Gemini_API kaliti brauzerda ochiq fosh bo'lgan va loyiha egasi xavfsizlikni kuchaytirishni tanlagan bo'lsa, THE Sayt SHALL Gemini_API so'rovlarini frontend o'rniga backend proksi orqali yuborish imkoniyatini tavsiya etishi kerak.

> Eslatma: Requirement 13 dizayndan tashqari xavfsizlik masalasini qamrab oladi va asosiy fokus emas; u faqat xabardorlik uchun hujjatlashtiriladi va implementatsiya bosqichida ixtiyoriy hisoblanadi.
