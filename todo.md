Firebase - Google Sign In, maybe Microsoft and other too

Firebase - Set Appcentre.co.uk as authorised domain in Authentication > Templates. Currently set to localhost for testing.

- need to go through both dev and prod projects carefully and configure all templates
- probably need to set up some handler pages as well, eg address verification (will we ever use that?).

There is a testing issue with firebase dev project - have to hardcode test urls in templates, which has been done with localhost, so don;t work when deployed to netlify test branch, no biggy but worth remembering

Mongodb - Create indexes on the orders collection in the production database once there are some documents in it

Stripe - go live and put in STRIPE_WEBHOOK_SIGNING_SECRET, NEXT_PUBLIC_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY values on netlify

work machine: DB_NAME & NEXT_PUBLIC_STRIPE_PUBLIC_KEY - put into env.local. possibly firebase vars as well
definitely:
FIREBASE_SERVICE_ACCOUNT
FIREBASE_PRIVATE_KEY_ID
FIREBASE_PRIVATE_KEY
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
FIREBASE_CLIENT_ID
FIREBASE_CLIENT_CERT_URL

Remove testing data displayed in account page

Stripe dispute.created webhook event needs to be handled (or possibly ignored, but need to decide...)
