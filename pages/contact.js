import React from 'react'
import Page from '../components/page/Page'
import ContactForm from '../components/ContactForm'

import contactStyles from '/styles/Contact.shared.module.css'

const Contact = () => {
	return (
		<Page title='Contact Us'>
			<div className={contactStyles.contactFormAndDetails}>
				<section>
					<h2>Email Us</h2>
					<ContactForm />
				</section>
				<section>
					<h2>Contact Details</h2>
					<div className={contactStyles.contactDetails}>
						<div className={contactStyles.text}>
							<p>
								You can contact us with any queries you have using the email form, or call us during our office hours -
								Monday - Friday, 9am - 5pm.
							</p>
						</div>
						<ul className={contactStyles.details}>
							<li>
								<strong>Telephone:</strong>
								<p>01223 833 412</p>
							</li>
							<li>
								<strong>Email:</strong>
								<p>info@appcentre.co.uk</p>
							</li>
							<li>
								<strong>Address:</strong>
								<p>Unit 5</p>
								<p>South Cambridgeshire Business Park</p>
								<p>Sawston</p>
								<p>Cambridge CB22 3JH</p>
								<p>United Kingdom</p>
							</li>
						</ul>
					</div>
				</section>
			</div>
		</Page>
	)
}

export default Contact
