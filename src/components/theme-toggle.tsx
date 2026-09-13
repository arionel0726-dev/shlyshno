'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const [dark, setDark] = useState(false)

	useEffect(() => {
		setDark(document.documentElement.classList.contains('dark'))
	}, [])

	function toggle() {
		const next = !dark
		setDark(next)
		document.documentElement.classList.toggle('dark', next)
		localStorage.setItem('slyshno-theme', next ? 'dark' : 'light')
	}

	return (
		<button
			onClick={toggle}
			className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-fg-secondary hover:bg-surface"
		>
			{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
			{dark ? 'Светлая' : 'Тёмная'}
		</button>
	)
}
