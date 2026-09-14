'use client'

import { useI18n } from '@/i18n/context'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CancelSubscriptionButton({
	subscriptionId
}: {
	subscriptionId: string
}) {
	const { t } = useI18n()
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
			setError(data.error ?? t('common.error.short'))
			return
		}
		router.refresh()
	}

	if (confirming) {
		return (
			<span className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
				<button
					onClick={cancel}
					disabled={cancelling}
					className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50 sm:w-auto lg:min-h-0"
				>
					{cancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
					{t('account.subscription.cancelButton')}
				</button>
				<button
					onClick={() => setConfirming(false)}
					className="min-h-11 w-full rounded-lg px-3 py-2 text-sm text-fg-secondary hover:bg-surface sm:w-auto lg:min-h-0"
				>
					{t('common.back')}
				</button>
			</span>
		)
	}

	return (
		<span className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
			<button
				onClick={() => setConfirming(true)}
				className="min-h-11 w-full rounded-lg border border-border px-4 py-2 text-sm text-red-600 hover:bg-surface sm:w-auto lg:min-h-0"
			>
				{t('account.subscription.cancelButton')}
			</button>
			{error && <span className="text-sm text-red-600">{error}</span>}
		</span>
	)
}
