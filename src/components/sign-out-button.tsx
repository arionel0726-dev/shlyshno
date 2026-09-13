'use client'

import { authClient } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
	const router = useRouter()

	async function onSignOut() {
		try {
			await authClient.signOut()
		} catch {
			// даже если сервер не ответил — сессию у клиента гасим принудительно
		} finally {
			router.push('/')
			router.refresh()
		}
	}

	return (
		<button
			onClick={onSignOut}
			className="flex w-full items-center gap-3 border-t border-border px-4 py-2.5 text-sm text-fg-secondary hover:bg-surface"
		>
			<LogOut className="h-4 w-4" /> Выйти
		</button>
	)
}
