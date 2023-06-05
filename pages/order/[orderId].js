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
	const [pdfReady, setPdfReady] = useState(false)
	const [modalIsOpen, setModalIsOpen] = useState(false)

	const modalStyles = getModalBaseStyleObject()
	modalStyles.content.left = '20px'
	modalStyles.content.right = '20px'
	modalStyles.content.top = '20px'
	modalStyles.content.bottom = '20px'
	modalStyles.content.transform = 'initial'
	modalStyles.content.width = 'initial'
	/*{
		right: 'initial',
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		width: 'min(800px, 80vw)',

		backgroundColor: '#fbfbfb',
	}
*/
	useEffect(() => {
		const interval = setInterval(() => {
			if (document.getElementById('orderDetailsContent')) {
				setPdfReady(true)
				clearInterval(interval)
			} else if (document.getElementById('orderNotFound')) {
				clearInterval(interval)
			}
		}, 1000) // check every second

		// Cleanup on unmount
		return () => clearInterval(interval)
	}, [])

	const printDocument = async () => {
		try {
			const input = document.getElementById('orderDetailsContent')
			setModalIsOpen(true)
			input.classList.add(accountStyles.pdfReceipt)
			const canvas = await html2canvas(input, { scale: 1.2 })
			input.classList.remove(accountStyles.pdfReceipt)
			setModalIsOpen(false)
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF()
			pdf.addImage(imgData, 'JPEG', 0, 0)
			pdf.save(`appcentre-receipt${orderId}.pdf`)
		} catch (error) {
			setModalIsOpen(false)
		}
	}

	if (!orderId === null) {
		return <LoadingPage />
	}

	return (
		<Page mainClassName={accountStyles.accountDetailsPage} title='Order Details'>
			<section className={accountStyles.orderDetails}>
				<OrderDetails orderId={orderId} />
				<BusyButton isBusy={!pdfReady || modalIsOpen} onClick={printDocument}>
					Download PDF
				</BusyButton>
			</section>
			<Modal isOpen={modalIsOpen} style={modalStyles}>
				<div>
					<h1>Generating Receipt</h1>
					<LineWave width='100%' height='600' color='#4fa94d' />
				</div>
			</Modal>
		</Page>
	)
}

export default withAuth(Order)
