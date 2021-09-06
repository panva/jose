import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import test from 'ava';
import { Client, request } from 'undici';

const { CF_ACCOUNT_ID, CF_API_TOKEN } = process.env;

const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts`;
const authorization = `Bearer ${CF_API_TOKEN}`;
const TEMPLATE = readFileSync(`./test-cloudflare-workers/template.js`);

test.before(async () => {
  const { body } = await request(baseUrl, {
    method: 'GET',
    headers: { authorization },
  });
  const { result } = await body.json();
  for (const { id } of result) {
    request(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { authorization },
    });
  }
});

test.beforeEach((t) => {
  t.context.uuid = randomUUID();
  t.context.file = `./test-cloudflare-workers/.${t.context.uuid}.js`;
});

test.afterEach.always(async (t) => {
  let statusCode;
  do {
    ({ statusCode } = await request(`${baseUrl}/${t.context.uuid}`, {
      method: 'DELETE',
      headers: { authorization },
    }));
    await setTimeout(1000);
  } while (statusCode !== 200);
});

const macro = async (t, testScript) => {
  writeFileSync(t.context.file, `${TEMPLATE}\ntest = ${testScript.toString()}`);

  execSync(`deno bundle ${t.context.file} ${t.context.file}`, { stdio: 'ignore' });

  let statusCode;
  do {
    ({ statusCode } = await request(`${baseUrl}/${t.context.uuid}`, {
      method: 'PUT',
      headers: { authorization, 'content-type': 'application/javascript' },
      body: readFileSync(t.context.file),
    }));
    t.log(`PUT ${statusCode}`);
    await setTimeout(1000);
  } while (statusCode !== 200);
  unlinkSync(t.context.file);

  do {
    ({ statusCode } = await request(`${baseUrl}/${t.context.uuid}/subdomain`, {
      method: 'POST',
      headers: { authorization, 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    }));
    t.log(`POST ${statusCode}`);
    await setTimeout(1000);
  } while (statusCode !== 200);

  statusCode = 0;
  let body;
  let i = 0;
  do {
    ({ statusCode, body } = await new Client(`https://${t.context.uuid}.panva.workers.dev`).request(
      {
        path: '/',
        method: 'GET',
      },
    ));
    i++
    await setTimeout(1000);
  } while (statusCode !== 200 && statusCode !== 400);

  t.log(`${i}s until execution`);
  if (statusCode === 200) {
    t.pass();
  } else {
    t.log(await body.json());
    t.fail();
  }
};

test('HS256', macro, async () => {
  const alg = 'HS256';
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('HS384', macro, async () => {
  const alg = 'HS384';
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('HS512', macro, async () => {
  const alg = 'HS512';
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('RS256', macro, async () => {
  const alg = 'RS256';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('RS384', macro, async () => {
  const alg = 'RS384';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('RS512', macro, async () => {
  const alg = 'RS512';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS256', macro, async () => {
  const alg = 'PS256';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS384', macro, async () => {
  const alg = 'PS384';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS512', macro, async () => {
  const alg = 'PS512';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES256', macro, async () => {
  const alg = 'ES256';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES384', macro, async () => {
  const alg = 'ES384';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES512', macro, async () => {
  const alg = 'ES512';
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('createRemoteJWKSet', macro, async () => {
  const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs';
  const response = await fetch(jwksUri).then((r) => r.json());
  const { alg, kid } = response.keys[0];
  const jwks = jwksRemote(new URL(jwksUri));
  await jwks({ alg, kid });
});

test('ECDH-ES', macro, async () => {
  const keypair = await utilGenerateKeyPair('ECDH-ES');
  await jweAsymmetricTest(keypair, 'ECDH-ES');
});

test('ECDH-ES crv: P-256', macro, async () => {
  const keypair = await utilGenerateKeyPair('ECDH-ES', { crv: 'P-256' });
  await jweAsymmetricTest(keypair, 'ECDH-ES');
});

test('ECDH-ES crv: P-384', macro, async () => {
  const keypair = await utilGenerateKeyPair('ECDH-ES', { crv: 'P-384' });
  await jweAsymmetricTest(keypair, 'ECDH-ES');
});

test('ECDH-ES crv: P-521', macro, async () => {
  const keypair = await utilGenerateKeyPair('ECDH-ES', { crv: 'P-521' });
  await jweAsymmetricTest(keypair, 'ECDH-ES');
});

test('RSA-OAEP-256', macro, async () => {
  const keypair = await utilGenerateKeyPair('RSA-OAEP-256');
  await jweAsymmetricTest(keypair, 'RSA-OAEP-256');
});

test('RSA-OAEP-384', macro, async () => {
  const keypair = await utilGenerateKeyPair('RSA-OAEP-384');
  await jweAsymmetricTest(keypair, 'RSA-OAEP-384');
});

test('RSA-OAEP-512', macro, async () => {
  const keypair = await utilGenerateKeyPair('RSA-OAEP-512');
  await jweAsymmetricTest(keypair, 'RSA-OAEP-512');
});

test('RSA-OAEP', macro, async () => {
  const keypair = await utilGenerateKeyPair('RSA-OAEP');
  await jweAsymmetricTest(keypair, 'RSA-OAEP');
});

test('A128CBC-HS256', macro, async () => {
  const secretKey = await utilGenerateSecret('A128CBC-HS256');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A128CBC-HS256' });
});

test('A128GCM', macro, async () => {
  const secretKey = await utilGenerateSecret('A128GCM');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A128GCM' });
});

test('A192CBC-HS384', macro, async () => {
  const secretKey = await utilGenerateSecret('A192CBC-HS384');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A192CBC-HS384' });
});

test('A192GCM', macro, async () => {
  const secretKey = await utilGenerateSecret('A192GCM');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A192GCM' });
});

test('A256CBC-HS512', macro, async () => {
  const secretKey = await utilGenerateSecret('A256CBC-HS512');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A256CBC-HS512' });
});

test('A256GCM', macro, async () => {
  const secretKey = await utilGenerateSecret('A256GCM');
  await jweSymmetricTest(secretKey, { alg: 'dir', enc: 'A256GCM' });
});

test('A128GCMKW', macro, async () => {
  const secretKey = await utilGenerateSecret('A128GCMKW');
  await jweSymmetricTest(secretKey, { alg: 'A128GCMKW', enc: 'A256GCM' });
});

test('A128KW', macro, async () => {
  const secretKey = await utilGenerateSecret('A128KW');
  await jweSymmetricTest(secretKey, { alg: 'A128KW', enc: 'A256GCM' });
});

test('A192GCMKW', macro, async () => {
  const secretKey = await utilGenerateSecret('A192GCMKW');
  await jweSymmetricTest(secretKey, { alg: 'A192GCMKW', enc: 'A256GCM' });
});

test('A192KW', macro, async () => {
  const secretKey = await utilGenerateSecret('A192KW');
  await jweSymmetricTest(secretKey, { alg: 'A192KW', enc: 'A256GCM' });
});

test('A256GCMKW', macro, async () => {
  const secretKey = await utilGenerateSecret('A256GCMKW');
  await jweSymmetricTest(secretKey, { alg: 'A256GCMKW', enc: 'A256GCM' });
});

test('A256KW', macro, async () => {
  const secretKey = await utilGenerateSecret('A256KW');
  await jweSymmetricTest(secretKey, { alg: 'A256KW', enc: 'A256GCM' });
});

test('PBES2-HS256+A128KW', macro, async () => {
  const secretKey = utilRandom(new Uint8Array(10));
  await jweSymmetricTest(secretKey, { alg: 'PBES2-HS256+A128KW', enc: 'A256GCM' });
});

test('PBES2-HS384+A192KW', macro, async () => {
  const secretKey = utilRandom(new Uint8Array(10));
  await jweSymmetricTest(secretKey, { alg: 'PBES2-HS384+A192KW', enc: 'A256GCM' });
});

test('PBES2-HS512+A256KW', macro, async () => {
  const secretKey = utilRandom(new Uint8Array(10));
  await jweSymmetricTest(secretKey, { alg: 'PBES2-HS512+A256KW', enc: 'A256GCM' });
});
