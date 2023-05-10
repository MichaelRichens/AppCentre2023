import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>{}</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
// This is the foxy.io snippet - should be placed just before the </body> - not sure if required so left out for the moment
//<script data-cfasync="false" src="https://cdn.foxycart.com/appcentre/loader.js" async defer></script>

export default MyDocument
