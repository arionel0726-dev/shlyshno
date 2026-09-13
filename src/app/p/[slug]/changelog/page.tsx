import { PortalHeader } from '@/components/portal-header'
import { user } from '@/db/auth-schema'
import { changelogPosts, projects } from '@/db/schema'
import type { Locale } from '@/i18n/config'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const DATE_LOCALE: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US' }

export default async function Changelog({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const { t, locale } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) notFound()

	const list = await db
		.select({
			id: changelogPosts.id,
			title: changelogPosts.title,
			body: changelogPosts.body,
			publishAt: changelogPosts.publishAt,
			authorName: user.name,
			authorImage: user.image
		})
		.from(changelogPosts)
		.leftJoin(projects, eq(changelogPosts.projectId, projects.id))
		.leftJoin(user, eq(projects.ownerId, user.id))
		.where(eq(changelogPosts.projectId, project.id))
		.orderBy(desc(changelogPosts.publishAt))

	return (
		<div className="min-h-screen">
			<PortalHeader
				slug={slug}
				projectName={project.name}
			/>
			<main className="mx-auto max-w-3xl px-6 py-10">
				<h1 className="text-2xl font-bold text-fg">
					{t('portal.tab.changelog')}
				</h1>
				<p className="mt-1 text-sm text-fg-secondary">
					{t('portal.changelog.subtitle', { name: project.name })}
				</p>

				<div className="mt-10">
					{list.map(e => (
						<Link
							key={e.id}
							href={`/p/${slug}/changelog/${e.id}`}
							className="group block border-l-2 border-border pl-6 pb-10"
						>
							<p className="text-xs text-fg-muted">
								{e.publishAt
									? new Date(e.publishAt).toLocaleDateString(
											DATE_LOCALE[locale],
											{
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											}
										)
									: ''}
							</p>
							<p className="mt-1.5 text-lg font-semibold text-fg group-hover:underline">
								{e.title}
							</p>
							<p className="mt-1.5 line-clamp-2 text-sm text-fg-secondary">
								{e.body}
							</p>
							<div className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
								{e.authorImage ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={e.authorImage}
										alt=""
										className="h-5 w-5 rounded-full"
									/>
								) : (
									<span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-medium text-fg">
										{e.authorName?.[0]?.toUpperCase() ?? '?'}
									</span>
								)}
								{e.authorName ?? t('portal.changelog.team')}
							</div>
						</Link>
					))}
					{list.length === 0 && (
						<p className="py-12 text-center text-sm text-fg-muted">
							{t('portal.changelog.empty')}
						</p>
					)}
				</div>
			</main>
		</div>
	)
}
