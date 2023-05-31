import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	collection,
	getDocs,
	runTransaction,
	serverTimestamp,
} from 'firebase/firestore'
import { auth, firestore, translateFirebaseError } from './firebaseClient'

// Do the two strings equal each other when converted to uppercase and stripped of whitespace?
function strMatch(str1, str2) {
	return str1?.toUpperCase().replace(/\s/g, '') === str2?.toUpperCase().replace(/\s/g, '')
}

// Do the two address equal each other (ignoring the line2 property) when using the strMatch rules
function sameAddress(address1, address2) {
	if (!strMatch(address1.line1, address2.line1)) {
		return false
	}
	if (!strMatch(address1.city, address2.city)) {
		return false
	}
	if (!strMatch(address1.postal_code, address2.postal_code)) {
		return false
	}
	if (!strMatch(address1.country, address2.country)) {
		return false
	}
	return true
}

/**
 * Function which takes a Firebase user and an address.  If the address is already present in that user
 *
 * @param {firebase.User} user The user to be updated
 * @param {Object} address An address object from Stripe
 * @param {boolean} [isBillingAddress=true] Whether this address is a Stripe billing address or a shipping address - if we add this address, we set it as the default for either billing or shipping (or both if there ar eno other addresses).  This controls which.
 * @returns {void}
 * @throws {Error} Throws on an invalid user object, or on failure to access Firestore
 */
async function asyncUpdateUserWithStripeAddress(user, address, isBillingAddress = true) {
	// Should not be called without a valid user object
	if (!user) {
		throw new Error('Invalid user: ', user)
	}

	// Only interested in valid addresses - not an error, this saves caller having to do validation
	if (!address?.line1 || !address?.city || !address?.postal_code || !address?.country) {
		return
	}

	try {
		// Get a reference to the user's document.
		const userDocRef = doc(firestore, 'users', user.uid)
		// And their addresses subcollection
		const addressesCollectionRef = collection(firestore, 'users', user.uid, 'addresses')

		const addressesSnapshot = await getDocs(addressesCollectionRef)

		// Easy enough if they don't have any addresses at all, set the new address as their only address, and point both billing and shipping addresses at it
		if (addressesSnapshot.size === 0) {
			try {
				await runTransaction(firestore, async (transaction) => {
					const userDocSnap = await transaction.get(userDocRef)

					// Create a new address document
					const newAddressRef = doc(addressesCollectionRef)
					transaction.set(newAddressRef, address)

					// If the user document exists, update it. Otherwise, set it.
					if (userDocSnap.exists()) {
						transaction.update(userDocRef, {
							billingAddress: newAddressRef,
							shippingAddress: newAddressRef,
							updatedAt: serverTimestamp(),
						})
					} else {
						transaction.set(userDocRef, {
							billingAddress: newAddressRef,
							shippingAddress: newAddressRef,
							createdAt: serverTimestamp(),
							updatedAt: serverTimestamp(),
						})
					}
				})

				// We're done with all cases where the address bok was empty, exit function
				return
			} catch (error) {
				console.error('Error when adding address to user who had an empty address book')
				throw error
			}
		}

		// Now handle the more complex cases - we will only have users which have at least one document in their addresses subcollection

		throw new Error('here be dragons')

		const addressArray = addressesSnapshot.docs

		for (const docSnap of addressArray) {
			if (sameAddress(docSnap.data(), address)) {
				break
			}
		}
	} catch (error) {
		// Not much we can do about an error since this is a void function that purely updates firestore, so log it and move on
		console.error(`Error while attempting to update addresses for user id: ${user?.uid} with address:`, address, error)
		return
	}
}

export default asyncUpdateUserWithStripeAddress
