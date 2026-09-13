'use client'

import { Reply, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Comment = {
	id: string
	body: string
	authorName: string | null
	createdAt: Date
}

function getGuestKey(): string {
	let key = localStorage.getItem('slyshno_guest')
	if (!key) {
		key = crypto.randomUUID()
		localStorage.setItem('slyshno_guest', key)
	}
	return key
}

function timeAgo(d: Date): string {
	const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
	if (s < 60) return 'только что'
	const m = Math.floor(s / 60)
	if (m < 60) return `${m} мин назад`
	const h = Math.floor(m / 60)
	if (h < 24) return `${h} ч назад`
	const days = Math.floor(h / 24)
	if (days < 7) return `${days} дн назад`
	return new Date(d).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	})
}

export function PublicPost({
	postId,
	votesCount,
	isLoggedIn,
	initialComments
}: {
	postId: string
	votesCount: number
	isLoggedIn: boolean
	initialComments: Comment[]
}) {
	const [votes, setVotes] = useState(votesCount)
	const [myVote, setMyVote] = useState(false)
	const [list, setList] = useState(initialComments)
	const [body, setBody] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(false)
	const router = useRouter()
	const composerRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		fetch('/api/posts/my-votes', {
			headers: { 'x-guest-key': getGuestKey() }
		})
			.then(r => (r.ok ? r.json() : { postIds: [] }))
			.then(d => setMyVote((d.postIds ?? []).includes(postId)))
			.catch(() => {})
	}, [postId])
	async function vote() {
		const was = myVote
		setMyVote(!was)
		setVotes(v => v + (was ? -1 : 1))
		const r = await fetch('/api/posts/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ postId, guestKey: getGuestKey() })
		})
		if (!r.ok) router.refresh()
	}

	function replyTo(authorName: string) {
		setBody(prev => (prev.startsWith('@') ? prev : `@${authorName} ${prev}`))
		composerRef.current?.focus()
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		setError('')
		const r = await fetch(`/api/posts/${postId}/comments`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				body,
				name: name || undefined,
				email: email || undefined
			})
		})
		setSaving(false)
		if (!r.ok) {
			setError((await r.json().catch(() => ({}))).error ?? 'Ошибка')
			return
		}
		const created = await r.json()
		if (!created) return
		setList(l => [created, ...l])
		setBody('')
	}

	return (
		<div>
			<button
				onClick={vote}
				className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm ${
					myVote
						? 'border-primary bg-primary text-primary-fg'
						: 'border-border text-fg-secondary hover:bg-surface'
				}`}
			>
				↑ {votes}
			</button>

			<h2 className="mt-10 text-sm font-semibold text-fg">
				Обсуждение · {list.length}
			</h2>

			{/* Композер */}
			<form
				onSubmit={submit}
				className="mt-4"
			>
				<div className="rounded-2xl border border-border focus-within:border-border-strong">
					<textarea
						ref={composerRef}
						value={body}
						onChange={e => setBody(e.target.value)}
						placeholder="Добавить комментарий…"
						rows={3}
						required
						className="w-full resize-none rounded-t-2xl bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint"
					/>
					<div className="flex items-center justify-between border-t border-border px-3 py-2">
						<div className="flex items-center gap-1 text-fg-faint"></div>
						<button
							disabled={saving || !body.trim()}
							className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-fg disabled:opacity-40"
							title="Отправить"
						>
							<Send className="h-4 w-4" />
						</button>
					</div>
				</div>

				{!isLoggedIn && (
					<div className="mt-2 flex gap-2">
						<input
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="Имя"
							className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
						/>
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Email (обязательно)"
							required
							className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
						/>
					</div>
				)}
				{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
			</form>

			{/* Тред */}
			<ul className="mt-8">
				{list.map((c, i) => (
					<li
						key={c.id}
						className="flex gap-3"
					>
						{/* Аватар + линия-коннектор */}
						<div className="flex flex-col items-center">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-medium text-fg">
								{c.authorName?.[0]?.toUpperCase() ?? '?'}
							</span>
							{i < list.length - 1 && (
								<span className="mt-1 w-px flex-1 bg-border" />
							)}
						</div>

						<div className="min-w-0 flex-1 pb-6">
							<p className="text-xs text-fg-muted">
								<span className="font-medium text-fg-secondary">
									{c.authorName ?? 'Гость'}
								</span>{' '}
								· {timeAgo(c.createdAt)}
							</p>
							<p className="mt-1 whitespace-pre-line text-sm text-fg">
								{c.body}
							</p>
							<button
								onClick={() => c.authorName && replyTo(c.authorName)}
								className="mt-1.5 flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg"
							>
								<Reply className="h-3 w-3" />
								Ответить
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
