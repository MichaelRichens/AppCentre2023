import React from 'react'

const Footer = () => {
	return (
		<footer>
			<div id='footerInnerWrapper'>
				<small>
					© 2006 - {new Date().getFullYear()} AppCentre. AppCentre is a part of{' '}
					<a href='https://www.macupgrades.co.uk/store/' target='_blank' rel='noopener noreferrer'>
						MacUpgrades
					</a>{' '}
					/ Second Chance PC Ltd. Company number 4331031. Registered for VAT GB 783705210.
				</small>
			</div>
		</footer>
	)
}

export default Footer
