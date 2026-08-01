import type * as types from '../types.d.ts';
/**
 * Every stable error code used by this module. {@link AnyJOSEError} pairs each subclass with the one
 * it is thrown with, making that union a discriminated one.
 */
export type JOSEErrorCode = 'ERR_JOSE_ALG_NOT_ALLOWED' | 'ERR_JOSE_GENERIC' | 'ERR_JOSE_NOT_SUPPORTED' | 'ERR_JWE_DECRYPTION_FAILED' | 'ERR_JWE_INVALID' | 'ERR_JWK_INVALID' | 'ERR_JWKS_INVALID' | 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' | 'ERR_JWKS_NO_MATCHING_KEY' | 'ERR_JWKS_TIMEOUT' | 'ERR_JWS_INVALID' | 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' | 'ERR_JWT_CLAIM_VALIDATION_FAILED' | 'ERR_JWT_EXPIRED' | 'ERR_JWT_INVALID';
/**
 * The shape shared by the two errors thrown during JWT Claims Set validation.
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
    payload: types.JWTPayload;
}
/** Reason codes produced by JWT Claims Set validation. */
export type JWTClaimValidationReason = 'check_failed' | 'invalid' | 'mismatch' | 'missing' | 'unspecified' | (string & {});
/** A generic Error that all other JOSE specific Error subclasses extend. */
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
/** An error subclass thrown when a JWT Claim Set member validation fails. */
export declare class JWTClaimValidationFailed extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWTClaimValidationFailed}. */
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
    payload: types.JWTPayload;
    constructor(message: string, payload: types.JWTPayload, claim?: string, reason?: JWTClaimValidationReason);
}
/** An error subclass thrown when a JWT is expired. */
export declare class JWTExpired extends JOSEError implements JWTClaimValidationFailure {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWTExpired}. */
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
    payload: types.JWTPayload;
    constructor(message: string, payload: types.JWTPayload, claim?: string, reason?: JWTClaimValidationReason);
}
/** An error subclass thrown when a JOSE Algorithm is not allowed per developer preference. */
export declare class JOSEAlgNotAllowed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JOSEAlgNotAllowed}. */
    code: JOSEErrorCode | (string & {});
}
/**
 * An error subclass thrown when a particular feature or algorithm is not supported by this
 * implementation or JOSE in general.
 */
export declare class JOSENotSupported extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JOSENotSupported}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when a JWE ciphertext decryption fails. */
export declare class JWEDecryptionFailed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWEDecryptionFailed}. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** An error subclass thrown when a JWE is invalid. */
export declare class JWEInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWEInvalid}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when a JWS is invalid. */
export declare class JWSInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWSInvalid}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when a JWT is invalid. */
export declare class JWTInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWTInvalid}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when a JWK is invalid. */
export declare class JWKInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWKInvalid}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when a JWKS is invalid. */
export declare class JWKSInvalid extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWKSInvalid}. */
    code: JOSEErrorCode | (string & {});
}
/** An error subclass thrown when no keys match from a JWKS. */
export declare class JWKSNoMatchingKey extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWKSNoMatchingKey}. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** An error subclass thrown when multiple keys match from a JWKS. */
export declare class JWKSMultipleMatchingKeys extends JOSEError {
    /**
     * Iterates the public keys that matched the JWS JOSE Header, so that verification can be
     * attempted with each in turn. See the {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet}
     * and {@link jwks/local.createLocalJWKSet createLocalJWKSet} examples. Instances thrown by this
     * module always iterate the matched keys; an instance constructed by other code iterates
     * nothing.
     */
    [Symbol.asyncIterator]: () => AsyncIterableIterator<types.CryptoKey>;
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWKSMultipleMatchingKeys}. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** Timeout was reached when retrieving the JWKS response. */
export declare class JWKSTimeout extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWKSTimeout}. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/** An error subclass thrown when JWS signature verification fails. */
export declare class JWSSignatureVerificationFailed extends JOSEError {
    static code: JOSEErrorCode | (string & {});
    /** A unique error code for {@link JWSSignatureVerificationFailed}. */
    code: JOSEErrorCode | (string & {});
    constructor(message?: string, options?: {
        cause?: unknown;
    });
}
/**
 * Union of the errors thrown during JWT Claims Set validation. {@link JWTExpired} does not extend
 * {@link JWTClaimValidationFailed}, so a single `instanceof` check cannot cover both. Use this type
 * — together with the {@link JOSEError.code code} discriminant — when handling either.
 */
export type JWTClaimValidationError = JWTClaimValidationFailed | JWTExpired;
/**
 * Union of every {@link JOSEError} subclass this module throws, each paired with the single
 * {@link JOSEErrorCode} it is thrown with. That pairing lives here rather than on the classes, so
 * that `code` stays assignable, writable, and overridable on them exactly as before, while a value
 * of this type can still be switched over as a discriminated union.
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
