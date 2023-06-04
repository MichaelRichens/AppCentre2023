const withFonts = require('next-fonts')

module.exports = {
	env: {
		NEXT_PUBLIC_URL: process.env.URL || process.env.LOCALHOST_URL,
		NEXT_PUBLIC_DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL || process.env.LOCALHOST_URL,
		NEXT_PUBLIC_DEPLOY_URL: process.env.DEPLOY_URL || process.env.LOCALHOST_URL,
		NEXT_PUBLIC_CURRENCY_LC: process.env.NEXT_PUBLIC_CURRENCY_UC.toLowerCase(),
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=0, must-revalidate',
					},
				],
			},
		]
	},
}
