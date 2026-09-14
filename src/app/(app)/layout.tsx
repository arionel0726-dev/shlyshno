import { AppShell } from '@/components/app-shell'
import { projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { isOwnerPro } from '@/lib/usage'
import { and, desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// Кабинет приватный — не индексируем ни одну вложенную страницу
// (dashboard, dashboard/p/[slug], settings/*).
export const metadata: Metadata = {
	robots: { index: false, follow: false }
}

export default async function AppLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	if (!session) redirect('/')

	const lastProject = await db.query.projects.findFirst({
		where: eq(projects.ownerId, session.user.id),
		orderBy: desc(projects.createdAt)
	})

	const proSub = await db.query.subscriptions.findFirst({
		where: and(
			eq(subscriptions.plan, 'pro'),
			eq(subscriptions.status, 'active')
		)
	})
	// точнее: подписка должна принадлежать проекту юзера
	const now = new Date()
	const userSubs = await db
		.select({
			status: subscriptions.status,
			endsAt: subscriptions.endsAt
		})
		.from(subscriptions)
		.leftJoin(projects, eq(subscriptions.projectId, projects.id))
		.where(eq(projects.ownerId, session.user.id))

	const isPro = await isOwnerPro(session.user.id)

	return (
		<AppShell
			user={{
				name: session.user.name,
				email: session.user.email,
				image: session.user.image ?? ''
			}}
			fallbackSlug={lastProject?.slug ?? null}
			isPro={isPro}
		>
			{children}
		</AppShell>
	)
}
