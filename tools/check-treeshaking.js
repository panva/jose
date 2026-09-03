// Holds the composable surface to its architectural promise. Catalogs declare PURE factory
// creators, individual imports retain only the selected factories, and representative compositions
// retain only their selected crypto implementations.
// Raw, gzip, and Brotli sizes are reported as useful review data. Graph assertions and
// forbidden-marker assertions are compatibility gates.
import { brotliCompressSync, gzipSync } from 'node:zlib'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { build } from 'esbuild'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const catalogs = [
  {
    subpath: 'algorithms/jws',
    source: 'algorithms/jws',
    category: 'jws',
    exports: [
      'HS256',
      'HS384',
      'HS512',
      'RS256',
      'RS384',
      'RS512',
      'PS256',
      'PS384',
      'PS512',
      'ES256',
      'ES384',
      'ES512',
      'EdDSA',
      'Ed25519',
      'ML_DSA_44',
      'ML_DSA_65',
      'ML_DSA_87',
    ],
  },
  {
    subpath: 'algorithms/jwe',
    source: 'algorithms/jwe',
    category: 'jwe-key-management',
    exports: [
      'dir',
      'RSA_OAEP',
      'RSA_OAEP_256',
      'RSA_OAEP_384',
      'RSA_OAEP_512',
      'ECDH_ES',
      'ECDH_ES_A128KW',
      'ECDH_ES_A192KW',
      'ECDH_ES_A256KW',
      'A128KW',
      'A192KW',
      'A256KW',
      'A128GCMKW',
      'A192GCMKW',
      'A256GCMKW',
      'PBES2_HS256_A128KW',
      'PBES2_HS384_A192KW',
      'PBES2_HS512_A256KW',
    ],
  },
  {
    subpath: 'algorithms/jwe/enc',
    source: 'algorithms/jwe/enc',
    category: 'jwe-content-encryption',
    exports: ['A128GCM', 'A192GCM', 'A256GCM', 'A128CBC_HS256', 'A192CBC_HS384', 'A256CBC_HS512'],
  },
  {
    subpath: 'algorithms/jwe/zip',
    source: 'algorithms/jwe/zip',
    category: 'jwe-compression',
    exports: ['DEF'],
  },
  {
    subpath: 'algorithms/key',
    source: 'algorithms/key',
    category: 'key',
    exports: [
      'HS256',
      'HS384',
      'HS512',
      'RS256',
      'RS384',
      'RS512',
      'PS256',
      'PS384',
      'PS512',
      'ES256',
      'ES384',
      'ES512',
      'EdDSA',
      'Ed25519',
      'ML_DSA_44',
      'ML_DSA_65',
      'ML_DSA_87',
      'dir',
      'RSA_OAEP',
      'RSA_OAEP_256',
      'RSA_OAEP_384',
      'RSA_OAEP_512',
      'ECDH_ES',
      'ECDH_ES_A128KW',
      'ECDH_ES_A192KW',
      'ECDH_ES_A256KW',
      'A128KW',
      'A192KW',
      'A256KW',
      'A128GCMKW',
      'A192GCMKW',
      'A256GCMKW',
      'PBES2_HS256_A128KW',
      'PBES2_HS384_A192KW',
      'PBES2_HS512_A256KW',
      'A128GCM',
      'A192GCM',
      'A256GCM',
      'A128CBC_HS256',
      'A192CBC_HS384',
      'A256CBC_HS512',
    ],
  },
]

const composers = [
  ['composable/jwt/sign', 'composable/jwt/sign', 'composeSignJWT'],
  ['composable/jwt/verify', 'composable/jwt/verify', 'composeJwtVerify'],
  ['composable/jwt/encrypt', 'composable/jwt/encrypt', 'composeEncryptJWT'],
  ['composable/jwt/decrypt', 'composable/jwt/decrypt', 'composeJwtDecrypt'],
  ['composable/jws/compact/sign', 'composable/jws/compact/sign', 'composeCompactSign'],
  ['composable/jws/compact/verify', 'composable/jws/compact/verify', 'composeCompactVerify'],
  ['composable/jws/flattened/sign', 'composable/jws/flattened/sign', 'composeFlattenedSign'],
  ['composable/jws/flattened/verify', 'composable/jws/flattened/verify', 'composeFlattenedVerify'],
  ['composable/jws/general/sign', 'composable/jws/general/sign', 'composeGeneralSign'],
  ['composable/jws/general/verify', 'composable/jws/general/verify', 'composeGeneralVerify'],
  ['composable/jwe/compact/encrypt', 'composable/jwe/compact/encrypt', 'composeCompactEncrypt'],
  ['composable/jwe/compact/decrypt', 'composable/jwe/compact/decrypt', 'composeCompactDecrypt'],
  [
    'composable/jwe/flattened/encrypt',
    'composable/jwe/flattened/encrypt',
    'composeFlattenedEncrypt',
  ],
  [
    'composable/jwe/flattened/decrypt',
    'composable/jwe/flattened/decrypt',
    'composeFlattenedDecrypt',
  ],
  ['composable/jwe/general/encrypt', 'composable/jwe/general/encrypt', 'composeGeneralEncrypt'],
  ['composable/jwe/general/decrypt', 'composable/jwe/general/decrypt', 'composeGeneralDecrypt'],
  ['composable/jwk/embedded', 'composable/jwk/embedded', 'composeEmbeddedJWK'],
  ['composable/jwks/local', 'composable/jwks/local', 'composeLocalJWKSet'],
  ['composable/jwks/remote', 'composable/jwks/remote', 'composeRemoteJWKSet'],
  ['composable/key/import', 'composable/key/import', 'composeKeyImport'],
  ['composable/key/generate/keypair', 'composable/key/generate/keypair', 'composeGenerateKeyPair'],
  ['composable/key/generate/secret', 'composable/key/generate/secret', 'composeGenerateSecret'],
].map(([subpath, source, name]) => ({ subpath, source, name }))

const moduleFixtures = [
  { label: 'source', root: 'src', extension: 'ts' },
  { label: 'distribution', root: 'dist/webapi', extension: 'js' },
]

const implementationModules = ['lib/jwe_aes_gcm']

const keyForbiddenModules = [
  ...implementationModules,
  'lib/signing',
  'lib/jws_sign',
  'lib/jws_verify',
  'lib/jwe_encrypt',
  'lib/jwe_decrypt',
]

const factoryImplementationGroups = [
  [['HS256', 'HS384', 'HS512'], []],
  [['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'], []],
  [['ES256', 'ES384', 'ES512'], []],
  [['EdDSA', 'Ed25519'], []],
  [['ML_DSA_44', 'ML_DSA_65', 'ML_DSA_87'], []],
  [['dir'], []],
  [['RSA_OAEP', 'RSA_OAEP_256', 'RSA_OAEP_384', 'RSA_OAEP_512'], []],
  [['ECDH_ES'], []],
  [['ECDH_ES_A128KW', 'ECDH_ES_A192KW', 'ECDH_ES_A256KW'], []],
  [['A128KW', 'A192KW', 'A256KW'], []],
  [['A128GCMKW', 'A192GCMKW', 'A256GCMKW'], ['lib/jwe_aes_gcm']],
  [['PBES2_HS256_A128KW', 'PBES2_HS384_A192KW', 'PBES2_HS512_A256KW'], []],
  [['A128GCM', 'A192GCM', 'A256GCM'], ['lib/jwe_aes_gcm']],
  [['A128CBC_HS256', 'A192CBC_HS384', 'A256CBC_HS512'], []],
  [['DEF'], []],
]

const operationFactoryImplementations = new Map(
  factoryImplementationGroups.flatMap(([names, implementations]) =>
    names.map((name) => [name, implementations]),
  ),
)

const factoryHandlerGroups = [
  [['dir'], []],
  [
    ['RSA_OAEP', 'RSA_OAEP_256', 'RSA_OAEP_384', 'RSA_OAEP_512'],
    ['async function encryptRsaOaep('],
  ],
  [['ECDH_ES'], ['async function encryptEcdhEs(']],
  [['ECDH_ES_A128KW', 'ECDH_ES_A192KW', 'ECDH_ES_A256KW'], ['async function encryptEcdhEsKw(']],
  [['A128KW', 'A192KW', 'A256KW'], ['async function encryptAesKw(']],
  [['A128GCMKW', 'A192GCMKW', 'A256GCMKW'], ['async function encryptAesGcmKw(']],
  [
    ['PBES2_HS256_A128KW', 'PBES2_HS384_A192KW', 'PBES2_HS512_A256KW'],
    ['async function encryptPbes2('],
  ],
  [['A128CBC_HS256', 'A192CBC_HS384', 'A256CBC_HS512'], ['async function encryptCbcHmac(']],
  [['DEF'], ['async function compressDeflate(']],
]

const operationFactoryHandlers = new Map(
  factoryHandlerGroups.flatMap(([names, handlers]) => names.map((name) => [name, handlers])),
)
const handlerMarkers = [...new Set(factoryHandlerGroups.flatMap(([, handlers]) => handlers))]

const primitiveMarkers = [
  'HMAC',
  'RSASSA-PKCS1-v1_5',
  'RSA-PSS',
  'ECDSA',
  'Ed25519',
  'ML-DSA',
  'RSA-OAEP',
  'ECDH',
  'AES-KW',
  'AES-GCM',
  'AES-CBC',
  'PBKDF2',
  'deflate-raw',
]

function moduleFile(module, fixture) {
  return `${fixture.root}/${module}.${fixture.extension}`
}

function sourceFile(filename) {
  const source = readFileSync(join(root, filename), 'utf8')
  return {
    filename,
    source,
    parsed: ts.createSourceFile(
      filename,
      source,
      ts.ScriptTarget.Latest,
      true,
      filename.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS,
    ),
  }
}

function hasExportModifier(node) {
  return node.modifiers?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword) === true
}

function runtimeExportNames(file) {
  const names = []
  for (const statement of file.parsed.statements) {
    if (hasExportModifier(statement)) {
      if (
        (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
        statement.name !== undefined
      ) {
        names.push(statement.name.text)
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text)
        }
      }
    } else if (
      ts.isExportDeclaration(statement) &&
      !statement.isTypeOnly &&
      statement.exportClause !== undefined &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        if (!element.isTypeOnly) names.push(element.name.text)
      }
    }
  }
  return names.sort()
}

function sameNames(actual, expected, label) {
  const sorted = [...expected].sort()
  if (JSON.stringify(actual) !== JSON.stringify(sorted)) {
    throw new Error(`${label} runtime exports differ: expected ${sorted}; received ${actual}`)
  }
}

function insideFunctionOrClass(node) {
  for (let parent = node.parent; parent !== undefined; parent = parent.parent) {
    if (
      ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isArrowFunction(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isConstructorDeclaration(parent) ||
      ts.isGetAccessorDeclaration(parent) ||
      ts.isSetAccessorDeclaration(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent)
    ) {
      return true
    }
  }
  return false
}

function moduleScopeCalls(file) {
  const found = []
  function visit(node) {
    if ((ts.isCallExpression(node) || ts.isNewExpression(node)) && !insideFunctionOrClass(node)) {
      found.push(node)
    }
    ts.forEachChild(node, visit)
  }
  visit(file.parsed)
  return found
}

function pureInitializer(file, declaration) {
  if (!ts.isCallExpression(declaration.initializer)) return false
  return file.source
    .slice(declaration.name.end, declaration.initializer.getStart(file.parsed))
    .includes('/* @__PURE__ */')
}

function assertPureFactoryCatalog(filename, expected) {
  const file = sourceFile(filename)
  sameNames(runtimeExportNames(file), expected, filename)

  for (const name of expected) {
    let declaration
    for (const statement of file.parsed.statements) {
      if (!ts.isVariableStatement(statement)) continue
      declaration = statement.declarationList.declarations.find(
        (candidate) => ts.isIdentifier(candidate.name) && candidate.name.text === name,
      )
      if (declaration !== undefined) {
        if (filename.startsWith('src/') && !hasExportModifier(statement)) {
          throw new Error(`${filename} must directly export const ${name}`)
        }
        if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
          throw new Error(`${filename} ${name} must be a const factory`)
        }
        break
      }
    }
    if (declaration === undefined) {
      throw new Error(`${filename} must declare const ${name}`)
    }
    if (!pureInitializer(file, declaration)) {
      throw new Error(`${filename} ${name} must be created by a PURE-annotated call`)
    }
  }

  const calls = moduleScopeCalls(file)
  if (calls.length !== expected.length) {
    throw new Error(
      `${filename} must contain exactly one module-scope creator call per exported factory`,
    )
  }
  for (const call of calls) {
    const declaration = call.parent
    if (!ts.isVariableDeclaration(declaration) || declaration.initializer !== call) {
      const { line } = file.parsed.getLineAndCharacterOfPosition(call.getStart(file.parsed))
      throw new Error(`${filename}:${line + 1} has an unexpected module-scope call`)
    }
    if (!pureInitializer(file, declaration)) {
      const { line } = file.parsed.getLineAndCharacterOfPosition(call.getStart(file.parsed))
      throw new Error(`${filename}:${line + 1} has an unannotated module-scope call`)
    }
  }
}

function contributingInputs(metafile) {
  const output = Object.values(metafile.outputs)[0]
  return new Set(
    Object.entries(output.inputs)
      .filter(([, metadata]) => metadata.bytesInOutput > 0)
      .map(([filename]) => filename.replaceAll('\\', '/')),
  )
}

async function bundle(contents, sourcefile, minify = false) {
  const result = await build({
    bundle: true,
    format: 'esm',
    legalComments: 'none',
    logLevel: 'silent',
    metafile: true,
    minify,
    platform: 'neutral',
    stdin: { contents, loader: 'ts', resolveDir: root, sourcefile },
    target: 'es2022',
    treeShaking: true,
    write: false,
  })
  return {
    output: result.outputFiles[0].text,
    metafile: result.metafile,
    inputs: contributingInputs(result.metafile),
  }
}

function publicAlgorithmFacades(metafile) {
  return Object.keys(metafile.inputs)
    .map((input) => input.replaceAll('\\', '/'))
    .filter((input) =>
      /(?:^|\/)algorithms\/(?:jws|key|jwe(?:\/(?:enc|zip))?)\.(?:ts|js)$/u.test(input),
    )
}

function hasInput(inputs, stem) {
  const suffix = new RegExp(`(?:^|/)${stem.replaceAll('/', '\\/')}\\.(?:ts|js)$`, 'u')
  return [...inputs].some((input) => suffix.test(input))
}

function assertNoFullRegistry(inputs, label) {
  for (const stem of ['lib/jws_algorithms', 'lib/jwe_algorithms']) {
    if (hasInput(inputs, stem)) throw new Error(`${label} retained the complete ${stem} registry`)
  }
}

function assertNoKeyOperationModules(inputs, label) {
  for (const stem of keyForbiddenModules) {
    if (hasInput(inputs, stem)) throw new Error(`${label} retained operation-only ${stem}`)
  }
}

function assertNoComposableInfrastructure(inputs, label) {
  if (hasInput(inputs, 'lib/algorithm')) {
    throw new Error(`${label} retained the composable algorithm loader`)
  }
  const facade = [...inputs].find((input) => /(?:^|\/)composable\//u.test(input))
  if (facade !== undefined) throw new Error(`${label} retained ${facade}`)
}

function assertIncludes(output, marker, label) {
  if (!output.includes(marker))
    throw new Error(`${label} does not contain ${JSON.stringify(marker)}`)
}

function assertExcludes(output, marker, label) {
  if (output.includes(marker)) throw new Error(`${label} retained ${JSON.stringify(marker)}`)
}

const { sideEffects } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
if (sideEffects !== false) throw new Error('package.json must declare sideEffects: false')

const unavailableGlobals = ['crypto', 'CompressionStream', 'DecompressionStream']
const globalDescriptors = new Map(
  unavailableGlobals.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
)
try {
  for (const name of unavailableGlobals) {
    Object.defineProperty(globalThis, name, { configurable: true, value: undefined })
  }
  const portableEntries = [
    'dist/webapi/index.js',
    ...catalogs.map(({ source }) => `dist/webapi/${source}.js`),
    ...composers.map(({ source }) => `dist/webapi/${source}.js`),
  ]
  for (const filename of portableEntries) {
    await import(`${pathToFileURL(join(root, filename)).href}?without-web-apis`)
  }
} finally {
  for (const [name, descriptor] of globalDescriptors) {
    if (descriptor === undefined) Reflect.deleteProperty(globalThis, name)
    else Object.defineProperty(globalThis, name, descriptor)
  }
}

const factoryCatalogs = new Map(moduleFixtures.map(({ label }) => [label, new Map()]))
for (const fixture of moduleFixtures) {
  for (const catalog of catalogs) {
    const filename = moduleFile(catalog.source, fixture)
    if (!existsSync(join(root, filename))) {
      throw new Error(`${filename} is missing; run the complete build before checking tree-shaking`)
    }
    assertPureFactoryCatalog(filename, catalog.exports)
    factoryCatalogs.get(fixture.label).set(catalog.subpath, filename)
  }
  for (const composer of composers) {
    const filename = moduleFile(composer.source, fixture)
    if (!existsSync(join(root, filename))) {
      throw new Error(`${filename} is missing; run the complete build before checking tree-shaking`)
    }
    sameNames(runtimeExportNames(sourceFile(filename)), [composer.name], filename)
  }
}

const algorithms = new Map()
const capabilityMarker = Symbol.for('panva.jose.algorithmCapability.v1')
for (const catalog of catalogs) {
  const filename = join(root, moduleFile(catalog.source, moduleFixtures[1]))
  const namespace = await import(`${pathToFileURL(filename).href}?treeshaking`)
  for (const name of catalog.exports) {
    const factory = namespace[name]
    if (typeof factory !== 'function')
      throw new Error(`${catalog.subpath} ${name} is not a factory`)
    const capability = factory()
    if (capability?.category !== catalog.category || typeof capability.algorithm !== 'string') {
      throw new Error(`${catalog.subpath} ${name} returned invalid capability metadata`)
    }
    if (!Object.isFrozen(capability)) {
      throw new Error(`${catalog.subpath} ${name} returned a mutable capability`)
    }
    if (capability !== factory()) {
      throw new Error(`${catalog.subpath} ${name} did not return its stable capability record`)
    }
    const marker = Object.getOwnPropertyDescriptor(capability, capabilityMarker)
    if (marker === undefined || marker.enumerable || typeof marker.value !== 'number') {
      throw new Error(`${catalog.subpath} ${name} returned an unbranded capability`)
    }
    if (capability.key) {
      for (const value of [
        capability.key,
        capability.key.kty,
        capability.key.subtle,
        capability.key.signing,
        capability.key.usages,
        ...capability.key.usages,
        capability.key.ops,
      ]) {
        if (value && !Object.isFrozen(value)) {
          throw new Error(`${catalog.subpath} ${name} returned mutable key metadata`)
        }
      }
    }
    const handlers =
      catalog.category === 'jws' || catalog.category === 'key'
        ? capability.key !== null && typeof capability.key === 'object'
        : catalog.category === 'jwe-compression'
          ? typeof capability.compress === 'function' && typeof capability.decompress === 'function'
          : catalog.category !== 'jwe-key-management'
            ? capability.key !== null &&
              typeof capability.key === 'object' &&
              typeof capability.encrypt === 'function' &&
              typeof capability.decrypt === 'function'
            : capability.mode === 'direct-encryption'
              ? capability.key === undefined &&
                capability.encrypt === undefined &&
                capability.decrypt === undefined
              : capability.key !== null &&
                typeof capability.key === 'object' &&
                (capability.mode === 'direct-key-agreement' ||
                  capability.mode === 'key-wrapping' ||
                  capability.mode === 'key-encryption' ||
                  capability.mode === 'key-agreement-with-key-wrapping') &&
                typeof capability.encrypt === 'function' &&
                typeof capability.decrypt === 'function'
    if (!handlers) throw new Error(`${catalog.subpath} ${name} returned an incomplete capability`)

    const exportedIdentifier = capability.algorithm.replaceAll('-', '_').replaceAll('+', '_')
    if (name !== exportedIdentifier) {
      throw new Error(`${catalog.subpath} exports ${name} for ${capability.algorithm}`)
    }
    const key = `${catalog.category}:${capability.algorithm}`
    if ([...algorithms.values()].some((value) => value.key === key)) {
      throw new Error(`${key} is exported more than once`)
    }
    if (catalog.category !== 'key' && !operationFactoryImplementations.has(name)) {
      throw new Error(`${catalog.subpath} ${name} is missing its implementation graph assertion`)
    }
    algorithms.set(`${catalog.subpath}:${name}`, {
      key,
      name,
      algorithm: capability.algorithm,
      category: catalog.category,
      subpath: catalog.subpath,
    })
  }
}

if (
  operationFactoryImplementations.size !==
  [...algorithms.values()].filter(({ category }) => category !== 'key').length
) {
  throw new Error('factory implementation graph assertions contain an unknown algorithm')
}

function incidentalAlgorithmMarker(selected, candidate) {
  return (
    (selected.startsWith('RSA_OAEP_') && candidate === 'RSA_OAEP') ||
    (selected === 'EdDSA' && candidate === 'Ed25519') ||
    (selected.endsWith('_A128KW') && candidate === 'A128KW') ||
    (selected.endsWith('_A192KW') && candidate === 'A192KW') ||
    (selected.endsWith('_A256KW') && candidate === 'A256KW')
  )
}

function assertSelectedCatalogs(result, fixture, selectedSubpaths, label) {
  const catalogsBySubpath = factoryCatalogs.get(fixture.label)
  const selectedCatalogs = new Set(
    selectedSubpaths.map((subpath) => catalogsBySubpath.get(subpath)),
  )
  for (const [subpath, catalog] of catalogsBySubpath) {
    const retained = result.inputs.has(catalog)
    if (retained !== selectedCatalogs.has(catalog)) {
      throw new Error(`${label} ${retained ? 'retained' : 'dropped'} factory catalog (${subpath})`)
    }
  }
}

function assertImplementationSelection(result, expected, label) {
  for (const implementation of implementationModules) {
    const retained = hasInput(result.inputs, implementation)
    if (retained !== expected.includes(implementation)) {
      throw new Error(`${label} ${retained ? 'retained' : 'dropped'} ${implementation}`)
    }
  }
}

function assertHandlerSelection(output, expected, label) {
  for (const handler of handlerMarkers) {
    const retained = output.includes(handler)
    if (retained !== expected.includes(handler)) {
      throw new Error(`${label} ${retained ? 'retained' : 'dropped'} ${handler}`)
    }
  }
}

let bundledExports = 0
for (const fixture of moduleFixtures) {
  for (const catalog of catalogs) {
    const filename = moduleFile(catalog.source, fixture)
    for (const name of catalog.exports) {
      const specifier =
        fixture.label === 'distribution' ? `jose/${catalog.subpath}` : `./${filename}`
      const result = await bundle(
        `import { ${name} } from '${specifier}'\nglobalThis.__joseTreeShakingResult = ${name}\n`,
        `${fixture.label}-${name}.ts`,
      )
      const facades = publicAlgorithmFacades(result.metafile)
      if (facades.length !== 1 || !facades[0].endsWith(filename)) {
        throw new Error(
          `${fixture.label} ${name} included unexpected catalogs: ${facades.join(', ')}`,
        )
      }
      const label = `${fixture.label} ${name}`
      assertSelectedCatalogs(result, fixture, [catalog.subpath], label)
      assertNoFullRegistry(result.inputs, label)
      assertImplementationSelection(
        result,
        catalog.category === 'key' ? [] : operationFactoryImplementations.get(name),
        label,
      )
      assertHandlerSelection(
        result.output,
        catalog.category === 'key' ? [] : (operationFactoryHandlers.get(name) ?? []),
        label,
      )
      if (catalog.category === 'key') assertNoKeyOperationModules(result.inputs, label)
      const selectedAlgorithm = algorithms.get(`${catalog.subpath}:${name}`).algorithm
      assertIncludes(result.output, JSON.stringify(selectedAlgorithm), label)
      for (const { name: candidate, algorithm } of algorithms.values()) {
        if (algorithm !== selectedAlgorithm && !incidentalAlgorithmMarker(name, candidate)) {
          assertExcludes(result.output, JSON.stringify(algorithm), label)
        }
      }
      bundledExports++
    }
  }

  for (const composer of composers) {
    const filename = moduleFile(composer.source, fixture)
    const specifier =
      fixture.label === 'distribution' ? `jose/${composer.subpath}` : `./${filename}`
    const result = await bundle(
      `import { ${composer.name} } from '${specifier}'\nglobalThis.__joseTreeShakingResult = ${composer.name}\n`,
      `${fixture.label}-${composer.name}.ts`,
    )
    const facades = publicAlgorithmFacades(result.metafile)
    if (facades.length !== 0) {
      throw new Error(`${fixture.label} ${composer.name} included catalogs: ${facades.join(', ')}`)
    }
    assertSelectedCatalogs(result, fixture, [], `${fixture.label} ${composer.name}`)
    assertNoFullRegistry(result.inputs, `${fixture.label} ${composer.name}`)
    bundledExports++
  }
}

const deepFixtures = [
  {
    name: 'Ed25519+ES256 JWS JWT pair',
    imports: [
      ['composable/jwt/sign', ['composeSignJWT']],
      ['composable/jwt/verify', ['composeJwtVerify']],
      ['algorithms/jws', ['Ed25519', 'ES256']],
    ],
    expression: '[composeSignJWT(Ed25519, ES256), composeJwtVerify(Ed25519, ES256)]',
    selected: ['Ed25519', 'ES256'],
    implementations: [],
    primitives: ['ECDSA', 'Ed25519'],
    required: ['P-256'],
  },
  {
    name: 'ES256 SignJWT',
    imports: [
      ['composable/jwt/sign', ['composeSignJWT']],
      ['algorithms/jws', ['ES256']],
    ],
    expression: 'composeSignJWT(ES256)',
    selected: ['ES256'],
    implementations: [],
    primitives: ['ECDSA'],
    required: ['P-256'],
  },
  {
    name: 'PS512 compact verify',
    imports: [
      ['composable/jws/compact/verify', ['composeCompactVerify']],
      ['algorithms/jws', ['PS512']],
    ],
    expression: 'composeCompactVerify(PS512)',
    selected: ['PS512'],
    implementations: [],
    primitives: ['RSA-PSS'],
    required: [],
  },
  {
    name: 'HS256 flattened sign',
    imports: [
      ['composable/jws/flattened/sign', ['composeFlattenedSign']],
      ['algorithms/jws', ['HS256']],
    ],
    expression: 'composeFlattenedSign(HS256)',
    selected: ['HS256'],
    implementations: [],
    primitives: ['HMAC'],
    required: [],
  },
  {
    name: 'Ed25519 general verify',
    imports: [
      ['composable/jws/general/verify', ['composeGeneralVerify']],
      ['algorithms/jws', ['Ed25519']],
    ],
    expression: 'composeGeneralVerify(Ed25519)',
    selected: ['Ed25519'],
    implementations: [],
    primitives: ['Ed25519'],
    required: [],
  },
  {
    name: 'ML-DSA general sign',
    imports: [
      ['composable/jws/general/sign', ['composeGeneralSign']],
      ['algorithms/jws', ['ML_DSA_44']],
    ],
    expression: 'composeGeneralSign(ML_DSA_44)',
    selected: ['ML_DSA_44'],
    implementations: [],
    primitives: ['ML-DSA'],
    required: ['ML-DSA-44'],
  },
  {
    name: 'dir+A256GCM EncryptJWT',
    imports: [
      ['composable/jwt/encrypt', ['composeEncryptJWT']],
      ['algorithms/jwe', ['dir']],
      ['algorithms/jwe/enc', ['A256GCM']],
    ],
    expression: 'composeEncryptJWT(dir, A256GCM)',
    selected: ['dir', 'A256GCM'],
    implementations: ['lib/jwe_aes_gcm'],
    primitives: ['AES-GCM'],
    required: [],
  },
  {
    name: 'RSA-OAEP compact encrypt',
    imports: [
      ['composable/jwe/compact/encrypt', ['composeCompactEncrypt']],
      ['algorithms/jwe', ['RSA_OAEP_256']],
      ['algorithms/jwe/enc', ['A256GCM']],
    ],
    expression: 'composeCompactEncrypt(RSA_OAEP_256, A256GCM)',
    selected: ['RSA_OAEP_256', 'A256GCM'],
    implementations: ['lib/jwe_aes_gcm'],
    primitives: ['RSA-OAEP', 'AES-GCM'],
    required: [],
  },
  {
    name: 'ECDH+KW flattened encrypt',
    imports: [
      ['composable/jwe/flattened/encrypt', ['composeFlattenedEncrypt']],
      ['algorithms/jwe', ['ECDH_ES_A128KW']],
      ['algorithms/jwe/enc', ['A192GCM']],
    ],
    expression: 'composeFlattenedEncrypt(A192GCM, ECDH_ES_A128KW)',
    selected: ['ECDH_ES_A128KW', 'A192GCM'],
    implementations: ['lib/jwe_aes_gcm'],
    primitives: ['HMAC', 'ECDH', 'AES-KW', 'AES-GCM'],
    required: [],
  },
  {
    name: 'PBES2+CBC-HMAC general decrypt',
    imports: [
      ['composable/jwe/general/decrypt', ['composeGeneralDecrypt']],
      ['algorithms/jwe', ['PBES2_HS256_A128KW']],
      ['algorithms/jwe/enc', ['A128CBC_HS256']],
    ],
    expression: 'composeGeneralDecrypt(A128CBC_HS256, PBES2_HS256_A128KW)',
    selected: ['PBES2_HS256_A128KW', 'A128CBC_HS256'],
    implementations: [],
    primitives: ['HMAC', 'AES-KW', 'AES-CBC', 'PBKDF2'],
    required: [],
  },
  {
    name: 'AES-GCM-KW+CBC-HMAC general encrypt',
    imports: [
      ['composable/jwe/general/encrypt', ['composeGeneralEncrypt']],
      ['algorithms/jwe', ['A256GCMKW']],
      ['algorithms/jwe/enc', ['A256CBC_HS512']],
    ],
    expression: 'composeGeneralEncrypt(A256GCMKW, A256CBC_HS512)',
    selected: ['A256GCMKW', 'A256CBC_HS512'],
    implementations: ['lib/jwe_aes_gcm'],
    primitives: ['HMAC', 'AES-GCM', 'AES-CBC'],
    required: [],
  },
  {
    name: 'ES256 local+remote JWKS',
    imports: [
      ['composable/jwks/local', ['composeLocalJWKSet']],
      ['composable/jwks/remote', ['composeRemoteJWKSet']],
      ['algorithms/jws', ['ES256']],
    ],
    expression: '[composeLocalJWKSet(ES256), composeRemoteJWKSet(ES256)]',
    selected: ['ES256'],
    implementations: ['lib/local_jwks', 'lib/remote_jwks'],
    primitives: ['ECDSA'],
    required: ['P-256'],
  },
  {
    name: 'Ed25519+ES256 Embedded JWK',
    imports: [
      ['composable/jwk/embedded', ['composeEmbeddedJWK']],
      ['algorithms/jws', ['Ed25519', 'ES256']],
    ],
    expression: 'composeEmbeddedJWK(Ed25519, ES256)',
    selected: ['Ed25519', 'ES256'],
    implementations: [],
    primitives: ['ECDSA', 'Ed25519'],
    required: ['P-256'],
  },
  {
    name: 'Ed25519+ES256 key import',
    imports: [
      ['composable/key/import', ['composeKeyImport']],
      ['algorithms/key', ['Ed25519', 'ES256']],
    ],
    expression: 'composeKeyImport(Ed25519, ES256)',
    selected: ['Ed25519', 'ES256'],
    implementations: [],
    primitives: ['ECDSA', 'Ed25519'],
    required: ['P-256'],
  },
  {
    name: 'Ed25519+ES256 key-pair generation',
    imports: [
      ['composable/key/generate/keypair', ['composeGenerateKeyPair']],
      ['algorithms/key', ['Ed25519', 'ES256']],
    ],
    expression: 'composeGenerateKeyPair(Ed25519, ES256)',
    selected: ['Ed25519', 'ES256'],
    implementations: [],
    primitives: ['ECDSA', 'Ed25519'],
    allowedPrimitives: ['ECDH'],
    required: ['P-256'],
  },
  {
    name: 'A256GCM+A256CBC-HS512 secret generation',
    imports: [
      ['composable/key/generate/secret', ['composeGenerateSecret']],
      ['algorithms/key', ['A256GCM', 'A256CBC_HS512']],
    ],
    expression: 'composeGenerateSecret(A256GCM, A256CBC_HS512)',
    selected: ['A256GCM', 'A256CBC_HS512'],
    implementations: [],
    primitives: ['AES-GCM', 'AES-CBC'],
    // The compact generator currently has a shared switch for all symmetric key shapes. These
    // names may remain without retaining signing/encryption handlers or unselected recipes.
    allowedPrimitives: ['HMAC', 'AES-KW'],
    required: [],
  },
  {
    name: 'dir+A256GCM+DEF JWT decrypt',
    imports: [
      ['composable/jwt/decrypt', ['composeJwtDecrypt']],
      ['algorithms/jwe', ['dir']],
      ['algorithms/jwe/enc', ['A256GCM']],
      ['algorithms/jwe/zip', ['DEF']],
    ],
    expression: 'composeJwtDecrypt(DEF, A256GCM, dir)',
    selected: ['dir', 'A256GCM', 'DEF'],
    implementations: ['lib/jwe_aes_gcm'],
    primitives: ['AES-GCM', 'deflate-raw'],
    required: [],
  },
]

function moduleSource(subpath, fixture) {
  if (fixture.label === 'distribution') return subpath === '.' ? 'jose' : `jose/${subpath}`
  if (subpath === '.') return './src/index.ts'
  const source = composers.find((entry) => entry.subpath === subpath)?.source ?? subpath
  return `./src/${source}.ts`
}

function deepEntry(fixture, moduleFixture) {
  const imports = fixture.imports
    .map(
      ([subpath, names]) =>
        `import { ${names.join(', ')} } from '${moduleSource(subpath, moduleFixture)}'`,
    )
    .join('\n')
  return `${imports}\nglobalThis.__joseTreeShakingResult = ${fixture.expression}\n`
}

function selectedAlgorithmRecords(fixture) {
  return fixture.imports.flatMap(([subpath, names]) => {
    if (!subpath.startsWith('algorithms/')) return []
    return names.map((name) => {
      const record = algorithms.get(`${subpath}:${name}`)
      if (record === undefined) throw new Error(`${subpath} does not describe ${name}`)
      return record
    })
  })
}

function assertDeepGraph(result, fixture, moduleFixture, label) {
  assertSelectedCatalogs(
    result,
    moduleFixture,
    fixture.imports
      .map(([subpath]) => subpath)
      .filter((subpath) => subpath.startsWith('algorithms/')),
    label,
  )
  assertNoFullRegistry(result.inputs, label)
  if (fixture.imports.some(([subpath]) => subpath === 'algorithms/key')) {
    assertNoKeyOperationModules(result.inputs, label)
  }
  if (fixture.imports.some(([subpath]) => subpath === 'algorithms/jws')) {
    if (hasInput(result.inputs, 'lib/algorithm')) {
      throw new Error(`${label} retained the obsolete generic four-family loader`)
    }
    assertExcludes(result.output, 'Invalid algorithm key descriptor', label)
  }

  for (const implementation of implementationModules) {
    const retained = hasInput(result.inputs, implementation)
    const expected = fixture.implementations.includes(implementation)
    if (retained !== expected) {
      throw new Error(`${label} ${retained ? 'retained' : 'dropped'} ${implementation}`)
    }
  }

  assertHandlerSelection(
    result.output,
    selectedAlgorithmRecords(fixture)
      .filter(({ category }) => category !== 'key')
      .flatMap(({ name }) => operationFactoryHandlers.get(name) ?? []),
    label,
  )

  const selectedRecords = selectedAlgorithmRecords(fixture)
  const selectedAlgorithms = new Set(selectedRecords.map(({ algorithm }) => algorithm))
  for (const { algorithm } of selectedRecords) {
    assertIncludes(result.output, JSON.stringify(algorithm), label)
  }
  for (const { name, algorithm } of algorithms.values()) {
    // Some WebCrypto primitive names are also JWA identifiers. For example, a
    // selected RSA-OAEP-256 implementation necessarily contains "RSA-OAEP" even
    // when the base RSA-OAEP factory itself was not retained.
    if (
      !selectedAlgorithms.has(algorithm) &&
      !fixture.primitives.includes(algorithm) &&
      !selectedRecords.some((selected) => incidentalAlgorithmMarker(selected.name, name))
    ) {
      assertExcludes(result.output, JSON.stringify(algorithm), label)
    }
  }
  for (const marker of primitiveMarkers) {
    if (fixture.primitives.includes(marker)) assertIncludes(result.output, marker, label)
    else if (!fixture.allowedPrimitives?.includes(marker))
      assertExcludes(result.output, marker, label)
  }
  for (const marker of fixture.required) assertIncludes(result.output, marker, label)
}

const sizeReports = []
for (const moduleFixture of moduleFixtures) {
  for (const fixture of deepFixtures) {
    const name = `${moduleFixture.label} ${fixture.name}`
    const entry = deepEntry(fixture, moduleFixture)
    const [readable, minified] = await Promise.all([
      bundle(entry, `${name}.ts`),
      bundle(entry, `${name}.min.ts`, true),
    ])
    assertDeepGraph(readable, fixture, moduleFixture, name)
    const bytes = Buffer.byteLength(minified.output)
    sizeReports.push(
      `${name} ${bytes}/${gzipSync(minified.output).length}/${brotliCompressSync(minified.output).length}`,
    )
  }
}

for (const moduleFixture of moduleFixtures) {
  const legacyKeyEntry =
    moduleFixture.label === 'distribution'
      ? `import { generateKeyPair } from 'jose/key/generate/keypair'
import { importJWK } from 'jose/key/import'
globalThis.__joseTreeShakingResult = [generateKeyPair, importJWK]
`
      : `import { generateKeyPair } from './src/key/generate_key_pair.ts'
import { importJWK } from './src/key/import.ts'
globalThis.__joseTreeShakingResult = [generateKeyPair, importJWK]
`
  const legacyKey = await bundle(
    legacyKeyEntry,
    `${moduleFixture.label}-legacy-keypair-import.min.ts`,
    true,
  )
  assertSelectedCatalogs(
    legacyKey,
    moduleFixture,
    [],
    `${moduleFixture.label} legacy key pair/import`,
  )
  assertNoFullRegistry(legacyKey.inputs, `${moduleFixture.label} legacy key pair/import`)
  assertNoKeyOperationModules(legacyKey.inputs, `${moduleFixture.label} legacy key pair/import`)
  const legacyKeyBytes = Buffer.byteLength(legacyKey.output)
  sizeReports.push(
    `${moduleFixture.label} legacy key pair/import ${legacyKeyBytes}/${gzipSync(legacyKey.output).length}/${brotliCompressSync(legacyKey.output).length}`,
  )

  const independent = await bundle(
    `import { base64url, decodeJwt, decodeProtectedHeader, errors } from '${moduleSource('.', moduleFixture)}'\nglobalThis.__joseTreeShakingResult = [base64url, decodeJwt, decodeProtectedHeader, errors]\n`,
    `${moduleFixture.label}-root-independent.ts`,
  )
  assertSelectedCatalogs(independent, moduleFixture, [], `${moduleFixture.label} root independent`)
  assertNoComposableInfrastructure(independent.inputs, `${moduleFixture.label} root independent`)
  assertNoFullRegistry(independent.inputs, `${moduleFixture.label} root independent`)
  for (const implementation of implementationModules) {
    if (hasInput(independent.inputs, implementation)) {
      throw new Error(`${moduleFixture.label} root independent retained ${implementation}`)
    }
  }
  assertHandlerSelection(independent.output, [], `${moduleFixture.label} root independent`)
  for (const { algorithm } of algorithms.values()) {
    assertExcludes(
      independent.output,
      JSON.stringify(algorithm),
      `${moduleFixture.label} root independent`,
    )
  }

  const completeEntry = `import * as jose from '${moduleSource('.', moduleFixture)}'\nglobalThis.__joseTreeShakingResult = jose\n`
  const [complete, completeMinified] = await Promise.all([
    bundle(completeEntry, `${moduleFixture.label}-root-complete.ts`),
    bundle(completeEntry, `${moduleFixture.label}-root-complete.min.ts`, true),
  ])
  // The compatibility root is fully capable and builds its trusted selections through the same
  // public factories without retaining the composable validation path.
  assertSelectedCatalogs(
    complete,
    moduleFixture,
    catalogs.filter(({ category }) => category !== 'key').map(({ subpath }) => subpath),
    `${moduleFixture.label} root`,
  )
  assertNoComposableInfrastructure(complete.inputs, `${moduleFixture.label} root`)
  for (const implementation of implementationModules) {
    if (!hasInput(complete.inputs, implementation)) {
      throw new Error(`${moduleFixture.label} complete root dropped ${implementation}`)
    }
  }
  assertHandlerSelection(complete.output, handlerMarkers, `${moduleFixture.label} complete root`)
  for (const { algorithm } of algorithms.values()) {
    assertIncludes(
      complete.output,
      JSON.stringify(algorithm),
      `${moduleFixture.label} complete root`,
    )
  }
  const completeBytes = Buffer.byteLength(completeMinified.output)
  sizeReports.push(
    `${moduleFixture.label} root ${completeBytes}/${gzipSync(completeMinified.output).length}/${brotliCompressSync(completeMinified.output).length}`,
  )
}

const report = `${bundledExports} source/distribution exports; sizes are raw/gzip/brotli bytes: ${sizeReports.join(', ')}`
console.log(`tree-shaking OK: ${report}`)
