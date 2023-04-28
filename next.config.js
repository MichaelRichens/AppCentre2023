module.exports = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_DEPLOY_PRIME_URL:
      process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
    NEXT_PUBLIC_DEPLOY_URL: process.env.DEPLOY_URL || 'http://localhost:3000',
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
