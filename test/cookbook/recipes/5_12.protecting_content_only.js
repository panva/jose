module.exports = {
  title: 'Protecting Content Only',
  reproducible: true,
  input: {
    plaintext: Buffer.from('You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.'),
    key: {
      kty: 'oct',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      use: 'enc',
      alg: 'A128KW',
      k: 'GZy6sIZ6wl9NJOKB-jnmVQ'
    },
    alg: 'A128KW',
    enc: 'A128GCM'
  },
  generated: {
    cek: 'KBooAFl30QPV3vkcZlXnzQ',
    iv: 'YihBoVOGsR1l7jCD'
  },
  encrypting_key: {
    encrypted_key: '244YHfO_W7RMpQW81UjQrZcq5LSyqiPv'
  },
  encrypting_content: {
    unprotected: {
      alg: 'A128KW',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      enc: 'A128GCM'
    },
    ciphertext: 'qtPIMMaOBRgASL10dNQhOa7Gqrk7Eal1vwht7R4TT1uq-arsVCPaIeFwQfzrSS6oEUWbBtxEasE0vC6r7sphyVziMCVJEuRJyoAHFSP3eqQPb4Ic1SDSqyXjw_L3svybhHYUGyQuTmUQEDjgjJfBOifwHIsDsRPeBz1NomqeifVPq5GTCWFo5k_MNIQURR2Wj0AHC2k7JZfu2iWjUHLF8ExFZLZ4nlmsvJu_mvifMYiikfNfsZAudISOa6O73yPZtL04k_1FI7WDfrb2w7OqKLWDXzlpcxohPVOLQwpA3mFNRKdY-bQz4Z4KX9lfz1cne31N4-8BKmojpw-OdQjKdLOGkC445Fb_K1tlDQXw2sBF',
    tag: 'e2m0Vm7JvjK2VpCKXS-kyg'
  },
  output: {
    json: {
      recipients: [
        {
          encrypted_key: '244YHfO_W7RMpQW81UjQrZcq5LSyqiPv'
        }
      ],
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM'
      },
      iv: 'YihBoVOGsR1l7jCD',
      ciphertext: 'qtPIMMaOBRgASL10dNQhOa7Gqrk7Eal1vwht7R4TT1uq-arsVCPaIeFwQfzrSS6oEUWbBtxEasE0vC6r7sphyVziMCVJEuRJyoAHFSP3eqQPb4Ic1SDSqyXjw_L3svybhHYUGyQuTmUQEDjgjJfBOifwHIsDsRPeBz1NomqeifVPq5GTCWFo5k_MNIQURR2Wj0AHC2k7JZfu2iWjUHLF8ExFZLZ4nlmsvJu_mvifMYiikfNfsZAudISOa6O73yPZtL04k_1FI7WDfrb2w7OqKLWDXzlpcxohPVOLQwpA3mFNRKdY-bQz4Z4KX9lfz1cne31N4-8BKmojpw-OdQjKdLOGkC445Fb_K1tlDQXw2sBF',
      tag: 'e2m0Vm7JvjK2VpCKXS-kyg'
    },
    json_flat: {
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM'
      },
      encrypted_key: '244YHfO_W7RMpQW81UjQrZcq5LSyqiPv',
      iv: 'YihBoVOGsR1l7jCD',
      ciphertext: 'qtPIMMaOBRgASL10dNQhOa7Gqrk7Eal1vwht7R4TT1uq-arsVCPaIeFwQfzrSS6oEUWbBtxEasE0vC6r7sphyVziMCVJEuRJyoAHFSP3eqQPb4Ic1SDSqyXjw_L3svybhHYUGyQuTmUQEDjgjJfBOifwHIsDsRPeBz1NomqeifVPq5GTCWFo5k_MNIQURR2Wj0AHC2k7JZfu2iWjUHLF8ExFZLZ4nlmsvJu_mvifMYiikfNfsZAudISOa6O73yPZtL04k_1FI7WDfrb2w7OqKLWDXzlpcxohPVOLQwpA3mFNRKdY-bQz4Z4KX9lfz1cne31N4-8BKmojpw-OdQjKdLOGkC445Fb_K1tlDQXw2sBF',
      tag: 'e2m0Vm7JvjK2VpCKXS-kyg'
    }
  }
}
