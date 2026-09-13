import { boards, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const post = await db.query.posts.findFirst({ where: eq(posts.id, id) })
	if (!post) return NextResponse.json({ error: 'Не найдено' }, { status: 404 })

	const board = await db.query.boards.findFirst({
		where: eq(boards.id, post.boardId)
	})
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, board!.projectId)
	})
	if (project?.ownerId !== session.user.id)
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })

	await db.delete(posts).where(eq(posts.id, id))
	return NextResponse.json({ ok: true })
}
