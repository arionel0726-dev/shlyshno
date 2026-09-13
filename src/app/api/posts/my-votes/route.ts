// src/app/api/posts/my-votes/route.ts
import { votes } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	const session = await getSession()
	const guestKey = req.headers.get('x-guest-key')

	const rows = session
		? await db
				.select({ postId: votes.postId })
				.from(votes)
				.where(eq(votes.userId, session.user.id))
		: guestKey
			? await db
					.select({ postId: votes.postId })
					.from(votes)
					.where(eq(votes.guestKey, guestKey))
			: []

	return NextResponse.json({ postIds: rows.map(r => r.postId) })
}
