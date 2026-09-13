// src/app/api/posts/[id]/status/route.ts
import { boards, outbox, posts, postSubscriptions, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	status: z.enum([
		'pending',
		'reviewing',
		'planned',
		'in_progress',
		'completed',
		'closed'
	])
})

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json({ error: 'Неверный статус' }, { status: 400 })

	const post = await db.query.posts.findFirst({ where: eq(posts.id, id) })
	if (!post) return NextResponse.json({ error: 'Не найдено' }, { status: 404 })

	const board = await db.query.boards.findFirst({
		where: eq(boards.id, post.boardId)
	})
	const project = await db.query.projects.findFirst({
		where: eq(projects.id, board!.projectId)
	})
	if (project?.ownerId !== session.user.id) {
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })
	}

	const [updated] = await db
		.update(posts)
		.set({
			status: parsed.data.status,
			completedAt: parsed.data.status === 'completed' ? new Date() : null
		})
		.where(eq(posts.id, id))
		.returning()

	// Статус "completed" → письма всем подписчикам в outbox
	if (parsed.data.status === 'completed') {
		const subs = await db
			.select()
			.from(postSubscriptions)
			.where(eq(postSubscriptions.postId, id))

		for (const sub of subs) {
			await db.insert(outbox).values({
				to: sub.email,
				subject: `✅ Готово: ${post.title}`,
				html: `<p>Идея «${post.title}», за которую вы голосовали, реализована.</p>
               <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/p/${project!.slug}">Открыть доску →</a></p>`
			})
		}
	}

	return NextResponse.json(updated)
}
