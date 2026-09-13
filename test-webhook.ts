import crypto from 'crypto'
import { config } from 'dotenv'
config({ path: '.env.local' })

const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
const body = JSON.stringify({
	meta: {
		event_name: 'subscription_updated',
		custom_data: { project_id: 'b0f73def-4555-4702-8be4-ca157a3d285d' }
	},
	data: {
		id: 2523581,
		attributes: { customer_id: 9897274, status: 'active' }
	}
})
const sig = crypto.createHmac('sha256', secret).update(body).digest('hex')

const res = await fetch('http://localhost:3000/api/webhooks/lemonsqueezy', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json', 'X-Signature': sig },
	body
})
console.log(res.status, await res.text())
