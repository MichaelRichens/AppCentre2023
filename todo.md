Firebase - Google Sign In, maybe Microsoft and other too

Firebase

- need to go through both dev and prod projects carefully and configure all templates
- probably need to set up some handler pages as well, eg address verification (will we ever use that?).

Authenticate api routes that access mongodb?

Cache expiry is set to immediate - change when going live

Success page should mre gracefully handle someone who visits it twice - see todo on that page

Handle email address change better than telling user to log out and log back in (pages/account.js)

Have some kind of pending status for when customer's arrive back before the webhook update their order?

Control Box specs
https://www.gfi.com/products-and-solutions/network-security-solutions/keriocontrol/resources/documentation/system-requirements

--- Update Gav

1. Contact us page - Can the address / phone etc be beside the contact form rather than below ?

- have done this for higher page widths, with slow collapse into column as page width narrows

2. Appcentre logo looks a little large for me ?

- have reduced size a little at max width, more? Or is it the size at lower page widths that is to big?

3. https://test--ornate-bavarois-e8638d.netlify.app/kerio-connect. "Whether you prefer an on-premises setup or a partner-hosted cloud environment” remove ?

- done

4. Kerio control - bandwidth limitation for each box or max throughput this is more of a limit than users. Might be worth putting in.

- How about putting some specs for the control boxes, which should give an idea of their capability. We don't really emphasise the Unlimited Users thing all that much.

5. Adjust Number of Users by - needs something to tell the user to use a minus sign for reducing user count - I worked it out but some might not. (On all adjust boxes)

- Have reworded the tooltip, does it need anything more?

6. https://test--ornate-bavarois-e8638d.netlify.app/kerio-control-pricing needs to say one year hardware warranty by default ? Or upgrade to 3 year hardware warranty.

- Have put something in the blurb at the top. Does it need more? (Can't fit too much text in the table headers)

7. https://test--ornate-bavarois-e8638d.netlify.app/kerio-control-pricing. Should the 3,2,1 years subscription be the other way round i.e. 1 year nearest the left ??

- Not sure what is meant? The table does have 1 year on the left.

8. Kerio Control Box Pricing (excludes vat) - does this need a sentence or two saying that you need to include box AND subscription for total price ?

- Have expanded Table title

10. What is the difference between Helpdesk fusion and Helpdesk case ? - IDK

GFI HelpDesk Fusion and GFI HelpDesk Case are both helpdesk solutions. Here are the differences between them:

GFI HelpDesk Case:

Integrated support ticket system: It allows for organized tracking and management of customer queries.
Easy collaboration: Facilitates team collaboration on customer issues.
Knowledge base: Provides a library of information that can help answer customer queries.
GFI HelpDesk Fusion:

Includes all the features of GFI HelpDesk Case.
Adds chat functionality: This provides another channel for customers to communicate with the support team (https://www.qbssoftware.fr/en/product/gfi-helpdesk-en/).

(I asked ChatGPT) Honestly if that's all it is, I'm not sure we should make a noise about it.

11. https://test--ornate-bavarois-e8638d.netlify.app/gfi-mailessentials-pricing Last two boxes have switched - showing 250 users first where first boxes show 1-49 first.

- I don't see this issue either. I'm a bit confused by this - you've apparently seen 2 instances of tables appearing with wrong column order. These are bog standard html tables so they shouldn't be jumping around... Technically they are dynamically generated, but the input doesn't change so nor should the output.

12. https://test--ornate-bavarois-e8638d.netlify.app/gfi-languard - what is a NODE ?

- The unit they are priced in...

In the context of network security and IT management software like GFI LanGuard, a "node" typically refers to any device that is connected to the network. This could be a computer, server, printer, or other networked device.

When a product like GFI LanGuard is sold on a per-node basis, it means that the cost of the software is determined by the number of devices it will be used to manage or protect. This kind of licensing model allows businesses to scale their software use according to their specific needs, paying more as they add more devices to their network, and less if they reduce the number of devices.

(Chat GPT again) I can add this in if you want?
