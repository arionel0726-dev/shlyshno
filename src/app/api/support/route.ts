import { outbox } from '@/db/schema'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email('Неверный email'),
	message: z.string().min(5, 'Опишите проблему чуть подробнее').max(3000)
})

export async function POST(req: Request) {
	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const { email, message } = parsed.data
	const to = process.env.SUPPORT_EMAIL ?? 'hello@slyshno.com'

	await db.insert(outbox).values({
		to,
		subject: `Slyshno Support: сообщение от ${email}`,
		html: `<p><b>От:</b> ${email}</p><p style="white-space:pre-line">${message.replace(/</g, '&lt;')}</p>`
	})

	// Сразу пробуем отправить (fire-and-forget, секрет знает только сервер)
	fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/outbox`, {
		headers: { 'x-cron-secret': process.env.CRON_SECRET! }
	}).catch(() => {})

	return NextResponse.json({ ok: true })
}
