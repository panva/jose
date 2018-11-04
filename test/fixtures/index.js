const { readFileSync } = require('fs')
const { join } = require('path')

module.exports.JWK = {
  RSA_PUBLIC: {
    kty: 'RSA',
    e: 'AQAB',
    n: 'wIs03tSBrzj_6nU0uj6AFOmOVljdYORu3AX0kiDamgQmGDRYTGnjWNbePRWMkAFTAp-kpH71WeSV9n3y0MpDuwJqrmiPr7Wy1A_iUhw1X2bZU2MjwNref-i42V8nbPeshm48HzXD-ZRuLVgrn10VuQxRBnbGrOWA7tgfgb9JyDL1ae4dZdJw7Uz87FiVxR71twH1AibIhonEHnmbZqIdqQhpoP1PSPKkQRHPHZWQMXLm9kYbCbsIc36RfbpEe5ybnvBM2xxZKT1DrEQx5ykGwmVe_KzSePSDsdr7hQV5OrM0tftlNLDbxLfy2MtplzdEtLPms8Ma8bO_gvutt2-97w'
  },

  RSA_PRIVATE: {
    kty: 'RSA',
    e: 'AQAB',
    n: 'wIs03tSBrzj_6nU0uj6AFOmOVljdYORu3AX0kiDamgQmGDRYTGnjWNbePRWMkAFTAp-kpH71WeSV9n3y0MpDuwJqrmiPr7Wy1A_iUhw1X2bZU2MjwNref-i42V8nbPeshm48HzXD-ZRuLVgrn10VuQxRBnbGrOWA7tgfgb9JyDL1ae4dZdJw7Uz87FiVxR71twH1AibIhonEHnmbZqIdqQhpoP1PSPKkQRHPHZWQMXLm9kYbCbsIc36RfbpEe5ybnvBM2xxZKT1DrEQx5ykGwmVe_KzSePSDsdr7hQV5OrM0tftlNLDbxLfy2MtplzdEtLPms8Ma8bO_gvutt2-97w',
    d: 'fxbjjPmDqB7dfOpkJVK_xA3tb700UpI1QnGD3zhkUijO5EcYyUdTUv5wrq0cnKjjG-Y4DIPoeq9Q9ORpc7suPa_4rqpBvV8XbLYXUs9fw1rltA7KOK-_EXqRGJmgMmLAs_LrKEaa1pBMsQ1zrbsJbZ1dlgCsXs8V7ZEmKsQSdVtYXdrPN3qMP5w62VF-1_QPRkK7qr0gixQv165beHtuJiWD_jB3OjOKVe70-CkTOYzSnomb1cQdUGRcx2v-WQ4G5E0ytn-grTz8hCF7rL3YHToXTFquByar2Fj7GD-LC9Dn6okHlwQ1kAyN0Xt0ezfJxdRN9NmlOi0CUt4E7MREAQ',
    p: '3xswmQo278dRS8XZBLW2rpyxW5zjvpHvmnicPEnWYhaNwHQMe1LUViAXtrmc_e00L_EcNjM0q528mUwgdOEZwRAtinrw2JNUE2fF9BvE-Q8BRSOxWYuMahJjXhmMTaqPXQrPiO7o3KQgzoJJKS1JaXlpR1ElgeTbhTvnm9a1AwE',
    q: '3O57ufYRcIqlKxxdXBj3J3mnSUTr3ATWOYhVNC2xN2cLDAHwHwt3Rd7UdqI3TjrSwhQokOmzDIBW6APo0T4X_76KweFeiDDkmP9S4y1TDVDO3rx1MO4i5rLWe8NN4N6-L1pNbS4TMuh5tOn6MozFySkNRCicJD38dF6JBa6h8O8',
    dp: 'Jb8j6cCgqtC-IGPI49MapVA9cZKJtaRbNXdSd6DGdLH8KaN4uSS6aBfl6zRcK1oGilXwv_rJ3n9BeW43z46GHPPvwI4sUXgbsWzNQQ-xs7GmNVxklRHXH9sclL8dzcYdm1BI7JH_M9VQ959zYVQYJ5AzD63a-q8NtOz9spAQ8AE',
    dq: 'bJRkiGtv_MCXFk31cDrw1RzL442U4WgbJOFlBqTiMNlaq4cUTR2ke9lc0AU_axor1Kh1m2rPzXgRviuVs6hxwQYTSeAKRqLI5oytXus6oxOw5_T1H5wZ2QnRsbe1wauXCsy1us_nLaDll81aYpee6RNc6r-OpZ01QrfnXbyK6E8',
    qi: 'QrCoyZm-rco2Mziyfxdziaw2S8_rofiKXi7Qz6O5loSslYJtrIXq7w8MX-TVSt6r03lLbK9gthslPRPdp68wmH-By0mfw66JtuSKOAHdHWotFOwYvkkE76O4-eY78pTE9oEzu-lu309NSPSpADd58DIRYMqwuFhbLa35Yrw3TxU'
  },

  'P-256': {
    kty: 'EC',
    crv: 'P-256',
    x: 'gskvlmd8hChm_hxtH4oyDC2rizV1jwK4exTn3icBxu8',
    y: '0El8NqTyybjkEJ2grVUDK1BdPo49OF1pmCJCD92_h-Y',
    d: '_i_1Ac5oVmbBxGvEvOEFHMpzMXKZi8voUx8I3Gl6IxY'
  },

  'P-384': {
    kty: 'EC',
    crv: 'P-384',
    x: 'sOilTs4JMAaXio-fG2rVdLpt7Zoxn3fqWSI58DlwxpS8dgbYI2WLh_OymYy3GZtl',
    y: '23aUE5XAxfr3Ok-nDymgYb1X3TI0dRq1V1Oj0ngItP5ot2tIcL-hnD4kyabg97Ya',
    d: 'cLNsZ0Nm7MsuVsqTCwK_edo982LoVU4sFGZZaEdX8Xvytn8Cdm2HszNVkS3FOl_7'
  },

  'P-521': {
    kty: 'EC',
    crv: 'P-521',
    x: 'AJRHTTRwIoGp7WDE90vsBKIyWbVaESCxEXy-s29X68dpguSra_u1Mhter7b_7kTgb6dX2lXX5wrZSJOJ1gcflXQM',
    y: 'ANW_hbEvDSm-q-NLVEkKR1m2Qfvy6Kp5YnbQ7E_yfupjeZCII81rb55WBAFd4fG5-tcRJtil67E0GH_l6RXZj5Ie',
    d: 'AcrcrbQ-Fu2d2jlxQM0_nSVXM5Kt7mByIxsbgJUe_wgb4DrwVWBC1OJe2ONr0Ovcd_4ydDgWlbIJJhzS3tL9KM0S'
  }
}

module.exports.PEM = {
  'P-256': {
    private: readFileSync(join(__dirname, 'P-256.key')),
    public: readFileSync(join(__dirname, 'P-256.pem'))
  },
  'P-384': {
    private: readFileSync(join(__dirname, 'P-384.key')),
    public: readFileSync(join(__dirname, 'P-384.pem'))
  },
  'P-521': {
    private: readFileSync(join(__dirname, 'P-521.key')),
    public: readFileSync(join(__dirname, 'P-521.pem'))
  }
}
