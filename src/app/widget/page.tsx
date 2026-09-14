'use client'

import { useI18n } from '@/i18n/context'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import {
	ArrowLeft,
	Bug,
	Check,
	Lightbulb,
	Map as MapIcon,
	Megaphone,
	MessageSquare,
	Search,
	X
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

type Post = {
	id: string
	title: string
	body: string | null
	status: string
	type: string
	votesCount: number
	authorName: string | null
	authorImage: string | null
}

type Entry = {
	id: string
	title: string
	body: string
	publishAt: string | null
	authorName: string | null
	authorImage: string | null
}

type View = 'home' | 'feedback' | 'submit' | 'roadmap' | 'changelog'

const STATUS_META: Record<string, { labelKey: DictionaryKey; dot: string }> = {
	in_progress: { labelKey: 'postStatus.in_progress', dot: 'bg-violet-500' },
	planned: { labelKey: 'postStatus.planned', dot: 'bg-blue-500' },
	completed: { labelKey: 'postStatus.completed', dot: 'bg-emerald-500' }
}

const ROADMAP_GROUPS = [
	{ key: 'in_progress', ...STATUS_META.in_progress },
	{ key: 'planned', ...STATUS_META.planned },
	{ key: 'completed', ...STATUS_META.completed }
]

function getGuestKey(): string {
	let key = localStorage.getItem('slyshno_widget_guest')
	if (!key) {
		key = crypto.randomUUID()
		localStorage.setItem('slyshno_widget_guest', key)
	}
	return key
}

function Avatar({
	name,
	image,
	size = 8
}: {
	name: string | null
	image: string | null
	size?: number
}) {
	const cls = `h-${size} w-${size} rounded-full`
	if (image)
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={image}
				alt=""
				className={`${cls} shrink-0 object-cover`}
			/>
		)
	return (
		<span
			className={`${cls} flex shrink-0 items-center justify-center bg-surface text-xs font-medium text-fg`}
		>
			{name?.[0]?.toUpperCase() ?? '?'}
		</span>
	)
}

const DATE_LOCALE = { ru: 'ru-RU', en: 'en-US' } as const

function WidgetInner() {
	const { t, locale } = useI18n()
	const key = useSearchParams().get('key') ?? ''
	const [slug, setSlug] = useState(useSearchParams().get('slug') ?? '')

	const [view, setView] = useState<View>('home')
	const [posts, setPosts] = useState<Post[]>([])
	const [entries, setEntries] = useState<Entry[]>([])
	const [myVotes, setMyVotes] = useState<Set<string>>(new Set())
	const [query, setQuery] = useState('')
	const [loaded, setLoaded] = useState(false)

	// Форма
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const [sent, setSent] = useState(false)
	const [limitNotice, setLimitNotice] = useState(false)

	async function load() {
		const p = await fetch(
			`/api/widget/posts?key=${encodeURIComponent(key)}`
		).then(r => (r.ok ? r.json() : { posts: [] }))
		setPosts(p.posts ?? [])
		const s = p.slug ?? ''
		if (s) {
			setSlug(s)
			const c = await fetch(`/api/p/${s}/changelog`).then(r =>
				r.ok ? r.json() : { posts: [] }
			)
			setEntries(c.posts ?? [])
		}
		setLoaded(true)
	}

	useEffect(() => {
		load()
		fetch('/api/posts/my-votes', { headers: { 'x-guest-key': getGuestKey() } })
			.then(r => (r.ok ? r.json() : { postIds: [] }))
			.then(d => setMyVotes(new Set(d.postIds ?? [])))
			.catch(() => {})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const filtered = useMemo(
		() =>
			posts.filter(
				p => !query || p.title.toLowerCase().includes(query.toLowerCase())
			),
		[posts, query]
	)

	function close() {
		window.parent.postMessage('slyshno:close', '*')
	}

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
		const data = await r.json().catch(() => ({}))
		if (!r.ok) {
			setMyVotes(s => {
				const n = new Set(s)
				was ? n.add(postId) : n.delete(postId)
				return n
			})
			setPosts(ps =>
				ps.map(p =>
					p.id === postId
						? { ...p, votesCount: p.votesCount + (was ? 1 : -1) }
						: p
				)
			)
			if (data.error === 'limit') setLimitNotice(true)
		}
	}

	async function submit() {
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
			setError(
				(await r.json().catch(() => ({}))).error ?? t('common.error.short')
			)
			return
		}
		setSent(true)
		setTitle('')
		setBody('')
		setEmail('')
		load()
	}

	const header = (title: string, showBack = true) => (
		<div className="flex items-center gap-2 border-b border-border px-4 py-3">
			{showBack ? (
				<button
					onClick={() => setView('home')}
					className="rounded-lg p-1.5 text-fg-secondary hover:bg-surface"
				>
					<ArrowLeft className="h-4 w-4" />
				</button>
			) : null}
			<p className="text-sm font-semibold text-fg">{title}</p>
			<button
				onClick={close}
				className="ml-auto rounded-lg p-1.5 text-fg-muted hover:bg-surface"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	)

	const powered = (
		<p className="pb-3 text-center text-xs text-fg-faint">
			{t('widget.poweredBy')}{' '}
			<a
				href={process.env.NEXT_PUBLIC_APP_URL}
				target="_blank"
				className="underline"
			>
				Slyshno
			</a>
		</p>
	)

	return (
		<div className="flex h-screen flex-col bg-background">
			{limitNotice && (
				<p className="mt-3 text-xs text-fg-muted">{t('usage.limitNotice')}</p>
			)}
			{view === 'home' && (
				<>
					<div className="flex items-start justify-between border-b border-border p-5">
						<div>
							<p className="text-lg font-bold text-fg">
								{t('widget.greeting')}
							</p>
							<p className="text-sm text-fg-secondary">
								{t('widget.greetingSubtitle')}
							</p>
						</div>
						<button
							onClick={close}
							className="rounded-lg p-1.5 text-fg-muted hover:bg-surface"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					<div className="flex-1 space-y-2 overflow-y-auto p-4">
						<HomeCard
							icon={<MessageSquare className="h-4 w-4 text-violet-500" />}
							title={t('portal.sidebar.leaveFeedback')}
							desc={t('widget.home.leaveFeedback.desc')}
							onClick={() => setView('submit')}
						/>
						<HomeCard
							icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
							title={t('widget.home.feedback.title')}
							desc={t('widget.home.feedback.desc', { count: posts.length })}
							onClick={() => setView('feedback')}
						/>
						<HomeCard
							icon={<MapIcon className="h-4 w-4 text-blue-500" />}
							title={t('portal.tab.roadmap')}
							desc={t('widget.home.roadmap.desc')}
							onClick={() => setView('roadmap')}
						/>
						<HomeCard
							icon={<Megaphone className="h-4 w-4 text-emerald-500" />}
							title={t('widget.changelog.title')}
							desc={t('widget.changelog.desc')}
							onClick={() => setView('changelog')}
						/>
					</div>
					{powered}
				</>
			)}

			{view === 'feedback' && (
				<>
					{header(t('widget.feedback.header'))}
					<div className="flex items-center gap-2 px-4 pt-3">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-fg-faint" />
							<input
								value={query}
								onChange={e => setQuery(e.target.value)}
								placeholder={t('widget.feedback.searchPlaceholder')}
								className="w-full rounded-full border border-border bg-background py-2 pr-3 pl-8 text-xs text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
							/>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto p-3">
						{!loaded && (
							<p className="py-8 text-center text-xs text-fg-muted">
								{t('common.loading')}
							</p>
						)}
						{loaded && filtered.length === 0 && (
							<p className="py-8 text-center text-xs text-fg-muted">
								{t('widget.feedback.empty')}
							</p>
						)}
						{filtered.map(p => {
							const voted = myVotes.has(p.id)
							return (
								<div
									key={p.id}
									className="flex gap-2.5 border-b border-border-soft py-3 last:border-0"
								>
									<Avatar
										name={p.authorName}
										image={p.authorImage}
									/>
									<div className="min-w-0 flex-1">
										<p className="text-[13px] font-medium text-fg">{p.title}</p>
										{p.body && (
											<p className="mt-0.5 line-clamp-1 text-xs text-fg-muted">
												{p.body}
											</p>
										)}
										<p className="mt-1 flex items-center gap-1.5 text-[11px] text-fg-muted">
											{p.type === 'bug' ? (
												<Bug className="h-3 w-3 text-red-400" />
											) : (
												<Lightbulb className="h-3 w-3 text-emerald-500" />
											)}
											{p.authorName ?? t('portal.guest')}
										</p>
									</div>
									<button
										onClick={() => vote(p.id)}
										className={`flex h-fit shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
											voted
												? 'border-primary bg-primary text-primary-fg'
												: 'border-border text-fg-secondary'
										}`}
									>
										↑ {p.votesCount}
									</button>
								</div>
							)
						})}
					</div>
					<div className="p-3">
						<button
							onClick={() => setView('submit')}
							className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-fg"
						>
							{t('portal.sidebar.leaveFeedback')}
						</button>
					</div>
					{powered}
				</>
			)}

			{view === 'submit' && (
				<>
					{header(
						sent
							? t('widget.submit.doneHeader')
							: t('portal.sidebar.leaveFeedback')
					)}
					<div className="flex-1 overflow-y-auto p-4">
						{sent ? (
							<div className="flex h-full flex-col items-center justify-center text-center">
								<span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
									<Check className="h-6 w-6 text-emerald-500" />
								</span>
								<p className="mt-3 text-sm font-medium text-fg">
									{t('widget.submit.thanks')}
								</p>
								<p className="mt-1 text-xs text-fg-secondary">
									{t('widget.submit.trackStatus')}
								</p>
								<button
									onClick={() => {
										setSent(false)
										setView('feedback')
									}}
									className="mt-4 rounded-full border border-border px-4 py-2 text-xs text-fg-secondary"
								>
									{t('widget.submit.backToIdeas')}
								</button>
							</div>
						) : (
							<>
								<textarea
									value={title}
									onChange={e => setTitle(e.target.value)}
									placeholder={t('widget.submit.titlePlaceholder')}
									rows={2}
									className="w-full resize-none bg-transparent text-[15px] font-medium text-fg outline-none placeholder:text-fg-faint"
								/>
								<textarea
									value={body}
									onChange={e => setBody(e.target.value)}
									placeholder={t('portal.composer.bodyPlaceholder')}
									rows={5}
									className="mt-2 w-full resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint"
								/>
								<input
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder={t('widget.submit.emailPlaceholder')}
									className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
								/>
								{error && <p className="mt-2 text-xs text-red-600">{error}</p>}
							</>
						)}
					</div>
					{!sent && (
						<div className="flex justify-end p-4">
							<button
								onClick={submit}
								disabled={saving || title.trim().length < 3}
								className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg disabled:opacity-40"
							>
								{saving
									? t('portal.composer.sending')
									: t('portal.composer.send')}
							</button>
						</div>
					)}
				</>
			)}

			{view === 'roadmap' && (
				<>
					{header(t('portal.tab.roadmap'))}
					<div className="flex-1 space-y-6 overflow-y-auto p-4">
						{ROADMAP_GROUPS.map(g => {
							const items = posts
								.filter(p => p.status === g.key)
								.sort((a, b) => b.votesCount - a.votesCount)
							if (items.length === 0) return null
							return (
								<section key={g.key}>
									<div className="flex items-center gap-2">
										<span className={`h-2 w-2 rounded-full ${g.dot}`} />
										<p className="text-sm font-semibold text-fg">
											{t(g.labelKey)}
										</p>
										<span className="text-xs text-fg-muted">
											{items.length}
										</span>
									</div>
									<ul className="mt-2">
										{items.map((p, i) => (
											<li
												key={p.id}
												className="flex gap-2.5"
											>
												<div className="flex flex-col items-center">
													<span
														className={`mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 ${g.dot.replace('bg-', 'border-')}`}
													/>
													{i < items.length - 1 && (
														<span className="mt-1 w-px flex-1 bg-border" />
													)}
												</div>
												<div className="min-w-0 flex-1 pb-4">
													<div className="flex items-start justify-between gap-2">
														<p className="text-[13px] font-medium text-fg">
															{p.title}
														</p>
														<span className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-fg-secondary">
															↑ {p.votesCount}
														</span>
													</div>
													{p.body && (
														<p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">
															{p.body}
														</p>
													)}
													<p className="mt-1 text-[11px] text-fg-muted">
														{p.authorName ?? t('portal.guest')}
													</p>
												</div>
											</li>
										))}
									</ul>
								</section>
							)
						})}
						{posts.filter(p => ROADMAP_GROUPS.some(g => g.key === p.status))
							.length === 0 && (
							<p className="py-8 text-center text-xs text-fg-muted">
								{t('widget.roadmap.empty')}
							</p>
						)}
					</div>
					{powered}
				</>
			)}

			{view === 'changelog' && (
				<>
					{header(t('widget.changelog.title'))}
					<div className="flex-1 overflow-y-auto p-4">
						{entries.length === 0 && (
							<p className="py-8 text-center text-xs text-fg-muted">
								{t('widget.feedback.empty')}
							</p>
						)}
						{entries.map(e => (
							<article
								key={e.id}
								className="border-b border-border-soft pb-5 last:border-0"
							>
								<p className="text-[11px] text-fg-muted">
									{e.publishAt
										? new Date(e.publishAt).toLocaleDateString(
												DATE_LOCALE[locale],
												{
													day: 'numeric',
													month: 'long',
													year: 'numeric'
												}
											)
										: ''}
								</p>
								<p className="mt-1 text-sm font-semibold text-fg">{e.title}</p>
								<p className="mt-1 line-clamp-3 text-xs text-fg-secondary">
									{e.body}
								</p>
								<div className="mt-2 flex items-center gap-2">
									<Avatar
										name={e.authorName}
										image={e.authorImage}
										size={5}
									/>
									<span className="text-[11px] text-fg-muted">
										{e.authorName ?? t('portal.changelog.team')}
									</span>
								</div>
							</article>
						))}
					</div>
					{powered}
				</>
			)}
		</div>
	)
}

function HomeCard({
	icon,
	title,
	desc,
	onClick
}: {
	icon: React.ReactNode
	title: string
	desc: string
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className="flex w-full items-center gap-3 rounded-xl border border-border p-3.5 text-left transition-colors hover:border-border-strong"
		>
			<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface">
				{icon}
			</span>
			<span className="min-w-0 flex-1">
				<span className="block text-[13px] font-medium text-fg">{title}</span>
				<span className="mt-0.5 block truncate text-xs text-fg-muted">
					{desc}
				</span>
			</span>
		</button>
	)
}

export default function WidgetPage() {
	return (
		<Suspense>
			<WidgetInner />
		</Suspense>
	)
}
