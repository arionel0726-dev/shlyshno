import { docsSource } from '@/lib/docs-source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider'
import 'fumadocs-ui/style.css'

export default function DocsLayoutWrapper({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<RootProvider>
			<DocsLayout
				tree={docsSource.pageTree}
				nav={{
					title: 'Slyshno',
					url: '/'
				}}
			>
				{children}
			</DocsLayout>
		</RootProvider>
	)
}
