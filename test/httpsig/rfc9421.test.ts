import test from 'ava'

import * as httpsig from '../../src/httpsig.js'
import { importJWK } from '../../src/index.js'

// RFC 9421 signature and Content-Digest values are RFC 8941 Byte Sequences, which use the standard
// base64 alphabet with padding, not base64url.
const b64decode = (input: string) => Uint8Array.from(atob(input), (c) => c.charCodeAt(0))
const b64encode = (input: Uint8Array) => btoa(String.fromCharCode(...input))
// Signature bases are joined with a newline and carry no trailing newline.
const base = (...lines: string[]) => new TextEncoder().encode(lines.join('\n'))

// https://www.rfc-editor.org/info/rfc9421/#appendix-B.1.1
const rsa = {
  kty: 'RSA',
  n: 'hAKYdtoeoy8zcAcR874L8cnZxKzAGwd7v36APp7Pv6Q2jdsPBRrwWEBnez6d0UDKDwGbc6nxfEXAy5mbhgajzrw3MOEt8uA5txSKobBpKDeBLOsdJKFqMGmXCQvEG7YemcxDTRPxAleIAgYYRjTSd_QBwVW9OwNFhekro3RtlinV0a75jfZgkne_YiktSvLG34lw2zqXBDTC5NHROUqGTlML4PlNZS5Ri2U4aCNx2rUPRcKIlE0PuKxI4T-HIaFpv8-rdV6eUgOrB2xeI1dSFFn_nnv5OoZJEIB-VmuKn3DCUcCZSFlQPSXSfBDiUGhwOw76WuSSsf1D4b_vLoJ10w',
  e: 'AQAB',
  d: 'b8lm5JZ2hUduLnq-OAKCSODeWQ7Uqs7eet2bqeuAD0_2po-PG4qhZoo7VwFCUTWlJan9wqdxiAPlbEQKkCdFRcbakbjN2TMJjMCHWL5zfgvqhmgeyKsrqg1wSce97J1_Mkvn3fh6CbqnwNb6bVFDvTJS3i5FzRhKiv6rUsYm8ZAdF4XRaYkFkeuHPl7rc-ruUTSAjC4GovxIxoDJFe0r4kbFmkiZOr40e8RZYK7T1IKrSvzfxx5AjnlK_OZOTCq0L7wBPbMW-IxmQpFCjpI-yuoi3FlZG3LaLNrBMXQF_lLZUDHs77q3fAGxDWwum2hKBfdBuUQtjlqwjQlgXPsskQ',
  p: 'sqeUJmqXE3LP8tYoIjMIAKiTm9o6psPlc8CrLI9CH0UbuaA2JCOMcCNq8SyYbTqgnWlB9ZfcAm_cFpA8tYci9m5vYK8HNxQr-8FS3Qo8N9RJ8d0U5CswDzMYfRghAfUGwmlWj5hp1pQzAuhwbOXFtxKHVsMPhz1IBtF9Y8jvgqgYHLbmyiu1mw',
  q: 'vSlgXQbvHzWmuUBFRHAejRh_naQTDV3GnH4lcRHuFBFZCSLn82xQS2_7xFOqfabqq17kNcvKfzdvWpGxxJ2cILAq0pZS6DmrZlvBU4IkK2ZHCac_XfWVZFh-PrsH_EnVkDpfcYR_iw1F40C1q5w8R6WBHaew3SAp',
  dp: 'aiodZsrWpi8HFfZfeRs8OS_0L5x6WBl3Y9btoZgsIeruc9uZ8NXTIdxaM6FdnyNEyOYA1VH94tDYR-xEt1br1ud_dkPslLV_Aac7d7EaYc7cdkb7oC9t6sphVg0dqE0UTDlOwBxBYMtGmQbJsFzGpmjzVgKqWqJ3B947li2U7t63HXEvKprY2w',
  dq: 'b0DzpSMb5p42dcQgOTU8Mr4S6JOEhRr_YjErMkpaXUEqvZ3jEB9HRmcRi5Gtt4NBiBMiY6V9br8a5gjEpiAQoIUcWokBMAYjEeurU8M6JLBd3YaZVVjISaFmdtynwLFoQxCh6_EC1rSywwrfDpSwO29S9i8Xbaap',
  qi: 'PkbARLOwU_LcZrQy9mmfcPoQlAuCyeu1Q9nH7PYSnbHTFzmiud4Hl8bIXU9a0_58blDoOl3PctF-b4rAEJYUpCODu5PFyN6uEFYRg-YQwpjBMkXk8Eb39128ctARB40Lx8caDhRdTyaEedIG3cQDXSpAl9EOzXkzfx4bZxjAHU9mkMdJwOcMDQ',
}

// https://www.rfc-editor.org/info/rfc9421/#appendix-B.1.2
const rsaPss = {
  kty: 'RSA',
  n: 'r4tmm3r20Wd_PbqvP1s2-QEtvpuRaV8Yq40gjUR8y2Rjxa6dpG2GXHbPfvMs8ct-Lh1GH45x28Rw3Ry53mm-oAXjyQ86OnDkZ5N8lYbggD4O3w6M6pAvLkhk95AndTrifbIFPNU8PPMO7OyrFAHqgDsznjPFmTOtCEcN2Z1FpWgchwuYLPL-Wokqltd11nqqzi-bJ9cvSKADYdUAAN5WUtzdpiy6LbTgSxP7ociU4Tn0g5I6aDZJ7A8Lzo0KSyZYoA485mqcO0GVAdVw9lq4aOT9v6d-nb4bnNkQVklLQ3fVAvJm-xdDOp9LCNCN48V2pnDOkFV6-U9nV5oyc6XI2w',
  e: 'AQAB',
  d: 'lAfIqfpCYomVShfAKnwf2lD9I0wKjkHsCtZCif4kAlwQqqW6N-tIL3bdOR-VWf0Q1ZBIDtpO91UrG7pansyrPERbNrRJlPiYEyPTHkCT1nD-l2isuiyGLNBNnFoKfBgA4KAbPJZQatFIV9Cn34JSHnpN5-2ehreGBYHtkwHFtlmzeF3yu5bqRcqOhx8lkYmBzDAEUFyyXjknU5-WjAT9DzuG0MpOTkcU1EnjnIjyVBZLUB5Lxm8puyq8hH8B_E5LNC-1oc8j-tDy98UvRTTiYvZvs87cGCFxg0LijNhg7CE3g9piNqB6DzMgA9MHSOwcElVtfKdYfo4H3OHZXsSmEQ',
  p: '5V-6ISI5yEaCFXm-fk1EM2xwAWekePVCAyvr9QbTlFOCZwt9WwjUjhtKRusi5Uq-IYZ_tq2WRE4As4b_FHEMtp2AER43IcvmXPqKFBoUktVDS7dThIHrsnRi1U7dHqVdwiMEMe5jxKNgnsKLpnq-4NyhoS6OeWu1SFozG9J9xQk',
  q: 'w-wIde17W5Y0Cphp3ZZ0uM8OUq1AkrV2IKauqYHaDxAT32EM4ci2MMER2nIUEo4g_42lW0zYouFFqONwv0-HyOsgPpdSqKRC5WLgn0VXabjaNcy6KhNPXeJ0AgtqdiDwPeJ2_L_eKwNWQ43RfdQBUquAwSd7SEmmQ8sViqB628M',
  dp: 'otDolkxtJ7Sk8gmRJqZCGx6GAvlGznWJfibXPv6xgUAl-G83dD84YgcNGnoeMxRzEekfDtT5LVMRPF4_AoucsqPqHDyOdfb-dlGBYfOBVxj6w-xF5HE0lV_4J-HrI63Od9fTSn4lY5d1JjyCVJIcnBEAyiD6EUZbUBh23vDzRcE',
  dq: 'iZE1S6CpqmBoQDxOsXGQmaeBdhoCqkDSJhEDuS_dLhBq88FQa0UkcE1QvOK3J2Q21VnfDqGBx7SH1hOFOj-cpz45kNluB832ztxDvnHQ9AIA7h_HY_3VD6YPMNRVN4bfSYS3abdLR0Z7jsmInGJ9X0_fA0E2tkZIgXeas5EFU0M',
  qi: 'jRAqfYi_tKCjhP9eM0N2XaRlNeoYCTx06GlSLD8d0zc4ZZuEePY10LMGWI6Y_JC0CvvvQYhNa9sAj4hFjIVLsWeTplVVUezGO1ofLW4kYWVpnMpHgAY1pRM4kyzo1p3MKYY8DE1BA4KqhSOfhdGs6Ov3Dfj0migZeE7Fu7yc7Fc',
}

// https://www.rfc-editor.org/info/rfc9421/#appendix-B.1.3
const p256 = {
  kty: 'EC',
  crv: 'P-256',
  x: 'qIVYZVLCrPZHGHjP17CTW0_-D9Lfw0EkjqF7xB4FivA',
  y: 'Mc4nN9LTDOBhfoUeg8Ye9WedFRhnZXZJA12Qp0zZ6F0',
  d: 'UpuF81l-kOxbjf7T4mNSv0r5tN67Gim7rnf6EFpcYDs',
}

// https://www.rfc-editor.org/info/rfc9421/#appendix-B.1.4
const ed25519 = {
  kty: 'OKP',
  crv: 'Ed25519',
  x: 'JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs',
  d: 'n4Ni-HpISpVObnQMW0wOhCKROaIKqKtW_2ZYb2p9KcU',
}

// https://www.rfc-editor.org/info/rfc9421/#appendix-B.1.5
const sharedSecret = b64decode(
  'uzvJfB4u3N0Jy4T7NZ75MDVcr8zSTInedJtkgcu46YW4XByzNJjxBdtjUkdJPBtbmHhIDi6pcl8jsasjlTMtDQ==',
)

const pub = ({ d, p, q, dp, dq, qi, ...jwk }: Record<string, string>) => jwk

const contentDigestRequest =
  'sha-512=:WZDPaVn/7XgHaAy8pmojAkGWoRx2UFChF41A2svX+TaPm+AbwAgBWnrIiYllu7BNNyealdVLvRwEmTHWXvJwew==:'
const contentDigestResponse =
  'sha-512=:mEWXIS7MaLRuGgxOBdODa3xqM1XdEvxoYhvlCFJ41QJgJc4GTsPp29l5oGX69wWdXymyU0rjJuahq4l5aGgfLQ==:'

interface Vector {
  section: string
  alg: string
  joseAlg: string
  privateKey: Record<string, string> | Uint8Array
  publicKey: Record<string, string> | Uint8Array
  data: Uint8Array
  signature: string
  octets: number
  /** RSA-PSS and ECDSA are randomized, so a fresh signature will not match the RFC's value. */
  deterministic: boolean
}

const vectors: Vector[] = [
  {
    section: 'B.2.1 sig-b21',
    alg: 'rsa-pss-sha512',
    joseAlg: 'PS512',
    privateKey: rsaPss,
    publicKey: pub(rsaPss),
    data: base(
      '"@signature-params": ();created=1618884473;keyid="test-key-rsa-pss";nonce="b3k2pp5k7z-50gnwp.yemd"',
    ),
    signature:
      'd2pmTvmbncD3xQm8E9ZV2828BjQWGgiwAaw5bAkgibUopemLJcWDy/lkbbHAve4cRAtx31Iq786U7it++wgGxbtRxf8Udx7zFZsckzXaJMkA7ChG52eSkFxykJeNqsrWH5S+oxNFlD4dzVuwe8DhTSja8xxbR/Z2cOGdCbzR72rgFWhzx2VjBqJzsPLMIQKhO4DGezXehhWwE56YCE+O6c0mKZsfxVrogUvA4HELjVKWmAvtl6UnCh8jYzuVG5WSb/QEVPnP5TmcAnLH1g+s++v6d4s8m0gCw1fV5/SITLq9mhho8K3+7EPYTU8IU1bLhdxO5Nyt8C8ssinQ98Xw9Q==',
    octets: 256,
    deterministic: false,
  },
  {
    section: 'B.2.2 sig-b22',
    alg: 'rsa-pss-sha512',
    joseAlg: 'PS512',
    privateKey: rsaPss,
    publicKey: pub(rsaPss),
    data: base(
      '"@authority": example.com',
      `"content-digest": ${contentDigestRequest}`,
      '"@query-param";name="Pet": dog',
      '"@signature-params": ("@authority" "content-digest" "@query-param";name="Pet");created=1618884473;keyid="test-key-rsa-pss";tag="header-example"',
    ),
    signature:
      'LjbtqUbfmvjj5C5kr1Ugj4PmLYvx9wVjZvD9GsTT4F7GrcQEdJzgI9qHxICagShLRiLMlAJjtq6N4CDfKtjvuJyE5qH7KT8UCMkSowOB4+ECxCmT8rtAmj/0PIXxi0A0nxKyB09RNrCQibbUjsLS/2YyFYXEu4TRJQzRw1rLEuEfY17SARYhpTlaqwZVtR8NV7+4UKkjqpcAoFqWFQh62s7Cl+H2fjBSpqfZUJcsIk4N6wiKYd4je2U/lankenQ99PZfB4jY3I5rSV2DSBVkSFsURIjYErOs0tFTQosMTAoxk//0RoKUqiYY8Bh0aaUEb0rQl3/XaVe4bXTugEjHSw==',
    octets: 256,
    deterministic: false,
  },
  {
    section: 'B.2.3 sig-b23',
    alg: 'rsa-pss-sha512',
    joseAlg: 'PS512',
    privateKey: rsaPss,
    publicKey: pub(rsaPss),
    data: base(
      '"date": Tue, 20 Apr 2021 02:07:55 GMT',
      '"@method": POST',
      '"@path": /foo',
      '"@query": ?param=Value&Pet=dog',
      '"@authority": example.com',
      '"content-type": application/json',
      `"content-digest": ${contentDigestRequest}`,
      '"content-length": 18',
      '"@signature-params": ("date" "@method" "@path" "@query" "@authority" "content-type" "content-digest" "content-length");created=1618884473;keyid="test-key-rsa-pss"',
    ),
    signature:
      'bbN8oArOxYoyylQQUU6QYwrTuaxLwjAC9fbY2F6SVWvh0yBiMIRGOnMYwZ/5MR6fb0Kh1rIRASVxFkeGt683+qRpRRU5p2voTp768ZrCUb38K0fUxN0O0iC59DzYx8DFll5GmydPxSmme9v6ULbMFkl+V5B1TP/yPViV7KsLNmvKiLJH1pFkh/aYA2HXXZzNBXmIkoQoLd7YfW91kE9o/CCoC1xMy7JA1ipwvKvfrs65ldmlu9bpG6A9BmzhuzF8Eim5f8ui9eH8LZH896+QIF61ka39VBrohr9iyMUJpvRX2Zbhl5ZJzSRxpJyoEZAFL2FUo5fTIztsDZKEgM4cUA==',
    octets: 256,
    deterministic: false,
  },
  {
    section: 'B.2.4 sig-b24',
    alg: 'ecdsa-p256-sha256',
    joseAlg: 'ES256',
    privateKey: p256,
    publicKey: pub(p256),
    data: base(
      '"@status": 200',
      '"content-type": application/json',
      `"content-digest": ${contentDigestResponse}`,
      '"content-length": 23',
      '"@signature-params": ("@status" "content-type" "content-digest" "content-length");created=1618884473;keyid="test-key-ecc-p256"',
    ),
    signature:
      'wNmSUAhwb5LxtOtOpNa6W5xj067m5hFrj0XQ4fvpaCLx0NKocgPquLgyahnzDnDAUy5eCdlYUEkLIj+32oiasw==',
    octets: 64,
    deterministic: false,
  },
  {
    section: 'B.2.5 sig-b25',
    alg: 'hmac-sha256',
    joseAlg: 'HS256',
    privateKey: sharedSecret,
    publicKey: sharedSecret,
    data: base(
      '"date": Tue, 20 Apr 2021 02:07:55 GMT',
      '"@authority": example.com',
      '"content-type": application/json',
      '"@signature-params": ("date" "@authority" "content-type");created=1618884473;keyid="test-shared-secret"',
    ),
    signature: 'pxcQw6G3AjtMBQjwo8XzkZf/bws5LelbaMk5rGIGtE8=',
    octets: 32,
    deterministic: true,
  },
  {
    section: 'B.2.6 sig-b26',
    alg: 'ed25519',
    joseAlg: 'Ed25519',
    privateKey: ed25519,
    publicKey: pub(ed25519),
    data: base(
      '"date": Tue, 20 Apr 2021 02:07:55 GMT',
      '"@method": POST',
      '"@path": /foo',
      '"@authority": example.com',
      '"content-type": application/json',
      '"content-length": 18',
      '"@signature-params": ("date" "@method" "@path" "@authority" "content-type" "content-length");created=1618884473;keyid="test-key-ed25519"',
    ),
    signature:
      'wqcAqbmYJ2ji2glfAMaRy4gruYYnx2nEFN2HN6jrnDnQCK1u02Gb04v9EDgwUPiu4A0w6vuQv5lIp5WPpBKRCw==',
    octets: 64,
    deterministic: true,
  },
  {
    section: 'B.4 transform',
    alg: 'ed25519',
    joseAlg: 'Ed25519',
    privateKey: ed25519,
    publicKey: pub(ed25519),
    data: base(
      '"@method": GET',
      '"@path": /demo',
      '"@authority": example.org',
      '"accept": application/json, */*',
      '"@signature-params": ("@method" "@path" "@authority" "accept");created=1618884473;keyid="test-key-ed25519"',
    ),
    signature:
      'ZT1kooQsEHpZ0I1IjCqtQppOmIqlJPeo7DHR3SoMn0s5JZ1eRGS0A+vyYP9t/LXlh5QMFFQ6cpLt2m0pmj3NDA==',
    octets: 64,
    deterministic: true,
  },
  {
    // The only rsa-v1_5-sha256 signature value in RFC 9421; Appendix B has none.
    section: '4.3 proxy_sig',
    alg: 'rsa-v1_5-sha256',
    joseAlg: 'RS256',
    privateKey: rsa,
    publicKey: pub(rsa),
    data: base(
      '"@method": POST',
      '"@authority": origin.host.internal.example',
      '"@path": /foo',
      `"content-digest": ${contentDigestRequest}`,
      '"content-type": application/json',
      '"content-length": 18',
      '"forwarded": for=192.0.2.123;host=example.com;proto=https',
      '"@signature-params": ("@method" "@authority" "@path" "content-digest" "content-type" "content-length" "forwarded");created=1618884480;keyid="test-key-rsa";alg="rsa-v1_5-sha256";expires=1618884540',
    ),
    signature:
      'S6ZzPXSdAMOPjN/6KXfXWNO/f7V6cHm7BXYUh3YD/fRad4BCaRZxP+JH+8XY1I6+8Cy+CM5g92iHgxtRPz+MjniOaYmdkDcnL9cCpXJleXsOckpURl49GwiyUpZ10KHgOEe11sx3G2gxI8S0jnxQB+Pu68U9vVcasqOWAEObtNKKZd8tSFu7LB5YAv0RAGhB8tmpv7sFnIm9y+7X5kXQfi8NMaZaA8i2ZHwpBdg7a6CMfwnnrtflzvZdXAsD3LH2TwevU+/PBPv0B6NMNk93wUs/vfJvye+YuI87HU38lZHowtznbLVdp770I6VHR6WfgS9ddzirrswsE1w5o0LV/g==',
    octets: 256,
    deterministic: true,
  },
]

// These primitives take CryptoKey instances, so the RFC's key material is imported first.
const toKey = async (key: Record<string, string> | Uint8Array, joseAlg: string) => {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: `SHA-${joseAlg.slice(2)}` },
      false,
      ['sign', 'verify'],
    )
  }
  return importJWK(key, joseAlg) as Promise<CryptoKey>
}

for (const vector of vectors) {
  test(`${vector.section} (${vector.alg})`, async (t) => {
    const expected = b64decode(vector.signature)
    t.is(expected.byteLength, vector.octets)

    const privateKey = await toKey(vector.privateKey, vector.joseAlg)
    const publicKey = await toKey(vector.publicKey, vector.joseAlg)

    // The RFC's signature verifies, under the registry and the JOSE identifier alike.
    t.true(await httpsig.verify(vector.alg, publicKey, expected, vector.data))
    t.true(await httpsig.verify(vector.joseAlg, publicKey, expected, vector.data))

    // A freshly produced signature verifies too, and for the deterministic algorithms it is the
    // RFC's value byte for byte.
    for (const alg of [vector.alg, vector.joseAlg]) {
      const signature = await httpsig.sign(alg, privateKey, vector.data)
      t.true(signature instanceof Uint8Array)
      t.is(signature.byteLength, vector.octets)
      if (vector.deterministic) {
        t.is(b64encode(signature), vector.signature)
      }
      // The registry identifier and the JOSE identifier are interchangeable.
      t.true(await httpsig.verify(vector.alg, publicKey, signature, vector.data))
      t.true(await httpsig.verify(vector.joseAlg, publicKey, signature, vector.data))
    }

    // A tampered signature base does not verify.
    const tampered = new Uint8Array(vector.data)
    tampered[0] ^= 0x01
    t.false(await httpsig.verify(vector.alg, publicKey, expected, tampered))

    // A tampered signature does not verify.
    const flipped = new Uint8Array(expected)
    flipped[0] ^= 0x01
    t.false(await httpsig.verify(vector.alg, publicKey, flipped, vector.data))
  })
}
