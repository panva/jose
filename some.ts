import * as jose from './src/index.ts'

const aad = new TextEncoder().encode('The Fellowship of the Ring')
const plaintext = new TextEncoder().encode(
  'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
)

if (true) {
  console.log('// HPKE Integrated Encryption')
  const JWK: JsonWebKey & Record<string, string> = {
    kty: 'EC',
    use: 'enc',
    alg: 'HPKE-0',
    kid: 'yCnfbmYMZcWrKDt_DjNebRCB1vxVoqv4umJ4WK8RYjk',
    crv: 'P-256',
    x: 'gixQJ0qg4Ag-6HSMaIEDL_zbDhoXavMyKlmdn__AQVE',
    y: 'ZxTgRLWaKONCL_GbZKLNPsW9EW6nBsN4AwQGEFAFFbM',
    d: 'g2DXtKapi2oN2zL_RCWX8D4bWURHCKN2-ZNGC05ZaR8',
  }

  console.log(JSON.stringify(JWK, null, 2))

  const { alg, kid } = JWK

  const skR = await jose.importJWK(JWK, JWK.alg, { extractable: true })
  delete JWK.d
  const pkR = await jose.importJWK(JWK, JWK.alg, { extractable: true })

  if (false) {
    console.log()
    console.log('// compact')
    const jwe = await new jose.CompactEncrypt(plaintext)
      .setProtectedHeader({ alg, kid })
      .encrypt(pkR)

    console.log(jwe)

    await jose.compactDecrypt(jwe, skR)
  }

  {
    console.log()
    console.log('// compact')
    const jwe =
      'eyJhbGciOiJIUEtFLTAiLCJraWQiOiJ5Q25mYm1ZTVpjV3JLRHRfRGpOZWJSQ0IxdnhWb3F2NHVtSjRXSzhSWWprIn0.BLAJX8adrFsDKaoJAc3iy2dq-6jEH3Uv-bSgqIoDeREqpWglMoTS67XsXere1ZYxiQKEFU6MbWe8O7vmdlSmcUk..NcN9ew5aijn8W7piLVRU8r2cOP0JKqxOF4RllVsJM4qsAfVXW5Ka6so9zdUmXXNOXyCEk0wV_s8ICAnD4LbRa5TkhTeuhijIfAt9bQ2fMLOeyed3WyArs8yaMraa9Zbh4i6SaHunM7jU_xoz_N2WbykSOSySmCO49H4mP3jLW9L_TYQfeVfYsrB8clqokZ8h-3eQGNwmOPtkjWdpAfaHUsp4-HC9nRd6yrTU6mV65Nn2iYynu3Xkgy2Lm-kQKDavIEW3PBpEeiw6mtPJE9o8sT-0lZ9kpWtqog2XbNGEfjSOjujvNe1b0g4-FdNFMFO_fo0rxe902W1pGT7znv4Q-xBkIydK4ZwjiFN6dAXutnococ37A0Hr5esPLwHRTTrBFw.'

    await jose.compactDecrypt(jwe, skR)
  }

  if (false) {
    console.log()
    console.log('// flattened')
    const jwe = await new jose.FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg, kid })
      .setAdditionalAuthenticatedData(aad)
      .encrypt(pkR)

    console.log(JSON.stringify(jwe, null, 2))

    await jose.flattenedDecrypt(jwe, skR)
  }

  {
    console.log()
    console.log('// flattened')
    const jwe = {
      ciphertext:
        'LabI8_KIPDbymUSbyVctj8AfISXQ07sMt1xQ1lrS-0heU2jjejpQIK75K1KXcvwn15E6Kil_tJ6LBcYCu02O1H8_aooJGuoLw1vEzQn16h498YX9e2SA2IcVrJTkcCjL7YpF9fsAF3JEzGfsmmrpZPPVdxCn7g8dkGRcyulnHrNvBu4BFtub-URtf-nYCFIJHZ4k-ul9fDddquicFzCxQonx66-ZX5nbj6azHG65tAZntd6VFkRgihdxTvIpvTS4gfulQeKyShbiw-OCJNbzFdEnOKEMnsyqRjwG7iVrFEilFAMsvLJ14-lcuR5btIkUntIwlnsfUa2Ytk33znCfAFN0wYukdDvJe-V0nnNUFlOeLyYV0eEGisgC9dQQ1kFu3g',
      encrypted_key:
        'BAOlZ-VnbhQu4NOlTlDAVYwUJB-Q6YcWwnRNWK6YLSiHHlW4rN0qUzBJ3Rc2_y8nkasn8nUVGBzdq7OhdKKiLq4',
      aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
      protected:
        'eyJhbGciOiJIUEtFLTAiLCJraWQiOiJ5Q25mYm1ZTVpjV3JLRHRfRGpOZWJSQ0IxdnhWb3F2NHVtSjRXSzhSWWprIn0',
    }

    await jose.flattenedDecrypt(jwe, skR)
  }
}

if (true) {
  console.log()
  console.log('// HPKE Key Encryption')
  const JWK: JsonWebKey & Record<string, string> = {
    kty: 'EC',
    use: 'enc',
    alg: 'HPKE-0-KE',
    kid: '9CfUPiGcAcTp7oXgVbDStw2FEjka-_KHU_i-X3XMCEA',
    crv: 'P-256',
    x: 'WVKOswXQAgntIrLSYlwkyaU1dIE-FIhrbTEotFgMwIA',
    y: 'jpZT1WNmQH752Bh_pDK41IhLkiXLj-15wR4ZBZ-MWFk',
    d: 'MeCnMF65SaRVZ11Gf1Weacx3H9SdzO7MtWcDXvHWNv8',
  }

  console.log(JSON.stringify(JWK, null, 2))

  const { alg, kid } = JWK

  const skR = await jose.importJWK(JWK, JWK.alg, { extractable: true })
  delete JWK.d
  const pkR = await jose.importJWK(JWK, JWK.alg, { extractable: true })

  if (false) {
    console.log()
    console.log('// compact')
    const jwe = await new jose.CompactEncrypt(plaintext)
      .setProtectedHeader({ alg, enc: 'A128GCM', kid })
      .encrypt(pkR)

    console.log(jwe)

    await jose.compactDecrypt(jwe, skR)
  }

  if (false) {
    console.log()
    console.log('// general')
    const jwe = await new jose.GeneralEncrypt(plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .setAdditionalAuthenticatedData(aad)
      .addRecipient(pkR)
      .setUnprotectedHeader({ alg, kid })
      .encrypt()

    console.log(JSON.stringify(jwe, null, 2))

    await jose.generalDecrypt(jwe, skR)
  }

  {
    console.log()
    console.log('// general')
    const jwe = {
      ciphertext:
        'uF1XBbVZWhYm_pDbeJvI_fkuqFJiKd1WMP3O_BAGOP-LkpTLE3Et2VQNcOpPAIBfyx8rUzshGqiOFOWzcoWZ3mIwYuDvvAW3-P1RCS8Dtq70JRvahO5O8sAN1vzJg8_dyBPnwsQY6Cy3RhMD6sSSCjjSw0FYmmx67IiI2zJ6Wr8z69k0f34ZTh43k4C-pTwaUSvjl2XI_YrUgdDVYmY_MJ5vmlPTcceMaefP8Onz_fx5xOcGfnVBVz2gpMQPuQL8k5Rk5KJvPGfFfN6hrgWkK_LDzi4lrfnIrvNsk3BCBeZPpc-n19-u7W4-GQxLjAlVyMHeGk5K4tU6gHB8PnnQ4ND5ZTtyXrJWQW-Qr1iFev6g',
      iv: 'mLiHjYaQA42nPm1L',
      recipients: [
        {
          encrypted_key: 'hU6b0hp4-y4ZoK1Qz8YWmDmqDmgTto3HW25-RyPhcLU',
          header: {
            alg: 'HPKE-0-KE',
            kid: '9CfUPiGcAcTp7oXgVbDStw2FEjka-_KHU_i-X3XMCEA',
            ek: 'BGWPWLoD5BUjFEDIjMS-yvtcCXBn5A-kuv2RjzUY_2hKUjgZINqtEy1aHZ8dWxAiyApV5JafG76W8O_yZzy5T54',
          },
        },
      ],
      tag: 'K22C64ZhFABEu2S2F00PLg',
      aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
      protected: 'eyJlbmMiOiJBMTI4R0NNIn0',
    }

    await jose.generalDecrypt(jwe, skR)
  }
}
