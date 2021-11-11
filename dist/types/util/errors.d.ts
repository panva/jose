export declare class JOSEError extends Error {
    static get code(): string;
    code: string;
    constructor(message?: string);
}
export declare class JWTClaimValidationFailed extends JOSEError {
    static get code(): 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    code: string;
    claim: string;
    reason: string;
    constructor(message: string, claim?: string, reason?: string);
}
export declare class JWTExpired extends JOSEError implements JWTClaimValidationFailed {
    static get code(): 'ERR_JWT_EXPIRED';
    code: string;
    claim: string;
    reason: string;
    constructor(message: string, claim?: string, reason?: string);
}
export declare class JOSEAlgNotAllowed extends JOSEError {
    static get code(): 'ERR_JOSE_ALG_NOT_ALLOWED';
    code: string;
}
export declare class JOSENotSupported extends JOSEError {
    static get code(): 'ERR_JOSE_NOT_SUPPORTED';
    code: string;
}
export declare class JWEDecryptionFailed extends JOSEError {
    static get code(): 'ERR_JWE_DECRYPTION_FAILED';
    code: string;
    message: string;
}
export declare class JWEInvalid extends JOSEError {
    static get code(): 'ERR_JWE_INVALID';
    code: string;
}
export declare class JWSInvalid extends JOSEError {
    static get code(): 'ERR_JWS_INVALID';
    code: string;
}
export declare class JWTInvalid extends JOSEError {
    static get code(): 'ERR_JWT_INVALID';
    code: string;
}
export declare class JWKInvalid extends JOSEError {
    static get code(): 'ERR_JWK_INVALID';
    code: string;
}
export declare class JWKSInvalid extends JOSEError {
    static get code(): 'ERR_JWKS_INVALID';
    code: string;
}
export declare class JWKSNoMatchingKey extends JOSEError {
    static get code(): 'ERR_JWKS_NO_MATCHING_KEY';
    code: string;
    message: string;
}
export declare class JWKSMultipleMatchingKeys extends JOSEError {
    static get code(): 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code: string;
    message: string;
}
export declare class JWKSTimeout extends JOSEError {
    static get code(): 'ERR_JWKS_TIMEOUT';
    code: string;
    message: string;
}
export declare class JWSSignatureVerificationFailed extends JOSEError {
    static get code(): 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code: string;
    message: string;
}
