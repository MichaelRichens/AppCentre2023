import React from 'react'
import Page from '../components/page/Page'
import Link from 'next/link'

const Ordering = () => {
	return (
		<Page title='How to Order'>
			<article>
				<section>
					<p>
						We aim to make the process of pricing up and ordering GFI and Kerio products as quick and painless as
						possible. To facilitate this, we have tools on all the product pages on the site which allow you to
						configure a new subscription or a modification to an existing one. You can use one of these to select all
						the details you need for your installation, and it will pick the correct tier pricing for your subscription,
						and give you a total price at the bottom - allowing you to make quick comparisons of different options. When
						you have made a decision, you can add the custom configuration straight to the cart and check it out as an
						order.
					</p>
					<p>
						From the shopping cart, you can also create a link to save/share the configuration(s) currently in your
						cart. Using that link in the future will restore your cart to its current state. Its also an easy way for
						us, if you <Link href='/contact'>contact us</Link> with your requirements, to quickly send you an exact
						quote.
					</p>
					<p>
						For renewals and modifications you can also, in the shopping cart, enter your licence key to link it with
						the configuration - this will help us find your subscription to process the update. If you are not an
						existing customer, we may need to contact you for this information if you do not provide it.
					</p>
					<p>Payment is via credit/debit card with Visa, Mastercard, American Express and Discover accepted.</p>
					<p>
						We are a UK company and are registered for VAT in the UK. Customers outside the UK who are not liable for UK
						VAT can purchase VAT exempt - tax is calculated after you input your address during the checkout process.
						All prices on the website are in pounds sterling (GBP) and are exclusive of VAT. Orders are accepted
						worldwide for software subscriptions, and from Europe for hardware appliances.
					</p>
					<p>Once the order is placed, GFI will need to process it - this normally takes around 2 working days.</p>
					<p>
						Renewal and modifications to existing subscriptions will go live on your server automatically. New licences
						will be emailed out to you. If you order a hardware appliance, please allow 7 - 10 working days for
						delivery.
					</p>
					<p>
						GFI products are licenced on a yearly subscription (multi-year purchases are available). When your
						subscription is due to expire, we will contact you with a quote to renew.
					</p>
					<p>
						We are always very happy to price up a quote for you if you tell us your requirements. If you would like us
						to do so, or have any other questions, please <Link href='/contact'>contact us</Link>.
					</p>
				</section>
			</article>
		</Page>
	)
}

export default Ordering
