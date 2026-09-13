import { projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const PRO_STATUSES = new Set(['active', 'past_due', 'on_trial'])

function verifySignature(raw: string, signature: string): boolean {
	const expected = crypto
		.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
		.update(raw)
		.digest('hex')
	const a = Buffer.from(signature)
	const b = Buffer.from(expected)
	return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function POST(req: Request) {
	const raw = await req.text()
	const signature = req.headers.get('x-signature') ?? ''

	if (!verifySignature(raw, signature)) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
	}

	const payload = JSON.parse(raw)
	const event: string = payload.meta?.event_name ?? ''
	const meta = payload.meta ?? {}
	const customData: Record<string, unknown> | undefined =
		meta.custom_data ?? meta.custom

	const projectIdRaw = customData?.project_id as string | undefined
	if (!projectIdRaw) return NextResponse.json({ ok: true })
	const projectId: string = projectIdRaw

	const sub = payload.data
	const attrs: Record<string, any> = sub?.attributes ?? {}
	const subscriptionId = String(sub?.id ?? '')
	const customerId = String(attrs.customer_id ?? '')
	const status: string = attrs.status ?? 'active'
	const endsAt: Date | null = attrs.ends_at ? new Date(attrs.ends_at) : null
	const renewsAt: Date | null = attrs.renews_at
		? new Date(attrs.renews_at)
		: null

	// Pro держим, пока статус «живой» и оплаченный период не вышел
	const isProNow =
		PRO_STATUSES.has(status) && (!endsAt || endsAt.getTime() > Date.now())

	async function syncPlan() {
		await db
			.update(projects)
			.set({ plan: isProNow ? 'pro' : 'free' })
			.where(eq(projects.id, projectId))
	}

	if (event === 'subscription_created' || event === 'subscription_updated') {
		const existing = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.subscriptionId, subscriptionId)
		})

		if (existing) {
			await db
				.update(subscriptions)
				.set({ status, customerId, endsAt, renewsAt })
				.where(eq(subscriptions.id, existing.id))
		} else {
			await db.insert(subscriptions).values({
				projectId,
				provider: 'lemonsqueezy',
				customerId,
				subscriptionId,
				plan: 'pro',
				status,
				endsAt,
				renewsAt
			})
		}

		await syncPlan()
	}

	if (event === 'subscription_payment_success') {
		// Продление: подтверждаем Pro, обновляем даты следующего списания
		const existing = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.projectId, projectId)
		})
		if (existing) {
			await db
				.update(subscriptions)
				.set({ renewsAt, endsAt })
				.where(eq(subscriptions.id, existing.id))
			await syncPlan()
		}
	}

	if (event === 'subscription_cancelled') {
		// Отмена: Pro сохраняется до конца оплаченного периода (endsAt)
		await db
			.update(subscriptions)
			.set({ status: 'cancelled', endsAt })
			.where(eq(subscriptions.subscriptionId, subscriptionId))
		if (!endsAt || endsAt.getTime() <= Date.now()) {
			await db
				.update(projects)
				.set({ plan: 'free' })
				.where(eq(projects.id, projectId))
		}
	}

	if (event === 'subscription_expired') {
		await db
			.update(subscriptions)
			.set({ status: 'expired', endsAt })
			.where(eq(subscriptions.subscriptionId, subscriptionId))
		await db
			.update(projects)
			.set({ plan: 'free' })
			.where(eq(projects.id, projectId))
	}

	if (event === 'order_refunded') {
		await db
			.update(projects)
			.set({ plan: 'free' })
			.where(eq(projects.id, projectId))
	}

	return NextResponse.json({ ok: true })
}
