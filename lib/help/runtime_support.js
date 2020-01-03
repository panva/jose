const { diffieHellman, KeyObject, sign, verify } = require('crypto')

const [major, minor] = process.version.substr(1).split('.').map(x => parseInt(x, 10))

module.exports = {
  oaepHashSupported: major > 12 || (major === 12 && minor >= 9),
  keyObjectSupported: !!KeyObject && major >= 12,
  edDSASupported: !!sign && !!verify,
  dsaEncodingSupported: major > 13 || (major === 13 && minor >= 2) || (major === 12 && minor >= 16),
  improvedDH: !!diffieHellman
}
