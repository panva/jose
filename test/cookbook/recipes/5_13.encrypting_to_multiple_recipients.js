module.exports = {
  title: 'Encrypting to Multiple Recipients',
  input: {
    plaintext: 'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
    key: [
      {
        kty: 'RSA',
        kid: 'frodo.baggins@hobbiton.example',
        use: 'enc',
        n: 'maxhbsmBtdQ3CNrKvprUE6n9lYcregDMLYNeTAWcLj8NnPU9XIYegTHVHQjxKDSHP2l-F5jS7sppG1wgdAqZyhnWvXhYNvcM7RfgKxqNx_xAHx6f3yy7s-M9PSNCwPC2lh6UAkR4I00EhV9lrypM9Pi4lBUop9t5fS9W5UNwaAllhrd-osQGPjIeI1deHTwx-ZTHu3C60Pu_LJIl6hKn9wbwaUmA4cR5Bd2pgbaY7ASgsjCUbtYJaNIHSoHXprUdJZKUMAzV0WOKPfA6OPI4oypBadjvMZ4ZAj3BnXaSYsEZhaueTXvZB4eZOAjIyh2e_VOIKVMsnDrJYAVotGlvMQ',
        e: 'AQAB',
        d: 'Kn9tgoHfiTVi8uPu5b9TnwyHwG5dK6RE0uFdlpCGnJN7ZEi963R7wybQ1PLAHmpIbNTztfrheoAniRV1NCIqXaW_qS461xiDTp4ntEPnqcKsyO5jMAji7-CL8vhpYYowNFvIesgMoVaPRYMYT9TW63hNM0aWs7USZ_hLg6Oe1mY0vHTI3FucjSM86Nff4oIENt43r2fspgEPGRrdE6fpLc9Oaq-qeP1GFULimrRdndm-P8q8kvN3KHlNAtEgrQAgTTgz80S-3VD0FgWfgnb1PNmiuPUxO8OpI9KDIfu_acc6fg14nsNaJqXe6RESvhGPH2afjHqSy_Fd2vpzj85bQQ',
        p: '2DwQmZ43FoTnQ8IkUj3BmKRf5Eh2mizZA5xEJ2MinUE3sdTYKSLtaEoekX9vbBZuWxHdVhM6UnKCJ_2iNk8Z0ayLYHL0_G21aXf9-unynEpUsH7HHTklLpYAzOOx1ZgVljoxAdWNn3hiEFrjZLZGS7lOH-a3QQlDDQoJOJ2VFmU',
        q: 'te8LY4-W7IyaqH1ExujjMqkTAlTeRbv0VLQnfLY2xINnrWdwiQ93_VF099aP1ESeLja2nw-6iKIe-qT7mtCPozKfVtUYfz5HrJ_XY2kfexJINb9lhZHMv5p1skZpeIS-GPHCC6gRlKo1q-idn_qxyusfWv7WAxlSVfQfk8d6Et0',
        dp: 'UfYKcL_or492vVc0PzwLSplbg4L3-Z5wL48mwiswbpzOyIgd2xHTHQmjJpFAIZ8q-zf9RmgJXkDrFs9rkdxPtAsL1WYdeCT5c125Fkdg317JVRDo1inX7x2Kdh8ERCreW8_4zXItuTl_KiXZNU5lvMQjWbIw2eTx1lpsflo0rYU',
        dq: 'iEgcO-QfpepdH8FWd7mUFyrXdnOkXJBCogChY6YKuIHGc_p8Le9MbpFKESzEaLlN1Ehf3B6oGBl5Iz_ayUlZj2IoQZ82znoUrpa9fVYNot87ACfzIG7q9Mv7RiPAderZi03tkVXAdaBau_9vs5rS-7HMtxkVrxSUvJY14TkXlHE',
        qi: 'kC-lzZOqoFaZCr5l0tOVtREKoVqaAYhQiqIRGL-MzS4sCmRkxm5vZlXYx6RtE1n_AagjqajlkjieGlxTTThHD8Iga6foGBMaAr5uR1hGQpSc7Gl7CF1DZkBJMTQN6EshYzZfxW08mIO8M6Rzuh0beL6fG9mkDcIyPrBXx2bQ_mM'
      },
      {
        kty: 'EC',
        kid: 'peregrin.took@tuckborough.example',
        use: 'enc',
        crv: 'P-384',
        x: 'YU4rRUzdmVqmRtWOs2OpDE_T5fsNIodcG8G5FWPrTPMyxpzsSOGaQLpe2FpxBmu2',
        y: 'A8-yxCHxkfBz3hKZfI1jUYMjUhsEveZ9THuwFjH2sCNdtksRJU7D5-SkgaFL1ETP',
        d: 'iTx2pk7wW-GqJkHcEkFQb2EFyYcO7RugmaW3mRrQVAOUiPommT0IdnYK2xDlZh-j'
      },
      {
        kty: 'oct',
        kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
        use: 'enc',
        alg: 'A256GCMKW',
        k: 'qC57l_uxcm7Nm3K-ct4GFjx8tM1U8CZ0NLBvdQstiS8'
      }
    ],
    alg: [
      'RSA1_5',
      'ECDH-ES+A256KW',
      'A256GCMKW'
    ],
    enc: 'A128CBC-H256'
  },
  generated: {
    cek: 'zXayeJ4gvm8NJr3IUInyokTUO-LbQNKEhe_zWlYbdpQ',
    iv: 'VgEIHY20EnzUtZFl2RpB1g'
  },
  encrypting_key: [
    {
      encrypted_key: 'dYOD28kab0Vvf4ODgxVAJXgHcSZICSOp8M51zjwj4w6Y5G4XJQsNNIBiqyvUUAOcpL7S7-cFe7Pio7gV_Q06WmCSa-vhW6me4bWrBf7cHwEQJdXihidAYWVajJIaKMXMvFRMV6iDlRr076DFthg2_AV0_tSiV6xSEIFqt1xnYPpmP91tc5WJDOGb-wqjw0-b-S1laS11QVbuP78dQ7Fa0zAVzzjHX-xvyM2wxj_otxr9clN1LnZMbeYSrRicJK5xodvWgkpIdkMHo4LvdhRRvzoKzlic89jFWPlnBq_V4n5trGuExtp_-dbHcGlihqc_wGgho9fLMK8JOArYLcMDNQ',
      header: {
        alg: 'RSA1_5',
        kid: 'frodo.baggins@hobbiton.example'
      }
    },
    {
      epk: {
        kty: 'EC',
        crv: 'P-384',
        x: 'Uzdvk3pi5wKCRc1izp5_r0OjeqT-I68i8g2b8mva8diRhsE2xAn2DtMRb25Ma2CX',
        y: 'VDrRyFJh-Kwd1EjAgmj5Eo-CTHAZ53MC7PjjpLioy3ylEjI1pOMbw91fzZ84pbfm',
        d: '1DKHfTv-PiifVw2VBHM_ZiVcwOMxkOyANS_lQHJcrDxVY3jhVCvZPwMxJKIE793C'
      },
      encrypted_key: 'ExInT0io9BqBMYF6-maw5tZlgoZXThD1zWKsHixJuw_elY4gSSId_w',
      header: {
        alg: 'ECDH-ES+A256KW',
        kid: 'peregrin.took@tuckborough.example',
        epk: {
          kty: 'EC',
          crv: 'P-384',
          x: 'Uzdvk3pi5wKCRc1izp5_r0OjeqT-I68i8g2b8mva8diRhsE2xAn2DtMRb25Ma2CX',
          y: 'VDrRyFJh-Kwd1EjAgmj5Eo-CTHAZ53MC7PjjpLioy3ylEjI1pOMbw91fzZ84pbfm'
        }
      }
    },
    {
      iv: 'AvpeoPZ9Ncn9mkBn',
      encrypted_key: 'a7CclAejo_7JSuPB8zeagxXRam8dwCfmkt9-WyTpS1E',
      tag: '59Nqh1LlYtVIhfD3pgRGvw',
      header: {
        alg: 'A256GCMKW',
        kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
        tag: '59Nqh1LlYtVIhfD3pgRGvw',
        iv: 'AvpeoPZ9Ncn9mkBn'
      }
    }
  ],
  encrypting_content: {
    protected: {
      enc: 'A128CBC-HS256'
    },
    protected_b64u: 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0',
    unprotected: {
      cty: 'text/plain'
    },
    ciphertext: 'ajm2Q-OpPXCr7-MHXicknb1lsxLdXxK_yLds0KuhJzfWK04SjdxQeSw2L9mu3a_k1C55kCQ_3xlkcVKC5yr__Is48VOoK0k63_QRM9tBURMFqLByJ8vOYQX0oJW4VUHJLmGhF-tVQWB7Kz8mr8zeE7txF0MSaP6ga7-siYxStR7_G07Thd1jh-zGT0wxM5g-VRORtq0K6AXpLlwEqRp7pkt2zRM0ZAXqSpe1O6FJ7FHLDyEFnD-zDIZukLpCbzhzMDLLw2-8I14FQrgi-iEuzHgIJFIJn2wh9Tj0cg_kOZy9BqMRZbmYXMY9YQjorZ_P_JYG3ARAIF3OjDNqpdYe-K_5Q5crGJSDNyij_ygEiItR5jssQVH2ofDQdLChtazE',
    tag: 'BESYyFN7T09KY7i8zKs5_g'
  },
  output: {
    json: {
      recipients: [
        {
          encrypted_key: 'dYOD28kab0Vvf4ODgxVAJXgHcSZICSOp8M51zjwj4w6Y5G4XJQsNNIBiqyvUUAOcpL7S7-cFe7Pio7gV_Q06WmCSa-vhW6me4bWrBf7cHwEQJdXihidAYWVajJIaKMXMvFRMV6iDlRr076DFthg2_AV0_tSiV6xSEIFqt1xnYPpmP91tc5WJDOGb-wqjw0-b-S1laS11QVbuP78dQ7Fa0zAVzzjHX-xvyM2wxj_otxr9clN1LnZMbeYSrRicJK5xodvWgkpIdkMHo4LvdhRRvzoKzlic89jFWPlnBq_V4n5trGuExtp_-dbHcGlihqc_wGgho9fLMK8JOArYLcMDNQ',
          header: {
            alg: 'RSA1_5',
            kid: 'frodo.baggins@hobbiton.example'
          }
        },
        {
          encrypted_key: 'ExInT0io9BqBMYF6-maw5tZlgoZXThD1zWKsHixJuw_elY4gSSId_w',
          header: {
            alg: 'ECDH-ES+A256KW',
            kid: 'peregrin.took@tuckborough.example',
            epk: {
              kty: 'EC',
              crv: 'P-384',
              x: 'Uzdvk3pi5wKCRc1izp5_r0OjeqT-I68i8g2b8mva8diRhsE2xAn2DtMRb25Ma2CX',
              y: 'VDrRyFJh-Kwd1EjAgmj5Eo-CTHAZ53MC7PjjpLioy3ylEjI1pOMbw91fzZ84pbfm'
            }
          }
        },
        {
          encrypted_key: 'a7CclAejo_7JSuPB8zeagxXRam8dwCfmkt9-WyTpS1E',
          header: {
            alg: 'A256GCMKW',
            kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
            tag: '59Nqh1LlYtVIhfD3pgRGvw',
            iv: 'AvpeoPZ9Ncn9mkBn'
          }
        }
      ],
      unprotected: {
        cty: 'text/plain'
      },
      protected: 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0',
      iv: 'VgEIHY20EnzUtZFl2RpB1g',
      ciphertext: 'ajm2Q-OpPXCr7-MHXicknb1lsxLdXxK_yLds0KuhJzfWK04SjdxQeSw2L9mu3a_k1C55kCQ_3xlkcVKC5yr__Is48VOoK0k63_QRM9tBURMFqLByJ8vOYQX0oJW4VUHJLmGhF-tVQWB7Kz8mr8zeE7txF0MSaP6ga7-siYxStR7_G07Thd1jh-zGT0wxM5g-VRORtq0K6AXpLlwEqRp7pkt2zRM0ZAXqSpe1O6FJ7FHLDyEFnD-zDIZukLpCbzhzMDLLw2-8I14FQrgi-iEuzHgIJFIJn2wh9Tj0cg_kOZy9BqMRZbmYXMY9YQjorZ_P_JYG3ARAIF3OjDNqpdYe-K_5Q5crGJSDNyij_ygEiItR5jssQVH2ofDQdLChtazE',
      tag: 'BESYyFN7T09KY7i8zKs5_g'
    }
  }
}
