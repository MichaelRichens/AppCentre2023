import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: process.env.NEXT_PUBLIC_STRIPE_API_VERSION,
})

export { stripe }
