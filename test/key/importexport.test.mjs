import test from 'ava'
import { conditional, keyRoot } from '../dist.mjs'

const jose = await import(keyRoot)

const keys = {
  rsa: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC9YmaZYpqBfdy\nb6DL37m4L6N+isRpbMPH6Bpymww/scbMj8jXNCA5fx+0CxwPwe4d/E7lDZ6hED+a\n3p42T6H44jacYNWdZus+OkJkariZgbb26siAfOjcqu7Adotqcl5Q1b4Og+gdOopN\n/y5XfmwfP0ovGHhfeR8CWKOgtn1ACoffYc2IQYpbe9M/ieFmGj6h9/TTcbtpxC8V\nJ4Fvl3ENyBh6wQbGJ04wk2MKvGAaU2GzyiZbusAE75leQ//HhN4F4wMo/294m/GZ\nLEfJ6wFEgoyqVPjrtY3auDo+A3wkCus2nlvZStStly0edLaOBv20MR5/lJbVfdBs\nsjP2dZTzAgMBAAECggEAau3TCAzTSu10154kGk3eBgiS6q/fpFcUVouWHe+uWyz9\ndWsTY/1iA0cXM1+4h2f9WxLsjrLWo05PJHkfW3h3xRMFkuWFpCwzsFCx43OpRgCg\nQnNpfxeDfKyAAK3EL6EE298vu7RbVdSq0La6SyC62rSS0pvgQbUj7dyB+n682ac3\n1y5DHwvhJaVQAL3SWunkjdu3aV+HQ0hWLL5PhwJpnqlAyGusyB1ydH709PZ/mw+N\n6sfVvUFSgOCYJLhIVi5h4ORZ4mV3PiJZE4+zPjMNJlT9GqKL6bBcDw5yCUj5cJ9p\no3N3lgrlvKDQ5RcGUWwHpKIxdx0moDwmBl7rJA+2cQKBgQDkqjAkHlQ0SK3CY3jM\njePtwZ9BwLHKh4+pXQ9cBPnxgcE3gKXuGv24qKxHtQ05YhhYtzvyp2qhCDn0gEkj\nZUVnCwYrURoDpwnS/o3xyKJZ6Hk/4O7V3KIZVtyCCTJvjmtIYRNRlyv+DOF4Myca\nKN1+g1T6cJrT5i28+pX6rz8PmQKBgQDaQ9uBQCu83IZkg6CIKm8NskW7UeL71q1x\ngZ8y1P8xd9Kbe5+Fb+m3lrE0ThMcidDA93GTMgQEZGexk99gb7tZ9LNUpNCT4ffw\n8DvKVEgJ7Nb1Zw3Kt015AY7O+iyN8a75mGDy5tH46MfJJXKbVK+7T1uChbzSB9tW\naP6XtXSQawKBgFFncPn6vhla4lj4lpGj1cfXjT2YPvMN7YvqsEQfFWfvvHxo1Sl9\n/GNX0PU6NDoAfRBgMvxAs4oeZptvbBoovFthplGXbr5sIeg2bQvtVDbTtw6RohUK\nlb6VmKzGX2ktd23t+TWrrqKjrUTgWQRMFgYq9P6vRb84C4JiZzA2YSnJAoGBAJPM\nA2WAaJ2YzsBdiWTrJwwlPabcilFySzxjQ8QOC0gaFVkH2ztmTuLsfc4nWDWo9NzW\nMeg0pBe9TaInucj5n+oIEy8r87lP+K8EXdhiPe3KnLzMLcCpYyKfdW6eZXEwyQVm\ns6+HsYNVTYPdgb/BFsZFtHery/KFM3dN3agpTWdFAoGAboOjyeK2hGc41m7fwVCp\nb6kCrYBbVu7aX5t5dDkfB3X+vCnS1FEVQWAEGQIwXUJNPGAXnVqiKrDRlkllQczG\n1QEiqjaK1Tj92lND9iXeGrvk9MJA0pz0vaUxH23Ymp32pKVhA09PCZJQ+qNzLdIO\nH62/k1r030MAfAOHpd4+Hp8=\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwvWJmmWKagX3cm+gy9+5\nuC+jforEaWzDx+gacpsMP7HGzI/I1zQgOX8ftAscD8HuHfxO5Q2eoRA/mt6eNk+h\n+OI2nGDVnWbrPjpCZGq4mYG29urIgHzo3KruwHaLanJeUNW+DoPoHTqKTf8uV35s\nHz9KLxh4X3kfAlijoLZ9QAqH32HNiEGKW3vTP4nhZho+off003G7acQvFSeBb5dx\nDcgYesEGxidOMJNjCrxgGlNhs8omW7rABO+ZXkP/x4TeBeMDKP9veJvxmSxHyesB\nRIKMqlT467WN2rg6PgN8JArrNp5b2UrUrZctHnS2jgb9tDEef5SW1X3QbLIz9nWU\n8wIDAQAB\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIC6jCCAdKgAwIBAgIGAXvykY0oMA0GCSqGSIb3DQEBCwUAMDYxNDAyBgNVBAMM\nK1JKdF82c3UySFRyX0N2ZlBOemJIQjlqTHIwNHdlVkdwci1Nc3RjRWZDZ00wHhcN\nMjEwOTE3MDcwMzUwWhcNMjIwNzE0MDcwMzUwWjA2MTQwMgYDVQQDDCtSSnRfNnN1\nMkhUcl9DdmZQTnpiSEI5akxyMDR3ZVZHcHItTXN0Y0VmQ2dNMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiBnr1cxdQ4WMYivOStLmZJ9VBkwj1N8kszF0\nmRsStbhB5ABAaecFph+khG2Jf+i9WfQn/FKz6lhDpeN+jPruTIWKwO1gburk1ynB\nVVPc7huJttIilfHX1nhpz3zZyxCXgUcUb+16cIKQ/mfwaWvaQtty8VzhQE1Nu50k\nnyq2NFcH/yBXmJWCY6gcgybm0BcVaLKchL11lu8Q50Xx9XFVSex+CjsmNsTnMprC\nkt5I3dgM/Qw4+tlVNPJa9KIRSxyBLiD6lmqygfIx6LY7g89kazPXcAukG025JIv8\nc49qrypD9TqDvAMrU94UeoN8YzOIZ1jPTpMhxBgJ2CgU1MER9QIDAQABMA0GCSqG\nSIb3DQEBCwUAA4IBAQBgGDT7kk5Jtx5WQIu8ofhNCUeCwwcBc9RnUrqv/9Rspq6v\nWd8RNym7BHdXw4rU/tIm+MNq8ZzHh1unEBUtIlTFh4Y/JlIsl55XaIxv9Qyy2ugm\n3DriKp1QWGhgeqm77HDjitt4M4Ldq8J5ToFSurpCS3PEu2gau4SiXJgx3IPpc4hX\nG/J3aHHvZooYIjGget0sBOArIA82Md3+qnchSBSnODvO6yHWQt+rV31er6ZWT6iN\nCmbLSxdNgwqi/rIY9qHo6K/7t6T+R/PQod+NHQM64u+2z1HJJPNNnXVlafzOODvH\nOJHMPzlO6Q8Wa0beAeIsNlUxP7K+PfVFdmdDcDl0\n-----END CERTIFICATE-----',
  },
  'rsa-pss': {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADALBgkqhkiG9w0BAQoEggSoMIIEpAIBAAKCAQEAyGUpxgIz9v9zop/n\nmM98hG8kiH8W543fpsVYm0BcD9m3DKb4GtIrgIAcvY9cJUwBphW1MrXelU3a5IYK\n1J8TWylRJS4n85bmtl7IoEpX4qjMTbJVx7Rg9EhHi3qCmeMsaCWu2hXFl44Gtejp\nH/UYIrOQyLRG/682qAi7cgeg9rVYLBKOUAi0ETtggr0TQtp5TIZ2n4GFsNiSv/2x\nJbfJYqrxe+PCaHFh/kqA434kkJBSq6vTxtqrpRHqYNWd4TPRbb1ZO3ueszreBVj2\npvVUkuqxFoQ5alFIRCR5ihTEdlZOrfy4J1l05PxmCewaPe2A/O5wlx/0s6NsUt0s\noY0yPQIDAQABAoIBAQCrOjVtaWh5fmCR7kv3uCJPDqCKuP0bMZCOcUV6so13RbIw\n72JDmJ1vGQh1uE8l10H5ZccD436i2HlWlmoeryXc2Prq5/tfGetcnLSUsbFSjKS1\nJtJA55GIaVIoja+WShQhkUFMOxowmzyEptS7Z7MNw5zMwa2Av3fWME/p6TbSVTGb\nkgnbknIueZO5aDZGw6r9QJ15efIk3hV9bVZMF/lajdY32iVI0PWSyhlnTfzGr7hR\nVI6q/e9dDtgPxpKUAWLiAcr62oxPbX5CdMTYhhZeA5eu8au2OrpcBPgXs/h95/uf\nQmrqa9Tbqx7jGKc+gjcuO+mKdP2ESZvc/qAQHLPJAoGBAPAz22eL7FFirxEabujP\naRFldiZBk492fWpemyjBWq3yXotiZJxD7EY9bIOAS0L7LYJLOhnOfyjJGD6nFgLd\nwbvbNFpkkOHxw2mvlIKbPcoA8ucIgK4dIet66n9wQ/KSoqnXrPGNP/X/GmWv2Na3\n6oA56y+2mJJ/ohE2SzQDhDfHAoGBANWTF+vB+qhLN7dvIF5699SASXlKmCef9pcY\n8uVRG17Gmsn41edJu0oE4Co8zy78lTTkYFq6SBk7kPnqThUGz3yqIW9s/HXscMNX\nbT+x9D0i14Plijhh5sWi+82D/sXLKMUuGFuv1rLqdFqREIA/SFP4ybUOzNErCjJZ\nOU4MQK3bAoGAL9ok23wEmDIQrleVwMuRIuYTo4ts2ifA1HAEeRoL9ptSOnJfmMHv\nUA7sj0X/uFhRuKND7+AzdOya5+BhgjCrZ8FDrL5cHqcLRwKzk1FZ/eQyf9Qxzn3/\nQ+o4zSqQXsLXpP5Sdcyt8VPg7mEZ0azSCrl/IQI/YvAKWWN3l+UbcgECgYA9uPDk\n1X6XPIWxoY/9PhR5eUnCn+gxK22cZT1tQG9kiIkbbaqD2S8jSR1vl3tY3O5SBt5B\n2iwT/r77OteuA/Xa1WAsT5b2jYpZKd8M1WT8diFKoP+9I64J1/xlfIwYpYn20kd/\n1+V4d4GA2wOlzKQegHvqs4hFuuaLfnWtNKVMmQKBgQCss9z8ML3rp1pC/or5IFiX\nxfxdcpWU9DH5FhW+Rdh1o/DAYjiAWhwiDd2jqVsUN56g8tYsuOMPxLUek3am1oXn\nRGSytD8hpMk1R/Ry4BMmtlQckuErM4eXu8cDf5J1T+1kT1G15A7r+hOmPKIZE026\nGMts00WVi7hT543mgZpuBg==\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMIIBIDALBgkqhkiG9w0BAQoDggEPADCCAQoCggEBAMhlKcYCM/b/c6Kf55jPfIRv\nJIh/FueN36bFWJtAXA/Ztwym+BrSK4CAHL2PXCVMAaYVtTK13pVN2uSGCtSfE1sp\nUSUuJ/OW5rZeyKBKV+KozE2yVce0YPRIR4t6gpnjLGglrtoVxZeOBrXo6R/1GCKz\nkMi0Rv+vNqgIu3IHoPa1WCwSjlAItBE7YIK9E0LaeUyGdp+BhbDYkr/9sSW3yWKq\n8XvjwmhxYf5KgON+JJCQUqur08baq6UR6mDVneEz0W29WTt7nrM63gVY9qb1VJLq\nsRaEOWpRSEQkeYoUxHZWTq38uCdZdOT8ZgnsGj3tgPzucJcf9LOjbFLdLKGNMj0C\nAwEAAQ==\n-----END PUBLIC KEY-----\n',
  },
  'P-256': {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgDWWQhKsBhXz/Nr8s\nTHJPwhW3Ma05i0IRg9xjJBs3pNuhRANCAAR84SJzhOkjOQgf7k9QPiG6yC5Awd9t\nAQNMmDqxX1pqs+0xhMfFT1lvV/Skvr/g5sMalElhCYx05JnXI8VOpTZi\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEfOEic4TpIzkIH+5PUD4husguQMHf\nbQEDTJg6sV9aarPtMYTHxU9Zb1f0pL6/4ObDGpRJYQmMdOSZ1yPFTqU2Yg==\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np\nQXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw\nOTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN\nVWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI\nKoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35\nUH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA\n1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh\nv+A1QWZMuTWqYt+uh/YSRNDn\n-----END CERTIFICATE-----',
  },
  'P-384': {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIG2AgEAMBAGByqGSM49AgEGBSuBBAAiBIGeMIGbAgEBBDBOblIt924xIsUG21PU\nWjXX+5VqUnpc851xnpjRPxouy7LBGnG+w+a1l2hpGUbRlkahZANiAASqB0UFW1tD\nzcZ0aT0eIdapYzTzbnvFuzEBhV3+zHavp4NkWIrkzE4BBbABXqkXAGdi5oqG0DXe\ned6lz6AJK1O6Y0zfATVG+T3LFXzb/dLeibuSphS4DqaiDQvSm/gXLNw=\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEqgdFBVtbQ83GdGk9HiHWqWM08257xbsx\nAYVd/sx2r6eDZFiK5MxOAQWwAV6pFwBnYuaKhtA13nnepc+gCStTumNM3wE1Rvk9\nyxV82/3S3om7kqYUuA6mog0L0pv4Fyzc\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIBmjCCASGgAwIBAgIGAXvyk31cMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK0tL\nSWZVcUthNEZSYVRISVVmVUFSN3ZPSEpIenJlNmFVRnM3Wk9CZGczX3cwHhcNMjEw\nOTE3MDcwNTU3WhcNMjIwNzE0MDcwNTU3WjA2MTQwMgYDVQQDDCtLS0lmVXFLYTRG\nUmFUSElVZlVBUjd2T0hKSHpyZTZhVUZzN1pPQmRnM193MHYwEAYHKoZIzj0CAQYF\nK4EEACIDYgAEXGGo5mGJcpHu9Ib6PaKJURZ8inTKa/yznIqHgNew81bzbyW1wK3e\neEU637aAaHkaf+QwiEuswx4euEQ0U1xdFF8n80KopyHVB5CDXV3hv40Osuwcv2cD\n727puXzxSnWsMAoGCCqGSM49BAMCA2cAMGQCMBaN8kxQ1CUFLBhk7eyxaS6Pljzz\nXcYU0q7Uddbh3nhzfZ8rAZIVBTq7EHJMGsqS4AIwbGliZUob0PzgEXRLwz0nzBGe\nuftbcz40IGAn4bQuKVvzm5+Ivy5syf0odB8ShBh4\n-----END CERTIFICATE-----',
  },
  'P-521': {
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
  ed25519: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIOcUcmmhP080PCEg3n1MojHqLRVqksuWi/mu6IL3oqcd\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAYPirSLK5RYui0fLnPzF/zohd13Ey7usg/ZwQmyLBkfE=\n-----END PUBLIC KEY-----\n',
    certificate:
      '-----BEGIN CERTIFICATE-----\nMIIB0zCCAYUCFEAGUxyTR1mz/XyaVnqHUA1T0bg4MAUGAytlcDCBizELMAkGA1UE\nBhMCVVMxFTATBgNVBAgMDFBlbm5zeWx2YW5pYTETMBEGA1UEBwwKUGl0dHNidXJn\naDEWMBQGA1UECgwNRXhhbXBsZSwgSW5jLjEiMCAGCSqGSIb3DQEJARYTZXhhbXBs\nZUBleGFtcGxlLmNvbTEUMBIGA1UEAwwLZXhhbXBsZS5jb20wHhcNMjExMTA1MTkz\nNTQ4WhcNMjMxMDA2MTkzNTQ4WjCBizELMAkGA1UEBhMCVVMxFTATBgNVBAgMDFBl\nbm5zeWx2YW5pYTETMBEGA1UEBwwKUGl0dHNidXJnaDEWMBQGA1UECgwNRXhhbXBs\nZSwgSW5jLjEiMCAGCSqGSIb3DQEJARYTZXhhbXBsZUBleGFtcGxlLmNvbTEUMBIG\nA1UEAwwLZXhhbXBsZS5jb20wKjAFBgMrZXADIQCuVl9VNLFAflCTZDKRtWjGLqsD\ne/E5r+zIN1H6rWkE/DAFBgMrZXADQQDet6id3ZIBqQ4RP1GBRHN19epkb7euezw6\nYlmU09Tsz1j7utsNgs6ztF43GyzzVWrBtHkjne7qtnIONDqSvJoC\n-----END CERTIFICATE-----',
  },
  ed448: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMEcCAQAwBQYDK2VxBDsEOZH8HCMLkTP3rNcQH/ZZsOCUdKPTFDUnfkF9ytoKKE9D\ne27L5gPte5Nw2uvJv3cFPIo+UvBF2ih8Tg==\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMEMwBQYDK2VxAzoAKyg7ZuCoHEcVK/J+IYX82pG2Cn83HDq+Vz1OotlPF6Q2VIrM\n2WCGhydehGrnGieV2ysTfMTTIC6A\n-----END PUBLIC KEY-----\n',
  },
  x25519: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VuBCIEIHDP/1UF43oNuTKvxDY2gNe6gJTPhdYeoXpd+ufNsyFl\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VuAyEACQgvSpBWGONHe9r7+/0z/uUTJgydI/fcWR8REUqqGC4=\n-----END PUBLIC KEY-----\n',
  },
  x448: {
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMEYCAQAwBQYDK2VvBDoEOFAfUMe2Yxtjg/a8C95o73SU6JsphoyKY8ZupKxKSrzc\ngn37kyK794dhIAFHXES9vLJF5ImOIZ+q\n-----END PRIVATE KEY-----\n',
    publicKey:
      '-----BEGIN PUBLIC KEY-----\nMEIwBQYDK2VvAzkAiGwV8Vh450I0cq0eEGLNz6SSkSJHbdDZ718xfi57qy816aIW\nW/OYjf111Kyzu/2hnQGseMOXn8U=\n-----END PUBLIC KEY-----\n',
  },
}

const testSPKI = async (t, pem, alg) => {
  const key = await jose.importSPKI(pem, alg, { extractable: true })
  t.is((await jose.exportSPKI(key)).trim(), pem.trim())
}
const testPKCS8 = async (t, pem, alg) => {
  const key = await jose.importPKCS8(pem, alg, { extractable: true })
  t.is((await jose.exportPKCS8(key)).trim(), pem.trim())
}
const testX509 = async (t, x509, alg) => {
  await jose.importX509(x509, alg, { extractable: true })
  t.pass()
}

for (const alg of [
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'RSA-OAEP',
  'RSA-OAEP-256',
  'RSA-OAEP-384',
  'RSA-OAEP-512',
  'RSA1_5',
]) {
  conditional({ webcrypto: alg !== 'RSA1_5', electron: 1 })(
    `import SPKI RSA for ${alg}`,
    testSPKI,
    keys.rsa.publicKey,
    alg,
  )
  conditional({ webcrypto: alg !== 'RSA1_5', electron: 1 })(
    `import X509 RSA for ${alg}`,
    testX509,
    keys.rsa.certificate,
    alg,
  )
  conditional({ webcrypto: alg !== 'RSA1_5', electron: 1 })(
    `import PKCS8 RSA for ${alg}`,
    testPKCS8,
    keys.rsa.privateKey,
    alg,
  )
}

for (const alg of ['ES256', 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']) {
  test(`import SPKI P-256 for ${alg}`, testSPKI, keys['P-256'].publicKey, alg)
  test(`import X509 P-256 for ${alg}`, testX509, keys['P-256'].certificate, alg)
  test(`import PKCS8 P-256 for ${alg}`, testPKCS8, keys['P-256'].privateKey, alg)
}

for (const alg of ['ES384', 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']) {
  test(`import SPKI P-384 for ${alg}`, testSPKI, keys['P-384'].publicKey, alg)
  test(`import X509 P-384 for ${alg}`, testX509, keys['P-384'].certificate, alg)
  test(`import PKCS8 P-384 for ${alg}`, testPKCS8, keys['P-384'].privateKey, alg)
}

for (const alg of ['ES512', 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']) {
  test(`import SPKI P-521 for ${alg}`, testSPKI, keys['P-521'].publicKey, alg)
  test(`import X509 P-521 for ${alg}`, testX509, keys['P-521'].certificate, alg)
  test(`import PKCS8 P-521 for ${alg}`, testPKCS8, keys['P-521'].privateKey, alg)
}

for (const alg of ['ES256K']) {
  conditional({ webcrypto: 0, electron: 0 })(
    `import SPKI secp256k1 for ${alg}`,
    testSPKI,
    keys.secp256k1.publicKey,
    alg,
  )
  conditional({ webcrypto: 0, electron: 0 })(
    `import PKCS8 secp256k1 for ${alg}`,
    testPKCS8,
    keys.secp256k1.privateKey,
    alg,
  )
}

for (const alg of ['EdDSA']) {
  test(`import SPKI ed25519 for ${alg}`, testSPKI, keys.ed25519.publicKey, alg)
  test(`import X509 ed25519 for ${alg}`, testX509, keys.ed25519.certificate, alg)
  test(`import PKCS8 ed25519 for ${alg}`, testPKCS8, keys.ed25519.privateKey, alg)
  conditional({ electron: 0 })(`import SPKI ed448 for ${alg}`, testSPKI, keys.ed448.publicKey, alg)
  conditional({ electron: 0 })(
    `import PKCS8 ed448 for ${alg}`,
    testPKCS8,
    keys.ed448.privateKey,
    alg,
  )
}

for (const alg of ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']) {
  test(`import SPKI x25519 for ${alg}`, testSPKI, keys.x25519.publicKey, alg)
  test(`import PKCS8 x25519 for ${alg}`, testPKCS8, keys.x25519.privateKey, alg)
  conditional({ electron: 0 })(`import SPKI x448 for ${alg}`, testSPKI, keys.x448.publicKey, alg)
  conditional({ electron: 0 })(`import PKCS8 x448 for ${alg}`, testPKCS8, keys.x448.privateKey, alg)
}
