'use client'

import {
	BookOpen,
	ChevronsLeft,
	ChevronsRight,
	Clock,
	Globe,
	LayoutDashboard,
	Map,
	MessageSquare,
	PanelsTopLeft,
	Settings,
	Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/context'
import { SignOutButton } from './sign-out-button'
import { UpgradeModal } from './upgrade-modal'
export function AppShell({
	user,
	fallbackSlug,
	isPro,
	children
}: {
	user: { name: string; email: string; image: string }
	fallbackSlug: string | null
	isPro: boolean
	children: React.ReactNode
}) {
	const router = useRouter()
	const { t, locale, setLocale } = useI18n()
	const [collapsed, setCollapsed] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	const m = pathname.match(/\/dashboard\/p\/([^/]+)/)
	const slug = m?.[1] ?? fallbackSlug
	const searchParams = useSearchParams()
	const [showProToast, setShowProToast] = useState(false)

	const MAIN_NAV = [
		{
			href: slug ? `/dashboard/p/${slug}` : '/new',
			icon: MessageSquare,
			label: t('appShell.nav.feedback')
		},
		...(m?.[1]
			? [
					{
						href: `/dashboard/p/${slug}/roadmap`,
						icon: Map,
						label: t('appShell.nav.roadmap')
					},
					{
						href: `/dashboard/p/${slug}/changelog`,
						icon: Clock,
						label: t('appShell.nav.changelog')
					}
				]
			: [])
	]

	const WORKSPACE_NAV = m?.[1]
		? [
				{
					href: `/p/${slug}`,
					icon: Globe,
					label: t('appShell.nav.publicPortal')
				},
				{
					href: `/dashboard/p/${slug}/settings`,
					icon: Settings,
					label: t('appShell.nav.settings')
				}
			]
		: []

	const RESOURCES_NAV = [
		{ href: '/docs', icon: BookOpen, label: t('appShell.nav.docs') }
	]

	useEffect(() => {
		setMenuOpen(false)
	}, [pathname])

	useEffect(() => {
		function onClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setMenuOpen(false)
		}
		document.addEventListener('mousedown', onClick)
		return () => document.removeEventListener('mousedown', onClick)
	}, [])
	useEffect(() => {
		if (searchParams.get('upgraded') === '1') {
			setShowProToast(true)
			const t = setTimeout(() => setShowProToast(false), 6000)
			return () => clearTimeout(t)
		}
	}, [searchParams])
	function onNewRequest() {
		if (slug) {
			window.dispatchEvent(new CustomEvent('slyshno:new-request'))
		} else {
			router.push('/new')
		}
	}

	return (
		<div className="flex h-screen gap-4 bg-background p-4">
			{/* Сайдбар */}
			<aside
				className={`flex flex-col rounded-2xl border border-border bg-background p-3 transition-all ${
					collapsed ? 'w-[72px] items-center' : 'w-64'
				}`}
			>
				{/* Лого */}
				<div
					className={`flex items-center gap-2 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}
				>
					<span className="text-lg font-semibold text-fg">S</span>
					{!collapsed && (
						<span className="text-lg font-semibold text-fg">Slyshno</span>
					)}
				</div>

				{/* New request */}
				<button
					className={`mt-2 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm font-medium text-fg hover:bg-surface-hover ${
						collapsed ? 'justify-center' : ''
					}`}
					title={t('appShell.newRequest')}
					onClick={onNewRequest}
				>
					<Sparkles className="h-4 w-4" />
					{!collapsed && t('appShell.newRequest')}
				</button>

				{/* Навигация */}
				<nav className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto">
					<div className="flex flex-col gap-0.5">
						{MAIN_NAV.map(item => (
							<NavItem
								key={item.label}
								item={item}
								active={pathname === item.href}
								collapsed={collapsed}
							/>
						))}
					</div>

					{WORKSPACE_NAV.length > 0 && (
						<div className="flex flex-col gap-0.5">
							{!collapsed && (
								<p className="px-2 pb-1 text-xs text-fg-faint">
									{t('appShell.nav.workspaceSection')}
								</p>
							)}
							{WORKSPACE_NAV.map(item => (
								<NavItem
									key={item.label}
									item={item}
									active={pathname === item.href}
									collapsed={collapsed}
								/>
							))}
						</div>
					)}

					<div className="flex flex-col gap-0.5">
						{!collapsed && (
							<p className="px-2 pb-1 text-xs text-fg-faint">
								{t('appShell.nav.docsSection')}
							</p>
						)}
						{RESOURCES_NAV.map(item => (
							<NavItem
								key={item.label}
								item={item}
								active={pathname === item.href}
								collapsed={collapsed}
							/>
						))}
					</div>
				</nav>

				{!isPro && (
					<button
						onClick={() =>
							window.dispatchEvent(new CustomEvent('slyshno:upgrade'))
						}
						className={`mb-2 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-fg hover:bg-surface ${
							collapsed ? 'justify-center' : ''
						}`}
						title={t('appShell.upgradeToPro')}
					>
						<Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
						{!collapsed && t('appShell.upgradeToPro')}
					</button>
				)}

				{/* Collapse */}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-fg-secondary hover:bg-surface ${
						collapsed ? 'justify-center' : ''
					}`}
				>
					{collapsed ? (
						<ChevronsRight className="h-4 w-4" />
					) : (
						<ChevronsLeft className="h-4 w-4" />
					)}
					{!collapsed && t('appShell.collapse')}
				</button>

				{/* Юзер */}
				<div
					className="relative mt-2"
					ref={menuRef}
				>
					{menuOpen && (
						<div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
							<div className="border-b border-border px-4 py-3">
								<p className="text-sm font-semibold text-fg">{user.name}</p>
								<p className="truncate text-xs text-fg-muted">{user.email}</p>
							</div>
							<div className="py-1">
								{[
									{
										href: '/dashboard',
										icon: LayoutDashboard,
										label: t('appShell.menu.dashboard')
									},
									...(slug
										? [
												{
													href: `/dashboard/p/${slug}/settings/account`,
													icon: Settings,
													label: t('appShell.menu.mySettings')
												}
											]
										: [])
								].map(i => (
									<Link
										key={i.label}
										href={i.href}
										className="flex items-center gap-3 px-4 py-2 text-sm text-fg-secondary hover:bg-surface"
									>
										<i.icon className="h-4 w-4" /> {i.label}
									</Link>
								))}
							</div>
							<div className="flex items-center justify-between border-t border-border px-4 py-2.5">
								<span className="flex items-center gap-2 text-sm text-fg-secondary">
									<Globe className="h-4 w-4" /> {t('appShell.language')}
								</span>
								<div className="flex overflow-hidden rounded-lg border border-border text-xs font-medium">
									{(['ru', 'en'] as const).map(l => (
										<button
											key={l}
											onClick={() => setLocale(l)}
											className={`px-2.5 py-1 ${
												locale === l
													? 'bg-surface-active text-fg'
													: 'text-fg-muted hover:bg-surface'
											}`}
										>
											{l.toUpperCase()}
										</button>
									))}
								</div>
							</div>
							<SignOutButton />
						</div>
					)}

					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className={`flex w-full items-center gap-3 rounded-xl p-2 hover:bg-surface ${
							collapsed ? 'justify-center' : ''
						}`}
					>
						{user.image ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={user.image}
								alt=""
								className="h-8 w-8 rounded-full"
							/>
						) : (
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-active text-sm font-medium text-fg">
								{user.name?.[0]?.toUpperCase()}
							</span>
						)}
						{!collapsed && (
							<>
								<span className="min-w-0 flex-1 text-left">
									<span className="block truncate text-sm font-medium text-fg">
										{user.name}
									</span>
									<span
										className={`block text-xs ${
											isPro ? 'font-medium text-violet-500' : 'text-fg-faint'
										}`}
									>
										{isPro ? t('appShell.plan.pro') : t('appShell.plan.free')}
									</span>
								</span>
								<PanelsTopLeft className="h-4 w-4 text-fg-faint" />
							</>
						)}
					</button>
				</div>
			</aside>

			{/* Контент */}
			<main className="flex-1 overflow-y-auto">{children}</main>
			<UpgradeModal isPro={isPro} />
			{showProToast && (
				<div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-background px-5 py-2.5 text-sm text-fg shadow-lg">
					{t('appShell.proToast')}
				</div>
			)}
		</div>
	)
}

function NavItem({
	item,
	active,
	collapsed
}: {
	item: { href: string; icon: any; label: string }
	active: boolean
	collapsed: boolean
}) {
	return (
		<Link
			href={item.href}
			title={item.label}
			className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
				collapsed ? 'justify-center' : ''
			} ${
				active
					? 'bg-surface font-medium text-fg'
					: 'text-fg-secondary hover:bg-surface hover:text-fg'
			}`}
		>
			<item.icon className="h-4 w-4 shrink-0" />
			{!collapsed && item.label}
		</Link>
	)
}
