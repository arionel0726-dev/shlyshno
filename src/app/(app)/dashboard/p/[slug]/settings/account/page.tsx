import { AccountForm } from '@/components/account-form'
import { CancelSubscriptionButton } from '@/components/cancel-subscription-button'
import { account as accountTable, user } from '@/db/auth-schema'
import { projects, subscriptions } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { CheckCircle2 } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

function formatDate(d: Date | null): string | null {
	if (!d) return null
	return new Date(d).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
}

export default async function AccountSettings({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const session = await getSession()
	if (!session) redirect('/')

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const authUser = await db.query.user.findFirst({
		where: eq(user.id, session.user.id)
	})
	const authAccount = await db.query.account.findFirst({
		where: eq(accountTable.userId, session.user.id)
	})
	const subs = await db
		.select({
			id: subscriptions.id,
			subscriptionId: subscriptions.subscriptionId,
			status: subscriptions.status,
			renewsAt: subscriptions.renewsAt,
			endsAt: subscriptions.endsAt,
			projectName: projects.name
		})
		.from(subscriptions)
		.leftJoin(projects, eq(subscriptions.projectId, projects.id))
		.where(eq(projects.ownerId, session.user.id))

	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">Аккаунт</h2>

			<p className="mt-8 text-sm font-semibold text-fg">Профиль</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				{authUser?.image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={authUser.image}
						alt=""
						className="h-14 w-14 rounded-full"
					/>
				) : (
					<span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-lg font-medium text-fg">
						{authUser?.name?.[0]?.toUpperCase()}
					</span>
				)}
				<div className="mt-4">
					<AccountForm initialName={authUser?.name ?? ''} />
				</div>
				<div className="mt-4 flex items-center justify-between border-t border-border pt-4">
					<div>
						<p className="text-sm font-medium text-fg">Email</p>
						<p className="text-sm text-fg-secondary">{authUser?.email}</p>
					</div>
					{authUser?.emailVerified ? (
						<span className="flex items-center gap-1.5 text-sm text-emerald-600">
							<CheckCircle2 className="h-4 w-4" />
							Подтверждён
						</span>
					) : (
						<span className="text-sm text-fg-muted">Не подтверждён</span>
					)}
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Вход</p>
			<div className="mt-3 flex items-center justify-between rounded-2xl border border-border p-6">
				<div>
					<p className="text-sm font-medium text-fg">Способ входа</p>
					<p className="mt-0.5 text-sm text-fg-secondary">
						Вы вошли через{' '}
						{authAccount?.providerId === 'google' ? 'Google' : 'email'}.
					</p>
				</div>
				<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-secondary">
					{authAccount?.providerId === 'google' ? 'Google' : 'Email'}
				</span>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Подписка</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				{subs.length === 0 ? (
					<div>
						<p className="text-sm font-medium text-fg">Нет активных подписок</p>
						<p className="mt-0.5 text-sm text-fg-secondary">
							Тариф Free — для старта этого достаточно.
						</p>
					</div>
				) : (
					(() => {
						const now = new Date()
						// Одна подписка на аккаунт: активная → отменённая с остатком периода → последняя
						const display =
							subs.find(s => s.status === 'active') ??
							subs.find(
								s => s.status === 'cancelled' && s.endsAt && s.endsAt > now
							) ??
							subs[0]

						const renews = formatDate(display.renewsAt)
						const ends = formatDate(display.endsAt)
						const activeCancelled =
							display.status === 'cancelled' &&
							display.endsAt &&
							display.endsAt > now

						return (
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-fg">Pro</p>
									{display.status === 'active' && renews && (
										<p className="mt-0.5 text-sm text-fg-secondary">
											Следующее списание: {renews}
										</p>
									)}
									{activeCancelled && (
										<p className="mt-0.5 text-sm text-fg-secondary">
											Отменена — Pro действует до {ends}
										</p>
									)}
									{display.status === 'cancelled' && !activeCancelled && (
										<p className="mt-0.5 text-sm text-fg-secondary">Отменена</p>
									)}
								</div>
								{display.status === 'active' && display.subscriptionId && (
									<CancelSubscriptionButton
										subscriptionId={display.subscriptionId}
									/>
								)}
							</div>
						)
					})()
				)}
			</div>
		</div>
	)
}
