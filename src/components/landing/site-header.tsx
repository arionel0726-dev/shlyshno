import { getT } from '@/i18n/server'
import { getSession } from '@/lib/session'
import Link from 'next/link'

export async function SiteHeader() {
	const session = await getSession()
	const { t } = await getT()

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
				<Link
					href="/"
					className="text-lg font-bold text-fg"
				>
					Slyshno
				</Link>

				<nav className="hidden items-center gap-6 text-sm text-fg-secondary md:flex">
					<Link
						href="/#features"
						className="hover:text-fg"
					>
						{t('landing.nav.features')}
					</Link>
					<Link
						href="/docs"
						className="hover:text-fg"
					>
						{t('landing.nav.docs')}
					</Link>
					<Link
						href="/pricing"
						className="hover:text-fg"
					>
						{t('landing.nav.pricing')}
					</Link>
				</nav>

				<div className="ml-auto flex items-center gap-3">
					{session ? (
						<Link
							href="/dashboard"
							className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-fg"
						>
							{t('appShell.menu.dashboard')}
						</Link>
					) : (
						<>
							<Link
								href="/login"
								className="rounded-full border border-border px-6 py-2 text-sm font-medium text-fg hover:bg-surface hover:text-fg"
							>
								{t('auth.submit.signin')}
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	)
}
