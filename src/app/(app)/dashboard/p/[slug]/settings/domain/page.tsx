import { CopyButton } from '@/components/copy-button'
import { projects, subscriptions } from '@/db/schema'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function DomainSettings({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const session = await getSession()
	if (!session) redirect('/')
	const { t } = await getT()

	const now = new Date()
	const subs = await db
		.select({ status: subscriptions.status, endsAt: subscriptions.endsAt })
		.from(subscriptions)
		.leftJoin(projects, eq(subscriptions.projectId, projects.id))
		.where(eq(projects.ownerId, session.user.id))
	const isPro = subs.some(
		s =>
			['active', 'past_due', 'on_trial'].includes(s.status) ||
			(s.status === 'cancelled' && s.endsAt && s.endsAt > now)
	)

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const boardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`

	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">{t('settings.nav.domain')}</h2>
			<p className="mt-1 text-sm text-fg-secondary">
				{t('settings.domain.subtitle')}
			</p>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.domain.publicBoardUrl')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				<div className="flex items-center justify-between gap-4">
					<p className="truncate font-mono text-sm text-fg">{boardUrl}</p>
					<CopyButton text={boardUrl} />
				</div>
				<div className="mt-4 border-t border-border pt-4">
					<p className="text-sm text-fg-muted">
						{t('settings.domain.publicBoardHint')}
					</p>
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('dashboard.widgetForSite')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				<div className="flex items-start justify-between gap-4">
					<pre className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs text-fg">{`<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-slyshno-key="${project.publicKey}" async></script>`}</pre>
					<CopyButton
						text={`<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-slyshno-key="${project.publicKey}" async></script>`}
					/>
				</div>
				<p className="mt-4 border-t border-border pt-4 text-sm text-fg-muted">
					{t('settings.domain.widgetHint')}
				</p>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.domain.customDomain')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				{isPro ? (
					<div>
						<div className="flex items-center gap-2">
							<p className="font-mono text-sm text-fg">
								feedback.yourdomain.com
							</p>
							<span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-fg-muted">
								{t('common.soon')}
							</span>
						</div>
						<p className="mt-1 text-sm text-fg-muted">
							{t('settings.domain.pro.description')}
						</p>
					</div>
				) : (
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="font-mono text-sm text-fg-faint">
								feedback.yourdomain.com
							</p>
							<p className="mt-1 text-sm text-fg-muted">
								{t('settings.domain.free.description')}
							</p>
						</div>
						<button
							disabled
							className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-fg opacity-50"
						>
							{t('settings.domain.connectButton')}
						</button>
					</div>
				)}
				{!isPro && (
					<div className="mt-4 rounded-xl bg-surface px-4 py-3">
						<p className="text-sm text-fg-secondary">
							{t('settings.domain.availableOnPro')}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
