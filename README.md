# AppCentre2023

This is a React/Next.js eCommerce site selling GFI business software that I wrote for Second Chance PC Ltd and acquired from them when they ceased trading. The website is live on [appcentre.co.uk](https://www.appcentre.co.uk) but is no longer taking orders. This site went live in 2023, replacing a previous version of the site that had been trading since 2006.

The site uses Stripe for payment processing (in test mode, can be used with card numbers from [here](https://stripe.com/docs/testing#cards)), Firebase for user authentication, Firestore for user data and Mongodb for product data. The site is deployed to Netlify.

The central problem the site addresses is the complicated purchasing options for the GFI software it sells. These products are sold on a per user subscription basis, with tiered pricing, optional extensions, and pro-rata modification of subscriptions between renewal dates. This makes it complex for the end user to price up the software they wish to purchase.

The AppCentre website uses a configuration system where the user enters the details of what they want to purchase into a form, and the site calculates the quote for them and bundles it into a single custom product that can be checked out. It also includes a system to save links to previous configurations so that they can be sent to customers at renewal time, or in response to an enquiry.

The site is designed to be tightly focussed on selling these products in as few steps as possible, and for this reason I implemented it as a completely custom site, rather than using a shopping cart package.
