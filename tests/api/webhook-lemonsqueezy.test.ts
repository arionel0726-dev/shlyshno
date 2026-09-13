import { POST } from '@/app/api/webhooks/lemonsqueezy/route'
import { projects, subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, db, resetDb } from '../db'
import { signPayload, webhookRequest } from '../lib/sign'

beforeEach(async () => {
	await resetDb()
})

describe('POST /api/webhooks/lemonsqueezy', () => {
	it('rejects a request with an invalid signature', async () => {
		const res = await POST(
			webhookRequest(
				{ meta: { event_name: 'subscription_created' }, data: {} },
				'not-a-valid-signature'
			)
		)
		expect(res.status).toBe(403)
	})

	it('accepts a request with a valid signature', async () => {
		const project = await createProject({ plan: 'free' })
		const res = await POST(
			webhookRequest({
				meta: {
					event_name: 'subscription_created',
					custom_data: { project_id: project.id }
				},
				data: {
					id: 'ls_sub_1',
					attributes: {
						customer_id: 'cust_1',
						status: 'active',
						ends_at: null,
						renews_at: '2026-02-01T00:00:00Z'
					}
				}
			})
		)
		expect(res.status).toBe(200)
	})

	it('reads project_id from meta.custom_data (object, not array) and upgrades the project to pro', async () => {
		const project = await createProject({ plan: 'free' })
		const res = await POST(
			webhookRequest({
				meta: {
					event_name: 'subscription_created',
					custom_data: { project_id: project.id }
				},
				data: {
					id: 'ls_sub_2',
					attributes: {
						customer_id: 'cust_1',
						status: 'active',
						ends_at: null,
						renews_at: '2026-02-01T00:00:00Z'
					}
				}
			})
		)
		expect(res.status).toBe(200)

		const updated = await db.query.projects.findFirst({
			where: eq(projects.id, project.id)
		})
		expect(updated?.plan).toBe('pro')

		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.subscriptionId, 'ls_sub_2')
		})
		expect(sub?.projectId).toBe(project.id)
		expect(sub?.status).toBe('active')
	})

	it('ignores the event (200, no-op) when custom_data has no project_id', async () => {
		const raw = JSON.stringify({
			meta: { event_name: 'subscription_created', custom_data: {} },
			data: { id: 'ls_sub_3', attributes: { status: 'active' } }
		})
		const res = await POST(
			new Request('http://localhost:3000/api/webhooks/lemonsqueezy', {
				method: 'POST',
				headers: { 'x-signature': signPayload(raw) },
				body: raw
			})
		)
		expect(res.status).toBe(200)
		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.subscriptionId, 'ls_sub_3')
		})
		expect(sub).toBeUndefined()
	})

	it('soft-cancels: cancelled + future endsAt keeps the project on pro', async () => {
		const project = await createProject({ plan: 'pro' })
		const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

		// Подписка уже существует (создана раньше через subscription_created)
		await db.insert(subscriptions).values({
			projectId: project.id,
			subscriptionId: 'ls_sub_cancel',
			plan: 'pro',
			status: 'active'
		})

		const res = await POST(
			webhookRequest({
				meta: {
					event_name: 'subscription_cancelled',
					custom_data: { project_id: project.id }
				},
				data: {
					id: 'ls_sub_cancel',
					attributes: {
						status: 'cancelled',
						ends_at: futureDate.toISOString()
					}
				}
			})
		)
		expect(res.status).toBe(200)

		const updatedProject = await db.query.projects.findFirst({
			where: eq(projects.id, project.id)
		})
		expect(updatedProject?.plan).toBe('pro')

		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.subscriptionId, 'ls_sub_cancel')
		})
		expect(sub?.status).toBe('cancelled')
	})

	it('cancelled + endsAt in the past downgrades the project to free', async () => {
		const project = await createProject({ plan: 'pro' })
		const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)

		await db.insert(subscriptions).values({
			projectId: project.id,
			subscriptionId: 'ls_sub_cancel_2',
			plan: 'pro',
			status: 'active'
		})

		const res = await POST(
			webhookRequest({
				meta: {
					event_name: 'subscription_cancelled',
					custom_data: { project_id: project.id }
				},
				data: {
					id: 'ls_sub_cancel_2',
					attributes: { status: 'cancelled', ends_at: pastDate.toISOString() }
				}
			})
		)
		expect(res.status).toBe(200)

		const updatedProject = await db.query.projects.findFirst({
			where: eq(projects.id, project.id)
		})
		expect(updatedProject?.plan).toBe('free')
	})
})
