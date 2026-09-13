'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeletePostButton({ postId }: { postId: string }) {
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
					className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
				>
					{deleting && <Loader2 className="h-3 w-3 animate-spin" />}
					Точно удалить?
				</button>
				<button
					onClick={() => setConfirming(false)}
					className="text-xs text-fg-muted hover:text-fg"
				>
					Отмена
				</button>
			</span>
		)
	}

	return (
		<button
			onClick={() => setConfirming(true)}
			title="Удалить"
			className="rounded-lg p-1.5 text-fg-faint hover:bg-surface hover:text-red-600"
		>
			<Trash2 className="h-4 w-4" />
		</button>
	)
}
