import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseClient'
import { countryCodeToName } from '../../utils/countryLookup'

import styles from '../../styles/Address.module.css'

const Address = ({ addressRef }) => {
	const [addressData, setAddressData] = useState({})

	useEffect(() => {
		if (!addressRef) {
			console.warn('No address reference passed.')
			return
		}
		let unsubscribe
		try {
			unsubscribe = onSnapshot(addressRef, (docSnap) => {
				if (docSnap.exists()) {
					setAddressData(docSnap.data())
				} else {
					setAddressData({})
				}
			})
		} catch (error) {
			console.warn('Bad address reference.')
			setAddressData({})
			unsubscribe = () => {}
		}

		return () => unsubscribe()
	}, [addressRef])

	return (
		<ul className={styles.address}>
			<li>
				<strong>Address Line 1:</strong> <span>{addressData?.line1}</span>
			</li>
			<li>
				<strong>Address Line 2:</strong> <span>{addressData?.line2}</span>
			</li>
			<li>
				<strong>Town/City:</strong> <span>{addressData?.city}</span>
			</li>
			<li>
				<strong>
					{addressData?.country?.toUpperCase() === 'US' || addressData?.country?.toUpperCase() === 'PH'
						? 'ZIP Code'
						: 'Post Code'}
					:
				</strong>{' '}
				<span>{addressData?.postal_code}</span>
			</li>
			<li>
				<strong>Country:</strong> <span>{countryCodeToName(addressData?.country)}</span>
			</li>
		</ul>
	)
}

export default Address
