'use client'

import { useI18n } from '@/i18n/context'
import { Check, Link2, Share2 } from 'lucide-react'
import { useState } from 'react'

export function PortalActions() {
	const { t } = useI18n()
	const [copied, setCopied] = useState(false)

	async function copy() {
		await navigator.clipboard.writeText(window.location.href)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	async function share() {
		if (navigator.share) {
			await navigator.share({ title: document.title, url: location.href })
		} else {
			await copy()
		}
	}

	return (
		<div className="flex flex-col gap-0.5 text-sm">
			<button
				onClick={copy}
				className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-fg-secondary hover:bg-surface"
			>
				{copied ? (
					<Check className="h-4 w-4 text-emerald-500" />
				) : (
					<Link2 className="h-4 w-4" />
				)}
				{copied ? t('common.copied') : t('portal.sidebar.copyLink')}
			</button>
			<button
				onClick={share}
				className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-fg-secondary hover:bg-surface"
			>
				<Share2 className="h-4 w-4" />
				{t('portal.sidebar.share')}
			</button>
		</div>
	)
}
