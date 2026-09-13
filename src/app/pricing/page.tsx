import { LandingAuth } from '@/components/landing-auth'
import { SiteHeader } from '@/components/landing/site-header'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'
import { getSession } from '@/lib/session'
import Link from 'next/link'

export default async function Pricing() {
	const session = await getSession()
	const { t } = await getT()

	const FREE_FEATURES: DictionaryKey[] = [
		'upgrade.free.feature.board',
		'upgrade.free.feature.roadmap',
		'upgrade.free.feature.changelog',
		'upgrade.free.feature.votes'
	]

	const PRO_FEATURES: DictionaryKey[] = [
		'upgrade.pro.feature.unlimited',
		'upgrade.pro.feature.projects',
		'upgrade.pro.feature.branding',
		'upgrade.pro.feature.domain',
		'upgrade.pro.feature.sso',
		'upgrade.pro.feature.integrations'
	]

	const PRO_SOON = new Set<DictionaryKey>([
		'upgrade.pro.feature.branding',
		'upgrade.pro.feature.domain',
		'upgrade.pro.feature.sso',
		'upgrade.pro.feature.integrations'
	])

	const COMPARE: {
		labelKey: DictionaryKey
		freeKey: DictionaryKey
		proKey: DictionaryKey
	}[] = [
		{
			labelKey: 'pricing.compare.row1.label',
			freeKey: 'pricing.compare.row1.free',
			proKey: 'pricing.compare.row1.pro'
		},
		{
			labelKey: 'pricing.compare.row2.label',
			freeKey: 'pricing.compare.row2.free',
			proKey: 'pricing.compare.row2.pro'
		},
		{
			labelKey: 'pricing.compare.row3.label',
			freeKey: 'pricing.compare.row3.free',
			proKey: 'pricing.compare.row3.pro'
		},
		{
			labelKey: 'pricing.compare.row4.label',
			freeKey: 'pricing.compare.row4.free',
			proKey: 'pricing.compare.row4.pro'
		},
		{
			labelKey: 'pricing.compare.row5.label',
			freeKey: 'pricing.compare.row5.free',
			proKey: 'pricing.compare.row5.pro'
		}
	]

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader />

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
				<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
					{t('landing.nav.pricing')}
				</p>
				<h1 className="mt-4 text-5xl font-bold tracking-tight text-fg">
					{t('pricing.hero.title')}
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-lg text-fg-secondary">
					{t('pricing.hero.subtitle')}
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
									{t('upgrade.free.currentPlan')}
								</span>
							)}
						</div>
						<p className="mt-4">
							<span className="text-4xl font-bold text-fg">$0</span>{' '}
							<span className="text-sm text-fg-muted">
								{t('upgrade.free.forever')}
							</span>
						</p>
						<p className="mt-3 text-sm text-fg-secondary">
							{t('upgrade.free.description')}
						</p>
						<ul className="mt-6 space-y-3 border-t border-border pt-6">
							{FREE_FEATURES.map(f => (
								<li
									key={f}
									className="flex items-center gap-3 text-sm text-fg-secondary"
								>
									<span className="text-fg">✓</span> {t(f)}
								</li>
							))}
						</ul>
						<div className="mt-8">
							<LandingAuth
								mode="pricing"
								label={t('landing.cta.startFree')}
							/>
						</div>
					</div>

					{/* Pro */}
					<div className="overflow-hidden rounded-3xl border border-border">
						<div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 via-indigo-950 to-orange-900 px-8 py-5">
							<p className="text-lg font-semibold text-white">Pro</p>
							<span className="text-xs text-orange-200">
								{t('upgrade.pro.popular')}
							</span>
						</div>
						<div className="p-8">
							<p>
								<span className="text-4xl font-bold text-fg">$10</span>{' '}
								<span className="text-sm text-fg-muted">
									{t('upgrade.pro.perMonth')}
								</span>
							</p>
							<p className="mt-3 text-sm text-fg-secondary">
								{t('upgrade.pro.description')}
							</p>
							<ul className="mt-6 space-y-3 border-t border-border pt-6">
								{PRO_FEATURES.map(f => (
									<li
										key={f}
										className="flex flex-wrap items-center gap-3 text-sm text-fg-secondary"
									>
										<span className="text-fg">✓</span> {t(f)}
										{PRO_SOON.has(f) && (
											<span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-fg-muted">
												{t('common.soon')}
											</span>
										)}
									</li>
								))}
							</ul>
							<button
								disabled
								title={t('pricing.pro.comingSoonTitle')}
								className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-fg opacity-50"
							>
								{t('pricing.pro.upgradeButton')}
								<span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
									{t('common.soon')}
								</span>
							</button>
						</div>
					</div>
				</div>

				<p className="mt-8 text-center text-sm text-fg-muted">
					{t('pricing.plansFooter')}
				</p>
			</section>

			{/* Сравнение */}
			{/* <section className="mx-auto max-w-6xl px-6 py-24">
				<div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
					<div>
						<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
							{t('pricing.compare.eyebrow')}
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							{t('pricing.compare.title')}
						</h2>
						<p className="mt-4 text-fg-secondary">
							{t('pricing.compare.subtitle')}
						</p>
					</div>
					<div>
						<div className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-border pb-3 text-sm font-medium text-fg">
							<p>{t('pricing.compare.tableHeader')}</p>
							<p className="text-center">Free</p>
							<p className="text-center">Pro</p>
						</div>
						{COMPARE.map(row => (
							<div
								key={row.labelKey}
								className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-border py-4 text-sm"
							>
								<p className="font-medium text-fg">{t(row.labelKey)}</p>
								<p className="text-center text-fg-secondary">
									{t(row.freeKey)}
								</p>
								<p className="text-center text-fg-secondary">{t(row.proKey)}</p>
							</div>
						))}
					</div>
				</div>
			</section> */}

			{/* Финальный CTA */}
			<section className="mx-auto max-w-6xl px-6 pb-24 text-center">
				<h2 className="text-4xl font-bold tracking-tight text-fg">
					{t('pricing.finalCta.title')}
				</h2>
				<p className="mt-3 text-fg-secondary">
					{t('pricing.finalCta.subtitle')}
				</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					<LandingAuth
						mode="cta"
						label={t('landing.cta.startFree')}
					/>
					<Link
						href="/#faq"
						className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg hover:bg-surface"
					>
						{t('pricing.finalCta.faqLink')}
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
