module.exports = (alg) => {
  switch (alg) {
    case 'RS256':
    case 'PS256':
    case 'HS256':
    case 'ES256':
    case 'ES256K':
      return 'sha256'
    case 'RS384':
    case 'PS384':
    case 'HS384':
    case 'ES384':
      return 'sha384'
    case 'RS512':
    case 'PS512':
    case 'HS512':
    case 'ES512':
      return 'sha512'
  }
}
