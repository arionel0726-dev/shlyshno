// src/components/copy-button.tsx
'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	async function copy() {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<button
			onClick={copy}
			className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-fg hover:bg-surface"
		>
			{copied ? (
				<Check className="h-4 w-4 text-emerald-500" />
			) : (
				<Copy className="h-4 w-4" />
			)}
			{copied ? 'Скопировано' : 'Copy link'}
		</button>
	)
}
