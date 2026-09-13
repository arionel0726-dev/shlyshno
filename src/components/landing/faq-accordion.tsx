'use client'

import { useI18n } from '@/i18n/context'
import type { DictionaryKey } from '@/i18n/dictionaries/ru'
import { useState } from 'react'

const ITEMS: { qKey: DictionaryKey; aKey: DictionaryKey }[] = [
	{ qKey: 'landing.faq.q1', aKey: 'landing.faq.a1' },
	{ qKey: 'landing.faq.q2', aKey: 'landing.faq.a2' },
	{ qKey: 'landing.faq.q3', aKey: 'landing.faq.a3' },
	{ qKey: 'landing.faq.q4', aKey: 'landing.faq.a4' },
	{ qKey: 'landing.faq.q5', aKey: 'landing.faq.a5' },
	{ qKey: 'landing.faq.q6', aKey: 'landing.faq.a6' }
]

export function FaqAccordion() {
	const { t } = useI18n()
	const [open, setOpen] = useState<number>(0)

	return (
		<div className="divide-y divide-border rounded-2xl border border-border">
			{ITEMS.map((item, i) => {
				const isOpen = open === i
				return (
					<div key={item.qKey}>
						<button
							onClick={() => setOpen(isOpen ? -1 : i)}
							className="flex w-full items-center justify-between px-6 py-5 text-left"
						>
							<span className="text-[15px] font-medium text-fg">
								{t(item.qKey)}
							</span>
							<span className="text-xl text-fg-muted">
								{isOpen ? '−' : '+'}
							</span>
						</button>
						{isOpen && (
							<p className="px-6 pb-5 text-sm leading-relaxed text-fg-secondary">
								{t(item.aKey)}
							</p>
						)}
					</div>
				)
			})}
		</div>
	)
}
