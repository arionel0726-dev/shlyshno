import { LandingAuth } from '@/components/landing-auth'
import { FaqAccordion } from '@/components/landing/faq-accordion'
import { AppMock } from '@/components/landing/product-mock'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const OUTCOMES = [
	{
		title: 'Фидбек в одном месте',
		text: 'Запросы клиентов, идеи команды и внутренние инсайты — в одной системе.',
		marker: 'bg-orange-400'
	},
	{
		title: 'Приоритеты на виду',
		text: 'Показывайте, что на рассмотрении, в плане и в работе — все видят движение.',
		marker: 'bg-blue-500'
	},
	{
		title: 'Обновления доходят',
		text: 'Готовые фичи становятся чейнджлогом, подписчики узнают первыми.',
		marker: 'bg-violet-500'
	},
	{
		title: 'Цикл растёт сам',
		text: 'Видимый прогресс возвращает пользователей с голосами и комментариями.',
		marker: 'bg-emerald-500'
	}
]

const STEPS = [
	{
		title: 'Подтвердите запрос',
		text: 'Пользователь видит, что идея принята, и где следить за ней дальше.'
	},
	{
		title: 'Покажите прогресс',
		text: 'Смена статуса рассказывает историю: от рассмотрения до работы.'
	},
	{
		title: 'Закройте цикл релизом',
		text: 'Когда фича готова, все проголосовавшие получают письмо.'
	},
	{
		title: 'Возвращайте людей естественно',
		text: 'Голоса и обновления дают повод вернуться без спама.'
	}
]

export default async function Home() {
	const session = await getSession()
	if (session) redirect('/dashboard')

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader />

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
				<p className="text-xs font-medium tracking-widest text-fg-muted uppercase">
					Фидбек, роадмап и обновления — в одном месте
				</p>
				<h1 className="mx-auto mt-4 max-w-3xl text-5xl font-bold tracking-tight text-fg sm:text-6xl">
					Превращайте фидбек в решения о продукте.
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-lg text-fg-secondary">
					Собирайте идеи, понимайте, что важно, планируйте следующие шаги и
					держите пользователей в курсе — без пяти разных инструментов.
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<LandingAuth
						mode="cta"
						label="Начать бесплатно"
					/>
					<a
						href="#how"
						className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg hover:bg-surface"
					>
						Как это работает
					</a>
				</div>
				<p className="mt-3 text-xs text-fg-muted">
					Бесплатно навсегда · Без карты
				</p>

				<div className="mx-auto mt-14 max-w-4xl">
					<AppMock />
				</div>
			</section>

			{/* Outcomes */}
			<section
				id="features"
				className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
			>
				<div className="grid gap-12 md:grid-cols-2">
					<div>
						<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
							Результат
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							Система, в которой фидбек превращается в прогресс продукта.
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							Slyshno объединяет сбор, приоритизацию, роадмап и коммуникацию
							релизов в один рабочий процесс — идеи не теряются между
							поддержкой, планированием и разработкой.
						</p>
					</div>
					<div className="grid gap-8 sm:grid-cols-2">
						{OUTCOMES.map(f => (
							<div key={f.title}>
								<span className={`block h-0.5 w-8 ${f.marker}`} />
								<p className="mt-3 font-semibold text-fg">{f.title}</p>
								<p className="mt-1.5 text-sm text-fg-secondary">{f.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Engagement */}
			<section
				id="how"
				className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20"
			>
				<div className="grid gap-12 md:grid-cols-2">
					<div>
						<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
							Вовлечённость
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							Фидбек не должен исчезать после отправки.
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							Большинство инструментов заканчиваются на сборе. Slyshno держит
							разговор живым от первого запроса до релиза — пользователи всегда
							знают, что изменилось и что движется дальше.
						</p>
						<div className="mt-10 flex gap-12">
							{[
								{ n: '4', label: 'шага одним циклом', cls: 'text-blue-500' },
								{ n: '1', label: 'источник правды', cls: 'text-emerald-500' },
								{ n: '0', label: 'писем вручную', cls: 'text-violet-500' }
							].map(s => (
								<div key={s.label}>
									<p className={`text-4xl font-bold ${s.cls}`}>{s.n}</p>
									<p className="mt-1 text-sm text-fg-secondary">{s.label}</p>
								</div>
							))}
						</div>
					</div>
					<ol className="space-y-8">
						{STEPS.map((s, i) => (
							<li
								key={s.title}
								className="flex gap-4"
							>
								<span className="text-sm font-semibold text-fg-faint">
									0{i + 1}
								</span>
								<div>
									<p className="font-semibold text-fg">{s.title}</p>
									<p className="mt-1 text-sm text-fg-secondary">{s.text}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* Getting started */}
			<section className="mx-auto max-w-6xl px-6 py-20">
				<div className="grid gap-12 md:grid-cols-2">
					<div>
						<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
							Старт
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							Начните маленьким. Полезен — сразу.
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							Не нужно ничего настраивать неделями. Создайте пространство,
							покажите одну доску пользователям — и первые запросы сами
							расставят приоритеты.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<LandingAuth
								mode="cta"
								label="Начать бесплатно"
							/>
							<span className="text-xs text-fg-muted">
								Free-тариф · без карты
							</span>
						</div>
					</div>
					<div className="rounded-2xl border border-border p-8">
						<p className="text-xs font-medium tracking-widest text-fg-faint uppercase">
							Ваш первый цикл
						</p>
						<ol className="mt-6 space-y-6">
							{[
								{
									t: 'Создайте пространство',
									d: 'Название, адрес доски — и готово.'
								},
								{
									t: 'Откройте канал фидбека',
									d: 'Поделитесь ссылкой или вставьте виджет на сайт.'
								},
								{
									t: 'Превратите запрос в прогресс',
									d: 'Рассмотрите, смените статус, опубликуйте обновление.'
								}
							].map((s, i) => (
								<li
									key={s.t}
									className="flex gap-4"
								>
									<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-fg">
										{i + 1}
									</span>
									<div>
										<p className="font-medium text-fg">{s.t}</p>
										<p className="mt-0.5 text-sm text-fg-secondary">{s.d}</p>
									</div>
								</li>
							))}
						</ol>
						<div className="mt-8 border-t border-border pt-5">
							<p className="text-xs text-fg-faint">
								Первый запрос → первое решение → первое обновление
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl px-6 py-20">
				<div className="rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 px-8 py-20 text-center">
					<p className="text-xs font-medium tracking-widest text-blue-200 uppercase">
						Готовы, когда вы готовы
					</p>
					<h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold text-white">
						Превратите фидбек во что-то, что видно движение.
					</h2>
					<p className="mx-auto mt-4 max-w-md text-blue-100">
						Начните с бесплатного тарифа. Pro за $10 — когда цикл фидбека
						потребует больше.
					</p>
					<div className="mt-8 flex items-center justify-center gap-3">
						<LandingAuth
							mode="cta"
							label="Начать бесплатно"
						/>
						<a
							href="/pricing"
							className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
						>
							Смотреть цены →
						</a>
					</div>
					<p className="mt-3 text-xs text-blue-200">
						Бесплатно навсегда · Без карты
					</p>
				</div>
			</section>

			{/* FAQ */}
			<section className="mx-auto max-w-3xl px-6 py-20">
				<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
					FAQ
				</p>
				<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
					Вопросы перед стартом?
				</h2>
				<p className="mt-3 text-fg-secondary">
					Всё, что нужно знать о Slyshno, бесплатном тарифе и росте.
				</p>
				<div className="mt-8">
					<FaqAccordion />
				</div>
			</section>

			<SiteFooter />
		</div>
	)
}
