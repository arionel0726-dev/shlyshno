// src/app/api/projects/[slug]/posts/route.ts
import { boards, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	title: z.string().min(3, 'Минимум 3 символа').max(140),
	body: z.string().max(2000).optional(),
	type: z.enum(['feature', 'bug']).default('feature'),
	status: z
		.enum([
			'pending',
			'reviewing',
			'planned',
			'in_progress',
			'completed',
			'closed'
		])
		.default('reviewing')
})

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id)
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board)
		return NextResponse.json({ error: 'Доска не найдена' }, { status: 404 })

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const [post] = await db
		.insert(posts)
		.values({
			boardId: board.id,
			title: parsed.data.title,
			body: parsed.data.body || null,
			type: parsed.data.type,
			status: parsed.data.status,
			authorId: session.user.id,
			authorEmail: session.user.email
		})
		.returning({ id: posts.id })

	return NextResponse.json(post, { status: 201 })
}
