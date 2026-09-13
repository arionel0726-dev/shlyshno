'use client'

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
	const pathname = usePathname()

	const tabs = [
		{ href: `/p/${slug}`, label: 'Отзывы' },
		{ href: `/p/${slug}/roadmap`, label: 'Дорожная карта' },
		{ href: `/p/${slug}/changelog`, label: 'Обновления' }
	]

	return (
		<header className="border-b border-border">
			<div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-fg">
						{projectName[0]?.toUpperCase()}
					</span>
					<span className="font-semibold text-fg">{projectName}</span>
				</div>
				<nav className="ml-4 flex items-center gap-5 text-sm">
					{tabs.map(t => {
						const active = pathname === t.href
						return (
							<Link
								key={t.href}
								href={t.href}
								className={`pb-1 ${
									active
										? 'border-b-2 border-fg font-medium text-fg'
										: 'text-fg-secondary hover:text-fg'
								}`}
							>
								{t.label}
							</Link>
						)
					})}
				</nav>
			</div>
		</header>
	)
}
