/**
 * TableData class is used to manage tabular data with rows and columns, and generate a JSX element from them to go inside an html table.
 * @property {string[] | Set<string>} rows - Array or Set of row names.
 * @property {string[] | Set<string>} columns - Array or Set of column names.
 * @property {string?} topLeft - The text to appear in the top left cell of the table.
 * @method setData(row: string, column: string, value: string) - Sets the data value at the specified row and column.
 * @method getData(row: string, column: string) - Gets the data value at the specified row and column.
 * @method generate Generates a JSX element containing a thead and tbody based on the rows, columns, and data.
 */
class TableData {
	/**
	 * Constructor for the TableData class.
	 * @param {string[] | Set<string>} rows - Array or Set of row names.
	 * @param {string[] | Set<string>} columns - Array or Set of column names.
	 * @param {string?} topLeft - The text to appear in the top left cell of the table.
	 */
	constructor(rows, columns, topLeft = null) {
		this.rows = [...rows]
		this.columns = [...columns]
		this.topLeft = topLeft
		this.data = {}

		// Initialize the data object
		this.rows.forEach((row) => {
			this.data[row] = {}
			this.columns.forEach((column) => {
				this.data[row][column] = ''
			})
		})
	}

	/**
	 * Sets the data value at the specified row and column.
	 * @param {string} row - The row name.
	 * @param {string} column - The column name.
	 * @param {string} value - The value to set.
	 * @throws {Error} If the row or column does not exist.
	 */
	setData(row, column, value) {
		if (!this.rows.includes(row)) {
			throw new Error(`Row "${row}" does not exist.`)
		}

		if (!this.columns.includes(column)) {
			throw new Error(`Column "${column}" does not exist.`)
		}

		this.data[row][column] = value
	}

	/**
	 * Gets the data value at the specified row and column.
	 * @param {string} row - The row name.
	 * @param {string} column - The column name.
	 * @returns {string} The value at the specified row and column.
	 * @throws {Error} If the row or column does not exist.
	 */
	getData(row, column) {
		if (!this.rows.includes(row)) {
			throw new Error(`Row "${row}" does not exist.`)
		}

		if (!this.columns.includes(column)) {
			throw new Error(`Column "${column}" does not exist.`)
		}

		return this.data[row][column]
	}

	/**
	 * Generates a JSX element containing a thead and tbody based on the rows, columns, and data.
	 * @throws {Error} If rows or columns are undefined, empty, or if any data is missing.
	 * @returns {JSX.Element} The generated table structure.
	 */
	generate() {
		if (!this.rows || !this.columns || this.rows.length === 0 || this.columns.length === 0) {
			throw new Error('Rows or columns are undefined or empty.')
		}

		return (
			<>
				<thead>
					<tr>
						<th scope='col'>{this.topLeft || ''}</th>
						{this.columns.map((col, index) => (
							<th key={index} scope='col'>
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{this.rows.map((row, rowIndex) => (
						<tr key={rowIndex}>
							<th scope='row'>{row}</th>
							{this.columns.map((col, colIndex) => {
								const cellData = this.getData(row, col)
								if (cellData === undefined) {
									throw new Error(`Data is missing for row: ${row}, column: ${col}.`)
								}
								return <td key={colIndex}>{cellData}</td>
							})}
						</tr>
					))}
				</tbody>
			</>
		)
	}
}

export default TableData
