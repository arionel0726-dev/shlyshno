'use client'

import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { useI18n } from '@/i18n/context'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type RoadmapPost = {
	id: string
	title: string
	body: string | null
	status: string
	type: string
	votesCount: number
	authorName: string | null
	authorImage: string | null
}

const COLUMNS: {
	key: string
	labelKey: DictionaryKey
	hintKey: DictionaryKey
	dot: string
}[] = [
	{
		key: 'pending',
		labelKey: 'postStatus.pending',
		hintKey: 'roadmap.hint.pending',
		dot: 'bg-neutral-400'
	},
	{
		key: 'reviewing',
		labelKey: 'postStatus.reviewing',
		hintKey: 'roadmap.hint.reviewing',
		dot: 'bg-amber-500'
	},
	{
		key: 'planned',
		labelKey: 'postStatus.planned',
		hintKey: 'roadmap.hint.planned',
		dot: 'bg-blue-500'
	},
	{
		key: 'in_progress',
		labelKey: 'postStatus.in_progress',
		hintKey: 'roadmap.hint.in_progress',
		dot: 'bg-violet-500'
	},
	{
		key: 'completed',
		labelKey: 'postStatus.completed',
		hintKey: 'roadmap.hint.completed',
		dot: 'bg-emerald-500'
	}
] as const

const TYPE_BADGE: Record<string, { labelKey: DictionaryKey; cls: string }> = {
	feature: {
		labelKey: 'roadmap.badge.feature',
		cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
	},
	bug: {
		labelKey: 'roadmap.badge.bug',
		cls: 'border-red-500/30 bg-red-500/10 text-red-400'
	}
}

function Card({ post, slug }: { post: RoadmapPost; slug: string }) {
	const { t } = useI18n()
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id: post.id })
	const router = useRouter()
	const badge = TYPE_BADGE[post.type] ?? TYPE_BADGE.feature

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			suppressHydrationWarning
			onClick={() => {
				if (!isDragging) router.push(`/dashboard/p/${slug}/post/${post.id}`)
			}}
			style={
				transform
					? { transform: `translate(${transform.x}px, ${transform.y}px)` }
					: undefined
			}
			className={`cursor-grab select-none rounded-xl border border-border bg-background p-4 transition-colors hover:border-border-strong active:cursor-grabbing ${
				isDragging ? 'z-10 opacity-80 shadow-lg' : ''
			}`}
		>
			<div className="flex items-center justify-between">
				<span
					className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${badge.cls}`}
				>
					{t(badge.labelKey)}
				</span>
				<span className="rounded-full border border-border px-2 py-0.5 text-xs text-fg-secondary">
					↑ {post.votesCount}
				</span>
			</div>
			<p className="mt-2.5 text-sm font-medium text-fg">{post.title}</p>
			{post.body && (
				<p className="mt-1 line-clamp-2 text-sm text-fg-muted">{post.body}</p>
			)}
			<div className="mt-3 flex items-center gap-2">
				{post.authorImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={post.authorImage}
						alt=""
						draggable={false}
						className="h-5 w-5 rounded-full"
					/>
				) : (
					<span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-medium text-fg">
						{post.authorName?.[0]?.toUpperCase() ?? '?'}
					</span>
				)}
				<span className="text-xs text-fg-muted">
					{post.authorName ?? t('roadmap.guest')}
				</span>
			</div>
		</div>
	)
}

function Column({
	colKey,
	label,
	hint,
	dot,
	children
}: {
	colKey: string
	label: string
	hint: string
	dot: string
	children: React.ReactNode
}) {
	const { setNodeRef, isOver } = useDroppable({ id: colKey })
	return (
		<section className="w-72 shrink-0">
			<div className="flex items-center gap-2 px-1">
				<span className={`h-2 w-2 rounded-full ${dot}`} />
				<h2 className="text-sm font-semibold text-fg">{label}</h2>
				<span className="text-sm text-fg-muted">
					{Array.isArray(children) ? children.length : 0}
				</span>
			</div>
			<p className="mt-0.5 px-1 text-xs text-fg-faint">{hint}</p>
			<div
				ref={setNodeRef}
				className={`mt-3 min-h-24 space-y-2 rounded-xl p-1 transition-colors ${
					isOver ? 'bg-surface' : ''
				}`}
			>
				{children}
			</div>
		</section>
	)
}

export function OwnerRoadmapBoard({
	slug,
	initial
}: {
	slug: string
	initial: RoadmapPost[]
}) {
	const { t } = useI18n()
	const [posts, setPosts] = useState(initial)
	const router = useRouter()
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
	)

	async function onDragEnd(e: DragEndEvent) {
		const postId = String(e.active.id)
		const newStatus = e.over ? String(e.over.id) : null
		if (!newStatus) return
		const post = posts.find(p => p.id === postId)
		if (!post || post.status === newStatus) return

		// Оптимистично двигаем карточку
		setPosts(ps =>
			ps.map(p => (p.id === postId ? { ...p, status: newStatus } : p))
		)

		const r = await fetch(`/api/posts/${postId}/status`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus })
		})

		if (!r.ok) {
			// Откат при ошибке
			setPosts(ps =>
				ps.map(p => (p.id === postId ? { ...p, status: post.status } : p))
			)
		}
		router.refresh()
	}

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={onDragEnd}
		>
			<div className="flex gap-4 overflow-x-auto pb-4">
				{COLUMNS.map(col => {
					const items = posts
						.filter(p => p.status === col.key)
						.sort((a, b) => b.votesCount - a.votesCount)
					return (
						<Column
							key={col.key}
							colKey={col.key}
							label={t(col.labelKey)}
							hint={t(col.hintKey)}
							dot={col.dot}
						>
							{items.map(p => (
								<Card
									key={p.id}
									post={p}
									slug={slug}
								/>
							))}
							{items.length === 0 && (
								<div className="rounded-xl border border-dashed border-border p-4 text-sm text-fg-faint">
									{t('roadmap.empty')}
								</div>
							)}
						</Column>
					)
				})}
			</div>
		</DndContext>
	)
}
