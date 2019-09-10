const { KeyObject, sign, verify } = require('crypto')

const [major, minor] = process.version.substr(1).split('.').map(x => parseInt(x, 10))

module.exports = {
  oaepHashSupported: major > 12 || (major === 12 && minor >= 9),
  keyObjectSupported: !!KeyObject,
  edDSASupported: !!sign && !!verify
}
