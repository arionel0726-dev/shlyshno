import { projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import {
	cancelSubscription,
	lemonSqueezySetup
} from '@lemonsqueezy/lemonsqueezy.js'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ subscriptionId: z.string() })

export async function POST(req: Request) {
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

	const sub = await db.query.subscriptions.findFirst({
		where: eq(subscriptions.subscriptionId, parsed.data.subscriptionId)
	})
	if (!sub)
		return NextResponse.json({ error: 'Подписка не найдена' }, { status: 404 })

	const project = await db.query.projects.findFirst({
		where: eq(projects.id, sub.projectId)
	})
	if (!project || project.ownerId !== session.user.id)
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })

	lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })
	const { error } = await cancelSubscription(Number(sub.subscriptionId))

	if (error)
		return NextResponse.json(
			{ error: 'Не удалось отменить подписку' },
			{ status: 500 }
		)

	await db
		.update(subscriptions)
		.set({ status: 'cancelled' })
		.where(eq(subscriptions.id, sub.id))
	await db
		.update(projects)
		.set({ plan: 'free' })
		.where(eq(projects.id, sub.projectId))

	return NextResponse.json({ ok: true })
}
