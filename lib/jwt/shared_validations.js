const { JWTClaimInvalid } = require('../errors')

const isNotString = val => typeof val !== 'string' || val.length === 0
const isNotArrayOfStrings = val => !Array.isArray(val) || val.length === 0 || val.some(isNotString)
const isRequired = (Err, value, label, claim) => {
  if (value === undefined) {
    throw new Err(`${label} is missing`, claim, 'missing')
  }
}
const isString = (Err, value, label, claim, required = false) => {
  if (required) {
    isRequired(Err, value, label, claim)
  }

  if (value !== undefined && isNotString(value)) {
    throw new Err(`${label} must be a string`, claim, 'invalid')
  }
}
const isTimestamp = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`, label, 'missing')
  }

  if (value !== undefined && (typeof value !== 'number')) {
    throw new JWTClaimInvalid(`"${label}" claim must be a JSON numeric value`, label, 'invalid')
  }
}
const isStringOrArrayOfStrings = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`, label, 'missing')
  }

  if (value !== undefined && (isNotString(value) && isNotArrayOfStrings(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a string or array of strings`, label, 'invalid')
  }
}

module.exports = {
  isNotArrayOfStrings,
  isRequired,
  isNotString,
  isString,
  isTimestamp,
  isStringOrArrayOfStrings
}
