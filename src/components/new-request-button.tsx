'use client'

export function NewRequestButton() {
	return (
		<button
			onClick={() =>
				window.dispatchEvent(new CustomEvent('slyshno:new-request'))
			}
			className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
		>
			+ New request
		</button>
	)
}
