module.exports.hasProperty = (t, obj, property, value, assertion = 'is') => {
  t.true(property in obj)
  if (value !== undefined) {
    t[assertion](obj[property], value)
  }
}

module.exports.hasNoProperty = (t, obj, ...properties) => {
  for (const property of new Set(properties)) {
    t.false(property in obj)
  }
}
