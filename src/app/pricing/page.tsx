import { LandingAuth } from '@/components/landing-auth'
import { SiteHeader } from '@/components/landing/site-header'
import { getSession } from '@/lib/session'
import Link from 'next/link'

const FREE_FEATURES = [
	'Публичная доска фидбека',
	'Базовый роадмап',
	'Чейнджлог',
	'До 100 голосов в месяц'
]

const PRO_FEATURES = [
	'Безлимитный фидбек',
	'Доска на вашем домене',
	'Роадмап + чейнджлог без ограничений',
	'Интеграции и API — скоро'
]

const COMPARE: { label: string; free: string; pro: string }[] = [
	{
		label: 'Доска фидбека',
		free: 'Публичная доска и голосование',
		pro: 'Безлимит + свой домен'
	},
	{
		label: 'Роадмап',
		free: 'Базовый',
		pro: 'Полный цикл статусов'
	},
	{
		label: 'Чейнджлог',
		free: 'Публикация обновлений',
		pro: 'Публикация + письма подписчикам'
	},
	{
		label: 'Интеграции',
		free: '—',
		pro: 'API и интеграции — скоро'
	},
	{
		label: 'Лимит голосов',
		free: 'До 100 в месяц',
		pro: 'Безлимит'
	}
]

export default async function Pricing() {
	const session = await getSession()

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader />

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
				<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
					Цены
				</p>
				<h1 className="mt-4 text-5xl font-bold tracking-tight text-fg">
					Простые цены. Два плана.
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-lg text-fg-secondary">
					Начните бесплатно. Обновитесь, когда команде нужно больше места для
					сбора, приоритизации и закрытия цикла.
				</p>
			</section>

			{/* Планы */}
			<section className="mx-auto max-w-4xl px-6">
				<div className="grid gap-6 md:grid-cols-2">
					{/* Free */}
					<div className="rounded-3xl border border-border p-8">
						<div className="flex items-center justify-between">
							<p className="text-lg font-semibold text-fg">Free</p>
							{session && (
								<span className="rounded-full bg-surface px-3 py-1 text-xs text-fg-secondary">
									Текущий план
								</span>
							)}
						</div>
						<p className="mt-4">
							<span className="text-4xl font-bold text-fg">$0</span>{' '}
							<span className="text-sm text-fg-muted">навсегда</span>
						</p>
						<p className="mt-3 text-sm text-fg-secondary">
							Для старта и сбора первого фидбека.
						</p>
						<ul className="mt-6 space-y-3 border-t border-border pt-6">
							{FREE_FEATURES.map(f => (
								<li
									key={f}
									className="flex items-center gap-3 text-sm text-fg-secondary"
								>
									<span className="text-fg">✓</span> {f}
								</li>
							))}
						</ul>
						<div className="mt-8">
							<LandingAuth
								mode="pricing"
								label="Начать бесплатно"
							/>
						</div>
					</div>

					{/* Pro */}
					<div className="overflow-hidden rounded-3xl border border-border">
						<div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 via-indigo-950 to-orange-900 px-8 py-5">
							<p className="text-lg font-semibold text-white">Pro</p>
							<span className="text-xs text-orange-200">Популярный выбор</span>
						</div>
						<div className="p-8">
							<p>
								<span className="text-4xl font-bold text-fg">$10</span>{' '}
								<span className="text-sm text-fg-muted">/ месяц</span>
							</p>
							<p className="mt-3 text-sm text-fg-secondary">
								Всё необходимое для серьёзного цикла фидбека.
							</p>
							<ul className="mt-6 space-y-3 border-t border-border pt-6">
								{PRO_FEATURES.map(f => (
									<li
										key={f}
										className="flex items-center gap-3 text-sm text-fg-secondary"
									>
										<span className="text-fg">✓</span> {f}
									</li>
								))}
							</ul>
							<button
								disabled
								title="Оплата появится с запуском"
								className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-fg opacity-50"
							>
								Обновить до Pro
								<span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
									Скоро
								</span>
							</button>
						</div>
					</div>
				</div>

				<p className="mt-8 text-center text-sm text-fg-muted">
					Только два плана. Никаких сложных тарифов. Отмена в любой момент.
				</p>
			</section>

			{/* Сравнение */}
			<section className="mx-auto max-w-6xl px-6 py-24">
				<div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
					<div>
						<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
							Что внутри
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							Всё для чистого цикла фидбека.
						</h2>
						<p className="mt-4 text-fg-secondary">
							Free закрывает основной сценарий. Pro снимает лимиты и добавляет
							инструменты, которые нужны растущим командам.
						</p>
					</div>
					<div>
						<div className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-border pb-3 text-sm font-medium text-fg">
							<p>Сравнение</p>
							<p className="text-center">Free</p>
							<p className="text-center">Pro</p>
						</div>
						{COMPARE.map(row => (
							<div
								key={row.label}
								className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-border py-4 text-sm"
							>
								<p className="font-medium text-fg">{row.label}</p>
								<p className="text-center text-fg-secondary">{row.free}</p>
								<p className="text-center text-fg-secondary">{row.pro}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Финальный CTA */}
			<section className="mx-auto max-w-6xl px-6 pb-24 text-center">
				<h2 className="text-4xl font-bold tracking-tight text-fg">
					Начните бесплатно. Обновляйтесь, когда это окупится.
				</h2>
				<p className="mt-3 text-fg-secondary">
					Без карты. Ваше пространство стартует на Free.
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<LandingAuth
						mode="cta"
						label="Начать бесплатно"
					/>
					<Link
						href="/#faq"
						className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg hover:bg-surface"
					>
						Читать FAQ
					</Link>
				</div>
			</section>

			{/* Минимальный футер */}
			<footer className="border-t border-border">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-fg-muted">
					<p className="font-semibold text-fg">Slyshno</p>
					<p>© 2026 Slyshno</p>
				</div>
			</footer>
		</div>
	)
}
