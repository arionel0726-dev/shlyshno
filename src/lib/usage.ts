// src/lib/usage.ts — лимиты Free-тарифа (100 голосов/мес), Pro = безлимит.
// Импорты schema — ОТНОСИТЕЛЬНЫЕ (см. AGENTS.md).
import { and, eq, sql } from 'drizzle-orm'
import { projects, subscriptions, usageCounters } from '../db/schema'
import { db } from './db'

export const FREE_VOTES_LIMIT = 100

const PRO_STATUSES = new Set(['active', 'past_due', 'on_trial'])

export function currentPeriod(): string {
	return new Date().toISOString().slice(0, 7) // 'YYYY-MM'
}

// Pro на АККАУНТЕ: любая «живая» подписка на любой проект владельца,
// включая мягкую отмену (Pro держим до endsAt). НЕ по project.plan —
// он отстаёт при мягкой отмене (см. AGENTS.md грабля 23).
export async function isOwnerPro(ownerId: string): Promise<boolean> {
	const now = new Date()
	const subs = await db
		.select({
			status: subscriptions.status,
			endsAt: subscriptions.endsAt
		})
		.from(subscriptions)
		.leftJoin(projects, eq(subscriptions.projectId, projects.id))
		.where(eq(projects.ownerId, ownerId))

	return subs.some(
		s =>
			PRO_STATUSES.has(s.status) ||
			(s.status === 'cancelled' && s.endsAt && s.endsAt > now)
	)
}

export async function isProjectPro(projectId: string): Promise<boolean> {
	const [project] = await db
		.select({ ownerId: projects.ownerId })
		.from(projects)
		.where(eq(projects.id, projectId))
		.limit(1)
	if (!project) return false
	return isOwnerPro(project.ownerId)
}

// Атомарный инкремент: INSERT ... ON CONFLICT DO UPDATE ... WHERE votes_count
// < limit RETURNING. Параллельные запросы НЕ пробьют лимет (одна строка на
// проект/период, апдейт внутри строки сериализуется).
// true = голос засчитан, false = лимет достигнут.
export async function tryIncrementVotes(projectId: string): Promise<boolean> {
	const rows = await db.execute(sql`
		INSERT INTO usage_counters (id, project_id, period, votes_count)
		VALUES (gen_random_uuid(), ${projectId}, ${currentPeriod()}, 1)
		ON CONFLICT (project_id, period)
		DO UPDATE SET
			votes_count = usage_counters.votes_count + 1,
			updated_at = now()
		WHERE usage_counters.votes_count < ${FREE_VOTES_LIMIT}
		RETURNING votes_count
	`)
	return rows.length > 0
}

// Возвращаем слот при снятии голоса (не ниже нуля)
export async function decrementVotes(projectId: string) {
	await db.execute(sql`
		UPDATE usage_counters
		SET votes_count = GREATEST(votes_count - 1, 0), updated_at = now()
		WHERE project_id = ${projectId} AND period = ${currentPeriod()}
	`)
}

export async function getUsage(projectId: string) {
	const [project] = await db
		.select({ ownerId: projects.ownerId })
		.from(projects)
		.where(eq(projects.id, projectId))
		.limit(1)
	const pro = project ? await isOwnerPro(project.ownerId) : false

	const rows = await db
		.select({ votesCount: usageCounters.votesCount })
		.from(usageCounters)
		.where(
			and(
				eq(usageCounters.projectId, projectId),
				eq(usageCounters.period, currentPeriod())
			)
		)
		.limit(1)

	return { pro, used: rows[0]?.votesCount ?? 0, limit: FREE_VOTES_LIMIT }
}

// Первое число следующего месяца (UTC) — дата сброса счётчика
export function nextResetDate(): Date {
	const now = new Date()
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
}
