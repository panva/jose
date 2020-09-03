const { getCurves } = require('crypto')

const curves = new Set()

if (getCurves().includes('prime256v1')) {
  curves.add('P-256')
}

if (getCurves().includes('secp256k1')) {
  curves.add('secp256k1')
}

if (getCurves().includes('secp384r1')) {
  curves.add('P-384')
}

if (getCurves().includes('secp521r1')) {
  curves.add('P-521')
}

module.exports = curves
