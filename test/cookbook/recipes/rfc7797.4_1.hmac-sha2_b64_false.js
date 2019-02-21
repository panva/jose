module.exports = {
  title: '"b64"=false compatible with compact serialization',
  reproducible: true,
  input: {
    payload: 'This is the payload string!',
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
    compact: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.This is the payload string!.ciks0B6Hs-amhOqxI5_iG6mPKnMDlWCb7J2Wu7mtIcg',
    json: {
      payload: 'This is the payload string!',
      signatures: [
        {
          protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
          signature: 'ciks0B6Hs-amhOqxI5_iG6mPKnMDlWCb7J2Wu7mtIcg'
        }
      ]
    },
    json_flat: {
      payload: 'This is the payload string!',
      protected: 'eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19',
      signature: 'ciks0B6Hs-amhOqxI5_iG6mPKnMDlWCb7J2Wu7mtIcg'
    }
  }
}
