"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTExpired = exports.JWSSignatureVerificationFailed = exports.JWKSMultipleMatchingKeys = exports.JWKSNoMatchingKey = exports.JWKSInvalid = exports.JWKInvalid = exports.JWTInvalid = exports.JWSInvalid = exports.JWEInvalid = exports.JWEDecryptionFailed = exports.JOSENotSupported = exports.JOSEAlgNotAllowed = exports.JWTClaimValidationFailed = exports.JOSEError = void 0;
class JOSEError extends Error {
    constructor(message) {
        super(message);
        this.code = JOSEError.code;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.JOSEError = JOSEError;
JOSEError.code = 'ERR_JOSE_GENERIC';
class JWTClaimValidationFailed extends JOSEError {
    constructor(message, claim = 'unspecified', reason = 'unspecified') {
        super(message);
        this.code = JWTClaimValidationFailed.code;
        this.claim = claim;
        this.reason = reason;
    }
}
exports.JWTClaimValidationFailed = JWTClaimValidationFailed;
JWTClaimValidationFailed.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
class JOSEAlgNotAllowed extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JOSEAlgNotAllowed.code;
    }
}
exports.JOSEAlgNotAllowed = JOSEAlgNotAllowed;
JOSEAlgNotAllowed.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
class JOSENotSupported extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JOSENotSupported.code;
    }
}
exports.JOSENotSupported = JOSENotSupported;
JOSENotSupported.code = 'ERR_JOSE_NOT_SUPPORTED';
class JWEDecryptionFailed extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWEDecryptionFailed.code;
        this.message = 'decryption operation failed';
    }
}
exports.JWEDecryptionFailed = JWEDecryptionFailed;
JWEDecryptionFailed.code = 'ERR_JWE_DECRYPTION_FAILED';
class JWEInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWEInvalid.code;
    }
}
exports.JWEInvalid = JWEInvalid;
JWEInvalid.code = 'ERR_JWE_INVALID';
class JWSInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWSInvalid.code;
    }
}
exports.JWSInvalid = JWSInvalid;
JWSInvalid.code = 'ERR_JWS_INVALID';
class JWTInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWTInvalid.code;
    }
}
exports.JWTInvalid = JWTInvalid;
JWTInvalid.code = 'ERR_JWT_INVALID';
class JWKInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWKInvalid.code;
    }
}
exports.JWKInvalid = JWKInvalid;
JWKInvalid.code = 'ERR_JWK_INVALID';
class JWKSInvalid extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWKSInvalid.code;
    }
}
exports.JWKSInvalid = JWKSInvalid;
JWKSInvalid.code = 'ERR_JWKS_INVALID';
class JWKSNoMatchingKey extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWKSNoMatchingKey.code;
        this.message = 'no applicable key found in the JSON Web Key Set';
    }
}
exports.JWKSNoMatchingKey = JWKSNoMatchingKey;
JWKSNoMatchingKey.code = 'ERR_JWKS_NO_MATCHING_KEY';
class JWKSMultipleMatchingKeys extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWKSMultipleMatchingKeys.code;
        this.message = 'multiple matching keys found in the JSON Web Key Set';
    }
}
exports.JWKSMultipleMatchingKeys = JWKSMultipleMatchingKeys;
JWKSMultipleMatchingKeys.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
class JWSSignatureVerificationFailed extends JOSEError {
    constructor() {
        super(...arguments);
        this.code = JWSSignatureVerificationFailed.code;
        this.message = 'signature verification failed';
    }
}
exports.JWSSignatureVerificationFailed = JWSSignatureVerificationFailed;
JWSSignatureVerificationFailed.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
class JWTExpired extends JWTClaimValidationFailed {
    constructor() {
        super(...arguments);
        this.code = JWTExpired.code;
    }
}
exports.JWTExpired = JWTExpired;
JWTExpired.code = 'ERR_JWT_EXPIRED';
