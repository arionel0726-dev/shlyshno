import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Отдельная test-база (slyshno_test) на том же dev-постгресе (порт 5435,
// см. AGENTS.md) — тесты не трогают dev-данные и могут идти параллельно
// с `bun dev`.
const TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL ??
	'postgres://slyshno:slyshno_dev@localhost:5435/slyshno_test'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(dirname, './src')
		}
	},
	test: {
		environment: 'node',
		globals: false,
		env: {
			DATABASE_URL: TEST_DATABASE_URL,
			BETTER_AUTH_SECRET: 'test-secret-not-for-production',
			BETTER_AUTH_URL: 'http://localhost:3000',
			NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
			GOOGLE_CLIENT_ID: 'test-client-id',
			GOOGLE_CLIENT_SECRET: 'test-client-secret',
			LEMONSQUEEZY_WEBHOOK_SECRET: 'test-webhook-secret'
		},
		setupFiles: ['./tests/setup.ts'],
		// Тесты бьют в общую test-базу — без параллелизации файлов, чтобы
		// один тест не подчищал данные другого (см. tests/db.ts resetDb()).
		fileParallelism: false
	}
})
