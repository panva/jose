module.exports = {
  title: 'Protecting Content Only',
  reproducible: true,
  input: {
    payload: Buffer.from('It’s a dangerous business, Frodo, going out your door. You step onto the road, and if you don\'t keep your feet, there’s no knowing where you might be swept off to.'),
    key: {
      kty: 'oct',
      kid: '018c0ae5-4d9b-471b-bfd6-eef314bc7037',
      use: 'sig',
      alg: 'HS256',
      k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
    },
    alg: 'HS256'
  },
  signing: {
    unprotected: {
      alg: 'HS256',
      kid: '018c0ae5-4d9b-471b-bfd6-eef314bc7037'
    },
    'sig-input': '.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4gWW91IHN0ZXAgb250byB0aGUgcm9hZCwgYW5kIGlmIHlvdSBkb24ndCBrZWVwIHlvdXIgZmVldCwgdGhlcmXigJlzIG5vIGtub3dpbmcgd2hlcmUgeW91IG1pZ2h0IGJlIHN3ZXB0IG9mZiB0by4',
    sig: 'xuLifqLGiblpv9zBpuZczWhNj1gARaLV3UxvxhJxZuk'
  },
  output: {
    json: {
      payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4gWW91IHN0ZXAgb250byB0aGUgcm9hZCwgYW5kIGlmIHlvdSBkb24ndCBrZWVwIHlvdXIgZmVldCwgdGhlcmXigJlzIG5vIGtub3dpbmcgd2hlcmUgeW91IG1pZ2h0IGJlIHN3ZXB0IG9mZiB0by4',
      signatures: [
        {
          header: {
            alg: 'HS256',
            kid: '018c0ae5-4d9b-471b-bfd6-eef314bc7037'
          },
          signature: 'xuLifqLGiblpv9zBpuZczWhNj1gARaLV3UxvxhJxZuk'
        }
      ]
    },
    json_flat: {
      payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4gWW91IHN0ZXAgb250byB0aGUgcm9hZCwgYW5kIGlmIHlvdSBkb24ndCBrZWVwIHlvdXIgZmVldCwgdGhlcmXigJlzIG5vIGtub3dpbmcgd2hlcmUgeW91IG1pZ2h0IGJlIHN3ZXB0IG9mZiB0by4',
      header: {
        alg: 'HS256',
        kid: '018c0ae5-4d9b-471b-bfd6-eef314bc7037'
      },
      signature: 'xuLifqLGiblpv9zBpuZczWhNj1gARaLV3UxvxhJxZuk'
    }
  }
}
