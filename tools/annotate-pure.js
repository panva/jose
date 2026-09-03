import { readFile, writeFile } from 'node:fs/promises'

const jws = [
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
]

const jwe = [
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
]

const enc = ['A128GCM', 'A192GCM', 'A256GCM', 'A128CBC_HS256', 'A192CBC_HS384', 'A256CBC_HS512']

const catalogs = new Map([
  ['dist/webapi/algorithms/jws.js', jws],
  ['dist/webapi/algorithms/jwe.js', jwe],
  ['dist/webapi/algorithms/jwe/enc.js', enc],
  ['dist/webapi/algorithms/jwe/zip.js', ['DEF']],
  ['dist/webapi/algorithms/key.js', [...jws, ...jwe, ...enc]],
])

for (const [path, exports] of catalogs) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  for (const name of exports) {
    const declaration = new RegExp(
      `(export const ${name}\\s*=\\s*)(?:/\\* @__PURE__ \\*/\\s*)?([A-Za-z_$])`,
    )
    if (!declaration.test(source)) {
      throw new Error(`Missing ${name} factory declaration in ${path}`)
    }
    source = source.replace(declaration, '$1/* @__PURE__ */ $2')
  }
  await writeFile(new URL(`../${path}`, import.meta.url), source)
}

{
  const path = 'dist/webapi/lib/key_algorithm.js'
  let source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  const recipes = [...source.matchAll(/^export const ([A-Za-z0-9_]+Key)\s*=/gm)].map(
    ([, name]) => name,
  )
  if (recipes.length !== 41) {
    throw new Error(`Expected 41 key recipes in ${path}, found ${recipes.length}`)
  }
  for (const name of recipes) {
    const declaration = new RegExp(
      `(export const ${name}\\s*=\\s*)(?:/\\* @__PURE__ \\*/\\s*)?([A-Za-z_$])`,
    )
    source = source.replace(declaration, '$1/* @__PURE__ */ $2')
  }
  const registry = /(const algorithms\s*=\s*)(?:\/\* @__PURE__ \*\/\s*)?([A-Za-z_$])/
  if (!registry.test(source)) throw new Error(`Missing complete key registry in ${path}`)
  source = source.replace(registry, '$1/* @__PURE__ */ $2')
  await writeFile(new URL(`../${path}`, import.meta.url), source)
}
