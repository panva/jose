export class JOSEError extends Error {
    static code = 'ERR_JOSE_GENERIC';
    code = JOSEError.code;
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export class JWTClaimValidationFailed extends JOSEError {
    static code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    code = JWTClaimValidationFailed.code;
    claim;
    reason;
    constructor(message, claim = 'unspecified', reason = 'unspecified') {
        super(message);
        this.claim = claim;
        this.reason = reason;
    }
}
export class JOSEAlgNotAllowed extends JOSEError {
    static code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    code = JOSEAlgNotAllowed.code;
}
export class JOSENotSupported extends JOSEError {
    static code = 'ERR_JOSE_NOT_SUPPORTED';
    code = JOSENotSupported.code;
}
export class JWEDecryptionFailed extends JOSEError {
    static code = 'ERR_JWE_DECRYPTION_FAILED';
    code = JWEDecryptionFailed.code;
    message = 'decryption operation failed';
}
export class JWEInvalid extends JOSEError {
    static code = 'ERR_JWE_INVALID';
    code = JWEInvalid.code;
}
export class JWSInvalid extends JOSEError {
    static code = 'ERR_JWS_INVALID';
    code = JWSInvalid.code;
}
export class JWTInvalid extends JOSEError {
    static code = 'ERR_JWT_INVALID';
    code = JWTInvalid.code;
}
export class JWKInvalid extends JOSEError {
    static code = 'ERR_JWK_INVALID';
    code = JWKInvalid.code;
}
export class JWKSInvalid extends JOSEError {
    static code = 'ERR_JWKS_INVALID';
    code = JWKSInvalid.code;
}
export class JWKSNoMatchingKey extends JOSEError {
    static code = 'ERR_JWKS_NO_MATCHING_KEY';
    code = JWKSNoMatchingKey.code;
    message = 'no applicable key found in the JSON Web Key Set';
}
export class JWKSMultipleMatchingKeys extends JOSEError {
    static code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code = JWKSMultipleMatchingKeys.code;
    message = 'multiple matching keys found in the JSON Web Key Set';
}
export class JWSSignatureVerificationFailed extends JOSEError {
    static code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code = JWSSignatureVerificationFailed.code;
    message = 'signature verification failed';
}
export class JWTExpired extends JWTClaimValidationFailed {
    static code = 'ERR_JWT_EXPIRED';
    code = JWTExpired.code;
}
