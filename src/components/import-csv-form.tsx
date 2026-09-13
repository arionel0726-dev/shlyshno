'use client'

import { useI18n } from '@/i18n/context'
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
	const { t } = useI18n()
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
					setError(t('import.noTitleColumn'))
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
			setError(data.error ?? t('import.error.default'))
			return
		}
		setDone(data.imported)
		setRows([])
		router.refresh()
	}

	return (
		<div>
			<label className="flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border p-4 text-center hover:bg-surface sm:p-8">
				<Upload className="h-5 w-5 text-fg-muted" />
				<p className="mt-2 text-sm text-fg-secondary">{t('import.pickFile')}</p>
				<p className="mt-0.5 text-xs text-fg-faint">{t('import.limitHint')}</p>
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
						{t('import.foundRecords')}{' '}
						<span className="font-medium text-fg">{rows.length}</span>
						{rows.length === 500 && ` ${t('import.truncatedHint')}`}
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
							<li className="text-fg-faint">
								{t('import.andMore', { count: rows.length - 10 })}
							</li>
						)}
					</ul>
					<button
						onClick={importRows}
						disabled={importing}
						className="mt-3 min-h-11 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-50 sm:w-auto lg:min-h-0"
					>
						{importing
							? t('import.submit.importing')
							: t('import.submit.import', { count: rows.length })}
					</button>
				</div>
			)}

			{done !== null && (
				<p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
					{t('import.success', { count: done })}
				</p>
			)}
			{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
		</div>
	)
}
