import { useState } from 'react'

import styles from '/styles/PaginationControl.module.css'

function PaginationControl({ totalSize, qsHook }) {
	const [pageStart, pageSize, setPageStart, setPageSize] = qsHook

	const [exactPage, setExactPage] = useState(Math.floor(pageStart / pageSize) + 1)

	const totalPages = Math.ceil(totalSize / pageSize)

	const handlePageSizeChange = (e) => {
		const newSize = Number(e.target.value)
		setPageSize(newSize)
	}

	const handleExactPageChange = (e) => {
		const newPage = Number(e.target.value)
		setExactPage(newPage)
		setPageStart((newPage - 1) * pageSize)
	}

	const handlePageChange = (offset) => {
		const newStart = Math.min(Math.max(0, pageStart + offset * pageSize), (totalPages - 1) * pageSize)
		setPageStart(newStart)
		setExactPage(Math.floor(newStart / pageSize) + 1)
	}

	const pageSizeChanges = []
	if (totalSize >= 10) {
		pageSizeChanges.push(5)
		pageSizeChanges.push(10)
	}
	if (totalSize > 10) {
		pageSizeChanges.push(20)
	}
	if (totalSize > 20) {
		pageSizeChanges.push(50)
	}
	if (totalSize > 50) {
		pageSizeChanges.push(100)
	}
	if (pageSizeChanges.length && !pageSizeChanges.includes(pageSize)) {
		pageSizeChanges.push(pageSize)
		pageSizeChanges.sort((a, b) => a - b)
	}

	return (
		<div className={styles.paginationControl}>
			<button
				onClick={() => handlePageChange(-100)}
				className={100 * pageSize <= totalSize ? styles.showIfDisabled : ''}
				disabled={pageStart < 100 * pageSize}>
				-100
			</button>
			<button
				onClick={() => handlePageChange(-10)}
				className={10 * pageSize <= totalSize ? styles.showIfDisabled : ''}
				disabled={pageStart < 10 * pageSize}>
				-10
			</button>
			<button onClick={() => handlePageChange(-1)} className={styles.showIfDisabled} disabled={pageStart < pageSize}>
				Prev
			</button>
			<input type='number' min='1' max={totalPages} value={exactPage} onChange={handleExactPageChange} />
			of {totalPages} pages
			<button
				onClick={() => handlePageChange(1)}
				className={styles.showIfDisabled}
				disabled={pageStart + pageSize >= totalSize}>
				Next
			</button>
			<button onClick={() => handlePageChange(10)} disabled={pageStart + 10 * pageSize >= totalSize}>
				+10
			</button>
			<button onClick={() => handlePageChange(100)} disabled={pageStart + 100 * pageSize >= totalSize}>
				+100
			</button>
			{!!pageSizeChanges.length && (
				<select value={pageSize} onChange={handlePageSizeChange}>
					{pageSizeChanges.map((size) => (
						<option key={size} value={size}>
							{size} per page
						</option>
					))}
				</select>
			)}
		</div>
	)
}

export default PaginationControl
