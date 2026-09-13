// src/components/landing-auth.tsx
'use client'
import { signIn } from '@/lib/auth-client'
import { useI18n } from '@/i18n/context'

export function LandingAuth({
	mode,
	label
}: {
	mode: 'header' | 'hero' | 'pricing' | 'cta'
	label?: string
}) {
	const { t } = useI18n()
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
			{label ?? t('auth.submit.signin')}
		</button>
	)
}
