// src/app/api/projects/route.ts
import { boards, projects } from '@/db/schema'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
const schema = z.object({
	name: z.string().min(1, 'Введите название').max(80),
	website: z.string().url().max(200).optional(),
	slug: z
		.string()
		.regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис')
		.max(40)
		.optional()
})

const CYR: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'e',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'c',
	ч: 'ch',
	ш: 'sh',
	щ: 'sch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya'
}

function slugify(name: string) {
	const s = name
		.toLowerCase()
		.split('')
		.map(ch => CYR[ch] ?? ch)
		.join('')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40)
	return s || crypto.randomBytes(4).toString('hex')
}

export async function POST(req: Request) {
	const session = await getSession()
	if (!session)
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

	const parsed = schema.safeParse(await req.json())
	if (!parsed.success)
		return NextResponse.json(
			{ error: parsed.error.issues[0].message },
			{ status: 400 }
		)

	const { name } = parsed.data
	const baseSlug = slugify(name)
	let slug = baseSlug,
		i = 1
	while (
		await db.query.projects.findFirst({
			where: (p, { eq }) => eq(p.slug, slug)
		})
	) {
		slug = `${baseSlug}-${++i}`
	}

	const [project] = await db
		.insert(projects)
		.values({
			name,
			slug,
			ownerId: session.user.id,
			publicKey: crypto.randomBytes(16).toString('hex')
		})
		.returning()

	await db.insert(boards).values({
		projectId: project.id,
		name: 'Предложения',
		slug: 'ideas',
		isDefault: true
	})

	return NextResponse.json(project)
}
