import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * Custom hook that checks whether we are allowed to show indications of whether there are items in the cart or not.
 * So the cart widget, the checkout link, that kind of thing.
 * Reason for this is a nasty hack for screwy use-shopping-cart behaviour with clearing the cart after checkout.
 * Manage to hack around the thing to actually clear it, but Chrome on Android will not update the damn cart components to reflect this visually no matter what.
 * This hook can be used by components to tell if they are on the success page and should block display of it.
 *
 * @return {boolean} - Can the cart be displayed or not.
 */
const useAllowCartStatus = () => {
	const router = useRouter()
	const [allowCart, setAllowCart] = useState(router.pathname !== '/success')

	useEffect(() => {
		setAllowCart(router.pathname !== '/success')
	}, [router.pathname])

	return allowCart
}

export default useAllowCartStatus
