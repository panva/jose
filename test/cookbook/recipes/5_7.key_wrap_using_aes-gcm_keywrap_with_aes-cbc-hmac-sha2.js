module.exports = {
  title: 'Key Wrap using AES-GCM KeyWrap with AES-CBC-HMAC-SHA2',
  reproducible: true,
  input: {
    plaintext: 'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
    key: {
      kty: 'oct',
      kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
      use: 'enc',
      alg: 'A256GCMKW',
      k: 'qC57l_uxcm7Nm3K-ct4GFjx8tM1U8CZ0NLBvdQstiS8'
    },
    alg: 'A256GCMKW',
    enc: 'A128CBC-HS256'
  },
  generated: {
    cek: 'UWxARpat23nL9ReIj4WG3D1ee9I4r-Mv5QLuFXdy_rE',
    iv: 'gz6NjyEFNm_vm8Gj6FwoFQ'
  },
  encrypting_key: {
    iv: 'KkYT0GX_2jHlfqN_',
    encrypted_key: 'lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok',
    tag: 'kfPduVQ3T3H6vnewt--ksw'
  },
  encrypting_content: {
    protected: {
      alg: 'A256GCMKW',
      kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
      tag: 'kfPduVQ3T3H6vnewt--ksw',
      iv: 'KkYT0GX_2jHlfqN_',
      enc: 'A128CBC-HS256'
    },
    protected_b64u: 'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9',
    ciphertext: 'Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU',
    tag: 'DKW7jrb4WaRSNfbXVPlT5g'
  },
  output: {
    compact: 'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9.lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok.gz6NjyEFNm_vm8Gj6FwoFQ.Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU.DKW7jrb4WaRSNfbXVPlT5g',
    json: {
      recipients: [
        {
          encrypted_key: 'lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok'
        }
      ],
      protected: 'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9',
      iv: 'gz6NjyEFNm_vm8Gj6FwoFQ',
      ciphertext: 'Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU',
      tag: 'DKW7jrb4WaRSNfbXVPlT5g'
    },
    json_flat: {
      protected: 'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9',
      encrypted_key: 'lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok',
      iv: 'gz6NjyEFNm_vm8Gj6FwoFQ',
      ciphertext: 'Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU',
      tag: 'DKW7jrb4WaRSNfbXVPlT5g'
    }
  }
}
