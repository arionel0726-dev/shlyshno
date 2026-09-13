import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'

function Frame({ children }: { children: React.ReactNode }) {
	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
			<div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="mx-auto rounded-md bg-surface px-3 py-0.5 text-xs text-fg-muted">
					app.slyshno.com
				</span>
			</div>
			{children}
		</div>
	)
}

export async function AppMock() {
	const { t } = await getT()

	const ROWS: { titleKey: DictionaryKey; votes: number; statusKey: DictionaryKey; dot: string }[] = [
		{
			titleKey: 'landing.mock.row1.title',
			votes: 42,
			statusKey: 'postStatus.reviewing',
			dot: 'bg-amber-500'
		},
		{
			titleKey: 'landing.mock.row2.title',
			votes: 28,
			statusKey: 'postStatus.planned',
			dot: 'bg-blue-500'
		},
		{
			titleKey: 'landing.mock.row3.title',
			votes: 16,
			statusKey: 'postStatus.in_progress',
			dot: 'bg-violet-500'
		},
		{
			titleKey: 'landing.mock.row4.title',
			votes: 11,
			statusKey: 'postStatus.planned',
			dot: 'bg-blue-500'
		}
	]

	return (
		<Frame>
			<div className="flex">
				{/* Сайдбар */}
				<div className="hidden w-44 shrink-0 border-r border-border p-3 sm:block">
					<p className="px-2 py-1 text-sm font-semibold text-fg">Slyshno</p>
					<div className="mt-2 rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-fg">
						+ New request
					</div>
					<p className="mt-4 px-2 text-[10px] text-fg-faint">WORKSPACE</p>
					{['Feedback', 'Roadmap', 'Changelog', 'Public portal'].map(
						(item, i) => (
							<p
								key={item}
								className={`px-2 py-1.5 text-xs ${
									i === 0
										? 'rounded-md bg-surface font-medium text-fg'
										: 'text-fg-secondary'
								}`}
							>
								{item}
							</p>
						)
					)}
					<p className="mt-6 px-2 text-[10px] text-fg-faint">FREE PLAN</p>
				</div>
				{/* Список */}
				<div className="min-w-0 flex-1 p-4">
					<p className="text-sm font-bold text-fg">Feedback</p>
					<div className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs text-fg-faint">
						{t('landing.mock.searchPlaceholder')}
					</div>
					<div className="mt-3 space-y-1">
						{ROWS.map(r => (
							<div
								key={r.titleKey}
								className="flex items-center gap-2 rounded-lg px-2 py-1.5"
							>
								<span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
								<span className="min-w-0 flex-1 truncate text-xs text-fg">
									{t(r.titleKey)}
								</span>
								<span className="text-[10px] text-fg-muted">↑ {r.votes}</span>
							</div>
						))}
					</div>
				</div>
				{/* Детали */}
				<div className="hidden w-40 shrink-0 border-l border-border p-4 md:block">
					<p className="text-[10px] text-fg-faint">
						{t('landing.mock.detailsHeading')}
					</p>
					<p className="mt-3 text-xs font-medium text-fg">
						{t('landing.mock.row1.title')}
					</p>
					<p className="mt-2 text-[10px] text-fg-faint">
						{t('landing.mock.statusHeading')}
					</p>
					<p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-secondary">
						<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
						{t('postStatus.reviewing')}
					</p>
					<p className="mt-2 text-[10px] text-fg-faint">
						{t('landing.mock.votesHeading')}
					</p>
					<p className="text-xs text-fg-secondary">42</p>
				</div>
			</div>
		</Frame>
	)
}
