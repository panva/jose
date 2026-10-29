import * as jose from 'jose'

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

interface Claims {
  role: string
}

declare const jwt: string
declare const secret: Uint8Array
declare const resolveVerify: jose.JWTVerifyGetKey<jose.CryptoKey>
declare const resolveDecrypt: jose.JWTDecryptGetKey<jose.CryptoKey>
declare const eitherVerify: jose.KeyInput | jose.JWTVerifyGetKey
declare const eitherDecrypt: jose.KeyInput | jose.JWTDecryptGetKey
declare const callableVerifyKey: jose.KeyObject & jose.JWTVerifyGetKey<jose.CryptoKey>
declare const callableDecryptKey: jose.KeyObject & jose.JWTDecryptGetKey<jose.CryptoKey>

/* Every key/resolver overload must keep an optional contextual payload from becoming never. */
async function optionalPayloads() {
  const verified = (await jose.jwtVerify(jwt, secret)) satisfies { payload?: jose.JWTPayload }
  const resolvedVerify = (await jose.jwtVerify(jwt, resolveVerify)) satisfies {
    payload?: jose.JWTPayload
  }
  const forwardedVerify = (await jose.jwtVerify(jwt, eitherVerify)) satisfies {
    payload?: jose.JWTPayload
  }
  const decrypted = (await jose.jwtDecrypt(jwt, secret)) satisfies { payload?: jose.JWTPayload }
  const resolvedDecrypt = (await jose.jwtDecrypt(jwt, resolveDecrypt)) satisfies {
    payload?: jose.JWTPayload
  }
  const forwardedDecrypt = (await jose.jwtDecrypt(jwt, eitherDecrypt)) satisfies {
    payload?: jose.JWTPayload
  }
  const unsecured = jose.UnsecuredJWT.decode(jwt) satisfies { payload?: jose.JWTPayload }

  const _verified: Equals<typeof verified.payload, jose.JWTPayload> = true
  const _resolvedVerify: Equals<typeof resolvedVerify.payload, jose.JWTPayload> = true
  const _forwardedVerify: Equals<typeof forwardedVerify.payload, jose.JWTPayload> = true
  const _decrypted: Equals<typeof decrypted.payload, jose.JWTPayload> = true
  const _resolvedDecrypt: Equals<typeof resolvedDecrypt.payload, jose.JWTPayload> = true
  const _forwardedDecrypt: Equals<typeof forwardedDecrypt.payload, jose.JWTPayload> = true
  const _unsecured: Equals<typeof unsecured.payload, jose.JWTPayload> = true
  const _verifyKey: Equals<typeof resolvedVerify.key, jose.CryptoKey> = true
  const _decryptKey: Equals<typeof resolvedDecrypt.key, jose.CryptoKey> = true
  const _forwardedVerifyKey: Equals<
    typeof forwardedVerify.key,
    jose.CryptoKey | Uint8Array | undefined
  > = true
  const _forwardedDecryptKey: Equals<
    typeof forwardedDecrypt.key,
    jose.CryptoKey | Uint8Array | undefined
  > = true

  new jose.SignJWT({ ...verified.payload })
  new jose.SignJWT({ ...resolvedVerify.payload })
  new jose.SignJWT({ ...forwardedVerify.payload })
  new jose.EncryptJWT({ ...decrypted.payload })
  new jose.EncryptJWT({ ...resolvedDecrypt.payload })
  new jose.EncryptJWT({ ...forwardedDecrypt.payload })
  new jose.UnsecuredJWT({ ...unsecured.payload })
}

/* Contextual custom claims remain inferable, including through existing result-type helpers. */
async function contextualClaims() {
  const verified = (await jose.jwtVerify(jwt, secret)) satisfies { payload: Claims }
  const decrypted = (await jose.jwtDecrypt(jwt, secret)) satisfies { payload: Claims }
  const unsecured = jose.UnsecuredJWT.decode(jwt) satisfies { payload: Claims }
  const _verified: Equals<typeof verified.payload, Claims & jose.JWTPayload> = true
  const _decrypted: Equals<typeof decrypted.payload, Claims & jose.JWTPayload> = true
  const _unsecured: Equals<typeof unsecured.payload, Claims & jose.JWTPayload> = true

  type VerifiedClaims<T> = T extends jose.JWTVerifyResult<infer P> ? P : never
  type DecryptedClaims<T> = T extends jose.JWTDecryptResult<infer P> ? P : never
  type UnsecuredClaims<T> = T extends jose.UnsecuredResult<infer P> ? P : never
  const _inferredVerified: Equals<VerifiedClaims<typeof verified>, Claims> = true
  const _inferredDecrypted: Equals<DecryptedClaims<typeof decrypted>, Claims> = true
  const _inferredUnsecured: Equals<UnsecuredClaims<typeof unsecured>, Claims> = true
}

/* Unconstrained generic result wrappers must work both with and without explicit type arguments. */
function inferredVerify<T>(): Promise<jose.JWTVerifyResult<T>> {
  return jose.jwtVerify(jwt, secret)
}
function explicitVerify<T>(): Promise<jose.JWTVerifyResult<T>> {
  return jose.jwtVerify<T>(jwt, secret)
}
function inferredDecrypt<T>(): Promise<jose.JWTDecryptResult<T>> {
  return jose.jwtDecrypt(jwt, secret)
}
function explicitDecrypt<T>(): Promise<jose.JWTDecryptResult<T>> {
  return jose.jwtDecrypt<T>(jwt, secret)
}
function inferredUnsecured<T>(): jose.UnsecuredResult<T> {
  return jose.UnsecuredJWT.decode(jwt)
}
function explicitUnsecured<T>(): jose.UnsecuredResult<T> {
  return jose.UnsecuredJWT.decode<T>(jwt)
}
function inferredResolvedVerify<T, K extends jose.CryptoKey | Uint8Array>(
  resolve: jose.JWTVerifyGetKey<K>,
): Promise<jose.JWTVerifyResult<T> & jose.ResolvedKey<K>> {
  return jose.jwtVerify(jwt, resolve)
}
function explicitResolvedVerify<T, K extends jose.CryptoKey | Uint8Array>(
  resolve: jose.JWTVerifyGetKey<K>,
): Promise<jose.JWTVerifyResult<T> & jose.ResolvedKey<K>> {
  return jose.jwtVerify<T, K>(jwt, resolve)
}
function inferredResolvedDecrypt<T, K extends jose.CryptoKey | Uint8Array>(
  resolve: jose.JWTDecryptGetKey<K>,
): Promise<jose.JWTDecryptResult<T> & jose.ResolvedKey<K>> {
  return jose.jwtDecrypt(jwt, resolve)
}
function explicitResolvedDecrypt<T, K extends jose.CryptoKey | Uint8Array>(
  resolve: jose.JWTDecryptGetKey<K>,
): Promise<jose.JWTDecryptResult<T> & jose.ResolvedKey<K>> {
  return jose.jwtDecrypt<T, K>(jwt, resolve)
}
function inferredForwardedVerify<T>(): Promise<
  jose.JWTVerifyResult<T> & Partial<jose.ResolvedKey>
> {
  return jose.jwtVerify(jwt, eitherVerify)
}
function inferredForwardedDecrypt<T>(): Promise<
  jose.JWTDecryptResult<T> & Partial<jose.ResolvedKey>
> {
  return jose.jwtDecrypt(jwt, eitherDecrypt)
}

/* A callable KeyObject keeps direct-key precedence unless the resolver's two type arguments are
 * supplied. This overlap must not change which existing overload a call selects. */
async function callableKeys() {
  const verified = await jose.jwtVerify(jwt, callableVerifyKey)
  const decrypted = await jose.jwtDecrypt(jwt, callableDecryptKey)
  // @ts-expect-error the direct-key overload takes precedence for this overlap
  verified.key
  // @ts-expect-error the direct-key overload takes precedence for this overlap
  decrypted.key

  const optionalVerify = (await jose.jwtVerify(jwt, callableVerifyKey)) satisfies {
    payload?: jose.JWTPayload
  }
  const optionalDecrypt = (await jose.jwtDecrypt(jwt, callableDecryptKey)) satisfies {
    payload?: jose.JWTPayload
  }
  new jose.SignJWT({ ...optionalVerify.payload })
  new jose.EncryptJWT({ ...optionalDecrypt.payload })

  const explicitVerify = await jose.jwtVerify<Claims, jose.CryptoKey>(jwt, callableVerifyKey)
  const explicitDecrypt = await jose.jwtDecrypt<Claims, jose.CryptoKey>(jwt, callableDecryptKey)
  const _verifyKey: Equals<typeof explicitVerify.key, jose.CryptoKey> = true
  const _decryptKey: Equals<typeof explicitDecrypt.key, jose.CryptoKey> = true
  const _verifyClaims: string = explicitVerify.payload.role
  const _decryptClaims: string = explicitDecrypt.payload.role
}

/* Partial instantiation and utility types retain the released resolver and union signatures. */
{
  const verify = jose.jwtVerify<Claims, jose.CryptoKey>
  const decrypt = jose.jwtDecrypt<Claims, jose.CryptoKey>
  const _verifyKey: Equals<Awaited<ReturnType<typeof verify>>['key'], jose.CryptoKey> = true
  const _decryptKey: Equals<Awaited<ReturnType<typeof decrypt>>['key'], jose.CryptoKey> = true
  const _verifyArg: Equals<
    Parameters<typeof verify>[1],
    jose.JWTVerifyGetKey<jose.CryptoKey>
  > = true
  const _decryptArg: Equals<
    Parameters<typeof decrypt>[1],
    jose.JWTDecryptGetKey<jose.CryptoKey>
  > = true
  const _verifyUnionKey: Equals<
    Awaited<ReturnType<typeof jose.jwtVerify>>['key'],
    jose.CryptoKey | Uint8Array | undefined
  > = true
  const _decryptUnionKey: Equals<
    Awaited<ReturnType<typeof jose.jwtDecrypt>>['key'],
    jose.CryptoKey | Uint8Array | undefined
  > = true

  const verifyNever = jose.jwtVerify<Claims, never>
  const decryptNever = jose.jwtDecrypt<Claims, never>
  const _verifyNeverKey: Equals<Awaited<ReturnType<typeof verifyNever>>['key'], never> = true
  const _decryptNeverKey: Equals<Awaited<ReturnType<typeof decryptNever>>['key'], never> = true

  const verifyAny = jose.jwtVerify<Claims, any>
  const decryptAny = jose.jwtDecrypt<Claims, any>
  type IsAny<T> = 0 extends 1 & T ? true : never
  const _verifyAnyKey: IsAny<Awaited<ReturnType<typeof verifyAny>>['key']> = true
  const _decryptAnyKey: IsAny<Awaited<ReturnType<typeof decryptAny>>['key']> = true
}
