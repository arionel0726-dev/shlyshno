import { boards, posts, votes } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { decrementVotes, isProjectPro, tryIncrementVotes } from '@/lib/usage'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	postId: z.string().uuid(),
	guestKey: z.string().min(10).max(64).optional()
})

export async function POST(req: Request) {
	const parsed = schema.safeParse(await req.json().catch(() => ({})))
	if (!parsed.success)
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

	const session = await getSession()
	const userId = session?.user.id ?? null
	const guestKey = userId ? null : (parsed.data.guestKey ?? null)
	if (!userId && !guestKey)
		return NextResponse.json({ error: 'Нет голосующего' }, { status: 401 })

	const { postId } = parsed.data

	const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) })
	if (!post)
		return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
	const board = await db.query.boards.findFirst({
		where: eq(boards.id, post.boardId)
	})
	if (!board)
		return NextResponse.json({ error: 'Доска не найдена' }, { status: 404 })
	const projectId = board.projectId

	const existing = await db.query.votes.findFirst({
		where: and(
			eq(votes.postId, postId),
			userId ? eq(votes.userId, userId) : eq(votes.guestKey, guestKey!)
		)
	})

	if (existing) {
		await db.delete(votes).where(eq(votes.id, existing.id))
		await decrementVotes(projectId)
		return NextResponse.json({ voted: false })
	}

	// Лимет Free-тарифа: Pro не ограничен, Free — 100 голосов/мес
	if (!(await isProjectPro(projectId))) {
		if (!(await tryIncrementVotes(projectId))) {
			return NextResponse.json({ error: 'limit' }, { status: 403 })
		}
	}

	await db
		.insert(votes)
		.values({ postId, userId, guestKey })
		.onConflictDoNothing()
	return NextResponse.json({ voted: true })
}
