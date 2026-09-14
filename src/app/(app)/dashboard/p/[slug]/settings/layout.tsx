import { SettingsNav } from '@/components/settings-nav'
import { projects } from '@/db/schema'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function SettingsLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const session = await getSession()
	if (!session) redirect('/')
	const { t } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const base = `/dashboard/p/${slug}/settings`
	const sections = [
		{
			title: t('settings.nav.workspaceSection'),
			items: [
				{ href: `${base}/brand`, label: t('settings.nav.brand') },
				{ href: `${base}/domain`, label: t('settings.nav.domain') },
				{ href: `${base}/imports`, label: t('settings.nav.imports') }
			]
		},
		{
			title: t('settings.nav.accountSection'),
			items: [{ href: `${base}/account`, label: t('settings.nav.profile') }]
		}
	]

	return (
		<div className="flex min-w-0 flex-col gap-8 p-4 sm:p-8 lg:flex-row lg:gap-10">
			<aside className="min-w-0 lg:w-56 lg:shrink-0">
				<h1 className="px-2 text-lg font-semibold text-fg">
					{t('settings.title')}
				</h1>
				<div className="flex gap-6 overflow-x-auto pb-1 lg:block lg:overflow-visible lg:pb-0">
					{sections.map(s => (
						<div
							key={s.title}
							className="mt-5 shrink-0"
						>
							<p className="px-2 text-xs text-fg-faint">{s.title}</p>
							<SettingsNav items={s.items} />
						</div>
					))}
				</div>
			</aside>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	)
}
