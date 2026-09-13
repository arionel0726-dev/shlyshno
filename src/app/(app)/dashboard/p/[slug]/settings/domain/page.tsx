import { CopyButton } from '@/components/copy-button'
import { projects } from '@/db/schema'
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

	const project = await db.query.projects.findFirst({
		where: eq(projects.slug, slug)
	})
	if (!project || project.ownerId !== session.user.id) notFound()

	const boardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`

	return (
		<div>
			<h2 className="text-2xl font-bold text-fg">Domain</h2>
			<p className="mt-1 text-sm text-fg-secondary">
				Используйте адрес Slyshno сейчас, подключите свой домен, когда будете
				готовы.
			</p>

			<p className="mt-8 text-sm font-semibold text-fg">Public board URL</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				<div className="flex items-center justify-between gap-4">
					<p className="truncate font-mono text-sm text-fg">{boardUrl}</p>
					<CopyButton text={boardUrl} />
				</div>
				<div className="mt-4 border-t border-border pt-4">
					<p className="text-sm text-fg-muted">
						Ваша публичная доска доступна по этому адресу.
					</p>
				</div>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Виджет для сайта</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				<div className="flex items-start justify-between gap-4">
					<pre className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-xs text-fg">{`<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-slyshno-key="${project.publicKey}" async></script>`}</pre>
					<CopyButton
						text={`<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-slyshno-key="${project.publicKey}" async></script>`}
					/>
				</div>
				<p className="mt-4 border-t border-border pt-4 text-sm text-fg-muted">
					Вставьте перед закрывающим тегом body — виджет появится на сайте.
				</p>
			</div>

			<p className="mt-8 text-sm font-semibold text-fg">Custom domain</p>
			<div className="mt-3 rounded-2xl border border-border p-6">
				{project.plan === 'pro' ? (
					<div>
						<p className="font-mono text-sm text-fg">feedback.yourdomain.com</p>
						<p className="mt-1 text-sm text-fg-muted">
							Подключение доменов появится в ближайшем обновлении — ваш тариф
							Pro уже активен.
						</p>
					</div>
				) : (
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="font-mono text-sm text-fg-faint">
								feedback.yourdomain.com
							</p>
							<p className="mt-1 text-sm text-fg-muted">
								Подключите свой домен для полностью фирменного опыта.
							</p>
						</div>
						<button
							disabled
							className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-fg opacity-50"
						>
							Connect domain
						</button>
					</div>
				)}
				{project.plan !== 'pro' && (
					<div className="mt-4 rounded-xl bg-surface px-4 py-3">
						<p className="text-sm text-fg-secondary">
							Available on Pro · $10/month
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
