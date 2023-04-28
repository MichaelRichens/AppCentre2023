module.exports = {
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.DEPLOY_PRIME_URL ||
      'http://localhost:3000',
    NEXT_NETLIFY_SUBDOMAIN_URL:
      process.env.NEXT_NETLIFY_SUBDOMAIN_URL ||
      process.env.DEPLOY_PRIME_URL ||
      'http://localhost:3000',
    DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/.next' : '',
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
