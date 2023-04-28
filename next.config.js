module.exports = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_NETLIFY_SUBDOMAIN_URL: process.env.NEXT_NETLIFY_SUBDOMAIN_URL,
    DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
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
