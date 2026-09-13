# Slyshno — контекст проекта

## Что это

SaaS для сбора фидбека: публичная доска + виджет-embed + роадмап + чейнджлог с
авторассылкой. Позиционирование: «Canny, но дешевле, на русском». Рынки: RU и
global. Прайсинг: Free (1 проект, 100 голосов/мес) + Pro $10/мес (на аккаунт,
все проекты юзера). Оплата: Lemon Squeezy (Молдова, live-режим после деплоя).
Домен: slyshno.app (Contabo VPS 12GB, Docker + Caddy).

## Стек (зафиксирован)

- Next.js 16 (App Router, Turbopack dev) + TypeScript, `output: 'standalone'`
- Better Auth (Google OAuth + email/password; requireEmailVerification: false)
- Drizzle ORM + PostgreSQL 16 (Docker, dev-порт 5435)
- Tailwind v4 + семантические токены (globals.css) + Geist + lucide-react
  - motion.dev + @dnd-kit/core + papaparse
- Fumadocs: fumadocs-core@14 / fumadocs-ui@14 / fumadocs-mdx@11 (v15+ НЕ
  обновлять — ломается API)
- Письма: Resend (from onboarding@resend.dev, для прода верифицировать домен),
  очередь = таблица outbox + cron-роут /api/cron/outbox
- Платежи: @lemonsqueezy/lemonsqueezy.js (checkout + cancel + webhook)

## Структура

- src/db/schema.ts — projects(+website,+plan), boards, posts(+type:
  feature|bug), votes(userId|guestKey), comments(+authorName),
  post_subscriptions, outbox, changelog_posts, subscriptions(+renewsAt,+endsAt)
- src/db/auth-schema.ts — Better Auth таблицы (генерируется CLI)
- src/lib/ — auth, auth-client, db, session, docs-source, email
- src/app/(app)/ — приложение с сайдбаром (layout проверяет сессию): dashboard,
  dashboard/p/[slug] (Feedback-воркспейс, roadmap с dnd, post/[id], changelog,
  settings/{brand,domain,imports,account})
- src/app/(auth)/ — login, register (вне (app)!)
- src/app/new — онбординг Create workspace (вне (app), полноэкранный)
- src/app/p/[slug] — публичный портал: доска (BoardView v2), roadmap, changelog,
  changelog/[id] («В планах»), post/[id] (чат, гостевые комменты)
- src/app/widget — виджет-панель (5 экранов:
  home/feedback/submit/roadmap/changelog)
- src/app/docs — Fumadocs (контент: content/docs/\*.mdx в КОРНЕ)
- src/app/page.tsx — лендинг; src/app/pricing — цены
- public/widget.js — виджет-лоадер (vanilla JS + iframe + postMessage close)
- src/components/ — app-shell (секции навигации, isPro, UpgradeModal через
  событие 'slyshno:upgrade'), feedback-workspace, owner-roadmap-board (dnd),
  board-view (портал v2), portal-header, portal-actions, public-post (чат),
  upgrade-modal, new-request-modal (+ событие 'slyshno:new-request'),
  post-comments, auth-form, account-form, sign-out-button, copy-button,
  settings-nav, import-csv-form, cancel-subscription-button,
  delete-post/project-button, landing/\*

## Дизайн-система v2

Семантические токены: bg-background/surface/surface-hover,
border(-soft/-strong), text-fg/fg-secondary/fg-muted/fg-faint,
bg-primary/text-primary-fg. Статусные цвета (amber/blue/violet/emerald) — ТОЛЬКО
для статусов. Rows &gt; cards, лейблы над инпутами, 44–52px контролы. Темы
light/dark/system: `.dark` на &lt;html&gt;, localStorage 'slyshno-theme',
theme-script через next/script beforeInteractive в корневом layout. Полный гайд:
Orbit Design Template v2 (у пользователя, бренд Orbit = плейсхолдер).

## Биллинг (Lemon Squeezy)

- Store 473373, Variant 2120452 («Pro $10/month», MDL ~180; setup fee ВЫКЛ)
- POST /api/billing/checkout — createCheckout(STORE, VARIANT как Number!, ...
  checkoutData: { email, custom: { project_id } } ← ОБЪЕКТ, не массив!)
  productOptions.redirectUrl — ОБЯЗАТЕЛЬНО https
- POST /api/billing/cancel — cancelSubscription(Number(id)); локально статус
  cancelled + endsAt; Pro держится до endsAt (мягкая отмена)
- POST /api/webhooks/lemonsqueezy — верификация X-Signature (HMAC-SHA256,
  timingSafeEqual); payload.meta.custom_data.project_id (ОБЪЕКТ!); события:
  subscription_created/updated/payment_success/cancelled/expired,
  order_refunded; PRO_STATUSES = active/past_due/on_trial; isProNow =
  PRO_STATUSES && (!endsAt || endsAt &gt; now); cancelled + будущий endsAt = Pro
  работает до конца периода
- Подписка = на аккаунт (isPro считается по всем проектам юзера, включая
  отменённые с будущим endsAt); в аккаунте показываем ОДНУ (active →
  cancelled+future endsAt → last)
- Тестовая карта 4242 4242 4242 4242; LS не даёт купить тот же вариант дважды
  одному email; test mode вкл/выкл в Settings → Store
- Env: LEMONSQUEEZY_API_KEY, STORE_ID, VARIANT_ID, WEBHOOK_SECRET (≤40 симв.)
- Webhook в LS: https://slyshno.app/api/webhooks/lemonsqueezy (прод; ngrok —
  только для локальной разработки, URL меняется на free-плане)

## Грабли (не наступать!)

1. drizzle.config.ts: в начале
   `import { config } from "dotenv"; config({ path: ".env.local" })`
2. В db.ts/auth.ts импорты schema — ОТНОСИТЕЛЬНЫЕ ("../db/schema"), не "@/…"
   (jiti)
3. drizzleAdapter: обязательно `{ provider: "pg", schema: authSchema }`; в
   drizzle() мержить обе схемы
4. Postgres dev-порт 5435 (5432 занят); после перезагрузки: docker compose up -d
5. После правки .env.local — полный рестарт bun dev
6. useRouter только из next/navigation; инлайн-скрипты только через next/script
   beforeInteractive; onClick только в клиентских компонентах
7. API-роуты с [slug] — точно по пути (проверка: find src/app/api -name
   route.ts); Next на 404 отдаёт HTML → клиент ловит .json().catch(() =&gt;
   ({})) и ВСЕГДА проверяет r.ok
8. Публичные страницы НЕ в api/ (конфликт page/route на одном пути)
9. Страницы без сайдбара — ВНЕ (app) (онбординг, auth); layout (app) редиректит
   неавторизованных
10. Вне проекта (нет slug) — только рабочие пункты навигации; Feedback ведёт на
    ленту последнего проекта (fallbackSlug из layout; при 1 проекте /dashboard
    редиректит сразу в него)
11. Composer открывается через CustomEvent('slyshno:new-request');
    Upgrade-модалка — 'slyshno:upgrade'; виджет закрывается postMessage
    'slyshno:close'
12. Logout — только SignOutButton: try/finally + router.push('/') + refresh()
13. Fumadocs: данные из сгенерированного .source (import { docs } from
    '../../.source'), НЕ из source.config.ts; layout fumadocs-ui/layouts/docs,
    слоты из layouts/docs/page; RootProvider theme={{ themeScript: false }}
    (свой theme-script уже в корневом layout)
14. dnd-kit: activationConstraint { distance: 6 } + select-none на карточках,
    draggable={false} на img, suppressHydrationWarning (aria-describedby
    DndDescribedBy-N расходится SSR/клиент)
15. LS SDK: custom = объект (не массив name/value); meta.custom_data (не
    meta.custom); ID через Number(); redirectUrl только https
16. Виджет в Firefox может блокироваться ETP/блокировщиками — тестировать в
    Chrome
17. i18n НЕТ — весь UI на русском (задача в очереди)

## Команды

- bun dev / bun run build
- bunx drizzle-kit push
- bunx @better-auth/cli generate --output ./src/db/auth-schema.ts
- docker compose up -d (dev Postgres)
- curl -H "x-cron-secret: $CRON_SECRET" localhost:3000/api/cron/outbox

## Прогресс

- [x] Всё приложение: Feedback, композер, карточка, чейнджлог, роадмап (dnd),
      Settings (brand/domain/imports/account), онбординг, auth-страницы
- [x] Публичный портал v2: BoardView, PortalHeader, чат с гостевыми
      комментариями, чейнджлог v2, виджет v2 (5 экранов)
- [x] Лендинг + прайсинг + доки (Fumadocs, хаб + 4 страницы)
- [x] Биллинг Lemon Squeezy: checkout, webhook, cancel (мягкая), upgrade-modal
- [x] Импорт CSV (Canny), удаление карточек/проектов
- [x] Деплой-файлы: Dockerfile (standalone), docker-compose.prod.yml, Caddyfile
- [ ] ДЕПЛОЙ: DNS A slyshno.app → Contabo, env.production, compose up, drizzle
      push, webhook URL на прод, LS test mode OFF
- [ ] i18n RU+EN (задача для агента)
- [ ] Тесты базовые (задача для агента)
- [ ] v1.1: кастомный домен (Caddy on-demand TLS), search, MCP + mobile SDK,
      Apple/Google Pay проверка в live, цена MDL→180

## Маркетинг-запуск

Product Hunt + build in public (Twitter) + Хабр/vc.ru + RU Telegram → личный
аутрич 60 инди-продуктов (бесплатный Pro за фидбек) → SEO-страницы
/alternatives/\*. Платной рекламы нет до доказанной конверсии.

Обновлять каждые 2–3 чата. Блок nextjs-agent-rules не трогать (пересоздаёт next
dev).
