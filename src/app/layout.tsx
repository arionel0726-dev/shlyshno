import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
import { I18nProvider } from '@/i18n/context'
import { getDictionary } from '@/i18n/server'
import './globals.css'

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
