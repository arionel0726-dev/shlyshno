import { CreateWorkspaceForm } from '@/components/create-workspace-form'
import { getT } from '@/i18n/server'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function NewWorkspace() {
	const session = await getSession()
	if (!session) redirect('/')
	const { t } = await getT()

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden">
			{/* Brand color field — мягкие размытые пятна по дизайн-доку */}
			<div className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-violet-200 opacity-60 blur-3xl dark:bg-violet-900/40" />
			<div className="pointer-events-none absolute bottom-[-20%] left-[-5%] h-96 w-96 rounded-full bg-orange-200 opacity-50 blur-3xl dark:bg-orange-900/30" />

			<div className="relative w-full max-w-xl px-6">
				<div className="rounded-3xl border border-border bg-background p-10 shadow-sm">
					<h1 className="text-3xl font-bold text-fg">{t('onboarding.title')}</h1>
					<p className="mt-2 text-fg-secondary">{t('onboarding.subtitle')}</p>

					<div className="mt-8">
						<CreateWorkspaceForm />
					</div>

					<p className="mt-5 text-sm text-fg-muted">
						{t('onboarding.editLater')}
					</p>
				</div>
			</div>
		</div>
	)
}
