'use client'

import { useI18n } from '@/i18n/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Транслитерация для автослага
const CYR: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'e',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'c',
	ч: 'ch',
	ш: 'sh',
	щ: 'sch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya'
}

function slugify(name: string) {
	return name
		.toLowerCase()
		.split('')
		.map(ch => CYR[ch] ?? ch)
		.join('')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40)
}

export function CreateWorkspaceForm() {
	const { t } = useI18n()
	const [website, setWebsite] = useState('')
	const [name, setName] = useState('')
	const [slug, setSlug] = useState('')
	const [slugTouched, setSlugTouched] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	function onNameChange(value: string) {
		setName(value)
		if (!slugTouched) setSlug(slugify(value))
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError('')
		const r = await fetch('/api/projects', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				slug: slug || undefined,
				website: website || undefined
			})
		})
		const data = await r.json().catch(() => ({}))
		setLoading(false)
		if (!r.ok) {
			setError(data.error ?? t('common.error.short'))
			return
		}
		router.push(`/dashboard/p/${data.slug}`)
		router.refresh()
	}

	const inputCls =
		'w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-fg outline-none placeholder:text-fg-faint focus:border-border-strong sm:text-[15px]'

	return (
		<form
			onSubmit={submit}
			className="flex flex-col gap-5"
		>
			<div>
				<label className="text-sm font-medium text-fg">
					{t('onboarding.field.website')}
				</label>
				<input
					value={website}
					onChange={e => setWebsite(e.target.value)}
					placeholder="yourproduct.com"
					className={`mt-1.5 ${inputCls}`}
				/>
			</div>

			<div>
				<label className="text-sm font-medium text-fg">
					{t('onboarding.field.name')}
				</label>
				<input
					value={name}
					onChange={e => onNameChange(e.target.value)}
					placeholder={t('onboarding.field.namePlaceholder')}
					required
					className={`mt-1.5 ${inputCls}`}
				/>
			</div>

			<div>
				<label className="text-sm font-medium text-fg">
					{t('onboarding.field.slug')}
				</label>
				<div className="relative mt-1.5">
					<input
						value={slug}
						onChange={e => {
							setSlug(e.target.value)
							setSlugTouched(true)
						}}
						placeholder="my-product"
						required
						pattern="[a-z0-9-]+"
						className={`${inputCls} pr-36`}
					/>
					<span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[15px] text-fg-faint">
						.slyshno.com
					</span>
				</div>
			</div>

			<button
				disabled={loading}
				className="mt-1 h-12 rounded-xl bg-primary text-[15px] font-medium text-primary-fg hover:opacity-90 disabled:opacity-50"
			>
				{loading ? t('onboarding.submit.creating') : t('onboarding.submit.create')}
			</button>

			{error && <p className="text-sm text-red-600">{error}</p>}
		</form>
	)
}
