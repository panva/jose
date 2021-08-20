"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTExpired = exports.JWSSignatureVerificationFailed = exports.JWKSMultipleMatchingKeys = exports.JWKSNoMatchingKey = exports.JWKSInvalid = exports.JWKInvalid = exports.JWTInvalid = exports.JWSInvalid = exports.JWEInvalid = exports.JWEDecryptionFailed = exports.JOSENotSupported = exports.JOSEAlgNotAllowed = exports.JWTClaimValidationFailed = exports.JOSEError = void 0;
class JOSEError extends Error {
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
exports.JOSEError = JOSEError;
class JWTClaimValidationFailed extends JOSEError {
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
exports.JWTClaimValidationFailed = JWTClaimValidationFailed;
class JOSEAlgNotAllowed extends JOSEError {
    static code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    code = JOSEAlgNotAllowed.code;
}
exports.JOSEAlgNotAllowed = JOSEAlgNotAllowed;
class JOSENotSupported extends JOSEError {
    static code = 'ERR_JOSE_NOT_SUPPORTED';
    code = JOSENotSupported.code;
}
exports.JOSENotSupported = JOSENotSupported;
class JWEDecryptionFailed extends JOSEError {
    static code = 'ERR_JWE_DECRYPTION_FAILED';
    code = JWEDecryptionFailed.code;
    message = 'decryption operation failed';
}
exports.JWEDecryptionFailed = JWEDecryptionFailed;
class JWEInvalid extends JOSEError {
    static code = 'ERR_JWE_INVALID';
    code = JWEInvalid.code;
}
exports.JWEInvalid = JWEInvalid;
class JWSInvalid extends JOSEError {
    static code = 'ERR_JWS_INVALID';
    code = JWSInvalid.code;
}
exports.JWSInvalid = JWSInvalid;
class JWTInvalid extends JOSEError {
    static code = 'ERR_JWT_INVALID';
    code = JWTInvalid.code;
}
exports.JWTInvalid = JWTInvalid;
class JWKInvalid extends JOSEError {
    static code = 'ERR_JWK_INVALID';
    code = JWKInvalid.code;
}
exports.JWKInvalid = JWKInvalid;
class JWKSInvalid extends JOSEError {
    static code = 'ERR_JWKS_INVALID';
    code = JWKSInvalid.code;
}
exports.JWKSInvalid = JWKSInvalid;
class JWKSNoMatchingKey extends JOSEError {
    static code = 'ERR_JWKS_NO_MATCHING_KEY';
    code = JWKSNoMatchingKey.code;
    message = 'no applicable key found in the JSON Web Key Set';
}
exports.JWKSNoMatchingKey = JWKSNoMatchingKey;
class JWKSMultipleMatchingKeys extends JOSEError {
    static code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code = JWKSMultipleMatchingKeys.code;
    message = 'multiple matching keys found in the JSON Web Key Set';
}
exports.JWKSMultipleMatchingKeys = JWKSMultipleMatchingKeys;
class JWSSignatureVerificationFailed extends JOSEError {
    static code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code = JWSSignatureVerificationFailed.code;
    message = 'signature verification failed';
}
exports.JWSSignatureVerificationFailed = JWSSignatureVerificationFailed;
class JWTExpired extends JWTClaimValidationFailed {
    static code = 'ERR_JWT_EXPIRED';
    code = JWTExpired.code;
}
exports.JWTExpired = JWTExpired;
