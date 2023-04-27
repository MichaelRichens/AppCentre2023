const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // Use the `NEXT_PUBLIC_SITE_URL` environment variable as the asset prefix for production builds
  assetPrefix: isProd ? process.env.NEXT_NETLIFY_SUBDOMAIN_URL : '',
}
