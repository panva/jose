const { inspect } = require('util')

const hasProperty = (t, obj, property, value, assertion = 'is') => {
  t.true(property in obj)
  if (value !== undefined) {
    t[assertion](obj[property], value)
  }
}

hasProperty.title = (title = '', obj, property, value) => `${title} has property \`${property}\` with value ${inspect(value)}`

const hasNoProperties = (t, obj, ...properties) => {
  t.plan(properties.length)
  for (const property of new Set(properties)) {
    if (property in obj) {
      t.fail(`expected property "${property}" not to be found`)
    } else {
      t.pass()
    }
  }
}
hasNoProperties.title = (title = '', obj, ...properties) => `${title} does not have properties ${properties.map(x => `\`${x}\``).join(', ')}`

const hasProperties = (t, obj, ...properties) => {
  t.plan(properties.length)
  for (const property of new Set(properties)) {
    if (property in obj) {
      t.pass()
    } else {
      t.fail(`expected property "${property}" to be found`)
    }
  }
}
hasProperties.title = (title = '', obj, ...properties) => `${title} has properties ${properties.map(x => `\`${x}\``).join(', ')}`

module.exports.hasProperty = hasProperty
module.exports.hasProperties = hasProperties
module.exports.hasNoProperties = hasNoProperties
