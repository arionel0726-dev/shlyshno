import { OwnerRoadmapBoard } from '@/components/owner-roadmap-board'
import { user } from '@/db/auth-schema'
import { boards, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, eq, sql } from 'drizzle-orm'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function OwnerRoadmap({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const session = await getSession()
	if (!session) redirect('/')

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board) notFound()

	const list = await db
		.select({
			id: posts.id,
			title: posts.title,
			body: posts.body,
			status: posts.status,
			type: posts.type,
			votesCount: sql<number>`(select count(*) from votes where votes.post_id = ${posts.id})::int`,
			authorName: user.name,
			authorImage: user.image
		})
		.from(posts)
		.leftJoin(user, eq(posts.authorId, user.id))
		.where(eq(posts.boardId, board.id))

	return (
		<div className="p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-fg">Роадмап</h1>
					<p className="mt-1 text-sm text-fg-secondary">
						Что движется: от новых идей до релизов. Перетаскивайте карточки
						между колонками.
					</p>
				</div>
				<Link
					href={`/dashboard/p/${slug}`}
					className="rounded-full border border-border px-4 py-2 text-sm text-fg-secondary hover:bg-surface"
				>
					Список →
				</Link>
			</div>

			<div className="mt-8">
				<OwnerRoadmapBoard
					slug={slug}
					initial={list}
				/>
			</div>
		</div>
	)
}
