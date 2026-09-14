# Slyshno — контекст проекта

## Что это

SaaS для сбора фидбека: публичная доска + виджет-embed + роадмап + чейнджлог с
авторассылкой. Позиционирование: «Canny, но дешевле, на русском». Рынки: RU и
global. Прайсинг: Free (1 проект, 100 голосов/мес) + Pro $10/мес (на аккаунт).
Pro-фичи «скоро» (бейдж Coming soon): снятие брендинга, кастомный домен, SSO,
интеграции. Оплата: Lemon Squeezy (Молдова). Домен: slyshno.app.

## Деплой (АКТУАЛЬНО)

- Прод: **Vercel (Hobby) + Neon Postgres** (Frankfurt, pooled connection string)
- Локально: Docker Postgres (порт 5435, dev), Neon — ТОЛЬКО в Vercel env vars
- Plan B (когда Vercel подорожает / нужен MCP-сервер / кастомные домена
  клиентов): Contabo VPS + Caddy — файлы готовы: Dockerfile (standalone),
  docker-compose.prod.yml, Caddyfile
- Схема на прод: drizzle-kit push через DATABASE_URL от Neon (одноразово)
- Outbox-cron на проде: cron-job.org → GET /api/cron/outbox раз в минуту с
  заголовком x-cron-secret

## Стек (зафиксирован)

- Next.js 16 (App Router, Turbopack dev) + TypeScript, `output: 'standalone'`
- Better Auth (Google OAuth + email/password; requireEmailVerification: false)
- Drizzle ORM + PostgreSQL (dev: Docker 5435; prod: Neon pooled)
- Tailwind v4 + семантические токены + Geist + lucide-react + motion.dev +
  @dnd-kit/core + papaparse
- Fumadocs: fumadocs-core@14 / fumadocs-ui@14 / fumadocs-mdx@11 (v15+ НЕ
  обновлять)
- Письма: Resend (from onboarding@resend.dev), очередь = outbox + cron-роут
- Платежи: @lemonsqueezy/lemonsqueezy.js

## Структура

- src/db/schema.ts — projects(+website,+plan), boards, posts(+type), votes,
  comments(+authorName), post_subscriptions, outbox, changelog_posts,
  subscriptions(+renewsAt,+endsAt)
- src/lib/ — auth, auth-client, db, session, docs-source, email
- src/app/(app)/ — приложение с сайдбаром (layout проверяет сессию): dashboard,
  dashboard/p/[slug] (Feedback, roadmap dnd, post/[id], changelog,
  settings/{brand,domain,imports,account})
- src/app/(auth)/ — login, register (ВНЕ (app)!)
- src/app/new — онбординг (ВНЕ (app), полноэкранный)
- src/app/p/[slug] — публичный портал: доска, roadmap, changelog, changelog/[id]
  («В планах»), post/[id] (чат, гостевые комменты)
- src/app/widget — виджет-панель (5 экранов)
- src/app/docs — Fumadocs (контент: content/docs/\*.mdx в КОРНЕ проекта)
- src/app/page.tsx — лендинг (hero с мокапом hero-bg.webp, CTA с cta-bg.webp);
  src/app/pricing — цены
- src/i18n/ — context.tsx, server.ts, config.ts, dictionaries/{ru,en}.ts
- public/widget.js — лоадер: кнопка с лого (theme-aware: widget-icon-light.png
  для тёмной темы / widget-icon-dark.png для светлой), iframe, postMessage
  'slyshno:close'
- src/components/ — app-shell (секции навигации, isPro, UpgradeModal, lang
  switcher, SupportModal), feedback-workspace, owner-roadmap-board (dnd),
  board-view, portal-header, portal-actions, public-post, upgrade-modal,
  new-request-modal, post-comments, auth-form, account-form, sign-out-button,
  copy-button, settings-nav, import-csv-form, cancel-subscription-button,
  delete-post/project-button, support-modal, landing/\*

## Дизайн-система v2

Семантические токены: bg-background/surface(-hover), border(-soft/-strong),
text-fg/fg-secondary/fg-muted/fg-faint, bg-primary/text-primary-fg. Статусные
цвета — ТОЛЬКО для статусов. Rows &gt; cards. Темы light/dark/system: `.dark` на
&lt;html&gt;, localStorage 'slyshno-theme', next/script beforeInteractive. Гайд:
Orbit Design Template v2 (у пользователя).

## Биллинг (Lemon Squeezy)

- Store 473373, Variant 2120452 («Pro $10/month»)
- POST /api/billing/checkout — createCheckout(Number(STORE), Number(VARIANT),
  checkoutData: { email, custom: { project_id } } ← ОБЪЕКТ; redirectUrl ТОЛЬКО
  https)
- POST /api/billing/cancel — мягкая отмена (Pro до endsAt)
- POST /api/webhooks/lemonsqueezy — X-Signature HMAC-SHA256 timingSafeEqual;
  meta.custom_data.project_id; isProNow = active/past_due/on_trial && (!endsAt
  || endsAt &gt; now)
- Подписка на аккаунт; тестовая карта 4242 4242 4242 4242; test mode в LS
  Settings → Store

## Грабли (не наступать!)

1. drizzle.config.ts: в начале
   `import { config } from "dotenv"; config({ path: ".env.local" })`
2. В db.ts/auth.ts импорты schema — ОТНОСИТЕЛЬНЫЕ ("../db/schema")
3. drizzleAdapter: `{ provider: "pg", schema: authSchema }`; в drizzle() мержить
   обе схемы
4. Postgres dev-порт 5435; после перезагрузки машины: docker compose up -d
5. После правки .env.local — полный рестарт bun dev
6. useRouter только из next/navigation; инлайн-скрипты только через next/script;
   onClick только в клиентских компонентах
7. ВСЕ r.json() — с .catch(() =&gt; ({})) и проверкой r.ok (Next отдаёт HTML на
   ошибках → SyntaxError)
8. API-роуты с [slug] — точно по пути; публичные страницы НЕ в api/
9. Страницы без сайдбара — ВНЕ (app); вне проекта — только рабочие пункты
   навигации
10. События: 'slyshno:new-request', 'slyshno:upgrade', 'slyshno:support',
    postMessage 'slyshno:close' (виджет)
11. Logout — SignOutButton: try/finally + push('/') + refresh()
12. Fumadocs: данные из .source (import { docs } from '../../.source');
    RootProvider theme={{ themeScript: false }}
13. dnd-kit: distance 6 + select-none + draggable={false} на img +
    suppressHydrationWarning
14. LS SDK: custom = объект; meta.custom_data; Number() для ID; https redirect
15. i18n: сервер — const { t } = await getT(); клиент — useI18n(); тип
    DictionaryKey из ru.ts — забыл ключ в словаре = ошибка типа при build
16. АГЕНТАМ: .env.local НЕ ТРОГАТЬ (не создавать/не менять); dev-сервер только
    на порту 3100+, порт 3000 — пользователя; работать в своём ворктри и своей
    ветке
17. NEXT_PUBLIC_APP_URL / BETTER_AUTH_URL: localhost в dev, https://slyshno.app
    в проде; ngrok-URL — временный, вернуть localhost после тестов оплаты
18. Порядок приёма работы агента: СНАЧАЛА git log в его ворктри + push ветки,
    ПОТОМ merge. Никаких reset --hard до проверки его ветки

## Команды

- bun dev / bun run build / bun run test (Vitest, база slyshno_test)
- bunx drizzle-kit push
- docker compose up -d (dev Postgres)
- curl -H "x-cron-secret: $CRON_SECRET" localhost:3000/api/cron/outbox

## Прогресс

- [x] Всё приложение, публичный портал v2, виджет v2, лендинг, прайсинг, доки
- [x] Биллинг LS (checkout/webhook/мягкая отмена), Upgrade-модалка
- [x] Импорт CSV, удаления, поддержка (support-modal → outbox → email)
- [x] i18n RU+EN, тесты (18), брендированная кнопка виджета, фоны лендинга, Pro
      «coming soon» бейджи
- [ ] ДЕПЛОЙ (Vercel): env vars, домен slyshno.app, Google redirect URI, webhook
      LS на прод, cron-job.org, test mode OFF
- [x] Mobile adaptation — Codex (ветка feat/mobile, в работе)
- [ ] SEO — Claude (следующая задача, ветка feat/seo)
- [ ] v1.1: кастомный домен (Contabo+Caddy триггер миграции), вложения,
      Linear/Slack, bulk actions, шаблоны писем, видео-гайды, auto-detect языка
      портала, accent color, docs-хаб, search, MCP + mobile SDK, Apple/Google
      Pay в live, MDL→180, blogs

## Маркетинг-запуск

Product Hunt + build in public + Хабр/vc.ru + RU Telegram → аутрич 60
инди-продуктов (бесплатный Pro за фидбек) → SEO /alternatives/\*. Платной
рекламы нет до доказанной конверсии.

Обновлять каждые 2–3 чата. Блок nextjs-agent-rules не трогать.
