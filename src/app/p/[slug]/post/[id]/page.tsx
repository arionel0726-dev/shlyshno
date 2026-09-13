import { PortalActions } from '@/components/portal-actions'
import { PortalHeader } from '@/components/portal-header'
import { PublicPost } from '@/components/public-post'
import { boards, comments, posts, projects, votes } from '@/db/schema'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, desc, eq, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'

const STATUS_META: Record<string, { labelKey: DictionaryKey; dot: string }> = {
	pending: { labelKey: 'portalStatus.pending', dot: 'bg-neutral-400' },
	reviewing: { labelKey: 'portalStatus.reviewing', dot: 'bg-amber-500' },
	planned: { labelKey: 'portalStatus.planned', dot: 'bg-blue-500' },
	in_progress: { labelKey: 'portalStatus.in_progress', dot: 'bg-violet-500' },
	completed: { labelKey: 'portalStatus.completed', dot: 'bg-emerald-500' },
	closed: { labelKey: 'portalStatus.closed', dot: 'bg-neutral-500' }
}

export default async function PublicPostPage({
	params
}: {
	params: Promise<{ slug: string; id: string }>
}) {
	const { slug, id } = await params
	const { t } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) notFound()

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	const post = board
		? await db.query.posts.findFirst({
				where: and(eq(posts.id, id), eq(posts.boardId, board.id))
			})
		: null
	if (!post) notFound()

	const session = await getSession()

	const [votesAgg] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(votes)
		.where(eq(votes.postId, post.id))

	const commentList = await db
		.select()
		.from(comments)
		.where(eq(comments.postId, post.id))
		.orderBy(desc(comments.createdAt))

	const meta = STATUS_META[post.status]
	const typeLabel =
		post.type === 'bug' ? t('portal.category.bugs') : t('portal.category.features')

	return (
		<div className="min-h-screen">
			<PortalHeader
				slug={slug}
				projectName={project.name}
			/>
			<div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row">
				<main className="min-w-0 flex-1 max-w-2xl">
					<p className="text-xs text-fg-muted">
						{post.authorEmail?.split('@')[0] ?? t('portal.defaultUser')}{' '}
						<span className="text-fg-faint">
							{t('portal.postedIn', { category: typeLabel })}
						</span>
					</p>
					<h1 className="mt-1.5 text-2xl font-bold text-fg">{post.title}</h1>
					{post.body && (
						<p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-fg-secondary">
							{post.body}
						</p>
					)}
					{meta && (
						<div className="mt-4 flex items-center gap-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-fg-secondary">
								<span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
								{t(meta.labelKey)}
							</span>
						</div>
					)}

					<div className="mt-8">
						<PublicPost
							postId={post.id}
							votesCount={votesAgg?.count ?? 0}
							isLoggedIn={!!session}
							initialComments={commentList.map(c => ({
								id: c.id,
								body: c.body,
								authorName: c.authorName,
								createdAt: c.createdAt
							}))}
						/>
					</div>
				</main>

				<aside className="w-full shrink-0 lg:w-60">
					<div className="border-t border-border pt-5">
						<p className="text-xs font-medium text-fg-faint">
							{t('portal.sidebar.actionsHeading')}
						</p>
						<PortalActions />
					</div>
				</aside>
			</div>
		</div>
	)
}
