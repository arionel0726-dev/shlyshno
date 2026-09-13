import { CopyButton } from '@/components/copy-button'
import { projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
	const session = await getSession()
	if (!session) redirect('/')

	const myProjects = await db.query.projects.findMany({
		where: eq(projects.ownerId, session.user.id),
		orderBy: desc(projects.createdAt)
	})

	return (
		<main className="mx-auto max-w-3xl p-8">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold text-fg">Мои проекты</h1>
				<Link
					href="/new"
					className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
				>
					+ Новое пространство
				</Link>
			</div>

			{myProjects.length === 0 ? (
				<p className="mt-8 text-sm text-fg-muted">
					Пока пусто. Создайте первое пространство — это займёт минуту.
				</p>
			) : (
				<ul className="mt-6 space-y-3">
					{myProjects.map(p => {
						const snippet = `<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-slyshno-key="${p.publicKey}" async></script>`
						return (
							<li
								key={p.id}
								className="rounded-2xl border border-border bg-background p-5"
							>
								<div className="flex items-center gap-4">
									<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-base font-semibold text-fg">
										{p.name[0]?.toUpperCase()}
									</span>
									<div className="min-w-0 flex-1">
										<Link
											href={`/dashboard/p/${p.slug}`}
											className="font-medium text-fg hover:underline"
										>
											{p.name}
										</Link>
										<p className="mt-0.5 truncate font-mono text-xs text-fg-muted">
											{process.env.NEXT_PUBLIC_APP_URL}/p/{p.slug}
										</p>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<Link
											href={`/p/${p.slug}`}
											className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-secondary hover:bg-surface"
										>
											Открыть
										</Link>
										<Link
											href={`/dashboard/p/${p.slug}`}
											className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"
										>
											Управление
										</Link>
									</div>
								</div>
								<details className="mt-4 border-t border-border pt-3">
									<summary className="cursor-pointer text-sm text-fg-muted hover:text-fg">
										Виджет для сайта
									</summary>
									<div className="mt-3 flex items-start justify-between gap-3">
										<pre className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-surface p-3 font-mono text-xs text-fg">
											{snippet}
										</pre>
										<CopyButton text={snippet} />
									</div>
								</details>
							</li>
						)
					})}
				</ul>
			)}
		</main>
	)
}
