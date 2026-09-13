import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'

export const alt = 'Slyshno — feedback boards, roadmap, and changelog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
	const webp = await readFile(
		join(process.cwd(), 'public/images/hero-bg.webp')
	)
	// Satori (за ImageResponse) плохо декодирует WebP — конвертируем в PNG.
	const png = await sharp(webp)
		.resize(size.width, size.height, { fit: 'cover' })
		.png()
		.toBuffer()
	const src = `data:image/png;base64,${png.toString('base64')}`

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					position: 'relative',
					backgroundColor: '#0a0a0a'
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={src}
					width={size.width}
					height={size.height}
					style={{ objectFit: 'cover', width: '100%', height: '100%' }}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						background:
							'linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.15) 45%, rgba(10,10,15,0) 70%)',
						padding: '56px 64px'
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14
						}}
					>
						<div
							style={{
								display: 'flex',
								width: 52,
								height: 52,
								borderRadius: 14,
								background: '#fff',
								color: '#111',
								fontSize: 30,
								fontWeight: 700,
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							S
						</div>
						<div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#fff' }}>
							Slyshno
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							marginTop: 18,
							fontSize: 26,
							color: 'rgba(255,255,255,0.85)',
							maxWidth: 820
						}}
					>
						Feedback boards, roadmap, and changelog — in one loop
					</div>
				</div>
			</div>
		),
		{ ...size }
	)
}
