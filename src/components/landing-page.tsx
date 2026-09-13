'use client'

import { motion, useReducedMotion } from 'motion/react'
import { LandingAuth } from './landing-auth'

const feedback = [
	{ title: 'Тёмная тема для виджета', description: 'Выглядит отлично на тёмных интерфейсах.', votes: '124', tone: 'violet', status: 'В работе' },
	{ title: 'Экспорт идей в CSV', description: 'Нужно выгружать предложения для анализа.', votes: '87', tone: 'blue', status: 'В плане' },
	{ title: 'Уведомления о комментариях', description: 'Сообщать команде о новых ответах.', votes: '56', tone: 'orange', status: 'Исследуем' },
]

const plans = [
	{ name: 'Free', title: 'Начать слушать', description: 'Для небольших команд, которые только начинают.', price: '0₽', tone: 'soft', items: ['Публичная доска', 'Базовый виджет', 'До 3 участников'] },
	{ name: 'Start', title: 'Расти вместе', description: 'Для продукта, который уже говорит с клиентами.', price: '399₽', tone: 'violet', items: ['Всё из Free', 'Роадмап и статусы', 'Настраиваемый виджет'] },
	{ name: 'Pro', title: 'Замыкать цикл', description: 'Для продуктовых команд с большим объёмом обратной связи.', price: '999₽', tone: 'dark', featured: true, items: ['Всё из Start', 'Продвинутая аналитика', 'Приоритетная поддержка'] },
]

function Arrow() {
	return <span className="arrow-mark" aria-hidden="true">↗</span>
}

function BrandMark() {
	return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
}

function StatusPill({ children, tone }: { children: React.ReactNode; tone: string }) {
	return <span className={`status-pill status-${tone}`}><i />{children}</span>
}

function FeedbackObject({ compact = false }: { compact?: boolean }) {
	return <div className={`feedback-object ${compact ? 'feedback-object-compact' : ''}`}>
		<div className="object-head"><span className="object-avatar">Л</span><span><strong>Людмила М.</strong><small>5 минут назад</small></span><b>•••</b></div>
		<strong className="object-title">Тёмная тема для виджета</strong>
		<p>Было бы здорово иметь автоматическую тёмную тему для сайтов с тёмным интерфейсом.</p>
		<div className="object-meta"><StatusPill tone="violet">Улучшение</StatusPill><span>Мобильное приложение</span></div>
		<div className="object-footer"><span>♡ 12</span><span>Ответить&nbsp; ↗</span></div>
	</div>
}

function RoadmapObject() {
	return <div className="roadmap-object"><div className="object-head"><span><small>PRODUCT ROADMAP</small><strong>В роадмапе</strong></span><b>•••</b></div><div className="roadmap-line"><i className="dot-orange" /><span>Исследуем</span><b>12</b></div><div className="roadmap-line"><i className="dot-blue" /><span>В плане</span><b>8</b></div><div className="roadmap-line"><i className="dot-violet" /><span>В разработке</span><b>4</b></div><div className="roadmap-line"><i className="dot-green" /><span>Готово</span><b>20</b></div></div>
}

function HeroVisual() {
	const reduceMotion = useReducedMotion()
	return <motion.div className="hero-visual" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .75, ease: [0.22, 1, .36, 1] }}>
		<div className="visual-caption"><span>FEEDBACK / LIVE</span><span>01</span></div>
		<div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
		<div className="hero-note note-top"><span>Нарастающие<br />запросы</span><b>↘</b></div>
		<div className="hero-object-main"><FeedbackObject /></div>
		<div className="hero-object-roadmap"><RoadmapObject /></div>
		<div className="hero-note note-bottom"><b>↗</b><span>От идеи<br />к результату</span></div>
	</motion.div>
}

function WorkspaceCanvas() {
	return <div className="workspace-canvas"><div className="workspace-head"><div className="workspace-brand"><BrandMark /><b>slyshno</b></div><span>Inbox</span><span>Роадмап</span><span>Команда</span><i>⌕</i><span className="workspace-avatar">A</span></div><div className="workspace-body"><aside><small>ПРОДУКТ</small><b className="selected">▣ &nbsp; Inbox <em>24</em></b><b>⌁ &nbsp; Идеи</b><b>◌ &nbsp; Роадмап</b><b>□ &nbsp; Чейнджлог</b><small className="workspace-bottom">НАСТРОЙКИ</small><b>⚙ &nbsp; Настройки</b></aside><div className="workspace-inbox"><div className="workspace-title"><span><small>ВХОДЯЩИЕ</small><strong>Что говорят пользователи</strong></span><button>+ Добавить</button></div><div className="workspace-filters"><span className="selected">Все&nbsp; 24</span><span>Открытые&nbsp; 12</span><span>Закрытые&nbsp; 20</span></div>{feedback.map((item) => <div className="workspace-row" key={item.title}><div className={`row-avatar row-${item.tone}`}>{item.title.slice(0, 1)}</div><div><strong>{item.title}</strong><small>{item.description}</small><span><StatusPill tone={item.tone}>{item.status}</StatusPill><em>↑ {item.votes}</em></span></div><time>2 мин</time></div>)}</div><div className="workspace-insight"><small>СВОДКА</small><strong>Популярные темы</strong><div className="insight-bars"><span style={{ height: '75%' }} /><span style={{ height: '52%' }} /><span style={{ height: '92%' }} /><span style={{ height: '61%' }} /><span style={{ height: '84%' }} /><span style={{ height: '44%' }} /></div><div><i className="dot-violet" />Мобильное приложение <b>28</b></div><div><i className="dot-blue" />Интеграции <b>17</b></div><div><i className="dot-orange" />Экспорт <b>14</b></div></div></div></div>
}

export function LandingPage() {
	return <main className="landing-shell">
		<header className="landing-header site-width"><a className="wordmark" href="#top" aria-label="Slyshno, на главную"><BrandMark /><span>slyshno</span></a><nav className="main-nav" aria-label="Основная навигация"><a href="#product">Продукт</a><a href="#story">Как работает</a><a href="#pricing">Цены</a><a href="#changelog">Чейнджлог</a></nav><div className="header-actions"><a href="#top">Войти</a><LandingAuth mode="header" label="Начать" /></div></header>
		<section className="hero site-width" id="top"><div className="hero-copy"><motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: 'easeOut' }}>Слышать<br /><span>пользователей.</span></motion.h1><motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .07, ease: 'easeOut' }}>Превращайте обратную связь в понятные инсайты, планы и релизы. Один поток — от запроса до результата.</motion.p><div className="hero-actions"><LandingAuth mode="hero" label="Создать доску бесплатно" /><a className="text-link" href="#story">Как это работает <Arrow /></a></div><span className="hero-proof">Для команд, которые создают продукты вместе с пользователями.</span></div><HeroVisual /></section>
		<section className="flow-rail site-width" id="story"><div className="flow-item"><span>01</span><strong>Collect</strong><p>Собирайте обратную связь из разных каналов в одном месте.</p></div><div className="flow-item"><span>02</span><strong>Understand</strong><p>Находите смыслы в запросах с помощью тегов и контекста.</p></div><div className="flow-item"><span>03</span><strong>Plan</strong><p>Превращайте инсайты в понятный план развития.</p></div><div className="flow-item"><span>04</span><strong>Ship</strong><p>Воплощайте в продукт то, что действительно важно.</p></div><div className="flow-item"><span>05</span><strong>Close the loop</strong><p>Сообщайте пользователям о результате и возвращайтесь к началу.</p></div></section>
		<section className="dark-story" id="product"><div className="site-width dark-story-inner"><div className="dark-story-copy"><span className="section-index">PRODUCT / 02</span><h2>Больше, чем<br />просто отзывы.</h2><p>Slyshno помогает увидеть полную картину: что говорят пользователи, почему это важно и что делать дальше.</p><a className="light-button" href="#demo">Посмотреть продукт <Arrow /></a></div><WorkspaceCanvas /></div></section>
		<section className="understand-section site-width"><div className="understand-surface"><div className="understand-copy"><span className="section-index">PEOPLE AT THE CENTER / 03</span><h2>Люди за продуктом.<br />Продукт для людей.</h2><p>Собирайте, обсуждайте, показывайте прогресс. Ваши пользователи — часть пути.</p><a className="dark-text-link" href="#demo">Узнать больше <Arrow /></a></div><div className="floating-comment"><div className="comment-person"><span>Е</span><strong>Елена</strong><small>5 часов назад</small></div><p>Спасибо, что добавили тёмную тему! Выглядит отлично ✨</p><div><span>♡ 12</span><span>Ответить ↗</span></div></div><div className="understand-scribble">Лучшие продукты<br />рождаются в диалоге.</div></div></section>
		<section className="demo-section site-width" id="demo"><div className="demo-intro"><span className="section-index">PUBLIC BOARD / 04</span><h2>Показывайте<br />движение.</h2><p>Публичная доска, роадмап и чейнджлог работают как одна история для вашей команды и клиентов.</p></div><div className="public-board"><div className="public-head"><span><small>МОЙ ПРОДУКТ</small><strong>Что улучшить в продукте?</strong></span><button>+ Новая идея</button></div><div className="public-content"><div className="public-request"><div className="public-vote">↑<b>42</b></div><div><strong>Тёмная тема для виджета</strong><p>Будет здорово, если виджет подстроится под тему сайта.</p><StatusPill tone="violet">В работе</StatusPill></div></div><div className="public-request"><div className="public-vote">↑<b>27</b></div><div><strong>Экспорт идей в CSV</strong><p>Выгружать предложения для анализа в своей системе.</p><StatusPill tone="blue">Запланировано</StatusPill></div></div></div><div className="public-footer"><span>Открытые идеи&nbsp; 18</span><span>Обновлено сегодня</span></div></div></section>
		<section className="pricing-section site-width" id="pricing"><div className="pricing-intro"><span className="section-index">PRICING / 05</span><h2>Начните<br />сейчас.</h2><p>Простые и честные тарифы. Больше возможностей по мере роста.</p><a className="dark-text-link" href="#pricing">Сравнить тарифы <Arrow /></a></div><div className="plans">{plans.map((plan) => <div className={`plan plan-${plan.tone} ${plan.featured ? 'plan-featured' : ''}`} key={plan.name}><div className="plan-art"><span>{plan.name}</span>{plan.featured && <b>Популярный</b>}<i /></div><div className="plan-body"><h3>{plan.title}</h3><p>{plan.description}</p><strong className="plan-price">{plan.price}<small>/ месяц</small></strong><ul>{plan.items.map(item => <li key={item}><span>✓</span>{item}</li>)}</ul><LandingAuth mode="pricing" label="Начать" /></div></div>)}</div></section>
		<section className="final-cta site-width"><div className="final-orb" /><div className="final-cta-copy"><span className="section-index">NEXT STEP / 06</span><h2>Слышать.<br />Понимать.<br />Делать.</h2><p>Начните разговор с пользователями сегодня.</p><LandingAuth mode="hero" label="Создать доску бесплатно" /></div></section>
		<footer className="landing-footer site-width" id="changelog"><a className="wordmark" href="#top"><BrandMark /><span>slyshno</span></a><p>Обратная связь, которой можно управлять.</p><nav><a href="#product">Продукт</a><a href="#story">Как работает</a><a href="#pricing">Цены</a><a href="#top">Войти</a></nav><span className="footer-copy">© 2026 slyshno</span></footer>
	</main>
}
