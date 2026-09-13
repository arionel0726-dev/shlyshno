// src/components/changelog-form.tsx
'use client'
import { useI18n } from '@/i18n/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ChangelogForm({ slug }: { slug: string }) {
	const { t } = useI18n()
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		const r = await fetch(`/api/p/${slug}/changelog`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, body })
		})
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? t('common.error.short'))
			return
		}
		setTitle('')
		setBody('')
		router.refresh()
	}

	return (
		<form
			onSubmit={submit}
			className="flex flex-col gap-2"
		>
			<input
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder={t('changelog.form.titlePlaceholder')}
				required
				className="rounded-lg border px-4 py-2"
			/>
			<textarea
				value={body}
				onChange={e => setBody(e.target.value)}
				placeholder={t('changelog.form.bodyPlaceholder')}
				required
				rows={3}
				className="rounded-lg border px-4 py-2"
			/>
			<button className="rounded-lg bg-black px-4 py-2 text-white">
				{t('changelog.form.publish')}
			</button>
			{error && <p className="text-sm text-red-600">{error}</p>}
		</form>
	)
}
