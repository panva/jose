const { randomBytes } = require('crypto')

const { IVLENGTHS } = require('../registry')

module.exports = alg => randomBytes(IVLENGTHS.get(alg) / 8)
