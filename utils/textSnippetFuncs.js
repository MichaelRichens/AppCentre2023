export const yearsGen = (years) => `${years} Year${years != 1 ? 's' : ''}`

export const unitRangeGen = (units_from, units_to, unitName) =>
	`${units_from} ${units_to > units_from ? '- ' + units_to : '+'} ${unitName.pluralC}`
