import React from 'react'
import { formatPriceFromPounds } from '../utils/formatPrice'
import { yearsGen } from '../utils/textSnippetFuncs'
import priceTableStyles from '/styles/PriceTable.shared.module.css'
import styles from '/styles/PricingTableAppliances.module.css'

const PricingTableAppliances = ({ productName, applianceDataObject, subscriptionDataObject }) => {
	const yearOptions = Object.keys(Object.values(subscriptionDataObject || {})[0] || {}).sort(
		(a, b) => Number(a) < Number(b)
	)

	const numCols = 3 + yearOptions.length

	return (
		<table className={`${priceTableStyles.priceTable} ${styles.applianceTable}`}>
			<caption>
				{`${productName} Pricing (excludes vat)`}
				<small>(Hardware and a subscription required)</small>
			</caption>
			<colgroup>
				<col />
				<col span='2' className={priceTableStyles.hardwarePurchase} />
				<col span={yearOptions.length} className={priceTableStyles.mainSubscription} />
			</colgroup>
			<thead>
				<tr>
					<th scope='col'>Appliances</th>
					<th scope='col'>Hardware Price</th>
					<th scope='col'>Extended Warranty</th>
					{yearOptions.map((year) => (
						<th scope='col' key={year}>{`${yearsGen(year)} Subscription`}</th>
					))}
				</tr>
			</thead>
			{Object.entries(applianceDataObject).map(([subFamily, appliances]) => (
				<tbody key={subFamily}>
					<tr>
						<th scope='rowgroup' colSpan={numCols}>{`${subFamily} Series`}</th>
					</tr>
					{appliances.map((appliance, index) => (
						<tr key={appliance.sku}>
							<th scope='row'>{appliance.name}</th>
							<td>{formatPriceFromPounds(appliance.price, false)}</td>
							<td>{formatPriceFromPounds(appliance.extendedWarranty.price, false)}</td>
							{index === 0 &&
								yearOptions.map((year) => (
									<td key={year} rowSpan={appliances.length > 1 ? appliances.length : undefined}>
										{formatPriceFromPounds(subscriptionDataObject[subFamily][year].price, false)}
									</td>
								))}
						</tr>
					))}
				</tbody>
			))}
		</table>
	)
}

export default PricingTableAppliances
