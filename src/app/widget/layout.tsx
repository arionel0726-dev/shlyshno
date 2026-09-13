import type { Metadata } from 'next'

// widget/page.tsx — клиентский компонент, export const metadata там
// невозможен, поэтому noindex вынесен в этот server-компонент layout.
export const metadata: Metadata = {
	title: 'Slyshno widget',
	robots: { index: false, follow: false }
}

export default function WidgetLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
