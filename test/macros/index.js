const { inspect } = require('util')

const base64url = require('../../lib/help/base64url')

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

const compactJwt = (t, jwt, eHeader, ePayload) => {
  let [aHeader, aPayload] = jwt().split('.')
  aHeader = base64url.JSON.decode(aHeader)
  aPayload = base64url.JSON.decode(aPayload)

  t.deepEqual(aHeader, eHeader)
  t.deepEqual(aPayload, ePayload)
}

module.exports.compactJwt = compactJwt
module.exports.hasNoProperties = hasNoProperties
module.exports.hasProperties = hasProperties
module.exports.hasProperty = hasProperty
