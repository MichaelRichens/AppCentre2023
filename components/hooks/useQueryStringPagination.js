import { useRouter } from 'next/router'

/**
 * Custom hook for pagination using query string parameters.
 * Returns the start index and size for pagination and functions to update these values.
 *
 * @param {number} defaultStart - The default start index for pagination if not provided in the query string.
 * @param {number} defaultSize - The default size for pagination if not provided in the query string.
 *
 * @returns {Array} An array that includes:
 *    1. The start index for pagination (or defaultStart if not in query)
 *    2. The size for pagination (or defaultSize if not in query)
 *    3. Function to update the start index in the query string
 *    4. Function to update the size in the query string
 */
function useQueryStringPagination(defaultStart = 0, defaultSize = 10) {
	const router = useRouter()

	const pageStart = parseInt(router.query.start) || defaultStart
	const pageSize = parseInt(router.query.size) || defaultSize

	const setPageStart = (newStart) => {
		if (newStart === defaultStart) {
			delete router.query.start
		} else {
			router.query.start = newStart
		}
		router.push({
			pathname: router.pathname,
			query: router.query,
		})
	}

	const setPageSize = (newSize) => {
		if (newSize === defaultSize) {
			delete router.query.size
		} else {
			router.query.size = newSize
		}
		router.push({
			pathname: router.pathname,
			query: router.query,
		})
	}

	return [pageStart, pageSize, setPageStart, setPageSize]
}

export default useQueryStringPagination
