import { BoardView } from '@/components/board-view'
import { user } from '@/db/auth-schema'
import { boards, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { and, eq, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export default async function PublicBoard({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) notFound()

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})

	const list = board
		? await db
				.select({
					id: posts.id,
					title: posts.title,
					body: posts.body,
					status: posts.status,
					type: posts.type,
					createdAt: posts.createdAt,
					votesCount: sql<number>`(select count(*) from votes where votes.post_id = ${posts.id})::int`,
					commentsCount: sql<number>`(select count(*) from comments where comments.post_id = ${posts.id})::int`,
					authorName: user.name,
					authorImage: user.image
				})
				.from(posts)
				.leftJoin(user, eq(posts.authorId, user.id))
				.where(eq(posts.boardId, board.id))
		: []

	return (
		<BoardView
			slug={slug}
			projectName={project.name}
			posts={list}
		/>
	)
}
