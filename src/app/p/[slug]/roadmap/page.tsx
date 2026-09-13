import { PortalHeader } from '@/components/portal-header'
import { boards, posts, projects, votes } from '@/db/schema'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'
import { db } from '@/lib/db'
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from '@/lib/seo'
import { and, eq, inArray, sql } from 'drizzle-orm'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) return {}

	return pageMetadata({
		title: `${project.name} roadmap · Slyshno`,
		description: `What's planned and what's shipping next for ${project.name}.`,
		path: `/p/${slug}/roadmap`
	})
}

const COLUMNS: { status: string; labelKey: DictionaryKey; dot: string }[] = [
	{ status: 'reviewing', labelKey: 'postStatus.reviewing', dot: 'bg-amber-500' },
	{ status: 'planned', labelKey: 'postStatus.planned', dot: 'bg-blue-500' },
	{
		status: 'in_progress',
		labelKey: 'postStatus.in_progress',
		dot: 'bg-violet-500'
	},
	{ status: 'completed', labelKey: 'postStatus.completed', dot: 'bg-emerald-500' }
]

export default async function Roadmap({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const { t } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project) notFound()

	const board = await db.query.boards.findFirst({
		where: and(eq(boards.projectId, project.id), eq(boards.isDefault, true))
	})

	const list = board
		? await db
				.select({
					id: posts.id,
					title: posts.title,
					status: posts.status,
					votesCount: sql<number>`count(${votes.id})::int`
				})
				.from(posts)
				.leftJoin(votes, eq(votes.postId, posts.id))
				.where(
					and(
						eq(posts.boardId, board.id),
						inArray(posts.status, [
							'reviewing',
							'planned',
							'in_progress',
							'completed'
						])
					)
				)
				.groupBy(posts.id)
		: []

	return (
		<div className="min-h-screen">
			<script
				type="application/ld+json"
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: jsonLdScript(
						breadcrumbJsonLd([
							{ name: project.name, path: `/p/${slug}` },
							{ name: 'Roadmap', path: `/p/${slug}/roadmap` }
						])
					)
				}}
			/>
			<PortalHeader
				slug={slug}
				projectName={project.name}
			/>
			<main className="mx-auto max-w-6xl px-6 py-10">
				<h1 className="text-2xl font-bold text-fg">{t('portal.tab.roadmap')}</h1>
				<p className="mt-1 text-sm text-fg-secondary">
					{t('portal.roadmap.subtitle')}
				</p>
				<div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 touch-pan-x sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
					{COLUMNS.map(col => {
						const items = list
							.filter(p => p.status === col.status)
							.sort((a, b) => b.votesCount - a.votesCount)
						return (
							<section
								className="min-w-[min(82vw,280px)] snap-start sm:min-w-0"
								key={col.status}
							>
								<div className="flex items-center gap-2">
									<span className={`h-2 w-2 rounded-full ${col.dot}`} />
									<h2 className="text-sm font-semibold text-fg">
										{t(col.labelKey)}
									</h2>
									<span className="text-sm text-fg-muted">{items.length}</span>
								</div>
								<ul className="mt-3 space-y-2">
									{items.map(p => (
										<li
											key={p.id}
											className="rounded-xl border border-border p-3"
										>
											<p className="text-sm font-medium text-fg">{p.title}</p>
											<p className="mt-1 text-xs text-fg-muted">
												▲ {p.votesCount}
											</p>
										</li>
									))}
									{items.length === 0 && (
										<li className="rounded-xl border border-dashed border-border p-3 text-sm text-fg-faint">
											{t('roadmap.empty')}
										</li>
									)}
								</ul>
							</section>
						)
					})}
				</div>
			</main>
		</div>
	)
}
