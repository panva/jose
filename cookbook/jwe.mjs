export default [
  {
    title:
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.2 - Key Encryption using RSA-OAEP with AES-GCM',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.3 - Key Wrap using PBES2-AES-KeyWrap with AES-CBC-HMAC-SHA2',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.4 - Key Agreement with Key Wrapping using ECDH-ES and AES-KeyWrap with AES-GCM',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.5 - Key Agreement using ECDH-ES with AES-CBC-HMAC-SHA2',
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
    title:
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.6 - Direction Encryption using AES-GCM',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.6 - Key Wrap using AES-GCM KeyWrap with AES-CBC-HMAC-SHA2',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.8 - Key Wrap using AES-KeyWrap with AES-GCM',
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
    title: 'https://www.rfc-editor.org/rfc/rfc7520#section-5.9 - Compressed Content',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.10 - Including Additional Authenticated Data',
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
      'https://www.rfc-editor.org/rfc/rfc7520#section-5.11 - Protecting Specific Header Fields',
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
    title: 'https://www.rfc-editor.org/rfc/rfc7520#section-5.12 - Protecting Content Only',
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
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-encrypt#appendix-A - HPKE-0 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin-to the bitter end. And you can trust us to keep any secret of yours-closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'EC',
        crv: 'P-256',
        x: 'qy-BxXhaelX9Fqe8muRTu8HhseHYgMMGxyfAnIy0MC0',
        y: 'ctfHN7Y4pkj7vZI-sgJ6BqsYwG-PDnB8j7TsfzHHJOI',
        d: 'aAKxBMAkNm2AZDGv7LN5yodDwahJ5rKbrgiiz3dUIH4',
        alg: 'HPKE-0',
        use: 'enc',
        kid: 'KfvD-eYaynUKba0ow-v9uoEV-twV6mYDyiAOWO6LoPM',
      },
      alg: 'HPKE-0',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-0',
        kid: 'KfvD-eYaynUKba0ow-v9uoEV-twV6mYDyiAOWO6LoPM',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTAiLCJraWQiOiJLZnZELWVZYXluVUtiYTBvdy12OXVvRVYtdHdWNm1ZRHlpQU9XTzZMb1BNIn0.BKqUaiyoPbH1jnjApcpjGqswg7npGSSXFcFv1nGaL6YYs3S27c8Yi5V5rsds91bV_UjdqzLlj2zuuAPWetLMab8..fO8VQt1DsdgtijGci90sO8sNvws6im8Yko4NnMWXVAM5GaHbHYRSGnjs6M7GnkcaTrEjy8cxDDLZFKTwMdYGOjYBsbTVVAoIImVd8tXZNjQswaPU8t8OP1jCwo6iw8t4-Hm6hCE61uzhEd_r9XkN4blHjrcAoCICcwqn_5lgJCTPQezJtiTAhrtHpC1quPA3aO2Pyhui5CzOtk967IC8v28jq6K7C3mbu-m10bo0aWqdybibCiiS5A89PXFWurW83HNnJFdoiqZRTtF4d_OAQ2Jq9FCrahrh43Xqp1z3HYjf73_rOHYWXzv8jGorDAKjsPgxYN_9TgGUstjiRIMLj9dJXxqrPkRLQ4VSAzVWCNe5MabAR1sFFB5tx_gA.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTAiLCJraWQiOiJLZnZELWVZYXluVUtiYTBvdy12OXVvRVYtdHdWNm1ZRHlpQU9XTzZMb1BNIn0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'BNC1LPfAH7I5Fxi7X7lrQLFkdpZcSGoXpBw4FYvCY1wZqAX53caa-lyNLPHkzwQMAMFHoOoN_TRGSzb2Gw4aDlA',
        ciphertext:
          'I0sH6mQa6r-mgLHqI23-wzBmsTULQoNtANiHF_incW5y5BIB7qo0XN3NoOqf1IvH1UEfE1_Tu9Baf6M3z_E9eJK1oDV1Q8A6VnZUnhj0cf2UNQhufoVJOlpbPolLiecxwitIqYKPKfzJmG1uZ7lA0xUAiNPkUR9OSHpLYr9HWAa1DWDbczWOMtFnxCJwd-PfyjX5-5-X6kAcdj5z-Kx4losmN2k7r2T1BUnHNnZlSgcz5nSZBxvKqkXX3xl0Tw9ys--37IJD7UcIFfST6b0PXHzuKSw-attSD_67SRcpcxUTm3nyvtroYF8sg0ztQLuNkC-gwe7-uxPNO2iBDIypgImhvlTaAEcuHJDtFgU5geIXFMAlMDAg7cSk4ssR',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-encrypt#appendix-A - HPKE-1 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin-to the bitter end. And you can trust us to keep any secret of yours-closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'EC',
        crv: 'P-384',
        x: 'CTphb4EF35SSZgrk9rYHXkdalQLTGRApFRiAF8eVteQtOIZRbZKV0iEv9eiSElLT',
        y: '6KddFD8aAVzoJNq1Jr_4oZ3t7SGZm3qgXMHN7sB_KAlxTydxRaVXArFKQyyffOj6',
        d: 'UzFpz5G-_kWkiCKWCWdRXFxVoz9fTY4u9I_XmfPoOI7eEf0glEARLbsx06wb1EYu',
        alg: 'HPKE-1',
        use: 'enc',
        kid: 'K4P-SJHnqUpz-qTXlYCBV6ITFu8sH_gsx2KGMEcjk9s',
      },
      alg: 'HPKE-1',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-1',
        kid: 'K4P-SJHnqUpz-qTXlYCBV6ITFu8sH_gsx2KGMEcjk9s',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTEiLCJraWQiOiJLNFAtU0pIbnFVcHotcVRYbFlDQlY2SVRGdThzSF9nc3gyS0dNRWNqazlzIn0.BG5NsNBMLw2aHZgcyEGwC2D5L3NQqWp6TCVneiNrWzK9OCuIqpZ6mxkTxf-UXtO2BiQjFLSm2GCnPItrjFEjHzTvg_aPUjZVNsSWFhgHseLC40zvBvBqhqGyRT1btnzhYw..k283DSyVnTKkfQnB0ngaY03st55x1OBqHLvnvp7VM0jA-yxgC7QgdAiyDCxfnpBgLE680KyJPJcDo0F9K50O2wZOBC5VAPUZlvkOkGucTvEfnVn6HPd1c-Btpm4eMEHOzEZ69nMQptgOtaA_XTdhiA34CX_bMaPO0MwrXu76HrMlfSXZ1C-298ZPHDOBHUx4IJROJaXMh4NKq76VLkIsdAdgguT4SXaTYBka5c1vEcLtjQh5zKtQHXHHevHO6gZmneYsg6sx-PvrXPItQe33bGwYAJ5zxhKTynoOfDa_zfZFSdWz3OX1wMa8WZMbCU1ibIjiEv0H1pOO0cs8mt7Xs5xjTqKBlW6m8EecD2H9YBqB4DVbMsckNnxkqIEM.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTEiLCJraWQiOiJLNFAtU0pIbnFVcHotcVRYbFlDQlY2SVRGdThzSF9nc3gyS0dNRWNqazlzIn0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'BFX1YGr3AR4szfTMVMWctHh2LGBPFdGdJCfft3QYR0mL-zCeJgZkcYzFlD1EID8dFfDv_YNU8DRmm3qzQ8oMsW4ZA3Qs_iQpaEVj3AOsNWFD-yLq1dt1fF4r6VAufu0unw',
        ciphertext:
          '_AB6I_8GkA-U9Il2XFNJ3kBDAJ9P1erWUzWzBFgRFM1NhlkE6phABLmhTNc517Vk-YJ0P_7WQqbUnMwgRBQYDycPdhh11ZGvRYI6EjbHXRD8ctVDX_WaWE6RPfY3GxA1Rplh5ZcKYus2Pln1nOseFvC9NEZkuLNLyM8jBVgwq_EQtH1GQlSZwK8I1TyBOcBtWcXnYqy-XK8Rbj3eifbQESKZPedVqMXcQ03u4xdikZp5aqLJCLmwN16pYTgSzXDW0d0IHPc1tqLF4eUFrFfPokckpe92pP5q1DMetRLP7G46oPLXMBQ8tFd_FxtdVF1mrqV3l2KB-JC6unu9ZWwEBt6s-p1xZ2jjIiqTC0Hy-0pK8YmfOEKj5SKk_re1',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-encrypt#appendix-A - HPKE-3 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin-to the bitter end. And you can trust us to keep any secret of yours-closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'OKP',
        crv: 'X25519',
        x: 'Pyv22rGl5uY-24SOA_wda7PO4bIw6bobrD1_5VgF3H4',
        d: 'VtBu3AuB4_RKgDCDqj1j-_Kzf12ekvaGxoAGmMDcDks',
        alg: 'HPKE-3',
        use: 'enc',
        kid: 'n9hjOrhXxsQ_lTMu3PqkjHgwJURHZPF3HY5p-LFEgyg',
      },
      alg: 'HPKE-3',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-3',
        kid: 'n9hjOrhXxsQ_lTMu3PqkjHgwJURHZPF3HY5p-LFEgyg',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTMiLCJraWQiOiJuOWhqT3JoWHhzUV9sVE11M1Bxa2pIZ3dKVVJIWlBGM0hZNXAtTEZFZ3lnIn0.UkLR0N2IgxHkSZMhcCfxVO_F12kcq32ccJ8x8M4MfBE..I8Obflj3vInszfr9sC1tnnhaGPSGAL9L1-mURYJqYWWxTlI0OZrFSKiPY7dAuyrITxTiaboZTF2yNo0swzp8S5DTil1KdxCzrMUtz5Lb-rMbR5Q5uNO7NXegJceIQkR8p7iMfNXETCI8Pv36J45yDQDHrjNc6ZuJ8Xn6pHNFFot67L1GI0ULsrS2TCqztg2p76A1nObMGvA-1w5zwU6NN7p9WPCrvIKwO6MIl-LR4MV0-jnlmd5dlw3wGP5DDfqms7lZNbZ5X2d5U0s_7aT4Zar6ixUZrI6bSj4gntrEg8nLz9IlBT6tE6Gic3I2Abxbj1Ewn20WAZetzAQzWNdJk7lIZYAJZLeeBip605kw5DuwSEK_3jlXnPsDO3Zs.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTMiLCJraWQiOiJuOWhqT3JoWHhzUV9sVE11M1Bxa2pIZ3dKVVJIWlBGM0hZNXAtTEZFZ3lnIn0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key: 'Ch0FElgndJcJkvCLEWpRpYJo3gbwn-CzVke-s_XH5Qc',
        ciphertext:
          '9iGWYstawHANKOPNlkohsf0uSr5B1fSsTt5AYJzgI7WckZSyHooM2gEGrNf1b8TzPtWAnq7fGXgSTd76-Bg_DsDu-EsdEnb9XE9-7jaLLbP_pJ2JNK6R1k420ZvpTqlAPk0Zu1tW8ZREYDtbw0K8aM4gIY4P8vqFba2mJxv0OxEXTP5ur2pTOOcWhZ0E4ICUMDD1xcgzgziEsunxeFdU2X2okwVRr6pQP4XIe81bde7OY1qhaa84mxmMBNoOBgkE3vlV58KHR_JFKUkGlt_0FKBsrpt1yq9gZUzF2_8uqD1xHiMrw3zyLcKH0hdJvLfZv3s_0sYAk98tPF4uZVmkyF-FC0n83vghekRCLR_HJg_QZhfWsSAhETnydVyJ',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-encrypt#appendix-A - HPKE-4 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin-to the bitter end. And you can trust us to keep any secret of yours-closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'OKP',
        crv: 'X25519',
        x: 'N5icT6hvBDpsc9a2t1mXfsDBGsvi4VNTNoINejK5nCY',
        d: '0EeYQgglJkckhiVP5aGzyrQHepapUd39QlbI53HnWOQ',
        alg: 'HPKE-4',
        use: 'enc',
        kid: 'EMf0FmafX1CDECti7cvCWZddOvzvPf3_nmXI39eiO18',
      },
      alg: 'HPKE-4',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-4',
        kid: 'EMf0FmafX1CDECti7cvCWZddOvzvPf3_nmXI39eiO18',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTQiLCJraWQiOiJFTWYwRm1hZlgxQ0RFQ3RpN2N2Q1daZGRPdnp2UGYzX25tWEkzOWVpTzE4In0.Y2SoN-pcwe65RNXeomaV8hgkqY5sBn1t9VLp2Y9_1UU..qQJ1rsCOLV0Z2sFQh1MjkYP2Lmu2O_4g2JWWxWSJNqgvPVmXoEoW7Ls7WNcW49aSYJiAmT_J_W3TfhP48qPpsAuaLP1MK4iA-hWF0LLfCAQM5wST86_eO2ewwSfXEwTsJoMeqw2A4lTifulJmNT8IXHzhU7SmmLuRoni_MUpD5NzCy7_M4yb5v1wQ0CcbjiBJZn14Y9dufP0v6kFoR50ca95rIflu54TH_i-Z9CReJHZBmlcKcsuejfP7HCpQx60VRCpFZ9IsSIQgGJu4QSMzQToDZW6vhnSQBzeqafxC4082Lrh3YlQ21CCJ6AjOEuStYvvtYd6Yem9GxG17Y_Q-b5yePFrn2gHa0j7avoqKQqTjiuTGjruFejEBjnj.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTQiLCJraWQiOiJFTWYwRm1hZlgxQ0RFQ3RpN2N2Q1daZGRPdnp2UGYzX25tWEkzOWVpTzE4In0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key: 'WPuUGt62N-ZPXl0IMvwqVI5AuWnkn-ShiF3T5xF2KAQ',
        ciphertext:
          'dKwJ1poXJWUfVzLGr1UbCfJpZ8bx4tLlzFMwlcb-RN4do0umqfRc_J70pxgWt6MEpFxAFd8ZzDUzGtjZbt4k1c5vcCX8_XLT87JUYEAFLcPzgT6pdqgEjOJHd3E84HgphLSC-D117RVpHH-lkUp7NKg8hbJ67ZrDnPvT_JwpAw8898diWI-Gys3K6tSox0RLHFVldHTjJQWE28EPWWJ6ewklqd28rgTMc8zm2lpapa3p5hOSYxUB2IQ6CkU7U7SaPNrW3VspdVCbpjajOchTWIBokxihbxyIH3IT5xMhYjhcrkFRLbF1X_adZjTF1nQFXnBSynAnEs5q2RBExeNLYb6Dc9TDDzjV009xEqX7mpsrhJKlkw5-SlFIsaF4',
      },
    },
  },
  {
    title:
      'https://datatracker.ietf.org/doc/html/draft-ietf-jose-hpke-encrypt#appendix-A - HPKE-7 Integrated Encryption',
    input: {
      plaintext:
        'You can trust us to stick with you through thick and thin-to the bitter end. And you can trust us to keep any secret of yours-closer than you keep it yourself. But you cannot trust us to let you face trouble alone, and go off without a word. We are your friends, Frodo.',
      key: {
        kty: 'EC',
        crv: 'P-256',
        x: 'z860carZ9CSxTjXo7MK65h_TaZX7ipi2iUh_Bh-VP54',
        y: 'i9X0v8PwcNgbsoMhAz-_W2OPaFU--BQAgWVzJVOfedo',
        d: 'nklFxo0VoD3POieIKD2I_6O4pyuoX1755y_r8My3kL4',
        alg: 'HPKE-7',
        use: 'enc',
        kid: 'YGdLPiZno0vV3kJKu4kEMQEjK3_upFF2D_lFDf1FFwk',
      },
      alg: 'HPKE-7',
      aad: 'The Fellowship of the Ring',
    },
    encrypting_key: {},
    encrypting_content: {
      protected: {
        alg: 'HPKE-7',
        kid: 'YGdLPiZno0vV3kJKu4kEMQEjK3_upFF2D_lFDf1FFwk',
      },
    },
    output: {
      compact:
        'eyJhbGciOiJIUEtFLTciLCJraWQiOiJZR2RMUGlabm8wdlYza0pLdTRrRU1RRWpLM191cEZGMkRfbEZEZjFGRndrIn0.BL2AEDUZhRslwuzyKdVKVaGwBpFly_SgLlxy2wTg42Vyfob2tCdv0SgN6OMR16kilUZ17jafK0Gzw0plYKGm08Y..0-DVK3WNJxSSX4hn0KgFlV4vRS4iJLiNCmjl9J4QKCYiOzmdHmWXvB4MS56wOmpVhDbboVIC0wOBxsUlWIXIg6N9DSlu-iwlgiqrVj2v61LrX-qjB7MAg0X5DQJSOWg-saAkhf2lEJ4z0meZIdAlY93_vgAUHKoHsSp_EciL28JtLrBU18WHv34eHONzWsVYdj-ycaBqLUAkcfYrlNZrVpCR6OdNXkuOmkhqrIZjFEl67VZVY5NfbvyFRAkkqgd42wvATdGk2gw_jDZe1fvzGNuV-e5UCrHQ-5Es2rmsLe-nfeB_9iUe-2nZswWS2qndvz6ZANF9Kj2QMJXCLN7RRSLLjP58sxoyDZC8nRBdJxsJKXc8G5eYFLJ1Bc4w.',
      json_flat: {
        protected:
          'eyJhbGciOiJIUEtFLTciLCJraWQiOiJZR2RMUGlabm8wdlYza0pLdTRrRU1RRWpLM191cEZGMkRfbEZEZjFGRndrIn0',
        aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
        encrypted_key:
          'BJsgimlSAygpn6mErqMkZcmzVLsX6V9aYArVYAjg2LEi2shWQopeMMr5n4VNH_kCeuqXRd2LtFjQd2eWsXTAcs8',
        ciphertext:
          'ny4HVMntsCPyijVFtO41pSpN_jusNGtAaYjD_glEgkQlnMlJuDyiTbL9_IgWjcmaQv-ahcToh6pussscT37Oki95DB56UEK1sgwv23m54UgDFDS3Q2UI48pRzgsONMJdc46-UjqCXvDgbGZfA7Afn-mCGJZo90Tr2QyDMpevwYv4-Zd6ldw2QrF7pUXXOLUP8yh2Y8qZB7JkyUvN5gH8QIgIcC11a-2-YWWSO3JgpJ4R51YESAOJ6MbaW2otZU7JY9GW7dKpwd3mym6IxJ4onwSvABkmVaFSqxOEBlStSLirlR0sf1q9HK_gn8HHNjlaNNja2yE3C42ESTWAoH1uapvfMaQJE1ZWG7ru77nMBQJPRxAb-dXTUJa3jeVF',
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
]
