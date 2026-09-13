// login/page.tsx
import { AuthForm } from '@/components/auth/auth-form'
import { pageMetadata } from '@/lib/seo'
import { getSession } from '@/lib/session'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = pageMetadata({
	title: 'Sign in — Slyshno',
	description: 'Sign in to your Slyshno workspace.',
	path: '/login'
})

export default async function LoginPage() {
	const session = await getSession()
	if (session) redirect('/dashboard')
	return <AuthForm mode="signin" />
}
