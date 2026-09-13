// src/app/api/p/[slug]/changelog/route.ts
import { changelogPosts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	title: z.string().min(3).max(140),
	body: z.string().min(3)
})

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params
	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project)
		return NextResponse.json({ error: 'Не найдено' }, { status: 404 })

	const list = await db
		.select()
		.from(changelogPosts)
		.where(eq(changelogPosts.projectId, project.id))
		.orderBy(desc(changelogPosts.publishAt))
	return NextResponse.json({ posts: list })
}

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
	if (!project || project.ownerId !== session.user.id) {
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })
	}

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const [entry] = await db
		.insert(changelogPosts)
		.values({
			projectId: project.id,
			title: parsed.data.title,
			body: parsed.data.body,
			status: 'published',
			publishAt: new Date()
		})
		.returning()

	return NextResponse.json(entry, { status: 201 })
}
