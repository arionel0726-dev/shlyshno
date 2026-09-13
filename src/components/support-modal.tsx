'use client'

import { Check, LifeBuoy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function SupportModal() {
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const [sent, setSent] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handler = () => setOpen(true)
		window.addEventListener('slyshno:support', handler)
		return () => window.removeEventListener('slyshno:support', handler)
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

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch('/api/support', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, message })
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? 'Ошибка')
			return
		}
		setSent(true)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div
				ref={ref}
				className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
			>
				{sent ? (
					<div className="py-6 text-center">
						<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
							<Check className="h-6 w-6 text-emerald-500" />
						</span>
						<p className="mt-3 font-semibold text-fg">Отправлено!</p>
						<p className="mt-1 text-sm text-fg-secondary">
							Ответим вам на email в ближайшее время.
						</p>
						<button
							onClick={() => {
								setSent(false)
								setOpen(false)
								setMessage('')
							}}
							className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-fg-secondary"
						>
							Закрыть
						</button>
					</div>
				) : (
					<>
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 text-lg font-semibold text-fg">
								<LifeBuoy className="h-5 w-5" />
								Поддержка
							</h2>
							<button
								onClick={() => setOpen(false)}
								className="rounded-lg p-1.5 text-fg-muted hover:bg-surface"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<p className="mt-1 text-sm text-fg-secondary">
							Что-то не работает? Опишите проблему — поможем.
						</p>
						<form
							onSubmit={submit}
							className="mt-4 flex flex-col gap-3"
						>
							<input
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="Ваш email"
								required
								className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
							<textarea
								value={message}
								onChange={e => setMessage(e.target.value)}
								placeholder="Опишите проблему…"
								rows={4}
								required
								className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
							{error && <p className="text-sm text-red-600">{error}</p>}
							<button
								disabled={saving}
								className="rounded-xl bg-primary py-3 text-sm font-medium text-primary-fg disabled:opacity-50"
							>
								{saving ? 'Отправляю…' : 'Отправить'}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	)
}
