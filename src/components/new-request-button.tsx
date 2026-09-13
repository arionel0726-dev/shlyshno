'use client'

import { useI18n } from '@/i18n/context'

export function NewRequestButton() {
	const { t } = useI18n()
	return (
		<button
			onClick={() =>
				window.dispatchEvent(new CustomEvent('slyshno:new-request'))
			}
			className="min-h-11 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:opacity-90 lg:min-h-0"
		>
			{t('feedback.newRequestButton')}
		</button>
	)
}
