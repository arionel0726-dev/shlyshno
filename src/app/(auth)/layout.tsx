import Link from 'next/link'
import { getT } from '@/i18n/server'

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const { t } = await getT()
	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="p-6">
				<Link
					href="/"
					className="text-lg font-bold text-fg"
				>
					Slyshno
				</Link>
			</header>
			<main className="flex flex-1 items-start justify-center px-6 pt-14">
				{children}
			</main>
			<footer className="p-6 text-center text-xs text-fg-muted">
				{t('auth.footer.legal')}
			</footer>
		</div>
	)
}
