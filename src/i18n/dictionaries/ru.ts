// Мастер-словарь (русский) — источник ключей. en.ts должен зеркалить эти ключи 1:1.
const ru = {
	// --- Общее ---
	'common.loading': 'Загрузка…',
	'common.cancel': 'Отмена',
	'common.save': 'Сохранить',
	'common.saving': 'Сохранение…',
	'common.delete': 'Удалить',
	'common.edit': 'Редактировать',
	'common.close': 'Закрыть',
	'common.copy': 'Копировать',
	'common.copied': 'Скопировано',
	'common.back': 'Назад',
	'common.error.generic': 'Что-то пошло не так',

	// --- App shell (сайдбар) ---
	'appShell.newRequest': 'Новый реквест',
	'appShell.nav.feedback': 'Feedback',
	'appShell.nav.roadmap': 'Roadmap',
	'appShell.nav.changelog': 'Changelog',
	'appShell.nav.publicPortal': 'Публичный портал',
	'appShell.nav.settings': 'Настройки',
	'appShell.nav.docsSection': 'Ресурсы',
	'appShell.nav.docs': 'Документация',
	'appShell.nav.workspaceSection': 'Рабочее пространство',
	'appShell.upgradeToPro': 'Перейти на Pro',
	'appShell.collapse': 'Свернуть',
	'appShell.menu.dashboard': 'Дашборд',
	'appShell.menu.mySettings': 'Мои настройки',
	'appShell.plan.pro': '✦ Pro',
	'appShell.plan.free': 'Free',
	'appShell.language': 'Язык',
	'appShell.proToast': '🎉 Подписка Pro активна — спасибо за поддержку!',

	// --- Auth ---
	'auth.divider.or': 'или',
	'auth.signin.title': 'С возвращением',
	'auth.signin.subtitle': 'Войдите в своё рабочее пространство.',
	'auth.signup.title': 'Создайте аккаунт',
	'auth.signup.subtitle': 'Начните собирать фидбек за пару минут.',
	'auth.continueWithGoogle': 'Продолжить с Google',
	'auth.field.name': 'Имя',
	'auth.field.namePlaceholder': 'Как к вам обращаться',
	'auth.field.email': 'Email',
	'auth.field.password': 'Пароль',
	'auth.forgotPassword': 'Забыли пароль?',
	'auth.forgotPasswordSoon': 'Скоро',
	'auth.check.minLength': 'Минимум 8 символов',
	'auth.check.hasDigit': 'Хотя бы одна цифра',
	'auth.check.hasSpecial': 'Хотя бы один спецсимвол',
	'auth.error.weakPassword': 'Пароль не соответствует требованиям',
	'auth.error.generic': 'Что-то пошло не так',
	'auth.error.alreadyRegistered': 'Такой email уже зарегистрирован — войдите',
	'auth.error.invalidCredentials': 'Неверный email или пароль',
	'auth.submit.wait': 'Подождите…',
	'auth.submit.signup': 'Создать аккаунт',
	'auth.submit.signin': 'Войти',
	'auth.footer.haveAccount': 'Уже есть аккаунт?',
	'auth.footer.noAccount': 'Нет аккаунта?'
} as const

export type DictionaryKey = keyof typeof ru
export type Dictionary = Record<DictionaryKey, string>

export default ru
