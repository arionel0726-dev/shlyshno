// src/app/api/cron/outbox/route.ts
import { outbox } from '@/db/schema'
import { db } from '@/lib/db'
import { resend } from '@/lib/email'
import { and, eq, isNull, lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}
	if (!resend)
		return NextResponse.json(
			{ error: 'RESEND_API_KEY не задан' },
			{ status: 500 }
		)

	const batch = await db
		.select()
		.from(outbox)
		.where(and(isNull(outbox.sentAt), lt(outbox.attempts, 5)))
		.limit(20)

	let sent = 0
	for (const item of batch) {
		try {
			await resend.emails.send({
				from: 'Slyshno <onboarding@resend.dev>',
				to: item.to,
				subject: item.subject,
				html: item.html
			})
			await db
				.update(outbox)
				.set({ sentAt: new Date() })
				.where(eq(outbox.id, item.id))
			sent++
		} catch {
			await db
				.update(outbox)
				.set({ attempts: (item.attempts ?? 0) + 1 })
				.where(eq(outbox.id, item.id))
		}
	}
	return NextResponse.json({ sent, attempted: batch.length })
}
