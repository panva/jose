import { assertEquals, assertThrowsAsync } from 'https://deno.land/std@0.104.0/testing/asserts.ts';

import jwkToKey from '../dist/deno/jwk/parse.ts';
import keyToJwk from '../dist/deno/jwk/from_key_like.ts';
import calculateThumbprint from '../dist/deno/jwk/thumbprint.ts';

async function test(jwk: { [key: string]: unknown }, alg: string) {
  await calculateThumbprint(jwk);
  const keyLike = await jwkToKey({ ...jwk, ext: true }, alg);
  assertEquals(await keyToJwk(keyLike), jwk);
}

async function failing(jwk: { [key: string]: unknown }, alg: string) {
  return assertThrowsAsync(() => test(jwk, alg));
}

for (const [alg, jwk] of [
  [
    'RS256',
    '{"kty":"RSA","n":"rcbWc-i_C8NtS4CpPcMF3QC025re_zzrhv-3ElzxAsMCCepwEqxCzQtsG7mAtROdGR1N_oNPNqr3jmEZdv5C5NtpPeX_gk4-r30_JLXcGNgVbZpmWVSmUI-nrU0cC3kjMS4RUPx7uDQxAUiVUq0k13qjEbEgcZAA3nEH2zuQWg3iWSmwYL0h1VxdINQ-WZZzBJsI_ONyBS5z3-vbyhtnMbgALRZSvNcYpODrH9AEIWNJhcaBVr1vKBdNT76KOl87ilLiKE1dOr72sLJDDsVqXDfxCjU_wdt2bF-YFcKwlYa5Aj2JF-UH7KLniC3P-2sS1zduLoAPAkyLcHgVdOifhQ","e":"AQAB","d":"gJwTJS-RDOyym9l558rJMRoPwCOrfG0ixwPEAuQkPu4COUJ3dWpl-gjFFvPATMNaVjb4_S9DVetMUeSNCyL8cRHtnrD03AR6ojhongu1-_EYUsidjOl4OVFIQJs78UXTBNfaWvyxt89woUmNseWQyaTqwPI9V67C5d3zeY5otCwv-Sb8n-WH3HD7tenz4RwrFZL9jZJWSwEJnBuqGBmKbXp-gzhF8Jy5525yoCCgYxbcCZnX8dewkVc8WFoMhrSFdPeW572RKMzFmqxoE52vLLi8GzcYx7GLrwuoUpu539T0dwVO1yusYJyodm40Lb40E42Zc98GsLTRN7Fbf-nylQ","p":"2ugdCItnOnjc5ZMjSyq0frngZxyaaWWchnTDxTokjaW93Bvzu1hc42J8M-Ux3qyoVrpkF82jZPV66dkM6LRcCq2qtHQHYyvghEr6_Tbn2ls3rJqBxEGgZ6GNa83zBIMFD7IE6SVvlVcY4EWRFza-syy2D8yi_s83ZQBUDAJFHf8","q":"yzkLZo4r0BMnwuMjkDWUh6fb_9PG5kGdOs3gFDhcjfXJPBlq34G5g-VS_I7dP2YinmLJAOvnKaz47Kxf5A3lGvNF5ammxro0Wum9h1KAasPrQEsY0LMqzKqDLMJorfV5FUEd3whllZC8aXfKQIZLrmZMlUgkJQ3u5pTyWTv4yns","dp":"Nh4wH06nZJNAuRjZHtod6T52tccifW_7dFolk_q90q7o8yON7AD6ZdSRNBszawNwUpCd8iyKeokdq_ZW9KiyIImyrA4LTX8pcEtBJZyPUTI_31ILRsOarkQIPGCb9b-WXrz57dGtdlQj-D36kqycFJu3HszOdwQvg67DGHzvLW0","dq":"Rsvdo-Gdc8RokqUsa32u-79Hjg0J-ocbLjQwfvrPi4j3jN9R8wEvTrqiOWfPvdln8AN8AL0t77_ZjCHU2g7ZJJVhYUvD1PFjcdSB-VWNdSRBnUlMINB59YjlX79uVkPw5a2kqWE0enFMofVgWTAvx1bOESdrqBj9hAiZkOqqlmc","qi":"ZZwU0mSvEF9ReylGTz5MmzqAKThqVwYo3D5VqKwDrg6wBuTo4Dg8X92NAxwn89kRFjPoOzTAn0vBx7SFW4GkPp4b3jXV_vWts0p_WBTTNw3Bw3P4CErdU44FKdog7yM06R3ZfNRFncxuad9SzV1zow8Ocvf-SjfdG9xMWG8-j7c"}',
  ],
  [
    'RS384',
    '{"kty":"RSA","n":"yKV00L6PwdO6DGMgsNwuWZ0xviGMqq7nvkULJ8jyQil8viSUvxDMPDZ80CoHUkgobcBU1DasjGO9nTthPYhcpOFh8Fzat1aG-z5Ola2FBHqpdJpwb7lxsLfq6UJy1bial5RCMrLdW3NhuCxIfhnGmvq4hFLAF7gBnEfkbN9qsrzyZruEGIlNG50r779axmgnRZDZ6YS5o_DVbn27f2yCjBLVYIljW5z9CSm6_NjSYVdeNujrgQUWMIrCZiJqmRSOAvn6GliKXFL7sh5xLh_DiCx1Atr477sBxviLY-tFpeXLOqKJKqZ5GASrspxsO96roE4-I4J-7JgoxYptuKD2Bw","e":"AQAB","d":"JRTvEeUmDFxk9gUb9ZO7vTQgDVOF-8V3buKzvRaWL0QbmciI9QbVuAsZ5h7eW4aaci4pf07bdNa6JGTlA8o_1PkScKm4gkmriKNrQp5fBwTkbHheb0eGi3JyJ8nwDy-e4oSz90q3Pj-Ev9TvUN7SpbHQiCQC_F81bPycasKfpYiR6_5zS7ClLHqYZ6FsVK6d9GMCI6F627xz2wbPYREgSMoTvlrHxq7a26FUEmmm1mKozbI0pVAr3bey30qDRdKtxdMAIT1v8H0UkEekoSS7fXg_nkI7z8q4ptQjAoCXpy16-5XhxpqVkJdGoJ4C462MXch3NWBc1CW98h4dUjooAQ","p":"92HE0Px6q-TMffjm5X0YHFU75UFpGTYOXxUmnK1PuzcdEYDB0IwHUlXgm9KrFK6N4R9i-T-cjqTmsQs-quoPIAFJTKgtvNTB36qN5KLnoZlgVCZUwMbMvPXAT7SnSZzKVkjQ8Ey2djmY6hknRdJEnKdDWrgvgpixzG0z1JSndsE","q":"z6LibI3wg4PspR_lOaNf4Z4ibewBR-K9RX5QeZ-2nuEVoIaING22GWaZnTnIbjnbbd3M6fr3NxqdSrKIYwQds9Rbq1PIXlArNh_-Wk7TbUy7R_PRwhfiQRCG0gh32WCWK15a8-ksoDkef9OGqUBVvuxth9Ghu_qRGIsl6Z6TJsc","dp":"zuQLkKS3i28svuYdZSx7r6ZxE0jjNtyIpGiyBDLGDdMIEo1Wiq2xqeB8mpVT01Yw_mgbhEz5CCtNbB_1Z0edIq0wulWk-toM0px3UxITGomFkJsGIrugmyAEmCSEDAJ_Di6T34SozLNa-d3ThIdYLpOMtyB3S4ecm1VxFYbFj4E","dq":"x6o9i9_uMbmx3ZPPTN7S-9WiDAwPqz3ZfjMaVeqEpUGTF3tnDOuXWdO00mFXYM-YN407WKDyC3Y3XTZTOswhd-U0hYsaub7j3rdjUxpL6-YGjgljYv6unpyy2NQ1074yid_BHJ3UQPrMXmVdL_Jiwib-qMWofmhUEML2ITJRFM8","qi":"pLL3IZYBE6247WXsRVnxpitphgx3zdHUQa76xOio2klvwyBiiOt5etLoA_QYki9KRwhnhWgivfZ26ajfICPW7yIUhoj9stH91agTuL7TfCxfSJ1QbaB2TVJ9v4C_ovo28Y5ZQOx8hnVUkfVK6FFz7BFFt06pU9fpRpIHVAt301A"}',
  ],
  [
    'RS512',
    '{"kty":"RSA","n":"wdEr4kyCku2F8a2Y45xa1Q-jE5FlkYK6xUDuyckH6U9hhA_1OFaNfTbZ-8ZkXOp0PGzYjCqAk0YxATfnKSc1-PKnOBvBD8FRpgaT61WyOq_yM6YgDrwQvbWTr0r5copjDs4ZA9mrE-bjgvOLut4GpD4NVPWhPkgI45-yYd0H4vjuf36sCe26MBIWBTzInCUdfKTvCdh0Kk__HOENwwke6XrtzvugJymi3zlrdqztq3efJFmA4hvyLzosdBB8g0iWBXFNy51J8RCYygiSXtsPatV1FMVd6ZkTfVrvR3OYJucbuvCbqQwPDB08XjJLXKTE1eolyECk-U-Z_Cg8aNElpw","e":"AQAB","d":"uEGC1sCl4citbfT7RGeAcs1K229-f7comB4C5RKY0tUEf-gr2ENwf3mGAjW5dBvwJQHVXGuLkHdKXz4mJJmCVglZr52zDKdcV9opBbGSnvhl6XQlRdzEjZXxsNQ2EQ4-3fRRE7f7TBBUeknOrPgmmD3lrr9Va0BQMxW_IAphVQRonU6ry_neuPSuEAZOWDL1pHYSCrCBW5k6NeG3rF1SXbY0djzaWPyoPAw5CDYciFb6g4BjL-PxCirhuSBJc7s09j68qIbfje_VBPEgd4VrbzHIEEZYK1YT9JwUv6U6VKDHdTf7E5mWTXzCZA0D1YP6AoCJlQdkj6E9tkVxg55dAQ","p":"-LZFHeCz0Bv2I9xaZE-RTX2_YQFH7dJOD6zqidBNxUf9Ldtp6LgKiAADQdfLbNxVZvex6MHZ9ZlWk0__O_749F3l0KQch6-X4lvmAJnSJdgtxv6lyId8zr3fiNgzyIwBRvFxTgg3TQ3zBPRhR13L61twz59yk4A_nUAGl3u-C30","q":"x38afNO89dW0s69wy8iPz6Lw5shCHFFS-LXt6cppTyHqi058N2j6jBwi4Ra7fBUAz4kb7i5txGI7gyqiIx0To44WY-Ek8xUZHIIYbELXVKXc95PlCc5DdCt_CxINNthz2bFwHZbA3OsFd5MKDCMaynZrnM8xwnzaBhrrLYBFlvM","dp":"i22DKdDCfTRvtILfmcSRbKPGGhehv01avabuhPvl3WcSJBcRNImYPc3kBZF4VTrgFa1ea2HhUrH3uvXp3DSAVF4fa-vUoqxptVhXhJa3HMgoQZqYTebGrQ_8tLafsRnrzV2la11nwybCylBGCMAohXTptTtp_A61mu49w8Z3L_E","dq":"NUYG78CnXEq2V6mJCJJFfSA5Dpf5t5AsBQioQN9xodUfyhWqbC2XgqTc15j3dhoxvjoSAFfbri7BT7Sp2ZChNvLxnbh44oUG0KsZFIgA8rTcPiz7Y9P2BWa8JVurtbK1tTOCChTA6f3E1vqoGzegpuJauGRIGHS40BqOJPd1Hes","qi":"e2hsRHFWfjGRNDPRXrgb08Y5DvLDrvpdLP_NiMC5zdMvlMqy9IkIjAPY_MCAE7FFnepJTfmWHfWa7jf5eXCJk5wva6si87fZy9K5rIXkHmg8ieDNXZKvsUdkUDVDJbrqSgTolwe79xXsWXdsiCCmPSD8-wI75NSuYBILi-lJ3t0"}',
  ],
  [
    'PS256',
    '{"kty":"RSA","n":"5Yv7aQulm2VYKjSfwPQLSEokqtWu-TxKKkRKT_570Yjk0fIg81IbK5T0SrkBzmEV5bjuoGdVMQf6bvkhOeeborTmbISEE6DCNxN_us3EWJKMKp-OSbeqbvbg252l_wPhcC5OC0Q--ryOqoRlsCKYgCmDbKNmZepGm8Nf1ayeqj3kIuKmgzU7y4dy4Le8Sq-9aHD5_QW52WqHeEnmIfrVnR7mJsrd7LY-28aflUHaEDn1TzhPPq0W_F1lMkdniM4c5JNU5_6fZ8NVla51j-pt0PmQMz-Ch97ZcnpB7DGdNyBDzdnQiabJ7sOxRK33so8cUFh3zHnaeX73XeGgrpD5XQ","e":"AQAB","d":"vZCunP97UiuNdb1juMtRje98_H_fMgCyFtmyrQEya8YrgZ39zDOgMIugexzx-ud-V-ozVtA_MHCwRnkDEXjNtL7EFBYTpMn72dQGhdRsM-FCU-jUbth4rY6__13fugwQXr4-wVsoz5RsFTGlcKIBYsXlvQ_r_npMuVHNkP4vQdKuMp9jxhl1vVoeo4ripdaJaPTMOmUKj3xS6hDGf0HpuEJXgJQ6DE8y6G9L7daK0qeRU-xRPz9cedNCZiIAPeP1cUTOuTeX26UdicWAXev9XgI6j_cszqLA45iEcTLGW4tPNJACr6bHs6qIX4qi_nu5T-X_ILjOE-0z-vslyFEaQQ","p":"-zKQS2gVfNyFblA-vPdJXhVCRL2uQZUr9XbysG819hR5K9FBbD71Ce3zyFcp5-YP65z_OA5R_JE3gdFA9I1u4A9818Z8gyHhI3weWbjG4mBVuosVJlcFMUoC_NhJytxQsnXbi0meeCFKxve7kaImV_atu-zglEw1NAzvLn3KKUk","q":"6e90DQi6S-A9xwJO8j-c-st1ERIxKUqFkQnYxdKqpSeWHEBY96262m9x7gH2few1Rs0qxZtieVOCKTnSE4LSJxjBO_0MKB7iaF5JI2uwcmiXYeSDQzePPIdc8TJB3XgGc6YoB-5px9gAFMHXNTKE3U7M79DD_gCVQ7embjNuQ3U","dp":"u7OVxPL6k3mIrtyBdNxnU0kZYppF-rWHynzebd47-SxlOsu7UjJdEdVfw4T2SFVN8iY3Q2DX_J1aV8PQAK0qe3y3MdkcMzR-sfBOEYcT_hY0GRdSb3q445LFVsAbq90i46dTrOoO4v8ljDWTUAhVFIe8XF9tlQK5ArLjit7t0Bk","dq":"u1_lt27vMUk6kkViEJ0tUqBWc0b8A5PCKisV61XTAxgTHyvXVwNbcAzl13rRAYmKHtzEzqSoGn_t-LFsd95ID7K_TBpie1xJgslKkcl2-hyWbH2JOfStkRDnO_ZCVW8G0-kZlUi8h6qWXgnpI54EV_L_KXMxGSlEZYobD5e4UOU","qi":"MK4ttBe3hdLkYBid75kjVffCp4yDuKeDKgYkh3_SzDK1MqALVXmEvE_Eh01HfV-J2FabLfqwLiFs714tg7pw7aOO6OzqkeIn5J5fA5uATJl8ADyus7-lALBQvsaQznOEpHk4Unach1jflLH3K8JuBk-qoj0fASBkiSFBj6Y1d1Y"}',
  ],
  [
    'PS384',
    '{"kty":"RSA","n":"vyJy0ZJqdGsH3-AGnaw5I35lPhFdWDxxkRn-TBx1GfhIKCjibEjZTCfzBnBdWwIUnr2fL0Vy6VZvTEUcH66r4AJy380ovOJrVIM5nhAGn8uSLCoJ2yiuKeA50gBylINvdAVG7fDzau4-1aSQ1RXILxa88raqDK1h8DQoGZLnRdiKkfNjKmXVltsvDSUxOmKelHh9WLiF2JCs0ydMCCcGDumosLBlP4LR7XfycW2cIavRdxeajL8oyRckD9-IpZLampTkr0Ja4GWHbHnAX-dXmoRDEhqlMeSpKmbm-e95jT_3SHwLj_TLlwF4HsIj-egX78lHcVJzCvhdUG7ogrbjHw","e":"AQAB","d":"b66bVKWvGnNn2IK4mu0FPh4e3lObLXG0EksT8jk2m4Qd9YleNFOk1QEK2hpSEll23wKBv0dfS8S7p99B_ak8uNn1cZwZT7Ulbe53fkpy9HAo6zFtLOfqTIG-h1zHlsvuFeb3eRUvxq2LfZ55Gmlt3UX2BgSB_IJbFdYEEF1sUbye5wvsf4sV-B5KJ6MQmdYPUyt3cg9s19A0vAWtTy0b1246QMQaHrJBH0FZtX1noxgiNWq-Wq9gdoYX4kmm9mIpeowpKOmZ1OylK0izWMSPAmwOm8jhlPWgLUCyEgcG9d_VmBRHu0b0Io8m5fDwrL6ErvWJsVF-RLgtd9iUWo0g8Q","p":"_V8vt5Xi8U50--b2MAQ825xgFEGFAHzN_E1pVNfmSg1viARdiN98-y4E2p-vxVzxNWRw5X0YsQV05xxchXJN_2vTlSPT33-8S70R8qaQsEJzxK0gZ7tQtQgY0V6H2MklxCxmkuoCD4I7nvbnHoiFITLgQR2I0rdMeqWvAXIQGDU","q":"wR3-rRgylHfBP9MbLNG4Hiw1Dw7_3ZtsLjATf93jryBqU3ydxLRVQmGuUReAAeXEsgsM8AqElHiEGU25UGZZYWNsQ7tHUMbHn4IDrtsLpeuSN-F_epD2dT6ansR79SBPw67FBhhQCUHm9ORBtsZHldxULs6BTzVKj-sdF4LggIM","dp":"CR6_AfW0OIlhbpvOqsXMRv9m-fOtzOmxJG7I5tPqpym6pQO7Ni0NO6FZbWEoG4uP5yMZaTlKhTy0C4mazvbhVdtUv16NxtK7PWKt3bUfKikKL78nlnRIoGuNMSQc8bGz2U7b1lf0AQjoCn3Kre-uExbYuZ9NiIAukY-bMAsiBy0","dq":"rFuU_fBm1FO9yrUjv_C9n1BdWr9MZgFdoCuQe8MSfy8zNqg2N2Wr4r9D0WRj_02PLEjolyUMB2c4n0zbZIK0q1MNQbZYhCOl7xsfJmSiFMgXjIBaQo43KZViculyqOjZyBCoEDSK2nhTJabDb9mv8nTfPZdZmdQ6ZBC3ulA5Bvk","qi":"89uw1x0Bs0KnpiHZy6Mqb4mme4PhtvEGcYXkH887-DnxoOlDtn8wmHYRKLKTzICp9L7AWGwUazlYcrnmt8kvH--9-qsnLWvTKs4yCpzqbEcwQyZqNxNvrqJFuFa6i5g5r0xjx54NqzZF_x3yjhKvjNn4a2p-31iA8sszOwbl1gU"}',
  ],
  [
    'PS512',
    '{"kty":"RSA","n":"sSLTDqh1I2Rt26uCFrbdYuRY3lqDes8Az0GQxgatQhXgIG1jOfuEIaqnMRDuWinroRWuetR1ykQ4SxzIy31ms5PSM5sJm1SNAiynO6dxxGMNaCLt4Rgi_fAn6CD0F4mo2OLmxm1_hQH1SJSymG8p8q9Uu0IToY4KEEmHwc1kfiAosvqfLgY1-CRU8kKbFHzq28x7Jbv4WSDccJ_-Wm8BiyMkIUQfzRsC1hHiMO_NKlLwMqeSQ5XyYqsBxc80cF6Z9IIBzXewjCGGVAfYMeimPcJao6wat-PXEr5axEeBeCFU6Q7TDLcMilotGV6f6-UECUK5q2QCXtoOnZ5TO4yPzQ","e":"AQAB","d":"cL2pd3rgk1YoVdgjRDG_VmHf7iXN6Sw3Z7JjYqZ9P8KMlBcLQKxEvOjQ4PnVuq1Tu4MBOkxfbA1fhu8bHekCpOlAsHfM9YAq_2dMSTuZvVUOA2m33bxvCREBVU0kDpcfUGuaVlD7CLzmUPvTcBHQsRXG6Ch2Ni0hWpxyO3durpbaPXU4a1I0Yr8pFByHMlrcPJ7YYxqd1tuRvi87IE86v7YhzWsRFRkcDDXZaCdxjUcPzmt1sc2jAQT2V6nmX0FhueEQDsTc3QjUcohyissD8iTl7OdQN6ULB73K6RC-vB1bfZK0TyZaGLnKhgsHkiyhdQSEaTMQfsc9VRMFOkiMQQ","p":"1edW9AYby_6jWhcjqi6FDTbfmzG-TYOlSeVcoCdy625Qvupjp7dI6yyALI6WyJnPdvW2nIyy9WvSNpuKNaE_ntiCK8zOCdbV9p6qClPB6AAnAcHvA2jpspyAxO02YYP4B1M6TjoWFZipnB62-0HCm7RmmvDr7Z_IAH3NvcGBtFs","q":"0_8ZE4lDFnoFq34X_3A3mrnfGLL3R1nklzKVy-Nhpw7fWR1EPyE_R9gzgQNDWtnQYT6KnPYByuRWPpFG34azvlq68FIJtv9NBnUQ-5uWshTmH7hQ_l9xJBa9IIz0Z0Ogd74zRH4D_SLc1VNK9bHEm2JGtEvzjbbGRVVtotkcZPc","dp":"ugA8YF2fdjeqnABbBvUExYTd0_nhXU4IQMWtUaZ8C7UVia4PkhuS0M0Vd6lV_IGjIfJwJJlEVJy5YrrF5_SbeekS6DtjPrMNwzIc8nX6u17GjISy7eggryvf3V3YV9uFpfj9TmC8K3NgqV0cCEgajYLFZh3xSeQS6jp62XKW8tk","dq":"wfWewtIOEG157IqEeE_6f9TZemabeauUSoWcqhuSx98CmCz_uOa5WAlGLh6HLIMmdSJcfflScIhzI_GVL4O1xk6KxL-6ZbS1i1fmPt3-hVY7qf_gEqvN_1_SkAqGvkgQdB4QF_VXvu17sK3xYlPP9v52hBUNc7YrN1pO4fTUVsc","qi":"u8ZrPCzwWF5yhpNsPtba5MmnlG6GCvXdbD9TE0qm-ol4UnRqlzfQofNDToYBQ6g9Yl6yQsn5QEj3UG3oeIBjgnUJh1vH2OcyVucKe3iSvj6YQTOMDwma0YnSUoOmaDCOaUlpWTuyTPEU-eQVtYmgu-LI4k-gdbf9N--4HLnk9bs"}',
  ],
  [
    'ES256',
    '{"crv":"P-256","kty":"EC","x":"E8KpG0wpGUfRBYx8tUhd6tYaFaTZaIyHvAudXbSUFxQ","y":"gcVDlKTo-UhZ-wHDNUdoQP0M9zevurU6A5WMR07B-wQ","d":"m2lKgT3jxM3ouusu8sgjk2Ajqyf1L8KBLuRxQ3opSlY"}',
  ],
  [
    'ES384',
    '{"crv":"P-384","kty":"EC","x":"HnBAtgpS-GJzTCdLBELPm1VIRoQwlk7luJIGEYWKhWtMHmOq14Hh7674Oxcc52mE","y":"jXGek8Zapkjav7mO-KB-7vEWrqNxHSoXgNn1r6C0BiqS89SVciz6O8uriPdxoWem","d":"Fr-aKdB1GdA98B80LTNftu04p9RILDBSNRQxQ1chl4DS9CSZcw39aEZoSUAbJa6r"}',
  ],
  ['HS256', '{"kty":"oct","k":"iPYq7qKZWRaVmo1FiJ17M84uADey7-veCAEEsxpPTus"}'],
  ['HS384', '{"kty":"oct","k":"ATgNcVOYFsjbN4GeyXOyryfqqmGp_48-uvVd5J3GsX7ExUMp3WNTDbbZK_5kTjND"}'],
  [
    'HS512',
    '{"kty":"oct","k":"2O5x_zEOhSIDiGcOAOYhB1dyDU_ZW27rl-_xDpKE-8tBlL91z6p_8aYo3by6AOsa6ycx6-JC9LBAio0amINXTQ"}',
  ],
]) {
  Deno.test(`Key Import/Export ${alg}`, test.bind(undefined, JSON.parse(jwk), alg));
}

for (const [alg, jwk] of [
  [
    'ES512',
    '{"crv":"P-521","kty":"EC","x":"AIwG869tNnEGIDg2hSyvXKIOk9rWPO_riIixGliBGBV0kB57QoTrjK-g5JCtazDTcBT23igX9gvAVkLvr2oFTQ9p","y":"AeGZ0Z3JHM1rQWvmmpdfVu0zSNpmu0xPjGUE2hGhloRqF-JJV3aVMS72ZhGlbWi-O7OCcypIfndhpYgrc3qx0Y1w","d":"AVIiopJk-cUIfQCJey-NvNbxiTB7haAB1AVvjp4r6wQ0ySw-RsKM03VbJNdWxcSsyHnk-mj-IP6wdWdeqUdto04T"}',
  ],
]) {
  Deno.test(
    `(expecting failure) Key Import/Export ${alg}`,
    failing.bind(undefined, JSON.parse(jwk), alg),
  );
}
