module.exports = {
  title: 'Including Additional Authenticated Data',
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
    enc: 'A128GCM',
    aad: '["vcard",[["version",{},"text","4.0"],["fn",{},"text","Meriadoc Brandybuck"],["n",{},"text",["Brandybuck","Meriadoc","Mr.",""]],["bday",{},"text","TA 2982"],["gender",{},"text","M"]]]'
  },
  encrypting_content: {
    protected: {
      alg: 'A128KW',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      enc: 'A128GCM'
    }
  },
  output: {
    json: {
      recipients: [
        {
          encrypted_key: '4YiiQ_ZzH76TaIkJmYfRFgOV9MIpnx4X'
        }
      ],
      protected: 'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
      iv: 'veCx9ece2orS7c_N',
      aad: 'WyJ2Y2FyZCIsW1sidmVyc2lvbiIse30sInRleHQiLCI0LjAiXSxbImZuIix7fSwidGV4dCIsIk1lcmlhZG9jIEJyYW5keWJ1Y2siXSxbIm4iLHt9LCJ0ZXh0IixbIkJyYW5keWJ1Y2siLCJNZXJpYWRvYyIsIk1yLiIsIiJdXSxbImJkYXkiLHt9LCJ0ZXh0IiwiVEEgMjk4MiJdLFsiZ2VuZGVyIix7fSwidGV4dCIsIk0iXV1d',
      ciphertext: 'Z_3cbr0k3bVM6N3oSNmHz7Lyf3iPppGf3Pj17wNZqteJ0Ui8p74SchQP8xygM1oFRWCNzeIa6s6BcEtp8qEFiqTUEyiNkOWDNoF14T_4NFqF-p2Mx8zkbKxI7oPK8KNarFbyxIDvICNqBLba-v3uzXBdB89fzOI-Lv4PjOFAQGHrgv1rjXAmKbgkft9cB4WeyZw8MldbBhc-V_KWZslrsLNygon_JJWd_ek6LQn5NRehvApqf9ZrxB4aq3FXBxOxCys35PhCdaggy2kfUfl2OkwKnWUbgXVD1C6HxLIlqHhCwXDG59weHrRDQeHyMRoBljoV3X_bUTJDnKBFOod7nLz-cj48JMx3SnCZTpbQAkFV',
      tag: 'vOaH_Rajnpy_3hOtqvZHRA'
    },
    json_flat: {
      protected: 'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
      encrypted_key: '4YiiQ_ZzH76TaIkJmYfRFgOV9MIpnx4X',
      aad: 'WyJ2Y2FyZCIsW1sidmVyc2lvbiIse30sInRleHQiLCI0LjAiXSxbImZuIix7fSwidGV4dCIsIk1lcmlhZG9jIEJyYW5keWJ1Y2siXSxbIm4iLHt9LCJ0ZXh0IixbIkJyYW5keWJ1Y2siLCJNZXJpYWRvYyIsIk1yLiIsIiJdXSxbImJkYXkiLHt9LCJ0ZXh0IiwiVEEgMjk4MiJdLFsiZ2VuZGVyIix7fSwidGV4dCIsIk0iXV1d',
      iv: 'veCx9ece2orS7c_N',
      ciphertext: 'Z_3cbr0k3bVM6N3oSNmHz7Lyf3iPppGf3Pj17wNZqteJ0Ui8p74SchQP8xygM1oFRWCNzeIa6s6BcEtp8qEFiqTUEyiNkOWDNoF14T_4NFqF-p2Mx8zkbKxI7oPK8KNarFbyxIDvICNqBLba-v3uzXBdB89fzOI-Lv4PjOFAQGHrgv1rjXAmKbgkft9cB4WeyZw8MldbBhc-V_KWZslrsLNygon_JJWd_ek6LQn5NRehvApqf9ZrxB4aq3FXBxOxCys35PhCdaggy2kfUfl2OkwKnWUbgXVD1C6HxLIlqHhCwXDG59weHrRDQeHyMRoBljoV3X_bUTJDnKBFOod7nLz-cj48JMx3SnCZTpbQAkFV',
      tag: 'vOaH_Rajnpy_3hOtqvZHRA'
    }
  }
}
