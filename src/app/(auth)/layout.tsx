import Link from 'next/link'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
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
				Продолжая, вы принимаете Условия использования и Политику
				конфиденциальности.
			</footer>
		</div>
	)
}
