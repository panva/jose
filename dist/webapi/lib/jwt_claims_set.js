import { JWTClaimValidationFailed, JWTExpired, JWTInvalid } from '../util/errors.js';
import { encoder, strictDecoder } from './buffer_utils.js';
import { isObject } from './type_checks.js';
const epoch = (date) => Math.floor(date.getTime() / 1000);
const multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31557600,
};
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
const checkFailed = 'check_failed';
export function secs(str) {
    const matched = REGEX.exec(str);
    if (!matched || (matched[4] && matched[1])) {
        throw new TypeError('Invalid time period format');
    }
    const value = parseFloat(matched[2]);
    const numericDate = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
    if (matched[1] === '-' || matched[4] === 'ago') {
        return -numericDate;
    }
    return numericDate;
}
function validateInput(label, input) {
    if (!Number.isFinite(input)) {
        throw new TypeError(`Invalid ${label} input`);
    }
    return input;
}
function numericDate(value, label) {
    if (typeof value === 'number')
        return validateInput(label, value);
    if (value instanceof Date)
        return validateInput(label, epoch(value));
    return epoch(new Date()) + secs(value);
}
const normalizeTyp = (value) => {
    if (value.includes('/')) {
        return value.toLowerCase();
    }
    return `application/${value.toLowerCase()}`;
};
const checkAudiencePresence = (audPayload, audOption) => {
    if (typeof audPayload === 'string') {
        return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
        return audOption.some((aud) => audPayload.includes(aud));
    }
    return false;
};
function validateNumericDate(payload, claim, required = false) {
    const value = payload[claim];
    if (value === undefined && !required)
        return undefined;
    if (typeof value !== 'number') {
        throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, 'invalid');
    }
    return value;
}
function unexpectedClaim(payload, claim) {
    throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
export function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
    let payload;
    try {
        payload = JSON.parse(strictDecoder.decode(encodedPayload));
    }
    catch {
    }
    if (!isObject(payload)) {
        throw new JWTInvalid('JWT Claims Set must be a top-level JSON object');
    }
    const { typ } = options;
    if (typ &&
        (typeof protectedHeader.typ !== 'string' ||
            normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
        throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, 'typ', checkFailed);
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [...requiredClaims];
    if (maxTokenAge !== undefined)
        presenceCheck.push('iat');
    if (audience !== undefined)
        presenceCheck.push('aud');
    if (subject !== undefined)
        presenceCheck.push('sub');
    if (issuer !== undefined)
        presenceCheck.push('iss');
    for (const claim of new Set(presenceCheck.reverse())) {
        if (!Object.hasOwn(payload, claim)) {
            throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, 'missing');
        }
    }
    if (issuer !== undefined &&
        !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
        unexpectedClaim(payload, 'iss');
    }
    if (subject !== undefined && payload.sub !== subject) {
        unexpectedClaim(payload, 'sub');
    }
    if (audience !== undefined &&
        !checkAudiencePresence(payload.aud, typeof audience === 'string' ? [audience] : audience)) {
        unexpectedClaim(payload, 'aud');
    }
    const { clockTolerance } = options;
    let tolerance = 0;
    if (typeof clockTolerance === 'string') {
        tolerance = secs(clockTolerance);
    }
    else if (clockTolerance !== undefined) {
        if (typeof clockTolerance !== 'number') {
            throw new TypeError('Invalid clockTolerance option type');
        }
        tolerance = clockTolerance;
    }
    validateInput('clockTolerance option', tolerance);
    const { currentDate } = options;
    const now = validateInput('currentDate option', epoch(currentDate || new Date()));
    const iat = validateNumericDate(payload, 'iat', maxTokenAge !== undefined);
    const nbf = validateNumericDate(payload, 'nbf');
    if (nbf !== undefined) {
        if (nbf > now + tolerance) {
            throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, 'nbf', checkFailed);
        }
    }
    const exp = validateNumericDate(payload, 'exp');
    if (exp !== undefined) {
        if (exp <= now - tolerance) {
            throw new JWTExpired('"exp" claim timestamp check failed', payload, 'exp', checkFailed);
        }
    }
    if (maxTokenAge !== undefined) {
        const age = now - iat;
        const max = typeof maxTokenAge === 'number' ? maxTokenAge : secs(maxTokenAge);
        if (age - tolerance > max) {
            throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, 'iat', checkFailed);
        }
        if (age < 0 - tolerance) {
            throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, 'iat', checkFailed);
        }
    }
    return payload;
}
export class JWTClaimsBuilder {
    #payload;
    constructor(payload) {
        if (!isObject(payload)) {
            throw new TypeError('JWT Claims Set MUST be an object');
        }
        this.#payload = structuredClone(payload);
    }
    data() {
        return encoder.encode(JSON.stringify(this.#payload));
    }
    get iss() {
        return this.#payload.iss;
    }
    set iss(value) {
        this.#payload.iss = value;
    }
    get sub() {
        return this.#payload.sub;
    }
    set sub(value) {
        this.#payload.sub = value;
    }
    get aud() {
        return this.#payload.aud;
    }
    set aud(value) {
        this.#payload.aud = value;
    }
    set jti(value) {
        this.#payload.jti = value;
    }
    set nbf(value) {
        this.#payload.nbf = numericDate(value, 'setNotBefore');
    }
    set exp(value) {
        this.#payload.exp = numericDate(value, 'setExpirationTime');
    }
    set iat(value) {
        if (value === undefined) {
            this.#payload.iat = epoch(new Date());
        }
        else if (typeof value === 'string') {
            this.#payload.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value));
        }
        else {
            this.#payload.iat = numericDate(value, 'setIssuedAt');
        }
    }
}
