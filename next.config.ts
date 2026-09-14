import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: process.env.VERCEL ? undefined : 'standalone'
}

export default createMDX()(nextConfig)
