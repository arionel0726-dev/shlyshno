import crypto from 'crypto'

export function signPayload(raw: string): string {
	return crypto
		.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
		.update(raw)
		.digest('hex')
}

export function webhookRequest(payload: unknown, signature?: string) {
	const raw = JSON.stringify(payload)
	return new Request('http://localhost:3000/api/webhooks/lemonsqueezy', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-signature': signature ?? signPayload(raw)
		},
		body: raw
	})
}
