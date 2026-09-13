import { projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	name: z.string().min(1).max(80).optional(),
	website: z.string().url().max(200).nullable().optional()
})

export async function PATCH(
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
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const [updated] = await db
		.update(projects)
		.set({
			...(parsed.data.name !== undefined && { name: parsed.data.name }),
			...(parsed.data.website !== undefined && {
				website: parsed.data.website
			})
		})
		.where(eq(projects.id, project.id))
		.returning()

	return NextResponse.json(updated)
}

export async function DELETE(
	_req: Request,
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

	await db.delete(projects).where(eq(projects.id, project.id))
	return NextResponse.json({ ok: true })
}
