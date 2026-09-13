'use client'

import { useI18n } from '@/i18n/context'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteProjectButton({ slug }: { slug: string }) {
	const { t } = useI18n()
	const [confirming, setConfirming] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const router = useRouter()

	async function del() {
		setDeleting(true)
		await fetch(`/api/projects/${slug}`, { method: 'DELETE' })
		router.push('/dashboard')
		router.refresh()
	}

	return (
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-fg">
					{t('settings.deleteProject.title')}
				</p>
				<p className="mt-0.5 text-sm text-fg-muted">
					{t('settings.deleteProject.description')}
				</p>
			</div>
			{confirming ? (
				<span className="flex shrink-0 items-center gap-2">
					<button
						onClick={del}
						disabled={deleting}
						className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
					>
						{deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
						{t('settings.deleteProject.confirm')}
					</button>
					<button
						onClick={() => setConfirming(false)}
						className="rounded-lg px-3 py-2 text-sm text-fg-secondary hover:bg-surface"
					>
						{t('common.cancel')}
					</button>
				</span>
			) : (
				<button
					onClick={() => setConfirming(true)}
					className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-red-600 hover:bg-surface"
				>
					<Trash2 className="h-4 w-4" />
					{t('settings.deleteProject.title')}
				</button>
			)}
		</div>
	)
}
