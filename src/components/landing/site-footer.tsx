const COLS = [
	{
		title: 'Продукт',
		links: ['Фидбек', 'Роадмап', 'Чейнджлог', 'Виджет', 'Цены']
	},
	{
		title: 'Ресурсы',
		links: ['Документация', 'API', 'Гайды', 'Статус']
	},
	{
		title: 'Компания',
		links: ['О нас', 'Блог', 'Контакты']
	}
]

export function SiteFooter() {
	return (
		<footer className="border-t border-border">
			<div className="mx-auto max-w-6xl px-6 py-14">
				<div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
					<div>
						<p className="text-lg font-bold text-fg">Slyshno</p>
						<p className="mt-2 max-w-xs text-sm text-fg-secondary">
							Фидбек, роадмап и обновления продукта — в одном цикле.
						</p>
					</div>
					{COLS.map(col => (
						<div key={col.title}>
							<p className="text-sm font-semibold text-fg">{col.title}</p>
							<ul className="mt-3 space-y-2">
								{col.links.map(l => (
									<li
										key={l}
										className="text-sm text-fg-secondary"
									>
										{l}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-fg-muted">
					<p>© 2026 Slyshno</p>
					<p>
						Сделано для команд, которым важен прогресс, а не просто сбор заявок.
					</p>
				</div>
			</div>
		</footer>
	)
}
