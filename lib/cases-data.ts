import type { Locale } from '@/i18n/locales';

export type CaseData = {
  slug: string;
  name: string;
  summary: string;
  result: string;
  thumbnail: string;
  url?: string;
  stack: string[];
  detail: {
    heroTitle: string;
    heroSubtitle: string;
    metrics: { label: string; value: string }[];
    gallery: { src: string; alt: string }[];
    stack: string[];
    sections: { title: string; body: string[] }[];
    cta: string;
  };
};

export type CasesContentData = {
  label: string;
  title: string;
  subtitle: string;
  detailLink: string;
  cta: string;
  backLink: string;
  items: CaseData[];
};

export type PortfolioContentData = {
  label: string;
  title: string;
  subtitle: string;
  cta: string;
};

type CasesDataset = {
  cases: CasesContentData;
  portfolio: PortfolioContentData;
};

export const CASES_DATA: Record<Locale, CasesDataset> = {
  en: {
    cases: {
      label: "Launches",
      title: "Websites that started earning quickly",
      subtitle: "Sprint deliveries that combine strategy, UX, engineering and retention in under two weeks.",
      detailLink: "View breakdown",
      cta: "Plan my launch",
      backLink: "Back to launches",
      items: [
        {
          slug: "paparecipes",
          name: "PapaRecipes",
          summary: "Recipe blog relaunch with structured data and lightning-fast browsing.",
          result: "Organic visits grew 38%, and returning cooks now build weekly menus without leaving the site.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://paparecipes.com/",
          stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
          detail: {
            heroTitle: "PapaRecipes: from hobby blog to weekly meal planner",
            heroSubtitle: "We rebuilt the WordPress stack, automated recipe schema, and made mobile cooking frictionless.",
            metrics: [
              { label: "Organic traffic", value: "+38%" },
              { label: "Session duration", value: "׳2.1" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "PapaRecipes mobile menu" },
              { src: "/images/portfolio/case2.svg", alt: "Recipe filters interface" },
              { src: "/images/portfolio/case3.svg", alt: "Shopping list generator" }
            ],
            stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
            sections: [
              {
                title: "Challenge",
                body: [
                  "Pages loaded slowly and lacked structured markup, so Google buried the recipes.",
                  "Editors had to copy ingredients into multiple layouts, turning nightly updates into a slog."
                ]
              },
              {
                title: "Approach",
                body: [
                  "Launched a modular WordPress theme with cached blocks and Cloudflare image optimisation.",
                  "Hooked WP Recipe Maker so nutrition, schema, and shopping lists populate automatically."
                ]
              },
              {
                title: "Outcome",
                body: [
                  "Readers save weekly meal plans in under a minute and share them straight to WhatsApp groups.",
                  "Editors publish new collections in 15 minutes instead of a weekend of manual formatting."
                ]
              }
            ],
            cta: "Need a tidy content engine? Let's talk."
          }
        },
        {
          slug: "gastro-kitchen",
          name: "Gastro Kitchen",
          summary: "Neighbourhood kitchen site that actually sells lunch specials.",
          result: "Same-day pick-up orders tripled once the menu, ordering, and payments lived on one page.",
          thumbnail: "/images/portfolio/case2.svg",
          url: "https://gastro.kitchen/",
          stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
          detail: {
            heroTitle: "Gastro Kitchen: lunch specials without the phone chaos",
            heroSubtitle: "We built a menu CMS, live inventory, and WhatsApp routing so staff see tickets instantly.",
            metrics: [
              { label: "Daily pick-up orders", value: "׳3.2" },
              { label: "Abandoned calls", value: "-68%" }
            ],
            gallery: [
              { src: "/images/portfolio/case2.svg", alt: "Gastro Kitchen lunch menu" },
              { src: "/images/portfolio/case3.svg", alt: "Stripe checkout for Gastro Kitchen" },
              { src: "/images/portfolio/case4.svg", alt: "WhatsApp order ticket" }
            ],
            stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
            sections: [
              {
                title: "Challenge",
                body: [
                  "Orders arrived via Instagram DMs and missed calls, so staff retyped everything by hand.",
                  "Menu changes lived on scraps of paper and guests never knew what was left."
                ]
              },
              {
                title: "Approach",
                body: [
                  "Connected Sanity CMS with stock toggles so dishes hide the moment portions run out.",
                  "Embedded Stripe prepay and routed quick-order buttons into WhatsApp with order context."
                ]
              },
              {
                title: "Outcome",
                body: [
                  "The kitchen starts the day with a real queue instead of surprise rushes.",
                  "Regulars add sides at checkout because the interface suggests yesterday’s best-sellers."
                ]
              }
            ],
            cta: "Ready for orders while you cook? Book a sprint."
          }
        },
        {
          slug: "globalgrillguide",
          name: "Global Grill Guide",
          summary: "BBQ resource turned into a shoppable grill companion.",
          result: "Affiliate revenue climbed 54% after structured reviews and calculators launched.",
          thumbnail: "/images/portfolio/case3.svg",
          url: "https://www.globalgrillguide.com/",
          stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
          detail: {
            heroTitle: "Global Grill Guide: reviews to weekend shopping lists",
            heroSubtitle: "We rewrote static articles into comparison flows, calculators, and geo-aware buying guides.",
            metrics: [
              { label: "Affiliate conversion", value: "+54%" },
              { label: "Time on page", value: "+47%" }
            ],
            gallery: [
              { src: "/images/portfolio/case3.svg", alt: "Global Grill Guide comparison table" },
              { src: "/images/portfolio/case4.svg", alt: "Thermometer calculator interface" },
              { src: "/images/portfolio/case1.svg", alt: "Regional grill availability map" }
            ],
            stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
            sections: [
              {
                title: "Challenge",
                body: [
                  "Readers scrolled long essays and bounced before the recommended gear appeared.",
                  "Editors tracked regional pricing in messy spreadsheets."
                ]
              },
              {
                title: "Approach",
                body: [
                  "Rebuilt content in MDX with component-based comparison tables and calculators.",
                  "Synced affiliate APIs and Algolia so visitors see stock and pricing for their region in seconds."
                ]
              },
              {
                title: "Outcome",
                body: [
                  "Weekend grillers leave with a shopping list tailored to their local store.",
                  "Editors update specs once and the tables, calculators, and CTAs refresh everywhere."
                ]
              }
            ],
            cta: "Let’s turn expertise into conversions."
          }
        },
        {
          slug: "chef-art",
          name: "Chef Art",
          summary: "Catering collective finally showcases menus the way they plate them.",
          result: "Event leads doubled within two months as planners bookmarked seasonal galleries.",
          thumbnail: "/images/portfolio/case4.svg",
          url: "http://chef-art.net/",
          stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
          detail: {
            heroTitle: "Chef Art: booking experiences, not just catering",
            heroSubtitle: "We gave the chefs a modular storytelling site with seasonal menus and instant lead routing.",
            metrics: [
              { label: "Qualified leads", value: "׳2" },
              { label: "Proposal turnaround", value: "-3 days" }
            ],
            gallery: [
              { src: "/images/portfolio/case4.svg", alt: "Chef Art tasting gallery" },
              { src: "/images/portfolio/case1.svg", alt: "Chef Art seasonal menu layout" },
              { src: "/images/portfolio/case2.svg", alt: "Chef Art inquiry dashboard" }
            ],
            stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
            sections: [
              {
                title: "Challenge",
                body: [
                  "The old Flash site broke on mobile and planners couldn’t download set menus.",
                  "Sales stitched together PDFs before every call."
                ]
              },
              {
                title: "Approach",
                body: [
                  "Moved storytelling to Nuxt with Contentful blocks the chefs update themselves.",
                  "Connected enquiry forms to MailerLite sequences and analytics tracking."
                ]
              },
              {
                title: "Outcome",
                body: [
                  "Planners explore seasonal menus and request tastings without waiting for a reply.",
                  "Sales responds same day with prefilled proposals and tracked follow-ups."
                ]
              }
            ],
            cta: "Want to book more events? Let’s craft it."
          }
        },
        {
          slug: "vered4u",
          name: "Vered4U",
          summary: "On-demand home services marketplace for the Sharon region.",
          result: "Providers confirm jobs 72% faster thanks to routing, CRM sync, and bilingual SMS updates.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://vered4u.co.il/",
          stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
          detail: {
            heroTitle: "Vered4U: marketplace that speaks the client’s language",
            heroSubtitle: "We built bilingual flows, CRM sync, and SMS loops so residents get confirmed pros in minutes.",
            metrics: [
              { label: "Quote-to-confirm time", value: "-72%" },
              { label: "Repeat bookings", value: "+33%" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "Vered4U homeowner dashboard" },
              { src: "/images/portfolio/case2.svg", alt: "Vered4U provider acceptance screen" },
              { src: "/images/portfolio/case3.svg", alt: "Bilingual SMS updates" }
            ],
            stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
            sections: [
              {
                title: "Challenge",
                body: [
                  "Requests came through forms, calls, and WhatsApp with no central tracking.",
                  "Vendors answered late because they never saw new leads in time."
                ]
              },
              {
                title: "Approach",
                body: [
                  "Built a Next.js dashboard on Supabase syncing every lead directly into HubSpot.",
                  "Automated SMS nudges in Hebrew and English so providers claim jobs instantly."
                ]
              },
              {
                title: "Outcome",
                body: [
                  "Residents get matched within 15 minutes and see status without calling again.",
                  "Operations watch capacity in real time and pause categories before quality slips."
                ]
              }
            ],
            cta: "Let’s automate your marketplace."
          }
        }
      ]
    },
    portfolio: {
      label: "Highlights",
      title: "A sample of our launch sprints",
      subtitle: "Explore how we combine strategy, design, engineering and media to deliver outcomes fast.",
      cta: "Open project"
    }
  },
  ru: {
    cases: {
      label: "Кейсы",
      title: "Запуски, которые уже работают",
      subtitle: "Спринты, где стратегия, UX, разработка и удержание собираются за 1–2 недели.",
      detailLink: "Смотреть разбор",
      cta: "Запустить с 5SOLO",
      backLink: "Назад к кейсам",
      items: [
        {
          slug: "paparecipes",
          name: "PapaRecipes",
          summary: "Перезапустили блог с рецептами с расширенной схемой и мгновенной загрузкой.",
          result: "Органический трафик вырос на 38%, постоянные читатели собирают меню прямо на сайте.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://paparecipes.com/",
          stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
          detail: {
            heroTitle: "PapaRecipes: от хобби-блога к еженедельному меню",
            heroSubtitle: "Перестроили WordPress, автоматизировали schema рецептов и сделали мобильное приготовление без трения.",
            metrics: [
              { label: "Органический трафик", value: "+38%" },
              { label: "Длительность сессии", value: "x2.1" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "Мобильное меню PapaRecipes" },
              { src: "/images/portfolio/case2.svg", alt: "Интерфейс фильтров рецептов" },
              { src: "/images/portfolio/case3.svg", alt: "Генератор списка покупок" }
            ],
            stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
            sections: [
              {
                title: "Задача",
                body: [
                  "Страницы грузились медленно и без schema, поэтому Google прятал рецепты.",
                  "Редакторам приходилось копировать ингредиенты в разные блоки, ночные обновления занимали часы."
                ]
              },
              {
                title: "Подход",
                body: [
                  "Собрали модульную тему WordPress с кешированными блоками и оптимизацией изображений Cloudflare.",
                  "Интегрировали WP Recipe Maker, чтобы питательные данные, schema и списки покупок появлялись автоматически."
                ]
              },
              {
                title: "Результат",
                body: [
                  "Читатели собирают недельное меню меньше чем за минуту и делятся им в группах WhatsApp.",
                  "Редакция выпускает подборки за 15 минут вместо выходных, потраченных на ручную верстку."
                ]
              }
            ],
            cta: "Нужен аккуратный контент-поток? Давайте обсудим."
          }
        },
        {
          slug: "gastro-kitchen",
          name: "Gastro Kitchen",
          summary: "Сайт соседского бистро, который действительно продает ланчи.",
          result: "Заказы на самовывоз выросли в 3,2 раза, меню, оплата и доставка живут на одной странице.",
          thumbnail: "/images/portfolio/case2.svg",
          url: "https://gastro.kitchen/",
          stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
          detail: {
            heroTitle: "Gastro Kitchen: ланчи без телефонного хаоса",
            heroSubtitle: "Собрали CMS меню, учет остатков и маршрутизацию WhatsApp, чтобы команда видела заказы сразу.",
            metrics: [
              { label: "Ежедневные заказы на самовывоз", value: "x3.2" },
              { label: "Пропущенные звонки", value: "-68%" }
            ],
            gallery: [
              { src: "/images/portfolio/case2.svg", alt: "Меню обедов Gastro Kitchen" },
              { src: "/images/portfolio/case3.svg", alt: "Оплата Stripe для Gastro Kitchen" },
              { src: "/images/portfolio/case4.svg", alt: "Заказ в WhatsApp" }
            ],
            stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
            sections: [
              {
                title: "Задача",
                body: [
                  "Заказы приходили через Instagram и пропущенные звонки, всё переписывали вручную.",
                  "Меню обновляли на листках бумаги, гости не знали, что осталось."
                ]
              },
              {
                title: "Подход",
                body: [
                  "Связали Sanity CMS с учетом остатков — блюда скрываются, когда порции заканчиваются.",
                  "Добавили предоплату Stripe и быстрые кнопки в WhatsApp с контекстом заказа."
                ]
              },
              {
                title: "Результат",
                body: [
                  "Кухня начинает день с понятной очереди вместо хаотичных наплывов.",
                  "Постоянные гости добавляют гарниры на чекауте — интерфейс предлагает вчерашние хиты."
                ]
              }
            ],
            cta: "Хотите принимать заказы прямо во время готовки? Забронируйте спринт."
          }
        },
        {
          slug: "globalgrillguide",
          name: "Global Grill Guide",
          summary: "BBQ-гид превратился в интерактивного помощника по выбору грилей.",
          result: "Партнерская выручка выросла на 54% после запуска структурированных обзоров и калькуляторов.",
          thumbnail: "/images/portfolio/case3.svg",
          url: "https://www.globalgrillguide.com/",
          stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
          detail: {
            heroTitle: "Global Grill Guide: от обзоров к спискам покупок за выходные",
            heroSubtitle: "Переписали длинные статьи в сравнения, калькуляторы и гиды с учетом региона и наличия.",
            metrics: [
              { label: "Конверсия партнёрок", value: "+54%" },
              { label: "Время на странице", value: "+47%" }
            ],
            gallery: [
              { src: "/images/portfolio/case3.svg", alt: "Таблица сравнения Global Grill Guide" },
              { src: "/images/portfolio/case4.svg", alt: "Интерфейс калькулятора температур" },
              { src: "/images/portfolio/case1.svg", alt: "Карта наличия грилей по регионам" }
            ],
            stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
            sections: [
              {
                title: "Задача",
                body: [
                  "Читатели терялись в длинных текстах и уходили до того, как видели рекомендованную технику.",
                  "Редакторы отслеживали цены по регионам в громоздких таблицах."
                ]
              },
              {
                title: "Подход",
                body: [
                  "Пересобрали контент в MDX с компонентами сравнений и калькуляторов.",
                  "Подключили Algolia и партнерские API, чтобы цены и доступность обновлялись автоматически."
                ]
              },
              {
                title: "Результат",
                body: [
                  "Пользователи сравнивают модели за пару кликов и сохраняют списки покупок.",
                  "Редакция видит востребованные модели по регионам без ручных сводок."
                ]
              }
            ],
            cta: "Готовите партнерский проект? Поможем вывести монетизацию."
          }
        },
        {
          slug: "chef-art",
          name: "Chef Art",
          summary: "Персональный сайт шефа с продажами дегустаций и мастер-классов.",
          result: "Лиды на мероприятия удвоились за два месяца, команда обрабатывает запросы без ручных PDF.",
          thumbnail: "/images/portfolio/case4.svg",
          url: "http://chef-art.net/",
          stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
          detail: {
            heroTitle: "Chef Art: бронируем впечатления, а не только кейтеринг",
            heroSubtitle: "Сделали модульный сайт-историю с сезонными меню и мгновенной маршрутизацией заявок.",
            metrics: [
              { label: "Квалифицированные лиды", value: "x2" },
              { label: "Скорость подготовки предложений", value: "-3 дня" }
            ],
            gallery: [
              { src: "/images/portfolio/case4.svg", alt: "Галерея дегустаций Chef Art" },
              { src: "/images/portfolio/case1.svg", alt: "Сезонное меню Chef Art" },
              { src: "/images/portfolio/case2.svg", alt: "Дашборд заявок Chef Art" }
            ],
            stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
            sections: [
              {
                title: "Задача",
                body: [
                  "Старый Flash-сайт не работал на мобильных, а организаторы не могли скачать меню.",
                  "Отдел продаж собирал PDF перед каждым звонком."
                ]
              },
              {
                title: "Подход",
                body: [
                  "Перенесли сторителлинг на Nuxt с блоками Contentful, которые команда обновляет сама.",
                  "Интегрировали формы с цепочками MailerLite и аналитикой."
                ]
              },
              {
                title: "Результат",
                body: [
                  "Организаторы изучают сезонные меню и оставляют заявки без ожиданий.",
                  "Отдел продаж отвечает в день обращения с готовыми предложениями и отслеживает фоллоу-апы."
                ]
              }
            ],
            cta: "Хотите бронировать больше событий? Создадим систему."
          }
        },
        {
          slug: "vered4u",
          name: "Vered4U",
          summary: "Маркетплейс бытовых услуг для региона Шарон.",
          result: "Подрядчики подтверждают заказы на 72% быстрее благодаря маршрутизации, CRM и SMS на двух языках.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://vered4u.co.il/",
          stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
          detail: {
            heroTitle: "Vered4U: сервисы на дому под контролем",
            heroSubtitle: "Синхронизировали заявки из WhatsApp, сайта и CRM, чтобы диспетчеры не теряли лиды.",
            metrics: [
              { label: "Время подтверждения заявки", value: "-72%" },
              { label: "Повторные обращения", value: "+33%" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "Главная Vered4U" },
              { src: "/images/portfolio/case2.svg", alt: "Кабинет подрядчика Vered4U" },
              { src: "/images/portfolio/case3.svg", alt: "SMS-уведомление Vered4U" }
            ],
            stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
            sections: [
              {
                title: "Задача",
                body: [
                  "Заявки терялись между звонками, WhatsApp и формами.",
                  "Подрядчики не знали, какие заказы в приоритете."
                ]
              },
              {
                title: "Подход",
                body: [
                  "Связали Next.js и Supabase с HubSpot, вывели единую очередь заказов.",
                  "Настроили SMS на иврите и русском для подтверждения визитов."
                ]
              },
              {
                title: "Результат",
                body: [
                  "Подрядчики подтверждают заявки за 15 минут вместо часа.",
                  "Диспетчеры видят загрузку и планируют смены без хаоса."
                ]
              }
            ],
            cta: "Нужна прозрачная логистика услуг? Решим задачу."
          }
        }
      ]
    },
    portfolio: {
      label: "Портфолио",
      title: "Свежие запуски последних месяцев",
      subtitle: "Как мы объединяем стратегию, дизайн, разработку и продвижение, чтобы быстро выйти в прод.",
      cta: "Открыть проект"
    }
  },
  he: {
    cases: {
      label: "השקות",
      title: "אתרים שמתחילים להכניס כסף מהר",
      subtitle: "ספרינטים שמאחדים אסטרטגיה, UX, פיתוח ושימור תוך פחות משבועיים.",
      detailLink: "לצפות בפירוט",
      cta: "לתכנן את ההשקה שלי",
      backLink: "חזרה להשקות",
      items: [
        {
          slug: "paparecipes",
          name: "PapaRecipes",
          summary: "החזרנו לחיים בלוג מתכונים עם סכמת נתונים וטעינה מהירה במיוחד.",
          result: "התנועה האורגנית עלתה ב-38%, וטבחים חוזרים מרכיבים תפריטים שבועיים בלי לצאת מהאתר.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://paparecipes.com/",
          stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
          detail: {
            heroTitle: "PapaRecipes: מבלוג תחביב למתכנן ארוחות שבועי",
            heroSubtitle: "שדרגנו את WordPress, אוטומטנו סכמת מתכונים ויצרנו חוויית מובייל חלקה.",
            metrics: [
              { label: "תנועה אורגנית", value: "+38%" },
              { label: "משך ביקור", value: "x2.1" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "תפריט מובייל של PapaRecipes" },
              { src: "/images/portfolio/case2.svg", alt: "ממשק סינון מתכונים" },
              { src: "/images/portfolio/case3.svg", alt: "יוצר רשימת קניות" }
            ],
            stack: ["WordPress", "WP Recipe Maker", "Cloudflare CDN"],
            sections: [
              {
                title: "האתגר",
                body: [
                  "הדפים נטענו לאט וללא סכמת נתונים, ולכן Google קבר את המתכונים.",
                  "העורכים העתיקו מצרכים בין בלוקים שונים והעדכונים הליליים נמשכו שעות."
                ]
              },
              {
                title: "הגישה",
                body: [
                  "בנינו ערכת נושא מודולרית ב-WordPress עם בלוקים שמורים ואופטימיזציית תמונות של Cloudflare.",
                  "חיברנו את WP Recipe Maker כדי שערכים תזונתיים, schema ורשימות קניות יתמלאו אוטומטית."
                ]
              },
              {
                title: "התוצאה",
                body: [
                  "הקוראים מרכיבים תפריט שבועי בפחות מדקה ומשתפים אותו בקבוצות WhatsApp.",
                  "העורכים מפרסמים אוספים ב-15 דקות במקום סוף שבוע של עימוד ידני."
                ]
              }
            ],
            cta: "צריכים מנוע תוכן מסודר? נדבר."
          }
        },
        {
          slug: "gastro-kitchen",
          name: "Gastro Kitchen",
          summary: "אתר למטבח שכונתי שמוכר באמת עסקיות צהריים.",
          result: "הזמנות איסוף באותו יום גדלו פי 3.2 כשהתפריט, ההזמנה והתשלום עברו לעמוד אחד.",
          thumbnail: "/images/portfolio/case2.svg",
          url: "https://gastro.kitchen/",
          stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
          detail: {
            heroTitle: "Gastro Kitchen: עסקיות בלי כאוס טלפוני",
            heroSubtitle: "בנינו CMS לתפריט, ניהול מלאי והפניית הזמנות ל-WhatsApp כדי שהצוות יראה הכל מיד.",
            metrics: [
              { label: "הזמנות יומיות לאיסוף", value: "x3.2" },
              { label: "שיחות נטושות", value: "-68%" }
            ],
            gallery: [
              { src: "/images/portfolio/case2.svg", alt: "תפריט צהריים של Gastro Kitchen" },
              { src: "/images/portfolio/case3.svg", alt: "תשלום Stripe ל-Gastro Kitchen" },
              { src: "/images/portfolio/case4.svg", alt: "כרטיס הזמנה ב-WhatsApp" }
            ],
            stack: ["Next.js", "Sanity CMS", "Stripe", "WhatsApp Business"],
            sections: [
              {
                title: "האתגר",
                body: [
                  "הזמנות הגיעו מ-DM באינסטגרם ומשיחות שלא נענו, והצוות העתיק ידנית כל פרט.",
                  "שינויים בתפריט נרשמו על פתקים ואורחים לא ידעו מה נשאר."
                ]
              },
              {
                title: "הגישה",
                body: [
                  "חיברנו את Sanity CMS לניהול מלאי — מנות נעלמות כשהמלאי נגמר.",
                  "הוספנו תשלום מקדים ב-Stripe וכפתורי הזמנה מהירה ל-WhatsApp עם כל ההקשר."
                ]
              },
              {
                title: "התוצאה",
                body: [
                  "הצוות מתחיל את היום עם תור מסודר במקום עומסים מפתיעים.",
                  "לקוחות קבועים מוסיפים תוספות בקופה כי הממשק מציע את להיטי האתמול."
                ]
              }
            ],
            cta: "רוצים לקבל הזמנות בזמן הבישול? נריץ את הספרינט."
          }
        },
        {
          slug: "globalgrillguide",
          name: "Global Grill Guide",
          summary: "פורטל ה-BBQ הפך לכלי קנייה אינטראקטיבי.",
          result: "הכנסות אפיליאייט עלו ב-54% אחרי שהשקנו ביקורות מובְנות ומחשבוני רכישה.",
          thumbnail: "/images/portfolio/case3.svg",
          url: "https://www.globalgrillguide.com/",
          stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
          detail: {
            heroTitle: "Global Grill Guide: מהשוואות לרשימות קנייה לסוף השבוע",
            heroSubtitle: "הפכנו מאמרים סטטיים לזרימות השוואה, מחשבונים ומדריכי רכישה לפי מיקום.",
            metrics: [
              { label: "המרת אפיליאייט", value: "+54%" },
              { label: "זמן בדף", value: "+47%" }
            ],
            gallery: [
              { src: "/images/portfolio/case3.svg", alt: "טבלת השוואה ב-Global Grill Guide" },
              { src: "/images/portfolio/case4.svg", alt: "ממשק מחשבון טמפרטורה" },
              { src: "/images/portfolio/case1.svg", alt: "מפת זמינות אזורית של גרילים" }
            ],
            stack: ["Next.js", "MDX", "Affiliate APIs", "Algolia"],
            sections: [
              {
                title: "האתגר",
                body: [
                  "הקוראים גללו מאמרים ארוכים ויצאו לפני שראו את ההמלצות.",
                  "העורכים ניהלו מחירי אזורים בגיליונות מסורבלים."
                ]
              },
              {
                title: "הגישה",
                body: [
                  "כתבנו מחדש את התוכן ב-MDX עם קומפוננטים של טבלאות השוואה ומחשבונים.",
                  "חיברנו Algolia ו-API של שותפים כדי לעדכן זמינות ומחיר בזמן אמת."
                ]
              },
              {
                title: "התוצאה",
                body: [
                  "משתמשים משווים דגמים בכמה קליקים ושומרים רשימות קנייה.",
                  "הצוות רואה אילו דגמים בולטים בכל אזור בלי עבודה ידנית."
                ]
              }
            ],
            cta: "בונים פרויקט אפיליאייט? נסייע למקסם הכנסות."
          }
        },
        {
          slug: "chef-art",
          name: "Chef Art",
          summary: "אתר אישי לשף שמוכר סדנאות וחוויות טעימה.",
          result: "לידים לאירועים הוכפלו בתוך חודשיים והצוות נפרד מ-PDF ידניים.",
          thumbnail: "/images/portfolio/case4.svg",
          url: "http://chef-art.net/",
          stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
          detail: {
            heroTitle: "Chef Art: חוויה מזמינים, לא רק קייטרינג",
            heroSubtitle: "יצרנו אתר מודולרי שמספר סיפור עם תפריטים עונתיים וניתוב לידים מיידי.",
            metrics: [
              { label: "לידים איכותיים", value: "x2" },
              { label: "זמן תגובה להצעה", value: "-3 ימים" }
            ],
            gallery: [
              { src: "/images/portfolio/case4.svg", alt: "גלריית טעימות של Chef Art" },
              { src: "/images/portfolio/case1.svg", alt: "עיצוב תפריט עונתי של Chef Art" },
              { src: "/images/portfolio/case2.svg", alt: "לוח ניהול פניות של Chef Art" }
            ],
            stack: ["Nuxt", "Contentful", "MailerLite", "Analytics"],
            sections: [
              {
                title: "האתגר",
                body: [
                  "האתר הישן ב-Flash קרס במובייל ומנהלי אירועים לא יכלו להוריד תפריטים.",
                  "המכירות חיברו PDF חדש לפני כל שיחה."
                ]
              },
              {
                title: "הגישה",
                body: [
                  "העברנו את הסיפור ל-Nuxt עם בלוקים ב-Contentful שהצוות מעדכן לבד.",
                  "חיברנו טפסים לרצפים ב-MailerLite ולמדדי אנליטיקה."
                ]
              },
              {
                title: "התוצאה",
                body: [
                  "מנהלי אירועים עוברים על התפריטים ומשאירים בקשות בלי להמתין.",
                  "הצוות מגיב באותו היום עם הצעות מוכנות ומעקב מסודר."
                ]
              }
            ],
            cta: "רוצים לסגור יותר אירועים? נבנה את המערכת."
          }
        },
        {
          slug: "vered4u",
          name: "Vered4U",
          summary: "שוק שירותי בית לאזור השרון.",
          result: "ספקים מאשרים עבודות ב-72% מהר יותר בזכות ניתוב, CRM ו-SMS דו-לשוניים.",
          thumbnail: "/images/portfolio/case1.svg",
          url: "https://vered4u.co.il/",
          stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
          detail: {
            heroTitle: "Vered4U: ניהול שירותים לבית בלי לפספס ליד",
            heroSubtitle: "איחדנו פניות מ-WhatsApp, האתר וה-CRM כדי שהדיספטצ'רים ישלטו בתור.",
            metrics: [
              { label: "זמן אישור פנייה", value: "-72%" },
              { label: "פניות חוזרות", value: "+33%" }
            ],
            gallery: [
              { src: "/images/portfolio/case1.svg", alt: "דף הבית של Vered4U" },
              { src: "/images/portfolio/case2.svg", alt: "לוח ספקים של Vered4U" },
              { src: "/images/portfolio/case3.svg", alt: "התראה ב-SMS של Vered4U" }
            ],
            stack: ["Next.js", "Supabase", "SMS API", "HubSpot"],
            sections: [
              {
                title: "האתגר",
                body: [
                  "לידים התפזרו בין שיחות, WhatsApp וטפסים.",
                  "הספקים לא ידעו אילו עבודות דחופות."
                ]
              },
              {
                title: "הגישה",
                body: [
                  "חיברנו Next.js ו-Supabase ל-HubSpot ויצרנו תור מרכזי להזמנות.",
                  "הגדרנו SMS בעברית וברוסית כדי לאשר ביקורים."
                ]
              },
              {
                title: "התוצאה",
                body: [
                  "ספקים מאשרים עבודות בתוך 15 דקות במקום שעה.",
                  "הדיספטצ'רים רואים עומסים ומחלקים משמרות בלי כאוס."
                ]
              }
            ],
            cta: "צריך תפעול שקוף לשירותים? נדאג לזה."
          }
        }
      ]
    },
    portfolio: {
      label: "פורטפוליו",
      title: "השקות אחרונות שלנו",
      subtitle: "כך אנחנו משלבים אסטרטגיה, עיצוב, פיתוח ומדיה כדי לספק תוצאה במהירות.",
      cta: "לפתוח את הפרויקט"
    }
  }
};
