const withFonts = require('next-fonts')

module.exports = {
	env: {
		NEXT_PUBLIC_URL: process.env.URL || process.env.NEXT_PUBLIC_LOCALHOST_URL,
		NEXT_PUBLIC_DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL || process.env.NEXT_PUBLIC_LOCALHOST_URL,
		NEXT_PUBLIC_DEPLOY_URL: process.env.DEPLOY_URL || process.env.NEXT_PUBLIC_LOCALHOST_URL,
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
	async redirects() {
		return [
			{
				source: 'http://appcentre.co.uk/:path*',
				destination: 'https://www.appcentre.co.uk/:path*',
				permanent: true,
			},
			{
				source: 'http://www.appcentre.co.uk/:path*',
				destination: 'https://www.appcentre.co.uk/:path*',
				permanent: true,
			},
			{
				source: 'https://appcentre.co.uk/:path*',
				destination: 'https://www.appcentre.co.uk/:path*',
				permanent: true,
			},
			{
				source: '/softstore/kerio_connect.php',
				destination: '/kerio-connect',
				permanent: true,
			},
			{
				source: '/softstore/kerio_control.php',
				destination: '/kerio-control',
				permanent: true,
			},
			{
				source: '/softstore/kerio_control_box.php',
				destination: '/kerio-control-box',
				permanent: true,
			},
			{
				source: '/softstore/gfi_unlimited.php',
				destination: '/',
				permanent: false,
			},
			{
				source: '/softstore/login.php',
				destination: '/account?old=1',
				permanent: true,
			},
			{
				source: '/softstore/account.php',
				destination: '/account?old=1',
				permanent: true,
			},
			{
				source: '/softstore/shopping_cart.php',
				destination: '/cart?old=1',
				permanent: true,
			},
			{
				source: '/softstore/:path*',
				destination: '/',
				permanent: true,
			},
		]
	},
}
