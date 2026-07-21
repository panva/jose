import test from 'ava'

import { generateKeyPair, type CryptoKey } from '../../src/index.js'
import {
  FlattenedSignSDJWT,
  GeneralSignSDJWT,
  SignSDJWT,
  flattenedSdJwtReceive,
  flattenedSdJwtVerify,
  generalSdJwtReceive,
  generalSdJwtVerify,
  sdJwtReceive,
  sdJwtVerify,
  type SDJWT,
} from '../../src/sd-jwt/index.js'

let issuerPrivateKey: CryptoKey
let issuerPublicKey: CryptoKey

test.before(async () => {
  const { privateKey, publicKey } = await generateKeyPair('ES256')
  issuerPrivateKey = privateKey
  issuerPublicKey = publicKey
})

const disclosurePaths = [
  '/values/boolean',
  '/values/nil',
  '/values/zero',
  '/values/emptyString',
  '/escaped/a~1b/~0node/child',
  '/escaped/a~1b/~0node',
  '/escaped/',
  '/collections/object',
  '/collections/array',
  '/list/0/details/code',
  '/list/0',
  '/list/1/0',
  '/list/1',
  '/list/2',
] as const

const presentationSelections: readonly (readonly string[])[] = [
  [],
  ['/values/boolean', '/values/nil', '/values/zero', '/values/emptyString'],
  ['/escaped/a~1b/~0node/child', '/escaped/'],
  ['/collections/object', '/collections/array'],
  ['/list/0/details/code', '/list/1/0', '/list/2'],
  ['/escaped/a~1b/~0node', '/list/0', '/list/1'],
  disclosurePaths,
]

type Serialization = 'compact' | 'flattened' | 'general'

function generator(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 2 ** 32
  }
}

function generatePayload(seed: number): Record<string, unknown> {
  const random = generator(seed)
  const integer = () => Math.floor(random() * 1_000_000)
  const text = (prefix: string) => `${prefix}-${integer()}-Möbius`

  return {
    case: seed,
    permanent: text('visible'),
    values: {
      boolean: random() >= 0.5,
      nil: null,
      zero: 0,
      emptyString: '',
      visible: text('value'),
    },
    escaped: {
      'a/b': {
        '~node': {
          child: text('child'),
          sibling: integer(),
        },
        visible: true,
      },
      '': text('empty-key'),
      visible: text('escaped'),
    },
    collections: {
      object: {},
      array: [],
      visible: [text('collection')],
    },
    list: [
      {
        name: text('first'),
        details: { code: integer(), visible: true },
      },
      [text('array-zero'), '', null],
      random() >= 0.5 ? false : 0,
    ],
  }
}

function decodePointer(pointer: string): string[] {
  return pointer
    .slice(1)
    .split('/')
    .map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'))
}

function isAncestor(ancestor: readonly string[], descendant: readonly string[]): boolean {
  return (
    ancestor.length < descendant.length &&
    ancestor.every((token, index) => token === descendant[index])
  )
}

function selectedWithParents(selected: readonly string[]): Set<string> {
  const result = new Set(selected)
  const decoded = new Map(disclosurePaths.map((pointer) => [pointer, decodePointer(pointer)]))
  for (const pointer of selected) {
    const child = decoded.get(pointer)!
    for (const candidate of disclosurePaths) {
      if (isAncestor(decoded.get(candidate)!, child)) result.add(candidate)
    }
  }
  return result
}

function compareRemovalPaths(left: string, right: string): number {
  const leftTokens = decodePointer(left)
  const rightTokens = decodePointer(right)
  if (leftTokens.length !== rightTokens.length) {
    return rightTokens.length - leftTokens.length
  }

  const leftParent = leftTokens.slice(0, -1).join('\u0000')
  const rightParent = rightTokens.slice(0, -1).join('\u0000')
  const leftMember = leftTokens[leftTokens.length - 1]
  const rightMember = rightTokens[rightTokens.length - 1]
  if (
    leftParent === rightParent &&
    /^(?:0|[1-9][0-9]*)$/.test(leftMember) &&
    /^(?:0|[1-9][0-9]*)$/.test(rightMember)
  ) {
    return Number(rightMember) - Number(leftMember)
  }
  return left.localeCompare(right)
}

function removePointer(payload: Record<string, unknown>, pointer: string): void {
  const tokens = decodePointer(pointer)
  let parent: unknown = payload
  for (const token of tokens.slice(0, -1)) {
    parent = Array.isArray(parent)
      ? parent[Number(token)]
      : (parent as Record<string, unknown>)[token]
  }

  const member = tokens[tokens.length - 1]
  if (Array.isArray(parent)) {
    parent.splice(Number(member), 1)
  } else {
    delete (parent as Record<string, unknown>)[member]
  }
}

function expectedProjection(
  original: Record<string, unknown>,
  selected: readonly string[],
): Record<string, unknown> {
  const payload = structuredClone(original)
  const effective = selectedWithParents(selected)
  const hidden = disclosurePaths.filter((pointer) => !effective.has(pointer))
  hidden.sort(compareRemovalPaths)
  for (const pointer of hidden) removePointer(payload, pointer)
  return payload
}

async function issue(
  serialization: Serialization,
  payload: Record<string, unknown>,
): Promise<SDJWT> {
  switch (serialization) {
    case 'compact':
      return new SignSDJWT(payload)
        .setProtectedHeader({ alg: 'ES256' })
        .setDisclosurePaths(disclosurePaths)
        .sign(issuerPrivateKey)
    case 'flattened':
      return new FlattenedSignSDJWT(payload)
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ kid: 'generated' })
        .setDisclosurePaths(disclosurePaths)
        .sign(issuerPrivateKey)
    case 'general':
      return new GeneralSignSDJWT(payload)
        .setDisclosurePaths(disclosurePaths)
        .addSignature(issuerPrivateKey)
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ kid: 'generated' })
        .sign()
  }
}

function receive(issued: SDJWT) {
  if (typeof issued === 'string') return sdJwtReceive(issued, issuerPublicKey)
  if ('signatures' in issued) return generalSdJwtReceive(issued, issuerPublicKey)
  return flattenedSdJwtReceive(issued, issuerPublicKey)
}

function verify(presentation: SDJWT) {
  const options = { keyBinding: false } as const
  if (typeof presentation === 'string') return sdJwtVerify(presentation, issuerPublicKey, options)
  if ('signatures' in presentation) {
    return generalSdJwtVerify(presentation, issuerPublicKey, options)
  }
  return flattenedSdJwtVerify(presentation, issuerPublicKey, options)
}

for (const seed of [0x1a2b3c4d, 0x5e6f7788, 0x90abcdef]) {
  for (const serialization of ['compact', 'flattened', 'general'] as const) {
    test(`generated nested invariants (${serialization}, seed ${seed.toString(16)})`, async (t) => {
      const input = generatePayload(seed)
      const pristineInput = structuredClone(input)
      const issued = await issue(serialization, input)
      const pristineIssued = structuredClone(issued)

      t.deepEqual(input, pristineInput)
      const credential = await receive(issued)
      t.deepEqual(credential.payload, pristineInput)
      t.deepEqual(
        credential.disclosures.map(({ path }) => path).sort(),
        disclosurePaths.slice().sort(),
      )

      for (const selected of presentationSelections) {
        const presentation = await credential.present(selected)
        const verified = await verify(presentation)
        const effective = selectedWithParents(selected)

        t.deepEqual(
          verified.payload,
          expectedProjection(pristineInput, selected),
          `${serialization} seed ${seed}: ${JSON.stringify(selected)}`,
        )
        t.is(verified.disclosures.length, effective.size)
        t.deepEqual(input, pristineInput)
        t.deepEqual(issued, pristineIssued)
      }
    })
  }
}
