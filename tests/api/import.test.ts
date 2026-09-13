import { POST } from '@/app/api/projects/[slug]/import/route'
import { posts } from '@/db/schema'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoard, createProject, db, resetDb } from '../db'

vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))

function sessionFor(userId: string) {
	return {
		user: { id: userId, name: 'Test', email: `${userId}@example.com` }
	} as Awaited<ReturnType<typeof getSession>>
}

function importRequest(slug: string, items: unknown[]) {
	return new Request(`http://localhost:3000/api/projects/${slug}/import`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ items })
	})
}

beforeEach(async () => {
	await resetDb()
})

describe('POST /api/projects/[slug]/import', () => {
	it('maps Canny statuses onto our post_status enum', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		await createBoard(project.id)
		vi.mocked(getSession).mockResolvedValue(sessionFor('owner-1'))

		const res = await POST(
			importRequest(project.slug, [
				{ title: 'Open one', status: 'open' },
				{ title: 'Under review one', status: 'under_review' },
				{ title: 'Planned one', status: 'planned' },
				{ title: 'In progress one', status: 'in_progress' },
				{ title: 'Complete one', status: 'complete' },
				{ title: 'Closed one', status: 'closed' },
				{ title: 'Unknown status falls back to pending', status: 'bogus' },
				{ title: 'No status falls back to pending' }
			]),
			{ params: Promise.resolve({ slug: project.slug }) }
		)

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ imported: 8 })

		const rows = await db.query.posts.findMany({
			where: eq(posts.boardId, (await db.query.boards.findFirst())!.id)
		})
		const byTitle = Object.fromEntries(rows.map(r => [r.title, r.status]))
		expect(byTitle['Open one']).toBe('pending')
		expect(byTitle['Under review one']).toBe('reviewing')
		expect(byTitle['Planned one']).toBe('planned')
		expect(byTitle['In progress one']).toBe('in_progress')
		expect(byTitle['Complete one']).toBe('completed')
		expect(byTitle['Closed one']).toBe('closed')
		expect(byTitle['Unknown status falls back to pending']).toBe('pending')
		expect(byTitle['No status falls back to pending']).toBe('pending')
	})

	it('rejects a payload over the 500-row limit', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		await createBoard(project.id)
		vi.mocked(getSession).mockResolvedValue(sessionFor('owner-1'))

		const items = Array.from({ length: 501 }, (_, i) => ({
			title: `Row ${i}`
		}))
		const res = await POST(importRequest(project.slug, items), {
			params: Promise.resolve({ slug: project.slug })
		})

		expect(res.status).toBe(400)
		const rows = await db.query.posts.findMany()
		expect(rows).toHaveLength(0)
	})

	it('accepts exactly 500 rows', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		await createBoard(project.id)
		vi.mocked(getSession).mockResolvedValue(sessionFor('owner-1'))

		const items = Array.from({ length: 500 }, (_, i) => ({
			title: `Row ${i}`
		}))
		const res = await POST(importRequest(project.slug, items), {
			params: Promise.resolve({ slug: project.slug })
		})

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ imported: 500 })
	})

	it('403s when a non-owner tries to import into someone else’s project', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		await createBoard(project.id)
		vi.mocked(getSession).mockResolvedValue(sessionFor('attacker-2'))

		const res = await POST(
			importRequest(project.slug, [{ title: 'Should not be imported' }]),
			{ params: Promise.resolve({ slug: project.slug }) }
		)

		expect(res.status).toBe(403)
		const rows = await db.query.posts.findMany()
		expect(rows).toHaveLength(0)
	})
})
