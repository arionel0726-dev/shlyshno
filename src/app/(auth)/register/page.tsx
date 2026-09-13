// register/page.tsx
import { AuthForm } from '@/components/auth/auth-form'
import { pageMetadata } from '@/lib/seo'
import { getSession } from '@/lib/session'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = pageMetadata({
	title: 'Create an account — Slyshno',
	description:
		'Create your Slyshno workspace and start collecting feedback in a couple of minutes. Free forever, no card required.',
	path: '/register'
})

export default async function RegisterPage() {
	const session = await getSession()
	if (session) redirect('/dashboard')
	return <AuthForm mode="signup" />
}
