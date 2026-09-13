import { PATCH as patchProject } from '@/app/api/projects/[slug]/route'
import { PATCH as patchPostStatus } from '@/app/api/posts/[id]/status/route'
import { projects } from '@/db/schema'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoard, createPost, createProject, db, resetDb } from '../db'

vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))

function sessionFor(userId: string) {
	return {
		user: { id: userId, name: 'Test', email: `${userId}@example.com` }
	} as Awaited<ReturnType<typeof getSession>>
}

beforeEach(async () => {
	await resetDb()
})

describe('PATCH /api/projects/[slug] — ownership', () => {
	it('403s when a different user tries to PATCH someone else’s project', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		vi.mocked(getSession).mockResolvedValue(sessionFor('attacker-2'))

		const res = await patchProject(
			new Request(`http://localhost:3000/api/projects/${project.slug}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: 'Hijacked name' })
			}),
			{ params: Promise.resolve({ slug: project.slug }) }
		)

		expect(res.status).toBe(403)
		const unchanged = await db.query.projects.findFirst({
			where: eq(projects.id, project.id)
		})
		expect(unchanged?.name).toBe(project.name)
	})

	it('lets the owner PATCH their own project', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		vi.mocked(getSession).mockResolvedValue(sessionFor('owner-1'))

		const res = await patchProject(
			new Request(`http://localhost:3000/api/projects/${project.slug}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: 'Renamed' })
			}),
			{ params: Promise.resolve({ slug: project.slug }) }
		)

		expect(res.status).toBe(200)
		const updated = await db.query.projects.findFirst({
			where: eq(projects.id, project.id)
		})
		expect(updated?.name).toBe('Renamed')
	})

	it('401s an unauthenticated PATCH', async () => {
		const project = await createProject()
		vi.mocked(getSession).mockResolvedValue(null)

		const res = await patchProject(
			new Request(`http://localhost:3000/api/projects/${project.slug}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: 'x' })
			}),
			{ params: Promise.resolve({ slug: project.slug }) }
		)
		expect(res.status).toBe(401)
	})
})

describe('PATCH /api/posts/[id]/status — ownership', () => {
	it('403s when a different user tries to change a post’s status on someone else’s board', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		const board = await createBoard(project.id)
		const post = await createPost(board.id, { status: 'pending' })
		vi.mocked(getSession).mockResolvedValue(sessionFor('attacker-2'))

		const res = await patchPostStatus(
			new Request(`http://localhost:3000/api/posts/${post.id}/status`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ status: 'completed' })
			}),
			{ params: Promise.resolve({ id: post.id }) }
		)

		expect(res.status).toBe(403)
	})

	it('lets the project owner change the status of their own post', async () => {
		const project = await createProject({ ownerId: 'owner-1' })
		const board = await createBoard(project.id)
		const post = await createPost(board.id, { status: 'pending' })
		vi.mocked(getSession).mockResolvedValue(sessionFor('owner-1'))

		const res = await patchPostStatus(
			new Request(`http://localhost:3000/api/posts/${post.id}/status`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ status: 'completed' })
			}),
			{ params: Promise.resolve({ id: post.id }) }
		)

		expect(res.status).toBe(200)
		expect((await res.json()).status).toBe('completed')
	})
})
