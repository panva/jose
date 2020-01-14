const isNotString = val => typeof val !== 'string' || val.length === 0

module.exports.isNotString = isNotString
module.exports.isString = function isString (Err, value, label, claim, required = false) {
  if (required && value === undefined) {
    throw new Err(`${label} is missing`, claim, 'missing')
  }

  if (value !== undefined && isNotString(value)) {
    throw new Err(`${label} must be a string`, claim, 'invalid')
  }
}
