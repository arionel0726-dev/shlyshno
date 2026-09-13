import { ImportCsvForm } from '@/components/import-csv-form'
import { projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function ImportSettings({
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

	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">Импорт</h2>
			<p className="mt-1 text-sm text-fg-secondary">
				Перенесите фидбек из Canny или другого инструмента за пару минут.
			</p>
			<div className="mt-8 max-w-xl">
				<ImportCsvForm slug={slug} />
			</div>
		</div>
	)
}
