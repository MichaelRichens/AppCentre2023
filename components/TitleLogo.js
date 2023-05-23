import React from 'react'

const TitleLogo = ({ logoSvgSrc }) => {
	return logoSvgSrc ? (
		<div className={productInfoStyles.logoContainer}>
			<img src={logoSvgSrc} />
		</div>
	) : null
}

export default TitleLogo
