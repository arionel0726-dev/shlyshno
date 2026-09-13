'use client'

import { ChevronDown, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const TYPES = [
	{ value: 'feature', label: 'Feature', dot: 'bg-blue-500' },
	{ value: 'bug', label: 'Bug', dot: 'bg-red-500' }
]

const STATUSES = [
	{ value: 'reviewing', label: 'Reviewing', dot: 'bg-amber-500' },
	{ value: 'planned', label: 'Planned', dot: 'bg-blue-500' },
	{ value: 'in_progress', label: 'In progress', dot: 'bg-violet-500' },
	{ value: 'completed', label: 'Done', dot: 'bg-emerald-500' },
	{ value: 'closed', label: 'Closed', dot: 'bg-neutral-400' }
]

export function NewRequestModal({ slug }: { slug: string }) {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [type, setType] = useState('feature')
	const [status, setStatus] = useState('reviewing')
	const [menu, setMenu] = useState<'' | 'type' | 'status'>('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const router = useRouter()
	const wrapRef = useRef<HTMLDivElement>(null)

	// Открытие по событию из сайдбара
	useEffect(() => {
		const handler = () => setOpen(true)
		window.addEventListener('slyshno:new-request', handler)
		return () => window.removeEventListener('slyshno:new-request', handler)
	}, [])

	// Закрытие по Escape и клику вне
	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		const onClick = (e: MouseEvent) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
				setOpen(false)
		}
		document.addEventListener('keydown', onKey)
		document.addEventListener('mousedown', onClick)
		return () => {
			document.removeEventListener('keydown', onKey)
			document.removeEventListener('mousedown', onClick)
		}
	}, [open])

	if (!open) return null

	const activeType = TYPES.find(t => t.value === type)!
	const activeStatus = STATUSES.find(s => s.value === status)!

	async function create(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch(`/api/projects/${slug}/posts`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, body: body || undefined, type, status })
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? 'Ошибка')
			return
		}
		setOpen(false)
		setTitle('')
		setBody('')
		setType('feature')
		setStatus('reviewing')
		router.refresh()
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
			<div
				ref={wrapRef}
				className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
			>
				{/* Шапка: юзер › Type */}
				<div className="relative flex items-center gap-2 px-6 pt-5 pb-2">
					<span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-sm font-medium text-fg">
						Я
					</span>
					<ChevronDown className="h-3 w-3 text-fg-faint" />
					<div className="relative">
						<button
							onClick={() => setMenu(menu === 'type' ? '' : 'type')}
							className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-fg hover:bg-surface"
						>
							<span className={`h-2 w-2 rounded-full ${activeType.dot}`} />
							{activeType.label}
							<ChevronDown className="h-3 w-3 text-fg-faint" />
						</button>
						{menu === 'type' && (
							<div className="absolute top-full left-0 z-10 mt-1 w-44 rounded-xl border border-border bg-background py-1 shadow-lg">
								<p className="px-3 pt-1 pb-1 text-xs text-fg-faint">
									Request type
								</p>
								{TYPES.map(t => (
									<button
										key={t.value}
										onClick={() => {
											setType(t.value)
											setMenu('')
										}}
										className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-fg hover:bg-surface"
									>
										<span className={`h-2 w-2 rounded-full ${t.dot}`} />
										{t.label}
									</button>
								))}
							</div>
						)}
					</div>
					<button
						onClick={() => setOpen(false)}
						className="absolute top-4 right-4 rounded-lg p-1.5 text-fg-muted hover:bg-surface"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Поля */}
				<form onSubmit={create}>
					<div className="px-6 py-4">
						<input
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder="Request title"
							required
							minLength={3}
							className="w-full bg-transparent text-2xl font-semibold text-fg outline-none placeholder:text-fg-faint"
						/>
						<textarea
							value={body}
							onChange={e => setBody(e.target.value)}
							placeholder="Describe what users are asking for..."
							rows={5}
							className="mt-3 w-full resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
						/>
						{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
					</div>

					{/* Футер */}
					<div className="flex items-center gap-2 border-t border-border px-6 py-4">
						<div className="relative">
							<button
								type="button"
								onClick={() => setMenu(menu === 'status' ? '' : 'status')}
								className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-fg hover:bg-surface"
							>
								<span className={`h-2 w-2 rounded-full ${activeStatus.dot}`} />
								{activeStatus.label}
								<ChevronDown className="h-3 w-3 text-fg-faint" />
							</button>
							{menu === 'status' && (
								<div className="absolute bottom-full left-0 z-10 mb-1 w-44 rounded-xl border border-border bg-background py-1 shadow-lg">
									<p className="px-3 pt-1 pb-1 text-xs text-fg-faint">Status</p>
									{STATUSES.map(s => (
										<button
											key={s.value}
											type="button"
											onClick={() => {
												setStatus(s.value)
												setMenu('')
											}}
											className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-fg hover:bg-surface"
										>
											<span className={`h-2 w-2 rounded-full ${s.dot}`} />
											{s.label}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Tag — заглушка до тегов в БД */}
						<button
							type="button"
							disabled
							title="Скоро"
							className="rounded-full border border-border px-4 py-2 text-sm text-fg-faint"
						>
							Tag
						</button>

						<button
							disabled={saving}
							className="ml-auto rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-fg disabled:opacity-50"
						>
							{saving ? 'Создаю…' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
