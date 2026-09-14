'use client'

import { useI18n } from '@/i18n/context'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { Check, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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

export function UpgradeModal({ isPro }: { isPro: boolean }) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathname = usePathname()
	useEffect(() => {
		const handler = () => setOpen(true)
		window.addEventListener('slyshno:upgrade', handler)
		return () => window.removeEventListener('slyshno:upgrade', handler)
	}, [])

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('keydown', onKey)
		document.addEventListener('mousedown', onClick)
		return () => {
			document.removeEventListener('keydown', onKey)
			document.removeEventListener('mousedown', onClick)
		}
	}, [open])

	if (!open) return null

	async function upgrade() {
		const m = pathname.match(/\/dashboard\/p\/([^/]+)/)
		const slug = m?.[1]
		if (!slug) {
			setOpen(false)
			router.push('/new')
			return
		}
		const r = await fetch('/api/billing/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug })
		})
		const data = await r.json().catch(() => ({}))
		if (!r.ok || !data.url) {
			alert(data.error ?? t('upgrade.checkoutError'))
			return
		}
		window.location.href = data.url // редирект на страницу оплаты LS
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div
				ref={ref}
				className="relative grid max-h-[90vh] w-full max-w-3xl grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-xl sm:p-8"
			>
				<button
					onClick={() => setOpen(false)}
					className="absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-fg-muted hover:bg-surface sm:top-5 sm:right-5 sm:min-h-0 sm:min-w-0 sm:p-1.5"
				>
					<X className="h-4 w-4" />
				</button>

				<h2 className="text-center text-2xl font-bold text-fg">
					{t('upgrade.title')}
				</h2>
				<p className="mt-1.5 text-center text-fg-secondary">
					{t('upgrade.subtitle')}
				</p>

				<div className="mt-6 grid min-h-0 gap-4 overflow-y-auto sm:mt-8 sm:grid-cols-2">
					{/* Free */}
					<div className="rounded-2xl border border-border p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<p className="text-lg font-semibold text-fg">Free</p>
							{!isPro && (
								<span className="rounded-full bg-surface px-3 py-1 text-xs text-fg-secondary">
									{t('upgrade.free.currentPlan')}
								</span>
							)}
						</div>
						<p className="mt-3">
							<span className="text-3xl font-bold text-fg">$0</span>{' '}
							<span className="text-sm text-fg-muted">
								{t('upgrade.free.forever')}
							</span>
						</p>
						<p className="mt-2 text-sm text-fg-secondary">
							{t('upgrade.free.description')}
						</p>
						<ul className="mt-5 space-y-2.5 border-t border-border pt-5">
							{FREE_FEATURES.map(f => (
								<li
									key={f}
									className="flex items-center gap-2.5 text-sm text-fg-secondary"
								>
									<Check className="h-4 w-4 shrink-0 text-fg" />
									{t(f)}
								</li>
							))}
						</ul>
						<button
							disabled
							className="mt-6 w-full rounded-xl bg-surface py-2.5 text-sm font-medium text-fg-muted"
						>
							{isPro
								? t('upgrade.free.button.isPro')
								: t('upgrade.free.button.current')}
						</button>
					</div>

					{/* Pro */}
					<div className="overflow-hidden rounded-2xl border border-border">
						<div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 via-indigo-950 to-orange-900 px-4 py-4 sm:px-6">
							<p className="text-lg font-semibold text-white">Pro</p>
							<span className="text-xs text-orange-200">
								{t('upgrade.pro.popular')}
							</span>
						</div>
						<div className="p-4 sm:p-6">
							<p>
								<span className="text-3xl font-bold text-fg">$10</span>{' '}
								<span className="text-sm text-fg-muted">
									{t('upgrade.pro.perMonth')}
								</span>
							</p>
							<p className="mt-2 text-sm text-fg-secondary">
								{t('upgrade.pro.description')}
							</p>
							<ul className="mt-5 space-y-2.5 border-t border-border pt-5">
								{PRO_FEATURES.map(f => (
									<li
										key={f}
										className="flex flex-wrap items-center gap-2.5 text-sm text-fg-secondary"
									>
										<Check className="h-4 w-4 shrink-0 text-fg" />
										{t(f)}
										{PRO_SOON.has(f) && (
											<span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] text-fg-muted">
												{t('common.soon')}
											</span>
										)}
									</li>
								))}
							</ul>
							<button
								onClick={upgrade}
								className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-fg hover:opacity-90"
							>
								{isPro
									? t('upgrade.pro.button.manage')
									: t('upgrade.pro.button.upgrade')}
							</button>
						</div>
					</div>
				</div>

				<p className="mt-6 border-t border-border pt-5 text-center text-sm text-fg-muted">
					{t('upgrade.footer')}
				</p>
			</div>
		</div>
	)
}
