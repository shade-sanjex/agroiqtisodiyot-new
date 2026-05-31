# Implementation Plan

## Overview

Ushbu reja ISCAD "Agroiqtisodiyot" saytining to'liq vizual redizaynini **token-birinchi (token-first)** ketma-ketlikda amalga oshiradi: avval markazlashgan Dizayn_Tili token'lari (`src/index.css` + `tailwind.config.ts`) va theme sozlamalari, so'ngra qayta ishlatiladigan Komponent_Tizimi, keyin umumiy komponentlar (Navbar/Footer), so'ng har bir sahifa, va nihoyat accessibility/tozalash hamda validatsiya. Har bir vazifa avvalgilari ustiga quriladi va orphan kod qoldirmaydi.

**Eng muhim cheklov (R4):** barcha vazifalar faqat **taqdimot (presentation) qatlamini** o'zgartiradi. Event handler, `useEffect`/`useQuery`, Supabase/Gemini/Telegram chaqiruvlari, biznes mantiq va marshrutlar **o'zgarmaydi** — faqat ularni o'rab turuvchi markup va Tailwind klasslar yangilanadi.

> Property-based testing **qo'llanilmaydi** (design.md "Testing Approach Rationale" bo'limiga qarang — bu vizual/frontend redizayn). Tekshiruv lint/tsc/build + maqsadli Vitest unit/integratsiya + manual vizual regressiyaga tayanadi.

## Tasks

- [x] 1. Poydevor — Dizayn_Tili token'lari, theme va test infratuzilmasi
  - [x] 1.1 `src/index.css` da rang token'larini "Cultivated Future" qiymatlariga yangilash
    - `:root` (light) va `.dark` (dark) bloklarida `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--accent`, `--secondary`, `--muted`/`--muted-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--gold` HSL qiymatlarini design.md "Rang token'lari" jadvalidan o'rnatish
    - Yangi `--surface-1`, `--surface-2`, `--surface-3` token'larini light va dark uchun qo'shish
    - Token nomlarini mavjud nomlar bilan mos saqlash (minimal regressiya)
    - _Requirements: 1.1, 1.3, 1.6, 6.1, 7.2_

  - [x] 1.2 `src/index.css` da tarkibiy (non-color) token'lar va reduced-motion global qoidasini qo'shish
    - `--section-gap-y`, `--content-max-w`, `--radius`, blur (`--blur-nav`, `--blur-card`), motion token'lari (`--ease-out-expo`, `--ease-spring`, `--dur-fast/base/slow/reveal`) va navbar balandlik token'lari (`--nav-height-mobile`, `--nav-height-desktop`) ni e'lon qilish
    - Global `@media (prefers-reduced-motion: reduce)` blokini qo'shish: animation/transition davomiyligini minimallashtirish, takrorlanuvchi effektlarni (`.animate-float`, `.animate-ken-burns`, `.glow-blob`, `.animate-scan-laser`, `.animate-orbit`, `.ai-data-stream`) o'chirish, `.reveal*` kontentini darhol ko'rinadigan qilish
    - _Requirements: 1.1, 5.2, 9.1, 9.2, 9.3, 9.4, 10.2_

  - [x] 1.3 `tailwind.config.ts` token map'ini tuzatish va tozalash
    - `fontFamily.sans` ni `Inter` dan `"Plus Jakarta Sans"` ga tuzatish; `serif`/`display` ni Playfair Display'da saqlash
    - `boxShadow` token'larini (`glass`, `glass-lg`, `glow`) emerald/ink token'lariga moslash; eski ko'k (`rgba(27,79,138,...)`) qoldiqlarini olib tashlash
    - Ishlatilmagan `navy`/`iscad` rang oilalarini tekshirish va ishlatilmasa olib tashlash (yoki token tizimiga moslash)
    - _Requirements: 1.1, 1.3, 12.1_

  - [x] 1.4 `index.html` `<head>` ichiga anti-FOUC bloklovchi inline theme skriptini qo'shish
    - `localStorage('theme')` va `prefers-color-scheme` ni o'qib, React mount bo'lishidan oldin `documentElement` ga `dark` klassini qo'yish; `try/catch` zaxirasi bilan
    - _Requirements: 6.2, 6.5_

  - [x] 1.5 `src/App.tsx` da `ThemeProvider` ni tizim rejimiga moslash
    - `defaultTheme="light" enableSystem={false}` ni `attribute="class" defaultTheme="system" enableSystem` ga o'tkazish
    - Preloading/LoadingScreen logikasi va marshrutlarni o'zgarishsiz saqlash
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ]* 1.6 Vitest + React Testing Library test infratuzilmasini o'rnatish
    - `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` ni dev-dependency sifatida qo'shish; `vitest.config.ts` (jsdom muhiti) va `package.json` ga `test` skriptini (`vitest run` — watch emas) qo'shish
    - _Requirements: 11.1, 11.2_

- [x] 2. Qayta ishlatiladigan Komponent_Tizimini qurish
  - [x] 2.1 `Button` (`src/components/ui/button.tsx`) `cva` variantlarini kengaytirish
    - `primary` (default), `accent`, `outline`, `ghost`, `subtle` variantlarini token-klasslar orqali ta'riflash; eski `glow-button-*` utility'larini token shadow'larga ko'chirish
    - Barcha variantlarga `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` fokus naqshini meros qildirish
    - _Requirements: 2.1, 2.4, 8.4_

  - [x] 2.2 `GlassCard` komponentini yaratish (`src/components/ui-system/GlassCard.tsx`)
    - `variant` (`default`/`elevated`/`outline`/`subtle`) va `interactive` (hover-lift) props'lari; token asosidagi glass/shadow klasslar
    - _Requirements: 2.1, 2.4_

  - [x] 2.3 `PageShell` layout wrapper'ini yaratish (`src/components/layout/PageShell.tsx`)
    - `<Navbar/>` + navbar balandlik tokeniga (`--nav-height-*`) bog'langan Spacer + `<main>` (slot) + `<Footer/>` + `<BackToTop/>` ni izchil tartibda chiqarish; `hideFooter`, `showBackToTop`, `className` props'lari
    - _Requirements: 3.12, 5.2_

  - [x] 2.4 `PageHero` komponentini yaratish (`src/components/ui-system/PageHero.tsx`)
    - `eyebrow`, `title` (serif), `description`, `backgroundImage`, `size`, `actions`, `icon` props'lari; bitta nozik gradient overlay + token-glow; dekorativ fon rasmi uchun `alt=""`
    - _Requirements: 2.1, 3.1, 7.4_

  - [x] 2.5 `SectionHeading` komponentini yaratish (`src/components/ui-system/SectionHeading.tsx`)
    - `eyebrow`, `title`, `description`, `align`, `as` (h1/h2/h3 semantik) props'lari; eyebrow uchun `text-xs font-semibold uppercase tracking` token-naqshi
    - _Requirements: 2.1, 7.1_

  - [x] 2.6 `FeatureCard` komponentini yaratish (`src/components/ui-system/FeatureCard.tsx`)
    - ikona + sarlavha + tavsif naqshi; `GlassCard` ustiga quriladi
    - _Requirements: 2.1, 2.2_

  - [x] 2.7 `StatCard` va `StatStrip` komponentlarini yaratish (`src/components/ui-system/StatStrip.tsx`)
    - `StatItem` (value/label/prefix/suffix/icon) va `StatStripProps`; har bir `StatCard` ichida mavjud `AnimatedCounter` ni qayta ishlatish (logika o'zgarmaydi)
    - _Requirements: 2.1, 9.5_

  - [x] 2.8 `EmptyState` komponentini yaratish (`src/components/ui-system/EmptyState.tsx`)
    - `icon`, `title`, `description`, `action` props'lari; token asosidagi sirt/tipografika
    - _Requirements: 2.1, 11.2_

  - [x] 2.9 `SkeletonGrid` komponentini yaratish (`src/components/ui-system/SkeletonGrid.tsx`)
    - `count`, `aspect`, `columns` props'lari; mavjud shadcn `Skeleton` + `.shimmer` ustiga quriladi
    - _Requirements: 2.1, 11.3_

  - [x] 2.10 `Badge` (`src/components/ui/badge.tsx`) ni token asosida yangilash
    - `journal-badge-premium` va "AI" yorlig'i variantlarini token-klasslarga ko'chirish; mazmunli matn 12px (`text-xs`) minimal qoidasiga moslash, sof dekorativ holatlarni istisno qoldirish
    - _Requirements: 2.1, 7.1, 7.3_

  - [ ]* 2.11 Komponent_Tizimi uchun smoke unit testlar yozish
    - `PageShell` Spacer'i navbar balandlik tokeniga bog'langan klassni render qilishini tasdiqlash; `Button` variantlari va `EmptyState` to'g'ri token-klasslar bilan render bo'lishini tekshirish
    - _Requirements: 5.2, 2.4, 11.2_

- [x] 3. Checkpoint — poydevor va Komponent_Tizimi
  - Barcha testlar o'tishini ta'minlang, savol tug'ilsa foydalanuvchidan so'rang.

- [x] 4. Umumiy komponentlarni yangi Dizayn_Tiliga o'tkazish
  - [x] 4.1 `Navbar` (`src/components/Navbar.tsx`) ni qayta dizayn qilish
    - Balandlikni `--nav-height-*` tokeniga bog'lash; AI badge va boshqa mazmunli matnlarni 12px (`text-xs`) ga ko'tarish; glassmorphism'ni nafislashtirish; mobil collapsible (Sheet) menyu xulqini saqlash
    - Navigatsiya havolalari, marshrutlar va event'lar o'zgarmaydi
    - _Requirements: 3.12, 5.2, 5.6, 7.1_

  - [x] 4.2 `Footer` (`src/components/Footer.tsx`) ni qayta dizayn qilish
    - Token-rang va izchil tipografika; struktura va havolalarni saqlagan holda yangi Dizayn_Tiliga moslash
    - _Requirements: 3.12, 1.4_

- [x] 5. Sahifalarni yangi Dizayn_Tilida qayta dizayn qilish (har birida funksiya regressiyasiz saqlanadi)
  - [x] 5.1 `Index.tsx` (Bosh_Sahifa) ni qayta dizayn qilish
    - `PageShell` + editorial hero (Playfair display + eyebrow + ikki CTA + yumshatilgan 3D muqova) + `StatStrip` (AnimatedCounter) + `FeatureCard` setkasi; ortiqcha raqobatlashuvchi effektlarni bitta "hero moment"gacha kamaytirish
    - _Requirements: 3.1, 4.11, 9.5_

  - [x] 5.2 `About.tsx` ni qayta dizayn qilish
    - `PageShell` + `PageHero` (center-building) + ikki ustunli "matn × rasm" bloklar + `GlassCard` qadriyat kartalari, izchil `SectionHeading` ritmi bilan
    - _Requirements: 3.2_

  - [x] 5.3 `EditorialBoard.tsx` ni qayta dizayn qilish
    - `PageShell` + `PageHero` + a'zolar `GlassCard` setkasi (portret/initial-avatar, hover-lift, aniq tipografik ierarxiya); a'zolarni ko'rsatish ma'lumot oqimi o'zgarmaydi
    - _Requirements: 3.3, 4.6_

  - [x] 5.4 `Journals.tsx` ni qayta dizayn qilish va mock ma'lumotni olib tashlash
    - `fetchJournals` ichidagi Mock_Jurnal generatsiyasini (soxta yozuvlar) butunlay olib tashlash; `try/catch/finally` va Supabase chaqiruvini saqlash
    - Yuklanishda `SkeletonGrid`, bo'sh natijada `EmptyState` ("Hozircha jurnallar mavjud emas"), xatoda `console.error` + `EmptyState` ko'rsatish; qidiruv natijasi bo'sh bo'lganda qidiruvga xos `EmptyState`
    - `PageHero` + Sticky_Qidiruv_Paneli `top` offsetini `--nav-height-*` tokeniga bog'lash; jurnal muqova kartasini `<button>` (yoki `role="button"` + `tabIndex={0}` + Enter/Space `onKeyDown`) ga o'tkazish
    - Qidiruv, pagination va modal xulqini o'zgarmas saqlash
    - _Requirements: 3.4, 4.8, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 5.5 `Journals.tsx` holatlari va a11y uchun unit/integratsiya testlari yozish
    - Bo'sh massivda `EmptyState` render bo'lishi va hech qanday `mock-*` id yo'qligi (R11.1, R11.2); yuklanishda `SkeletonGrid` ko'rinishi (R11.3); `fetchJournals` xato tashlasa `console.error` + `EmptyState` (R11.4); jurnal kartasi `role="button"`/`tabIndex=0` ekani va `fireEvent.keyDown(Enter)` modalni ochishi (R8.1, R8.2)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 8.1, 8.2_

  - [x] 5.6 `Requirements.tsx` ni qayta dizayn qilish
    - `PageShell` + `PageHero` + raqamlangan qadam/akkordeon bloklar (shadcn `accordion`); PDF/havola CTA token-`Button`; aniq o'qiladigan tipografika
    - _Requirements: 3.5_

  - [x] 5.7 `Contact.tsx` ni qayta dizayn qilish
    - `PageShell` + ikki ustun: chapda `GlassCard` kontakt forma, o'ngda aloqa ma'lumotlari kartasi; forma submit/saqlash logikasi va tasdiq toasti o'zgarmaydi
    - _Requirements: 3.6, 4.5_

  - [x] 5.8 `Auth.tsx` ni qayta dizayn qilish
    - `PageShell` (yoki mos wrapper) + markazlashgan `GlassCard` panel split-fon ustida; kirish/ro'yxat/parol-tiklash tab/transition (`auth-transition`) va Supabase autentifikatsiya chaqiruvlari/yo'naltirishlari o'zgarmaydi
    - _Requirements: 3.7, 4.1_

  - [x] 5.9 `Admin.tsx` (Admin_Panel) ni qayta dizayn qilish (eng katta o'zgarish)
    - `PageShell` + sahifa sarlavhasi + shadcn `Tabs` (Jurnallar / Xabarlar / Tahrir hay'ati), har tab `GlassCard` jadval/forma; inline `style` atributlarini token-klasslarga almashtirish
    - CRUD logikasi, Telegram CDN yuklash, `Dialog`/`AlertDialog` xulqi va Supabase chaqiruvlari o'zgarmaydi
    - _Requirements: 3.8, 4.2, 4.6, 12.2_

  - [x] 5.10 `ArticleChecker.tsx` ni qayta dizayn qilish
    - `PageShell` + ikki panel: chapda matn/fayl kiritish (`GlassCard`), o'ngda natija paneli; takroriy "Input Panel" izohini bitta nusxaga tushirish; AI skan animatsiyalarini saqlash (reduced-motion'da o'chadi)
    - Gemini_API + lokal fallback va fayl ekstraksiyasi (docx/pdf/txt) logikasi o'zgarmaydi
    - _Requirements: 3.9, 4.3, 4.4, 12.3_

  - [x] 5.11 `TelegramApp.tsx` ni qayta dizayn qilish
    - `PageShell hideFooter` bilan Telegram WebApp temasiga moslashuvchan kompozitsiya; init + jurnal yuklash logikasi o'zgarmaydi
    - _Requirements: 3.10, 4.7_

  - [x] 5.12 `NotFound.tsx` ni qayta dizayn qilish
    - Markazlashgan editorial "404" — katta display raqam + qisqa matn + Bosh_Sahifaga qaytish token-`Button`
    - _Requirements: 3.11_

- [~] 6. Checkpoint — barcha sahifalar
  - Barcha testlar o'tishini ta'minlang, savol tug'ilsa foydalanuvchidan so'rang. R1.5: redizayn faqat barcha sahifalar o'tkazilgandagina "to'liq" hisoblanadi.

- [x] 7. Accessibility va kod sifatini konsolidatsiya qilish
  - [x] 7.1 Sayt bo'ylab interaktiv elementlar va rasmlar accessibility auditini o'tkazish
    - Qolgan `onClick` biriktirilgan `<div>` larni `<button>` (yoki `role="button"` + `tabIndex={0}` + Enter/Space `onKeyDown`) ga o'tkazish; mazmunli rasmlarga ma'noli `alt`, dekorativ rasmlarga `alt=""` berish; barcha interaktiv elementlarda focus-visible ring tokenini tasdiqlash
    - _Requirements: 7.4, 7.5, 8.1, 8.2, 8.3, 8.4_

  - [x] 7.2 O'zgartirilgan fayllarda kodni tozalash
    - `Index.tsx` dagi ishlatilmagan importlarni (`FileText`, `FolderOpen`, `navigate`) va boshqa fayllardagi ishlatilmagan importlarni olib tashlash; takroriy/ortiqcha izohlarni bitta nusxaga tushirish; zaruratsiz inline `style` ni token-klasslarga almashtirish — funksiyani o'zgartirmasdan
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 8. Yakuniy integratsiya va validatsiya
  - [x] 8.1 Statik va build tekshiruvlarini bajarib, xatolarni tuzatish
    - `npm run lint`, `npx tsc --noEmit` va `npm run build` (`vite build`) ni muvaffaqiyatli o'tkazish; aniqlangan lint/tip/build xatolarini tuzatish
    - _Requirements: 1.1, 12.1_

  - [ ]* 8.2 Reduced-motion va AnimatedCounter uchun maqsadli tekshiruv yozish
    - `prefers-reduced-motion` yoqilganda `AnimatedCounter` yakuniy qiymatni darhol to'liq ko'rsatishini va reveal kontenti ko'rinadigan bo'lishini tasdiqlovchi unit test
    - _Requirements: 9.2, 9.3, 9.5, 10.2_

  - [ ]* 8.3 (Ixtiyoriy) Gemini_API kaliti foshligi xavfini hujjatlashtirish va backend proksi imkoniyatini tayyorlash
    - `ai-checker.ts` yoniga / README ga `VITE_GEMINI_API_KEY` brauzerda ochiq fosh bo'lishi haqidagi izohni qo'shish; ixtiyoriy ravishda `scripts/server.cjs` ga `POST /api/check-article` proksi endpointini skaffold qilish (kalit faqat serverda). `localCheckArticle` fallback o'zgarmaydi
    - _Requirements: 13.1, 13.2_

  - [x] 8.4 Checkpoint — manual vizual va funksional regressiya
    - Barcha avtomatik testlar o'tishini ta'minlang. design.md "Testing Strategy" 3a–3f matritsasi (Light/Dark × Mobil/Planshet/Desktop) bo'yicha dizayn izchilligi (3a), funksional regressiya (3b — R4 oqimlari), responsivlik/sticky (3c), theme (3d), accessibility (3e) va motion (3f) ni qo'lda tekshiring; muammo topilsa tegishli vazifaga qayting va foydalanuvchidan so'rang.

## Notes

- `*` bilan belgilangan sub-vazifalar ixtiyoriy (test/hujjatlashtirish) va tezroq MVP uchun o'tkazib yuborilishi mumkin; `*` belgisiz sub-vazifalar majburiy.
- Property-based testlar yo'q — bu vizual redizayn (design.md "Testing Approach Rationale"). Test sub-vazifalari Vitest + RTL example/edge-case tekshiruvlaridir.
- Har bir sahifa vazifasi **funksiyani regressiyasiz saqlash** (R4) ni qat'iy talab qiladi: faqat markup/klasslar o'zgaradi, handler/data/marshrutlar o'zgarmaydi.
- Checkpointlar inkremental validatsiyani ta'minlaydi; R1.5 ga ko'ra redizayn faqat barcha sahifalar o'tkazilgach to'liq hisoblanadi.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "1.4", "1.5", "1.6"] },
    { "id": 1, "tasks": ["1.2", "2.1", "2.2", "2.3", "2.4", "2.5", "2.7", "2.8", "2.9", "2.10"] },
    { "id": 2, "tasks": ["2.6", "2.11", "4.1", "4.2"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12"] },
    { "id": 4, "tasks": ["5.5", "8.3"] },
    { "id": 5, "tasks": ["7.1"] },
    { "id": 6, "tasks": ["7.2"] },
    { "id": 7, "tasks": ["8.1", "8.2"] }
  ]
}
```
