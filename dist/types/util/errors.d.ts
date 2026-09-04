import type * as t from '../types.d.ts';
/** Stable error codes used by this module. */
export type JOSEErrorCode = 'ERR_JOSE_ALG_NOT_ALLOWED' | 'ERR_JOSE_GENERIC' | 'ERR_JOSE_NOT_SUPPORTED' | 'ERR_JWE_DECRYPTION_FAILED' | 'ERR_JWE_INVALID' | 'ERR_JWK_INVALID' | 'ERR_JWKS_INVALID' | 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' | 'ERR_JWKS_NO_MATCHING_KEY' | 'ERR_JWKS_TIMEOUT' | 'ERR_JWS_INVALID' | 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' | 'ERR_JWT_CLAIM_VALIDATION_FAILED' | 'ERR_JWT_EXPIRED' | 'ERR_JWT_INVALID';
/**
 * Shared properties of JWT Claims Set validation errors.
 *
 * > Note: {@link JWTExpired} does not extend {@link JWTClaimValidationFailed}, so `instanceof
 * > JWTClaimValidationFailed` is `false` for an expired JWT. Use {@link JWTClaimValidationError} or
 * > the {@link JOSEError.code code} discriminant to handle both.
 */
export interface JWTClaimValidationFailure {
    /** The Claim for which the validation failed. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /** The parsed JWT Claims Set (aka payload). */
    payload: t.JWTPayload;
}
/** Reason codes produced by JWT Claims Set validation. */
export type JWTClaimValidationReason = 'check_failed' | 'invalid' | 'mismatch' | 'missing' | 'unspecified' | (string & {});
/** Base class for JOSE errors. */
export declare class JOSEError extends Error {
    /** A unique error code for the particular error subclass. */
    static code: JOSEErrorCode | (string & {});
    /**
     * A unique error code for {@link JOSEError}. Each subclass sets its own; see {@link AnyJOSEError}
     * to switch over them as a discriminated union.
     */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when JWT Claims Set validation fails. */
export declare class JWTClaimValidationFailed extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    /** The {@link JWTClaimValidationFailure} carried by every instance of this error. */
    cause: JWTClaimValidationFailure;
    /** The Claim for which the validation failed. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /**
     * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
     * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
     * has however been verified. Claims Set verification happens after the JWS Signature or JWE
     * Decryption processes.
     */
    payload: t.JWTPayload;
    constructor(message: string, payload: t.JWTPayload, claim?: string, reason?: JWTClaimValidationReason);
}
/** Thrown when a JWT is expired. */
export declare class JWTExpired extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    code: JOSEErrorCode | (string & {});
    /** The {@link JWTClaimValidationFailure} carried by every instance of this error. */
    cause: JWTClaimValidationFailure;
    /** The Claim for which the validation failed. */
    claim: string;
    /** Reason code for the validation failure. */
    reason: JWTClaimValidationReason;
    /**
     * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
     * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
     * has however been verified. Claims Set verification happens after the JWS Signature or JWE
     * Decryption processes.
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
/** Thrown when JWE ciphertext decryption fails. */
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
     * Iterates the public keys that matched the JWS JOSE Header, so that verification can be
     * attempted with each in turn. See the {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet}
     * and {@link jwks/local.createLocalJWKSet createLocalJWKSet} examples. Instances thrown by this
     * module always iterate the matched keys; an instance constructed by other code iterates
     * nothing.
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
 * Discriminated union of the specific {@link JOSEError} subclasses.
 *
 * > Note: The base {@link JOSEError} is deliberately not a member — its `code` spans every value, which
 * > would defeat the discriminant. A small number of JSON Web Key Set HTTP failures are thrown as the
 * > base class itself, so `instanceof JOSEError` remains the catch-all; this union is for handling a
 * > value already known to be one of the specific errors.
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
