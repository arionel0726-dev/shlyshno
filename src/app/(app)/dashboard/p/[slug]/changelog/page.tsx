import { ChangelogForm } from '@/components/changelog-form'
import { changelogPosts, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { desc, eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function OwnerChangelog({
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

	const list = await db
		.select()
		.from(changelogPosts)
		.where(eq(changelogPosts.projectId, project.id))
		.orderBy(desc(changelogPosts.publishAt))

	return (
		<main className="mx-auto max-w-2xl p-8">
			<h1 className="text-2xl font-bold text-fg">Changelog</h1>
			<div className="mt-4">
				<ChangelogForm slug={slug} />
			</div>
			<ul className="mt-8 space-y-3">
				{list.map(e => (
					<li
						key={e.id}
						className="rounded-xl border border-border p-4"
					>
						<p className="font-medium text-fg">{e.title}</p>
						<p className="mt-1 text-sm text-fg-secondary">{e.body}</p>
					</li>
				))}
			</ul>
		</main>
	)
}
