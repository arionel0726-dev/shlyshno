'use client'

import { useI18n } from '@/i18n/context'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeletePostButton({ postId }: { postId: string }) {
	const { t } = useI18n()
	const [confirming, setConfirming] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const router = useRouter()

	async function del() {
		setDeleting(true)
		await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
		router.refresh()
	}

	if (confirming) {
		return (
			<span className="flex items-center gap-2">
				<button
					onClick={del}
					disabled={deleting}
					className="flex min-h-11 items-center gap-1 text-xs font-medium text-red-600 hover:underline lg:min-h-0"
				>
					{deleting && <Loader2 className="h-3 w-3 animate-spin" />}
					{t('common.confirmDelete')}
				</button>
				<button
					onClick={() => setConfirming(false)}
					className="min-h-11 text-xs text-fg-muted hover:text-fg lg:min-h-0"
				>
					{t('common.cancel')}
				</button>
			</span>
		)
	}

	return (
		<button
			onClick={() => setConfirming(true)}
			title={t('common.delete')}
			className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-fg-faint hover:bg-surface hover:text-red-600 lg:min-h-0 lg:min-w-0 lg:p-1.5"
		>
			<Trash2 className="h-4 w-4" />
		</button>
	)
}
