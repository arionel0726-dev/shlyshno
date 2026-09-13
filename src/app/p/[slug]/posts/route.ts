// src/app/api/p/[slug]/posts/route.ts
import { boards, posts, postSubscriptions, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	title: z.string().min(3, 'Минимум 3 символа').max(140),
	body: z.string().max(2000).optional(),
	email: z.string().email().optional()
})

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params
	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project)
		return NextResponse.json({ error: 'Проект не найден' }, { status: 404 })

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board)
		return NextResponse.json({ error: 'Доска не найдена' }, { status: 404 })

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

	// Автор сразу подписан на обновления карточки
	const email = session?.user.email ?? parsed.data.email
	if (email) {
		await db
			.insert(postSubscriptions)
			.values({ postId: post.id, email })
			.onConflictDoNothing()
	}

	return NextResponse.json(post, { status: 201 })
}
