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
	'common.back': 'Back',
	'common.error.generic': 'Something went wrong',
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
