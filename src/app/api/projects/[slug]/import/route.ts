import { boards, posts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Маппинг статусов Canny → наши
const STATUS_MAP: Record<string, string> = {
	open: 'pending',
	under_review: 'reviewing',
	reviewing: 'reviewing',
	planned: 'planned',
	in_progress: 'in_progress',
	complete: 'completed',
	completed: 'completed',
	closed: 'closed'
}

const schema = z.object({
	items: z
		.array(
			z.object({
				title: z.string().min(1).max(140),
				body: z.string().max(2000).optional(),
				status: z.string().optional()
			})
		)
		.min(1)
		.max(500)
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

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: 'Неверный формат (макс. 500 строк)' },
			{ status: 400 }
		)

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})
	if (!board)
		return NextResponse.json({ error: 'Доска не найдена' }, { status: 404 })

	const values = parsed.data.items.map(item => ({
		boardId: board.id,
		title: item.title,
		body: item.body || null,
		status: (item.status && STATUS_MAP[item.status.toLowerCase()]) || 'pending',
		authorId: session.user.id,
		authorEmail: session.user.email
	}))

	await db.insert(posts).values(values)

	return NextResponse.json({ imported: values.length })
}
