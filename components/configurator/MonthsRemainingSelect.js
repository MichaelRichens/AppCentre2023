import React, { useState, useEffect } from 'react'
import styles from '../../styles/MonthsRemainingSelect.module.css'

const MonthsRemainingSelect = ({ legend, value, onChange, maxYears }) => {
  const [renewalDate, setRenewalDate] = useState('')
  const [notCurrentSelection, setNotCurrentSelection] = useState(false)
  const currentDate = new Date()
  const minDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const maxDate = new Date(
    new Date(currentDate).setFullYear(currentDate.getFullYear() + maxYears)
  )
    .toISOString()
    .slice(0, 10)

  useEffect(() => {
    if (renewalDate) {
      const selectedDate = new Date(renewalDate)
      const yearsDifference =
        selectedDate.getFullYear() - currentDate.getFullYear()
      const monthsDifference = selectedDate.getMonth() - currentDate.getMonth()
      const daysDifference = selectedDate.getDate() - currentDate.getDate()
      const totalMonthsDifference =
        yearsDifference * 12 + monthsDifference - (daysDifference <= 0 ? 1 : 0)
      if (totalMonthsDifference >= 0) {
        const optionValue = Math.floor(totalMonthsDifference / 3) * 0.25 + 0.25
        const syntheticEvent = {
          target: {
            value: optionValue,
          },
        }
        onChange(syntheticEvent)
      }
    }
  }, [renewalDate])

  return (
    <fieldset className={styles.monthsRemaining}>
      <legend>{legend}</legend>
      <label>
        <span>Select Remaining Time:</span>
        <select
          value={value}
          onChange={(event) => {
            onChange(event)
            setNotCurrentSelection(true)
          }}>
          {Array.from({ length: Math.ceil(maxYears * 4) }, (_, index) => {
            const monthEnd = (index + 1) * 3
            const optionValue = (index + 1) * 0.25

            return (
              <option key={index} value={optionValue}>
                {`Less Than ${monthEnd} Months Remaining`}
              </option>
            )
          })}
        </select>
      </label>
      <label>
        <span>Or Choose Renewal Date:</span>
        <input
          type='date'
          value={renewalDate}
          min={minDate}
          max={maxDate}
          className={notCurrentSelection ? styles.notCurrentSelection : ''}
          onChange={(event) => {
            setRenewalDate(event.target.value)
            setNotCurrentSelection(false)
          }}
        />
      </label>
    </fieldset>
  )
}

export default MonthsRemainingSelect
