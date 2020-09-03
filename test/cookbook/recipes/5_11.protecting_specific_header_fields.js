module.exports = {
  title: 'Protecting Specific Header Fields',
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
  encrypting_content: {
    protected: {
      enc: 'A128GCM'
    },
    unprotected: {
      alg: 'A128KW',
      kid: '81b20965-8332-43d9-a468-82160ad91ac8'
    }
  },
  output: {
    json: {
      recipients: [
        {
          encrypted_key: 'jJIcM9J-hbx3wnqhf5FlkEYos0sHsF0H'
        }
      ],
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8'
      },
      protected: 'eyJlbmMiOiJBMTI4R0NNIn0',
      iv: 'WgEJsDS9bkoXQ3nR',
      ciphertext: 'lIbCyRmRJxnB2yLQOTqjCDKV3H30ossOw3uD9DPsqLL2DM3swKkjOwQyZtWsFLYMj5YeLht_StAn21tHmQJuuNt64T8D4t6C7kC9OCCJ1IHAolUv4MyOt80MoPb8fZYbNKqplzYJgIL58g8N2v46OgyG637d6uuKPwhAnTGm_zWhqc_srOvgiLkzyFXPq1hBAURbc3-8BqeRb48iR1-_5g5UjWVD3lgiLCN_P7AW8mIiFvUNXBPJK3nOWL4teUPS8yHLbWeL83olU4UAgL48x-8dDkH23JykibVSQju-f7e-1xreHWXzWLHs1NqBbre0dEwK3HX_xM0LjUz77Krppgegoutpf5qaKg3l-_xMINmf',
      tag: 'fNYLqpUe84KD45lvDiaBAQ'
    },
    json_flat: {
      protected: 'eyJlbmMiOiJBMTI4R0NNIn0',
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8'
      },
      encrypted_key: 'jJIcM9J-hbx3wnqhf5FlkEYos0sHsF0H',
      iv: 'WgEJsDS9bkoXQ3nR',
      ciphertext: 'lIbCyRmRJxnB2yLQOTqjCDKV3H30ossOw3uD9DPsqLL2DM3swKkjOwQyZtWsFLYMj5YeLht_StAn21tHmQJuuNt64T8D4t6C7kC9OCCJ1IHAolUv4MyOt80MoPb8fZYbNKqplzYJgIL58g8N2v46OgyG637d6uuKPwhAnTGm_zWhqc_srOvgiLkzyFXPq1hBAURbc3-8BqeRb48iR1-_5g5UjWVD3lgiLCN_P7AW8mIiFvUNXBPJK3nOWL4teUPS8yHLbWeL83olU4UAgL48x-8dDkH23JykibVSQju-f7e-1xreHWXzWLHs1NqBbre0dEwK3HX_xM0LjUz77Krppgegoutpf5qaKg3l-_xMINmf',
      tag: 'fNYLqpUe84KD45lvDiaBAQ'
    }
  }
}
