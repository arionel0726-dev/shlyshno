import { DeleteProjectButton } from '@/components/delete-project-button'
import { EditBrandForm } from '@/components/edit-brand-form'
import { projects } from '@/db/schema'
import { getT } from '@/i18n/server'
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
	const { t } = await getT()

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">{t('settings.nav.brand')}</h2>
			<p className="mt-1 text-sm text-fg-secondary">
				{t('settings.brand.subtitle')}
			</p>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.brand.sectionBrand')}
			</p>
			<div className="mt-3 rounded-2xl border border-border p-4 sm:p-6">
				<EditBrandForm
					slug={slug}
					initialName={project.name}
					initialWebsite={project.website}
				/>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.brand.sectionAppearance')}
			</p>
			<div className="mt-3 divide-y divide-border-soft rounded-2xl border border-border">
				<div className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
					<div>
						<p className="text-sm font-medium text-fg">
							{t('settings.brand.accentColor.title')}
						</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							{t('settings.brand.accentColor.description')}
						</p>
					</div>
					<span className="w-full rounded-lg border border-border px-3 py-1.5 text-center text-sm text-fg-muted sm:w-auto">
						{t('common.soon')}
					</span>
				</div>
				<div className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
					<div>
						<p className="text-sm font-medium text-fg">
							{t('settings.brand.theme.title')}
						</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							{t('settings.brand.theme.description')}
						</p>
					</div>
					<span className="w-full rounded-lg border border-border px-3 py-1.5 text-center text-sm text-fg-muted sm:w-auto">
						{t('settings.brand.theme.systemBadge')}
					</span>
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">
				{t('settings.brand.sectionPublicExperience')}
			</p>
			<div className="mt-3 divide-y divide-border-soft rounded-2xl border border-border">
				<div className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
					<div>
						<p className="text-sm font-medium text-fg">
							{t('settings.brand.language.title')}
						</p>
						<p className="mt-0.5 text-sm text-fg-muted">
							{t('settings.brand.language.description')}
						</p>
					</div>
					<span className="w-full rounded-lg border border-border px-3 py-1.5 text-center text-sm text-fg-muted sm:w-auto">
						{t('settings.brand.language.auto')}
					</span>
				</div>
				<div className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
					<p className="text-sm font-medium text-fg">
						{t('settings.brand.poweredBy')}
					</p>
					<span className="w-full rounded-lg border border-border px-3 py-1.5 text-center text-sm text-fg-muted sm:w-auto">
						{t('settings.brand.poweredBy.hiddenOnPro')}
					</span>
				</div>
			</div>
			<p className="mt-8 text-sm font-semibold text-fg">
				{t('common.dangerZone')}
			</p>
			<div className="mt-3 rounded-2xl border border-red-500/30 p-4 sm:p-6">
				<DeleteProjectButton slug={slug} />
			</div>
		</div>
	)
}
