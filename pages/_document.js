import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>{/* Add any additional head tags here */}</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
