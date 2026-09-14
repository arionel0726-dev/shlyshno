import { POST } from '@/app/api/posts/vote/route'
import { usageCounters, votes } from '@/db/schema'
import { getSession } from '@/lib/session'
import { currentPeriod, FREE_VOTES_LIMIT } from '@/lib/usage'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createBoard,
	createPost,
	createProject,
	createSubscription,
	db,
	resetDb
} from '../db'

vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))

function voteRequest(body: unknown) {
	return new Request('http://localhost:3000/api/posts/vote', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	})
}

async function setup() {
	const project = await createProject()
	const board = await createBoard(project.id)
	const post = await createPost(board.id)
	return { project, board, post }
}

async function seedCounter(projectId: string, votesCount: number) {
	await db.insert(usageCounters).values({
		projectId,
		period: currentPeriod(),
		votesCount
	})
}

async function counterValue(projectId: string) {
	const [row] = await db
		.select({ votesCount: usageCounters.votesCount })
		.from(usageCounters)
		.where(eq(usageCounters.projectId, projectId))
	return row?.votesCount ?? 0
}

beforeEach(async () => {
	await resetDb()
	vi.mocked(getSession).mockResolvedValue(null)
})

describe('POST /api/posts/vote — usage limits', () => {
	it('increments the counter on vote and decrements on un-vote', async () => {
		const { project, post } = await setup()
		const guestKey = 'guest-limit-00000001'

		const first = await POST(voteRequest({ postId: post.id, guestKey }))
		expect(first.status).toBe(200)
		expect(await counterValue(project.id)).toBe(1)

		const second = await POST(voteRequest({ postId: post.id, guestKey }))
		expect(second.status).toBe(200)
		expect(await counterValue(project.id)).toBe(0)
	})

	it('rejects votes above the Free limit with error "limit"', async () => {
		const { project, post } = await setup()
		await seedCounter(project.id, FREE_VOTES_LIMIT)

		const res = await POST(
			voteRequest({ postId: post.id, guestKey: 'guest-limit-00000002' })
		)
		expect(res.status).toBe(403)
		expect(await res.json()).toEqual({ error: 'limit' })

		const rows = await db.query.votes.findMany({
			where: eq(votes.postId, post.id)
		})
		expect(rows).toHaveLength(0)
	})

	it('pro accounts are not limited', async () => {
		const { project, post } = await setup()
		await createSubscription(project.id, { status: 'active' })
		await seedCounter(project.id, FREE_VOTES_LIMIT)

		const res = await POST(
			voteRequest({ postId: post.id, guestKey: 'guest-limit-00000003' })
		)
		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ voted: true })
	})

	it('cancelled subscription with future endsAt still counts as Pro', async () => {
		const { project, post } = await setup()
		await createSubscription(project.id, {
			status: 'cancelled',
			endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
		})
		await seedCounter(project.id, FREE_VOTES_LIMIT)

		const res = await POST(
			voteRequest({ postId: post.id, guestKey: 'guest-limit-00000004' })
		)
		expect(res.status).toBe(200)
	})
})
