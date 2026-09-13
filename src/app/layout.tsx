import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Script from 'next/script'
import { I18nProvider } from '@/i18n/context'
import { getDictionary } from '@/i18n/server'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://slyshno.app'
const SITE_DESCRIPTION =
	'Public feedback board, embeddable widget, roadmap, and changelog with automatic email updates — collect feedback, prioritize it, and close the loop with your users.'

// Метаданные по умолчанию для всего сайта; страницы переопределяют
// title/description/alternates своим export const metadata.
export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: 'Slyshno — Feedback boards, roadmap, and changelog',
		template: '%s · Slyshno'
	},
	description: SITE_DESCRIPTION,
	applicationName: 'Slyshno',
	robots: { index: true, follow: true },
	openGraph: {
		type: 'website',
		siteName: 'Slyshno',
		title: 'Slyshno — Feedback boards, roadmap, and changelog',
		description: SITE_DESCRIPTION
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Slyshno — Feedback boards, roadmap, and changelog',
		description: SITE_DESCRIPTION
	}
}

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem("slyshno-theme");
    if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const { locale, dict } = await getDictionary()

	return (
		<html
			lang={locale}
			className={`${GeistSans.variable} ${GeistMono.variable}`}
			suppressHydrationWarning
		>
			<body>
				<Script
					id="theme-script"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
				<I18nProvider
					locale={locale}
					dict={dict}
				>
					{children}
				</I18nProvider>
			</body>
		</html>
	)
}
