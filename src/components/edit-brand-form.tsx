// src/components/edit-brand-form.tsx
'use client'

import { useI18n } from '@/i18n/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EditBrandForm({
	slug,
	initialName,
	initialWebsite
}: {
	slug: string
	initialName: string
	initialWebsite: string | null
}) {
	const { t } = useI18n()
	const [editing, setEditing] = useState(false)
	const [name, setName] = useState(initialName)
	const [website, setWebsite] = useState(initialWebsite ?? '')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const router = useRouter()

	async function save(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch(`/api/projects/${slug}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				website: website || null
			})
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? t('common.error.short'))
			return
		}
		setEditing(false)
		router.refresh()
	}

	if (!editing) {
		return (
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
				<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-lg font-semibold text-fg">
					{initialName.slice(0, 2).toUpperCase()}
				</span>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-fg">{initialName}</p>
					<p className="text-sm text-fg-muted">
						{t('settings.brand.editForm.description')}
					</p>
				</div>
				<button
					onClick={() => setEditing(true)}
					className="min-h-11 w-full rounded-lg border border-border px-4 py-2 text-sm text-fg hover:bg-surface sm:w-auto lg:min-h-0"
				>
					{t('settings.brand.editForm.editButton')}
				</button>
			</div>
		)
	}

	return (
		<form
			onSubmit={save}
			className="flex flex-col gap-3"
		>
			<div>
				<label className="text-xs text-fg-faint">
					{t('settings.brand.editForm.nameLabel')}
				</label>
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					required
					className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base text-fg outline-none focus:border-border-strong sm:text-sm"
				/>
			</div>
			<div>
				<label className="text-xs text-fg-faint">
					{t('onboarding.field.website')}
				</label>
				<input
					value={website}
					onChange={e => setWebsite(e.target.value)}
					placeholder="yourproduct.com"
					className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base text-fg outline-none placeholder:text-fg-faint focus:border-border-strong sm:text-sm"
				/>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<button
					disabled={saving}
					className="min-h-11 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-50 lg:min-h-0"
				>
					{saving ? t('common.saving') : t('common.save')}
				</button>
				<button
					type="button"
					onClick={() => setEditing(false)}
					className="min-h-11 rounded-full px-4 py-2 text-sm text-fg-secondary hover:bg-surface lg:min-h-0"
				>
					{t('common.cancel')}
				</button>
				{error && <p className="text-sm text-red-600">{error}</p>}
			</div>
		</form>
	)
}
