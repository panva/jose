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
function invalidDuration() {
    throw new TypeError('Invalid time period format');
}
export function secs(str) {
    if (typeof str !== 'string') {
        invalidDuration();
    }
    const matched = REGEX.exec(str);
    if (!matched || (matched[4] && matched[1])) {
        invalidDuration();
    }
    const value = parseFloat(matched[2]);
    const numericDate = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
    if (!Number.isFinite(numericDate)) {
        invalidDuration();
    }
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
function validateStringClaim(claim, value) {
    if (typeof value !== 'string') {
        throw new TypeError(`"${claim}" claim must be a string`);
    }
}
function validateAudienceClaim(value) {
    if (typeof value !== 'string' &&
        (!Array.isArray(value) || Array.from(value).some((member) => typeof member !== 'string'))) {
        throw new TypeError('"aud" claim must be a string or an array of strings');
    }
}
function numericDate(value, label) {
    if (typeof value === 'number')
        return validateInput(label, value);
    if (value instanceof Date)
        return validateInput(label, epoch(value));
    return epoch(new Date()) + secs(value);
}
const normalizeTyp = (value) => {
    const normalized = value.toLowerCase();
    return value.includes('/') ? normalized : `application/${normalized}`;
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
    if (typ !== undefined &&
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
    const now = validateInput('currentDate option', epoch(currentDate === undefined ? new Date() : currentDate));
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
        const max = validateInput('maxTokenAge option', typeof maxTokenAge === 'number' ? maxTokenAge : secs(maxTokenAge));
        if (age - tolerance > max) {
            throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, 'iat', checkFailed);
        }
        if (age < -tolerance) {
            throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, 'iat', checkFailed);
        }
    }
    return payload;
}
let producerPayloads;
function producerPayload(producer) {
    return producerPayloads.get(producer);
}
export function jwtData(producer) {
    const payload = producerPayload(producer);
    for (const claim of ['iat', 'nbf', 'exp']) {
        const value = payload[claim];
        if (typeof value === 'number' && !Number.isFinite(value)) {
            throw new TypeError(`"${claim}" claim must be a finite number`);
        }
    }
    return encoder.encode(JSON.stringify(payload));
}
export function jwtClaim(producer, claim) {
    return producerPayload(producer)[claim];
}
export class JWTClaimsBuilder {
    constructor(payload = {}) {
        if (!isObject(payload)) {
            throw new TypeError('JWT Claims Set MUST be an object');
        }
        ;
        (producerPayloads ||= new WeakMap()).set(this, structuredClone(payload));
    }
    setIssuer(value) {
        validateStringClaim('iss', value);
        producerPayload(this).iss = value;
        return this;
    }
    setSubject(value) {
        validateStringClaim('sub', value);
        producerPayload(this).sub = value;
        return this;
    }
    setAudience(value) {
        validateAudienceClaim(value);
        producerPayload(this).aud = value;
        return this;
    }
    setJti(value) {
        validateStringClaim('jti', value);
        producerPayload(this).jti = value;
        return this;
    }
    setNotBefore(value) {
        producerPayload(this).nbf = numericDate(value, 'setNotBefore');
        return this;
    }
    setExpirationTime(value) {
        producerPayload(this).exp = numericDate(value, 'setExpirationTime');
        return this;
    }
    setIssuedAt(value) {
        const payload = producerPayload(this);
        if (value === undefined) {
            payload.iat = epoch(new Date());
        }
        else if (typeof value === 'string') {
            payload.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value));
        }
        else {
            payload.iat = numericDate(value, 'setIssuedAt');
        }
        return this;
    }
}
