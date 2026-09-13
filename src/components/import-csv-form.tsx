'use client'

import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { useState } from 'react'

type Row = {
	title?: string
	body?: string
	status?: string
}

export function ImportCsvForm({ slug }: { slug: string }) {
	const [rows, setRows] = useState<Row[]>([])
	const [error, setError] = useState('')
	const [importing, setImporting] = useState(false)
	const [done, setDone] = useState<number | null>(null)
	const router = useRouter()

	function onFile(file: File | undefined) {
		setError('')
		setRows([])
		setDone(null)
		if (!file) return

		Papa.parse<Record<string, string>>(file, {
			header: true,
			skipEmptyLines: true,
			complete: result => {
				const items = result.data
					.map(r => {
						const lower: Record<string, string> = {}
						for (const k of Object.keys(r)) lower[k.toLowerCase()] = r[k]
						return {
							title: lower['title'] ?? lower['post title'] ?? lower['name'],
							body:
								lower['details'] ??
								lower['description'] ??
								lower['body'] ??
								lower['post details'],
							status: lower['status']
						}
					})
					.filter(r => r.title?.trim())

				if (items.length === 0) {
					setError(
						'Не нашёл колонку с заголовком (title). Проверь файл экспорта Canny.'
					)
					return
				}
				setRows(items.slice(0, 500))
			}
		})
	}

	async function importRows() {
		setImporting(true)
		setError('')
		const r = await fetch(`/api/projects/${slug}/import`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: rows })
		})
		const data = await r.json().catch(() => ({}))
		setImporting(false)
		if (!r.ok) {
			setError(data.error ?? 'Ошибка импорта')
			return
		}
		setDone(data.imported)
		setRows([])
		router.refresh()
	}

	return (
		<div>
			<label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center hover:bg-surface">
				<Upload className="h-5 w-5 text-fg-muted" />
				<p className="mt-2 text-sm text-fg-secondary">
					Выберите CSV-файл экспорта из Canny
				</p>
				<p className="mt-0.5 text-xs text-fg-faint">
					До 500 строк · колонки: title, details, status
				</p>
				<input
					type="file"
					accept=".csv,text/csv"
					className="hidden"
					onChange={e => onFile(e.target.files?.[0])}
				/>
			</label>

			{rows.length > 0 && (
				<div className="mt-4">
					<p className="text-sm text-fg-secondary">
						Найдено записей:{' '}
						<span className="font-medium text-fg">{rows.length}</span>
						{rows.length === 500 && ' (лимит — обрезано)'}
					</p>
					<ul className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-border p-3 text-sm">
						{rows.slice(0, 10).map((r, i) => (
							<li
								key={i}
								className="truncate text-fg-secondary"
							>
								{r.title}
							</li>
						))}
						{rows.length > 10 && (
							<li className="text-fg-faint">… и ещё {rows.length - 10}</li>
						)}
					</ul>
					<button
						onClick={importRows}
						disabled={importing}
						className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-50"
					>
						{importing ? 'Импортирую…' : `Импортировать ${rows.length}`}
					</button>
				</div>
			)}

			{done !== null && (
				<p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
					Импортировано записей: {done}
				</p>
			)}
			{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
		</div>
	)
}
