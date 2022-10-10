import type QUnit from 'qunit'
import * as lib from '#dist/webapi'
import * as env from './env.js'

// TODO: add missing certificates
const KEYS = {
  RSA: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC9YmaZYpqBfdy\nb6DL37m4L6N+isRpbMPH6Bpymww/scbMj8jXNCA5fx+0CxwPwe4d/E7lDZ6hED+a\n3p42T6H44jacYNWdZus+OkJkariZgbb26siAfOjcqu7Adotqcl5Q1b4Og+gdOopN\n/y5XfmwfP0ovGHhfeR8CWKOgtn1ACoffYc2IQYpbe9M/ieFmGj6h9/TTcbtpxC8V\nJ4Fvl3ENyBh6wQbGJ04wk2MKvGAaU2GzyiZbusAE75leQ//HhN4F4wMo/294m/GZ\nLEfJ6wFEgoyqVPjrtY3auDo+A3wkCus2nlvZStStly0edLaOBv20MR5/lJbVfdBs\nsjP2dZTzAgMBAAECggEAau3TCAzTSu10154kGk3eBgiS6q/fpFcUVouWHe+uWyz9\ndWsTY/1iA0cXM1+4h2f9WxLsjrLWo05PJHkfW3h3xRMFkuWFpCwzsFCx43OpRgCg\nQnNpfxeDfKyAAK3EL6EE298vu7RbVdSq0La6SyC62rSS0pvgQbUj7dyB+n682ac3\n1y5DHwvhJaVQAL3SWunkjdu3aV+HQ0hWLL5PhwJpnqlAyGusyB1ydH709PZ/mw+N\n6sfVvUFSgOCYJLhIVi5h4ORZ4mV3PiJZE4+zPjMNJlT9GqKL6bBcDw5yCUj5cJ9p\no3N3lgrlvKDQ5RcGUWwHpKIxdx0moDwmBl7rJA+2cQKBgQDkqjAkHlQ0SK3CY3jM\njePtwZ9BwLHKh4+pXQ9cBPnxgcE3gKXuGv24qKxHtQ05YhhYtzvyp2qhCDn0gEkj\nZUVnCwYrURoDpwnS/o3xyKJZ6Hk/4O7V3KIZVtyCCTJvjmtIYRNRlyv+DOF4Myca\nKN1+g1T6cJrT5i28+pX6rz8PmQKBgQDaQ9uBQCu83IZkg6CIKm8NskW7UeL71q1x\ngZ8y1P8xd9Kbe5+Fb+m3lrE0ThMcidDA93GTMgQEZGexk99gb7tZ9LNUpNCT4ffw\n8DvKVEgJ7Nb1Zw3Kt015AY7O+iyN8a75mGDy5tH46MfJJXKbVK+7T1uChbzSB9tW\naP6XtXSQawKBgFFncPn6vhla4lj4lpGj1cfXjT2YPvMN7YvqsEQfFWfvvHxo1Sl9\n/GNX0PU6NDoAfRBgMvxAs4oeZptvbBoovFthplGXbr5sIeg2bQvtVDbTtw6RohUK\nlb6VmKzGX2ktd23t+TWrrqKjrUTgWQRMFgYq9P6vRb84C4JiZzA2YSnJAoGBAJPM\nA2WAaJ2YzsBdiWTrJwwlPabcilFySzxjQ8QOC0gaFVkH2ztmTuLsfc4nWDWo9NzW\nMeg0pBe9TaInucj5n+oIEy8r87lP+K8EXdhiPe3KnLzMLcCpYyKfdW6eZXEwyQVm\ns6+HsYNVTYPdgb/BFsZFtHery/KFM3dN3agpTWdFAoGAboOjyeK2hGc41m7fwVCp\nb6kCrYBbVu7aX5t5dDkfB3X+vCnS1FEVQWAEGQIwXUJNPGAXnVqiKrDRlkllQczG\n1QEiqjaK1Tj92lND9iXeGrvk9MJA0pz0vaUxH23Ymp32pKVhA09PCZJQ+qNzLdIO\nH62/k1r030MAfAOHpd4+Hp8=\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwvWJmmWKagX3cm+gy9+5\nuC+jforEaWzDx+gacpsMP7HGzI/I1zQgOX8ftAscD8HuHfxO5Q2eoRA/mt6eNk+h\n+OI2nGDVnWbrPjpCZGq4mYG29urIgHzo3KruwHaLanJeUNW+DoPoHTqKTf8uV35s\nHz9KLxh4X3kfAlijoLZ9QAqH32HNiEGKW3vTP4nhZho+off003G7acQvFSeBb5dx\nDcgYesEGxidOMJNjCrxgGlNhs8omW7rABO+ZXkP/x4TeBeMDKP9veJvxmSxHyesB\nRIKMqlT467WN2rg6PgN8JArrNp5b2UrUrZctHnS2jgb9tDEef5SW1X3QbLIz9nWU\n8wIDAQAB\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIC6jCCAdKgAwIBAgIGAXvykY0oMA0GCSqGSIb3DQEBCwUAMDYxNDAyBgNVBAMM\nK1JKdF82c3UySFRyX0N2ZlBOemJIQjlqTHIwNHdlVkdwci1Nc3RjRWZDZ00wHhcN\nMjEwOTE3MDcwMzUwWhcNMjIwNzE0MDcwMzUwWjA2MTQwMgYDVQQDDCtSSnRfNnN1\nMkhUcl9DdmZQTnpiSEI5akxyMDR3ZVZHcHItTXN0Y0VmQ2dNMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiBnr1cxdQ4WMYivOStLmZJ9VBkwj1N8kszF0\nmRsStbhB5ABAaecFph+khG2Jf+i9WfQn/FKz6lhDpeN+jPruTIWKwO1gburk1ynB\nVVPc7huJttIilfHX1nhpz3zZyxCXgUcUb+16cIKQ/mfwaWvaQtty8VzhQE1Nu50k\nnyq2NFcH/yBXmJWCY6gcgybm0BcVaLKchL11lu8Q50Xx9XFVSex+CjsmNsTnMprC\nkt5I3dgM/Qw4+tlVNPJa9KIRSxyBLiD6lmqygfIx6LY7g89kazPXcAukG025JIv8\nc49qrypD9TqDvAMrU94UeoN8YzOIZ1jPTpMhxBgJ2CgU1MER9QIDAQABMA0GCSqG\nSIb3DQEBCwUAA4IBAQBgGDT7kk5Jtx5WQIu8ofhNCUeCwwcBc9RnUrqv/9Rspq6v\nWd8RNym7BHdXw4rU/tIm+MNq8ZzHh1unEBUtIlTFh4Y/JlIsl55XaIxv9Qyy2ugm\n3DriKp1QWGhgeqm77HDjitt4M4Ldq8J5ToFSurpCS3PEu2gau4SiXJgx3IPpc4hX\nG/J3aHHvZooYIjGget0sBOArIA82Md3+qnchSBSnODvO6yHWQt+rV31er6ZWT6iN\nCmbLSxdNgwqi/rIY9qHo6K/7t6T+R/PQod+NHQM64u+2z1HJJPNNnXVlafzOODvH\nOJHMPzlO6Q8Wa0beAeIsNlUxP7K+PfVFdmdDcDl0\n-----END CERTIFICATE-----',
  },
  P256: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgDWWQhKsBhXz/Nr8s\nTHJPwhW3Ma05i0IRg9xjJBs3pNuhRANCAAR84SJzhOkjOQgf7k9QPiG6yC5Awd9t\nAQNMmDqxX1pqs+0xhMfFT1lvV/Skvr/g5sMalElhCYx05JnXI8VOpTZi\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEfOEic4TpIzkIH+5PUD4husguQMHf\nbQEDTJg6sV9aarPtMYTHxU9Zb1f0pL6/4ObDGpRJYQmMdOSZ1yPFTqU2Yg==\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np\nQXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw\nOTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN\nVWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI\nKoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35\nUH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA\n1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh\nv+A1QWZMuTWqYt+uh/YSRNDn\n-----END CERTIFICATE-----',
  },
  P384: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIG2AgEAMBAGByqGSM49AgEGBSuBBAAiBIGeMIGbAgEBBDBOblIt924xIsUG21PU\nWjXX+5VqUnpc851xnpjRPxouy7LBGnG+w+a1l2hpGUbRlkahZANiAASqB0UFW1tD\nzcZ0aT0eIdapYzTzbnvFuzEBhV3+zHavp4NkWIrkzE4BBbABXqkXAGdi5oqG0DXe\ned6lz6AJK1O6Y0zfATVG+T3LFXzb/dLeibuSphS4DqaiDQvSm/gXLNw=\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEqgdFBVtbQ83GdGk9HiHWqWM08257xbsx\nAYVd/sx2r6eDZFiK5MxOAQWwAV6pFwBnYuaKhtA13nnepc+gCStTumNM3wE1Rvk9\nyxV82/3S3om7kqYUuA6mog0L0pv4Fyzc\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIBmjCCASGgAwIBAgIGAXvyk31cMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK0tL\nSWZVcUthNEZSYVRISVVmVUFSN3ZPSEpIenJlNmFVRnM3Wk9CZGczX3cwHhcNMjEw\nOTE3MDcwNTU3WhcNMjIwNzE0MDcwNTU3WjA2MTQwMgYDVQQDDCtLS0lmVXFLYTRG\nUmFUSElVZlVBUjd2T0hKSHpyZTZhVUZzN1pPQmRnM193MHYwEAYHKoZIzj0CAQYF\nK4EEACIDYgAEXGGo5mGJcpHu9Ib6PaKJURZ8inTKa/yznIqHgNew81bzbyW1wK3e\neEU637aAaHkaf+QwiEuswx4euEQ0U1xdFF8n80KopyHVB5CDXV3hv40Osuwcv2cD\n727puXzxSnWsMAoGCCqGSM49BAMCA2cAMGQCMBaN8kxQ1CUFLBhk7eyxaS6Pljzz\nXcYU0q7Uddbh3nhzfZ8rAZIVBTq7EHJMGsqS4AIwbGliZUob0PzgEXRLwz0nzBGe\nuftbcz40IGAn4bQuKVvzm5+Ivy5syf0odB8ShBh4\n-----END CERTIFICATE-----',
  },
  P521: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBN8YVgYk+smSCRYiD\nJNgQLGBP/BAEy7oU3Kbu8xAyZyOqWO6k1fHyNqyhhGy/2PqBdI3BEttGVasq7SxC\ncTrVlMahgYkDgYYABAG2DXbhthHBTSMgeozGtLhhMz5WPhAbVY/Yx4/fzaOzJ9iI\npsODKjphlKaEDGvPByut2kbGwP3cusNOXleu50PeugE+RIHHBAwxFOx497pTvmLV\nXgYP7WCjwVIdlHXoVdFQfjMZqZXqU/vQbCSMGpA0K+5VtGwmSoF0SnDygsoSpXCL\nLg==\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBtg124bYRwU0jIHqMxrS4YTM+Vj4Q\nG1WP2MeP382jsyfYiKbDgyo6YZSmhAxrzwcrrdpGxsD93LrDTl5XrudD3roBPkSB\nxwQMMRTsePe6U75i1V4GD+1go8FSHZR16FXRUH4zGamV6lP70GwkjBqQNCvuVbRs\nJkqBdEpw8oLKEqVwiy4=\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIB5jCCAUegAwIBAgIGAXvyk+mAMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK0w3\nSUVyWnlyam1jSFVLUW1saFBsbHlHRVNiRU1vUmx0bi1uamdwaTBMU2MwHhcNMjEw\nOTE3MDcwNjI1WhcNMjIwNzE0MDcwNjI1WjA2MTQwMgYDVQQDDCtMN0lFclp5cmpt\nY0hVS1FtbGhQbGx5R0VTYkVNb1JsdG4tbmpncGkwTFNjMIGbMBAGByqGSM49AgEG\nBSuBBAAjA4GGAAQAK8EaImw7EIBX+nAa3F+Ef86spagOysjlq5gIbhghnJalUW5a\nyxUvW53yXISavFQ8vQjr8Rz4FEqk5qR0klULIIYA7gD03P1sZf/Jw2ox2blryu2w\nqFA9x9zqN0c0O8fRVpXUlk0zMLK1aH1+JzTKApSykxgmC0mMx9U+aKO5Cdx1qLUw\nCgYIKoZIzj0EAwIDgYwAMIGIAkIBCjh15sgMfR0VeuIzzK8OK//XreRNQQ7ljILW\n6a38fhoswaIz5r8p68o0xzqx5eTTIfR+1C5F92W6DjoBeJjh3NkCQgHpb2t+0T2z\nw+E5scJQ/jfELHh/wjKV2mClYhjlPhq67jt4OcofENaO81b8amMBV3YhztV+gs1r\ngqI7dS9nJbq5lw==\n-----END CERTIFICATE-----',
  },
  secp256k1: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgN+0/OhaF7QdeNyYnVuFa\n+sAXc6g8knLyqE0pFBEebP6hRANCAATS+klnsy7giILFs9xHhEfNqavUc4BA6n8W\nNJY7fV8WMZRXR8cY6tjv2rQrBuw5ZdlRMg9W5V+K5jiaMwSMrHsv\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE0vpJZ7Mu4IiCxbPcR4RHzamr1HOAQOp/\nFjSWO31fFjGUV0fHGOrY79q0KwbsOWXZUTIPVuVfiuY4mjMEjKx7Lw==\n-----END PUBLIC KEY-----\n',
  },
  Ed25519: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIOcUcmmhP080PCEg3n1MojHqLRVqksuWi/mu6IL3oqcd\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAYPirSLK5RYui0fLnPzF/zohd13Ey7usg/ZwQmyLBkfE=\n-----END PUBLIC KEY-----\n',
  },
  Ed448: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMEcCAQAwBQYDK2VxBDsEOZH8HCMLkTP3rNcQH/ZZsOCUdKPTFDUnfkF9ytoKKE9D\ne27L5gPte5Nw2uvJv3cFPIo+UvBF2ih8Tg==\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMEMwBQYDK2VxAzoAKyg7ZuCoHEcVK/J+IYX82pG2Cn83HDq+Vz1OotlPF6Q2VIrM\n2WCGhydehGrnGieV2ysTfMTTIC6A\n-----END PUBLIC KEY-----\n',
  },
  X25519: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VuBCIEIHDP/1UF43oNuTKvxDY2gNe6gJTPhdYeoXpd+ufNsyFl\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VuAyEACQgvSpBWGONHe9r7+/0z/uUTJgydI/fcWR8REUqqGC4=\n-----END PUBLIC KEY-----\n',
  },
  X448: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMEYCAQAwBQYDK2VvBDoEOFAfUMe2Yxtjg/a8C95o73SU6JsphoyKY8ZupKxKSrzc\ngn37kyK794dhIAFHXES9vLJF5ImOIZ+q\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMEIwBQYDK2VvAzkAiGwV8Vh450I0cq0eEGLNz6SSkSJHbdDZ718xfi57qy816aIW\nW/OYjf111Kyzu/2hnQGseMOXn8U=\n-----END PUBLIC KEY-----\n',
  },
}

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('pem.ts')

  type Vector = [string | string[], string, boolean]
  const algorithms: Vector[] = [
    [['ECDH-ES', 'P-256'], KEYS.P256.certificate, true],
    [['ECDH-ES', 'P-256'], KEYS.P256.privateKey, true],
    [['ECDH-ES', 'P-256'], KEYS.P256.publicKey, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.certificate, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.privateKey, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.publicKey, true],
    [['ECDH-ES', 'P-521'], KEYS.P521.certificate, !env.isDeno],
    [['ECDH-ES', 'P-521'], KEYS.P521.privateKey, !env.isDeno],
    [['ECDH-ES', 'P-521'], KEYS.P521.publicKey, !env.isDeno],
    [['ECDH-ES', 'secp256k1'], KEYS.secp256k1.privateKey, false],
    [['ECDH-ES', 'secp256k1'], KEYS.secp256k1.publicKey, false],
    [['ECDH-ES', 'X25519'], KEYS.X25519.privateKey, env.isDeno],
    [['ECDH-ES', 'X25519'], KEYS.X25519.publicKey, env.isDeno],
    [['ECDH-ES', 'X448'], KEYS.X448.privateKey, false],
    [['ECDH-ES', 'X448'], KEYS.X448.publicKey, false],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.privateKey, env.isWorkers || env.isDeno],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.publicKey, env.isWorkers || env.isDeno],
    [['EdDSA', 'Ed448'], KEYS.Ed448.privateKey, false],
    [['EdDSA', 'Ed448'], KEYS.Ed448.publicKey, false],
    ['ES256', KEYS.P256.certificate, true],
    ['ES256', KEYS.P256.privateKey, true],
    ['ES256', KEYS.P256.publicKey, true],
    ['ES256K', KEYS.secp256k1.privateKey, false],
    ['ES256K', KEYS.secp256k1.publicKey, false],
    ['ES384', KEYS.P384.certificate, true],
    ['ES384', KEYS.P384.privateKey, true],
    ['ES384', KEYS.P384.publicKey, true],
    ['ES512', KEYS.P521.certificate, !env.isDeno],
    ['ES512', KEYS.P521.privateKey, !env.isDeno],
    ['ES512', KEYS.P521.publicKey, !env.isDeno],
    ['PS256', KEYS.RSA.certificate, true],
    ['PS256', KEYS.RSA.privateKey, true],
    ['PS256', KEYS.RSA.publicKey, true],
    ['PS384', KEYS.RSA.certificate, true],
    ['PS384', KEYS.RSA.privateKey, true],
    ['PS384', KEYS.RSA.publicKey, true],
    ['PS512', KEYS.RSA.certificate, true],
    ['PS512', KEYS.RSA.privateKey, true],
    ['PS512', KEYS.RSA.publicKey, true],
    ['RS256', KEYS.RSA.certificate, true],
    ['RS256', KEYS.RSA.privateKey, true],
    ['RS256', KEYS.RSA.publicKey, true],
    ['RS384', KEYS.RSA.certificate, true],
    ['RS384', KEYS.RSA.privateKey, true],
    ['RS384', KEYS.RSA.publicKey, true],
    ['RS512', KEYS.RSA.certificate, true],
    ['RS512', KEYS.RSA.privateKey, true],
    ['RS512', KEYS.RSA.publicKey, true],
    ['RSA-OAEP-256', KEYS.RSA.certificate, true],
    ['RSA-OAEP-256', KEYS.RSA.privateKey, true],
    ['RSA-OAEP-256', KEYS.RSA.publicKey, true],
    ['RSA-OAEP-384', KEYS.RSA.certificate, true],
    ['RSA-OAEP-384', KEYS.RSA.privateKey, true],
    ['RSA-OAEP-384', KEYS.RSA.publicKey, true],
    ['RSA-OAEP-512', KEYS.RSA.certificate, true],
    ['RSA-OAEP-512', KEYS.RSA.privateKey, true],
    ['RSA-OAEP-512', KEYS.RSA.publicKey, true],
    ['RSA-OAEP', KEYS.RSA.certificate, true],
    ['RSA-OAEP', KEYS.RSA.privateKey, true],
    ['RSA-OAEP', KEYS.RSA.publicKey, true],
    ['RSA1_5', KEYS.RSA.certificate, false],
    ['RSA1_5', KEYS.RSA.privateKey, false],
    ['RSA1_5', KEYS.RSA.publicKey, false],
  ]

  function title(alg: string, crv: string | undefined, pem: string, works: boolean) {
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg} `
    if (crv) result += `${crv} `
    result += pem.startsWith('-----BEGIN PRIVATE KEY-----')
      ? 'PKCS8 Private Key Import'
      : pem.startsWith('-----BEGIN PUBLIC KEY-----')
      ? 'SPKI Public Key Import'
      : 'X.509 Certificate Import'
    return result
  }

  for (const vector of algorithms) {
    const [, pem, works] = vector
    let [alg] = vector

    let crv!: string
    if (Array.isArray(alg)) {
      ;[alg, crv] = alg
    }

    let method: typeof lib.importSPKI | typeof lib.importPKCS8 | typeof lib.importX509
    switch (true) {
      case pem.startsWith('-----BEGIN PRIVATE KEY-----'): {
        method = lib.importPKCS8
        break
      }
      case pem.startsWith('-----BEGIN PUBLIC KEY-----'): {
        method = lib.importSPKI
        break
      }
      case pem.startsWith('-----BEGIN CERTIFICATE-----'): {
        method = lib.importX509
        break
      }
      default:
        continue
    }

    const execute = async (t: typeof QUnit.assert) => {
      await method(pem, alg)
      t.ok(1)
    }

    if (works) {
      test(title(alg, crv, pem, works), execute)
    } else {
      test(title(alg, crv, pem, works), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
