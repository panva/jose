const base64url = require('../help/base64url')

const { JWSMissingAlg, JWSInvalidHeader, JWSNoRecipients } = require('../errors')

class Recipients extends Set {
  process (payload, sharedProtectedHeader, sharedUnprotectedHeader) {
    if (!this.size) {
      throw new JWSNoRecipients('JWS needs to have recipients added first')
    }

    return Array.from(this)
      .map((recipient) => {
        return recipient.process(payload, sharedProtectedHeader, sharedUnprotectedHeader)
      })
  }
}

class Recipient {
  constructor (key, protectedHeader, unprotectedHeader) {
    this.key = key

    if (typeof protectedHeader !== 'undefined') {
      this.protectedHeader = protectedHeader
    }

    if (typeof unprotectedHeader !== 'undefined') {
      this.unprotectedHeader = unprotectedHeader
    }
  }

  process (payload, sharedProtectedHeader, sharedUnprotectedHeader) {
    const joseHeader = {
      protected: {
        ...sharedProtectedHeader,
        ...this.protectedHeader
      },
      unprotected: {
        ...sharedUnprotectedHeader,
        ...this.unprotectedHeader
      }
    }
    const unprotectedKeys = new Set(Object.keys(joseHeader.unprotected))

    if (new Set(Object.keys(joseHeader.protected).filter(x => unprotectedKeys.has(x))).size) {
      throw new JWSInvalidHeader('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    const { alg } = { ...joseHeader.protected, ...joseHeader.unprotected }
    if (!alg) {
      throw new JWSMissingAlg('every JOSE header must contain an "alg" parameter')
    }

    if (Object.keys(joseHeader.unprotected).length) {
      this.header = joseHeader.unprotected
    }
    this.protected = base64url.JSON.encode(joseHeader.protected)
    this.signature = base64url.encode(this.key.sign(alg, `${this.protected}.${payload}`))
  }
}

module.exports = { Recipients, Recipient }
