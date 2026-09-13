// src/components/landing-auth.tsx
'use client'
import { signIn } from '@/lib/auth-client'

export function LandingAuth({
	mode,
	label
}: {
	mode: 'header' | 'hero' | 'pricing'
	label?: string
}) {
	const base =
		mode === 'hero'
			? 'landing-auth landing-auth-hero'
			: mode === 'header'
				? 'landing-auth landing-auth-header'
				: 'landing-auth landing-auth-pricing'

	return (
		<button
			onClick={() =>
				signIn.social({ provider: 'google', callbackURL: '/dashboard' })
			}
			className={base}
		>
			{label ?? 'Войти'}
		</button>
	)
}
