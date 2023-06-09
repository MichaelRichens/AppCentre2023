import ProductConfiguration from './types/ProductConfiguration'
import { formatPriceFromPounds } from './formatPrice'

/**
 * @function
 * A helper function which returns the inc and ex vat price, when passed an object holding the data from a document in the orders table
 *
 * @warning
 * This function must always be used to extract prices from orders - there are a number of different ways that stripe prices can be interpreted, depending on
 * whether we use their tax functions and whether we deal with different tax jurisdictions.  Since this might change at some point, it could depend on timestamps.
 * Need to keep all the logic for this in one place, and that place is here...
 *
 * @param {Object} orderData - This should be the .data() of a document in the orders table - we use the .line_items and .priceIncVat fields
 * @returns {Object} An object which has .priceEx and .priceInc values, which are Numbers in pounds giving the inc and ex vat prices.  And priceExFormatted and .priceIncFormatted which are strings for user output.  Sets bad values to 'ERROR'
 */
function getOrderPrice(orderData) {
	// get sum of line items.  These are the ex vat prices we generated prior to the order being placed, and what the total we passed to stripe to charge was generated from.
	// We only do free shipping, so not considering that.
	let price = 0
	if (orderData.line_items) {
		for (const key in orderData.line_items) {
			const line = ProductConfiguration.fromRawProperties(orderData.line_items[key])
			orderData.line_items[key] = line
			price += line.price
		}
	}

	price = Math.round(price * 100) / 100 // precision artefacts keep creeping in from somewhere

	// Want both inc and ex vat.  Calculating ex vat by the sum of the line items, and inc by what stripe actually charged
	// This seems the most robust. It allows for us to completely ignore stripes tax calculations and send them the inc vat price
	// and manage vat receipts entirely at our end, or have them do it, without changing logic.  Things will get more complicated if we do customer specific taxes though.
	// There is also an orderData.priceSubTotal field, which if we have told stripe the ex vat price will be different to priceInc
	// (though it also will NOT have any discounts applied if we ever use their discount system)
	const result = {
		priceEx: price,
		priceInc: typeof orderData?.priceInc === 'number' ? orderData.priceInc : 'TBD',
		priceExFormatted: formatPriceFromPounds(price, false),
		priceIncFormatted:
			typeof orderData?.priceInc === 'number' ? formatPriceFromPounds(orderData.priceInc, false) : 'TBD',
	}
	if (result.priceInc !== 'TBD') {
		result.tax = result.priceInc - result.priceEx
		result.taxFormatted = formatPriceFromPounds(result.priceInc - result.priceEx, false)
	} else {
		result.tax = 'TBD'
		result.taxFormatted = 'TBD'
	}

	return result
}

export default getOrderPrice
