'use client'

import { Check, Flag, Link2, MessageSquare, Share2, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PortalHeader } from './portal-header'

export type PostRow = {
	id: string
	title: string
	body: string | null
	status: string
	type: string
	createdAt: Date
	votesCount: number
	commentsCount: number
	authorName: string | null
	authorImage: string | null
}

const STATUSES = [
	{ key: 'all', label: 'Все' },
	{ key: 'pending', label: 'Ожидает', dot: 'bg-neutral-400' },
	{ key: 'reviewing', label: 'На рассмотрении', dot: 'bg-amber-500' },
	{ key: 'planned', label: 'Запланировано', dot: 'bg-blue-500' },
	{ key: 'in_progress', label: 'В работе', dot: 'bg-violet-500' },
	{ key: 'completed', label: 'Готово', dot: 'bg-emerald-500' },
	{ key: 'closed', label: 'Закрыто', dot: 'bg-neutral-500' }
]

const STATUS_META: Record<string, { label: string; dot: string }> = {
	pending: { label: 'Ожидает', dot: 'bg-neutral-400' },
	reviewing: { label: 'На рассмотрении', dot: 'bg-amber-500' },
	planned: { label: 'Запланировано', dot: 'bg-blue-500' },
	in_progress: { label: 'В работе', dot: 'bg-violet-500' },
	completed: { label: 'Готово', dot: 'bg-emerald-500' },
	closed: { label: 'Закрыто', dot: 'bg-neutral-500' }
}

function getGuestKey(): string {
	let key = localStorage.getItem('slyshno_guest')
	if (!key) {
		key = crypto.randomUUID()
		localStorage.setItem('slyshno_guest', key)
	}
	return key
}

export function BoardView({
	slug,
	projectName,
	posts: initial
}: {
	slug: string
	projectName: string
	posts: PostRow[]
}) {
	const [posts, setPosts] = useState(initial)
	const [myVotes, setMyVotes] = useState<Set<string>>(new Set())
	const [status, setStatus] = useState('all')
	const [typeFilter, setTypeFilter] = useState<'all' | 'feature' | 'bug'>('all')
	const [popular, setPopular] = useState(true)
	const [query, setQuery] = useState('')
	const [composerOpen, setComposerOpen] = useState(false)
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		fetch('/api/posts/my-votes', {
			headers: { 'x-guest-key': getGuestKey() }
		})
			.then(r => r.json())
			.then(d => setMyVotes(new Set(d.postIds)))
	}, [])

	const filtered = useMemo(() => {
		let list = posts.filter(p => {
			if (status !== 'all' && p.status !== status) return false
			if (typeFilter !== 'all' && p.type !== typeFilter) return false
			if (query && !p.title.toLowerCase().includes(query.toLowerCase()))
				return false
			return true
		})
		list = [...list].sort((a, b) =>
			popular
				? b.votesCount - a.votesCount
				: b.createdAt.getTime() - a.createdAt.getTime()
		)
		return list
	}, [posts, status, typeFilter, query, popular])

	const countByType = (t: string) => posts.filter(p => p.type === t).length

	async function vote(postId: string) {
		const was = myVotes.has(postId)
		setMyVotes(s => {
			const n = new Set(s)
			was ? n.delete(postId) : n.add(postId)
			return n
		})
		setPosts(ps =>
			ps.map(p =>
				p.id === postId
					? { ...p, votesCount: p.votesCount + (was ? -1 : 1) }
					: p
			)
		)
		const r = await fetch('/api/posts/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ postId, guestKey: getGuestKey() })
		})
		if (!r.ok) router.refresh()
	}

	const tabs = [
		{ href: `/p/${slug}`, label: 'Отзывы' },
		{ href: `/p/${slug}/roadmap`, label: 'Дорожная карта' },
		{ href: `/p/${slug}/changelog`, label: 'Обновления' }
	]

	return (
		<div className="min-h-screen">
			{/* Шапка */}
			<PortalHeader
				slug={slug}
				projectName={projectName}
				search={query}
				onSearch={setQuery}
			/>

			{/* Фильтры-табы статусов */}
			<div className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3 text-sm">
					{STATUSES.map(s => (
						<button
							key={s.key}
							onClick={() => setStatus(s.key)}
							className={`flex items-center gap-1.5 ${
								status === s.key
									? 'font-medium text-fg'
									: 'text-fg-secondary hover:text-fg'
							}`}
						>
							{'dot' in s && (
								<span className={`h-2 w-2 rounded-full ${s.dot}`} />
							)}
							{s.label}
						</button>
					))}
					<span className="h-4 w-px bg-border" />
					<button
						onClick={() => setPopular(!popular)}
						className={`flex items-center gap-1.5 ${
							popular ? 'font-medium text-fg' : 'text-fg-secondary'
						}`}
					>
						<Flag className="h-3.5 w-3.5" />
						Популярные
					</button>
				</div>
			</div>

			{/* Контент + сайдбар */}
			<div className="mx-auto flex max-w-6xl gap-10 px-6 py-8">
				<main className="min-w-0 flex-1">
					{filtered.length === 0 && (
						<p className="py-12 text-center text-sm text-fg-muted">
							Ничего не найдено
						</p>
					)}
					{filtered.map(p => {
						const meta = STATUS_META[p.status]
						const voted = myVotes.has(p.id)
						return (
							<div
								key={p.id}
								className="flex gap-4 border-b border-border-soft py-5"
							>
								{p.authorImage ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={p.authorImage}
										alt=""
										className="h-9 w-9 shrink-0 rounded-full"
									/>
								) : (
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-medium text-fg">
										{p.authorName?.[0]?.toUpperCase() ?? '?'}
									</span>
								)}
								<div className="min-w-0 flex-1">
									<p className="text-xs text-fg-muted">
										{p.authorName ?? 'Гость'}{' '}
										<span className="text-fg-faint">
											в {p.type === 'bug' ? 'Bugs' : 'Features'}
										</span>
									</p>
									<Link
										href={`/p/${slug}/post/${p.id}`}
										className="mt-0.5 block font-medium text-fg hover:underline"
									>
										{p.title}
									</Link>
									{p.body && (
										<p className="mt-0.5 line-clamp-2 text-sm text-fg-muted">
											{p.body}
										</p>
									)}
									<div className="mt-2 flex items-center gap-3 text-xs">
										{meta && (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-fg-secondary">
												<span
													className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
												/>
												{meta.label}
											</span>
										)}
										<span className="inline-flex items-center gap-1 text-fg-muted">
											<MessageSquare className="h-3.5 w-3.5" />
											{p.commentsCount}
										</span>
									</div>
								</div>
								<button
									onClick={() => vote(p.id)}
									className={`flex h-fit shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
										voted
											? 'border-primary bg-primary text-primary-fg'
											: 'border-border text-fg-secondary hover:bg-surface'
									}`}
								>
									↑ {p.votesCount}
								</button>
							</div>
						)
					})}
				</main>

				{/* Сайдбар */}
				<aside className="hidden w-60 shrink-0 lg:block">
					<button
						onClick={() => setComposerOpen(true)}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
					>
						<MessageSquare className="h-4 w-4" />
						Оставить отзыв
					</button>

					<p className="mt-6 text-xs font-medium text-fg-faint">ДОСКИ</p>
					<nav className="mt-2 flex flex-col gap-0.5 text-sm">
						<SideFilter
							active={typeFilter === 'all'}
							onClick={() => setTypeFilter('all')}
							icon={<span className="h-2 w-2 rounded-full bg-neutral-400" />}
							label="Все отзывы"
							count={posts.length}
						/>
						<SideFilter
							active={typeFilter === 'feature'}
							onClick={() => setTypeFilter('feature')}
							icon={<span className="h-2 w-2 rounded-full bg-emerald-500" />}
							label="Features"
							count={countByType('feature')}
						/>
						<SideFilter
							active={typeFilter === 'bug'}
							onClick={() => setTypeFilter('bug')}
							icon={<span className="h-2 w-2 rounded-full bg-red-500" />}
							label="Bugs"
							count={countByType('bug')}
						/>
					</nav>

					<SidebarActions />
				</aside>
			</div>

			{/* Powered by */}
			<Link
				href="/"
				className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-4 py-2 text-sm text-fg-secondary shadow-lg hover:text-fg"
			>
				💬 Создайте свою доску
			</Link>

			{composerOpen && (
				<Composer
					slug={slug}
					onClose={() => setComposerOpen(false)}
					onCreated={() => {
						setComposerOpen(false)
						router.refresh()
					}}
				/>
			)}
		</div>
	)
}

function SideFilter({
	active,
	onClick,
	icon,
	label,
	count
}: {
	active: boolean
	onClick: () => void
	icon: React.ReactNode
	label: string
	count: number
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left ${
				active
					? 'bg-surface font-medium text-fg'
					: 'text-fg-secondary hover:bg-surface'
			}`}
		>
			{icon}
			{label}
			<span className="ml-auto text-xs text-fg-faint">{count}</span>
		</button>
	)
}

function SidebarActions() {
	const [copied, setCopied] = useState(false)

	async function copy() {
		await navigator.clipboard.writeText(window.location.href)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	async function share() {
		if (navigator.share) {
			await navigator.share({ title: document.title, url: location.href })
		} else {
			await copy()
		}
	}

	return (
		<>
			<p className="mt-6 text-xs font-medium text-fg-faint">ДЕЙСТВИЯ</p>
			<div className="mt-2 flex flex-col gap-0.5 text-sm">
				<button
					onClick={copy}
					className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-fg-secondary hover:bg-surface"
				>
					{copied ? (
						<Check className="h-4 w-4 text-emerald-500" />
					) : (
						<Link2 className="h-4 w-4" />
					)}
					{copied ? 'Скопировано' : 'Копировать ссылку'}
				</button>
				<button
					onClick={share}
					className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-fg-secondary hover:bg-surface"
				>
					<Share2 className="h-4 w-4" />
					Поделиться
				</button>
			</div>
		</>
	)
}

function Composer({
	slug,
	onClose,
	onCreated
}: {
	slug: string
	onClose: () => void
	onCreated: () => void
}) {
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const [sent, setSent] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose()
		}
		document.addEventListener('keydown', onKey)
		document.addEventListener('mousedown', onClick)
		return () => {
			document.removeEventListener('keydown', onKey)
			document.removeEventListener('mousedown', onClick)
		}
	}, [onClose])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch(`/api/p/${slug}/posts`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title,
				body: body || undefined,
				email: email || undefined
			})
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? 'Ошибка')
			return
		}
		setSent(true)
		setTimeout(onCreated, 1200)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div
				ref={ref}
				className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl"
			>
				{sent ? (
					<div className="py-8 text-center">
						<p className="text-lg font-semibold text-fg">Спасибо!</p>
						<p className="mt-1 text-sm text-fg-secondary">
							Отзыв отправлен — следите за статусом на доске.
						</p>
					</div>
				) : (
					<>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-fg">Оставить отзыв</h2>
							<button
								onClick={onClose}
								className="rounded-lg p-1.5 text-fg-muted hover:bg-surface"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<form
							onSubmit={submit}
							className="mt-4 flex flex-col gap-3"
						>
							<input
								value={title}
								onChange={e => setTitle(e.target.value)}
								placeholder="Коротко: что предлагаешь?"
								required
								minLength={3}
								className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
							<textarea
								value={body}
								onChange={e => setBody(e.target.value)}
								placeholder="Подробности (необязательно)"
								rows={4}
								className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
							<input
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="Email — чтобы узнать, когда сделаем (необязательно)"
								className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
							{error && <p className="text-sm text-red-600">{error}</p>}
							<button
								disabled={saving}
								className="mt-1 rounded-xl bg-primary py-3 text-sm font-medium text-primary-fg hover:opacity-90 disabled:opacity-50"
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
