import React from 'react'
import { formatPriceFromPounds } from '../utils/formatPrice'
import { yearsGen } from '../utils/textSnippetFuncs'
import priceTableStyles from '../styles/PriceTable.shared.module.css'
import styles from '../styles/PricingTableAppliances.module.css'

const PricingTableAppliances = ({ productName, applianceDataObject, subscriptionDataObject }) => {
	console.log('applianceDataObject', applianceDataObject)
	console.log('subscriptionDataObject', subscriptionDataObject)

	const yearOptions = Object.keys(Object.values(subscriptionDataObject || {})[0] || {}).sort(
		(a, b) => Number(a) < Number(b)
	)

	const numCols = 3 + yearOptions.length

	return (
		<table className={`${priceTableStyles.priceTable} ${styles.applianceTable}`}>
			<caption>{`${productName} Pricing`}</caption>
			<colgroup>
				<col />
				<col span='2' className={styles.hardware} />
				<col span={yearOptions.length} className={styles.software} />
			</colgroup>
			<thead>
				<tr>
					<th scope='col'>Appliances</th>
					<th scope='col'>Hardware Price</th>
					<th scope='col'>Extended Warranty</th>
					{yearOptions.map((year) => (
						<th key={year}>{`${yearsGen(year)} Subscription`}</th>
					))}
				</tr>
			</thead>
			{Object.entries(applianceDataObject).map(([subFamily, appliances]) => (
				<tbody key={subFamily}>
					<tr>
						<th colSpan={numCols}>{`${subFamily} Series`}</th>
					</tr>
					{appliances.map((appliance) => (
						<tr key={appliance.sku}>
							<th scope='row'>{appliance.name}</th>
							<td>{formatPriceFromPounds(appliance.price)}</td>
							<td>{formatPriceFromPounds(appliance.extendedWarranty.price)}</td>
							{yearOptions.map((year) => (
								<td key={year}>{formatPriceFromPounds(subscriptionDataObject[subFamily][year].price)}</td>
							))}
						</tr>
					))}
				</tbody>
			))}
		</table>
	)
}

export default PricingTableAppliances
