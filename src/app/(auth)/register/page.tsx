// register/page.tsx
import { AuthForm } from '@/components/auth/auth-form'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
	const session = await getSession()
	if (session) redirect('/dashboard')
	return <AuthForm mode="signup" />
}
