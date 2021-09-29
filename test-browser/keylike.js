import * as Bowser from 'bowser';

import { importJWK } from '../dist/browser/key/import.js';
import { exportJWK } from '../dist/browser/key/export.js';
import calculateThumbprint from '../dist/browser/jwk/thumbprint.js';

const browser = Bowser.parse(window.navigator.userAgent);

const p521 = browser.engine.name !== 'WebKit';

async function test(jwk, alg, assert) {
  await calculateThumbprint(jwk);
  const keyLike = await importJWK({ ...jwk, ext: true }, alg);
  assert.deepEqual(await exportJWK(keyLike), jwk);
}

async function failing(jwk, alg, assert) {
  await calculateThumbprint(jwk);
  await assert.rejects(test.bind(undefined, jwk, alg)(assert));
}

const expectSuccess = [
  [
    'RS256',
    '{"kty":"RSA","n":"rcbWc-i_C8NtS4CpPcMF3QC025re_zzrhv-3ElzxAsMCCepwEqxCzQtsG7mAtROdGR1N_oNPNqr3jmEZdv5C5NtpPeX_gk4-r30_JLXcGNgVbZpmWVSmUI-nrU0cC3kjMS4RUPx7uDQxAUiVUq0k13qjEbEgcZAA3nEH2zuQWg3iWSmwYL0h1VxdINQ-WZZzBJsI_ONyBS5z3-vbyhtnMbgALRZSvNcYpODrH9AEIWNJhcaBVr1vKBdNT76KOl87ilLiKE1dOr72sLJDDsVqXDfxCjU_wdt2bF-YFcKwlYa5Aj2JF-UH7KLniC3P-2sS1zduLoAPAkyLcHgVdOifhQ","e":"AQAB"}',
  ],
  [
    'RS384',
    '{"kty":"RSA","n":"yKV00L6PwdO6DGMgsNwuWZ0xviGMqq7nvkULJ8jyQil8viSUvxDMPDZ80CoHUkgobcBU1DasjGO9nTthPYhcpOFh8Fzat1aG-z5Ola2FBHqpdJpwb7lxsLfq6UJy1bial5RCMrLdW3NhuCxIfhnGmvq4hFLAF7gBnEfkbN9qsrzyZruEGIlNG50r779axmgnRZDZ6YS5o_DVbn27f2yCjBLVYIljW5z9CSm6_NjSYVdeNujrgQUWMIrCZiJqmRSOAvn6GliKXFL7sh5xLh_DiCx1Atr477sBxviLY-tFpeXLOqKJKqZ5GASrspxsO96roE4-I4J-7JgoxYptuKD2Bw","e":"AQAB"}',
  ],
  [
    'RS512',
    '{"kty":"RSA","n":"wdEr4kyCku2F8a2Y45xa1Q-jE5FlkYK6xUDuyckH6U9hhA_1OFaNfTbZ-8ZkXOp0PGzYjCqAk0YxATfnKSc1-PKnOBvBD8FRpgaT61WyOq_yM6YgDrwQvbWTr0r5copjDs4ZA9mrE-bjgvOLut4GpD4NVPWhPkgI45-yYd0H4vjuf36sCe26MBIWBTzInCUdfKTvCdh0Kk__HOENwwke6XrtzvugJymi3zlrdqztq3efJFmA4hvyLzosdBB8g0iWBXFNy51J8RCYygiSXtsPatV1FMVd6ZkTfVrvR3OYJucbuvCbqQwPDB08XjJLXKTE1eolyECk-U-Z_Cg8aNElpw","e":"AQAB"}',
  ],
  [
    'PS256',
    '{"kty":"RSA","n":"5Yv7aQulm2VYKjSfwPQLSEokqtWu-TxKKkRKT_570Yjk0fIg81IbK5T0SrkBzmEV5bjuoGdVMQf6bvkhOeeborTmbISEE6DCNxN_us3EWJKMKp-OSbeqbvbg252l_wPhcC5OC0Q--ryOqoRlsCKYgCmDbKNmZepGm8Nf1ayeqj3kIuKmgzU7y4dy4Le8Sq-9aHD5_QW52WqHeEnmIfrVnR7mJsrd7LY-28aflUHaEDn1TzhPPq0W_F1lMkdniM4c5JNU5_6fZ8NVla51j-pt0PmQMz-Ch97ZcnpB7DGdNyBDzdnQiabJ7sOxRK33so8cUFh3zHnaeX73XeGgrpD5XQ","e":"AQAB"}',
  ],
  [
    'PS384',
    '{"kty":"RSA","n":"vyJy0ZJqdGsH3-AGnaw5I35lPhFdWDxxkRn-TBx1GfhIKCjibEjZTCfzBnBdWwIUnr2fL0Vy6VZvTEUcH66r4AJy380ovOJrVIM5nhAGn8uSLCoJ2yiuKeA50gBylINvdAVG7fDzau4-1aSQ1RXILxa88raqDK1h8DQoGZLnRdiKkfNjKmXVltsvDSUxOmKelHh9WLiF2JCs0ydMCCcGDumosLBlP4LR7XfycW2cIavRdxeajL8oyRckD9-IpZLampTkr0Ja4GWHbHnAX-dXmoRDEhqlMeSpKmbm-e95jT_3SHwLj_TLlwF4HsIj-egX78lHcVJzCvhdUG7ogrbjHw","e":"AQAB"}',
  ],
  [
    'PS512',
    '{"kty":"RSA","n":"sSLTDqh1I2Rt26uCFrbdYuRY3lqDes8Az0GQxgatQhXgIG1jOfuEIaqnMRDuWinroRWuetR1ykQ4SxzIy31ms5PSM5sJm1SNAiynO6dxxGMNaCLt4Rgi_fAn6CD0F4mo2OLmxm1_hQH1SJSymG8p8q9Uu0IToY4KEEmHwc1kfiAosvqfLgY1-CRU8kKbFHzq28x7Jbv4WSDccJ_-Wm8BiyMkIUQfzRsC1hHiMO_NKlLwMqeSQ5XyYqsBxc80cF6Z9IIBzXewjCGGVAfYMeimPcJao6wat-PXEr5axEeBeCFU6Q7TDLcMilotGV6f6-UECUK5q2QCXtoOnZ5TO4yPzQ","e":"AQAB"}',
  ],
  [
    'ES256',
    '{"kty":"EC","crv":"P-256","x":"E8KpG0wpGUfRBYx8tUhd6tYaFaTZaIyHvAudXbSUFxQ","y":"gcVDlKTo-UhZ-wHDNUdoQP0M9zevurU6A5WMR07B-wQ"}',
  ],
  [
    'ES384',
    '{"kty":"EC","crv":"P-384","x":"HnBAtgpS-GJzTCdLBELPm1VIRoQwlk7luJIGEYWKhWtMHmOq14Hh7674Oxcc52mE","y":"jXGek8Zapkjav7mO-KB-7vEWrqNxHSoXgNn1r6C0BiqS89SVciz6O8uriPdxoWem"}',
  ],
  ['HS256', '{"kty":"oct","k":"iPYq7qKZWRaVmo1FiJ17M84uADey7-veCAEEsxpPTus"}'],
  ['HS384', '{"kty":"oct","k":"ATgNcVOYFsjbN4GeyXOyryfqqmGp_48-uvVd5J3GsX7ExUMp3WNTDbbZK_5kTjND"}'],
  [
    'HS512',
    '{"kty":"oct","k":"2O5x_zEOhSIDiGcOAOYhB1dyDU_ZW27rl-_xDpKE-8tBlL91z6p_8aYo3by6AOsa6ycx6-JC9LBAio0amINXTQ"}',
  ],
];
const expectFailure = [
  ['EdDSA', '{"kty":"OKP","crv":"Ed25519","x":"zjV_JsgzH--qhtVlJEYDFeRFITSD0k6lYSSpOKBarZQ"}'],
  ['ECDH-ES', '{"kty":"OKP","crv":"X25519","x":"HqyMxA2utODyDFMeCiTiOXmHIG_ih52vOX89gbCI71U"}'],
  [
    'EdDSA',
    '{"kty":"OKP","crv":"Ed448","x":"Wc7ow0-awVkxhTX7Rmkp1dDbR_EJYOH61-Cnx2iFxfq_QhUvIKWpI6UlHoWnKyE0zh4rlKdoJb6A"}',
  ],
  [
    'ECDH-ES',
    '{"kty":"OKP","crv":"X448","x":"v3Lhxa_bdhGUK7NUYHizRQA55sDS68WeZTGYNvFhdxhL519MkWQTt_LlviW84i6ARWyVxlKgBF0"}',
  ],
];

const ES512 = [
  'ES512',
  '{"kty":"EC","crv":"P-521","x":"AIwG869tNnEGIDg2hSyvXKIOk9rWPO_riIixGliBGBV0kB57QoTrjK-g5JCtazDTcBT23igX9gvAVkLvr2oFTQ9p","y":"AeGZ0Z3JHM1rQWvmmpdfVu0zSNpmu0xPjGUE2hGhloRqF-JJV3aVMS72ZhGlbWi-O7OCcypIfndhpYgrc3qx0Y1w"}',
];

if (p521) {
  expectSuccess.push(ES512);
} else {
  expectFailure.push(ES512);
}

for (const [alg, jwk] of expectSuccess) {
  QUnit.test(`Key Import/Export ${alg}`, test.bind(undefined, JSON.parse(jwk), alg));
}

for (const [alg, jwk] of expectFailure) {
  QUnit.test(
    `(expecting failure) Key Import/Export ${alg}`,
    failing.bind(undefined, JSON.parse(jwk), alg),
  );
}
