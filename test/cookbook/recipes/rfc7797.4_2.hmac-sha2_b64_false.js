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
    }
  },
  output: {
    json: {
      payload: '$.02',
      signatures: [
        {
          protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
          signature: 'A5dxf2s96_n5FLueVuW1Z_vh161FwXZC4YLPff6dmDY'
        }
      ]
    },
    json_flat: {
      payload: '$.02',
      protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
      signature: 'A5dxf2s96_n5FLueVuW1Z_vh161FwXZC4YLPff6dmDY'
    }
  }
}
