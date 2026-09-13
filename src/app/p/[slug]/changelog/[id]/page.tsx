import { PortalActions } from '@/components/portal-actions'
import { PortalHeader } from '@/components/portal-header'
import { user } from '@/db/auth-schema'
import { boards, changelogPosts, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export default async function ChangelogEntry({
	params
}: {
	params: Promise<{ slug: string; id: string }>
}) {
	const { slug, id } = await params

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) notFound()

	const entry = await db.query.changelogPosts.findFirst({
		where: and(
			eq(changelogPosts.id, id),
			eq(changelogPosts.projectId, project.id)
		)
	})
	if (!entry) notFound()

	const author = entry
		? await db.query.user.findFirst({
				where: eq(user.id, project.ownerId)
			})
		: null

	// «В планах» — карточки фидбека в плане/в работе
	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	const upcoming = board
		? await db.query.posts.findMany({
				where: and(
					eq(posts.boardId, board.id),
					inArray(posts.status, ['planned', 'in_progress'])
				),
				orderBy: (p, { desc }) => [desc(p.createdAt)],
				limit: 5
			})
		: []

	return (
		<div className="min-h-screen">
			<PortalHeader
				slug={slug}
				projectName={project.name}
			/>
			<div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
				<article className="min-w-0 flex-1 max-w-2xl">
					<p className="text-sm text-fg-muted">
						{entry.publishAt
							? new Date(entry.publishAt).toLocaleDateString('ru-RU', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})
							: ''}
					</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-fg">
						{entry.title}
					</h1>

					{author && (
						<div className="mt-5 flex items-center gap-3">
							{author.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={author.image}
									alt=""
									className="h-9 w-9 rounded-full"
								/>
							) : (
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-sm font-medium text-fg">
									{author.name?.[0]?.toUpperCase()}
								</span>
							)}
							<div>
								<p className="text-sm font-medium text-fg">{author.name}</p>
								<p className="text-xs text-fg-muted">Команда {project.name}</p>
							</div>
						</div>
					)}

					<p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-fg-secondary">
						{entry.body}
					</p>
				</article>

				<aside className="hidden w-64 shrink-0 lg:block">
					<p className="text-sm font-semibold text-fg">В планах</p>
					<ul className="mt-3 space-y-2.5">
						{upcoming.map(p => (
							<li
								key={p.id}
								className="flex items-center gap-2 text-sm"
							>
								<span
									className={`h-1.5 w-1.5 shrink-0 rounded-full ${
										p.status === 'in_progress' ? 'bg-violet-500' : 'bg-blue-500'
									}`}
								/>
								<span className="min-w-0 flex-1 truncate text-fg-secondary">
									{p.title}
								</span>
							</li>
						))}
						{upcoming.length === 0 && (
							<li className="text-sm text-fg-faint">
								План появится вместе с голосами
							</li>
						)}
					</ul>

					<div className="mt-8 border-t border-border pt-5">
						<p className="text-xs font-medium text-fg-faint">ДЕЙСТВИЯ</p>
						<div className="mt-2">
							<PortalActions />
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}
