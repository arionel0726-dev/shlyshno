'use client'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EmailAuthForm() {
	const [mode, setMode] = useState<'signin' | 'signup'>('signin')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError('')

		const res =
			mode === 'signup'
				? await authClient.signUp.email({ name, email, password })
				: await authClient.signIn.email({ email, password })

		setLoading(false)

		if (res.error) {
			setError(
				res.error.message?.includes('already exists')
					? 'Такой email уже зарегистрирован — войдите'
					: (res.error.message ?? 'Ошибка')
			)
			return
		}
		router.refresh()
	}

	return (
		<form
			onSubmit={submit}
			className="mt-4 flex max-w-sm flex-col gap-2"
		>
			{mode === 'signup' && (
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="Имя"
					required
					className="rounded-lg border px-4 py-2"
				/>
			)}
			<input
				type="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				placeholder="Email"
				required
				className="rounded-lg border px-4 py-2"
			/>
			<input
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				placeholder="Пароль (минимум 8 символов)"
				required
				minLength={8}
				className="rounded-lg border px-4 py-2"
			/>
			<button
				disabled={loading}
				className="rounded-lg border border-black px-4 py-2 disabled:opacity-50"
			>
				{loading ? '…' : mode === 'signup' ? 'Зарегистрироваться' : 'Войти'}
			</button>
			<button
				type="button"
				onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
				className="text-sm underline"
			>
				{mode === 'signin'
					? 'Нет аккаунта? Регистрация'
					: 'Уже есть аккаунт? Войти'}
			</button>
			{error && <p className="text-sm text-red-600">{error}</p>}
		</form>
	)
}
