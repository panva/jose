import jweCompactEncrypt from '../dist/browser/jwe/compact/encrypt.js';
import jweFlattenedEncrypt from '../dist/browser/jwe/flattened/encrypt.js';
import jwsCompactSign from '../dist/browser/jws/compact/sign.js';
import jwsFlattenedSign from '../dist/browser/jws/flattened/sign.js';
import jwsGeneralSign from '../dist/browser/jws/general/sign.js';
import jwtEncrypt from '../dist/browser/jwt/encrypt.js';
import jwtSign from '../dist/browser/jwt/sign.js';
import jwtUnsecured from '../dist/browser/jwt/unsecured.js';
import jweCompactDecrypt from '../dist/browser/jwe/compact/decrypt.js';
import jweFlattenedDecrypt from '../dist/browser/jwe/flattened/decrypt.js';
import jweGeneralDecrypt from '../dist/browser/jwe/general/decrypt.js';
import jwkEmbedded from '../dist/browser/jwk/embedded.js';
import jwkFromKeyLike from '../dist/browser/jwk/from_key_like.js';
import jwkParse from '../dist/browser/jwk/parse.js';
import jwkThumbprint from '../dist/browser/jwk/thumbprint.js';
import jwksRemote from '../dist/browser/jwks/remote.js';
import jwsCompactVerify from '../dist/browser/jws/compact/verify.js';
import jwsFlattenedVerify from '../dist/browser/jws/flattened/verify.js';
import jwsGeneralVerify from '../dist/browser/jws/general/verify.js';
import jwtDecrypt from '../dist/browser/jwt/decrypt.js';
import jwtVerify from '../dist/browser/jwt/verify.js';
import utilDecodeProtectedHeader from '../dist/browser/util/decode_protected_header.js';
import utilGenerateKeyPair from '../dist/browser/util/generate_key_pair.js';
import utilGenerateSecret from '../dist/browser/util/generate_secret.js';
import utilRandom from '../dist/browser/util/random.js';

const headers = { 'content-type': 'application/json' };
function respond(status, error) {
  const body = {};
  if (status !== 200) {
    body.error = error.stack;
  }
  return new Response(JSON.stringify(body), { headers, status });
}
const success = respond.bind(undefined, 200);
const failure = respond.bind(undefined, 400);
addEventListener('fetch', (event) => {
  event.respondWith(test().then(success, failure));
});

async function jweAsymmetricTest({ publicKey, privateKey }, alg) {
  const jwe = await new jweFlattenedEncrypt(utilRandom(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(utilRandom(new Uint8Array(32)))
    .encrypt(publicKey);

  utilDecodeProtectedHeader(jwe);
  await jweFlattenedDecrypt(jwe, privateKey);
}

async function jwsAsymmetricTest({ publicKey, privateKey }, alg) {
  const jws = await new jwsFlattenedSign(utilRandom(new Uint8Array(32)))
    .setProtectedHeader({ alg })
    .sign(privateKey);

  utilDecodeProtectedHeader(jws);
  await jwsFlattenedVerify(jws, publicKey);
}

async function jwsSymmetricTest(secretKey, alg) {
  const jws = await new jwsFlattenedSign(utilRandom(new Uint8Array(32)))
    .setProtectedHeader({ alg })
    .sign(secretKey);

  utilDecodeProtectedHeader(jws);
  await jwsFlattenedVerify(jws, secretKey);
}

async function jweSymmetricTest(secretKey, { alg, enc }) {
  const jwe = await new jweFlattenedEncrypt(utilRandom(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(utilRandom(new Uint8Array(32)))
    .encrypt(secretKey);

  utilDecodeProtectedHeader(jwe);
  await jweFlattenedDecrypt(jwe, secretKey);
}
