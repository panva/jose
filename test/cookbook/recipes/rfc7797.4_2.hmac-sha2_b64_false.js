module.exports = {
  title: '"b64"=false JSON only',
  reproducible: true,
  input: {
    payload: '$.02',
    key: {
      kty: 'oct',
      alg: 'HS256',
      k: 'AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow'
    },
    alg: 'HS256'
  },
  signing: {
    protected: {
      alg: 'HS256',
      b64: false,
      crit: ['b64']
    },
    protected_b64u: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2V9',
    'sig-input': 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2V9.$.02',
    sig: 'GsyM6AQJbQHY8aQKCbZSPJHzMRWo3HKIlcDuXof7nqs'
  },
  output: {
    json: {
      payload: '$.02',
      signatures: [
        {
          protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2V9',
          signature: 'GsyM6AQJbQHY8aQKCbZSPJHzMRWo3HKIlcDuXof7nqs'
        }
      ]
    },
    json_flat: {
      payload: '$.02',
      protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2V9',
      signature: 'GsyM6AQJbQHY8aQKCbZSPJHzMRWo3HKIlcDuXof7nqs'
    }
  }
}
