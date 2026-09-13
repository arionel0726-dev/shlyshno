import { SettingsNav } from '@/components/settings-nav'
import { projects } from '@/db/schema'
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

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const base = `/dashboard/p/${slug}/settings`
	const sections = [
		{
			title: 'Workspace',
			items: [
				{ href: `${base}/brand`, label: 'Brand & appearance' },
				{ href: `${base}/domain`, label: 'Domain' },
				{ href: `${base}/imports`, label: 'Импорт' }
			]
		},
		{
			title: 'Аккаунт',
			items: [{ href: `${base}/account`, label: 'Профиль' }]
		}
	]

	return (
		<div className="flex gap-10 p-8">
			<aside className="w-56 shrink-0">
				<h1 className="px-2 text-lg font-semibold text-fg">Settings</h1>
				{sections.map(s => (
					<div
						key={s.title}
						className="mt-5"
					>
						<p className="px-2 text-xs text-fg-faint">{s.title}</p>
						<SettingsNav items={s.items} />
					</div>
				))}
			</aside>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	)
}
