This is a React/Next.js eCommerce site selling GFI business software that I wrote for Second Chance PC Ltd and acquired from them when they ceased trading. The website is live on (appcentre.co.uk)[https://www.appcentre.co.uk] but is no longer trading.

The site uses Stripe for payment processing (not live), Firebase for user authentication, Firestore for user data and Mongodb for product data. The site is deployed to Netlify.

The central problem the site addresses is the complicated purchasing options for GFI software. These products are sold on a per user subscription basis, with tiered pricing, optional extensions, and pro-rata modification of subscriptions between renewal dates. This makes it complex for the end user to price up the software.

The AppCentre website uses a configuration system where the user enters the details of what they want to purchase into a form, and the site calculates the quote for them and bundles it into a single custom product that can be purchased. It also includes a system to save links to previous configurations so that they can be sent to customers at renewal time or in response to an enquiry.
