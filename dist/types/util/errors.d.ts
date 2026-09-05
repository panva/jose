import type * as t from '../types.d.ts';
/** Stable error codes used by this module. */
export type JOSEErrorCode = 'ERR_JOSE_ALG_NOT_ALLOWED' | 'ERR_JOSE_GENERIC' | 'ERR_JOSE_NOT_SUPPORTED' | 'ERR_JWE_DECRYPTION_FAILED' | 'ERR_JWE_INVALID' | 'ERR_JWK_INVALID' | 'ERR_JWKS_INVALID' | 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' | 'ERR_JWKS_NO_MATCHING_KEY' | 'ERR_JWKS_TIMEOUT' | 'ERR_JWS_INVALID' | 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' | 'ERR_JWT_CLAIM_VALIDATION_FAILED' | 'ERR_JWT_EXPIRED' | 'ERR_JWT_INVALID';
/** Shared details of JWT claim or header validation failures. */
export interface JWTClaimValidationFailure {
    /** Claim or header that failed validation. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /** The parsed JWT Claims Set; validation of other claims may be incomplete. */
    payload: t.JWTPayload;
}
/** Reason codes produced by JWT Claims Set validation. */
export type JWTClaimValidationReason = 'check_failed' | 'invalid' | 'mismatch' | 'missing' | 'unspecified' | (string & {});
/** Base class for JOSE errors. */
export declare class JOSEError extends Error {
    /** Stable code identifying the error class. */
    static code: JOSEErrorCode | (string & {});
    /** Stable code identifying the error class. Use {@link AnyJOSEError} to narrow subclasses by code. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/**
 * Thrown when JWT claim or header validation fails. Expiration is reported separately as
 * {@link JWTExpired}.
 */
export declare class JWTClaimValidationFailed extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    /** The {@link JWTClaimValidationFailure} details carried by this error. */
    cause: JWTClaimValidationFailure;
    /** Claim or header that failed validation. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /**
     * The parsed JWT Claims Set; validation of other claims may be incomplete. With
     * {@link jwt/verify.jwtVerify jwtVerify} and {@link jwt/decrypt.jwtDecrypt jwtDecrypt}, token
     * authentication precedes claim validation. {@link jwt/unsecured.UnsecuredJWT.decode} does not
     * authenticate tokens.
     */
    payload: t.JWTPayload;
    constructor(message: string, payload: t.JWTPayload, claim?: string, reason?: JWTClaimValidationReason);
}
/** Thrown when a JWT has expired or exceeds the configured maximum token age. */
export declare class JWTExpired extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    /** The {@link JWTClaimValidationFailure} details carried by this error. */
    cause: JWTClaimValidationFailure;
    /** Claim or header that failed validation. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /**
     * The parsed JWT Claims Set; validation of other claims may be incomplete. With
     * {@link jwt/verify.jwtVerify jwtVerify} and {@link jwt/decrypt.jwtDecrypt jwtDecrypt}, token
     * authentication precedes claim validation. {@link jwt/unsecured.UnsecuredJWT.decode} does not
     * authenticate tokens.
     */
    payload: t.JWTPayload;
    constructor(message: string, payload: t.JWTPayload, claim?: string, reason?: JWTClaimValidationReason);
}
/** Thrown when an algorithm is disallowed by configuration. */
export declare class JOSEAlgNotAllowed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when a feature or algorithm is unsupported. */
export declare class JOSENotSupported extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when JWE ciphertext decryption or authentication fails. */
export declare class JWEDecryptionFailed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when a JWE is invalid. */
export declare class JWEInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when a JWS is invalid. */
export declare class JWSInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when a JWT is invalid. */
export declare class JWTInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when a JWK is invalid. */
export declare class JWKInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when a JWKS is invalid. */
export declare class JWKSInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
}
/** Thrown when no keys match in a JWKS. */
export declare class JWKSNoMatchingKey extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when multiple keys match in a JWKS. */
export declare class JWKSMultipleMatchingKeys extends JOSEError {
    /**
     * Yields public keys matching the JWS Header so verification can be attempted with each. See the
     * {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} and
     * {@link jwks/local.createLocalJWKSet createLocalJWKSet} examples. Empty on manually constructed
     * errors.
     */
    [Symbol.asyncIterator]: () => AsyncIterableIterator<t.CryptoKey>;
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when fetching a remote JWKS times out. */
export declare class JWKSTimeout extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when JWS signature verification fails. */
export declare class JWSSignatureVerificationFailed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Errors thrown during JWT Claims Set validation. */
export type JWTClaimValidationError = JWTClaimValidationFailed | JWTExpired;
/**
 * Discriminated union of specific {@link JOSEError} subclasses, narrowed by `code`. Excludes base
 * {@link JOSEError} instances; use `instanceof JOSEError` to catch all module errors.
 */
export type AnyJOSEError = (JOSEAlgNotAllowed & {
    code: 'ERR_JOSE_ALG_NOT_ALLOWED';
}) | (JOSENotSupported & {
    code: 'ERR_JOSE_NOT_SUPPORTED';
}) | (JWEDecryptionFailed & {
    code: 'ERR_JWE_DECRYPTION_FAILED';
}) | (JWEInvalid & {
    code: 'ERR_JWE_INVALID';
}) | (JWKInvalid & {
    code: 'ERR_JWK_INVALID';
}) | (JWKSInvalid & {
    code: 'ERR_JWKS_INVALID';
}) | (JWKSMultipleMatchingKeys & {
    code: 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
}) | (JWKSNoMatchingKey & {
    code: 'ERR_JWKS_NO_MATCHING_KEY';
}) | (JWKSTimeout & {
    code: 'ERR_JWKS_TIMEOUT';
}) | (JWSInvalid & {
    code: 'ERR_JWS_INVALID';
}) | (JWSSignatureVerificationFailed & {
    code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
}) | (JWTClaimValidationFailed & {
    code: 'ERR_JWT_CLAIM_VALIDATION_FAILED';
}) | (JWTExpired & {
    code: 'ERR_JWT_EXPIRED';
}) | (JWTInvalid & {
    code: 'ERR_JWT_INVALID';
});
