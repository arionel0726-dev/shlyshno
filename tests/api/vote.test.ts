import { POST } from '@/app/api/posts/vote/route'
import { votes } from '@/db/schema'
import { getSession } from '@/lib/session'
import { and, eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoard, createPost, createProject, db, resetDb } from '../db'

// getSession() вызывает next/headers через better-auth — вне реального
// Next.js request-контекста это падает, поэтому мокаем на уровне модуля
// (см. AGENTS.md / бриф: "next/headers мокать").
vi.mock('@/lib/session', () => ({ getSession: vi.fn() }))

async function setup() {
	const project = await createProject()
	const board = await createBoard(project.id)
	const post = await createPost(board.id)
	return { project, board, post }
}

function voteRequest(body: unknown) {
	return new Request('http://localhost:3000/api/posts/vote', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	})
}

beforeEach(async () => {
	await resetDb()
	vi.mocked(getSession).mockResolvedValue(null)
})

describe('POST /api/posts/vote', () => {
	it('toggles a guest vote: first call votes, second call un-votes', async () => {
		const { post } = await setup()
		const guestKey = 'guest-key-1234567890'

		const first = await POST(voteRequest({ postId: post.id, guestKey }))
		expect(first.status).toBe(200)
		expect(await first.json()).toEqual({ voted: true })

		let rows = await db.query.votes.findMany({
			where: eq(votes.postId, post.id)
		})
		expect(rows).toHaveLength(1)

		const second = await POST(voteRequest({ postId: post.id, guestKey }))
		expect(second.status).toBe(200)
		expect(await second.json()).toEqual({ voted: false })

		rows = await db.query.votes.findMany({ where: eq(votes.postId, post.id) })
		expect(rows).toHaveLength(0)
	})

	it('the unique index prevents a duplicate vote from the same guest on the same post', async () => {
		const { post } = await setup()
		const guestKey = 'guest-key-race-0000001'

		// Две "одновременные" попытки проголосовать одним guestKey за одну
		// карточку — обе видят "голоса ещё нет" и пытаются вставить строку;
		// unique index (vote_guest) + onConflictDoNothing должны оставить
		// ровно одну запись, а не две.
		await Promise.all([
			POST(voteRequest({ postId: post.id, guestKey })),
			POST(voteRequest({ postId: post.id, guestKey }))
		])

		const rows = await db.query.votes.findMany({
			where: and(eq(votes.postId, post.id), eq(votes.guestKey, guestKey))
		})
		expect(rows.length).toBeLessThanOrEqual(1)
	})

	it('rejects an anonymous request with neither a session nor a guestKey', async () => {
		const { post } = await setup()

		const res = await POST(voteRequest({ postId: post.id }))
		expect(res.status).toBe(401)
	})
})
