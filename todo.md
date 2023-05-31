Firebase - Google Sign In, maybe Microsoft and other too

Firebase

- need to go through both dev and prod projects carefully and configure all templates
- probably need to set up some handler pages as well, eg address verification (will we ever use that?).

There is a testing issue with firebase dev project - have to hardcode test urls in templates, which has been done with localhost, so don;t work when deployed to netlify test branch, no biggy but worth remembering

Stripe - go live and put in STRIPE_WEBHOOK_SIGNING_SECRET, NEXT_PUBLIC_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY values on netlify

Remove testing data displayed in account page

Stripe dispute.created webhook event needs to be handled (or possibly ignored, but need to decide...)

Can I add authentication into any api routes? For ones that need to come from a logged in user, even just checking that a firebase authentication token is valid at all would be well worth doing.

Cache expiry is set to immediate - change when going live

Success page should mre gracefully handle someone who visits it twice - see todo on that page
