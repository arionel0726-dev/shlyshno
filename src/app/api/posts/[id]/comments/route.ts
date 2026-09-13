import { comments, postSubscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const list = await db
		.select({
			id: comments.id,
			body: comments.body,
			authorName: comments.authorName,
			authorEmail: comments.authorEmail,
			createdAt: comments.createdAt
		})
		.from(comments)
		.where(eq(comments.postId, id))
		.orderBy(desc(comments.createdAt))
	return NextResponse.json({ comments: list })
}

const schema = z.object({
	body: z.string().min(1, 'Пустой комментарий').max(2000),
	name: z.string().max(80).optional(),
	email: z.string().email().optional()
})

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const session = await getSession()

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	// Гость обязан оставить email (для ответов и антиспама)
	if (!session && !parsed.data.email) {
		return NextResponse.json(
			{ error: 'Укажите email, чтобы прокомментировать' },
			{ status: 400 }
		)
	}

	const displayName = session
		? session.user.name
		: (parsed.data.name ?? parsed.data.email?.split('@')[0] ?? 'Гость')

	const [created] = await db
		.insert(comments)
		.values({
			postId: id,
			body: parsed.data.body,
			authorId: session?.user.id ?? null,
			authorName: displayName,
			authorEmail: session?.user.email ?? parsed.data.email ?? null
		})
		.returning()

	// Комментатор подписывается на карточку
	const email = session?.user.email ?? parsed.data.email
	if (email) {
		await db
			.insert(postSubscriptions)
			.values({ postId: id, email })
			.onConflictDoNothing()
	}

	return NextResponse.json(created, { status: 201 })
}
