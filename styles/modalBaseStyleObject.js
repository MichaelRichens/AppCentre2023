const modalBaseStyleObject = {
	overlay: { zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
	content: { maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fbfbfb' },
}

Object.freeze(modalBaseStyleObject.overlay)
Object.freeze(modalBaseStyleObject.content)
Object.freeze(modalBaseStyleObject)

const getModalBaseStyleObject = () => ({
	overlay: { ...modalBaseStyleObject.overlay },
	content: { ...modalBaseStyleObject.content },
})

export { getModalBaseStyleObject }
