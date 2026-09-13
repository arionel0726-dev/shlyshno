// check-db.ts
import { config } from 'dotenv'
import postgres from 'postgres'
config({ path: '.env.local' })

const sql = postgres(process.env.DATABASE_URL!)
console.log('URL =', process.env.DATABASE_URL)
const db = await sql`select current_database() as db`
console.log('База:', db[0].db)
const rows =
	await sql`select table_name from information_schema.tables where table_schema = 'public' order by 1`
console.log('Таблицы:', rows.map(r => r.table_name).join(', '))
await sql.end()
