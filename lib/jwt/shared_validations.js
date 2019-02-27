const isNotString = val => typeof val !== 'string' || val.length === 0

module.exports.isNotString = isNotString
module.exports.isStringOptional = function isStringOptional (Err, value, label) {
  if (value !== undefined && isNotString(value)) {
    throw new Err(`${label} must be a string`)
  }
}
