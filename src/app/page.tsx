import { LandingAuth } from '@/components/landing-auth'
import { FaqAccordion } from '@/components/landing/faq-accordion'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { getT } from '@/i18n/server'
import { jsonLdScript, pageMetadata, SITE_URL } from '@/lib/seo'
import { getSession } from '@/lib/session'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

const TITLE = 'Slyshno — Feedback boards, roadmap, and changelog'
const DESCRIPTION =
	'Collect feedback, prioritize what matters, and close the loop with a public board, an embeddable widget, a roadmap, and an automatic changelog. Free forever, no card required.'

export const metadata: Metadata = pageMetadata({
	title: TITLE,
	description: DESCRIPTION,
	path: '/'
})

// JSON-LD: не переводим через словарь — это метаданные для краулеров, а не
// пользовательский текст на странице (бриф допускает EN-only метаданные).
const JSON_LD = [
	{
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Slyshno',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Web',
		url: SITE_URL,
		description: DESCRIPTION,
		offers: [
			{
				'@type': 'Offer',
				name: 'Free',
				price: '0',
				priceCurrency: 'USD'
			},
			{
				'@type': 'Offer',
				name: 'Pro',
				price: '10',
				priceCurrency: 'USD',
				priceSpecification: {
					'@type': 'UnitPriceSpecification',
					price: '10',
					priceCurrency: 'USD',
					billingDuration: 'P1M'
				}
			}
		]
	},
	{
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Slyshno',
		url: SITE_URL,
		logo: `${SITE_URL}/favicon.ico`
	}
]

export default async function Home() {
	const session = await getSession()
	if (session) redirect('/dashboard')
	const { t } = await getT()

	const OUTCOMES = [
		{
			title: t('landing.outcomes.item1.title'),
			text: t('landing.outcomes.item1.text'),
			marker: 'bg-orange-400'
		},
		{
			title: t('landing.outcomes.item2.title'),
			text: t('landing.outcomes.item2.text'),
			marker: 'bg-blue-500'
		},
		{
			title: t('landing.outcomes.item3.title'),
			text: t('landing.outcomes.item3.text'),
			marker: 'bg-violet-500'
		},
		{
			title: t('landing.outcomes.item4.title'),
			text: t('landing.outcomes.item4.text'),
			marker: 'bg-emerald-500'
		}
	]

	const STEPS = [
		{
			title: t('landing.engagement.step1.title'),
			text: t('landing.engagement.step1.text')
		},
		{
			title: t('landing.engagement.step2.title'),
			text: t('landing.engagement.step2.text')
		},
		{
			title: t('landing.engagement.step3.title'),
			text: t('landing.engagement.step3.text')
		},
		{
			title: t('landing.engagement.step4.title'),
			text: t('landing.engagement.step4.text')
		}
	]

	return (
		<div className="min-h-screen bg-background">
			<script
				type="application/ld+json"
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: jsonLdScript(JSON_LD) }}
			/>
			<SiteHeader />

			{/* Hero */}
			<section className="relative mx-auto max-w-6xl scroll-mt-24 overflow-hidden px-6 pt-20 pb-16 text-center">
				<p className="text-xs font-medium tracking-widest text-fg-muted uppercase">
					{t('landing.hero.eyebrow')}
				</p>
				<h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
					{t('landing.hero.title')}
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-base text-fg-secondary sm:text-lg">
					{t('landing.hero.subtitle')}
				</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<LandingAuth
						mode="cta"
						label={t('landing.cta.startFree')}
					/>
					<a
						href="#how"
						className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg hover:bg-surface"
					>
						{t('landing.cta.howItWorks')}
					</a>
				</div>
				<p className="mt-3 text-xs text-fg-muted">{t('landing.freeForever')}</p>

				{/* Продуктовый мокап (как у Linear) */}
				<div className="relative mx-auto mt-14 max-w-4xl">
					{/* мягкое свечение за карточкой */}
					<div className="pointer-events-none absolute -inset-x-10 -top-10 h-48 bg-gradient-to-r from-blue-600/20 via-violet-500/20 to-blue-600/20 blur-3xl" />

					<div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
						{/* шапка браузера */}
						<div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
							<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
							<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
							<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
							<span className="mx-auto rounded-md bg-surface px-3 py-0.5 font-mono text-xs text-fg-muted">
								app.slyshno.com
							</span>
						</div>
						{/* твой скриншот */}
						<img
							src="/images/hero-bg.webp"
							alt="Slyshno — доска фидбека"
							className="w-full"
						/>
					</div>
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
							{t('landing.outcomes.eyebrow')}
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							{t('landing.outcomes.title')}
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							{t('landing.outcomes.subtitle')}
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
							{t('landing.engagement.eyebrow')}
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							{t('landing.engagement.title')}
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							{t('landing.engagement.subtitle')}
						</p>
						<div className="mt-10 flex gap-12">
							{[
								{
									n: '4',
									label: t('landing.engagement.stat1'),
									cls: 'text-blue-500'
								},
								{
									n: '1',
									label: t('landing.engagement.stat2'),
									cls: 'text-emerald-500'
								},
								{
									n: '0',
									label: t('landing.engagement.stat3'),
									cls: 'text-violet-500'
								}
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
							{t('landing.gettingStarted.eyebrow')}
						</p>
						<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
							{t('landing.gettingStarted.title')}
						</h2>
						<p className="mt-4 max-w-md text-fg-secondary">
							{t('landing.gettingStarted.subtitle')}
						</p>
						<div className="mt-6 flex items-center gap-3">
							<LandingAuth
								mode="cta"
								label={t('landing.cta.startFree')}
							/>
							<span className="text-xs text-fg-muted">
								{t('landing.gettingStarted.freeTariff')}
							</span>
						</div>
					</div>
					<div className="rounded-2xl border border-border p-8">
						<p className="text-xs font-medium tracking-widest text-fg-faint uppercase">
							{t('landing.gettingStarted.panelEyebrow')}
						</p>
						<ol className="mt-6 space-y-6">
							{[
								{
									t: t('landing.gettingStarted.step1.title'),
									d: t('landing.gettingStarted.step1.desc')
								},
								{
									t: t('landing.gettingStarted.step2.title'),
									d: t('landing.gettingStarted.step2.desc')
								},
								{
									t: t('landing.gettingStarted.step3.title'),
									d: t('landing.gettingStarted.step3.desc')
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
								{t('landing.gettingStarted.footer')}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
				<div className="relative overflow-hidden rounded-3xl bg-blue-950">
					<img
						src="/images/cta-bg.webp"
						alt=""
						className="absolute inset-0 h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-blue-950/60" />
					<div className="relative px-6 py-16 text-center sm:px-8 sm:py-20">
						<p className="text-xs font-medium tracking-widest text-blue-200 uppercase">
							{t('landing.cta.eyebrow')}
						</p>
						<h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
							{t('landing.cta.title')}
						</h2>
						<p className="mx-auto mt-4 max-w-md text-blue-100">
							{t('landing.cta.subtitle')}
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<LandingAuth
								mode="cta"
								label={t('landing.cta.startFree')}
							/>
							<a
								href="/pricing"
								className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
							>
								{t('landing.cta.pricingLink')}
							</a>
						</div>
						<p className="mt-3 text-xs text-blue-200">
							{t('landing.freeForever')}
						</p>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="mx-auto max-w-3xl px-6 py-20">
				<p className="text-xs font-medium tracking-widest text-blue-500 uppercase">
					FAQ
				</p>
				<h2 className="mt-3 text-4xl font-bold tracking-tight text-fg">
					{t('landing.faq.title')}
				</h2>
				<p className="mt-3 text-fg-secondary">{t('landing.faq.subtitle')}</p>
				<div className="mt-8">
					<FaqAccordion />
				</div>
			</section>

			<SiteFooter />
			<script
				src="http://localhost:3000/widget.js"
				data-slyshno-key="028290e9799712d37163828c09f77c13"
				async
			></script>
		</div>
	)
}
