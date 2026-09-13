const ROWS = [
	{
		title: 'Тёмная тема',
		votes: 42,
		status: 'Рассматриваем',
		dot: 'bg-amber-500'
	},
	{ title: 'Публичный API', votes: 28, status: 'В плане', dot: 'bg-blue-500' },
	{
		title: 'Уведомления в Telegram',
		votes: 16,
		status: 'В работе',
		dot: 'bg-violet-500'
	},
	{ title: 'Свой домен', votes: 11, status: 'В плане', dot: 'bg-blue-500' }
]

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

export function AppMock() {
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
						Поиск по фидбеку…
					</div>
					<div className="mt-3 space-y-1">
						{ROWS.map(r => (
							<div
								key={r.title}
								className="flex items-center gap-2 rounded-lg px-2 py-1.5"
							>
								<span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
								<span className="min-w-0 flex-1 truncate text-xs text-fg">
									{r.title}
								</span>
								<span className="text-[10px] text-fg-muted">↑ {r.votes}</span>
							</div>
						))}
					</div>
				</div>
				{/* Детали */}
				<div className="hidden w-40 shrink-0 border-l border-border p-4 md:block">
					<p className="text-[10px] text-fg-faint">ДЕТАЛИ</p>
					<p className="mt-3 text-xs font-medium text-fg">Тёмная тема</p>
					<p className="mt-2 text-[10px] text-fg-faint">СТАТУС</p>
					<p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-secondary">
						<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
						Рассматриваем
					</p>
					<p className="mt-2 text-[10px] text-fg-faint">ГОЛОСА</p>
					<p className="text-xs text-fg-secondary">42</p>
				</div>
			</div>
		</Frame>
	)
}
