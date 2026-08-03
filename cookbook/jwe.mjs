export default [
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.2 - Key Encryption using RSA-OAEP with AES-GCM',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'RSA',
        ext: false,
        kid: 'samwise.gamgee@hobbiton.example',
        use: 'enc',
        n: 'wbdxI55VaanZXPY29Lg5hdmv2XhvqAhoxUkanfzf2-5zVUxa6prHRrI4pP1AhoqJRlZfYtWWd5mmHRG2pAHIlh0ySJ9wi0BioZBl1XP2e-C-FyXJGcTy0HdKQWlrfhTm42EW7Vv04r4gfao6uxjLGwfpGrZLarohiWCPnkNrg71S2CuNZSQBIPGjXfkmIy2tl_VWgGnL22GplyXj5YlBLdxXp3XeStsqo571utNfoUTU8E4qdzJ3U1DItoVkPGsMwlmmnJiwA7sXRItBCivR4M5qnZtdw-7v4WuR4779ubDuJ5nalMv2S66-RPcnFAzWSKxtBDnFJJDGIUe7Tzizjg1nms0Xq_yPub_UOlWn0ec85FCft1hACpWG8schrOBeNqHBODFskYpUc2LC5JA2TaPF2dA67dg1TTsC_FupfQ2kNGcE1LgprxKHcVWYQb86B-HozjHZcqtauBzFNV5tbTuB-TpkcvJfNcFLlH3b8mb-H_ox35FjqBSAjLKyoeqfKTpVjvXhd09knwgJf6VKq6UC418_TOljMVfFTWXUxlnfhOOnzW6HSSzD1c9WrCuVzsUMv54szidQ9wf1cYWf3g5qFDxDQKis99gcDaiCAwM3yEBIzuNeeCa5dartHDb1xEB_HcHSeYbghbMjGfasvKn0aZRsnTyC0xhWBlsolZE',
        e: 'AQAB',
        alg: 'RSA-OAEP',
        d: 'n7fzJc3_WG59VEOBTkayzuSMM780OJQuZjN_KbH8lOZG25ZoA7T4Bxcc0xQn5oZE5uSCIwg91oCt0JvxPcpmqzaJZg1nirjcWZ-oBtVk7gCAWq-B3qhfF3izlbkosrzjHajIcY33HBhsy4_WerrXg4MDNE4HYojy68TcxT2LYQRxUOCf5TtJXvM8olexlSGtVnQnDRutxEUCwiewfmmrfveEogLx9EA-KMgAjTiISXxqIXQhWUQX1G7v_mV_Hr2YuImYcNcHkRvp9E7ook0876DhkO8v4UOZLwA1OlUX98mkoqwc58A_Y2lBYbVx1_s5lpPsEqbbH-nqIjh1fL0gdNfihLxnclWtW7pCztLnImZAyeCWAG7ZIfv-Rn9fLIv9jZ6r7r-MSH9sqbuziHN2grGjD_jfRluMHa0l84fFKl6bcqN1JWxPVhzNZo01yDF-1LiQnqUYSepPf6X3a2SOdkqBRiquE6EvLuSYIDpJq3jDIsgoL8Mo1LoomgiJxUwL_GWEOGu28gplyzm-9Q0U0nyhEf1uhSR8aJAQWAiFImWH5W_IQT9I7-yrindr_2fWQ_i1UgMsGzA7aOGzZfPljRy6z-tY_KuBG00-28S_aWvjyUc-Alp8AUyKjBZ-7CWH32fGWK48j1t-zomrwjL_mnhsPbGs0c9WsWgRzI-K8gE',
        p: '7_2v3OQZzlPFcHyYfLABQ3XP85Es4hCdwCkbDeltaUXgVy9l9etKghvM4hRkOvbb01kYVuLFmxIkCDtpi-zLCYAdXKrAK3PtSbtzld_XZ9nlsYa_QZWpXB_IrtFjVfdKUdMz94pHUhFGFj7nr6NNxfpiHSHWFE1zD_AC3mY46J961Y2LRnreVwAGNw53p07Db8yD_92pDa97vqcZOdgtybH9q6uma-RFNhO1AoiJhYZj69hjmMRXx-x56HO9cnXNbmzNSCFCKnQmn4GQLmRj9sfbZRqL94bbtE4_e0Zrpo8RNo8vxRLqQNwIy85fc6BRgBJomt8QdQvIgPgWCv5HoQ',
        q: 'zqOHk1P6WN_rHuM7ZF1cXH0x6RuOHq67WuHiSknqQeefGBA9PWs6ZyKQCO-O6mKXtcgE8_Q_hA2kMRcKOcvHil1hqMCNSXlflM7WPRPZu2qCDcqssd_uMbP-DqYthH_EzwL9KnYoH7JQFxxmcv5An8oXUtTwk4knKjkIYGRuUwfQTus0w1NfjFAyxOOiAQ37ussIcE6C6ZSsM3n41UlbJ7TCqewzVJaPJN5cxjySPZPD3Vp01a9YgAD6a3IIaKJdIxJS1ImnfPevSJQBE79-EXe2kSwVgOzvt-gsmM29QQ8veHy4uAqca5dZzMs7hkkHtw1z0jHV90epQJJlXXnH8Q',
        dp: '19oDkBh1AXelMIxQFm2zZTqUhAzCIr4xNIGEPNoDt1jK83_FJA-xnx5kA7-1erdHdms_Ef67HsONNv5A60JaR7w8LHnDiBGnjdaUmmuO8XAxQJ_ia5mxjxNjS6E2yD44USo2JmHvzeeNczq25elqbTPLhUpGo1IZuG72FZQ5gTjXoTXC2-xtCDEUZfaUNh4IeAipfLugbpe0JAFlFfrTDAMUFpC3iXjxqzbEanflwPvj6V9iDSgjj8SozSM0dLtxvu0LIeIQAeEgT_yXcrKGmpKdSO08kLBx8VUjkbv_3Pn20Gyu2YEuwpFlM_H1NikuxJNKFGmnAq9LcnwwT0jvoQ',
        dq: 'S6p59KrlmzGzaQYQM3o0XfHCGvfqHLYjCO557HYQf72O9kLMCfd_1VBEqeD-1jjwELKDjck8kOBl5UvohK1oDfSP1DleAy-cnmL29DqWmhgwM1ip0CCNmkmsmDSlqkUXDi6sAaZuntyukyflI-qSQ3C_BafPyFaKrt1fgdyEwYa08pESKwwWisy7KnmoUvaJ3SaHmohFS78TJ25cfc10wZ9hQNOrIChZlkiOdFCtxDqdmCqNacnhgE3bZQjGp3n83ODSz9zwJcSUvODlXBPc2AycH6Ci5yjbxt4Ppox_5pjm6xnQkiPgj01GpsUssMmBN7iHVsrE7N2iznBNCeOUIQ',
        qi: 'FZhClBMywVVjnuUud-05qd5CYU0dK79akAgy9oX6RX6I3IIIPckCciRrokxglZn-omAY5CnCe4KdrnjFOT5YUZE7G_Pg44XgCXaarLQf4hl80oPEf6-jJ5Iy6wPRx7G2e8qLxnh9cOdf-kRqgOS3F48Ucvw3ma5V6KGMwQqWFeV31XtZ8l5cVI-I3NzBS7qltpUVgz2Ju021eyc7IlqgzR98qKONl27DuEES0aK0WE97jnsyO27Yp88Wa2RiBrEocM89QZI1seJiGDizHRUP4UZxw9zsXww46wy0P6f9grnYp7t8LkyDDk8eoI4KX6SNMNVcyVS9IWjlq8EzqZEKIA',
      },
      alg: 'RSA-OAEP',
      enc: 'A256GCM',
    },
    generated: {
      cek: 'mYMfsggkTAm0TbvtlFh2hyoXnbEzJQjMxmgLN3d8xXA',
      iv: '-nBoKLH0YkLZPSI9',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'RSA-OAEP',
        kid: 'samwise.gamgee@hobbiton.example',
        enc: 'A256GCM',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJSU0EtT0FFUCIsImtpZCI6InNhbXdpc2UuZ2FtZ2VlQGhvYmJpdG9uLmV4YW1wbGUiLCJlbmMiOiJBMjU2R0NNIn0.rT99rwrBTbTI7IJM8fU3Eli7226HEB7IchCxNuh7lCiud48LxeolRdtFF4nzQibeYOl5S_PJsAXZwSXtDePz9hk-BbtsTBqC2UsPOdwjC9NhNupNNu9uHIVftDyucvI6hvALeZ6OGnhNV4v1zx2k7O1D89mAzfw-_kT3tkuorpDU-CpBENfIHX1Q58-Aad3FzMuo3Fn9buEP2yXakLXYa15BUXQsupM4A1GD4_H4Bd7V3u9h8Gkg8BpxKdUV9ScfJQTcYm6eJEBz3aSwIaK4T3-dwWpuBOhROQXBosJzS1asnuHtVMt2pKIIfux5BC6huIvmY7kzV7W7aIUrpYm_3H4zYvyMeq5pGqFmW2k8zpO878TRlZx7pZfPYDSXZyS0CfKKkMozT_qiCwZTSz4duYnt8hS4Z9sGthXn9uDqd6wycMagnQfOTs_lycTWmY-aqWVDKhjYNRf03NiwRtb5BE-tOdFwCASQj3uuAgPGrO2AWBe38UjQb0lvXn1SpyvYZ3WFc7WOJYaTa7A8DRn6MC6T-xDmMuxC0G7S2rscw5lQQU06MvZTlFOt0UvfuKBa03cxA_nIBIhLMjY2kOTxQMmpDPTr6Cbo8aKaOnx6ASE5Jx9paBpnNmOOKH35j_QlrQhDWUN6A2Gg8iFayJ69xDEdHAVCGRzN3woEI2ozDRs.-nBoKLH0YkLZPSI9.o4k2cnGN8rSSw3IDo1YuySkqeS_t2m1GXklSgqBdpACm6UJuJowOHC5ytjqYgRL-I-soPlwqMUf4UgRWWeaOGNw6vGW-xyM01lTYxrXfVzIIaRdhYtEMRBvBWbEwP7ua1DRfvaOjgZv6Ifa3brcAM64d8p5lhhNcizPersuhw5f-pGYzseva-TUaL8iWnctc-sSwy7SQmRkfhDjwbz0fz6kFovEgj64X1I5s7E6GLp5fnbYGLa1QUiML7Cc2GxgvI7zqWo0YIEc7aCflLG1-8BboVWFdZKLK9vNoycrYHumwzKluLWEbSVmaPpOslY2n525DxDfWaVFUfKQxMF56vn4B9QMpWAbnypNimbM8zVOw.UCGiqJxhBI3IFVdPalHHvA',
      json: {
        recipients: [
          {
            encrypted_key:
              'rT99rwrBTbTI7IJM8fU3Eli7226HEB7IchCxNuh7lCiud48LxeolRdtFF4nzQibeYOl5S_PJsAXZwSXtDePz9hk-BbtsTBqC2UsPOdwjC9NhNupNNu9uHIVftDyucvI6hvALeZ6OGnhNV4v1zx2k7O1D89mAzfw-_kT3tkuorpDU-CpBENfIHX1Q58-Aad3FzMuo3Fn9buEP2yXakLXYa15BUXQsupM4A1GD4_H4Bd7V3u9h8Gkg8BpxKdUV9ScfJQTcYm6eJEBz3aSwIaK4T3-dwWpuBOhROQXBosJzS1asnuHtVMt2pKIIfux5BC6huIvmY7kzV7W7aIUrpYm_3H4zYvyMeq5pGqFmW2k8zpO878TRlZx7pZfPYDSXZyS0CfKKkMozT_qiCwZTSz4duYnt8hS4Z9sGthXn9uDqd6wycMagnQfOTs_lycTWmY-aqWVDKhjYNRf03NiwRtb5BE-tOdFwCASQj3uuAgPGrO2AWBe38UjQb0lvXn1SpyvYZ3WFc7WOJYaTa7A8DRn6MC6T-xDmMuxC0G7S2rscw5lQQU06MvZTlFOt0UvfuKBa03cxA_nIBIhLMjY2kOTxQMmpDPTr6Cbo8aKaOnx6ASE5Jx9paBpnNmOOKH35j_QlrQhDWUN6A2Gg8iFayJ69xDEdHAVCGRzN3woEI2ozDRs',
          },
        ],
        protected:
          'eyJhbGciOiJSU0EtT0FFUCIsImtpZCI6InNhbXdpc2UuZ2FtZ2VlQGhvYmJpdG9uLmV4YW1wbGUiLCJlbmMiOiJBMjU2R0NNIn0',
        iv: '-nBoKLH0YkLZPSI9',
        ciphertext:
          'o4k2cnGN8rSSw3IDo1YuySkqeS_t2m1GXklSgqBdpACm6UJuJowOHC5ytjqYgRL-I-soPlwqMUf4UgRWWeaOGNw6vGW-xyM01lTYxrXfVzIIaRdhYtEMRBvBWbEwP7ua1DRfvaOjgZv6Ifa3brcAM64d8p5lhhNcizPersuhw5f-pGYzseva-TUaL8iWnctc-sSwy7SQmRkfhDjwbz0fz6kFovEgj64X1I5s7E6GLp5fnbYGLa1QUiML7Cc2GxgvI7zqWo0YIEc7aCflLG1-8BboVWFdZKLK9vNoycrYHumwzKluLWEbSVmaPpOslY2n525DxDfWaVFUfKQxMF56vn4B9QMpWAbnypNimbM8zVOw',
        tag: 'UCGiqJxhBI3IFVdPalHHvA',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJSU0EtT0FFUCIsImtpZCI6InNhbXdpc2UuZ2FtZ2VlQGhvYmJpdG9uLmV4YW1wbGUiLCJlbmMiOiJBMjU2R0NNIn0',
        encrypted_key:
          'rT99rwrBTbTI7IJM8fU3Eli7226HEB7IchCxNuh7lCiud48LxeolRdtFF4nzQibeYOl5S_PJsAXZwSXtDePz9hk-BbtsTBqC2UsPOdwjC9NhNupNNu9uHIVftDyucvI6hvALeZ6OGnhNV4v1zx2k7O1D89mAzfw-_kT3tkuorpDU-CpBENfIHX1Q58-Aad3FzMuo3Fn9buEP2yXakLXYa15BUXQsupM4A1GD4_H4Bd7V3u9h8Gkg8BpxKdUV9ScfJQTcYm6eJEBz3aSwIaK4T3-dwWpuBOhROQXBosJzS1asnuHtVMt2pKIIfux5BC6huIvmY7kzV7W7aIUrpYm_3H4zYvyMeq5pGqFmW2k8zpO878TRlZx7pZfPYDSXZyS0CfKKkMozT_qiCwZTSz4duYnt8hS4Z9sGthXn9uDqd6wycMagnQfOTs_lycTWmY-aqWVDKhjYNRf03NiwRtb5BE-tOdFwCASQj3uuAgPGrO2AWBe38UjQb0lvXn1SpyvYZ3WFc7WOJYaTa7A8DRn6MC6T-xDmMuxC0G7S2rscw5lQQU06MvZTlFOt0UvfuKBa03cxA_nIBIhLMjY2kOTxQMmpDPTr6Cbo8aKaOnx6ASE5Jx9paBpnNmOOKH35j_QlrQhDWUN6A2Gg8iFayJ69xDEdHAVCGRzN3woEI2ozDRs',
        iv: '-nBoKLH0YkLZPSI9',
        ciphertext:
          'o4k2cnGN8rSSw3IDo1YuySkqeS_t2m1GXklSgqBdpACm6UJuJowOHC5ytjqYgRL-I-soPlwqMUf4UgRWWeaOGNw6vGW-xyM01lTYxrXfVzIIaRdhYtEMRBvBWbEwP7ua1DRfvaOjgZv6Ifa3brcAM64d8p5lhhNcizPersuhw5f-pGYzseva-TUaL8iWnctc-sSwy7SQmRkfhDjwbz0fz6kFovEgj64X1I5s7E6GLp5fnbYGLa1QUiML7Cc2GxgvI7zqWo0YIEc7aCflLG1-8BboVWFdZKLK9vNoycrYHumwzKluLWEbSVmaPpOslY2n525DxDfWaVFUfKQxMF56vn4B9QMpWAbnypNimbM8zVOw',
        tag: 'UCGiqJxhBI3IFVdPalHHvA',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.3 - Key Wrap using PBES2-AES-KeyWrap with AES-CBC-HMAC-SHA2',
    deterministic: true,
    input: {
      plaintext:
        '{"keys":[{"kty":"oct","kid":"77c7e2b8-6e13-45cf-8672-617b5b45243a","use":"enc","alg":"A128GCM","k":"XctOhJAkA-pD9Lh7ZgW_2A"},{"kty":"oct","kid":"81b20965-8332-43d9-a468-82160ad91ac8","use":"enc","alg":"A128KW","k":"GZy6sIZ6wl9NJOKB-jnmVQ"},{"kty":"oct","kid":"18ec08e1-bfa9-4d95-b205-2b4dd1d4321d","use":"enc","alg":"A256GCMKW","k":"qC57l_uxcm7Nm3K-ct4GFjx8tM1U8CZ0NLBvdQstiS8"}]}',
      pwd: 'entrap_o–peter_long–credit_tun',
      alg: 'PBES2-HS512+A256KW',
      enc: 'A128CBC-HS256',
    },
    generated: {
      cek: 'uwsjJXaBK407Qaf0_zpcpmr1Cs0CC50hIUEyGNEt3m0',
      iv: 'VBiCzVHNoLiR3F4V82uoTQ',
    },
    encrypting_key: {
      salt: '8Q1SzinasR3xchYz6ZZcHA',
      iteration_count: 8192,
    },
    encrypting_content: {
      protected: {
        alg: 'PBES2-HS512+A256KW',
        p2s: '8Q1SzinasR3xchYz6ZZcHA',
        p2c: 8192,
        cty: 'jwk-set+json',
        enc: 'A128CBC-HS256',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJQQkVTMi1IUzUxMitBMjU2S1ciLCJwMnMiOiI4UTFTemluYXNSM3hjaFl6NlpaY0hBIiwicDJjIjo4MTkyLCJjdHkiOiJqd2stc2V0K2pzb24iLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.d3qNhUWfqheyPp4H8sjOWsDYajoej4c5Je6rlUtFPWdgtURtmeDV1g.VBiCzVHNoLiR3F4V82uoTQ.23i-Tb1AV4n0WKVSSgcQrdg6GRqsUKxjruHXYsTHAJLZ2nsnGIX86vMXqIi6IRsfywCRFzLxEcZBRnTvG3nhzPk0GDD7FMyXhUHpDjEYCNA_XOmzg8yZR9oyjo6lTF6si4q9FZ2EhzgFQCLO_6h5EVg3vR75_hkBsnuoqoM3dwejXBtIodN84PeqMb6asmas_dpSsz7H10fC5ni9xIz424givB1YLldF6exVmL93R3fOoOJbmk2GBQZL_SEGllv2cQsBgeprARsaQ7Bq99tT80coH8ItBjgV08AtzXFFsx9qKvC982KLKdPQMTlVJKkqtV4Ru5LEVpBZXBnZrtViSOgyg6AiuwaS-rCrcD_ePOGSuxvgtrokAKYPqmXUeRdjFJwafkYEkiuDCV9vWGAi1DH2xTafhJwcmywIyzi4BqRpmdn_N-zl5tuJYyuvKhjKv6ihbsV_k1hJGPGAxJ6wUpmwC4PTQ2izEm0TuSE8oMKdTw8V3kobXZ77ulMwDs4p.0HlwodAhOCILG5SQ2LQ9dg',
      json: {
        recipients: [
          {
            encrypted_key: 'd3qNhUWfqheyPp4H8sjOWsDYajoej4c5Je6rlUtFPWdgtURtmeDV1g',
          },
        ],
        protected:
          'eyJhbGciOiJQQkVTMi1IUzUxMitBMjU2S1ciLCJwMnMiOiI4UTFTemluYXNSM3hjaFl6NlpaY0hBIiwicDJjIjo4MTkyLCJjdHkiOiJqd2stc2V0K2pzb24iLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0',
        iv: 'VBiCzVHNoLiR3F4V82uoTQ',
        ciphertext:
          '23i-Tb1AV4n0WKVSSgcQrdg6GRqsUKxjruHXYsTHAJLZ2nsnGIX86vMXqIi6IRsfywCRFzLxEcZBRnTvG3nhzPk0GDD7FMyXhUHpDjEYCNA_XOmzg8yZR9oyjo6lTF6si4q9FZ2EhzgFQCLO_6h5EVg3vR75_hkBsnuoqoM3dwejXBtIodN84PeqMb6asmas_dpSsz7H10fC5ni9xIz424givB1YLldF6exVmL93R3fOoOJbmk2GBQZL_SEGllv2cQsBgeprARsaQ7Bq99tT80coH8ItBjgV08AtzXFFsx9qKvC982KLKdPQMTlVJKkqtV4Ru5LEVpBZXBnZrtViSOgyg6AiuwaS-rCrcD_ePOGSuxvgtrokAKYPqmXUeRdjFJwafkYEkiuDCV9vWGAi1DH2xTafhJwcmywIyzi4BqRpmdn_N-zl5tuJYyuvKhjKv6ihbsV_k1hJGPGAxJ6wUpmwC4PTQ2izEm0TuSE8oMKdTw8V3kobXZ77ulMwDs4p',
        tag: '0HlwodAhOCILG5SQ2LQ9dg',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJQQkVTMi1IUzUxMitBMjU2S1ciLCJwMnMiOiI4UTFTemluYXNSM3hjaFl6NlpaY0hBIiwicDJjIjo4MTkyLCJjdHkiOiJqd2stc2V0K2pzb24iLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0',
        encrypted_key: 'd3qNhUWfqheyPp4H8sjOWsDYajoej4c5Je6rlUtFPWdgtURtmeDV1g',
        iv: 'VBiCzVHNoLiR3F4V82uoTQ',
        ciphertext:
          '23i-Tb1AV4n0WKVSSgcQrdg6GRqsUKxjruHXYsTHAJLZ2nsnGIX86vMXqIi6IRsfywCRFzLxEcZBRnTvG3nhzPk0GDD7FMyXhUHpDjEYCNA_XOmzg8yZR9oyjo6lTF6si4q9FZ2EhzgFQCLO_6h5EVg3vR75_hkBsnuoqoM3dwejXBtIodN84PeqMb6asmas_dpSsz7H10fC5ni9xIz424givB1YLldF6exVmL93R3fOoOJbmk2GBQZL_SEGllv2cQsBgeprARsaQ7Bq99tT80coH8ItBjgV08AtzXFFsx9qKvC982KLKdPQMTlVJKkqtV4Ru5LEVpBZXBnZrtViSOgyg6AiuwaS-rCrcD_ePOGSuxvgtrokAKYPqmXUeRdjFJwafkYEkiuDCV9vWGAi1DH2xTafhJwcmywIyzi4BqRpmdn_N-zl5tuJYyuvKhjKv6ihbsV_k1hJGPGAxJ6wUpmwC4PTQ2izEm0TuSE8oMKdTw8V3kobXZ77ulMwDs4p',
        tag: '0HlwodAhOCILG5SQ2LQ9dg',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.4 - Key Agreement with Key Wrapping using ECDH-ES and AES-KeyWrap with AES-GCM',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'EC',
        ext: false,
        kid: 'peregrin.took@tuckborough.example',
        use: 'enc',
        crv: 'P-384',
        x: 'YU4rRUzdmVqmRtWOs2OpDE_T5fsNIodcG8G5FWPrTPMyxpzsSOGaQLpe2FpxBmu2',
        y: 'A8-yxCHxkfBz3hKZfI1jUYMjUhsEveZ9THuwFjH2sCNdtksRJU7D5-SkgaFL1ETP',
        d: 'iTx2pk7wW-GqJkHcEkFQb2EFyYcO7RugmaW3mRrQVAOUiPommT0IdnYK2xDlZh-j',
      },
      alg: 'ECDH-ES+A128KW',
      enc: 'A128GCM',
    },
    generated: {
      cek: 'Nou2ueKlP70ZXDbq9UrRwg',
      iv: 'mH-G2zVqgztUtnW_',
    },
    encrypting_key: {
      epk: {
        kty: 'EC',
        crv: 'P-384',
        x: 'uBo4kHPw6kbjx5l0xowrd_oYzBmaz-GKFZu4xAFFkbYiWgutEK6iuEDsQ6wNdNg3',
        y: 'sp3p5SGhZVC2faXumI-e9JU2Mo8KpoYrFDr5yPNVtW4PgEwZOyQTA-JdaY8tb7E0',
        d: 'D5H4Y_5PSKZvhfVFbcCYJOtcGZygRgfZkpsBr59Icmmhe9sW6nkZ8WfwhinUfWJg',
      },
    },
    encrypting_content: {
      protected: {
        alg: 'ECDH-ES+A128KW',
        kid: 'peregrin.took@tuckborough.example',
        epk: {
          kty: 'EC',
          crv: 'P-384',
          x: 'uBo4kHPw6kbjx5l0xowrd_oYzBmaz-GKFZu4xAFFkbYiWgutEK6iuEDsQ6wNdNg3',
          y: 'sp3p5SGhZVC2faXumI-e9JU2Mo8KpoYrFDr5yPNVtW4PgEwZOyQTA-JdaY8tb7E0',
        },
        enc: 'A128GCM',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImtpZCI6InBlcmVncmluLnRvb2tAdHVja2Jvcm91Z2guZXhhbXBsZSIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwieCI6InVCbzRrSFB3Nmtiang1bDB4b3dyZF9vWXpCbWF6LUdLRlp1NHhBRkZrYllpV2d1dEVLNml1RURzUTZ3TmROZzMiLCJ5Ijoic3AzcDVTR2haVkMyZmFYdW1JLWU5SlUyTW84S3BvWXJGRHI1eVBOVnRXNFBnRXdaT3lRVEEtSmRhWTh0YjdFMCJ9LCJlbmMiOiJBMTI4R0NNIn0.0DJjBXri_kBcC46IkU5_Jk9BqaQeHdv2.mH-G2zVqgztUtnW_.tkZuOO9h95OgHJmkkrfLBisku8rGf6nzVxhRM3sVOhXgz5NJ76oID7lpnAi_cPWJRCjSpAaUZ5dOR3Spy7QuEkmKx8-3RCMhSYMzsXaEwDdXta9Mn5B7cCBoJKB0IgEnj_qfo1hIi-uEkUpOZ8aLTZGHfpl05jMwbKkTe2yK3mjF6SBAsgicQDVCkcY9BLluzx1RmC3ORXaM0JaHPB93YcdSDGgpgBWMVrNU1ErkjcMqMoT_wtCex3w03XdLkjXIuEr2hWgeP-nkUZTPU9EoGSPj6fAS-bSz87RCPrxZdj_iVyC6QWcqAu07WNhjzJEPc4jVntRJ6K53NgPQ5p99l3Z408OUqj4ioYezbS6vTPlQ.WuGzxmcreYjpHGJoa17EBg',
      json: {
        recipients: [
          {
            encrypted_key: '0DJjBXri_kBcC46IkU5_Jk9BqaQeHdv2',
          },
        ],
        protected:
          'eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImtpZCI6InBlcmVncmluLnRvb2tAdHVja2Jvcm91Z2guZXhhbXBsZSIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwieCI6InVCbzRrSFB3Nmtiang1bDB4b3dyZF9vWXpCbWF6LUdLRlp1NHhBRkZrYllpV2d1dEVLNml1RURzUTZ3TmROZzMiLCJ5Ijoic3AzcDVTR2haVkMyZmFYdW1JLWU5SlUyTW84S3BvWXJGRHI1eVBOVnRXNFBnRXdaT3lRVEEtSmRhWTh0YjdFMCJ9LCJlbmMiOiJBMTI4R0NNIn0',
        iv: 'mH-G2zVqgztUtnW_',
        ciphertext:
          'tkZuOO9h95OgHJmkkrfLBisku8rGf6nzVxhRM3sVOhXgz5NJ76oID7lpnAi_cPWJRCjSpAaUZ5dOR3Spy7QuEkmKx8-3RCMhSYMzsXaEwDdXta9Mn5B7cCBoJKB0IgEnj_qfo1hIi-uEkUpOZ8aLTZGHfpl05jMwbKkTe2yK3mjF6SBAsgicQDVCkcY9BLluzx1RmC3ORXaM0JaHPB93YcdSDGgpgBWMVrNU1ErkjcMqMoT_wtCex3w03XdLkjXIuEr2hWgeP-nkUZTPU9EoGSPj6fAS-bSz87RCPrxZdj_iVyC6QWcqAu07WNhjzJEPc4jVntRJ6K53NgPQ5p99l3Z408OUqj4ioYezbS6vTPlQ',
        tag: 'WuGzxmcreYjpHGJoa17EBg',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImtpZCI6InBlcmVncmluLnRvb2tAdHVja2Jvcm91Z2guZXhhbXBsZSIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwieCI6InVCbzRrSFB3Nmtiang1bDB4b3dyZF9vWXpCbWF6LUdLRlp1NHhBRkZrYllpV2d1dEVLNml1RURzUTZ3TmROZzMiLCJ5Ijoic3AzcDVTR2haVkMyZmFYdW1JLWU5SlUyTW84S3BvWXJGRHI1eVBOVnRXNFBnRXdaT3lRVEEtSmRhWTh0YjdFMCJ9LCJlbmMiOiJBMTI4R0NNIn0',
        encrypted_key: '0DJjBXri_kBcC46IkU5_Jk9BqaQeHdv2',
        iv: 'mH-G2zVqgztUtnW_',
        ciphertext:
          'tkZuOO9h95OgHJmkkrfLBisku8rGf6nzVxhRM3sVOhXgz5NJ76oID7lpnAi_cPWJRCjSpAaUZ5dOR3Spy7QuEkmKx8-3RCMhSYMzsXaEwDdXta9Mn5B7cCBoJKB0IgEnj_qfo1hIi-uEkUpOZ8aLTZGHfpl05jMwbKkTe2yK3mjF6SBAsgicQDVCkcY9BLluzx1RmC3ORXaM0JaHPB93YcdSDGgpgBWMVrNU1ErkjcMqMoT_wtCex3w03XdLkjXIuEr2hWgeP-nkUZTPU9EoGSPj6fAS-bSz87RCPrxZdj_iVyC6QWcqAu07WNhjzJEPc4jVntRJ6K53NgPQ5p99l3Z408OUqj4ioYezbS6vTPlQ',
        tag: 'WuGzxmcreYjpHGJoa17EBg',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.5 - Key Agreement using ECDH-ES with AES-CBC-HMAC-SHA2',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'EC',
        ext: false,
        kid: 'meriadoc.brandybuck@buckland.example',
        use: 'enc',
        crv: 'P-256',
        x: 'Ze2loSV3wrroKUN_4zhwGhCqo3Xhu1td4QjeQ5wIVR0',
        y: 'HlLtdXARY_f55A3fnzQbPcm6hgr34Mp8p-nuzQCE0Zw',
        d: 'r_kHyZ-a06rmxM3yESK84r1otSg-aQcVStkRhA-iCM8',
      },
      alg: 'ECDH-ES',
      enc: 'A128CBC-HS256',
    },
    generated: {
      iv: 'yc9N8v5sYyv3iGQT926IUg',
    },
    encrypting_key: {
      epk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'mPUKT_bAWGHIhg0TpjjqVsP1rXWQu_vwVOHHtNkdYoA',
        y: '8BQAsImGeAS46fyWw5MhYfGTT0IjBpFw2SS34Dv4Irs',
        d: 'AtH35vJsQ9SGjYfOsjUxYXQKrPH3FjZHmEtSKoSN8cM',
      },
      cek: 'hzHdlfQIAEehb8Hrd_mFRhKsKLEzPfshfXs9l6areCc',
    },
    encrypting_content: {
      protected: {
        alg: 'ECDH-ES',
        kid: 'meriadoc.brandybuck@buckland.example',
        epk: {
          kty: 'EC',
          crv: 'P-256',
          x: 'mPUKT_bAWGHIhg0TpjjqVsP1rXWQu_vwVOHHtNkdYoA',
          y: '8BQAsImGeAS46fyWw5MhYfGTT0IjBpFw2SS34Dv4Irs',
        },
        enc: 'A128CBC-HS256',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJFQ0RILUVTIiwia2lkIjoibWVyaWFkb2MuYnJhbmR5YnVja0BidWNrbGFuZC5leGFtcGxlIiwiZXBrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoibVBVS1RfYkFXR0hJaGcwVHBqanFWc1AxclhXUXVfdndWT0hIdE5rZFlvQSIsInkiOiI4QlFBc0ltR2VBUzQ2ZnlXdzVNaFlmR1RUMElqQnBGdzJTUzM0RHY0SXJzIn0sImVuYyI6IkExMjhDQkMtSFMyNTYifQ..yc9N8v5sYyv3iGQT926IUg.BoDlwPnTypYq-ivjmQvAYJLb5Q6l-F3LIgQomlz87yW4OPKbWE1zSTEFjDfhU9IPIOSA9Bml4m7iDFwA-1ZXvHteLDtw4R1XRGMEsDIqAYtskTTmzmzNa-_q4F_evAPUmwlO-ZG45Mnq4uhM1fm_D9rBtWolqZSF3xGNNkpOMQKF1Cl8i8wjzRli7-IXgyirlKQsbhhqRzkv8IcY6aHl24j03C-AR2le1r7URUhArM79BY8soZU0lzwI-sD5PZ3l4NDCCei9XkoIAfsXJWmySPoeRb2Ni5UZL4mYpvKDiwmyzGd65KqVw7MsFfI_K767G9C9Azp73gKZD0DyUn1mn0WW5LmyX_yJ-3AROq8p1WZBfG-ZyJ6195_JGG2m9Csg.WCCkNa-x4BeB9hIDIfFuhg',
      json: {
        protected:
          'eyJhbGciOiJFQ0RILUVTIiwia2lkIjoibWVyaWFkb2MuYnJhbmR5YnVja0BidWNrbGFuZC5leGFtcGxlIiwiZXBrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoibVBVS1RfYkFXR0hJaGcwVHBqanFWc1AxclhXUXVfdndWT0hIdE5rZFlvQSIsInkiOiI4QlFBc0ltR2VBUzQ2ZnlXdzVNaFlmR1RUMElqQnBGdzJTUzM0RHY0SXJzIn0sImVuYyI6IkExMjhDQkMtSFMyNTYifQ',
        iv: 'yc9N8v5sYyv3iGQT926IUg',
        ciphertext:
          'BoDlwPnTypYq-ivjmQvAYJLb5Q6l-F3LIgQomlz87yW4OPKbWE1zSTEFjDfhU9IPIOSA9Bml4m7iDFwA-1ZXvHteLDtw4R1XRGMEsDIqAYtskTTmzmzNa-_q4F_evAPUmwlO-ZG45Mnq4uhM1fm_D9rBtWolqZSF3xGNNkpOMQKF1Cl8i8wjzRli7-IXgyirlKQsbhhqRzkv8IcY6aHl24j03C-AR2le1r7URUhArM79BY8soZU0lzwI-sD5PZ3l4NDCCei9XkoIAfsXJWmySPoeRb2Ni5UZL4mYpvKDiwmyzGd65KqVw7MsFfI_K767G9C9Azp73gKZD0DyUn1mn0WW5LmyX_yJ-3AROq8p1WZBfG-ZyJ6195_JGG2m9Csg',
        tag: 'WCCkNa-x4BeB9hIDIfFuhg',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJFQ0RILUVTIiwia2lkIjoibWVyaWFkb2MuYnJhbmR5YnVja0BidWNrbGFuZC5leGFtcGxlIiwiZXBrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoibVBVS1RfYkFXR0hJaGcwVHBqanFWc1AxclhXUXVfdndWT0hIdE5rZFlvQSIsInkiOiI4QlFBc0ltR2VBUzQ2ZnlXdzVNaFlmR1RUMElqQnBGdzJTUzM0RHY0SXJzIn0sImVuYyI6IkExMjhDQkMtSFMyNTYifQ',
        iv: 'yc9N8v5sYyv3iGQT926IUg',
        ciphertext:
          'BoDlwPnTypYq-ivjmQvAYJLb5Q6l-F3LIgQomlz87yW4OPKbWE1zSTEFjDfhU9IPIOSA9Bml4m7iDFwA-1ZXvHteLDtw4R1XRGMEsDIqAYtskTTmzmzNa-_q4F_evAPUmwlO-ZG45Mnq4uhM1fm_D9rBtWolqZSF3xGNNkpOMQKF1Cl8i8wjzRli7-IXgyirlKQsbhhqRzkv8IcY6aHl24j03C-AR2le1r7URUhArM79BY8soZU0lzwI-sD5PZ3l4NDCCei9XkoIAfsXJWmySPoeRb2Ni5UZL4mYpvKDiwmyzGd65KqVw7MsFfI_K767G9C9Azp73gKZD0DyUn1mn0WW5LmyX_yJ-3AROq8p1WZBfG-ZyJ6195_JGG2m9Csg',
        tag: 'WCCkNa-x4BeB9hIDIfFuhg',
      },
    },
  },
  {
    title: 'https://www.rfc-editor.org/info/rfc7520/#section-5.6 - Direct Encryption using AES-GCM',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '77c7e2b8-6e13-45cf-8672-617b5b45243a',
        use: 'enc',
        alg: 'A128GCM',
        k: 'XctOhJAkA-pD9Lh7ZgW_2A',
      },
      alg: 'dir',
      enc: 'A128GCM',
    },
    generated: {
      iv: 'refa467QzzKx6QAB',
    },
    encrypting_content: {
      protected: {
        alg: 'dir',
        kid: '77c7e2b8-6e13-45cf-8672-617b5b45243a',
        enc: 'A128GCM',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJkaXIiLCJraWQiOiI3N2M3ZTJiOC02ZTEzLTQ1Y2YtODY3Mi02MTdiNWI0NTI0M2EiLCJlbmMiOiJBMTI4R0NNIn0..refa467QzzKx6QAB.JW_i_f52hww_ELQPGaYyeAB6HYGcR559l9TYnSovc23XJoBcW29rHP8yZOZG7YhLpT1bjFuvZPjQS-m0IFtVcXkZXdH_lr_FrdYt9HRUYkshtrMmIUAyGmUnd9zMDB2n0cRDIHAzFVeJUDxkUwVAE7_YGRPdcqMyiBoCO-FBdE-Nceb4h3-FtBP-c_BIwCPTjb9o0SbdcdREEMJMyZBH8ySWMVi1gPD9yxi-aQpGbSv_F9N4IZAxscj5g-NJsUPbjk29-s7LJAGb15wEBtXphVCgyy53CoIKLHHeJHXex45Uz9aKZSRSInZI-wjsY0yu3cT4_aQ3i1o-tiE-F8Ios61EKgyIQ4CWao8PFMj8TTnp.vbb32Xvllea2OtmHAdccRQ',
      json: {
        protected:
          'eyJhbGciOiJkaXIiLCJraWQiOiI3N2M3ZTJiOC02ZTEzLTQ1Y2YtODY3Mi02MTdiNWI0NTI0M2EiLCJlbmMiOiJBMTI4R0NNIn0',
        iv: 'refa467QzzKx6QAB',
        ciphertext:
          'JW_i_f52hww_ELQPGaYyeAB6HYGcR559l9TYnSovc23XJoBcW29rHP8yZOZG7YhLpT1bjFuvZPjQS-m0IFtVcXkZXdH_lr_FrdYt9HRUYkshtrMmIUAyGmUnd9zMDB2n0cRDIHAzFVeJUDxkUwVAE7_YGRPdcqMyiBoCO-FBdE-Nceb4h3-FtBP-c_BIwCPTjb9o0SbdcdREEMJMyZBH8ySWMVi1gPD9yxi-aQpGbSv_F9N4IZAxscj5g-NJsUPbjk29-s7LJAGb15wEBtXphVCgyy53CoIKLHHeJHXex45Uz9aKZSRSInZI-wjsY0yu3cT4_aQ3i1o-tiE-F8Ios61EKgyIQ4CWao8PFMj8TTnp',
        tag: 'vbb32Xvllea2OtmHAdccRQ',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJkaXIiLCJraWQiOiI3N2M3ZTJiOC02ZTEzLTQ1Y2YtODY3Mi02MTdiNWI0NTI0M2EiLCJlbmMiOiJBMTI4R0NNIn0',
        iv: 'refa467QzzKx6QAB',
        ciphertext:
          'JW_i_f52hww_ELQPGaYyeAB6HYGcR559l9TYnSovc23XJoBcW29rHP8yZOZG7YhLpT1bjFuvZPjQS-m0IFtVcXkZXdH_lr_FrdYt9HRUYkshtrMmIUAyGmUnd9zMDB2n0cRDIHAzFVeJUDxkUwVAE7_YGRPdcqMyiBoCO-FBdE-Nceb4h3-FtBP-c_BIwCPTjb9o0SbdcdREEMJMyZBH8ySWMVi1gPD9yxi-aQpGbSv_F9N4IZAxscj5g-NJsUPbjk29-s7LJAGb15wEBtXphVCgyy53CoIKLHHeJHXex45Uz9aKZSRSInZI-wjsY0yu3cT4_aQ3i1o-tiE-F8Ios61EKgyIQ4CWao8PFMj8TTnp',
        tag: 'vbb32Xvllea2OtmHAdccRQ',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.7 - Key Wrap using AES-GCM KeyWrap with AES-CBC-HMAC-SHA2',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
        use: 'enc',
        alg: 'A256GCMKW',
        k: 'qC57l_uxcm7Nm3K-ct4GFjx8tM1U8CZ0NLBvdQstiS8',
      },
      alg: 'A256GCMKW',
      enc: 'A128CBC-HS256',
    },
    generated: {
      cek: 'UWxARpat23nL9ReIj4WG3D1ee9I4r-Mv5QLuFXdy_rE',
      iv: 'gz6NjyEFNm_vm8Gj6FwoFQ',
    },
    encrypting_key: {
      iv: 'KkYT0GX_2jHlfqN_',
      tag: 'kfPduVQ3T3H6vnewt--ksw',
    },
    encrypting_content: {
      protected: {
        alg: 'A256GCMKW',
        kid: '18ec08e1-bfa9-4d95-b205-2b4dd1d4321d',
        tag: 'kfPduVQ3T3H6vnewt--ksw',
        iv: 'KkYT0GX_2jHlfqN_',
        enc: 'A128CBC-HS256',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9.lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok.gz6NjyEFNm_vm8Gj6FwoFQ.Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU.DKW7jrb4WaRSNfbXVPlT5g',
      json: {
        recipients: [
          {
            encrypted_key: 'lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok',
          },
        ],
        protected:
          'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9',
        iv: 'gz6NjyEFNm_vm8Gj6FwoFQ',
        ciphertext:
          'Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU',
        tag: 'DKW7jrb4WaRSNfbXVPlT5g',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJBMjU2R0NNS1ciLCJraWQiOiIxOGVjMDhlMS1iZmE5LTRkOTUtYjIwNS0yYjRkZDFkNDMyMWQiLCJ0YWciOiJrZlBkdVZRM1QzSDZ2bmV3dC0ta3N3IiwiaXYiOiJLa1lUMEdYXzJqSGxmcU5fIiwiZW5jIjoiQTEyOENCQy1IUzI1NiJ9',
        encrypted_key: 'lJf3HbOApxMEBkCMOoTnnABxs_CvTWUmZQ2ElLvYNok',
        iv: 'gz6NjyEFNm_vm8Gj6FwoFQ',
        ciphertext:
          'Jf5p9-ZhJlJy_IQ_byKFmI0Ro7w7G1QiaZpI8OaiVgD8EqoDZHyFKFBupS8iaEeVIgMqWmsuJKuoVgzR3YfzoMd3GxEm3VxNhzWyWtZKX0gxKdy6HgLvqoGNbZCzLjqcpDiF8q2_62EVAbr2uSc2oaxFmFuIQHLcqAHxy51449xkjZ7ewzZaGV3eFqhpco8o4DijXaG5_7kp3h2cajRfDgymuxUbWgLqaeNQaJtvJmSMFuEOSAzw9Hdeb6yhdTynCRmu-kqtO5Dec4lT2OMZKpnxc_F1_4yDJFcqb5CiDSmA-psB2k0JtjxAj4UPI61oONK7zzFIu4gBfjJCndsZfdvG7h8wGjV98QhrKEnR7xKZ3KCr0_qR1B-gxpNk3xWU',
        tag: 'DKW7jrb4WaRSNfbXVPlT5g',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.8 - Key Wrap using AES-KeyWrap with AES-GCM',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        use: 'enc',
        alg: 'A128KW',
        k: 'GZy6sIZ6wl9NJOKB-jnmVQ',
      },
      alg: 'A128KW',
      enc: 'A128GCM',
    },
    generated: {
      cek: 'aY5_Ghmk9KxWPBLu_glx1w',
      iv: 'Qx0pmsDa8KnJc9Jo',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0.CBI6oDw8MydIx1IBntf_lQcw2MmJKIQx.Qx0pmsDa8KnJc9Jo.AwliP-KmWgsZ37BvzCefNen6VTbRK3QMA4TkvRkH0tP1bTdhtFJgJxeVmJkLD61A1hnWGetdg11c9ADsnWgL56NyxwSYjU1ZEHcGkd3EkU0vjHi9gTlb90qSYFfeF0LwkcTtjbYKCsiNJQkcIp1yeM03OmuiYSoYJVSpf7ej6zaYcMv3WwdxDFl8REwOhNImk2Xld2JXq6BR53TSFkyT7PwVLuq-1GwtGHlQeg7gDT6xW0JqHDPn_H-puQsmthc9Zg0ojmJfqqFvETUxLAF-KjcBTS5dNy6egwkYtOt8EIHK-oEsKYtZRaa8Z7MOZ7UGxGIMvEmxrGCPeJa14slv2-gaqK0kEThkaSqdYw0FkQZF.ER7MWJZ1FBI_NKvn7Zb1Lw',
      json: {
        recipients: [
          {
            encrypted_key: 'CBI6oDw8MydIx1IBntf_lQcw2MmJKIQx',
          },
        ],
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
        iv: 'Qx0pmsDa8KnJc9Jo',
        ciphertext:
          'AwliP-KmWgsZ37BvzCefNen6VTbRK3QMA4TkvRkH0tP1bTdhtFJgJxeVmJkLD61A1hnWGetdg11c9ADsnWgL56NyxwSYjU1ZEHcGkd3EkU0vjHi9gTlb90qSYFfeF0LwkcTtjbYKCsiNJQkcIp1yeM03OmuiYSoYJVSpf7ej6zaYcMv3WwdxDFl8REwOhNImk2Xld2JXq6BR53TSFkyT7PwVLuq-1GwtGHlQeg7gDT6xW0JqHDPn_H-puQsmthc9Zg0ojmJfqqFvETUxLAF-KjcBTS5dNy6egwkYtOt8EIHK-oEsKYtZRaa8Z7MOZ7UGxGIMvEmxrGCPeJa14slv2-gaqK0kEThkaSqdYw0FkQZF',
        tag: 'ER7MWJZ1FBI_NKvn7Zb1Lw',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
        encrypted_key: 'CBI6oDw8MydIx1IBntf_lQcw2MmJKIQx',
        iv: 'Qx0pmsDa8KnJc9Jo',
        ciphertext:
          'AwliP-KmWgsZ37BvzCefNen6VTbRK3QMA4TkvRkH0tP1bTdhtFJgJxeVmJkLD61A1hnWGetdg11c9ADsnWgL56NyxwSYjU1ZEHcGkd3EkU0vjHi9gTlb90qSYFfeF0LwkcTtjbYKCsiNJQkcIp1yeM03OmuiYSoYJVSpf7ej6zaYcMv3WwdxDFl8REwOhNImk2Xld2JXq6BR53TSFkyT7PwVLuq-1GwtGHlQeg7gDT6xW0JqHDPn_H-puQsmthc9Zg0ojmJfqqFvETUxLAF-KjcBTS5dNy6egwkYtOt8EIHK-oEsKYtZRaa8Z7MOZ7UGxGIMvEmxrGCPeJa14slv2-gaqK0kEThkaSqdYw0FkQZF',
        tag: 'ER7MWJZ1FBI_NKvn7Zb1Lw',
      },
    },
  },
  {
    title: 'https://www.rfc-editor.org/info/rfc7520/#section-5.9 - Compressed Content',
    deterministic: false, // https://www.rfc-editor.org/errata/eid7680
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        use: 'enc',
        alg: 'A128KW',
        k: 'GZy6sIZ6wl9NJOKB-jnmVQ',
      },
      alg: 'A128KW',
      enc: 'A128GCM',
      zip: 'DEF',
    },
    generated: {
      plaintext_c:
        'bY_BDcIwDEVX-QNU3QEOrIA4pqlDokYxchxVvbEDGzIJbioOSJwc-f___HPjBu8KVFpVtAplVE1-wZo0YjNZo3C7R5v72pV5f5X382VWjYQpqZKAyjziZOr2B7kQPSy6oZIXUnDYbVKN4jNXi2u0yB7t1qSHTjmMODf9QgvrDzfTIQXnyQRuUya4zIWG3vTOdir0v7BRHFYWq3k1k1A_gSDJqtcBF-GZxw8',
      cek: 'hC-MpLZSuwWv8sexS6ydfw',
      iv: 'p9pUq6XHY0jfEZIl',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM',
        zip: 'DEF',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0.5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi.p9pUq6XHY0jfEZIl.HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw.VILuUwuIxaLVmh5X-T7kmA',
      json: {
        recipients: [
          {
            encrypted_key: '5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi',
          },
        ],
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0',
        iv: 'p9pUq6XHY0jfEZIl',
        ciphertext:
          'HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw',
        tag: 'VILuUwuIxaLVmh5X-T7kmA',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIiwiemlwIjoiREVGIn0',
        encrypted_key: '5vUT2WOtQxKWcekM_IzVQwkGgzlFDwPi',
        iv: 'p9pUq6XHY0jfEZIl',
        ciphertext:
          'HbDtOsdai1oYziSx25KEeTxmwnh8L8jKMFNc1k3zmMI6VB8hry57tDZ61jXyezSPt0fdLVfe6Jf5y5-JaCap_JQBcb5opbmT60uWGml8blyiMQmOn9J--XhhlYg0m-BHaqfDO5iTOWxPxFMUedx7WCy8mxgDHj0aBMG6152PsM-w5E_o2B3jDbrYBKhpYA7qi3AyijnCJ7BP9rr3U8kxExCpG3mK420TjOw',
        tag: 'VILuUwuIxaLVmh5X-T7kmA',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.10 - Including Additional Authenticated Data',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        use: 'enc',
        alg: 'A128KW',
        k: 'GZy6sIZ6wl9NJOKB-jnmVQ',
      },
      alg: 'A128KW',
      enc: 'A128GCM',
      aad: '["vcard",[["version",{},"text","4.0"],["fn",{},"text","Meriadoc Brandybuck"],["n",{},"text",["Brandybuck","Meriadoc","Mr.",""]],["bday",{},"text","TA 2982"],["gender",{},"text","M"]]]',
    },
    generated: {
      cek: '75m1ALsYv10pZTKPWrsqdg',
      iv: 'veCx9ece2orS7c_N',
      aad_b64u:
        'WyJ2Y2FyZCIsW1sidmVyc2lvbiIse30sInRleHQiLCI0LjAiXSxbImZuIix7fSwidGV4dCIsIk1lcmlhZG9jIEJyYW5keWJ1Y2siXSxbIm4iLHt9LCJ0ZXh0IixbIkJyYW5keWJ1Y2siLCJNZXJpYWRvYyIsIk1yLiIsIiJdXSxbImJkYXkiLHt9LCJ0ZXh0IiwiVEEgMjk4MiJdLFsiZ2VuZGVyIix7fSwidGV4dCIsIk0iXV1d',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM',
      },
    },
    output: {
      json: {
        recipients: [
          {
            encrypted_key: '4YiiQ_ZzH76TaIkJmYfRFgOV9MIpnx4X',
          },
        ],
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
        iv: 'veCx9ece2orS7c_N',
        aad: 'WyJ2Y2FyZCIsW1sidmVyc2lvbiIse30sInRleHQiLCI0LjAiXSxbImZuIix7fSwidGV4dCIsIk1lcmlhZG9jIEJyYW5keWJ1Y2siXSxbIm4iLHt9LCJ0ZXh0IixbIkJyYW5keWJ1Y2siLCJNZXJpYWRvYyIsIk1yLiIsIiJdXSxbImJkYXkiLHt9LCJ0ZXh0IiwiVEEgMjk4MiJdLFsiZ2VuZGVyIix7fSwidGV4dCIsIk0iXV1d',
        ciphertext:
          'Z_3cbr0k3bVM6N3oSNmHz7Lyf3iPppGf3Pj17wNZqteJ0Ui8p74SchQP8xygM1oFRWCNzeIa6s6BcEtp8qEFiqTUEyiNkOWDNoF14T_4NFqF-p2Mx8zkbKxI7oPK8KNarFbyxIDvICNqBLba-v3uzXBdB89fzOI-Lv4PjOFAQGHrgv1rjXAmKbgkft9cB4WeyZw8MldbBhc-V_KWZslrsLNygon_JJWd_ek6LQn5NRehvApqf9ZrxB4aq3FXBxOxCys35PhCdaggy2kfUfl2OkwKnWUbgXVD1C6HxLIlqHhCwXDG59weHrRDQeHyMRoBljoV3X_bUTJDnKBFOod7nLz-cj48JMx3SnCZTpbQAkFV',
        tag: 'vOaH_Rajnpy_3hOtqvZHRA',
      },
      json_flat: {
        protected:
          'eyJhbGciOiJBMTI4S1ciLCJraWQiOiI4MWIyMDk2NS04MzMyLTQzZDktYTQ2OC04MjE2MGFkOTFhYzgiLCJlbmMiOiJBMTI4R0NNIn0',
        encrypted_key: '4YiiQ_ZzH76TaIkJmYfRFgOV9MIpnx4X',
        aad: 'WyJ2Y2FyZCIsW1sidmVyc2lvbiIse30sInRleHQiLCI0LjAiXSxbImZuIix7fSwidGV4dCIsIk1lcmlhZG9jIEJyYW5keWJ1Y2siXSxbIm4iLHt9LCJ0ZXh0IixbIkJyYW5keWJ1Y2siLCJNZXJpYWRvYyIsIk1yLiIsIiJdXSxbImJkYXkiLHt9LCJ0ZXh0IiwiVEEgMjk4MiJdLFsiZ2VuZGVyIix7fSwidGV4dCIsIk0iXV1d',
        iv: 'veCx9ece2orS7c_N',
        ciphertext:
          'Z_3cbr0k3bVM6N3oSNmHz7Lyf3iPppGf3Pj17wNZqteJ0Ui8p74SchQP8xygM1oFRWCNzeIa6s6BcEtp8qEFiqTUEyiNkOWDNoF14T_4NFqF-p2Mx8zkbKxI7oPK8KNarFbyxIDvICNqBLba-v3uzXBdB89fzOI-Lv4PjOFAQGHrgv1rjXAmKbgkft9cB4WeyZw8MldbBhc-V_KWZslrsLNygon_JJWd_ek6LQn5NRehvApqf9ZrxB4aq3FXBxOxCys35PhCdaggy2kfUfl2OkwKnWUbgXVD1C6HxLIlqHhCwXDG59weHrRDQeHyMRoBljoV3X_bUTJDnKBFOod7nLz-cj48JMx3SnCZTpbQAkFV',
        tag: 'vOaH_Rajnpy_3hOtqvZHRA',
      },
    },
  },
  {
    title:
      'https://www.rfc-editor.org/info/rfc7520/#section-5.11 - Protecting Specific Header Fields',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        use: 'enc',
        alg: 'A128KW',
        k: 'GZy6sIZ6wl9NJOKB-jnmVQ',
      },
      alg: 'A128KW',
      enc: 'A128GCM',
    },
    generated: {
      cek: 'WDgEptBmQs9ouUvArz6x6g',
      iv: 'WgEJsDS9bkoXQ3nR',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        enc: 'A128GCM',
      },
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
      },
    },
    output: {
      json: {
        recipients: [
          {
            encrypted_key: 'jJIcM9J-hbx3wnqhf5FlkEYos0sHsF0H',
          },
        ],
        unprotected: {
          alg: 'A128KW',
          kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        },
        protected: 'eyJlbmMiOiJBMTI4R0NNIn0',
        iv: 'WgEJsDS9bkoXQ3nR',
        ciphertext:
          'lIbCyRmRJxnB2yLQOTqjCDKV3H30ossOw3uD9DPsqLL2DM3swKkjOwQyZtWsFLYMj5YeLht_StAn21tHmQJuuNt64T8D4t6C7kC9OCCJ1IHAolUv4MyOt80MoPb8fZYbNKqplzYJgIL58g8N2v46OgyG637d6uuKPwhAnTGm_zWhqc_srOvgiLkzyFXPq1hBAURbc3-8BqeRb48iR1-_5g5UjWVD3lgiLCN_P7AW8mIiFvUNXBPJK3nOWL4teUPS8yHLbWeL83olU4UAgL48x-8dDkH23JykibVSQju-f7e-1xreHWXzWLHs1NqBbre0dEwK3HX_xM0LjUz77Krppgegoutpf5qaKg3l-_xMINmf',
        tag: 'fNYLqpUe84KD45lvDiaBAQ',
      },
      json_flat: {
        protected: 'eyJlbmMiOiJBMTI4R0NNIn0',
        unprotected: {
          alg: 'A128KW',
          kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        },
        encrypted_key: 'jJIcM9J-hbx3wnqhf5FlkEYos0sHsF0H',
        iv: 'WgEJsDS9bkoXQ3nR',
        ciphertext:
          'lIbCyRmRJxnB2yLQOTqjCDKV3H30ossOw3uD9DPsqLL2DM3swKkjOwQyZtWsFLYMj5YeLht_StAn21tHmQJuuNt64T8D4t6C7kC9OCCJ1IHAolUv4MyOt80MoPb8fZYbNKqplzYJgIL58g8N2v46OgyG637d6uuKPwhAnTGm_zWhqc_srOvgiLkzyFXPq1hBAURbc3-8BqeRb48iR1-_5g5UjWVD3lgiLCN_P7AW8mIiFvUNXBPJK3nOWL4teUPS8yHLbWeL83olU4UAgL48x-8dDkH23JykibVSQju-f7e-1xreHWXzWLHs1NqBbre0dEwK3HX_xM0LjUz77Krppgegoutpf5qaKg3l-_xMINmf',
        tag: 'fNYLqpUe84KD45lvDiaBAQ',
      },
    },
  },
  {
    title: 'https://www.rfc-editor.org/info/rfc7520/#section-5.12 - Protecting Content Only',
    deterministic: true,
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'oct',
        ext: false,
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        use: 'enc',
        alg: 'A128KW',
        k: 'GZy6sIZ6wl9NJOKB-jnmVQ',
      },
      alg: 'A128KW',
      enc: 'A128GCM',
    },
    generated: {
      cek: 'KBooAFl30QPV3vkcZlXnzQ',
      iv: 'YihBoVOGsR1l7jCD',
    },
    encrypting_key: {},
    encrypting_content: {
      unprotected: {
        alg: 'A128KW',
        kid: '81b20965-8332-43d9-a468-82160ad91ac8',
        enc: 'A128GCM',
      },
    },
    output: {
      json: {
        recipients: [
          {
            encrypted_key: '244YHfO_W7RMpQW81UjQrZcq5LSyqiPv',
          },
        ],
        unprotected: {
          alg: 'A128KW',
          kid: '81b20965-8332-43d9-a468-82160ad91ac8',
          enc: 'A128GCM',
        },
        iv: 'YihBoVOGsR1l7jCD',
        ciphertext:
          'qtPIMMaOBRgASL10dNQhOa7Gqrk7Eal1vwht7R4TT1uq-arsVCPaIeFwQfzrSS6oEUWbBtxEasE0vC6r7sphyVziMCVJEuRJyoAHFSP3eqQPb4Ic1SDSqyXjw_L3svybhHYUGyQuTmUQEDjgjJfBOifwHIsDsRPeBz1NomqeifVPq5GTCWFo5k_MNIQURR2Wj0AHC2k7JZfu2iWjUHLF8ExFZLZ4nlmsvJu_mvifMYiikfNfsZAudISOa6O73yPZtL04k_1FI7WDfrb2w7OqKLWDXzlpcxohPVOLQwpA3mFNRKdY-bQz4Z4KX9lfz1cne31N4-8BKmojpw-OdQjKdLOGkC445Fb_K1tlDQXw2sBF',
        tag: 'e2m0Vm7JvjK2VpCKXS-kyg',
      },
      json_flat: {
        unprotected: {
          alg: 'A128KW',
          kid: '81b20965-8332-43d9-a468-82160ad91ac8',
          enc: 'A128GCM',
        },
        encrypted_key: '244YHfO_W7RMpQW81UjQrZcq5LSyqiPv',
        iv: 'YihBoVOGsR1l7jCD',
        ciphertext:
          'qtPIMMaOBRgASL10dNQhOa7Gqrk7Eal1vwht7R4TT1uq-arsVCPaIeFwQfzrSS6oEUWbBtxEasE0vC6r7sphyVziMCVJEuRJyoAHFSP3eqQPb4Ic1SDSqyXjw_L3svybhHYUGyQuTmUQEDjgjJfBOifwHIsDsRPeBz1NomqeifVPq5GTCWFo5k_MNIQURR2Wj0AHC2k7JZfu2iWjUHLF8ExFZLZ4nlmsvJu_mvifMYiikfNfsZAudISOa6O73yPZtL04k_1FI7WDfrb2w7OqKLWDXzlpcxohPVOLQwpA3mFNRKdY-bQz4Z4KX9lfz1cne31N4-8BKmojpw-OdQjKdLOGkC445Fb_K1tlDQXw2sBF',
        tag: 'e2m0Vm7JvjK2VpCKXS-kyg',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-pq-pqt#appendix-A - HPKE-9 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'AKP',
        alg: 'HPKE-9',
        kid: 'BeWp7Y5tolX2sSYMKIaG6WUVE-arTKcS2Ok8EgqFqrE',
        pub: 'ZEbKruTLTRJZf-UygOWQwuBNzChq8yuhGTVITLeU7emGD9tF9oFEy1BP9hmBRWo84Zyjr8xlvkadCNyu5iOfuoIC7pA5JCc3A7BNp2ZK8TnNPTsYJ9BTicjChlIMMYKVSnk9WjCj3EqM90RaRiSHYxMUJ0VV8fY_06BqrODCwNO_6BYGaaxHszSAVparmkEiSQOZwyB6xsc0dsU2MGVGANQDBCu3NSs2gZmN1fslWpxzqyN4YtZhwkozcmsGztObngYHXEtgqpo44mKqXHfMBIxjvsqgZ-vNzGyp04OErotG5QOeu5gQZquZ4TlS7JqxjjN0ktJ9Wqofvlq1i0JG97VL7aJ0IHJpnFl8-4cbqwq7-Wan_9U0fJux18PBDBq3jkQiwLiXZOk9Klgin6BGwpx-JPedIOOEEEnKLpQwg3lOZGuHfXGCT5BkGfk4sVVR3dg7uMvC4yFS5ftvggIWfMPI4LV-3DECG-pDe1vEpQFE5EwSBHUhpyjAWuMEHbpTKau5oGmVAIYXRKZfZ3CIFQV3gHoBZdZQoRhEXzKmdkPB2jJI16FnFGUK_GSZYsXK68IUk_lEnihTadnBEhM78-wh9ZtAXQsKgQtUdWR7nFt6yWAkSQIegmJzzkEw4_FBrNYUIXC930h1dYi1sZw5ZHo3dmY3Viq4pLiiixN9LrdzV6RGIwR8fmpqbqNAc_cVsFePATiHnwBQ5kej1BLMAkUfYhJpX1lV-9tloZLA6JdkRoAeXnEvIxyY1TUYpugYuZUeERwlWygVnOidsIi_Apo1KAUm-TocR6m0zGtG2YQ07mUeI2yqbctcg6EvYVVBLDu_RJeLFyAw-Xd_WXgWNoIzoOM5CXLOtDCcJwMoLJknW1dgNxdFZHG1mQg9T5wBMbEBpjK8a9oOnfxVblik3eUHYkS7TVhKSqCOuyOBzDQuVtHAt9Q6OCoOguqUmJeBV4GSd5IPSnpCendqBjEKZ2JTkNwFkuqqbmilEnYMHEOtMUyveWZi6_qm2kPG7aVcjFV9U4pXZEuRIJcugvJUH3qw9UQ7smgqsaJMFzrDVsAGQWItDJxcEOgBdBTAiit99igYmAeEyNoK-GQ46OYsNzq5-CuCiCGJZKNObWhddnROkmY6jFG7K_k_RgvAj_aW0oPIEzGz0jBtZqVDMTFHF6d4q9erpHOaO8h9e7k2nnrGyHgkJYOPQImVrLNc93OEJ1qLzUSwJaho8KqwNlOHqDuJgmKoSfEhqXQRfIh68qNqZ6SC9JYJ_-lwpKk_TQUYxJUdRkHB9fgkBwyoGsi0nLpOhMinsIc32CMyHMqvBsc9DlSgmZOBgiovynEtj_gqdVZ3ZYwDAaSaXTG7wLMyNwBfVycm5TdMQeZs8dwu6pifo_UYzBhj1EY8u3IdS3OVajDKZqkw9zeTacE2kwVsCkDOK_y-wQXEvyFCbAYW3IANbpAuIwpirGJfFTWHIFEm1CqL4FXPt8a9DusGHQCuq3bEkCtpnRiOTGOqgVSZSWkuoxbGnluihrRc5NYY87PCvMSRVxthHPS6-Af2yP_HWMkcfu3DwNyCFxBJgfvtXGLFSm8Zq6EG4zipdIVLeDl-Mg6s_8jDce27ki2xqXVQWA',
        priv: 'tQDSUt-Mgd0LNFiUK9VEluJnrtg057pCq97A54EdbiM',
      },
      alg: 'HPKE-9',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-9',
        kid: 'BeWp7Y5tolX2sSYMKIaG6WUVE-arTKcS2Ok8EgqFqrE',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTkiLCJraWQiOiJCZVdwN1k1dG9sWDJzU1lNS0lhRzZXVVZFLWFyVEtjUzJPazhFZ3FGcXJFIn0.ZMY3Ynj6V0Tflad99MujhmvSUTEYP-PETVMxSGfdKWjz1n2dvNmUCMfDS-pAzsh3lny2RyTHLFsUoX_Hl_hG4QYd1nZm4X9bgWpPx8e5Mhbx9T8hGRbf8S1q3mkyLyIQNBtPW2KJMAzy6d5MQiJy98V4cL_-GFFUde8gvY1pIqfXSLC_BBmvnA2DddcGPvi3eKco8PDY2HVNMQlCusFnnYVcRXiRc3tLJ2sAYIdavSJDqUV8QxiOqR6J0g_G0ngqPoP__bwNbF_UDU4_9flpBy8pQS2P9nBJLdYBi5o_zwdUXTKCSgzUEvxrmr1YrGE7oPczjviXzBK-fbMWS7ShXFQ-ILzAccf2yb7hef76AduEi9mnS4D6SEsPTEpFUNIrljED4J2QNuYOMlYCTb6Gen2h63FHZmTVMyXqhnKQUjelpg_qoD0L3ASUxRUC10YR8zidpA4MKIRGXwfN1eeqQc_M4hyurMXLBOSjrZqCsKtk0KlgtFx7AmgZHULmYUcKZupfjCjPpMOAn3zmO_MF3NrsKtYofQyF3USoVfItSsu-KXDTU_b55EFZfD7ur_4X_Wg_7h0GX_2SNzsRCyqNhmucBPej7Sm6spDjPfYXuyFgqrEOVVQU6wMcONJLxTktTxciYcXI6gaCOgXgr7zWAQmP2E9UqiAq80yaaM5-WMwUUB1_VlruaqHy7s1cNBq3U0hC3a0C8_QVgxTYYIZa-IEsHjx2DoLAOgiDrfQYQPer1YVXg6A-q1lPPO-jcahyfUXvPDsNfYJTRe1HvUXEW_IOZOJhodTyreSPLjvRXhw7MQ4ghScbKusuPOwP3GXB1mcRiG1V1dQumJ5PPD0-b4dO_9ygcZf46A1excJrE5HeJ0SY6Ukue9uib4VEXeQi8HbS8hycC38qejW04FIZLukqhSXHST-pCoD1ztFd235WCIFQCsqOUOR6ZxHyO_MnlujxuYGoU_J7QBuuXRZMWVLo6rwKrUqOkJVqy9UpYFwTOOG1g795uCkprW78W-kTRfiWkVjPReO8skg3u_FpvUXdSIbJ-M40xUq19DsRN_RlFaMXX8b3m5NjDcBPJpPrVlN910izuecSJOalsPsrp0NWSXkQI42FFK9Wy0xIC7Fm8AZM-_5FnUkGyuqWSNLCkWPjWWdK9NAnIkkHArv7BHvpQSm-FCeTgFCQIvVSlsjXU2-Nu55w-D0ToW6MPIVQHWtQKgUwJw97eQQ4Ni0Mgl61IeejrCaJBTfxJzsM6X7evU-9IY61WJJAFI5BcmUlcpaHm0aLRuLMGLLmrKsvOfEj48AqTHdI13jL4KVME-bRYz87twX7GXpGmNLa0X3PGLusZ9gH91xZhKu8rK29oSAJM3T4XRP5qO4_8ETE9qZ6-QAa-b5dmXgkcswHwbS09WzBAx1ePVVU_q-a8U-6HFaGswk9bheV0aoYSPXK_J4PKVM-R7YbxTO1NiOviY3E0XGJJHMp8M4ONbAYO6laXw..W8wioV5NhSNz-rqzlPSWOPkjX-bVNx_vCiw9rguyL4dgG-rOVJqyBOvnukWT9V1v_ZmtXYdi_oAhOmCSaF5_D1DYNWbpajOSX8m-j3nCjRaJdAf5N1r4XOw00o2BTdU9b1j6ZeJNB4I_71HFoGTVCY11NJbbgQBzoxWpMDQkn8cCk9QkCOqukakoK7qRB_e2dJnujcGMTIr3s5n0gTZMkEaEAWdP3TNoQf-0YmCQS-4i-6qo0nkcUUYCH64vASVh5zrPNgCODOoFd2HF65gGKEJrCEcVefLkYVCM3Zk2PPvOaUSI9eJqbKB9y9ieGxFcgnlLcw8bY-4l6fKjg8mI1H2ZNVRXsRmO0ycR6_7zzBfHUNklpp1LiQ9wGiCTh3VOGA.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTkiLCJraWQiOiJCZVdwN1k1dG9sWDJzU1lNS0lhRzZXVVZFLWFyVEtjUzJPazhFZ3FGcXJFIn0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'FNPUnD-x_KD2ZlRpfS1i5otH3zXS0p5YqAX1IQXDg7KkVDfPrigLJiUX2olBxmMcer7yXyH1L1VMt3AnbWWHAH68JXG4maBWMtpy-ahh6X7k16JrzCzzQCuRWS2qDMNw_jjb7L_LiR6N9VigfKC63i8D5fL9P3y84jab77h5BFeH_px4XNXdj4IZpoQbrF496F3TMCpj0F7VIOPOH9Vjt6gH4sOAvkeuX5riGG9F0dhN67GmRHAeCZyW8ywvfzjADZnRG0_SX-bfcmICTJziIVy4KaEMH0YvmIrYmQe9jI-XKCIoeSQpXbvXQtniw6vWhPV5pDldRF89fshN1VIhTT2zsP9of5loHM9DJp7ac8SvhRIPm2GHocU9JtRN0MIkeUEqLMnJlp1dBJl3D3qwcOTvAO0A3ZA876Xu8Gsgcn5VsJj-O1AN2eB08BR3NNGDuuUsgxPVXQWyAFSQ_UlG7IVRp_8__NxfW4cbpCjcE9hvvlQD-xFS0a6rQOKImWKzwKmY8GiU2SUEAwN6rSPHr8JyGfh0YrA0--FgPuab6PPGrZ1qz427SQIxlJBCipWPLlhJzvbWUGCw0g8Tk2DQGnCBMZNc4lBNVhnKedQ57g6erNBh0MOZSXj-SLul57DSBXguw9jMUtsJZoF8PjIc-eSrQrZude3S9illlCRM1dfSaxPk825PQjBFlMnEb9qe-Uc65ALr093ikk5eYF1mUJ31EAJYBVl4gU6RmD7Dp0Iu1X1zwxB7JZYZCqUOmhyB1lf8oA994ChY_VkprCF_A0NcLpee8iW7d077OVODp14M4w7D6hPLJDa4T0GDjMH-o21b2n6YqoxbUuPPGAPCypb7e9zGliZWkpIyBXzvw8pwQ708iFc4AMZswlS8cYiS-6n3VrGosvT5UplUHdpPONfN_UYHOFwIWwErmxABUZbKNHWM0t1opDlysAIXm5lSOf7NFAVA05UQGofBty1N1rnSey6ElXk9lf3gdxKDfkgZVqKlTiuh54bm9L3Kgu6ZLKqTyxOWYiYW2T2G79tXyLAQDrl6FxRwlGpUWGhqsmN_MSImcSR3R7Y7uwsQshS6hg7zXJo4IQ3ok7-RvP1-bn9d9goAHPSYASnrWAG8IsIFRK2yJyAEIiUNL_tFQ3TulU3uEgJIECrqKn6jFcLQ_er4AnCEJy3Old1rXxZsMSLhHuucqhkByUT2iP5jsupSeTaCgRUKUMQwJ9iUeLAp4aAIZAertDuVVZli5fRrFByO6h7wZ6ewNkNen3vwFgDU3V1_xXIZCo_GFghO-oGMysxETIB-IvqRH0qLWNn0z771zagoT4Ri2HmQNRcKmA9uBpSpJ2nYIkMJ98CYm5kHvlgZgZp_YEffITAXZ9drxobjxrm4o73l9nhtDdPpY3D1ztv3l3kFX0K2OdpG5whWZ4kuEYmPuugT49EVQXS4Xdpo_aS6RNKwc7ffpbhl-ztL-H54o9-NIoveutL8V957RA',
        ciphertext:
          'V4iZyqGIdT83y_Eb6dE2c5l0-LMzKAXVnJwmXt9337d9haaaHlGYFUKvF3zvTZGBJ2PXLQEFWmqZ59lseWeSGA1TklJIWjQbb-1oCdE8607piGyFiGyjlsd5CEzfJuVZXmYQz3J4g6NIHlMGIoKTx6aa_A-qYkszxoKdlvnmwHLhm95vr9k9GNxWIblWK-rJkntpPTWecV7Y1nI2yb3nzJUBDfqDzfKb9YW2x--8KFs8n4RcSZr3d07RCB7QyxQKl9AFd5n5thTO4_UcRChvfc1aawFV4lnTHCGLRAwPo9P0JMNf3v51mfSstGwvRotRG2t9S3IWG4C_94VOeEVZPlclmt5uYJXPvQ4Fip4RHtwG1mRFRtTTzTblfqELzPe0VA',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-pq-pqt#appendix-A - HPKE-12 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'AKP',
        alg: 'HPKE-12',
        kid: 'jw8GWrYDUzjH0aZRXlCtcokQwI4elPLJKKulziQwsB4',
        pub: '2dmLwuO_9-eptid4KThePBhKHFBdOwVPc8lNjbeSGLOmFdmzR3yD_-ZucZgrSHqacNVD_oES2ZCS9CEeFQyNgYQxrBRb1gQ8JYC9PmiNFWdbN-eixSaWsYaLTwekCiucwOhsSwSusRgMt0Ii2DyKl6m2J1fDgDCCevVhe8II0Axm2JaJZaNgftU9pLE8QwAKY9tfotx3wzQRXdE61rmcEQOfIQiJr6TG-YSl_cERxbsJFryH1gmugWkjcFOje9NSiZfLa2mi_0s6MHpkAQhxm2EVaCfHM8fMsCpkBqKOgPTKkCGTG0A6RnKgA7SclXi8P8kJupx46Km3ueR6KEGF2RtBt6SmFkceujZ3oWt7Toqtc1SBjFONk0GRuZABZisiUhqXM9I_T7yagLhdQqOvsrIVllCfFOFHiJhPFEPLOAMyQUrCj7d1V8h-crAhypiQYQFFqSq309oeRqYGVHyPLEe5m_lvfxfFMSitRcFrmchO2ORCbZQTm-tioyslu6UNDwYWarR0UmgJIPlfNLJ98XNO5LO3fjiz84hHC0nLnOqmD_O4kWEDXkBCPWs_mzomlZKncZdiQDGXsucMUUhs-ySo_aqslswumfk45GsP_pUj51ROcVqgjzCSydtkaKN2nkolubGv4mvNAacz99oLKLzDbqAIqoRTAbGAJVywNpBuzFw_2gGiqSidtrUmCJcuaihnoAB-dlpCLgcNUTATJ1RtClSbXpGW9XJQ9cQ003UwfVIp8owxEsFqgkHEjRsDjJJ9sikq9AaSzoJ6q-mQSRcycAaM-OdwaohFsrEEtVRZ07C8UahelEMmZ2qtEMEHpkEBiNAQ95l6mBjLFdXGKoOvBIu9oshYa3G_raBO4rg6F4kKkhO0h0u7usKC8mWQedfJ3WtAmpiNwNJxCdRRjtdigjoVbRMkImVvJhaaI2KRQ3AYneWcAbRra3aY3SkKjkMhPZp2NVqyd3XDUNAiFgHDOfvJMFOkz-VgWTlfMze2z8w3wPUtZpjH4bQUtXslmVxUGwi1_Du6qHyin9xPO8Sv6eNKqthW9YwYiBjE79AHNJYx7nQ63IM9G9RtF3GbWQtP9kye16Who5sZi9k-9BhOxwwXLeiqHOwPRFMGyQE5ySd9hOUSaNGajVWZytWOmpt8RSrLnXY4moxAKZEGfhIFYIOVRImjtLGeEBZfRyVSYwfPLJnH5SDBBimoltw1Uhx3HQBOd6FmuGsRViYu_UfKDxKscAgJB0FYS6FyoKxIeknPHpowlJdJdbpMF9QIF2mNynddFEfGJHYldfBxyHQCIJaWxHwFTfYxeiKrtucnrCmm2wBWI3wntUUrC5d1vGmLI_q6Vcd5sXiVm5ZvENddrPeInGaLYUgj6Nl5HiMhXjp7t2lLMRNNtkoomRx0UgwsgQJx6LEC6_s0G6E4nXe52UVdkfsQzKpB7dmaxSkWWGupmgdBcXpyX9yqYDqZiFyu3pbHo7VEAC0Lp1Oya1pCP6kONJZuDGRscQrObIuBmZwzj4B_CwSeu6ZnJ4QYCR374LlG4VHMX9hIw7S-tp1j0QZb3ojmna67QydOt-M',
        priv: 'oNrZa1bdAQtxbp26w5mcZgzw7fKR0WxEbpRhVH5tcPRQxzIk3Iiqt6p9Fn88pjYoaUmmlaNymuTk_ws1WgWd2g',
      },
      alg: 'HPKE-12',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-12',
        kid: 'jw8GWrYDUzjH0aZRXlCtcokQwI4elPLJKKulziQwsB4',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTEyIiwia2lkIjoianc4R1dyWURVempIMGFaUlhsQ3Rjb2tRd0k0ZWxQTEpLS3VsemlRd3NCNCJ9.e69-F0C9xtPkza2EzcpZJD7ogDwzuZmdPqg9L0J5M_vuPm9F-3FFfLPpiqKINn2bozlj80Tfia3tBHpC7PUyVJiXsyh417ZdMgim_DG8Na_wG7A_j-H8vpXrW7EEsW0wqYohkGJwi6eSq0Vbd4tDPeWCL7rRDeMmseRPUkzhmTKmhx9T_jSgI0M4D0UHeXPud1eUAavFZS8xiAdADoiJFxtnS67s8tNobg63099O2ZAciOvfTZucqwSWPwqL8GBh5ieHizVnk8YvPSqByJ-rjdezRU_GghZ6F8Mk2PqzuMARVUR-QknbFqQO9rHYRMxTdEPBmGHfhpRJDgHxADLTgHuNNnrnAzTZgnsQC9lljfnvqcwdDb5SYqcqEz4F3t9m5d_QiiFtrXUdZi6u581uuXLU4vrgiLC3aRvCNrcU-qY7NaBA2vO2nOCsdjRAotWlYbFwYkX5tPXkqzj7_ZXiM0GR55koR_mnTV-_i574qJfry7w8J2yru-0DVCYtSAaXTNEwlwXSsyCQtRN19LrTixKpP0U928m6DMrl6TJ5IJ56sn9BVrQI6Q1aoogWZDfH-KQT1sI6oRisMQNdV14SKawZbMjhbCn1mQFpGH8SCdCofOV1LQhCKHwJ9jYZTKjLPjRX1bPauzHSDhFR70yr2xazK2Hx-tqwwllKyKkBvJIDRmg7r8IyjZ6sAKDR5J2zf6hIVLpEu3_j2XQvo1KX4lxD0f5qXvBLE0R1n57dF45NE1Ij_nvVO-l-rQzE3SAQylQ6bRlRyXRrtGkdw6GLOuPyoQJZgR3PWNdxTSlFSKzAOIzIVlgxo6Fot1EAYJsxttbrZ2sINh6Qkdh5Q-MUUPTdixdiwOLaCJIs9_dsF54uPbUPq3n6aTQve2xJ6Dkj4wC5hOsaOejH705y7TLgiHaIBwOyfJd06LkVf8tgZea6q-3cQ9Jji0qDPr2bq3uXzTubHxn1a-FrsKvKHwW2ljifnyzTYozxDUVDf51euk5Fn-mR-Ns0dalVNwVqlK-YYo3kIbhmLKHvSgXVB76T903qLVRqrQQWHO_w46g_lnT10Ta3SfZw3u_2oBQ_dC--68_b1xDKOqLGvApXFRCl4-u4rOTMuVfZ6RT2_fNR67mOk71vG9fc-ZWn69myX4yfjco1ZcbsW0qb9otY1auNDefmoXGK-j7oFknOpyjEQ5qXy5B17l5pYS_nqHKkgUznQm5UMUWydtF8W-Pb1rvfdHGSavTkdaZKUd4Uyq70ylIzFFx1cK7Bi4KjJH7Q8Uhzpt4miATD6hEe-kc8iybdoSMJqe_QhIKJtngRrjkuDYNEGwcb-rZkn3KLh0juFkoOlmbTPcHcLBKv_a4-PcB2CUAp8pJTf-uiJg6eZzsgyIvY_JQKgCnGfDqk9QXO2NlFyG_R6y9kaVw65YXAJSSni7bMBQbymhExMgfBDqs9xTQ..OVegzSMbIG9TxaH4xHXD_8GemaeruyQ-pPV5jvUHwkUmcgV04TQkJ33oooQJApX4rh1B89AR8Vd3Fqtlb8gMfunbnSHE-iejZNRc9qVXzfyueskK8zMKFEydGRUI63BFZJLRXZIuZv_dmYqwc9nbJJOpqo9mU5jkdyHVK3Hbbs4qzA7jbqx0wXFaifakYMprOptUKrTXtTBUAVvxyf6JldJLmKR6FjrElMxA0BPWKuPduhkz9JhOkwurJ_LfZqx4c5tsjYYXbFTAM9PkGkkMPQuON3OP_WutBZEItOb5xtF2s6o6bwZ9URknWRL22oI0n8I6QlrjWNab_f8GIuBlxFiFuUQH2NfzWFE_eiwjUHzCg9q5kz4MuDWizCy3NE-UCw.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTEyIiwia2lkIjoianc4R1dyWURVempIMGFaUlhsQ3Rjb2tRd0k0ZWxQTEpLS3VsemlRd3NCNCJ9',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'sq1TmK2Oa6_P7yp6eYYDAzYv1biKXQ9fO2zORNkdFAFOnTZTKN4MvaESlHx-Bx75d9enCHMhkYtrGgvfpjTCH-XmrRp-UexBp2mKVo1C3LFOBZInoESOf33-1BhbM2X3M2j-mhm7i4VGIO60UrHeSaZgH2mAqSZgkHHP6y5WiPutwnAAdP_SlpswWEZDPvwzvCNI-pvSaqW1rzUe8iDGHycTkpv6V1mKUaXIhaETVmNQFRXZIvkQDf6cVatOtkiBCsHLFUNpaSUjXJdwJBdDsqjbfa_TFJaqgy3vtOiRYOBtKDlaUWcI1osJXSCpkOfXB8halKlq42khbFf7nbDon4H0EJSGoKHvUw0LG8zVlPzw8_DYs9XiYTpWAYeAX-mkJmX1FH8H8IgYR6APRsAzwagCGIUlCIbY6TKSRAENxAS1fy19XVpne8ouZQ8lWVKIm9bqgRcin7T5lYQiG3lkGdqlN54LndxCWQWfC6fX66UDH1rGtF09PC7i30NcyuteFBaVXPoSluaKYKOwFiQIxtL9MEVGEWazgJEdxvgoiZnCQCF5RqinqYbFrKtgej-4Adck_uz6H4G2l35EGc8BfUhYOc_ddqs2nJcF6JPjj29ASvYZl4MjWpR11YEQPEXlSIK9aLIXgujxai7FJL_nhqSFm5AiAp3Bdszp_146vMoPaV3P7d1C_WgLS8i5i_2qmzXn5KorN00g6Cd36VdRGQHftpr1X6vvQit7eLKf4jqQ2DITcXGJPqi4oZn0FHlQoTfBegmDnosVyaoYyrSPglCMBM7XtvjefhVTSsz7oQHclYUtfGnCsPUh06nVJ51PdZA2SX20md97TH6RPq4dnn2GIebn3Hzc1JjuDkrkfRf_2NNdTHyv03IXGXjygigb6w2BRDYu_oPSLyDJ9MBvJAJv_f9JFOlqEiYD9LFwR_3rEJAvQkEL6xA9DOF_3urdOrYwMAZ-Up1AqBxUzMJ8WVkbElwQKMe7o4gZ_AHV27NSWf78kjGVNsCQoNMSGtrvx3eojYcfK3mFJUUBjnognrn23Dq5_mR2s64XdLcL5nJY0D5pulB90x094S04rb_6wO9OpfmdRlRbuh0O5LpNlmLYPpa_BZtwNwtmCNKsxRW-BrpOy_kfOxpl2UaewqWjEIBvoIKqThfkqx9GiMEhCQTUKZR8cejvbWRWtVgJxJLTA0IW3QyMU8_Gi9MXMG7NOrE0OspkRe_gAexc8sGO9O58qYbfSuqlTR7GHkLaUczi7yejtYYGzjastPKFMYHOHsBYau2FgF6eNrFWVeE-bkNWrgs4sZycpIJEYktDvvODRZHG-7TpFbLRyAOCcqBoQXnWcCMzjMmmecRi7yZepjAaslZuF7hGRGCMivDUVNQIEytC-nigKVoi6Ya0pZ3yC4aVBFPPitRFKK15ktdh8T-g8Lk04_faM3LoZMCnLgU',
        ciphertext:
          'opqe-7Y8RSKoR6OAbqm0n0GuRQa0oLttHqH6RXRDR2dqgnn1P9a5tpqnUAalwkyT9UUkvi5CPpZkFk-2rw9THiUMRNhP9TWcqmLF4iC9pzFJZWflW0AsjTDU9SKe8JFFUgcLejw2v_pyRDcPB2zvMQxxlLfsXXggtntqT4DCPBI3rBMfTt_V6RDEWKLFSseOF54zdIw6z-aBnhEOB5OW4seXHvCSVmdrH5B_vimGVciBZW86e2xwix0PAIqg0CnFHMqarOLADeWfj2bBwUI1FtXi0YxwXOQEy-5hRch76wuQ01gQWUdqLd-PPxfUWkGJukZ4XWifc0p6ho0SSLgkFERvpugQTqyi7G8fHlQMSjSIkRcVFXyDBwXQUG7BhMTnrA',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-pq-pqt#appendix-A - HPKE-13 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin–to the bitter end. And you can trust us to keep any secret of yours–closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'AKP',
        alg: 'HPKE-13',
        kid: 'wIKmf5ISyZZlOkqqjwW707KCxkqEc4cJg7fYFLBkr5o',
        pub: '59oD4empWTtMhOR7pGVyBEKEb5lttgUhITCq85eyJGpyZXa56wd-HfoHj9MxM4pg4Se_iwmjBEZZv5UHbYpoUGKW-QFh5CGjCCuvtjIAofAShNEaBpQ2dBGnkXeBGZhx_EPA3Fxv33tY9WAoUNVhEEa1sRuAwLI5dFe8ZRLDDCUoz9h1Axpa2pxP1Plmj6gRtDayfAU9mvWZhhpwZ3ydbnIEjPFLgwwPYGUCYtNj87i4K4aHa2QcWlyJlSOO0umCHFJbsEsNL0VNaQsieSWP_2FB90mYBuQsY5UCN1g8p-DFicWAAEtUE0uukYe9X5u3z6y7A6Bb9HyAFhKH4TelarS7xSfBK6xxK6MpbGzP5YSBoZF8MBBeMNbLwNSJ9dlMKYZmPIO7Z_Y4bjlnUzCsK-aC_sERbElaSzFiLImIwQp1IMxuC-igzqljtxepYXCinRi8yhyiHNMuAlDJAcLL11uW7faXb2J3OdrFLrdKjwNYrOdMw8uZaexXkWdCUlKV8CdJrBKKx3a6oJApUhM3lAolyquTeXeGx1AryyhGualBEPrFI3ROcgRHWIFaCYFF7YZjkVB7CYKOVOpXWOdnHCSNOPMWWtGvVERXRbe0K6eeX0iXB_YxddByq3IwCIczXwYA1luZjKjMXORjv_qVTzI7HPBFeVGdXIc5TxTARJR15lEEoLRIOPuzcek2q-KlyyIzSqZqrHeereRhJHBPliMsJYGOAsR_NSLLxwDHWggO5mqxnxoNyVMXYPgxerB763eZZtwjBuobvGpwtNwgjlqmZLfLP1wqdcpINlheQZcQsjIO3YdWIQu01VsvmgPAlkSAYnqkhmJbnDk3RcqGdHZzFekkcas2_sSrBsEdqhsQXBWoYkOqrbLP5MqaIaKjQuOwutCgsUOoLImGwcwpNYW-gJyj4dckDfhrqcN2zreQW-gqmMgnXUZa5iEx8-xa5sRQmVmKEwls3_GpMrtUV2yG2elPFtTAlHxZsgUjm-ExxgxmmyagstzJFFCrmJAqNCKnU9Ee2paKzQBw7qihMvNBNCQ5vtmQq-BWwDQDeMwRaiJYJVqGnNPOUKoT23hTU3rPosAGctpODVOyFPLHY7ZoQlqKkwZ7F_dbSWLJROyFVrahcPMtt4AfyiozSqlJAgpfS-mBxieo4WHD_7GxHeSzW9Wk-pmmlDiytqaw9lyCDDZnLxUT2qF55SQuvPYr-JFgyVma4LsB2kARISdQ02eQwZvBlYTHK4EN9fhFMvS2MZYfbOKJocaKOap-djcCMWp8yoyUP9OKuaabs9o51bqKCgcoRqFjqWQZCWXBgbDOyBAhAwlJRyciojeH6NtUBDxSM0t_I1q8lQli9nNGKHklGEd86spm1nRMTARzy-qmGTlUb8g9HUvF3ly516YoKeVBcuUppUp0v4u2Tme_llhNa5EF-6IHybjP_VUBg4NOGmGE59kKXURxiAUz8vidSWLO9RkG1IQoNtJ9r3Uyx-woFTUp3IC_eHCfA4Gb5FlIqDUcCRZIkHgOodAofbtWyQRZkAFs_8iQS1UGT-O25ajAD2jMnAgXbWOqdrIvRaMkOnl0QOOZwKkMfok53vOqRJumO8dGIuCK5IUARRdJspF8dkMsrky2M5BA_QqfGIZ7vYfG_LcifNpQAxCj73qrNZZCEgWH3KVq0QaaR3QIMXGS-Ag7LMYC3lNPB8VOUvgC6wEZIdmct4NR48IPNDjOEihG8qzFgtkZ8rdJ51UA3lFFMZhRsucj-GGkhChGRkib4rxL-Rkoi5VbdwxZkOYIMDhTXYN3pUOG-2p0Z4y4_TezT3BvbtmzEDOiSUiSOvMVSphsEeAkv4woy8he85DPxxMwsACgpelKX-hjqYMaott-8WChtrrENzPHlxd6H7ipoyo9nACk8Mke51QCBxM1Y2dL-fLEKjMDblS59wsk1yHI_BF6u6kdDAhvfyNQ_4g-uFxqSkgbC1FYs7jNguciJEUFSfNta4ZDUcyWrrmHmymm7dwGzHBWoaBc_cI7ghNGM2yGhWu3XSdLp1aLnaCiRXeYb5UNiRXUL6CNAqp0K6GVHkxowUsEBIV9qA-BiLg',
        priv: 'JKfunEpR_O-GX8PenAcjHl37FB3kSP3X6v8Bg8HIcIR1snymjQjiWomcAq17HbYyeeOm2yIEgzjuncXDElfXbA',
      },
      alg: 'HPKE-13',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-13',
        kid: 'wIKmf5ISyZZlOkqqjwW707KCxkqEc4cJg7fYFLBkr5o',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTEzIiwia2lkIjoid0lLbWY1SVN5WlpsT2txcWp3VzcwN0tDeGtxRWM0Y0pnN2ZZRkxCa3I1byJ9.VoqDQcN9sElKe9DRwlCgccR1tOK3VhqjsjXxdN3ypaKYrIlkFRuBGk9b2581ucMkchAI2x3K8DUlqJ3ORu-SU0Ebgscz5IeP6lwmxtvl6-12Q7n2Tt5h4pnQrZemixE71b0TCC2c3vALCKt5ivRUB9jfbRC3-dheXYZjt_KZW2uqhljbLJxraITtrBfFtw7vbOGvV7n_cLBaYrTNjcU8QnsGWQX1FRi0yL0CpJvA6Vzy6VrBRGiR4z9t7rRCcIZPwBAhQFYDUiFsmhHwHDo3FN_epfFRHPClgREtA67CY5kBO8aKkPrvRijTRKqHQM0FVZCb16DaUuhRvqUXYUe5xNcsOsjpjRTtZWNNAmVy7gHqDIr2DDZw6SDzhN5_z8XV_DzfD0ziUEKkYzyQI7R3GiiJ85Bl4vPIeSR0cgxquN5ZWWofWsQO0OPgZPEfLO5kZ5VUgsMIReanC_b0gezZsPCoTrijKE6pS1lFqtgxujsc1LHFApuHip4WMrxYj7vIoyO1OZpkcGuz-5rv4KqVxDhM5-2Kb6qcAFLKpb2sAerp0Pewdyatj4LwtKmoC360BqEhkn21NyCsfl1cqpFu2DmZ72S-DKgYoq68wCD-mOndFc4hgxVyADLuOMwFsbwTbDJ5GlKuPTUfblWwNn6pIwbzMC-clxhglUkIG5VbkQ5kVxPhVNlwZCrlsUMUbTrblXNzPqCrxB0bpeI2w_1dng-812-wh4ncv5Ky61MShFkQ5uOz3qTJ4zkOx7pZQS42-_nMicMPV0lwAWi_IBjBsvcocwstcuXxbD_yL8-Tzf357Chtms-XMe1JuNGVH4AhDdDOV57o7noByIbRX9ner2PSyd3TYCfeS4TocF2zmZX_bO0A-sAqyPI5ObqiDK5gkY3vccuzCP6rohuRluaBlTw1RcXXHQPtf8XJJ0u4yAornBt334E20TLAgepXgtDgwBx6bgD7x9E5hNdRVdpLj_EaAnJJ2lLEqY-0mFEnDJdRK1yC7XzvWE3ohNOQBE8jiUSUEy6b15l0El_BagVCNXHK9QAwhVjeUhy9W5u31kzw7-OHp4JR00icG8APd5uLfZqdmXntFea5ow3NDurTtH8HBo7foX4TlX9zmsgramo5ZLjz3hRvovQWLSNSQG5ZqpT8xqfC8_RKvq-Ak5TMnLQd2zhXBZlM9ESJqfSeUm59FbKjPdx18sj7S9Etxqqb-RgoREMKJamJ-dqx7fHgiNNR0tlJk9XQKUN-jgSRxrnZvCN_WljUdoiBnlrJpXIx4g7oRXm05WfgDrmV6-fYE-8ddCnA3RgG_Hxh1WaQ-thyS8ZIWIo3ETVTZydrMorERQ_ExGuckbvsBRQm40iFshOtTyOKq3MXGjWxQIuje7HuBnioJxNfHV_CLP2hNdMJRXRDe-gy15K6L5mWGe1jGt3q68FqgKOC9abNy9AKjZFcp3p3gj3QNNfuca8Eepf0DVCWsD6n7b54mRmsHDQ2BX_kouMJXU8TD0N8wBaAIbM1zsW6N_j0ZyPU2m_OO7KZ60Ak0NXKMDt4sk8c0qVXPc5yM_DeDF_6jXBU9PqaNyq9eqCX4WYblv5HfoRLoWlhYqGuMUyj-3jVW6_mOXEtrLgbESadyvV21l1qy3B4PwQWj56Ee1QpJf3e2-jmkh5BXxocGtIi0YhIlaz4q5ZFD0HkkYTQ3FQP9W5G8COK66JlP93l1S-5d5ikg-ZhUyvM7cN6WpgBUeOm458oaaeJtRG6YeaBr7l_qNpmqS6BXU197KR50hmVwnCV_v2JEsKOqflKkafhn3vibE--ItHXUiXu-axlVAodXBKcOF_pYTHZe_26Q1CECQxHtg8MZG5NMcZ_ZNUohizSvNj_x5wtAR4gaiP-eiU5vNMK8p0ch_NQ4BNw5iNIdRaJnLsQ7zsRgiCQvK0F_Zk9OXKKJdAtbKrmw2PALBijJE2IdIAgJyafqu9U4jFCL25aNXmV_SgHkFhDYB6Y8e7lPcWMOzbfmAMwAqETBqgifVHYdtRRroREhIWZRdfFk1BLSboPBi32JYjUwBa8oGoMPaWKgqRlIuoYRFy06Kgxq2pqiLYMZdU..yvdUQEJ6vubOBf7_3ZTn-_jn-11RxwmNp3mGRlolntghI5Sh1EJjnhRBsOKhP5AoRdCesJhI--Cpj16sCWdF6_wBTFl9HLRJ5OrIK7u7ew63eGBF6e3RMvYya15pffCgL0LNDMr4wRJW85_ys-k-xSgCI75IiEMdUd1VubrN-xmbGvoSoENhHdmHvdV-Geq4leqPnlx_9yPe4tOZM-QR8zRFrJPXhXDY-pPHVk0ZUk38J7UZ_1WSsyGEL3Y8lsFM9RyjByMRG5NOBPy5-yfecIHidLgoUH57JqSQRMu1Us_cyvriYFMg9L6gAVpScrJsLrvlyLcqEGt4GQhPuYJ-1ObQRA1sZO7kDZSL-jOtaYVtkx9WXGyM0Qp5JprkIY_hhw.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTEzIiwia2lkIjoid0lLbWY1SVN5WlpsT2txcWp3VzcwN0tDeGtxRWM0Y0pnN2ZZRkxCa3I1byJ9',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'A7QASMGmBzxW6c03sNy4wWpCV2IpNMWZpGMzU6potmBO-VehOaVw8vteHXEL_ARRxHUswAAQKBND01MeyByhBUjQ6Z_3IqDseFE54QQiPGdI44Cz-XDpbux06YP1z6cyGDxcX25UOU-CID_g8wG_TIhmOIEx4PUSuCz_ZVZniLKDlIDbWF_v6NR-BhYC6y__2mxfejVIk-ONgGPOKzY2CnmLRzb4f2lWLzD3tcAXDeGCYnomeVS_bea2cygy2lsuGnfAvqfGztHiY6dbIuePMLEFuPYbIk6jlbMewAmfqH9hqxdmDJNLesqlQIwCyrYJAEfPOjsXgWeUhnkWrMN8r0IoCCPtpzvIehuYYCkjVQS8GDAfwg5CKxRRZ7Ji1B-SDAZ4_rTwgua_cxWLMeXFokqw2MS3x6Ssl-Hw9Ielaqnt1crd6gYHBnaPL57txOyX5J5pRBhENsfQq9YTUWAnzQvOaGyo9KHg04I-RI--hjQFGvtdQEg9UrwEEsVYAk-AUU-lqAGw5b6yVqvbZKkhnxHAsOYpmXrmAd_6ABT1Imovxggj09foCoS8d2foO8ddQh7Vu0w0unJNY22bR6o29L5Ac1tNq4Co0TMztnmOUnR9o_Tlp_7Zox87UwClvJj8PO-b81yBaZduQ311WK50d0fwH2PruOTvWiPS1UFs3EmhplkSchKAbkCHSASvcBlbE-dzvF-FoKBDpocQc10C7h7ap2fl3-2amAlcGqIvb8LuzCM8vxqCRxewZtgbfKPPTQvEzYPx4Ub-Unh72MnHjH-oPylXY5p2cCdqi6xhJwEE-dqXtzn0z50JsisNuNvIM-nmALE8JFknNWqTCMskSTt98b9OktDA0QMNuNdZkAiOgLYf6UFGWrt0RJyKRVLlKB4myD-YbKLw9nbtk0a4I6Dk2rSSpGJ_KZEbq9G-OQFIcved1l8FRGCM8hA888k25jxRxrfSjndnSs_o3nhDdaZBQOBqzm1mYQm4Vc5eq6bo5F9JbdvdXVwWS2sZsz-ef4qOoY0HS0FsgwmE4vnMLcsQCQuBgRONd6PL185D-PryaVCig98n0r9MPSKSQrvtam6vVqbrKdubBniUkMndhnGg1cPoU8ndo4yS9gwqvtqeWhVNeOCu-cHtvgHO1F0-5-CHt4y3wK5RyhCZTt1JirBZivjDzZNM23c51qNmLjUWlGzeupK5HJMe3qScz1KRxVxJXleDL2XF8X8_5PZm7Xc-1eE50AaP-4PgCGDvSzEdxkle6Epb5LwzGPD8w8frzil7xZr5cd7rQg8_Il-MZUupS_YM4CTBL6SgIlsa5DeMoKTbHn1EXI-e32RammLK79-8exaeaCBFscqqnWXbH4ZW_mGHsgmYPy86U6RXARFgNtsOe7atKQNRk_Xsy7-EGV1kfEckX4VlhbyGl5l5Wd5PhMAFlUiMvJ37uBFAVEPyzptrIxzQk4dMJdkeHKjDFScThbWOxwJlf3es9BiG_jr3cV1jeIpqdF78ZmG0nfGbbPidzweVR9QlCvjYgFU9ZhakNLDoErV_euHoEOdWSuvV0u890cth5InzQzqxtEQb7hrHrgrCUQpclMRw0LoHQligiZnl1quJaWBljyBVxjLHAVkwNwmzmOgcnzrgNJw2iKmbJ0V819rmHaoXl5Qf5HMReaBLds3qIFjkVapofh2UMgJbsPdGRshFnpZLQZZ-tN9SKVQhZSqeIW7n3bjphf1spLCc78FycqyqRr--ZZBcZ01S06Jo_hfbHLUomm0v35JVc2K81LZNHq62gDJYJhH0cww4oE8_M0wKkjn_TQ1JZFxGWkAqnG_MVLxhrIyYosG3ufWoC-lVu9Qj8L6C21flexkjs54kz197UoDqEOgUIBA6dY0f_hy-QZjtJie0zNWZc-uEoia4UKYJOwpnLE4grZdN3rA6SkeaY_l8zewMuMgO6pNlQiyZyFDmyywzfEB3eEMc6KcimnMSuZGG-J_UmEnysYAve5AbnpgdSuqRQj8kzb2yfNUwV6fcl7v_njYR9uh0m4Nqc7PB8OgYS8rNv9guGy30cjj-UtrhqksXCyr2rweMW6md7rLgbY8',
        ciphertext:
          '09RTEoHUgifJuBgWnroH3CcK_8dPA10jT6NxNV9hN8TDF0007BvHRzKCj0uKVqXka9e_4dN36g9mrdDTvaIkZKaWdFbLTz2xNjdYgEAM1FsJ-XBx3KfEl1mvm4vSjOG6MIKtGTWIqpx_tGFSMSqbO7H7ctVJW7b70p_NPvMKM759vzodxbUjlNc8AtM6YM8H4MNTI32z8uKzdxESNksyMiLEYGn2fftQaq5O9gqrUe9ojW4Q22kmTu52rhIQ5TIOcLKX4QQuv7c0PZbEr0lPGbyb2N0iuALwOVy8xeIl4b_vRRQYJf9MGSEgVOjcDF9Pfjh8BEfv_1GpDQyM3HLNWDQgJY19CmibuAL9F-Dz_OxETiHm8ebrZwSKBudmd0vlEg',
      },
    },
  },
]
