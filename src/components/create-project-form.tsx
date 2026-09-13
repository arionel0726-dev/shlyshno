// src/components/create-project-form.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CreateProjectForm() {
	const [name, setName] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError('')
		const res = await fetch('/api/projects', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		})
		if (!res.ok) {
			const data = await res.json()
			setError(data.error ?? 'Ошибка')
			setLoading(false)
			return
		}
		setName('')
		setLoading(false)
		router.refresh()
	}

	return (
		<form
			onSubmit={submit}
			className="flex gap-2"
		>
			<input
				value={name}
				onChange={e => setName(e.target.value)}
				placeholder="Название продукта, например «Мое приложение»"
				className="flex-1 rounded-lg border px-4 py-2"
			/>
			<button
				disabled={loading}
				className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
			>
				{loading ? 'Создаю…' : 'Создать'}
			</button>
			{error && <p className="w-full text-sm text-red-600">{error}</p>}
		</form>
	)
}
