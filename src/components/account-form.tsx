'use client'

import { useI18n } from '@/i18n/context'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AccountForm({ initialName }: { initialName: string }) {
	const { t } = useI18n()
	const [name, setName] = useState(initialName)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const router = useRouter()

	async function save(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setSaved(false)
		await authClient.updateUser({ name })
		setSaving(false)
		setSaved(true)
		router.refresh()
		setTimeout(() => setSaved(false), 2000)
	}

	return (
		<form
			onSubmit={save}
			className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
		>
			<div className="flex-1">
				<label className="text-xs text-fg-faint">{t('auth.field.name')}</label>
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					required
					className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base text-fg outline-none focus:border-border-strong sm:text-sm"
				/>
			</div>
			<button
				disabled={saving}
				className="min-h-11 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg disabled:opacity-50 sm:w-auto lg:min-h-0"
			>
				{saving
					? t('common.saving')
					: saved
						? t('account.form.saved')
						: t('common.save')}
			</button>
		</form>
	)
}
