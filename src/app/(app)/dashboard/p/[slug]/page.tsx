import { FeedbackWorkspace } from '@/components/feedback-workspace'
import { NewRequestModal } from '@/components/new-request-modal'
import { boards, posts, projects, votes } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, desc, eq, sql } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function ManageProject({
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

	const list = board
		? await db
				.select({
					id: posts.id,
					title: posts.title,
					body: posts.body,
					status: posts.status,
					type: posts.type,
					votesCount: sql<number>`count(${votes.id})::int`,
					createdAt: posts.createdAt
				})
				.from(posts)
				.leftJoin(votes, eq(votes.postId, posts.id))
				.where(eq(posts.boardId, board.id))
				.groupBy(posts.id)
				.orderBy(desc(sql`count(${votes.id})`))
		: []

	return (
		<div>
			<FeedbackWorkspace
				slug={slug}
				posts={list}
			/>
			<NewRequestModal slug={slug} />
		</div>
	)
}
