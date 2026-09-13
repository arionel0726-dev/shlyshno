import type { Dictionary } from './ru'

const en: Dictionary = {
	// --- Common ---
	'common.loading': 'Loading…',
	'common.cancel': 'Cancel',
	'common.save': 'Save',
	'common.saving': 'Saving…',
	'common.delete': 'Delete',
	'common.edit': 'Edit',
	'common.close': 'Close',
	'common.copy': 'Copy',
	'common.copied': 'Copied',
	'common.copyLink': 'Copy link',
	'common.back': 'Back',
	'common.error.generic': 'Something went wrong',
	'common.confirmDelete': 'Delete for sure?',
	'common.error.short': 'Error',
	'common.optional': 'optional',

	// --- Onboarding (Create workspace) ---
	'onboarding.title': 'Create your workspace',
	'onboarding.subtitle': 'A home for feedback, roadmap, and release updates.',
	'onboarding.editLater': 'You can change this later in settings.',
	'onboarding.field.website': 'Website · optional',
	'onboarding.field.name': 'Workspace name',
	'onboarding.field.namePlaceholder': 'My product',
	'onboarding.field.slug': 'Public board address',
	'onboarding.submit.creating': 'Creating…',
	'onboarding.submit.create': 'Create workspace',

	// --- Dashboard (project list) ---
	'dashboard.title': 'My projects',
	'dashboard.newWorkspace': '+ New workspace',
	'dashboard.empty': 'Nothing here yet. Create your first workspace — it takes a minute.',
	'dashboard.open': 'Open',
	'dashboard.manage': 'Manage',
	'dashboard.widgetForSite': 'Widget for your site',

	// --- Settings: danger zone ---
	'settings.deleteProject.title': 'Delete project',
	'settings.deleteProject.description':
		'The board, all cards, and the changelog will be permanently deleted.',
	'settings.deleteProject.confirm': 'Yes, delete',

	// --- Settings: navigation ---
	'settings.title': 'Settings',
	'settings.nav.workspaceSection': 'Workspace',
	'settings.nav.accountSection': 'Account',
	'settings.nav.brand': 'Brand & appearance',
	'settings.nav.domain': 'Domain',
	'settings.nav.imports': 'Import',
	'settings.nav.profile': 'Profile',
	'common.soon': 'Coming soon',
	'common.dangerZone': 'Danger zone',

	// --- Settings: Brand & appearance ---
	'settings.brand.subtitle':
		'How your workspace looks to your team and customers.',
	'settings.brand.sectionBrand': 'Brand',
	'settings.brand.sectionAppearance': 'Appearance',
	'settings.brand.accentColor.title': 'Accent color',
	'settings.brand.accentColor.description':
		'Used in statuses and public surfaces.',
	'settings.brand.theme.title': 'Theme',
	'settings.brand.theme.description':
		'Defaults to system, visitors can switch it themselves.',
	'settings.brand.theme.systemBadge': 'System',
	'settings.brand.sectionPublicExperience': 'Public experience',
	'settings.brand.language.title': 'Language',
	'settings.brand.language.description': "Detected from the visitor's browser.",
	'settings.brand.language.auto': 'Auto',
	'settings.brand.poweredBy': 'Powered by Slyshno',
	'settings.brand.poweredBy.hiddenOnPro': 'Hidden on Pro',
	'settings.brand.editForm.description': 'Logo, name, and public identity',
	'settings.brand.editForm.editButton': 'Edit brand',
	'settings.brand.editForm.nameLabel': 'Name',

	// --- Settings: Domain ---
	'settings.domain.subtitle':
		'Use the Slyshno address for now, connect your own domain whenever you’re ready.',
	'settings.domain.publicBoardUrl': 'Public board URL',
	'settings.domain.publicBoardHint': 'Your public board is available at this address.',
	'settings.domain.widgetHint':
		'Paste this before the closing body tag — the widget will show up on your site.',
	'settings.domain.customDomain': 'Custom domain',
	'settings.domain.pro.description':
		'Domain connection is coming in a future update — your Pro plan is already active.',
	'settings.domain.free.description':
		'Connect your own domain for a fully branded experience.',
	'settings.domain.connectButton': 'Connect domain',
	'settings.domain.availableOnPro': 'Available on Pro · $10/month',
	'settings.imports.subtitle':
		'Bring your feedback over from Canny or another tool in a couple of minutes.',

	// --- CSV import ---
	'import.pickFile': 'Choose a Canny export CSV file',
	'import.limitHint': 'Up to 500 rows · columns: title, details, status',
	'import.noTitleColumn':
		"Couldn't find a title column. Check your Canny export file.",
	'import.foundRecords': 'Records found:',
	'import.truncatedHint': '(limit reached — truncated)',
	'import.andMore': '… and {count} more',
	'import.submit.importing': 'Importing…',
	'import.submit.import': 'Import {count}',
	'import.error.default': 'Import failed',
	'import.success': 'Imported records: {count}',

	// --- Settings: Account ---
	'account.emailVerified': 'Verified',
	'account.emailNotVerified': 'Not verified',
	'account.signIn.title': 'Sign-in',
	'account.signIn.method': 'Sign-in method',
	'account.signIn.via': 'You signed in with {provider}.',
	'account.subscription.title': 'Subscription',
	'account.subscription.none.title': 'No active subscriptions',
	'account.subscription.none.description':
		'Free plan — plenty to get started.',
	'account.subscription.nextCharge': 'Next charge: {date}',
	'account.subscription.cancelledUntil': 'Cancelled — Pro is active until {date}',
	'account.subscription.cancelled': 'Cancelled',
	'account.form.saved': 'Saved ✓',
	'account.subscription.cancelButton': 'Cancel subscription',
	'appShell.signOut': 'Sign out',

	// --- Post statuses (shared across Feedback/Roadmap/portal) ---
	'status.pending': 'New',
	'status.reviewing': 'Reviewing',
	'status.planned': 'Planned',
	'status.in_progress': 'In progress',
	'status.completed': 'Completed',
	'status.closed': 'Closed',

	// --- Feedback workspace ---
	'feedback.subtitle': 'Collect, prioritize, and close the loop.',
	'feedback.filterAll': 'All feedback',
	'feedback.tabAll': 'All',
	'feedback.searchPlaceholder': 'Search feedback...',
	'feedback.empty': 'Nothing found',
	'feedback.newRequestButton': '+ New request',
	'common.create': 'Create',

	// --- New request modal ---
	'newRequest.you': 'Me',
	'newRequest.type.feature': 'Feature',
	'newRequest.type.bug': 'Bug',
	'newRequest.typeMenu.label': 'Request type',
	'newRequest.title.placeholder': 'Request title',
	'newRequest.body.placeholder': 'Describe what users are asking for...',
	'newRequest.statusMenu.label': 'Status',
	'newRequest.status.done': 'Done',
	'newRequest.tag.label': 'Tag',

	// --- Roadmap (owner) ---
	'roadmap.title': 'Roadmap',
	'roadmap.subtitle':
		"What's moving: from new ideas to releases. Drag cards between columns.",
	'roadmap.listLink': 'List →',
	'roadmap.hint.pending': 'Just came in',
	'roadmap.hint.reviewing': 'Looking into it',
	'roadmap.hint.planned': 'Confirmed, in the queue',
	'roadmap.hint.in_progress': 'Actively being built',
	'roadmap.hint.completed': 'Recently shipped',
	'roadmap.empty': 'Empty',
	'roadmap.guest': 'Guest',
	'roadmap.badge.feature': 'FEATURE',
	'roadmap.badge.bug': 'BUG',

	// --- Changelog (owner) ---
	'changelog.form.titlePlaceholder': 'Release title, e.g. “Version 1.2”',
	'changelog.form.bodyPlaceholder': "What's new",
	'changelog.form.publish': 'Publish',

	// --- Post detail (owner) ---
	'postDetail.backToFeedback': '← Back to Feedback',
	'postDetail.discussion': 'Discussion · {count}',
	'postDetail.votes': 'Votes',
	'postDetail.created': 'Created',
	'postDetail.openPublicBoard': 'Open public board →',

	// --- Comments ---
	'comments.addPlaceholder': 'Add a comment...',
	'comments.submitting': 'Sending…',
	'comments.submit': 'Comment',
	'comments.anonymous': 'Anonymous',
	'comments.empty': 'No comments yet — be the first.',

	// --- Upgrade modal ---
	'upgrade.checkoutError': 'Couldn’t start checkout',
	'upgrade.title': 'Choose a plan',
	'upgrade.subtitle': 'Start free, upgrade whenever you need more.',
	'upgrade.free.currentPlan': 'Current plan',
	'upgrade.free.forever': 'forever',
	'upgrade.free.description': 'For getting started and collecting your first feedback.',
	'upgrade.free.feature.board': 'Public feedback board',
	'upgrade.free.feature.roadmap': 'Basic roadmap',
	'upgrade.free.feature.changelog': 'Changelog',
	'upgrade.free.feature.votes': 'Up to 100 votes / month',
	'upgrade.free.button.isPro': 'Free',
	'upgrade.free.button.current': 'Your current plan',
	'upgrade.pro.popular': 'Most popular',
	'upgrade.pro.perMonth': '/ month',
	'upgrade.pro.description': 'Everything you need for a serious feedback loop.',
	'upgrade.pro.feature.unlimited': 'Unlimited feedback',
	'upgrade.pro.feature.domain': 'Board on your own domain',
	'upgrade.pro.feature.roadmap': 'Unlimited roadmap + changelog',
	'upgrade.pro.feature.integrations': 'Integrations and API — coming soon',
	'upgrade.pro.button.manage': 'Manage subscription',
	'upgrade.pro.button.upgrade': 'Upgrade to Pro',
	'upgrade.footer':
		'Just two plans. No confusing tiers. Cancel any time.',

	// --- Public portal: board ---
	'portalStatus.all': 'All',
	'portalStatus.pending': 'Pending',
	'portalStatus.reviewing': 'Under review',
	'portalStatus.planned': 'Planned',
	'portalStatus.in_progress': 'In progress',
	'portalStatus.completed': 'Done',
	'portalStatus.closed': 'Closed',
	'portal.popular': 'Popular',
	'portal.empty': 'Nothing found',
	'portal.guest': 'Guest',
	'portal.postedIn': 'in {category}',
	'portal.category.features': 'Features',
	'portal.category.bugs': 'Bugs',
	'portal.sidebar.leaveFeedback': 'Leave feedback',
	'portal.sidebar.boardsHeading': 'BOARDS',
	'portal.sidebar.allFeedback': 'All feedback',
	'portal.sidebar.actionsHeading': 'ACTIONS',
	'portal.sidebar.copyLink': 'Copy link',
	'portal.sidebar.share': 'Share',
	'portal.poweredByCta': '💬 Create your own board',
	'portal.composer.thanksTitle': 'Thanks!',
	'portal.composer.thanksBody':
		'Your feedback was submitted — follow its status on the board.',
	'portal.composer.titlePlaceholder': "What's your idea, in short?",
	'portal.composer.bodyPlaceholder': 'Details (optional)',
	'portal.composer.emailPlaceholder':
		"Email — to find out when it's done (optional)",
	'portal.composer.sending': 'Sending…',
	'portal.composer.send': 'Send',
	'portal.tab.feedback': 'Feedback',
	'portal.tab.roadmap': 'Roadmap',
	'portal.tab.changelog': 'Changelog',
	'portal.defaultUser': 'User',
	'common.send': 'Send',
	'public.emailRequired': 'Email (required)',
	'comments.reply': 'Reply',

	// --- Relative time ---
	'time.justNow': 'just now',
	'time.minutesAgo': '{count}m ago',
	'time.hoursAgo': '{count}h ago',
	'time.daysAgo': '{count}d ago',
	'portal.roadmap.subtitle': "What's planned and what's headed for release.",
	'portal.changelog.subtitle': "What's new in {name}.",
	'portal.changelog.team': 'Team',
	'portal.changelog.empty': 'Nothing here yet — stay tuned.',
	'portal.changelog.teamOf': '{name} team',
	'portal.changelog.upcoming': 'Coming up',
	'portal.changelog.upcomingEmpty': 'The plan will show up once votes come in',

	// --- Post status dropdown (owner) ---
	'postStatus.pending': 'New',
	'postStatus.reviewing': 'Reviewing',
	'postStatus.planned': 'Planned',
	'postStatus.in_progress': 'In progress',
	'postStatus.completed': 'Completed',
	'postStatus.closed': 'Closed',

	// --- App shell (sidebar) ---
	'appShell.newRequest': 'New request',
	'appShell.nav.feedback': 'Feedback',
	'appShell.nav.roadmap': 'Roadmap',
	'appShell.nav.changelog': 'Changelog',
	'appShell.nav.publicPortal': 'Public portal',
	'appShell.nav.settings': 'Settings',
	'appShell.nav.docsSection': 'Resources',
	'appShell.nav.docs': 'Docs',
	'appShell.nav.workspaceSection': 'Workspace',
	'appShell.upgradeToPro': 'Upgrade to Pro',
	'appShell.collapse': 'Collapse',
	'appShell.menu.dashboard': 'Dashboard',
	'appShell.menu.mySettings': 'My settings',
	'appShell.plan.pro': '✦ Pro',
	'appShell.plan.free': 'Free',
	'appShell.language': 'Language',
	'appShell.proToast': '🎉 Pro subscription is active — thanks for the support!',

	// --- Auth ---
	'auth.divider.or': 'or',
	'auth.signin.title': 'Welcome back',
	'auth.signin.subtitle': 'Sign in to your workspace.',
	'auth.signup.title': 'Create an account',
	'auth.signup.subtitle': 'Start collecting feedback in a couple of minutes.',
	'auth.continueWithGoogle': 'Continue with Google',
	'auth.field.name': 'Name',
	'auth.field.namePlaceholder': 'How should we call you',
	'auth.field.email': 'Email',
	'auth.field.password': 'Password',
	'auth.forgotPassword': 'Forgot password?',
	'auth.forgotPasswordSoon': 'Coming soon',
	'auth.check.minLength': 'At least 8 characters',
	'auth.check.hasDigit': 'At least one digit',
	'auth.check.hasSpecial': 'At least one special character',
	'auth.error.weakPassword': 'Password doesn’t meet the requirements',
	'auth.error.generic': 'Something went wrong',
	'auth.error.alreadyRegistered': 'That email is already registered — sign in instead',
	'auth.error.invalidCredentials': 'Invalid email or password',
	'auth.submit.wait': 'Please wait…',
	'auth.submit.signup': 'Create account',
	'auth.submit.signin': 'Sign in',
	'auth.footer.haveAccount': 'Already have an account?',
	'auth.footer.noAccount': 'Don’t have an account?',
	'auth.footer.legal':
		'By continuing, you agree to the Terms of Service and Privacy Policy.'
}

export default en
