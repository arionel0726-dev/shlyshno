import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { getT } from '@/i18n/server'

export async function SiteFooter() {
	const { t } = await getT()

	const COLS: { titleKey: DictionaryKey; linkKeys: DictionaryKey[] }[] = [
		{
			titleKey: 'footer.col.product',
			linkKeys: [
				'footer.col.product.feedback',
				'footer.col.product.roadmap',
				'footer.col.product.changelog',
				'footer.col.product.widget',
				'footer.col.product.pricing'
			]
		},
		{
			titleKey: 'footer.col.resources',
			linkKeys: [
				'footer.col.resources.docs',
				'footer.col.resources.api',
				'footer.col.resources.guides',
				'footer.col.resources.status'
			]
		},
		{
			titleKey: 'footer.col.company',
			linkKeys: [
				'footer.col.company.about',
				'footer.col.company.blog',
				'footer.col.company.contacts'
			]
		}
	]

	return (
		<footer className="border-t border-border">
			<div className="mx-auto max-w-6xl px-6 py-14">
				<div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
					<div>
						<p className="text-lg font-bold text-fg">Slyshno</p>
						<p className="mt-2 max-w-xs text-sm text-fg-secondary">
							{t('footer.tagline')}
						</p>
					</div>
					{COLS.map(col => (
						<div key={col.titleKey}>
							<p className="text-sm font-semibold text-fg">{t(col.titleKey)}</p>
							<ul className="mt-3 space-y-2">
								{col.linkKeys.map(l => (
									<li
										key={l}
										className="text-sm text-fg-secondary"
									>
										{t(l)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-fg-muted">
					<p>© 2026 Slyshno</p>
					<p>{t('footer.bottomTagline')}</p>
				</div>
			</div>
		</footer>
	)
}
