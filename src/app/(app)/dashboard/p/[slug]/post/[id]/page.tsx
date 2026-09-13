import { PostComments } from '@/components/post-comments'
import { PostStatusSelect } from '@/components/post-status-select'
import { user } from '@/db/auth-schema'
import { boards, comments, posts, projects, votes } from '@/db/schema'
import type { Locale } from '@/i18n/config'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, desc, eq, sql } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

const TYPE_META: Record<string, { labelKey: DictionaryKey; dot: string }> = {
	feature: { labelKey: 'newRequest.type.feature', dot: 'bg-blue-500' },
	bug: { labelKey: 'newRequest.type.bug', dot: 'bg-red-500' }
}

const DATE_LOCALE: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US' }

export default async function PostDetail({
	params
}: {
	params: Promise<{ slug: string; id: string }>
}) {
	const { slug, id } = await params
	const session = await getSession()
	if (!session) redirect('/')
	const { t, locale } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board) notFound()

	const post = await db.query.posts.findFirst({
		where: and(eq(posts.id, id), eq(posts.boardId, board.id))
	})
	if (!post) notFound()

	const [votesAgg] = await db
		.select({ count: sql<number>`count(${votes.id})::int` })
		.from(votes)
		.where(eq(votes.postId, post.id))

	const commentList = await db
		.select({
			id: comments.id,
			body: comments.body,
			authorEmail: comments.authorEmail,
			createdAt: comments.createdAt,
			authorName: user.name
		})
		.from(comments)
		.leftJoin(user, eq(comments.authorId, user.id))
		.where(eq(comments.postId, post.id))
		.orderBy(desc(comments.createdAt))

	const type = TYPE_META[post.type] ?? TYPE_META.feature

	return (
		<div className="p-8">
			<Link
				href={`/dashboard/p/${slug}`}
				className="text-sm text-fg-muted hover:text-fg"
			>
				{t('postDetail.backToFeedback')}
			</Link>

			<div className="mt-4 flex gap-10">
				{/* Main */}
				<main className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className={`h-2 w-2 rounded-full ${type.dot}`} />
						<span className="text-sm text-fg-secondary">
							{t(type.labelKey)}
						</span>
					</div>
					<h1 className="mt-2 text-3xl font-bold text-fg">{post.title}</h1>
					{post.body && (
						<p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg-secondary">
							{post.body}
						</p>
					)}

					<h2 className="mt-10 text-sm font-semibold text-fg">
						{t('postDetail.discussion', { count: commentList.length })}
					</h2>
					<div className="mt-4">
						<PostComments
							postId={post.id}
							initial={commentList}
						/>
					</div>
				</main>

				{/* Details panel */}
				<aside className="w-64 shrink-0">
					<div className="rounded-2xl border border-border p-5">
						<p className="text-xs text-fg-faint">
							{t('newRequest.statusMenu.label')}
						</p>
						<div className="mt-1.5">
							<PostStatusSelect
								postId={post.id}
								status={post.status}
							/>
						</div>

						<p className="mt-5 text-xs text-fg-faint">{t('postDetail.votes')}</p>
						<p className="mt-1 text-sm font-medium text-fg">
							▲ {votesAgg?.count ?? 0}
						</p>

						<p className="mt-5 text-xs text-fg-faint">
							{t('postDetail.created')}
						</p>
						<p className="mt-1 text-sm text-fg">
							{new Date(post.createdAt).toLocaleDateString(DATE_LOCALE[locale])}
						</p>

						<Link
							href={`/p/${slug}`}
							className="mt-5 block border-t border-border pt-4 text-sm text-fg-muted underline hover:text-fg"
						>
							{t('postDetail.openPublicBoard')}
						</Link>
					</div>
				</aside>
			</div>
		</div>
	)
}
