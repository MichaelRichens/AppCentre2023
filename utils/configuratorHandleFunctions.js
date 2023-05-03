export const createHandleTypeChange =
  (updateFormData, formData, productData) => (event) => {
    const { value } = event.target
    let userChange = formData.userChange
    if (
      (value === 'new' || value === 'add') &&
      userChange < productData.minUsers
    ) {
      userChange = productData.minUsers
    } else if (
      value === 'sub' &&
      (formData.type === 'new' || formData.type === 'add')
    ) {
      userChange = 0
    }

    let years = formData.years
    if (value === 'sub' || value === 'new') {
      // make sure we have a whole number for years
      years = Math.max(
        productData.minYears,
        Math.min(productData.maxYears, Math.ceil(formData.years))
      )
    }

    updateFormData({
      type: value,
      userChange: userChange,
      years: years,
    })
  }

export const createHandleExistingUsersBlur =
  (updateFormData, formData, productData) => (event) => {
    const { value } = event.target
    let existingUsersError = false
    if (isNaN(value) || value == '') {
      updateFormData({
        existingUsers: productData.minUsers,
      })
      return
    } else {
      let existingUsers = Math.min(
        Math.max(parseInt(event.target.value), 1),
        productData.maxUsers
      )
      if (formData.type === 'sub') {
        const remainder = existingUsers % productData.minUsers
        if (remainder !== 0) {
          existingUsers += productData.minUsers - remainder
          existingUsersError = `Must be renewed in blocks of ${productData.minUsers}.`
        }
      }
      updateFormData({
        existingUsers: existingUsers,
        existingUsersError: existingUsersError,
      })
    }
  }

export const createHandleExistingUsersChange = (updateFormData) => (event) => {
  const { value } = event.target
  if (isNaN(value)) {
    return
  }
  updateFormData({
    existingUsers: value == '' ? '' : parseInt(value),
  })
}

export const createHandleUserChangeChange =
  (updateFormData, formData) => (event) => {
    const { value } = event.target
    if (isNaN(value) && (formData.type != 'sub' || value != '-')) {
      return
    }
    let userChange
    if (value == '' || value == '-') {
      userChange = value
    } else {
      userChange = parseInt(value)
    }
    updateFormData({
      userChange: userChange,
    })
  }

export const createHandleUserChangeBlur =
  (updateFormData, formData, productData) => (event) => {
    const { value } = event.target
    // early exit if NaN entered - not an error, since its probably been left blank, just set to default minimum.
    if (isNaN(value)) {
      updateFormData({
        userChange: formData.type == 'add' ? productData.minUserChange : 0,
      })
      return
    }
    let userChangeError = false
    // Parse the user input as an integer.
    let userChange = !isNaN(parseInt(value)) ? parseInt(value) : 0
    // Calculate the minimum and maximum user change values based on the type of subscription.
    const minUserChange =
      formData.type === 'new' || formData.type === 'add'
        ? productData.minUsers
        : productData.minUsers - formData.existingUsers
    const maxUserChange = productData.maxUsers - formData.existingUsers
    const userChangeBeforeClamp = userChange
    // Clamp the userChange value to be between minUserChange and maxUserChange.
    userChange = Math.min(Math.max(userChange, minUserChange), maxUserChange)
    if (userChange !== userChangeBeforeClamp) {
      if (userChange === minUserChange) {
        userChangeError = `Minimum Allowed Value: ${minUserChange}`
      } else if (userChange == maxUserChange) {
        userChangeError = `Maximum Allowed Value ${maxUserChange}`
      }
    }

    // Calculate the remainder of userChange when divided by productData.minUsers.
    const remainder = userChange % productData.minUsers

    // If the remainder is not 0, it means the userChange value is not divisible by productData.minUsers.
    // Positive remainder means positive number (adding users), negative remainder is removing users.
    if (remainder > 0) {
      userChange += productData.minUsers - remainder
      userChangeError = `Must be changed in steps of ${productData.minUsers}`
    } else if (remainder < 0) {
      userChange -= remainder
      userChangeError = `Must be changed in steps of ${productData.minUsers}`
    }
    updateFormData({
      userChange: userChange,
      userChangeError: userChangeError,
    })
  }

export const createHandleExtensionCheckboxChange =
  (updateFormData, formData) => (event) => {
    const { value, checked } = event.target
    let newCheckedExtensions = [...formData.checkedExtensions]
    if (checked) {
      newCheckedExtensions.push(value)
    } else {
      newCheckedExtensions = newCheckedExtensions.filter(
        (extensionKey) => extensionKey !== value
      )
    }
    updateFormData({ checkedExtensions: newCheckedExtensions })
  }

export const createHandleYearsChange = (updateFormData) => (event) => {
  const { value } = event.target
  const parsedValue = parseFloat(value)
  const finalValue = isNaN(parsedValue) ? value : parsedValue

  updateFormData({
    years: finalValue,
  })
}

export const createHandleMonthsRemainingChange =
  (updateFormData) => (event) => {
    const { value } = event.target
    const parsedValue = parseFloat(value)
    const finalValue = isNaN(parsedValue) ? value : parsedValue
    console.log(finalValue)
    updateFormData({
      years: finalValue,
    })
  }
