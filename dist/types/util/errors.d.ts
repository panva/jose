export declare class JOSEError extends Error {
    static code: string;
    code: string;
    constructor(message?: string);
}
export declare class JWTClaimValidationFailed extends JOSEError {
    static code: string;
    code: string;
    claim: string;
    reason: string;
    constructor(message: string, claim?: string, reason?: string);
}
export declare class JOSEAlgNotAllowed extends JOSEError {
    static code: string;
    code: string;
}
export declare class JOSENotSupported extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWEDecryptionFailed extends JOSEError {
    static code: string;
    code: string;
    message: string;
}
export declare class JWEInvalid extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWSInvalid extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWTInvalid extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWKInvalid extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWKSInvalid extends JOSEError {
    static code: string;
    code: string;
}
export declare class JWKSNoMatchingKey extends JOSEError {
    static code: string;
    code: string;
    message: string;
}
export declare class JWKSMultipleMatchingKeys extends JOSEError {
    static code: string;
    code: string;
    message: string;
}
export declare class JWSSignatureVerificationFailed extends JOSEError {
    static code: string;
    code: string;
    message: string;
}
export declare class JWTExpired extends JWTClaimValidationFailed {
    static code: string;
    code: string;
}
