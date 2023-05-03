import React, { useState, useEffect } from 'react'

const MonthsRemainingSelect = ({ legend, value, onChange, maxYears }) => {
  const [renewalDate, setRenewalDate] = useState(null)
  const currentDate = new Date()
  const minDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  useEffect(() => {
    if (renewalDate) {
      const selectedDate = new Date(renewalDate)
      const monthsDifference =
        Math.ceil((selectedDate - currentDate) / (1000 * 60 * 60 * 24 * 30)) - 1

      if (monthsDifference >= 0) {
        const optionValue = Math.ceil(monthsDifference / 3) * 0.25

        // Create a synthetic event object
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
