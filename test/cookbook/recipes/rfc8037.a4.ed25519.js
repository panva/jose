module.exports = {
  title: 'Ed25519 Signature',
  input: {
    payload: Buffer.from('Example of Ed25519 signing'),
    key: {
      kty: 'OKP',
      crv: 'Ed25519',
      d: 'nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A',
      x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo'
    },
    alg: 'EdDSA'
  },
  signing: {
    protected: {
      alg: 'EdDSA'
    }
  },
  output: {
    compact: 'eyJhbGciOiJFZERTQSJ9.RXhhbXBsZSBvZiBFZDI1NTE5IHNpZ25pbmc.hgyY0il_MGCjP0JzlnLWG1PPOt7-09PGcvMg3AIbQR6dWbhijcNR4ki4iylGjg5BhVsPt9g7sVvpAr_MuM0KAg',
    json: {
      payload: 'RXhhbXBsZSBvZiBFZDI1NTE5IHNpZ25pbmc',
      signatures: [
        {
          protected: 'eyJhbGciOiJFZERTQSJ9',
          signature: 'hgyY0il_MGCjP0JzlnLWG1PPOt7-09PGcvMg3AIbQR6dWbhijcNR4ki4iylGjg5BhVsPt9g7sVvpAr_MuM0KAg'
        }
      ]
    },
    json_flat: {
      payload: 'RXhhbXBsZSBvZiBFZDI1NTE5IHNpZ25pbmc',
      protected: 'eyJhbGciOiJFZERTQSJ9',
      signature: 'hgyY0il_MGCjP0JzlnLWG1PPOt7-09PGcvMg3AIbQR6dWbhijcNR4ki4iylGjg5BhVsPt9g7sVvpAr_MuM0KAg'
    }
  }
}
