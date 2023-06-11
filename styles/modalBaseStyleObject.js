const modalBaseStyleObject = {
	overlay: { zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
	content: {
		right: 'initial',
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
		width: 'min(800px, 80vw)',
		backgroundColor: '#fbfbfb',
		borderRadius: '10px',
	},
}

Object.freeze(modalBaseStyleObject.overlay)
Object.freeze(modalBaseStyleObject.content)
Object.freeze(modalBaseStyleObject)

const getModalBaseStyleObject = () => ({
	overlay: { ...modalBaseStyleObject.overlay },
	content: { ...modalBaseStyleObject.content },
})

export { getModalBaseStyleObject }
