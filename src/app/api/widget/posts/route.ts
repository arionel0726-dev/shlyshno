// src/app/api/widget/posts/route.ts
import { user } from '@/db/auth-schema'
import { boards, posts, postSubscriptions, projects, votes } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, desc, eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

async function resolveBoard(key: string) {
	const project = await db.query.projects.findFirst({
		where: eq(projects.publicKey, key)
	})
	if (!project) return null
	return db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
}

export async function GET(req: Request) {
	const key = new URL(req.url).searchParams.get('key') ?? ''

	const project = await db.query.projects.findFirst({
		where: eq(projects.publicKey, key)
	})
	if (!project)
		return NextResponse.json({ error: 'Неверный ключ' }, { status: 404 })

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board)
		return NextResponse.json({ error: 'Доска не найдена' }, { status: 404 })

	const list = await db
		.select({
			id: posts.id,
			title: posts.title,
			body: posts.body,
			status: posts.status,
			type: posts.type,
			votesCount: sql<number>`count(${votes.id})::int`,
			authorName: user.name,
			authorImage: user.image
		})
		.from(posts)
		.leftJoin(votes, eq(votes.postId, posts.id))
		.leftJoin(user, eq(posts.authorId, user.id))
		.where(eq(posts.boardId, board.id))
		.groupBy(posts.id, user.name, user.image)
		.orderBy(desc(sql`count(${votes.id})`))
		.limit(50)

	return NextResponse.json({ slug: project.slug, posts: list })
}

const createSchema = z.object({
	key: z.string().min(10),
	title: z.string().min(3, 'Минимум 3 символа').max(140),
	body: z.string().max(2000).optional(),
	email: z.string().email().optional()
})

export async function POST(req: Request) {
	const parsed = createSchema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const board = await resolveBoard(parsed.data.key)
	if (!board)
		return NextResponse.json({ error: 'Неверный ключ' }, { status: 404 })

	const session = await getSession()
	const [post] = await db
		.insert(posts)
		.values({
			boardId: board.id,
			title: parsed.data.title,
			body: parsed.data.body || null,
			authorId: session?.user.id ?? null,
			authorEmail: session?.user.email ?? parsed.data.email ?? null
		})
		.returning({ id: posts.id })

	const email = session?.user.email ?? parsed.data.email
	if (email) {
		await db
			.insert(postSubscriptions)
			.values({ postId: post.id, email })
			.onConflictDoNothing()
	}

	return NextResponse.json(post, { status: 201 })
}
