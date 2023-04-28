module.exports = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_NETLIFY_SUBDOMAIN_URL: process.env.NEXT_NETLIFY_SUBDOMAIN_URL,
    DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/_next' : '',
}
