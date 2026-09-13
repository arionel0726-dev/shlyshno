import { AppShell } from '@/components/app-shell'
import { projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { and, desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

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

	const isPro = userSubs.some(
		s =>
			['active', 'past_due', 'on_trial'].includes(s.status) ||
			(s.status === 'cancelled' && s.endsAt && s.endsAt > now)
	)

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
