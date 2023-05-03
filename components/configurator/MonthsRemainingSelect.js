import React, { useState, useEffect } from 'react'
import styles from '../../styles/MonthsRemainingSelect.module.css'

const MonthsRemainingSelect = ({ legend, value, onChange, maxYears }) => {
  const [renewalDate, setRenewalDate] = useState(null)
  const currentDate = new Date()
  const minDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
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
    <fieldset>
      <legend>{legend}</legend>
      <div>
        <label htmlFor='renewalDate'>Renewal Date: </label>
        <input
          type='date'
          id='renewalDate'
          value={renewalDate}
          min={minDate}
          onChange={(event) => setRenewalDate(event.target.value)}
        />
      </div>
      <select value={value} onChange={onChange}>
        {Array.from({ length: Math.ceil(maxYears * 4) }, (_, index) => {
          const monthEnd = (index + 1) * 3
          const optionValue = (index + 1) * 0.25

          return (
            <option key={index} value={optionValue}>
              {`Up to ${monthEnd} Months Remaining`}
            </option>
          )
        })}
      </select>
    </fieldset>
  )
}

export default MonthsRemainingSelect
