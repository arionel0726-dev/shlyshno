// src/components/settings-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SettingsNav({
	items
}: {
	items: { href: string; label: string }[]
}) {
	const pathname = usePathname()
	return (
		<nav className="mt-1 flex gap-0.5 lg:flex-col">
			{items.map(i => {
				const active = pathname === i.href
				return (
					<Link
						key={i.href}
						href={i.href}
						className={`flex min-h-11 shrink-0 items-center rounded-lg px-3 py-1.5 text-sm lg:min-h-0 ${
							active
								? 'bg-surface font-medium text-fg'
								: 'text-fg-secondary hover:bg-surface hover:text-fg'
						}`}
					>
						{i.label}
					</Link>
				)
			})}
		</nav>
	)
}
