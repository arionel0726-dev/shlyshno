import { docsSource } from '@/lib/docs-source'
import { pageMetadata } from '@/lib/seo'
import { Card, Cards } from 'fumadocs-ui/components/card'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle
} from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Карточки для главной доков (хаб)
const HUB_CARDS = [
	{
		title: 'Начало работы',
		description: 'Что такое Slyshno и как устроен цикл фидбека',
		href: '/docs'
	},
	{
		title: 'Установка виджета',
		description: 'Виджет на ваш сайт за две минуты: HTML, Next.js, Tilda',
		href: '/docs/widget'
	},
	{
		title: 'Доска и статусы',
		description: 'Статусы, роадмап, чейнджлог и публичная страница',
		href: '/docs/board'
	},
	{
		title: 'Вопросы и ответы',
		description: 'Аккаунты, уведомления, лимиты и тёмная тема',
		href: '/docs/faq'
	}
]

export default async function DocsPageRoute({
	params
}: {
	params: Promise<{ slug?: string[] }>
}) {
	const { slug } = await params
	const page = docsSource.getPage(slug)

	// Главная доков — хаб с карточками
	if (!page) {
		if (slug && slug.length > 0) notFound()
		return (
			<DocsPage>
				<DocsTitle>Документация</DocsTitle>
				<DocsDescription>
					Гайды и справочник по Slyshno: от первого пространства до виджета на
					сайте.
				</DocsDescription>
				<DocsBody>
					<Cards>
						{HUB_CARDS.map(card => (
							<Card
								key={card.href}
								title={card.title}
								href={card.href}
								description={card.description}
							/>
						))}
					</Cards>
				</DocsBody>
			</DocsPage>
		)
	}

	const MDX = page.data.body

	return (
		<DocsPage toc={page.data.toc}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX components={defaultMdxComponents} />
			</DocsBody>
		</DocsPage>
	)
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
	const { slug } = await params
	const path = `/docs${slug && slug.length > 0 ? `/${slug.join('/')}` : ''}`
	const page = docsSource.getPage(slug)
	if (!page) {
		return pageMetadata({
			title: 'Документация — Slyshno',
			description:
				'Гайды и справочник по Slyshno: от первого пространства до виджета на сайте.',
			path
		})
	}
	return pageMetadata({
		title: `${page.data.title} — Документация Slyshno`,
		description: page.data.description ?? '',
		path
	})
}
