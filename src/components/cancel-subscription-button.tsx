'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CancelSubscriptionButton({
	subscriptionId
}: {
	subscriptionId: string
}) {
	const [confirming, setConfirming] = useState(false)
	const [cancelling, setCancelling] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	async function cancel() {
		setCancelling(true)
		setError('')
		const r = await fetch('/api/billing/cancel', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ subscriptionId })
		})
		const data = await r.json().catch(() => ({}))
		setCancelling(false)
		setConfirming(false)
		if (!r.ok) {
			setError(data.error ?? 'Ошибка')
			return
		}
		router.refresh()
	}

	if (confirming) {
		return (
			<span className="flex items-center gap-2">
				<button
					onClick={cancel}
					disabled={cancelling}
					className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
				>
					{cancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
					Отменить подписку
				</button>
				<button
					onClick={() => setConfirming(false)}
					className="rounded-lg px-3 py-2 text-sm text-fg-secondary hover:bg-surface"
				>
					Назад
				</button>
			</span>
		)
	}

	return (
		<span className="flex items-center gap-3">
			<button
				onClick={() => setConfirming(true)}
				className="rounded-lg border border-border px-4 py-2 text-sm text-red-600 hover:bg-surface"
			>
				Отменить подписку
			</button>
			{error && <span className="text-sm text-red-600">{error}</span>}
		</span>
	)
}
