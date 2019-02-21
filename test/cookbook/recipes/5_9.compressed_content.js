module.exports = {
  title: 'Compressed Content',
  reproducible: true,
  input: {
    plaintext: 'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
    key: {
      kty: 'oct',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      use: 'enc',
      alg: 'A128KW',
      k: 'GZy6sIZ6wl9NJOKB-jnmVQ'
    },
    alg: 'A128KW',
    enc: 'A128GCM',
    zip: 'DEF'
  },
  encrypting_content: {
    protected: {
      alg: 'A128KW',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      enc: 'A128GCM',
      zip: 'DEF'
    }
  },
  output: {
    compact: 'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0.5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi.p9pUq6XHY0jfEZIl.HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw.VILuUwuIxaLVmh5X-T7kmA',
    json: {
      recipients: [
        {
          encrypted_key: '5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi'
        }
      ],
      protected: 'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0',
      iv: 'p9pUq6XHY0jfEZIl',
      ciphertext: 'HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw',
      tag: 'VILuUwuIxaLVmh5X-T7kmA'
    },
    json_flat: {
      protected: 'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0',
      encrypted_key: '5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi',
      iv: 'p9pUq6XHY0jfEZIl',
      ciphertext: 'HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw',
      tag: 'VILuUwuIxaLVmh5X-T7kmA'
    }
  }
}
