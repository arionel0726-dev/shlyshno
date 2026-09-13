'use client'

import { useState } from 'react'

export type Comment = {
	id: string
	body: string
	authorEmail: string | null
	authorName: string | null
	createdAt: Date
}

export function PostComments({
	postId,
	initial
}: {
	postId: string
	initial: Comment[]
}) {
	const [list, setList] = useState<Comment[]>(initial)
	const [body, setBody] = useState('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch(`/api/posts/${postId}/comments`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ body })
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? 'Ошибка')
			return
		}
		const created = await r.json()
		setList([created, ...list])
		setBody('')
	}

	return (
		<div>
			<form
				onSubmit={submit}
				className="flex flex-col gap-2"
			>
				<textarea
					value={body}
					onChange={e => setBody(e.target.value)}
					placeholder="Добавить комментарий..."
					rows={3}
					required
					className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
				/>
				<div className="flex items-center gap-3">
					<button
						disabled={saving}
						className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-50"
					>
						{saving ? 'Отправляю…' : 'Комментировать'}
					</button>
					{error && <p className="text-sm text-red-600">{error}</p>}
				</div>
			</form>

			<ul className="mt-6 space-y-4">
				{list.map(c => (
					<li
						key={c.id}
						className="rounded-xl border border-border p-4"
					>
						<div className="flex items-center gap-2 text-xs text-fg-muted">
							<span className="font-medium text-fg-secondary">
								{c.authorName ?? c.authorEmail ?? 'Аноним'}
							</span>
							<span>·</span>
							<span>{new Date(c.createdAt).toLocaleDateString('ru-RU')}</span>
						</div>
						<p className="mt-1.5 text-sm text-fg">{c.body}</p>
					</li>
				))}
				{list.length === 0 && (
					<p className="text-sm text-fg-muted">
						Пока нет комментариев — будьте первым.
					</p>
				)}
			</ul>
		</div>
	)
}
