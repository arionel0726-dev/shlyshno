import { DeleteProjectButton } from '@/components/delete-project-button'
import { EditBrandForm } from '@/components/edit-brand-form'
import { projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function BrandSettings({
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
			<h2 className="text-2xl font-bold text-fg">Brand & appearance</h2>
			<p className="mt-1 text-sm text-fg-secondary">
				Как ваше рабочее пространство выглядит для команды и клиентов.
			</p>

			<p className="mt-8 text-sm font-semibold text-fg">Brand</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				<EditBrandForm
					slug={slug}
					initialName={project.name}
					initialWebsite={project.website}
				/>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Appearance</p>
			<div className="mt-3 divide-y divide-border-soft rounded-2xl border border-border">
				<div className="flex items-center justify-between p-6">
					<div>
						<p className="text-sm font-medium text-fg">Accent color</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							Используется в статусах и публичных поверхностях.
						</p>
					</div>
					<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted">
						Скоро
					</span>
				</div>
				<div className="flex items-center justify-between p-6">
					<div>
						<p className="text-sm font-medium text-fg">Theme</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							По умолчанию — системная, посетители могут переключать.
						</p>
					</div>
					<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted">
						System
					</span>
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Public experience</p>
			<div className="mt-3 divide-y divide-border-soft rounded-2xl border border-border">
				<div className="flex items-center justify-between p-6">
					<div>
						<p className="text-sm font-medium text-fg">Language</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							Определяется из браузера посетителя.
						</p>
					</div>
					<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted">
						Auto
					</span>
				</div>
				<div className="flex items-center justify-between p-6">
					<p className="text-sm font-medium text-fg">Powered by Slyshno</p>
					<span className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted">
						Скрыто на Pro
					</span>
				</div>
			</div>
			<p className="mt-8 text-sm font-semibold text-fg">Опасная зона</p>
			<div className="mt-3 rounded-2xl border border-red-500/30 p-6">
				<DeleteProjectButton slug={slug} />
			</div>
		</div>
	)
}
