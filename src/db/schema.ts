// db/schema.ts
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core'

export const postStatusEnum = pgEnum('post_status', [
	'pending',
	'reviewing',
	'planned',
	'in_progress',
	'completed',
	'closed'
])

// Проект = рабочее пространство клиента (его продукт)
export const projects = pgTable('projects', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(), // slyshno.com/p/slug
	ownerId: text('owner_id').notNull(), // -> user.id из Better Auth
	publicKey: text('public_key').notNull().unique(), // ключ для виджета
	plan: text('plan').notNull().default('free'), // free | pro
	createdAt: timestamp('created_at').defaultNow().notNull(),
	website: text('website')
})

export const boards = pgTable('boards', {
	id: uuid('id').defaultRandom().primaryKey(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	isDefault: boolean('is_default').default(false)
})

// Карточка фидбека / фичи
export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	boardId: uuid('board_id')
		.notNull()
		.references(() => boards.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	body: text('body'),
	status: postStatusEnum('status').notNull().default('pending'),
	authorId: text('author_id'), // nullable — гости могут постить без аккаунта
	authorEmail: text('author_email'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	completedAt: timestamp('completed_at'),
	type: text('type').notNull().default('feature') // feature | bug
})

// Голос: либо юзер, либо гость по fingerprint — одно из двух
export const votes = pgTable(
	'votes',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		postId: uuid('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		userId: text('user_id'),
		guestKey: text('guest_key'), // fingerprint для виджета без регистрации
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	t => [
		uniqueIndex('vote_user').on(t.postId, t.userId),
		uniqueIndex('vote_guest').on(t.postId, t.guestKey)
	]
)

export const comments = pgTable('comments', {
	id: uuid('id').defaultRandom().primaryKey(),
	postId: uuid('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	authorId: text('author_id'),
	authorEmail: text('author_email'),
	body: text('body').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	authorName: text('author_name')
})

// Кто подписан на уведомления по карточке (проголосовал/прокомментировал/подписался)
export const postSubscriptions = pgTable(
	'post_subscriptions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		postId: uuid('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		email: text('email').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	t => [uniqueIndex('sub_unique').on(t.postId, t.email)]
)

// Очередь писем — вместо внешней очереди
export const outbox = pgTable('outbox', {
	id: uuid('id').defaultRandom().primaryKey(),
	to: text('to').notNull(),
	subject: text('subject').notNull(),
	html: text('html').notNull(),
	attempts: integer('attempts').default(0),
	sentAt: timestamp('sent_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
})

// Чейнджлог
export const changelogPosts = pgTable('changelog_posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	body: text('body').notNull(),
	status: text('status').notNull().default('draft'), // draft | scheduled | published
	publishAt: timestamp('publish_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
})

// Оплата (Lemon Squeezy)
export const subscriptions = pgTable('subscriptions', {
	id: uuid('id').defaultRandom().primaryKey(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	provider: text('provider').notNull().default('lemonsqueezy'),
	customerId: text('customer_id'),
	subscriptionId: text('subscription_id').unique(),
	plan: text('plan').notNull().default('free'),
	status: text('status').notNull().default('active'),
	renewsAt: timestamp('renews_at'),
	endsAt: timestamp('ends_at')
})
