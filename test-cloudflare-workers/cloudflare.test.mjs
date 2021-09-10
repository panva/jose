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
    i++;
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
  const jwk = JSON.parse('{"kty":"oct","k":"iPYq7qKZWRaVmo1FiJ17M84uADey7-veCAEEsxpPTus"}');
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('HS384', macro, async () => {
  const alg = 'HS384';
  const jwk = JSON.parse(
    '{"kty":"oct","k":"ATgNcVOYFsjbN4GeyXOyryfqqmGp_48-uvVd5J3GsX7ExUMp3WNTDbbZK_5kTjND"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('HS512', macro, async () => {
  const alg = 'HS512';
  const jwk = JSON.parse(
    '{"kty":"oct","k":"2O5x_zEOhSIDiGcOAOYhB1dyDU_ZW27rl-_xDpKE-8tBlL91z6p_8aYo3by6AOsa6ycx6-JC9LBAio0amINXTQ"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const secretKey = await utilGenerateSecret(alg);
  await jwsSymmetricTest(secretKey, alg);
});

test('RS256', macro, async () => {
  const alg = 'RS256';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"rcbWc-i_C8NtS4CpPcMF3QC025re_zzrhv-3ElzxAsMCCepwEqxCzQtsG7mAtROdGR1N_oNPNqr3jmEZdv5C5NtpPeX_gk4-r30_JLXcGNgVbZpmWVSmUI-nrU0cC3kjMS4RUPx7uDQxAUiVUq0k13qjEbEgcZAA3nEH2zuQWg3iWSmwYL0h1VxdINQ-WZZzBJsI_ONyBS5z3-vbyhtnMbgALRZSvNcYpODrH9AEIWNJhcaBVr1vKBdNT76KOl87ilLiKE1dOr72sLJDDsVqXDfxCjU_wdt2bF-YFcKwlYa5Aj2JF-UH7KLniC3P-2sS1zduLoAPAkyLcHgVdOifhQ","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('RS384', macro, async () => {
  const alg = 'RS384';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"yKV00L6PwdO6DGMgsNwuWZ0xviGMqq7nvkULJ8jyQil8viSUvxDMPDZ80CoHUkgobcBU1DasjGO9nTthPYhcpOFh8Fzat1aG-z5Ola2FBHqpdJpwb7lxsLfq6UJy1bial5RCMrLdW3NhuCxIfhnGmvq4hFLAF7gBnEfkbN9qsrzyZruEGIlNG50r779axmgnRZDZ6YS5o_DVbn27f2yCjBLVYIljW5z9CSm6_NjSYVdeNujrgQUWMIrCZiJqmRSOAvn6GliKXFL7sh5xLh_DiCx1Atr477sBxviLY-tFpeXLOqKJKqZ5GASrspxsO96roE4-I4J-7JgoxYptuKD2Bw","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('RS512', macro, async () => {
  const alg = 'RS512';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"wdEr4kyCku2F8a2Y45xa1Q-jE5FlkYK6xUDuyckH6U9hhA_1OFaNfTbZ-8ZkXOp0PGzYjCqAk0YxATfnKSc1-PKnOBvBD8FRpgaT61WyOq_yM6YgDrwQvbWTr0r5copjDs4ZA9mrE-bjgvOLut4GpD4NVPWhPkgI45-yYd0H4vjuf36sCe26MBIWBTzInCUdfKTvCdh0Kk__HOENwwke6XrtzvugJymi3zlrdqztq3efJFmA4hvyLzosdBB8g0iWBXFNy51J8RCYygiSXtsPatV1FMVd6ZkTfVrvR3OYJucbuvCbqQwPDB08XjJLXKTE1eolyECk-U-Z_Cg8aNElpw","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS256', macro, async () => {
  const alg = 'PS256';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"5Yv7aQulm2VYKjSfwPQLSEokqtWu-TxKKkRKT_570Yjk0fIg81IbK5T0SrkBzmEV5bjuoGdVMQf6bvkhOeeborTmbISEE6DCNxN_us3EWJKMKp-OSbeqbvbg252l_wPhcC5OC0Q--ryOqoRlsCKYgCmDbKNmZepGm8Nf1ayeqj3kIuKmgzU7y4dy4Le8Sq-9aHD5_QW52WqHeEnmIfrVnR7mJsrd7LY-28aflUHaEDn1TzhPPq0W_F1lMkdniM4c5JNU5_6fZ8NVla51j-pt0PmQMz-Ch97ZcnpB7DGdNyBDzdnQiabJ7sOxRK33so8cUFh3zHnaeX73XeGgrpD5XQ","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS384', macro, async () => {
  const alg = 'PS384';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"vyJy0ZJqdGsH3-AGnaw5I35lPhFdWDxxkRn-TBx1GfhIKCjibEjZTCfzBnBdWwIUnr2fL0Vy6VZvTEUcH66r4AJy380ovOJrVIM5nhAGn8uSLCoJ2yiuKeA50gBylINvdAVG7fDzau4-1aSQ1RXILxa88raqDK1h8DQoGZLnRdiKkfNjKmXVltsvDSUxOmKelHh9WLiF2JCs0ydMCCcGDumosLBlP4LR7XfycW2cIavRdxeajL8oyRckD9-IpZLampTkr0Ja4GWHbHnAX-dXmoRDEhqlMeSpKmbm-e95jT_3SHwLj_TLlwF4HsIj-egX78lHcVJzCvhdUG7ogrbjHw","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('PS512', macro, async () => {
  const alg = 'PS512';
  const jwk = JSON.parse(
    '{"kty":"RSA","n":"sSLTDqh1I2Rt26uCFrbdYuRY3lqDes8Az0GQxgatQhXgIG1jOfuEIaqnMRDuWinroRWuetR1ykQ4SxzIy31ms5PSM5sJm1SNAiynO6dxxGMNaCLt4Rgi_fAn6CD0F4mo2OLmxm1_hQH1SJSymG8p8q9Uu0IToY4KEEmHwc1kfiAosvqfLgY1-CRU8kKbFHzq28x7Jbv4WSDccJ_-Wm8BiyMkIUQfzRsC1hHiMO_NKlLwMqeSQ5XyYqsBxc80cF6Z9IIBzXewjCGGVAfYMeimPcJao6wat-PXEr5axEeBeCFU6Q7TDLcMilotGV6f6-UECUK5q2QCXtoOnZ5TO4yPzQ","e":"AQAB"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES256', macro, async () => {
  const alg = 'ES256';
  const jwk = JSON.parse(
    '{"kty":"EC","crv":"P-256","x":"E8KpG0wpGUfRBYx8tUhd6tYaFaTZaIyHvAudXbSUFxQ","y":"gcVDlKTo-UhZ-wHDNUdoQP0M9zevurU6A5WMR07B-wQ"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES384', macro, async () => {
  const alg = 'ES384';
  const jwk = JSON.parse(
    '{"kty":"EC","crv":"P-384","x":"HnBAtgpS-GJzTCdLBELPm1VIRoQwlk7luJIGEYWKhWtMHmOq14Hh7674Oxcc52mE","y":"jXGek8Zapkjav7mO-KB-7vEWrqNxHSoXgNn1r6C0BiqS89SVciz6O8uriPdxoWem"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('ES512', macro, async () => {
  const alg = 'ES512';
  const jwk = JSON.parse(
    '{"kty":"EC","crv":"P-521","x":"AIwG869tNnEGIDg2hSyvXKIOk9rWPO_riIixGliBGBV0kB57QoTrjK-g5JCtazDTcBT23igX9gvAVkLvr2oFTQ9p","y":"AeGZ0Z3JHM1rQWvmmpdfVu0zSNpmu0xPjGUE2hGhloRqF-JJV3aVMS72ZhGlbWi-O7OCcypIfndhpYgrc3qx0Y1w"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('EdDSA', macro, async () => {
  const alg = 'EdDSA';
  const jwk = JSON.parse(
    '{"kty":"OKP","crv":"Ed25519","x":"zjV_JsgzH--qhtVlJEYDFeRFITSD0k6lYSSpOKBarZQ"}',
  );
  await jwkThumbprint(jwk);
  await jwkFromKeyLike(await jwkParse({ ...jwk, ext: true }, alg));
  const keypair = await utilGenerateKeyPair(alg);
  await jwsAsymmetricTest(keypair, alg);
});

test('EdDSA crv: Ed25519', macro, async () => {
  const alg = 'EdDSA';
  const keypair = await utilGenerateKeyPair(alg, { crv: 'Ed25519' });
  await jwsAsymmetricTest(keypair, alg);
});

test('EdDSA crv: Ed448', macro, async () => {
  const alg = 'EdDSA';
  const jwk =
    '{"kty":"OKP","crv":"Ed448","x":"Wc7ow0-awVkxhTX7Rmkp1dDbR_EJYOH61-Cnx2iFxfq_QhUvIKWpI6UlHoWnKyE0zh4rlKdoJb6A"}';
  await jwkParse({ ...jwk, ext: true }, alg).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
  await utilGenerateKeyPair(alg, { crv: 'Ed448' }).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
});

test('ECDH-ES crv: X25519', macro, async () => {
  const alg = 'ECDH-ES';
  const jwk = '{"kty":"OKP","crv":"X25519","x":"HqyMxA2utODyDFMeCiTiOXmHIG_ih52vOX89gbCI71U"}';
  await jwkParse({ ...jwk, ext: true }, alg).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
  await utilGenerateKeyPair(alg, { crv: 'X25519' }).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
});

test('ECDH-ES crv: X448', macro, async () => {
  const alg = 'ECDH-ES';
  const jwk =
    '{"kty":"OKP","crv":"X448","x":"v3Lhxa_bdhGUK7NUYHizRQA55sDS68WeZTGYNvFhdxhL519MkWQTt_LlviW84i6ARWyVxlKgBF0"';
  await jwkParse({ ...jwk, ext: true }, alg).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
  await utilGenerateKeyPair(alg, { crv: 'X448' }).then(
    () => {
      throw new Error('should fail');
    },
    () => {},
  );
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
