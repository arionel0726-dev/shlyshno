// src/components/post-status-select.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const STATUSES = [
	{ value: 'pending', label: 'Новое' },
	{ value: 'reviewing', label: 'Рассматриваем' },
	{ value: 'planned', label: 'В плане' },
	{ value: 'in_progress', label: 'В работе' },
	{ value: 'completed', label: 'Сделано' },
	{ value: 'closed', label: 'Закрыто' }
]

export function PostStatusSelect({
	postId,
	status
}: {
	postId: string
	status: string
}) {
	const [value, setValue] = useState(status)
	const [saving, setSaving] = useState(false)
	const router = useRouter()

	async function change(e: React.ChangeEvent<HTMLSelectElement>) {
		const newStatus = e.target.value
		setValue(newStatus)
		setSaving(true)
		const r = await fetch(`/api/posts/${postId}/status`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus })
		})
		setSaving(false)
		if (r.ok && newStatus === 'completed') {
			// Письма ушли в outbox — можно сразу отправить
			fetch('/api/cron/outbox', {
				headers: { 'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET ?? '' }
			})
		}
		router.refresh()
	}

	return (
		<select
			value={value}
			onChange={change}
			disabled={saving}
			className="rounded-lg border px-2 py-1 text-sm disabled:opacity-50"
		>
			{STATUSES.map(s => (
				<option
					key={s.value}
					value={s.value}
				>
					{s.label}
				</option>
			))}
		</select>
	)
}
