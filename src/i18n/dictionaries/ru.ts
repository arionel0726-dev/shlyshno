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
	'portal.defaultUser': 'Пользователь',
	'common.send': 'Отправить',
	'public.emailRequired': 'Email (обязательно)',
	'comments.reply': 'Ответить',

	// --- Относительное время ---
	'time.justNow': 'только что',
	'time.minutesAgo': '{count} мин назад',
	'time.hoursAgo': '{count} ч назад',
	'time.daysAgo': '{count} дн назад',
	'portal.roadmap.subtitle': 'Что уже запланировано и что движется к релизу.',
	'portal.changelog.subtitle': 'Что нового в {name}.',
	'portal.changelog.team': 'Команда',
	'portal.changelog.empty': 'Пока пусто — следите за обновлениями.',
	'portal.changelog.teamOf': 'Команда {name}',
	'portal.changelog.upcoming': 'В планах',
	'portal.changelog.upcomingEmpty': 'План появится вместе с голосами',

	// --- Виджет ---
	'widget.greeting': 'Привет! 👋',
	'widget.greetingSubtitle': 'Расскажите, что улучшить.',
	'widget.home.leaveFeedback.desc': 'Предложите идею за полминуты',
	'widget.home.feedback.title': 'Фидбек и голосование',
	'widget.home.feedback.desc': '{count} предложений — голосуйте',
	'widget.home.roadmap.desc': 'Что мы делаем дальше',
	'widget.changelog.title': 'Что нового',
	'widget.changelog.desc': 'Последние обновления',
	'widget.poweredBy': 'Powered by',
	'widget.feedback.header': 'Фидбек',
	'widget.feedback.searchPlaceholder': 'Поиск по идеям…',
	'widget.feedback.empty': 'Пока пусто',
	'widget.submit.doneHeader': 'Готово',
	'widget.submit.thanks': 'Спасибо за отзыв!',
	'widget.submit.trackStatus': 'Следите за статусом в разделе «Фидбек».',
	'widget.submit.backToIdeas': 'К списку идей',
	'widget.submit.titlePlaceholder': 'Что предлагаете? Одной фразой…',
	'widget.submit.emailPlaceholder': 'Email для уведомления (необязательно)',
	'widget.roadmap.empty': 'Роадмап появится вместе с голосами',

	// --- Лендинг ---
	'landing.hero.eyebrow': 'Фидбек, роадмап и обновления — в одном месте',
	'landing.hero.title': 'Превращайте фидбек в решения о продукте.',
	'landing.hero.subtitle':
		'Собирайте идеи, понимайте, что важно, планируйте следующие шаги и держите пользователей в курсе — без пяти разных инструментов.',
	'landing.cta.startFree': 'Начать бесплатно',
	'landing.cta.howItWorks': 'Как это работает',
	'landing.freeForever': 'Бесплатно навсегда · Без карты',

	'landing.outcomes.eyebrow': 'Результат',
	'landing.outcomes.title':
		'Система, в которой фидбек превращается в прогресс продукта.',
	'landing.outcomes.subtitle':
		'Slyshno объединяет сбор, приоритизацию, роадмап и коммуникацию релизов в один рабочий процесс — идеи не теряются между поддержкой, планированием и разработкой.',
	'landing.outcomes.item1.title': 'Фидбек в одном месте',
	'landing.outcomes.item1.text':
		'Запросы клиентов, идеи команды и внутренние инсайты — в одной системе.',
	'landing.outcomes.item2.title': 'Приоритеты на виду',
	'landing.outcomes.item2.text':
		'Показывайте, что на рассмотрении, в плане и в работе — все видят движение.',
	'landing.outcomes.item3.title': 'Обновления доходят',
	'landing.outcomes.item3.text':
		'Готовые фичи становятся чейнджлогом, подписчики узнают первыми.',
	'landing.outcomes.item4.title': 'Цикл растёт сам',
	'landing.outcomes.item4.text':
		'Видимый прогресс возвращает пользователей с голосами и комментариями.',

	'landing.engagement.eyebrow': 'Вовлечённость',
	'landing.engagement.title': 'Фидбек не должен исчезать после отправки.',
	'landing.engagement.subtitle':
		'Большинство инструментов заканчиваются на сборе. Slyshno держит разговор живым от первого запроса до релиза — пользователи всегда знают, что изменилось и что движется дальше.',
	'landing.engagement.stat1': 'шага одним циклом',
	'landing.engagement.stat2': 'источник правды',
	'landing.engagement.stat3': 'писем вручную',
	'landing.engagement.step1.title': 'Подтвердите запрос',
	'landing.engagement.step1.text':
		'Пользователь видит, что идея принята, и где следить за ней дальше.',
	'landing.engagement.step2.title': 'Покажите прогресс',
	'landing.engagement.step2.text':
		'Смена статуса рассказывает историю: от рассмотрения до работы.',
	'landing.engagement.step3.title': 'Закройте цикл релизом',
	'landing.engagement.step3.text':
		'Когда фича готова, все проголосовавшие получают письмо.',
	'landing.engagement.step4.title': 'Возвращайте людей естественно',
	'landing.engagement.step4.text':
		'Голоса и обновления дают повод вернуться без спама.',

	'landing.gettingStarted.eyebrow': 'Старт',
	'landing.gettingStarted.title': 'Начните маленьким. Полезен — сразу.',
	'landing.gettingStarted.subtitle':
		'Не нужно ничего настраивать неделями. Создайте пространство, покажите одну доску пользователям — и первые запросы сами расставят приоритеты.',
	'landing.gettingStarted.freeTariff': 'Free-тариф · без карты',
	'landing.gettingStarted.panelEyebrow': 'Ваш первый цикл',
	'landing.gettingStarted.step1.title': 'Создайте пространство',
	'landing.gettingStarted.step1.desc': 'Название, адрес доски — и готово.',
	'landing.gettingStarted.step2.title': 'Откройте канал фидбека',
	'landing.gettingStarted.step2.desc':
		'Поделитесь ссылкой или вставьте виджет на сайт.',
	'landing.gettingStarted.step3.title': 'Превратите запрос в прогресс',
	'landing.gettingStarted.step3.desc':
		'Рассмотрите, смените статус, опубликуйте обновление.',
	'landing.gettingStarted.footer':
		'Первый запрос → первое решение → первое обновление',

	'landing.cta.eyebrow': 'Готовы, когда вы готовы',
	'landing.cta.title': 'Превратите фидбек во что-то, что видно движение.',
	'landing.cta.subtitle':
		'Начните с бесплатного тарифа. Pro за $10 — когда цикл фидбека потребует больше.',
	'landing.cta.pricingLink': 'Смотреть цены →',

	'landing.faq.title': 'Вопросы перед стартом?',
	'landing.faq.subtitle':
		'Всё, что нужно знать о Slyshno, бесплатном тарифе и росте.',
	'landing.nav.features': 'Возможности',
	'landing.nav.docs': 'Доки',
	'landing.nav.pricing': 'Цены',

	// --- Лендинг: FAQ ---
	'landing.faq.q1': 'Можно ли пользоваться бесплатно?',
	'landing.faq.a1':
		'Да. Free-тариф создан для маленьких команд и ранних продуктов: публичная доска, роадмап, чейнджлог и до 100 голосов в месяц — без карты.',
	'landing.faq.q2': 'Что даёт Pro за $10?',
	'landing.faq.a2':
		'Три проекта безлимитно, безлимит голосов, доска на вашем домене и приоритетная поддержка. Без скрытых платежей и «командных» надбавок.',
	'landing.faq.q3': 'Нужен ли пользователям аккаунт, чтобы оставить фидбек?',
	'landing.faq.a3':
		'Нет. Голосовать и предлагать идеи можно без регистрации — один клик. Это заметно поднимает конверсию.',
	'landing.faq.q4': 'Можно ли встроить Slyshno в свой продукт?',
	'landing.faq.a4':
		'Да. Один сниппет — и виджет обратной связи живёт на вашем сайте. Пользователи шлют идеи, не уходя со страницы.',
	'landing.faq.q5': 'Есть ли тёмная тема?',
	'landing.faq.a5':
		'Да, светлая и тёмная темы в приложении и на публичных досках. По умолчанию — системная.',
	'landing.faq.q6': 'Можно ли перенестись с другого инструмента?',
	'landing.faq.a6':
		'Импорт из Canny и CSV — в ближайшем обновлении. Пока поможем перенести данные вручную — напишите нам.',

	// --- Лендинг: мокап продукта ---
	'landing.mock.row1.title': 'Тёмная тема',
	'landing.mock.row2.title': 'Публичный API',
	'landing.mock.row3.title': 'Уведомления в Telegram',
	'landing.mock.row4.title': 'Свой домен',
	'landing.mock.searchPlaceholder': 'Поиск по фидбеку…',
	'landing.mock.detailsHeading': 'ДЕТАЛИ',
	'landing.mock.statusHeading': 'СТАТУС',
	'landing.mock.votesHeading': 'ГОЛОСА',

	// --- Лендинг: футер ---
	'footer.tagline': 'Фидбек, роадмап и обновления продукта — в одном цикле.',
	'footer.col.product': 'Продукт',
	'footer.col.product.feedback': 'Фидбек',
	'footer.col.product.roadmap': 'Роадмап',
	'footer.col.product.changelog': 'Чейнджлог',
	'footer.col.product.widget': 'Виджет',
	'footer.col.product.pricing': 'Цены',
	'footer.col.resources': 'Ресурсы',
	'footer.col.resources.docs': 'Документация',
	'footer.col.resources.api': 'API',
	'footer.col.resources.guides': 'Гайды',
	'footer.col.resources.status': 'Статус',
	'footer.col.company': 'Компания',
	'footer.col.company.about': 'О нас',
	'footer.col.company.blog': 'Блог',
	'footer.col.company.contacts': 'Контакты',
	'footer.bottomTagline':
		'Сделано для команд, которым важен прогресс, а не просто сбор заявок.',

	// --- Страница цен ---
	'pricing.hero.title': 'Простые цены. Два плана.',
	'pricing.hero.subtitle':
		'Начните бесплатно. Обновитесь, когда команде нужно больше места для сбора, приоритизации и закрытия цикла.',
	'pricing.pro.comingSoonTitle': 'Оплата появится с запуском',
	'pricing.pro.upgradeButton': 'Обновить до Pro',
	'pricing.plansFooter':
		'Только два плана. Никаких сложных тарифов. Отмена в любой момент.',
	'pricing.compare.eyebrow': 'Что внутри',
	'pricing.compare.title': 'Всё для чистого цикла фидбека.',
	'pricing.compare.subtitle':
		'Free закрывает основной сценарий. Pro снимает лимиты и добавляет инструменты, которые нужны растущим командам.',
	'pricing.compare.tableHeader': 'Сравнение',
	'pricing.compare.row1.label': 'Доска фидбека',
	'pricing.compare.row1.free': 'Публичная доска и голосование',
	'pricing.compare.row1.pro': 'Безлимит + свой домен',
	'pricing.compare.row2.label': 'Роадмап',
	'pricing.compare.row2.free': 'Базовый',
	'pricing.compare.row2.pro': 'Полный цикл статусов',
	'pricing.compare.row3.label': 'Чейнджлог',
	'pricing.compare.row3.free': 'Публикация обновлений',
	'pricing.compare.row3.pro': 'Публикация + письма подписчикам',
	'pricing.compare.row4.label': 'Интеграции',
	'pricing.compare.row4.free': '—',
	'pricing.compare.row4.pro': 'API и интеграции — скоро',
	'pricing.compare.row5.label': 'Лимит голосов',
	'pricing.compare.row5.free': 'До 100 в месяц',
	'pricing.compare.row5.pro': 'Безлимит',
	'pricing.finalCta.title': 'Начните бесплатно. Обновляйтесь, когда это окупится.',
	'pricing.finalCta.subtitle': 'Без карты. Ваше пространство стартует на Free.',
	'pricing.finalCta.faqLink': 'Читать FAQ',

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
