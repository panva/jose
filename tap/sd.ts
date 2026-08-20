import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import * as lib from '../src/sd-jwt/index.js'

export default async (
  QUnit: QUnit,
  _lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair'>,
) => {
  QUnit.module('sd-jwt')

  QUnit.test('Compact issue, receive, present, and verify', async (t) => {
    const issuer = await keys.generateKeyPair('ES256')
    const issued = await new lib.SignSDJWT({ always: true, concealed: 'value' })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/concealed'])
      .sign(issuer.privateKey)

    const credential = await lib.sdJwtReceive(issued, issuer.publicKey)
    const presentation = await credential.present(['/concealed'])
    const verified = await lib.sdJwtVerify(presentation, issuer.publicKey, { keyBinding: false })

    t.deepEqual(verified.payload, { always: true, concealed: 'value' })
  })

  QUnit.test('JSON issue, receive, present, and verify', async (t) => {
    const issuer = await keys.generateKeyPair('ES256')
    const flattened = await new lib.FlattenedSignSDJWT({ concealed: 'flattened' })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/concealed'])
      .sign(issuer.privateKey)
    const general = await new lib.GeneralSignSDJWT({ concealed: 'general' })
      .setDisclosurePaths(['/concealed'])
      .addSignature(issuer.privateKey)
      .setProtectedHeader({ alg: 'ES256' })
      .sign()

    const flattenedCredential = await lib.flattenedSdJwtReceive(flattened, issuer.publicKey)
    const flattenedPresentation = await flattenedCredential.present(['/concealed'])
    const flattenedResult = await lib.flattenedSdJwtVerify(
      flattenedPresentation,
      issuer.publicKey,
      { keyBinding: false },
    )

    const generalCredential = await lib.generalSdJwtReceive(general, issuer.publicKey)
    const generalPresentation = await generalCredential.present(['/concealed'])
    const generalResult = await lib.generalSdJwtVerify(generalPresentation, issuer.publicKey, {
      keyBinding: false,
    })

    t.equal(flattenedResult.payload.concealed, 'flattened')
    t.equal(generalResult.payload.concealed, 'general')
  })

  QUnit.test('Compact Key Binding', async (t) => {
    const issuer = await keys.generateKeyPair('ES256')
    const holder = await keys.generateKeyPair('ES256', { extractable: true })
    const holderPublicJwk = await keys.exportJWK(holder.publicKey)
    const nonce = 'transaction-nonce'
    const audience = 'https://verifier.example'

    const issued = await new lib.SignSDJWT({
      concealed: 'value',
      cnf: { jwk: holderPublicJwk },
    })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/concealed'])
      .sign(issuer.privateKey)
    const credential = await lib.sdJwtReceive(issued, issuer.publicKey)
    const presentation = await credential
      .addKeyBinding(holder.privateKey)
      .setProtectedHeader({ alg: 'ES256' })
      .setAudience(audience)
      .setNonce(nonce)
      .present(['/concealed'])
    const verified = await lib.sdJwtVerify(presentation, issuer.publicKey, {
      keyBinding: {
        audience,
        nonce,
        algorithms: ['ES256'],
        maxTokenAge: 60,
      },
    })

    t.equal(verified.payload.concealed, 'value')
    t.equal(verified.keyBinding?.payload.nonce, nonce)
  })
}
