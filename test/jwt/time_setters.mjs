export function setters(now) {
  const timeSetters = [
    [0],
    [new Date(now * 1000), now],
    ['10s', now + 10],
    ['+10s', now + 10],
    ['-10s', now - 10],
    ['+ 10s', now + 10],
    ['- 10s', now - 10],
    ['10s from now', now + 10],
    ['10s ago', now - 10],
  ]

  return [
    ['setIssuer', 'iss', [['urn:example:issuer']]],
    ['setSubject', 'sub', [['urn:example:subject']]],
    ['setAudience', 'aud', [['urn:example:audience']]],
    ['setJti', 'jti', [['urn:example:jti']]],
    ['setIssuedAt', 'iat', [[undefined, now], ...timeSetters]],
    ['setExpirationTime', 'exp', timeSetters],
    ['setNotBefore', 'nbf', timeSetters],
  ]
}
