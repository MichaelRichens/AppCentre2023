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
						possible. To facilitate this, we have product configurators on all the product pages on the site. Select all
						the details you need for your installation, and it will pick the correct tier pricing for your subscription,
						and give you a total price at the bottom. Add that to your cart, and you can check the order out.
					</p>
					<p>
						From the shopping cart, you can also create a link to save/share the items currently in your cart. Using
						that link in the future will restore your cart to its current state.
					</p>
					<p>Payment is via credit/debit card with Visa, Mastercard, American Express and Discover accepted.</p>
					<p>
						UK VAT is charged on all UK orders and a VAT receipt is provided. Customers outside the UK who are not
						liable for UK VAT can purchase VAT exempt - tax is calculated after you input your address during the
						checkout process. All prices on the website are in GBP and are exclusive of VAT. Orders are accepted
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
						If you have any questions, please <Link href='/contact'>contact us</Link>.
					</p>
				</section>
			</article>
		</Page>
	)
}

export default Ordering
