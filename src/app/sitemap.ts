import { docsSource } from '@/lib/docs-source'
import { db } from '@/lib/db'
import { SITE_URL } from '@/lib/seo'
import type { MetadataRoute } from 'next'

// Список проектов меняется по мере регистраций — не замораживаем на build,
// а обновляем раз в час (ISR).
export const revalidate = 3600

// Пропускаем: /dashboard (кабинет, приватный), /new (онбординг), /widget
// (виджет-панель, не отдельная страница для людей), /api, /login, /register
// (не контентные страницы — см. бриф SEO).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
		{ url: `${SITE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
		...docsSource.getPages().map(page => ({
			url: `${SITE_URL}${page.url}`,
			changeFrequency: 'monthly' as const,
			priority: 0.6
		}))
	]

	const allProjects = await db.query.projects.findMany({
		columns: { slug: true, createdAt: true }
	})

	const boardRoutes: MetadataRoute.Sitemap = allProjects.flatMap(project => [
		{
			url: `${SITE_URL}/p/${project.slug}`,
			lastModified: project.createdAt,
			changeFrequency: 'daily' as const,
			priority: 0.7
		},
		{
			url: `${SITE_URL}/p/${project.slug}/roadmap`,
			changeFrequency: 'daily' as const,
			priority: 0.5
		},
		{
			url: `${SITE_URL}/p/${project.slug}/changelog`,
			changeFrequency: 'weekly' as const,
			priority: 0.5
		}
	])

	return [...staticRoutes, ...boardRoutes]
}
