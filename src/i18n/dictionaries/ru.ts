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
	'common.copyLink': 'Скопировать ссылку',
	'common.back': 'Назад',
	'common.error.generic': 'Что-то пошло не так',
	'common.confirmDelete': 'Точно удалить?',
	'common.error.short': 'Ошибка',
	'common.optional': 'необязательно',

	// --- Онбординг (Create workspace) ---
	'onboarding.title': 'Создайте рабочее пространство',
	'onboarding.subtitle': 'Дом для фидбека, роадмапа и релизных обновлений.',
	'onboarding.editLater': 'Эти данные можно изменить позже в настройках.',
	'onboarding.field.website': 'Сайт · необязательно',
	'onboarding.field.name': 'Название пространства',
	'onboarding.field.namePlaceholder': 'Мой продукт',
	'onboarding.field.slug': 'Адрес публичной доски',
	'onboarding.submit.creating': 'Создаю…',
	'onboarding.submit.create': 'Создать пространство',

	// --- Dashboard (список проектов) ---
	'dashboard.title': 'Мои проекты',
	'dashboard.newWorkspace': '+ Новое пространство',
	'dashboard.empty': 'Пока пусто. Создайте первое пространство — это займёт минуту.',
	'dashboard.open': 'Открыть',
	'dashboard.manage': 'Управление',
	'dashboard.widgetForSite': 'Виджет для сайта',

	// --- Settings: danger zone ---
	'settings.deleteProject.title': 'Удалить проект',
	'settings.deleteProject.description':
		'Вся доска, карточки и чейнджлог будут удалены безвозвратно.',
	'settings.deleteProject.confirm': 'Точно удалить',

	// --- Settings: навигация ---
	'settings.title': 'Настройки',
	'settings.nav.workspaceSection': 'Пространство',
	'settings.nav.accountSection': 'Аккаунт',
	'settings.nav.brand': 'Бренд и оформление',
	'settings.nav.domain': 'Домен',
	'settings.nav.imports': 'Импорт',
	'settings.nav.profile': 'Профиль',
	'common.soon': 'Скоро',
	'common.dangerZone': 'Опасная зона',

	// --- Settings: Brand & appearance ---
	'settings.brand.subtitle':
		'Как ваше рабочее пространство выглядит для команды и клиентов.',
	'settings.brand.sectionBrand': 'Бренд',
	'settings.brand.sectionAppearance': 'Оформление',
	'settings.brand.accentColor.title': 'Акцентный цвет',
	'settings.brand.accentColor.description':
		'Используется в статусах и публичных поверхностях.',
	'settings.brand.theme.title': 'Тема',
	'settings.brand.theme.description':
		'По умолчанию — системная, посетители могут переключать.',
	'settings.brand.theme.systemBadge': 'Система',
	'settings.brand.sectionPublicExperience': 'Публичный опыт',
	'settings.brand.language.title': 'Язык',
	'settings.brand.language.description': 'Определяется из браузера посетителя.',
	'settings.brand.language.auto': 'Авто',
	'settings.brand.poweredBy': 'Работает на Slyshno',
	'settings.brand.poweredBy.hiddenOnPro': 'Скрыто на Pro',
	'settings.brand.editForm.description': 'Логотип, название и публичная идентичность',
	'settings.brand.editForm.editButton': 'Изменить бренд',
	'settings.brand.editForm.nameLabel': 'Название',

	// --- Settings: Domain ---
	'settings.domain.subtitle':
		'Используйте адрес Slyshno сейчас, подключите свой домен, когда будете готовы.',
	'settings.domain.publicBoardUrl': 'Публичный адрес доски',
	'settings.domain.publicBoardHint': 'Ваша публичная доска доступна по этому адресу.',
	'settings.domain.widgetHint':
		'Вставьте перед закрывающим тегом body — виджет появится на сайте.',
	'settings.domain.customDomain': 'Свой домен',
	'settings.domain.pro.description':
		'Подключение доменов появится в ближайшем обновлении — ваш тариф Pro уже активен.',
	'settings.domain.free.description':
		'Подключите свой домен для полностью фирменного опыта.',
	'settings.domain.connectButton': 'Подключить домен',
	'settings.domain.availableOnPro': 'Доступно на Pro · $10/месяц',
	'settings.imports.subtitle':
		'Перенесите фидбек из Canny или другого инструмента за пару минут.',

	// --- Импорт CSV ---
	'import.pickFile': 'Выберите CSV-файл экспорта из Canny',
	'import.limitHint': 'До 500 строк · колонки: title, details, status',
	'import.noTitleColumn':
		'Не нашёл колонку с заголовком (title). Проверь файл экспорта Canny.',
	'import.foundRecords': 'Найдено записей:',
	'import.truncatedHint': '(лимит — обрезано)',
	'import.andMore': '… и ещё {count}',
	'import.submit.importing': 'Импортирую…',
	'import.submit.import': 'Импортировать {count}',
	'import.error.default': 'Ошибка импорта',
	'import.success': 'Импортировано записей: {count}',

	// --- Settings: Account ---
	'account.emailVerified': 'Подтверждён',
	'account.emailNotVerified': 'Не подтверждён',
	'account.signIn.title': 'Вход',
	'account.signIn.method': 'Способ входа',
	'account.signIn.via': 'Вы вошли через {provider}.',
	'account.subscription.title': 'Подписка',
	'account.subscription.none.title': 'Нет активных подписок',
	'account.subscription.none.description':
		'Тариф Free — для старта этого достаточно.',
	'account.subscription.nextCharge': 'Следующее списание: {date}',
	'account.subscription.cancelledUntil': 'Отменена — Pro действует до {date}',
	'account.subscription.cancelled': 'Отменена',
	'account.form.saved': 'Сохранено ✓',
	'account.subscription.cancelButton': 'Отменить подписку',
	'appShell.signOut': 'Выйти',

	// --- Статусы карточек (общие для Feedback/Roadmap/портала) ---
	'status.pending': 'Новые',
	'status.reviewing': 'На рассмотрении',
	'status.planned': 'Запланировано',
	'status.in_progress': 'В работе',
	'status.completed': 'Готово',
	'status.closed': 'Закрыто',

	// --- Feedback workspace ---
	'feedback.subtitle': 'Собирайте, приоритизируйте и закрывайте цикл.',
	'feedback.filterAll': 'Все обращения',
	'feedback.tabAll': 'Все',
	'feedback.searchPlaceholder': 'Поиск по обращениям...',
	'feedback.empty': 'Ничего не найдено',
	'feedback.newRequestButton': '+ Новый запрос',
	'common.create': 'Создать',

	// --- Модалка New request ---
	'newRequest.you': 'Я',
	'newRequest.type.feature': 'Идея',
	'newRequest.type.bug': 'Баг',
	'newRequest.typeMenu.label': 'Тип запроса',
	'newRequest.title.placeholder': 'Название запроса',
	'newRequest.body.placeholder': 'Опишите, что просят пользователи...',
	'newRequest.statusMenu.label': 'Статус',
	'newRequest.status.done': 'Готово',
	'newRequest.tag.label': 'Тег',

	// --- Roadmap (owner) ---
	'roadmap.title': 'Роадмап',
	'roadmap.subtitle':
		'Что движется: от новых идей до релизов. Перетаскивайте карточки между колонками.',
	'roadmap.listLink': 'Список →',
	'roadmap.hint.pending': 'Только поступило',
	'roadmap.hint.reviewing': 'Изучаем и обсуждаем',
	'roadmap.hint.planned': 'Подтверждено, в очереди',
	'roadmap.hint.in_progress': 'Активно делаем',
	'roadmap.hint.completed': 'Недавно выпущено',
	'roadmap.empty': 'Пусто',
	'roadmap.guest': 'Гость',
	'roadmap.badge.feature': 'ИДЕЯ',
	'roadmap.badge.bug': 'БАГ',

	// --- Changelog (owner) ---
	'changelog.form.titlePlaceholder': 'Заголовок релиза, напр. «Версия 1.2»',
	'changelog.form.bodyPlaceholder': 'Что нового',
	'changelog.form.publish': 'Опубликовать',

	// --- Post detail (owner) ---
	'postDetail.backToFeedback': '← Назад к Feedback',
	'postDetail.discussion': 'Обсуждение · {count}',
	'postDetail.votes': 'Голоса',
	'postDetail.created': 'Создано',
	'postDetail.openPublicBoard': 'Открыть публичную доску →',

	// --- Комментарии ---
	'comments.addPlaceholder': 'Добавить комментарий...',
	'comments.submitting': 'Отправляю…',
	'comments.submit': 'Комментировать',
	'comments.anonymous': 'Аноним',
	'comments.empty': 'Пока нет комментариев — будьте первым.',

	// --- Upgrade modal ---
	'upgrade.checkoutError': 'Не удалось создать оплату',
	'upgrade.title': 'Выберите план',
	'upgrade.subtitle': 'Начните бесплатно, обновитесь, когда понадобится больше.',
	'upgrade.free.currentPlan': 'Текущий план',
	'upgrade.free.forever': 'навсегда',
	'upgrade.free.description': 'Для старта и сбора первого фидбека.',
	'upgrade.free.feature.board': 'Публичная доска фидбека',
	'upgrade.free.feature.roadmap': 'Базовый роадмап',
	'upgrade.free.feature.changelog': 'Чейнджлог',
	'upgrade.free.feature.votes': 'До 100 голосов в месяц',
	'upgrade.free.button.isPro': 'Free',
	'upgrade.free.button.current': 'Ваш текущий план',
	'upgrade.pro.popular': 'Популярный выбор',
	'upgrade.pro.perMonth': '/ месяц',
	'upgrade.pro.description': 'Всё необходимое для серьёзного цикла фидбека.',
	'upgrade.pro.feature.unlimited': 'Безлимитный фидбек',
	'upgrade.pro.feature.domain': 'Доска на вашем домене',
	'upgrade.pro.feature.roadmap': 'Роадмап + чейнджлог без ограничений',
	'upgrade.pro.feature.integrations': 'Интеграции и API — скоро',
	'upgrade.pro.button.manage': 'Управление подпиской',
	'upgrade.pro.button.upgrade': 'Перейти на Pro',
	'upgrade.footer':
		'Всего два плана. Никаких сложных тарифов. Отмена в любой момент.',

	// --- Публичный портал: доска ---
	'portalStatus.all': 'Все',
	'portalStatus.pending': 'Ожидает',
	'portalStatus.reviewing': 'На рассмотрении',
	'portalStatus.planned': 'Запланировано',
	'portalStatus.in_progress': 'В работе',
	'portalStatus.completed': 'Готово',
	'portalStatus.closed': 'Закрыто',
	'portal.popular': 'Популярные',
	'portal.empty': 'Ничего не найдено',
	'portal.guest': 'Гость',
	'portal.postedIn': 'в {category}',
	'portal.category.features': 'Фичи',
	'portal.category.bugs': 'Баги',
	'portal.sidebar.leaveFeedback': 'Оставить отзыв',
	'portal.sidebar.boardsHeading': 'ДОСКИ',
	'portal.sidebar.allFeedback': 'Все отзывы',
	'portal.sidebar.actionsHeading': 'ДЕЙСТВИЯ',
	'portal.sidebar.copyLink': 'Копировать ссылку',
	'portal.sidebar.share': 'Поделиться',
	'portal.poweredByCta': '💬 Создайте свою доску',
	'portal.composer.thanksTitle': 'Спасибо!',
	'portal.composer.thanksBody':
		'Отзыв отправлен — следите за статусом на доске.',
	'portal.composer.titlePlaceholder': 'Коротко: что предлагаешь?',
	'portal.composer.bodyPlaceholder': 'Подробности (необязательно)',
	'portal.composer.emailPlaceholder':
		'Email — чтобы узнать, когда сделаем (необязательно)',
	'portal.composer.sending': 'Отправляю…',
	'portal.composer.send': 'Отправить',
	'portal.tab.feedback': 'Отзывы',
	'portal.tab.roadmap': 'Дорожная карта',
	'portal.tab.changelog': 'Обновления',

	// --- Выпадающий список статуса карточки (owner) ---
	'postStatus.pending': 'Новое',
	'postStatus.reviewing': 'Рассматриваем',
	'postStatus.planned': 'В плане',
	'postStatus.in_progress': 'В работе',
	'postStatus.completed': 'Сделано',
	'postStatus.closed': 'Закрыто',

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
	'auth.footer.noAccount': 'Нет аккаунта?',
	'auth.footer.legal':
		'Продолжая, вы принимаете Условия использования и Политику конфиденциальности.'
} as const

export type DictionaryKey = keyof typeof ru
export type Dictionary = Record<DictionaryKey, string>

export default ru
