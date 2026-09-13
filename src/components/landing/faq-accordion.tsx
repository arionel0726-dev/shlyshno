'use client'

import { useState } from 'react'

const ITEMS: { q: string; a: string }[] = [
	{
		q: 'Можно ли пользоваться бесплатно?',
		a: 'Да. Free-тариф создан для маленьких команд и ранних продуктов: публичная доска, роадмап, чейнджлог и до 100 голосов в месяц — без карты.'
	},
	{
		q: 'Что даёт Pro за $10?',
		a: 'Три проекта безлимитно, безлимит голосов, доска на вашем домене и приоритетная поддержка. Без скрытых платежей и «командных» надбавок.'
	},
	{
		q: 'Нужен ли пользователям аккаунт, чтобы оставить фидбек?',
		a: 'Нет. Голосовать и предлагать идеи можно без регистрации — один клик. Это заметно поднимает конверсию.'
	},
	{
		q: 'Можно ли встроить Slyshno в свой продукт?',
		a: 'Да. Один сниппет — и виджет обратной связи живёт на вашем сайте. Пользователи шлют идеи, не уходя со страницы.'
	},
	{
		q: 'Есть ли тёмная тема?',
		a: 'Да, светлая и тёмная темы в приложении и на публичных досках. По умолчанию — системная.'
	},
	{
		q: 'Можно ли перенестись с другого инструмента?',
		a: 'Импорт из Canny и CSV — в ближайшем обновлении. Пока поможем перенести данные вручную — напишите нам.'
	}
]

export function FaqAccordion() {
	const [open, setOpen] = useState<number>(0)

	return (
		<div className="divide-y divide-border rounded-2xl border border-border">
			{ITEMS.map((item, i) => {
				const isOpen = open === i
				return (
					<div key={item.q}>
						<button
							onClick={() => setOpen(isOpen ? -1 : i)}
							className="flex w-full items-center justify-between px-6 py-5 text-left"
						>
							<span className="text-[15px] font-medium text-fg">{item.q}</span>
							<span className="text-xl text-fg-muted">
								{isOpen ? '−' : '+'}
							</span>
						</button>
						{isOpen && (
							<p className="px-6 pb-5 text-sm leading-relaxed text-fg-secondary">
								{item.a}
							</p>
						)}
					</div>
				)
			})}
		</div>
	)
}
