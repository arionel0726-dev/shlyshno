import { getSession } from '@/lib/session'
import Link from 'next/link'

export async function SiteHeader() {
	const session = await getSession()

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
						Возможности
					</Link>
					<Link
						href="/docs"
						className="hover:text-fg"
					>
						Доки
					</Link>
					<Link
						href="/pricing"
						className="hover:text-fg"
					>
						Цены
					</Link>
				</nav>

				<div className="ml-auto flex items-center gap-3">
					{session ? (
						<Link
							href="/dashboard"
							className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-fg"
						>
							Дашборд
						</Link>
					) : (
						<>
							<Link
								href="/login"
								className="rounded-lg px-4 py-2 text-sm text-fg-secondary hover:text-fg"
							>
								Войти
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	)
}
