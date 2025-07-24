/**
 * Selective Disclosure for JWTs (SD-JWT) Holder
 *
 * @module
 */

import { getSdAlg, parseSdJwt } from '../lib/sd.js'
export { parseSdJwt }

// function validateSdJwt<
//   T extends typeof compactVerify | typeof flattenedVerify | typeof generalVerify,
// >(
//   verifyFunction: T,
//   sdJwt: string | types.FlattenedJWS | types.GeneralJWS,
//   key: Parameters<T>[1],
//   options?: JWTVerifyOptions,
// ): void {}

// let foo!: typeof compactVerify

// const a = validateSdJwt(foo, '', new Uint8Array())

import { JsonObject, JsonValue, SdJwtPayload, formatSdJwt } from './issuer.js'
import { FlattenedSign, CompactSign, generateKeyPair, SignJWT, GeneralSign, exportJWK, compactVerify, base64url, decodeJwt, flattenedVerify, generalVerify } from '../index.js'
import * as util from 'node:util'
import { encoder, decoder } from '../lib/buffer_utils.js'
import { validateClaimsSet } from '../lib/jwt_claims_set.js'

const expected = {
  verified_claims: {
    verification: {
      trust_framework: 'de_aml',
      time: '2012-04-23T18:25Z',
      verification_process: 'f24c6f-6d3f-4ec5-973e-b0d8506f3bc7',
      evidence: [
        {
          type: 'document',
          method: 'pipp',
          time: '2012-04-22T11:30Z',
          document: {
            type: 'idcard',
            issuer: {
              name: 'Stadt Augsburg',
              country: 'DE',
            },
            number: '53554554',
            date_of_issuance: '2010-03-23',
            date_of_expiry: '2020-03-22',
          },
        },
      ],
    },
    claims: {
      given_name: 'Max',
      family_name: 'Müller',
      nationalities: ['DE'],
      birthdate: '1956-01-28',
      place_of_birth: {
        country: 'IS',
        locality: 'Þykkvabæjarklaustur',
      },
      address: {
        locality: 'Maxstadt',
        postal_code: '12344',
        country: 'DE',
        street_address: 'Weidenstraße 22',
      },
    },
  },
  birth_middle_name: 'Timotheus',
  salutation: 'Dr.',
  msisdn: '49123456789',
}

const issuerKeyPair = await generateKeyPair('Ed25519')
const holderKeyPair = await generateKeyPair('Ed25519')

const inspect = (input: unknown) => util.inspect(input, { colors: true, depth: Infinity })

const builder = new SdJwtPayload(expected)

builder.setConfirmationClaim('jwk', await exportJWK(holderKeyPair.publicKey))
await builder.conceal(async (payload, conceal, addDecoys) => {
  await conceal(payload, ['birth_middle_name', 'salutation', 'msisdn'])
  await conceal(payload.verified_claims.claims)
  await Promise.all(
    payload.verified_claims.verification.evidence.map((evidence) => conceal(evidence)),
  )
  await conceal(payload.verified_claims.verification.evidence)
  await conceal(payload.verified_claims.verification, ['verification_process', 'time'])
})

const jwt = await new CompactSign(builder.data())
  // .addSignature(issuerKeyPair.privateKey)
  .setProtectedHeader({ alg: 'Ed25519' })
  // .sign()
  .sign(issuerKeyPair.privateKey)

const sdjwt = formatSdJwt(jwt, builder.disclosures)

console.log(sdjwt)

{
  const ELLIPSIS = '...'
  const _SD = '_sd'
  const _SD_ALG = '_sd_alg'
  const { disclosures, jws } = parseSdJwt(sdjwt)

  const verified = await compactVerify(jws, issuerKeyPair.publicKey)
  const payload = validateClaimsSet({ ...verified.protectedHeader, ...verified.unprotectedHeader }, verified.payload)

  // const verified = await flattenedVerify(jws, issuerKeyPair.publicKey)
  // const payload = validateClaimsSet({ ...verified.protectedHeader, ...verified.unprotectedHeader }, verified.payload)

  // const verified = await flattenedVerify(jws, issuerKeyPair.publicKey)
  // const payload = validateClaimsSet(verified.protectedHeader, verified.payload)

  const _sd_alg = getSdAlg(payload[_SD_ALG])

  // Step 1: Parse all disclosures and calculate their digests
  type DisclosureInfo = {
    disclosure: string
    value: JsonValue
    property?: string
    used?: boolean
    path?: (string | number)[]
  }

  const disclosureInfos: Map<string, DisclosureInfo> = new Map()

  for (const disclosure of disclosures) {
    // Calculate digest
    const digest = base64url.encode(
      new Uint8Array(await crypto.subtle.digest(_sd_alg, encoder.encode(disclosure))),
    )

    // Parse disclosure
    let arr: unknown
    try {
      arr = JSON.parse(decoder.decode(base64url.decode(disclosure)))
    } catch (cause) {
      throw new Error('Invalid disclosure encoding', { cause })
    }

    if (!Array.isArray(arr)) {
      throw new Error('Disclosure is not an array')
    }
    switch (arr.length) {
      case 3: {
        // Concealed Object Property
        const { 1: property, 2: value } = arr
        if (typeof property !== 'string') {
          throw new Error('Disclosure claimName not string')
        }
        if (property === _SD || property === ELLIPSIS) {
          throw new Error('Invalid Disclosure property name')
        }
        disclosureInfos.set(digest, { disclosure, value, property })
        break
      }
      case 2: {
        // Concealed Array Member
        const { 1: value } = arr
        disclosureInfos.set(digest, { disclosure, value })
        break
      }
      default:
        throw new Error('Disclosure array must have 2 or 3 elements')
    }
  }

  // Helper to find disclosure by digest, mark as used, and check for duplicates
  function findDisclosureByDigest(
    digest: string,
    path: (string | number)[],
  ): DisclosureInfo | undefined {
    const info = disclosureInfos.get(digest)
    if (!info) {
      return undefined
    }
    if (info.used) {
      throw new Error('Digest used more than once')
    }
    info.used = true
    info.path = path.slice()
    return info
  }

  function isObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null
  }

  function isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  // Step 2: Recursively process the JWT payload
  async function processPayload(obj: any, path: (string | number)[]): Promise<any> {
    if (Array.isArray(obj)) {
      // Process array elements
      const result: any[] = []
      for (let i = 0; i < obj.length; i++) {
        const el = obj[i]
        if (
          isObject(el) &&
          Object.keys(el).length === 1 &&
          Object.keys(el)[0] === ELLIPSIS &&
          isString(el[ELLIPSIS])
        ) {
          // TODO: this should throw if it's got ellipsis but it isn't a single string key
          // Array element is a digest
          const digest = el[ELLIPSIS]
          const info = findDisclosureByDigest(digest, path.concat(i))
          if (!info) {
            // Remove element if digest not found
            continue
          }
          // Must be a 2-element disclosure
          if (info.property !== undefined) {
            throw new Error('TODO')
          }
          // Replace with value and recursively process
          result.push(await processPayload(info.value, path.concat(i)))
        } else {
          // Recursively process non-digest elements
          result.push(await processPayload(el, path.concat(i)))
        }
      }
      return result
    }

    if (isObject(obj)) {
      // Process object properties
      const res: JsonObject = {}
      // Handle _sd digests
      let sdDigests: string[] | undefined
      if (Array.isArray(obj[_SD]) && obj[_SD].every(isString)) {
        sdDigests = obj[_SD]
      }
      // TODO: if there is _sd and it isn't all strings it should throw

      // Copy all non-_sd, non-_sd_alg properties
      for (const [k, v] of Object.entries(obj)) {
        if (k === _SD || k === _SD_ALG) continue
        res[k] = await processPayload(v, path.concat(k))
      }

      // Remove _sd_alg if present
      // (already skipped above)

      // Process _sd digests
      if (sdDigests) {
        for (const digest of sdDigests) {
          const info = findDisclosureByDigest(digest, path.concat(_SD))
          if (!info) {
            // Ignore unknown digest
            continue
          }
          // Must be a 3-element disclosure
          if (info.property === undefined) {
            throw new Error('TODO')
          }
          if (info.property === _SD || info.property === ELLIPSIS) {
            throw new Error('Invalid claim name in disclosure')
          }
          if (Object.prototype.hasOwnProperty.call(res, info.property)) {
            throw new Error('Claim name already exists at this level')
          }
          // Insert property and recursively process
          res[info.property] = await processPayload(info.value, path.concat(info.property))
        }
      }

      // Remove _sd key
      // (already skipped above)

      // If object is empty, return {}
      return res
    }

    // Primitive value, return as is
    return obj
  }

  // Step 3: Process the payload
  const processedPayload = await processPayload(payload, [])

  // Step 4: Check for unused disclosures
  for (const info of disclosureInfos.values()) {
    if (!info.used) {
      throw new Error('Unused disclosure', { cause: info.disclosure })
    }
  }

  // processedPayload is the final result
  console.log(inspect(processedPayload))

  // Print disclosure paths for debugging
  // for (const [digest, info] of disclosureInfos.entries()) {
  //   console.log(inspect({ info, digest }))
  // }

  let filter = ([,x]) => x.path?.toString() === '_sd' && x.property === 'msisdn'
  let done
  let sds = []
  do {
      const match = [...disclosureInfos.entries()].find(filter)
      if (!match) {
        done = true
        break
      }
      sds.push(match[1].disclosure)
      filter = ([,x]) => {
        if (typeof x.value === 'object' && x.value && '_sd' in x.value && Array.isArray(x.value._sd)) {
          return x.value._sd.includes(match[0])
        }

        if (Array.isArray(x.value)) {
          return x.value.find((el) => el['...'] === match[0])
        }
      }
  } while (!done)

  console.log(formatSdJwt(jws, sds))

  // const [digest, info] = [...disclosureInfos.entries()].find()

  // const [digest2, info2] = [...disclosureInfos.entries()].find()

  // console.log({ info, digest })
  // console.log({ info2, digest2 })
  // console.log({ info3, digest3 })

  // assert.deepStrictEqual(processedPayload, expected)
}
