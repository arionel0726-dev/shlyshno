import crypto from 'crypto'
import { boards, posts, projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export { db }

// Общая test-база (slyshno_test) — чистим все таблицы перед каждым тестом,
// чтобы тесты не зависели от порядка выполнения и не мешали друг другу.
export async function resetDb() {
	await db.execute(sql`
		TRUNCATE TABLE
			votes, comments, post_subscriptions, outbox, changelog_posts,
			subscriptions, posts, boards, projects,
			session, account, verification, "user"
		RESTART IDENTITY CASCADE
	`)
}

export async function closeTestDb() {
	await db.$client.end({ timeout: 1 })
}

export async function createProject(
	overrides: Partial<typeof projects.$inferInsert> = {}
) {
	const [project] = await db
		.insert(projects)
		.values({
			name: overrides.name ?? 'Test Project',
			slug: overrides.slug ?? `test-project-${crypto.randomUUID().slice(0, 8)}`,
			ownerId: overrides.ownerId ?? 'owner-1',
			publicKey: overrides.publicKey ?? crypto.randomBytes(16).toString('hex'),
			plan: overrides.plan ?? 'free',
			website: overrides.website
		})
		.returning()
	return project
}

export async function createBoard(
	projectId: string,
	overrides: Partial<typeof boards.$inferInsert> = {}
) {
	const [board] = await db
		.insert(boards)
		.values({
			projectId,
			name: overrides.name ?? 'Ideas',
			slug: overrides.slug ?? 'ideas',
			isDefault: overrides.isDefault ?? true
		})
		.returning()
	return board
}

export async function createPost(
	boardId: string,
	overrides: Partial<typeof posts.$inferInsert> = {}
) {
	const [post] = await db
		.insert(posts)
		.values({
			boardId,
			title: overrides.title ?? 'Test post',
			body: overrides.body,
			status: overrides.status ?? 'pending',
			type: overrides.type ?? 'feature',
			authorId: overrides.authorId,
			authorEmail: overrides.authorEmail
		})
		.returning()
	return post
}

export async function createSubscription(
	projectId: string,
	overrides: Partial<typeof subscriptions.$inferInsert> = {}
) {
	const [sub] = await db
		.insert(subscriptions)
		.values({
			projectId,
			provider: overrides.provider ?? 'lemonsqueezy',
			customerId: overrides.customerId ?? 'cust_1',
			subscriptionId: overrides.subscriptionId ?? `sub_${crypto.randomUUID()}`,
			plan: overrides.plan ?? 'pro',
			status: overrides.status ?? 'active',
			renewsAt: overrides.renewsAt,
			endsAt: overrides.endsAt
		})
		.returning()
	return sub
}
