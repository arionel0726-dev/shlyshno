// src/app/api/posts/vote/route.ts
import { votes } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	postId: z.string().uuid(),
	guestKey: z.string().min(10).max(64).optional()
})

export async function POST(req: Request) {
	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

	const session = await getSession()
	const userId = session?.user.id ?? null
	const guestKey = userId ? null : (parsed.data.guestKey ?? null)
	if (!userId && !guestKey)
		return NextResponse.json({ error: 'Нет голосующего' }, { status: 401 })

	const { postId } = parsed.data
	const existing = await db.query.votes.findFirst({
		where: and(
			eq(votes.postId, postId),
			userId ? eq(votes.userId, userId) : eq(votes.guestKey, guestKey!)
		)
	})

	if (existing) {
		await db.delete(votes).where(eq(votes.id, existing.id))
		return NextResponse.json({ voted: false })
	}

	await db
		.insert(votes)
		.values({ postId, userId, guestKey })
		.onConflictDoNothing()
	return NextResponse.json({ voted: true })
}
