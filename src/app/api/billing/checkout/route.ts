import { projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import {
	createCheckout,
	lemonSqueezySetup
} from '@lemonsqueezy/lemonsqueezy.js'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ slug: z.string() })

export async function POST(req: Request) {
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, parsed.data.slug)
	})
	if (!project || project.ownerId !== session.user.id)
		return NextResponse.json({ error: 'Только владелец' }, { status: 403 })

	lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })

	const { data, error } = await createCheckout(
		Number(process.env.LEMONSQUEEZY_STORE_ID),
		Number(process.env.LEMONSQUEEZY_VARIANT_ID),
		{
			checkoutData: {
				email: session.user.email,
				custom: { project_id: project.id }
			},
			productOptions: {
				redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/p/${project.slug}?upgraded=1`,
				receiptThankYouNote: 'Спасибо за поддержку Slyshno!'
			}
		}
	)

	if (error || !data) {
		console.error('[LS checkout error]', JSON.stringify(error, null, 2))
		return NextResponse.json(
			{ error: 'Не удалось создать оплату' },
			{ status: 500 }
		)
	}

	return NextResponse.json({ url: data.data.attributes.url })
}
