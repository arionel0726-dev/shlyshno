'use client'

import { authClient } from '@/lib/auth-client'
import { useI18n } from '@/i18n/context'
import type { TranslateFn } from '@/i18n/translate'
import { Check, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const inputCls =
	'h-[52px] w-full rounded-[10px] border border-border bg-background px-4 text-base text-fg outline-none placeholder:text-fg-faint focus:border-border-strong sm:text-[15px]'

function GoogleIcon() {
	return (
		<svg
			className="h-5 w-5"
			viewBox="0 0 24 24"
		>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
			/>
		</svg>
	)
}

function Divider({ t }: { t: TranslateFn }) {
	return (
		<div className="my-6 flex items-center gap-4">
			<span className="h-px flex-1 bg-border" />
			<span className="text-sm text-fg-muted">{t('auth.divider.or')}</span>
			<span className="h-px flex-1 bg-border" />
		</div>
	)
}

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
	const { t } = useI18n()
	const isSignup = mode === 'signup'
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const checks = [
		{ label: t('auth.check.minLength'), ok: password.length >= 8 },
		{ label: t('auth.check.hasDigit'), ok: /\d/.test(password) },
		{ label: t('auth.check.hasSpecial'), ok: /[^A-Za-z0-9]/.test(password) }
	]

	function mapError(message?: string) {
		if (!message) return t('auth.error.generic')
		if (message.toLowerCase().includes('already'))
			return t('auth.error.alreadyRegistered')
		if (message.toLowerCase().includes('invalid'))
			return t('auth.error.invalidCredentials')
		return message
	}

	async function google() {
		setLoading(true)
		setError('')
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: isSignup ? '/new' : '/dashboard'
		})
		setLoading(false)
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		if (isSignup && !checks.every(c => c.ok)) {
			setError(t('auth.error.weakPassword'))
			return
		}
		setLoading(true)
		const res = isSignup
			? await authClient.signUp.email({
					name,
					email,
					password,
					callbackURL: '/new'
				})
			: await authClient.signIn.email({
					email,
					password,
					callbackURL: '/dashboard'
				})
		setLoading(false)
		if (res.error) {
			setError(mapError(res.error.message))
			return
		}
		router.push(isSignup ? '/new' : '/dashboard')
		router.refresh()
	}

	return (
		<div className="w-full max-w-[420px]">
			<h1 className="text-center text-3xl font-bold tracking-tight text-fg">
				{isSignup ? t('auth.signup.title') : t('auth.signin.title')}
			</h1>
			<p className="mt-2 text-center text-fg-secondary">
				{isSignup ? t('auth.signup.subtitle') : t('auth.signin.subtitle')}
			</p>

			<button
				onClick={google}
				disabled={loading}
				className="mt-8 flex h-[52px] w-full items-center justify-center gap-3 rounded-[10px] border border-border text-[15px] font-medium text-fg hover:bg-surface disabled:opacity-50"
			>
				<GoogleIcon />
				{t('auth.continueWithGoogle')}
			</button>

			<Divider t={t} />

			<form
				onSubmit={submit}
				className="flex flex-col gap-4"
			>
				{isSignup && (
					<div>
						<label className="mb-1.5 block text-sm font-medium text-fg">
							{t('auth.field.name')}
						</label>
						<input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder={t('auth.field.namePlaceholder')}
							required
							className={inputCls}
						/>
					</div>
				)}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-fg">
						{t('auth.field.email')}
					</label>
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="you@company.com"
						required
						className={inputCls}
					/>
				</div>
				<div>
					<div className="mb-1.5 flex items-center justify-between">
						<label className="text-sm font-medium text-fg">
							{t('auth.field.password')}
						</label>
						{!isSignup && (
							<span
								title={t('auth.forgotPasswordSoon')}
								className="cursor-default text-sm text-fg-muted underline"
							>
								{t('auth.forgotPassword')}
							</span>
						)}
					</div>
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							minLength={8}
							className={`${inputCls} pr-12`}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute top-1/2 right-4 -translate-y-1/2 text-fg-muted hover:text-fg"
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
					{isSignup && password.length > 0 && (
						<ul className="mt-3 space-y-1.5">
							{checks.map(c => (
								<li
									key={c.label}
									className={`flex items-center gap-2 text-sm ${
										c.ok ? 'text-emerald-600' : 'text-fg-muted'
									}`}
								>
									<Check className="h-3.5 w-3.5" />
									{c.label}
								</li>
							))}
						</ul>
					)}
				</div>

				<button
					disabled={loading}
					className="mt-2 h-[52px] rounded-[10px] bg-primary text-[15px] font-medium text-primary-fg hover:opacity-90 disabled:opacity-50"
				>
					{loading
						? t('auth.submit.wait')
						: isSignup
							? t('auth.submit.signup')
							: t('auth.submit.signin')}
				</button>

				{error && <p className="text-center text-sm text-red-600">{error}</p>}
			</form>

			<p className="mt-6 text-center text-sm text-fg-secondary">
				{isSignup ? t('auth.footer.haveAccount') : t('auth.footer.noAccount')}{' '}
				<Link
					href={isSignup ? '/login' : '/register'}
					className="font-medium text-fg underline"
				>
					{isSignup ? t('auth.submit.signin') : t('auth.submit.signup')}
				</Link>
			</p>
		</div>
	)
}
