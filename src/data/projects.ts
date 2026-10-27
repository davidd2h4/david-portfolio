import shots from "./shots.json";

export type Locale = "en" | "uk";
export type L = Record<Locale, string>;

export type Shot = { src: string; width: number; height: number };
type ShotKey<S extends keyof typeof shots> = keyof (typeof shots)[S];

export type Project = {
  slug: string;
  /** Slug of the screenshot folder in /public/work. */
  shotsKey: keyof typeof shots;
  name: string;
  url: string;
  category: L;
  /** Brand colour sampled from the live site, used for small accents only. */
  tint: string;
  tone: "dark" | "light";
  summary: L;
  overview: L;
  direction: L;
  features: L[];
  interactions: L[];
  stack: string[];
  languages: L;
  note: L;
  hero: string;
  long: string;
  gallery: { key: string; caption: L }[];
  mobile: { key: string; caption: L }[];
};

const P = <S extends keyof typeof shots>(
  p: Omit<Project, "shotsKey" | "hero" | "long" | "gallery" | "mobile"> & {
    shotsKey: S;
    hero: ShotKey<S>;
    long: ShotKey<S>;
    gallery: { key: ShotKey<S>; caption: L }[];
    mobile: { key: ShotKey<S>; caption: L }[];
  },
) => p as unknown as Project;

export const projects: Project[] = [
  P({
    slug: "aeris-flights",
    shotsKey: "aeris-flights",
    name: "AERIS Flights",
    url: "https://aeris-flights.vercel.app/",
    category: { en: "Travel / Flight Booking Experience", uk: "Подорожі / Бронювання авіаквитків" },
    tint: "#2f8cf0",
    tone: "dark",
    summary: {
      en: "A calm, premium flight search and booking flow — from airport autocomplete to seat maps and QR boarding passes — built on fictional demo data.",
      uk: "Спокійний преміальний сервіс пошуку й бронювання рейсів — від автодоповнення аеропортів до схеми салону та посадкових талонів із QR-кодом — на вигаданих демоданих.",
    },
    overview: {
      en: "AERIS is a portfolio demo of a flight booking product. It covers the whole journey: search, compare, personalise, review and an e-ticket at the end. Flights, prices and seats come from a deterministic demo generator, so the product behaves like a real service without selling a single ticket.",
      uk: "AERIS — портфоліо-демо сервісу бронювання авіаквитків. Він охоплює весь шлях: пошук, порівняння, персоналізацію, перевірку замовлення й електронний квиток наприкінці. Рейси, ціни та місця створює детермінований демогенератор, тож продукт поводиться як справжній сервіс, не продаючи жодного квитка.",
    },
    direction: {
      en: "A night-sky hero above the clouds, a single bright search card and generous type. The interface stays quiet so the route, the time and the total price are always the loudest things on screen.",
      uk: "Нічне небо над хмарами, одна світла картка пошуку й просторова типографіка. Інтерфейс лишається тихим, щоб маршрут, час і підсумкова ціна завжди були найпомітнішими на екрані.",
    },
    features: [
      { en: "Round-trip and one-way search with airport autocomplete by city, name, country or IATA code", uk: "Пошук туди й назад або в один бік з автодоповненням аеропортів за містом, назвою, країною чи IATA-кодом" },
      { en: "Results with filters, sorting, a price calendar, fare selection and return flight choice", uk: "Результати з фільтрами, сортуванням, календарем цін, вибором тарифу та зворотного рейсу" },
      { en: "Booking flow: passengers, cabin seat map, baggage, extras and an order review", uk: "Бронювання: пасажири, схема салону, багаж, додаткові послуги та перевірка замовлення" },
      { en: "Electronic boarding passes with QR codes and a “My trips” area", uk: "Електронні посадкові талони з QR-кодом і розділ «Мої подорожі»" },
      { en: "Price calendar page for exploring fares by date", uk: "Сторінка календаря цін для пошуку тарифів за датами" },
    ],
    interactions: [
      { en: "Take-off and landing animations between steps, with a Skip button and reduced-motion support", uk: "Анімації зльоту й посадки між кроками з кнопкою «Пропустити» та підтримкою reduced-motion" },
      { en: "Ukrainian and English interface, responsive from 320 px to large screens", uk: "Українська та англійська мови, адаптивність від 320 px до великих екранів" },
      { en: "Search and booking drafts survive a reload; personal data never leaves the browser", uk: "Пошук і чернетка бронювання зберігаються після перезавантаження; персональні дані не залишають браузер" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "Vitest"],
    languages: { en: "English · Ukrainian", uk: "Англійська · українська" },
    note: {
      en: "Portfolio demo: all flights, prices and seats are fictional. No tickets are sold and no payments are taken.",
      uk: "Портфоліо-демо: усі рейси, ціни й місця вигадані. Квитки не продаються, оплата не приймається.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "results", caption: { en: "Search results — filters, sorting and fares side by side", uk: "Результати пошуку — фільтри, сортування й тарифи поруч" } },
      { key: "explore", caption: { en: "Price calendar for flexible dates", uk: "Календар цін для гнучких дат" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile search", uk: "Пошук на мобільному" } },
      { key: "m-results", caption: { en: "Mobile results", uk: "Результати на мобільному" } },
    ],
  }),
  P({
    slug: "living-interior",
    shotsKey: "living-interior",
    name: "LIVING Interior 4D",
    url: "https://living-interior-4d.vercel.app/",
    category: { en: "Interactive Interior Design / 3D Configurator", uk: "Інтерактивний дизайн інтер’єру / 3D-конфігуратор" },
    tint: "#9c7d5b",
    tone: "light",
    summary: {
      en: "An interior design storefront with a working studio: plan a room or a whole apartment to real dimensions, furnish it, and see it in real-time 3D with time-of-day light.",
      uk: "Вітрина студії інтер’єру з робочою студією: сплануйте кімнату чи всю квартиру в реальних розмірах, облаштуйте її та подивіться в 3D у реальному часі зі світлом різних годин доби.",
    },
    overview: {
      en: "LIVING pairs an editorial furniture storefront with a full planning studio. Visitors choose a room type or an apartment layout, edit walls, doors and windows, furnish from a catalogue, and leave with an itemised estimate, images and a PDF presentation. Everything — furniture, materials, plan symbols — is drawn procedurally in SVG and three.js.",
      uk: "LIVING поєднує редакційну вітрину меблів із повноцінною студією планування. Відвідувач обирає тип кімнати або планування квартири, редагує стіни, двері й вікна, облаштовує простір із каталогу та отримує кошторис, зображення й PDF-презентацію. Усе — меблі, матеріали, умовні позначення — малюється процедурно у SVG та three.js.",
    },
    direction: {
      en: "Warm paper tones, a refined serif and calm product photography-style renders. The studio itself is precise and tool-like, but keeps the same quiet palette so planning feels like part of the brand, not a separate app.",
      uk: "Теплі паперові тони, вишуканий серіф і спокійні рендери в дусі предметної фотографії. Сама студія точна, як інструмент, але зберігає ту саму тиху палітру — планування відчувається частиною бренду, а не окремим застосунком.",
    },
    features: [
      { en: "10 room types or a whole apartment/house, ready-made designs or empty rooms, preset or custom sizes", uk: "10 типів кімнат або ціла квартира/будинок, готові дизайни чи порожні кімнати, типові або власні розміри" },
      { en: "Architectural plan editor: add and move walls, doors, passages, windows, merge rooms, measure, undo/redo", uk: "Редактор плану: додавання й переміщення стін, двері, проходи, вікна, об’єднання кімнат, вимірювання, скасування/повтор" },
      { en: "Room constructor with floors, wall finishes, kitchen generator and bathroom fittings", uk: "Конструктор кімнати: підлоги, оздоблення стін, генератор кухні та сантехніка" },
      { en: "Real-time 3D with corner, top and eye-level cameras, a before/after slider and a cinematic tour", uk: "3D у реальному часі з камерами з кута, згори та на рівні очей, слайдером «до/після» і кінематографічним туром" },
      { en: "“4D” time-of-day slider, opening curtains and doors, per-lamp switches and colour temperature", uk: "«4D»-слайдер часу доби, штори й двері, що відчиняються, окремі вимикачі та колірна температура ламп" },
      { en: "Itemised estimate, JSON export/import, share links, PNG and a branded PDF", uk: "Детальний кошторис, експорт/імпорт JSON, посилання для поширення, PNG і брендований PDF" },
    ],
    interactions: [
      { en: "Drag handles to resize rooms; neighbouring rooms give or take the difference", uk: "Ручки для зміни розміру кімнат; сусідні кімнати віддають або забирають різницю" },
      { en: "Style comparison slider on the homepage", uk: "Слайдер порівняння стилів на головній" },
      { en: "Ukrainian by default, English one click away", uk: "Українська за замовчуванням, англійська — в один клік" },
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "three.js", "Zustand", "Zod", "jsPDF", "Motion", "Playwright"],
    languages: { en: "Ukrainian · English", uk: "Українська · англійська" },
    note: {
      en: "Projects are saved in the visitor’s browser only. Prices are illustrative demo prices.",
      uk: "Проєкти зберігаються лише в браузері відвідувача. Ціни — ілюстративні демоціни.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "studio", caption: { en: "The studio — plan view with catalogue and room geometry", uk: "Студія — план із каталогом і геометрією кімнати" } },
      { key: "collections", caption: { en: "Furniture collections", uk: "Колекції меблів" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile homepage", uk: "Головна на мобільному" } },
      { key: "m-studio", caption: { en: "Studio on a phone", uk: "Студія на телефоні" } },
    ],
  }),
  P({
    slug: "nexora-crm",
    shotsKey: "nexora-crm",
    name: "NEXORA CRM",
    url: "https://nexora-crm-two-phi.vercel.app/",
    category: { en: "SaaS / CRM Dashboard", uk: "SaaS / CRM-панель" },
    tint: "#5b5ef0",
    tone: "dark",
    summary: {
      en: "A complete CRM workspace — dashboard, drag-and-drop pipeline, clients, invoices, calendar and analytics — presented as a read-only public demo.",
      uk: "Повноцінний CRM-простір — панель, воронка з перетягуванням, клієнти, рахунки, календар і аналітика — у форматі публічного демо лише для перегляду.",
    },
    overview: {
      en: "NEXORA is a sales CRM built as a dense, real-feeling product: around twenty screens from the dashboard to reports, all wired to a seeded data store. The public build is read-only, so every visitor sees the same coherent business without breaking it.",
      uk: "NEXORA — CRM для продажів, створена як щільний продукт, що відчувається справжнім: близько двадцяти екранів від панелі до звітів, пов’язаних з одним набором демоданих. Публічна версія — лише для перегляду, тож кожен відвідувач бачить той самий цілісний бізнес.",
    },
    direction: {
      en: "A deep navy sidebar, white working surface and one violet accent. Numbers are always labelled with what they mean — won deals are not called revenue, simulated payments say so.",
      uk: "Темно-синя бічна панель, біла робоча поверхня й один фіолетовий акцент. Цифри завжди підписані тим, що вони означають: виграні угоди не називаються доходом, симульовані оплати так і позначені.",
    },
    features: [
      { en: "Dashboard with period switch, sales and payments chart, funnel, revenue by source and team performance", uk: "Панель із вибором періоду, графіком продажів і оплат, воронкою, доходом за джерелами та ефективністю команди" },
      { en: "Kanban pipeline with drag and drop — and keyboard moves with the Space key", uk: "Канбан-воронка з перетягуванням — і переміщенням з клавіатури клавішею Пробіл" },
      { en: "Clients, companies, deals, tasks, calendar, finance and invoices with printable documents", uk: "Клієнти, компанії, угоди, задачі, календар, фінанси та рахунки з документами для друку" },
      { en: "Analytics, sales forecast, reports, team, activity log, documents and notifications", uk: "Аналітика, прогноз продажів, звіти, команда, журнал активності, документи та сповіщення" },
      { en: "A built-in assistant that understands plain-language requests about the local demo data", uk: "Вбудований асистент, що розуміє запити звичайною мовою щодо локальних демоданих" },
    ],
    interactions: [
      { en: "Global search with Ctrl K", uk: "Глобальний пошук через Ctrl K" },
      { en: "Ukrainian and English, light and dark themes", uk: "Українська та англійська, світла й темна теми" },
      { en: "Collapsible sidebar and a dedicated mobile layout", uk: "Згортання бічної панелі та окремий мобільний макет" },
    ],
    stack: ["React 19", "Vite", "TypeScript", "Tailwind CSS 4", "React Router", "Zustand", "Recharts", "dnd-kit", "React Hook Form", "Zod"],
    languages: { en: "Ukrainian · English", uk: "Українська · англійська" },
    note: {
      en: "Public read-only demo with seeded data. Payments are simulated.",
      uk: "Публічне демо лише для перегляду з демоданими. Оплати симульовані.",
    },
    hero: "dashboard",
    long: "dashboard-long",
    gallery: [
      { key: "pipeline", caption: { en: "Sales pipeline — drag cards between stages", uk: "Воронка продажів — перетягуйте картки між етапами" } },
      { key: "analytics", caption: { en: "Analytics", uk: "Аналітика" } },
    ],
    mobile: [
      { key: "m-dashboard", caption: { en: "Mobile dashboard", uk: "Панель на мобільному" } },
      { key: "m-pipeline", caption: { en: "Mobile pipeline", uk: "Воронка на мобільному" } },
    ],
  }),
  P({
    slug: "nori-sushi",
    shotsKey: "nori-sushi",
    name: "NORI Sushi Delivery",
    url: "https://nori-sushi-delivery.vercel.app/",
    category: { en: "Food Delivery / E-commerce", uk: "Доставка їжі / E-commerce" },
    tint: "#e3262b",
    tone: "light",
    summary: {
      en: "A dark, appetite-first Japanese delivery store with a 56-dish catalogue, cart with promo codes, favourites and a validated demo checkout.",
      uk: "Темний «апетитний» магазин японської кухні з каталогом на 56 страв, кошиком із промокодами, обраним і демо-оформленням замовлення з валідацією.",
    },
    overview: {
      en: "NORI is a full e-commerce flow for a fictional sushi delivery: browse by category, open a dish to see its ingredients, build a cart, apply a promo code and check out. Every page is statically generated for speed.",
      uk: "NORI — повний e-commerce сценарій для вигаданої доставки суші: перегляд за категоріями, сторінка страви з інгредієнтами, кошик, промокод і оформлення. Усі сторінки статично згенеровані для швидкості.",
    },
    direction: {
      en: "Near-black backgrounds let the food photography glow; a single lacquer red handles every action. Japanese characters are used as quiet graphic texture next to an elegant serif.",
      uk: "Майже чорне тло дає фотографіям страв світитися; один лаковий червоний відповідає за всі дії. Японські ієрогліфи — тиха графічна текстура поруч з елегантним серифом.",
    },
    features: [
      { en: "Catalogue of 56 dishes in categories, with filters and a page for every dish", uk: "Каталог із 56 страв у категоріях із фільтрами та сторінкою кожної страви" },
      { en: "Cart with totals, minimum order and promo codes", uk: "Кошик із підсумками, мінімальним замовленням і промокодами" },
      { en: "Favourites saved in the browser", uk: "Обране зберігається в браузері" },
      { en: "Demo checkout with form validation — no real payment", uk: "Демо-оформлення з валідацією форми — без реальної оплати" },
      { en: "Promotions, about, delivery, contacts and photo credits pages", uk: "Сторінки акцій, про нас, доставки, контактів і авторів фото" },
    ],
    interactions: [
      { en: "Ukrainian and English", uk: "Українська та англійська" },
      { en: "Optimised images, sitemap and robots.txt; all pages statically generated", uk: "Оптимізовані зображення, sitemap і robots.txt; усі сторінки статично згенеровані" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Zustand", "React Hook Form", "Zod"],
    languages: { en: "Ukrainian · English", uk: "Українська · англійська" },
    note: {
      en: "Demo store: orders, payments and promo codes are not real; nothing leaves the browser.",
      uk: "Демо-магазин: замовлення, оплата та промокоди не справжні; дані не залишають браузер.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "menu", caption: { en: "Menu with categories and filters", uk: "Меню з категоріями та фільтрами" } },
      { key: "product", caption: { en: "Dish page", uk: "Сторінка страви" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile homepage", uk: "Головна на мобільному" } },
      { key: "m-menu", caption: { en: "Mobile menu", uk: "Меню на мобільному" } },
    ],
  }),
  P({
    slug: "noir-restaurant",
    shotsKey: "noir-restaurant",
    name: "NOIR Restaurant",
    url: "https://noir-restaurant.vercel.app/",
    category: { en: "Luxury Restaurant / Hospitality", uk: "Преміальний ресторан / Гостинність" },
    tint: "#c9a46a",
    tone: "dark",
    summary: {
      en: "A candlelit fine-dining website for a fictional house in Prague — signature menu, bar, private dining, gallery and table reservations on a floor plan.",
      uk: "Сайт fine dining у світлі свічок для вигаданого ресторану в Празі — авторське меню, бар, приватні вечері, галерея та бронювання столика на плані зали.",
    },
    overview: {
      en: "NOIR presents a restaurant as an evening rather than a list of services. The site moves from story to signature dishes, the kitchen, the bar and private dining, and ends with a reservation flow where guests choose a date, a seating and a table on the plan.",
      uk: "NOIR показує ресторан як вечір, а не як перелік послуг. Сайт веде від історії до авторських страв, кухні, бару й приватних вечерь і завершується бронюванням, де гість обирає дату, час і столик на плані зали.",
    },
    direction: {
      en: "Black ground, warm light and gold details. Wide letter-spaced capitals and generous darkness give each plate and each sentence room — the site paces itself like a tasting menu.",
      uk: "Чорне тло, тепле світло й золоті деталі. Розріджені великі літери та щедра темрява дають простір кожній страві й кожному реченню — сайт має темп дегустаційного меню.",
    },
    features: [
      { en: "Separate pages for story, menu, experience, gallery, reservations and contact", uk: "Окремі сторінки історії, меню, досвіду, галереї, бронювання й контактів" },
      { en: "Menu with categories and deep links to individual dishes and the cocktail list", uk: "Меню з категоріями та прямими посиланнями на окремі страви й коктейльну карту" },
      { en: "Reservation flow: date, seating and a table chosen on an interactive floor plan", uk: "Бронювання: дата, час і столик, обраний на інтерактивному плані зали" },
      { en: "Private dining inquiry section", uk: "Розділ запиту на приватну вечерю" },
    ],
    interactions: [
      { en: "Bookings and inquiries are stored in the visitor’s browser as a demonstration", uk: "Бронювання й запити зберігаються в браузері відвідувача як демонстрація" },
      { en: "Skip-to-content link and a dedicated mobile menu", uk: "Посилання «Перейти до вмісту» та окреме мобільне меню" },
    ],
    stack: ["Next.js"],
    languages: { en: "English", uk: "Англійська" },
    note: {
      en: "NOIR is a fictional restaurant. Reservations and messages stay in the browser; nothing is sent.",
      uk: "NOIR — вигаданий ресторан. Бронювання й повідомлення лишаються в браузері; нічого не надсилається.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "menu", caption: { en: "The menu", uk: "Меню" } },
      { key: "reservations", caption: { en: "Reservations with a table plan", uk: "Бронювання з планом зали" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile homepage", uk: "Головна на мобільному" } },
      { key: "m-reservations", caption: { en: "Mobile reservations", uk: "Бронювання на мобільному" } },
    ],
  }),
  P({
    slug: "nova-detailing",
    shotsKey: "nova-detailing",
    name: "NOVA Detailing",
    url: "https://nova-deteiling.vercel.app/",
    category: { en: "Automotive / Premium Services", uk: "Автомобілі / Преміальні послуги" },
    tint: "#cfae74",
    tone: "light",
    summary: {
      en: "A one-page studio site for premium car detailing — services, packages, a drag-to-compare before/after gallery and an appointment request form.",
      uk: "Односторінковий сайт студії преміального детейлінгу — послуги, пакети, галерея «до/після» з повзунком і форма запису.",
    },
    overview: {
      en: "NOVA is built to turn a visit into a booking. Six services with starting prices, three fixed packages, a before/after comparison of a ceramic-coated car and a booking form that pre-fills the chosen service — all on a single, fast page.",
      uk: "NOVA створений, щоб перетворити відвідування на запис. Шість послуг зі стартовими цінами, три фіксовані пакети, порівняння «до/після» авто з керамічним покриттям і форма запису, що підставляє обрану послугу, — усе на одній швидкій сторінці.",
    },
    direction: {
      en: "Showroom darkness, a classical serif in capitals and brushed-gold buttons. The tone is precise and understated — it sells care rather than shine.",
      uk: "Темрява шоуруму, класичний серіф у великих літерах і кнопки кольору матового золота. Тон точний і стриманий — він продає турботу, а не блиск.",
    },
    features: [
      { en: "Six services with starting prices and direct “Book this service” actions", uk: "Шість послуг зі стартовими цінами та кнопками «Записатися на послугу»" },
      { en: "Basic, Pro and Premium packages", uk: "Пакети Basic, Pro та Premium" },
      { en: "Before/after comparison slider — draggable, and usable with arrow keys", uk: "Слайдер порівняння «до/після» — перетягуванням і стрілками клавіатури" },
      { en: "Appointment request form with service, date and time selection and a confirmation state", uk: "Форма запису з вибором послуги, дати й часу та станом підтвердження" },
    ],
    interactions: [
      { en: "Skip link, anchored one-page navigation and a mobile menu", uk: "Посилання для пропуску, якірна навігація та мобільне меню" },
      { en: "Structured data for local business search", uk: "Структуровані дані для локального пошуку" },
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    languages: { en: "English", uk: "Англійська" },
    note: {
      en: "Concept website: the studio, contacts and reviews shown on the site are part of the concept.",
      uk: "Концепт-сайт: студія, контакти й відгуки на сайті є частиною концепту.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "packages", caption: { en: "Packages", uk: "Пакети" } },
      { key: "gallery", caption: { en: "Before & after comparison", uk: "Порівняння «до і після»" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile hero", uk: "Перший екран на мобільному" } },
      { key: "m-booking", caption: { en: "Mobile booking form", uk: "Форма запису на мобільному" } },
    ],
  }),
  P({
    slug: "coffee-studio",
    shotsKey: "coffee-studio",
    name: "Coffee Studio",
    url: "https://coffee-studio-delta.vercel.app/",
    category: { en: "Coffee Shop / Hospitality", uk: "Кав’ярня / Гостинність" },
    tint: "#b8692f",
    tone: "dark",
    summary: {
      en: "A warm, editorial one-page site for a specialty coffee shop — filterable menu, story, signature drinks, gallery with lightbox and a visit section.",
      uk: "Тепла редакційна односторінкова сторінка спешелті-кав’ярні — меню з фільтрами, історія, авторські напої, галерея з лайтбоксом і розділ «Як знайти».",
    },
    overview: {
      en: "Coffee Studio is a small, fast site with a big atmosphere. The page is prerendered to static HTML at build time and hydrated in the browser, so the first paint is instant and the menu filters still feel like an app.",
      uk: "Coffee Studio — невеликий швидкий сайт із великою атмосферою. Сторінка пререндериться у статичний HTML під час збірки й гідратується в браузері: перший показ миттєвий, а фільтри меню працюють як у застосунку.",
    },
    direction: {
      en: "Espresso browns, cream type and a copper accent. An arched hero image and a classic serif with italic emphasis make it feel like a printed café card.",
      uk: "Кавово-коричневі тони, кремовий текст і мідний акцент. Арочне фото на першому екрані та класичний серіф із курсивними акцентами нагадують друковану картку кав’ярні.",
    },
    features: [
      { en: "Menu with photo cards and category filters (espresso, filter, cold, signature, pastry)", uk: "Меню з фотокартками та фільтрами категорій (еспресо, фільтр, холодні, авторські, випічка)" },
      { en: "Story, signature drinks, gallery with lightbox, reviews and location & hours", uk: "Історія, авторські напої, галерея з лайтбоксом, відгуки, адреса й години роботи" },
      { en: "Contact and newsletter forms with validation (demo — nothing is sent)", uk: "Контактна форма й підписка з валідацією (демо — нічого не надсилається)" },
      { en: "Prerendered static HTML with hydration", uk: "Пререндер у статичний HTML із гідратацією" },
    ],
    interactions: [
      { en: "Ukrainian / English switcher, remembered between visits", uk: "Перемикач української / англійської, що запам’ятовує вибір" },
      { en: "Responsive from 320 px; respects reduced motion; checked with axe-core", uk: "Адаптивність від 320 px; підтримка reduced motion; перевірено axe-core" },
    ],
    stack: ["React 18", "Vite", "TypeScript", "CSS"],
    languages: { en: "Ukrainian · English", uk: "Українська · англійська" },
    note: {
      en: "Fictional coffee shop: address, contacts and reviews are placeholders; forms do not send data.",
      uk: "Вигадана кав’ярня: адреса, контакти й відгуки — заглушки; форми не надсилають дані.",
    },
    hero: "home",
    long: "home-long",
    gallery: [
      { key: "menu", caption: { en: "Menu with category filters", uk: "Меню з фільтрами категорій" } },
      { key: "gallery", caption: { en: "Gallery", uk: "Галерея" } },
    ],
    mobile: [
      { key: "m-home", caption: { en: "Mobile hero", uk: "Перший екран на мобільному" } },
      { key: "m-menu", caption: { en: "Mobile menu", uk: "Меню на мобільному" } },
    ],
  }),
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function shot(project: Project, key: string): Shot {
  const s = (shots as Record<string, Record<string, Shot>>)[project.shotsKey]?.[key];
  if (!s) throw new Error(`Missing screenshot ${project.shotsKey}/${key}`);
  return s;
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
