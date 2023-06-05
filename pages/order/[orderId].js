import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Modal from 'react-modal'
import { LineWave } from 'react-loader-spinner'
import withAuth from '/components/hoc/withAuth'
import Page from '/components/page/Page'
import LoadingPage from '/components/page/LoadingPage'
import OrderDetails from '/components/account/OrderDetails'
import BusyButton from '../../components/BusyButton'

import { getModalBaseStyleObject } from '/styles/modalBaseStyleObject'
import accountStyles from '/styles/Account.shared.module.css'

const Order = () => {
	const router = useRouter()
	const { orderId } = router.query
	const [pdfReady, setPdfReady] = useState(null)
	const [generatingPdf, setGeneratingPdf] = useState(false)

	useEffect(() => {
		const interval = setInterval(() => {
			if (document.getElementById('orderDetailsContent')) {
				setPdfReady(true)
				clearInterval(interval)
			} else if (document.getElementById('orderNotFound')) {
				setPdfReady(false)
				clearInterval(interval)
			}
		}, 200) // check every second

		// Cleanup on unmount
		return () => clearInterval(interval)
	}, [])

	const printDocument = async () => {
		try {
			const input = document.getElementById('orderDetailsContent')
			setGeneratingPdf(true)
			input.classList.add(accountStyles.pdfReceipt)
			const canvas = await html2canvas(input, { scale: 1.2 })
			input.classList.remove(accountStyles.pdfReceipt)
			setGeneratingPdf(false)
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF()
			pdf.addImage(imgData, 'JPEG', 0, 0)
			pdf.save(`AppCentre Receipt - ${orderId}.pdf`)
		} catch (error) {
			setGeneratingPdf(false)
		}
	}

	if (!orderId === null) {
		return <LoadingPage />
	}

	const modalStyles = getModalBaseStyleObject()
	modalStyles.content.left = '20px'
	modalStyles.content.right = '20px'
	modalStyles.content.top = '20px'
	modalStyles.content.bottom = '20px'
	modalStyles.content.transform = 'initial'
	modalStyles.content.width = 'initial'

	return (
		<Page mainClassName={accountStyles.accountDetailsPage} title='Order Details'>
			<section>
				<OrderDetails orderId={orderId} />
				{pdfReady !== false && (
					<BusyButton isBusy={!pdfReady || generatingPdf} onClick={printDocument}>
						Download PDF
					</BusyButton>
				)}
			</section>
			<Modal isOpen={generatingPdf} style={modalStyles}>
				<div>
					<h1>Generating Receipt</h1>
					<LineWave width='100%' height='600' color='#4fa94d' />
				</div>
			</Modal>
		</Page>
	)
}

export default withAuth(Order)
