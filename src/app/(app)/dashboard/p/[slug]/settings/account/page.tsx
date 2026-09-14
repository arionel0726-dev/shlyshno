import { AccountForm } from '@/components/account-form'
import { CancelSubscriptionButton } from '@/components/cancel-subscription-button'
import { account as accountTable, user } from '@/db/auth-schema'
import { projects, subscriptions } from '@/db/schema'
import type { Locale } from '@/i18n/config'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { getUsage, nextResetDate } from '@/lib/usage'
import { eq } from 'drizzle-orm'
import { CheckCircle2 } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
const DATE_LOCALE: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US' }

function formatDate(d: Date | null, locale: Locale): string | null {
	if (!d) return null
	return new Date(d).toLocaleDateString(DATE_LOCALE[locale], {
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
	const { t, locale } = await getT()

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
	const usage = await getUsage(project.id)
	const resetLabel = formatDate(nextResetDate(), locale)
	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">
				{t('settings.nav.accountSection')}
			</h2>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.nav.profile')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-4 sm:p-6">
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
				<div className="mt-4 flex flex-col items-start gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium text-fg">
							{t('auth.field.email')}
						</p>
						<p className="text-sm text-fg-secondary">{authUser?.email}</p>
					</div>
					{authUser?.emailVerified ? (
						<span className="flex items-center gap-1.5 text-sm text-emerald-600">
							<CheckCircle2 className="h-4 w-4" />
							{t('account.emailVerified')}
						</span>
					) : (
						<span className="text-sm text-fg-muted">
							{t('account.emailNotVerified')}
						</span>
					)}
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('account.signIn.title')}
			</p>
			<div className="mt-3 flex flex-col items-start gap-2 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
				<div>
					<p className="text-sm font-medium text-fg">
						{t('account.signIn.method')}
					</p>
					<p className="mt-0.5 text-sm text-fg-secondary">
						{t('account.signIn.via', {
							provider:
								authAccount?.providerId === 'google' ? 'Google' : 'email'
						})}
					</p>
				</div>
				<span className="w-full rounded-lg border border-border px-3 py-1.5 text-center text-sm text-fg-secondary sm:w-auto">
					{authAccount?.providerId === 'google' ? 'Google' : 'Email'}
				</span>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('account.subscription.title')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-4 sm:p-6">
				{subs.length === 0 ? (
					<div>
						<p className="text-sm font-medium text-fg">
							{t('account.subscription.none.title')}
						</p>
						<p className="mt-0.5 text-sm text-fg-secondary">
							{t('account.subscription.none.description')}
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

						const renews = formatDate(display.renewsAt, locale)
						const ends = formatDate(display.endsAt, locale)
						const activeCancelled =
							display.status === 'cancelled' &&
							display.endsAt &&
							display.endsAt > now

						return (
							<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-sm font-medium text-fg">Pro</p>
									{display.status === 'active' && renews && (
										<p className="mt-0.5 text-sm text-fg-secondary">
											{t('account.subscription.nextCharge', { date: renews })}
										</p>
									)}
									{activeCancelled && (
										<p className="mt-0.5 text-sm text-fg-secondary">
											{t('account.subscription.cancelledUntil', {
												date: ends ?? ''
											})}
										</p>
									)}
									{display.status === 'cancelled' && !activeCancelled && (
										<p className="mt-0.5 text-sm text-fg-secondary">
											{t('account.subscription.cancelled')}
										</p>
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
			<p className="mt-8 text-sm font-semibold text-fg">{t('usage.title')}</p>
			<div className="mt-3 flex items-center justify-between rounded-2xl border border-border p-6">
				<div>
					<p className="text-sm font-medium text-fg">{t('usage.votes')}</p>
					<p className="mt-0.5 text-sm text-fg-secondary">
						{usage.pro
							? t('usage.unlimited')
							: `${usage.used} / ${usage.limit}`}
					</p>
				</div>
				{!usage.pro && (
					<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-secondary">
						{t('usage.resets')} {resetLabel}
					</span>
				)}
			</div>
		</div>
	)
}
