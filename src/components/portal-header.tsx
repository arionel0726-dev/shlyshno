'use client'

import { useI18n } from '@/i18n/context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PortalHeader({
	slug,
	projectName,
	search,
	onSearch
}: {
	slug: string
	projectName: string
	search?: string
	onSearch?: (value: string) => void
}) {
	const { t } = useI18n()
	const pathname = usePathname()

	const tabs = [
		{ href: `/p/${slug}`, label: t('portal.tab.feedback') },
		{ href: `/p/${slug}/roadmap`, label: t('portal.tab.roadmap') },
		{ href: `/p/${slug}/changelog`, label: t('portal.tab.changelog') }
	]

	return (
		<header className="overflow-hidden border-b border-border">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-4 sm:flex-nowrap">
				<div className="flex items-center gap-2.5">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-fg">
						{projectName[0]?.toUpperCase()}
					</span>
					<span className="font-semibold text-fg">{projectName}</span>
				</div>
				<nav className="flex w-full min-w-0 shrink overflow-x-auto overscroll-x-contain text-sm sm:ml-4 sm:w-auto">
					<div className="flex shrink-0 items-center gap-5">
						{tabs.map(tab => {
							const active = pathname === tab.href
							return (
								<Link
									key={tab.href}
									href={tab.href}
									className={`flex min-h-11 items-center pb-1 lg:min-h-0 ${
										active
											? 'border-b-2 border-fg font-medium text-fg'
											: 'text-fg-secondary hover:text-fg'
									}`}
								>
									{tab.label}
								</Link>
							)
						})}
					</div>
				</nav>
			</div>
		</header>
	)
}
