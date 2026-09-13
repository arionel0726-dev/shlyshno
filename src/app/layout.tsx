import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
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

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="ru"
			className={`${GeistSans.variable} ${GeistMono.variable}`}
			suppressHydrationWarning
		>
			<body>
				<Script
					id="theme-script"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
				{children}
			</body>
		</html>
	)
}
