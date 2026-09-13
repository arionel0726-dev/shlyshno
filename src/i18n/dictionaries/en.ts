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
