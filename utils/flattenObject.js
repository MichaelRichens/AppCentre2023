export default function flattenObject(obj, prefix = '') {
	return Object.keys(obj).reduce((acc, k) => {
		const pre = prefix.length ? prefix + '.' : ''
		if (typeof obj[k] === 'object') {
			Object.assign(acc, flattenObject(obj[k], pre + k))
		} else {
			acc[pre + k] = String(obj[k])
		}
		return acc
	}, {})
}
