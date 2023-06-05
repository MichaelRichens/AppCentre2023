Firebase - Google Sign In, maybe Microsoft and other too

Firebase

- need to go through both dev and prod projects carefully and configure all templates
- probably need to set up some handler pages as well, eg address verification (will we ever use that?).

Stripe - go live and put in STRIPE_WEBHOOK_SIGNING_SECRET, NEXT_PUBLIC_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY values on netlify

Remove testing code allowing reload the reprocess data on success page

Stripe dispute.created webhook event needs to be handled (or possibly ignored, but need to decide...)

Authenticate api routes that access mongodb?

Cache expiry is set to immediate - change when going live

Success page should mre gracefully handle someone who visits it twice - see todo on that page

Handle email address change better than telling user to log out and log back in (pages/account.js)

For testing, will need to configure stripe webhooks to point to public url (which one?)
