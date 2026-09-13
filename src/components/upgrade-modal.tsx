'use client'

import { Check, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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

export function UpgradeModal({ isPro }: { isPro: boolean }) {
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
			alert(data.error ?? 'Не удалось создать оплату')
			return
		}
		window.location.href = data.url // редирект на страницу оплаты LS
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div
				ref={ref}
				className="relative w-full max-w-3xl rounded-3xl border border-border bg-background p-8 shadow-xl"
			>
				<button
					onClick={() => setOpen(false)}
					className="absolute top-5 right-5 rounded-lg p-1.5 text-fg-muted hover:bg-surface"
				>
					<X className="h-4 w-4" />
				</button>

				<h2 className="text-center text-2xl font-bold text-fg">
					Выберите план
				</h2>
				<p className="mt-1.5 text-center text-fg-secondary">
					Начните бесплатно, обновитесь, когда понадобится больше.
				</p>

				<div className="mt-8 grid gap-4 sm:grid-cols-2">
					{/* Free */}
					<div className="rounded-2xl border border-border p-6">
						<div className="flex items-center justify-between">
							<p className="text-lg font-semibold text-fg">Free</p>
							{!isPro && (
								<span className="rounded-full bg-surface px-3 py-1 text-xs text-fg-secondary">
									Текущий план
								</span>
							)}
						</div>
						<p className="mt-3">
							<span className="text-3xl font-bold text-fg">$0</span>{' '}
							<span className="text-sm text-fg-muted">навсегда</span>
						</p>
						<p className="mt-2 text-sm text-fg-secondary">
							Для старта и сбора первого фидбека.
						</p>
						<ul className="mt-5 space-y-2.5 border-t border-border pt-5">
							{FREE_FEATURES.map(f => (
								<li
									key={f}
									className="flex items-center gap-2.5 text-sm text-fg-secondary"
								>
									<Check className="h-4 w-4 shrink-0 text-fg" />
									{f}
								</li>
							))}
						</ul>
						<button
							disabled
							className="mt-6 w-full rounded-xl bg-surface py-2.5 text-sm font-medium text-fg-muted"
						>
							{isPro ? 'Free' : 'Ваш текущий план'}
						</button>
					</div>

					{/* Pro */}
					<div className="overflow-hidden rounded-2xl border border-border">
						<div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 via-indigo-950 to-orange-900 px-6 py-4">
							<p className="text-lg font-semibold text-white">Pro</p>
							<span className="text-xs text-orange-200">Популярный выбор</span>
						</div>
						<div className="p-6">
							<p>
								<span className="text-3xl font-bold text-fg">$10</span>{' '}
								<span className="text-sm text-fg-muted">/ месяц</span>
							</p>
							<p className="mt-2 text-sm text-fg-secondary">
								Всё необходимое для серьёзного цикла фидбека.
							</p>
							<ul className="mt-5 space-y-2.5 border-t border-border pt-5">
								{PRO_FEATURES.map(f => (
									<li
										key={f}
										className="flex items-center gap-2.5 text-sm text-fg-secondary"
									>
										<Check className="h-4 w-4 shrink-0 text-fg" />
										{f}
									</li>
								))}
							</ul>
							<button
								onClick={upgrade}
								className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-fg hover:opacity-90"
							>
								{isPro ? 'Управление подпиской' : 'Перейти на Pro'}
							</button>
						</div>
					</div>
				</div>

				<p className="mt-6 border-t border-border pt-5 text-center text-sm text-fg-muted">
					Всего два плана. Никаких сложных тарифов. Отмена в любой момент.
				</p>
			</div>
		</div>
	)
}
