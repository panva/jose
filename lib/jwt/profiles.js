const verify = require('./verify')

module.exports = {
  IdToken: { verify: (token, key, options) => verify(token, key, { ...options, profile: 'id_token' }) },
  LogoutToken: { verify: (token, key, options) => verify(token, key, { ...options, profile: 'logout_token' }) },
  AccessToken: { verify: (token, key, options) => verify(token, key, { ...options, profile: 'at+JWT' }) }
}
