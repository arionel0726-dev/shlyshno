'use client'

import { useI18n } from '@/i18n/context'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { DeletePostButton } from './delete-post-button'
import { NewRequestButton } from './new-request-button'
import { PostStatusSelect } from './post-status-select'

export type Post = {
	id: string
	title: string
	body: string | null
	status: string
	type: string
	votesCount: number
	createdAt: Date
}

const GROUPS: { key: string; labelKey: DictionaryKey; dot: string }[] = [
	{ key: 'pending', labelKey: 'status.pending', dot: 'bg-neutral-400' },
	{ key: 'reviewing', labelKey: 'status.reviewing', dot: 'bg-amber-500' },
	{ key: 'planned', labelKey: 'status.planned', dot: 'bg-blue-500' },
	{ key: 'in_progress', labelKey: 'status.in_progress', dot: 'bg-violet-500' }
]

export function FeedbackWorkspace({
	slug,
	posts
}: {
	slug: string
	posts: Post[]
}) {
	const { t } = useI18n()
	const [filter, setFilter] = useState('all')
	const [query, setQuery] = useState('')

	const filtered = useMemo(
		() =>
			posts.filter(p => {
				if (filter !== 'all' && p.status !== filter) return false
				if (query && !p.title.toLowerCase().includes(query.toLowerCase()))
					return false
				return true
			}),
		[posts, filter, query]
	)

	const count = (status?: string) =>
		status ? posts.filter(p => p.status === status).length : posts.length

	const visibleGroups = GROUPS.filter(g => filter === 'all' || filter === g.key)

	return (
		<div className="flex min-w-0 flex-col gap-8 p-4 sm:p-8 lg:flex-row">
			{/* Внутренний сайдбар */}
			<aside className="min-w-0 lg:w-48 lg:shrink-0">
				<p className="px-2 text-xs text-fg-faint">
					{t('appShell.nav.feedback')}
				</p>
				<nav className="mt-1 flex gap-0.5 overflow-x-auto lg:flex-col lg:overflow-visible">
					<button
						onClick={() => setFilter('all')}
						className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm lg:min-h-0 ${
							filter === 'all'
								? 'font-medium text-fg'
								: 'text-fg-secondary hover:text-fg'
						}`}
					>
						{t('feedback.filterAll')}
						<span className="ml-auto text-xs text-fg-faint">{count()}</span>
					</button>
					{GROUPS.map(g => (
						<button
							key={g.key}
							onClick={() => setFilter(g.key)}
							className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm lg:min-h-0 ${
								filter === g.key
									? 'font-medium text-fg'
									: 'text-fg-secondary hover:text-fg'
							}`}
						>
							<span className={`h-2 w-2 rounded-full ${g.dot}`} />
							{t(g.labelKey)}
							<span className="ml-auto text-xs text-fg-faint">
								{count(g.key)}
							</span>
						</button>
					))}
				</nav>
			</aside>

			{/* Основная зона */}
			<section className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-fg">
							{t('appShell.nav.feedback')}
						</h1>
						<p className="mt-1 text-sm text-fg-secondary">
							{t('feedback.subtitle')}
						</p>
					</div>
					<NewRequestButton />
				</div>

				{/* Тулбар */}
				<div className="mt-6 flex flex-wrap items-center gap-2">
					{[{ key: 'all', labelKey: 'feedback.tabAll' as DictionaryKey }, ...GROUPS].map(
						g => (
							<button
								key={g.key}
								onClick={() => setFilter(g.key)}
								className={`min-h-11 rounded-full px-4 py-1.5 text-sm lg:min-h-0 ${
									filter === g.key
										? 'bg-primary font-medium text-primary-fg'
										: 'border border-border text-fg-secondary hover:bg-surface'
								}`}
							>
								{t(g.labelKey)}
							</button>
						)
					)}
					<div className="relative w-full sm:ml-auto sm:w-64">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-faint" />
						<input
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder={t('feedback.searchPlaceholder')}
							className="min-h-11 w-full rounded-full border border-border bg-background py-2 pr-4 pl-9 text-base text-fg outline-none placeholder:text-fg-faint focus:border-border-strong sm:text-sm lg:min-h-0"
						/>
					</div>
				</div>

				{/* Группы */}
				<div className="mt-6 space-y-8">
					{visibleGroups.map(g => {
						const items = filtered
							.filter(p => p.status === g.key)
							.sort((a, b) => b.votesCount - a.votesCount)
						if (items.length === 0) return null
						return (
							<div key={g.key}>
								<div className="flex items-center gap-2">
									<span className={`h-2 w-2 rounded-full ${g.dot}`} />
									<h2 className="text-sm font-semibold text-fg">
										{t(g.labelKey)}
									</h2>
									<span className="text-sm text-fg-muted">{items.length}</span>
								</div>
								<ul className="mt-2">
									{items.map(p => (
										<li
											key={p.id}
											className="flex flex-wrap items-center gap-3 border-b border-border-soft py-3"
										>
											<span
												className={`h-2.5 w-2.5 shrink-0 rounded-full border-2 ${g.dot.replace('bg-', 'border-')}`}
											/>
											<div className="min-w-0 flex-1 basis-[calc(100%-2rem)] sm:basis-auto">
												<Link
													href={`/dashboard/p/${slug}/post/${p.id}`}
													className="truncate text-sm font-medium text-fg hover:underline"
												>
													{p.title}
												</Link>
												{p.body && (
													<p className="truncate text-sm text-fg-muted">
														{p.body}
													</p>
												)}
											</div>
											<PostStatusSelect
												postId={p.id}
												status={p.status}
											/>
											<DeletePostButton postId={p.id} />
											<span className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border px-3 py-1 text-xs text-fg-secondary lg:min-h-0 lg:min-w-0">
												↑ {p.votesCount}
											</span>
										</li>
									))}
								</ul>
							</div>
						)
					})}
					{filtered.length === 0 && (
						<p className="py-8 text-center text-sm text-fg-muted">
							{t('feedback.empty')}
						</p>
					)}
				</div>
			</section>
		</div>
	)
}
