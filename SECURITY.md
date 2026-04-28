# Security Policy

## Supported Versions

The following major versions are currently supported with security updates.

| Version                                         | End-of-life |
| ----------------------------------------------- | ----------- |
| [v6.x](https://github.com/panva/jose/tree/v6.x) | TBD         |
| [v5.x](https://github.com/panva/jose/tree/v5.x) | 2026-04-30  |
| [v4.x](https://github.com/panva/jose/tree/v4.x) | 2026-04-30  |
| [v2.x](https://github.com/panva/jose/tree/v2.x) | 2026-04-30  |

End-of-life for the current release will be determined prior to the release of its successor.

## Reporting a Vulnerability

Vulnerabilities must be reported using the [project's security advisory](https://github.com/panva/jose/security/advisories/new).

**All vulnerability reports MUST be submitted through the channel listed above.** This allows the maintainers to assess the report, collaborate on remediation, and coordinate disclosure in a responsible manner.

CVE identifiers for this project, whether for confirmed, rejected, disputed, or untriaged reports, may only be requested or coordinated by the maintainers, or with the maintainers' explicit consent, through the GitHub Security Advisory process. Submitting a report through the project's security advisory does not authorize reporters to request CVE identifiers from, disclose details to, or otherwise coordinate with third-party CVE Numbering Authorities (CNAs), such as MITRE, for this project.

If the maintainers reject a report through the project's documented channel, that rejection does not authorize the reporter to bypass the project's security disclosure process by pursuing a CVE assignment through a third-party CNA. The maintainers reserve the right to request rejection, withdrawal, or dispute of any CVE entry that was requested, assigned, or coordinated without prior explicit consent from the maintainers.

## Threat Model

This section documents the threat model for `jose`, a JavaScript implementation of JSON Object Signing and Encryption standards including [JSON Web Token (JWT) - RFC 7519](https://www.rfc-editor.org/rfc/rfc7519), [JSON Web Signature (JWS) - RFC 7515](https://www.rfc-editor.org/rfc/rfc7515), [JSON Web Encryption (JWE) - RFC 7516](https://www.rfc-editor.org/rfc/rfc7516), [JSON Web Key (JWK) - RFC 7517](https://www.rfc-editor.org/rfc/rfc7517), and [JSON Web Algorithms (JWA) - RFC 7518](https://www.rfc-editor.org/rfc/rfc7518).

### Purpose and Intended Users

This library is intended for general application developers, cryptography practitioners, and anyone needing JOSE functionality in JavaScript runtimes (Node.js, browsers, Cloudflare Workers, Deno, Bun, and other Web-interoperable environments).

### Trust Assumptions

#### Underlying Cryptographic Primitives

This library trusts that the Web Cryptography implementations provided by the runtime are correct and secure. The library delegates all cryptographic operations (key generation, signing, verification, encryption, decryption, key derivation, etc.) to the runtime's Web Cryptography implementation and does not attempt to validate or verify the correctness of these underlying primitives.

#### Runtime Environment

The library assumes it is running in a trusted execution environment. The following are considered outside the scope of this library's threat model:

- **Prototype pollution attacks**: If an attacker can modify JavaScript prototypes, this is considered a vulnerability in the user's application code or the runtime environment, not in this library.
- **Debugger access**: If an attacker has debugger access to the running process, they can inspect memory, modify variables, and bypass security controls. This is a runtime-level compromise, not a library vulnerability.
- **Runtime compromise**: Attacks that compromise the JavaScript runtime itself (e.g., malicious runtime modifications, compromised Node.js binaries, malicious browser extensions with elevated privileges) are not considered attacks on this library.

#### Remote JWKS Sources

When using remote JSON Web Key Sets (JWKS) via `createRemoteJWKSet`, the library assumes that users configure trusted JWKS sources. The security of key material fetched from remote sources depends on the trustworthiness of those sources and the security of the transport (HTTPS).

#### Key Material

Private keys and secret key material provided by users for signing, decryption, or key management operations are considered trusted and fitting the user's own security requirements. The library does not validate that key material originates from a secure source or has been handled securely prior to being provided.

#### Key and Secret Sizes

As cryptographic requirements on key and secret sizes evolve over time, following these developments is the user's responsibility. The library implements reasonable measures where practical, but in the spirit of interoperability with other implementations, it does not enforce strict key size requirements for all algorithms. For example, the library cannot prevent use of short HMAC secret keys because such restrictions are easily sidestepped and would hinder interoperability.

#### Input Size Limits

The library does not enforce size limits on any inputs (tokens, keys, payloads, headers, etc.). It is the application's responsibility to enforce input size limits appropriate for its context before passing data to the library. Without such limits, an attacker could supply arbitrarily large inputs that consume excessive memory or processing time.

#### Side-Channel Attacks

This library delegates all cryptographic operations to the underlying Web Cryptography. Any resistance to side-channel attacks (timing attacks, cache attacks, etc.) is entirely dependent on the underlying cryptographic implementations and is outside the scope of this library.

### Security Guarantees

This library aims to provide the following security guarantees:

- **Specification compliance**: Correct implementation of the JOSE family of specifications (RFC 7515, RFC 7516, RFC 7517, RFC 7518, RFC 7519, and related RFCs), validated against test vectors from the respective specifications.
- **JWT Claims Set validation**: Proper validation of JWT claims (`exp`, `nbf`, `iat`, `aud`, `iss`, etc.) as defined by the underlying RFCs.
- **Input validation**: Validation of inputs to prevent misuse of the API.

### Out of Scope

#### Key Management

This library does not handle key storage. Users are responsible for securely storing, managing, and distributing cryptographic keys.

#### Memory Clearing

This library does not guarantee that key material or other sensitive data is cleared from memory after use. As long as the user retains references to key objects, the key material may remain in memory. Secure memory management is the responsibility of the user and the runtime environment.

### Threat Actors and Security Properties

This library aims to provide the security properties defined by the JOSE specifications. For detailed security considerations, refer to the Security Considerations sections in [RFC 7515 (JWS)](https://www.rfc-editor.org/rfc/rfc7515#section-10), [RFC 7516 (JWE)](https://www.rfc-editor.org/rfc/rfc7516#section-11), [RFC 7517 (JWK)](https://www.rfc-editor.org/rfc/rfc7517#section-9), [RFC 7518 (JWA)](https://www.rfc-editor.org/rfc/rfc7518#section-8), and [RFC 7519 (JWT)](https://www.rfc-editor.org/rfc/rfc7519#section-8).

### What is NOT Considered a Vulnerability

The following are explicitly **not** considered vulnerabilities in this library:

- **Prototype pollution** ([CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)): Attacks that exploit JavaScript prototype pollution are considered vulnerabilities in user application code or the runtime, not this library.
- **Object injection** ([CWE-915](https://cwe.mitre.org/data/definitions/915.html)): Similar to prototype pollution, object injection attacks are outside the scope of this library.
- **Debugger/inspector access** ([CWE-489](https://cwe.mitre.org/data/definitions/489.html)): If an attacker can attach a debugger to the process, they have already compromised the runtime environment.
- **Memory inspection**: Reading process memory, heap dumps, or core dumps to extract key material is a runtime-level attack.
- **Side-channel attacks** ([CWE-208](https://cwe.mitre.org/data/definitions/208.html)): Timing attacks, cache attacks, and other side-channel vulnerabilities in the underlying Web Cryptography implementations are not vulnerabilities in this library.
- **Compromised runtime environment**: Malicious or backdoored JavaScript runtimes, compromised system libraries, or tampered Web Cryptography implementations.
- **Supply chain attacks on the runtime** ([CWE-1357](https://cwe.mitre.org/data/definitions/1357.html)): Compromised Node.js binaries, malicious browser builds, or similar supply chain attacks on the execution environment.
- **Denial of service via resource exhaustion** ([CWE-400](https://cwe.mitre.org/data/definitions/400.html)): While the library validates inputs, it does not implement resource limits. Applications should implement their own rate limiting and resource management.
- **Oversized inputs** ([CWE-400](https://cwe.mitre.org/data/definitions/400.html)): The library does not enforce size limits on JWTs, JWS, JWE, JWK, or JWKS inputs. Enforcing input size limits appropriate for the application's context (e.g., limiting the size of incoming tokens or payloads before passing them to the library) is the responsibility of the application.
- **Untrusted JWKS sources**: Security issues arising from fetching keys from untrusted or compromised JWKS endpoints are the user's responsibility.
