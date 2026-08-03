import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js';
export const JWS_RECOGNIZED = { __proto__: null, b64: true };
export const JWE_RECOGNIZED = { __proto__: null };
export function validateAlgorithms(option, algorithms) {
    if (algorithms !== undefined &&
        (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== 'string'))) {
        throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
        return undefined;
    }
    return new Set(algorithms);
}
export function validateCritDuplicates(Err, protectedHeader) {
    const { crit } = protectedHeader ?? {};
    if (Array.isArray(crit) && new Set(crit).size !== crit.length) {
        throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values');
    }
}
export function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return [];
    }
    if (!Array.isArray(protectedHeader.crit) ||
        protectedHeader.crit.length === 0 ||
        protectedHeader.crit.some((input) => typeof input !== 'string' || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    const recognized = recognizedOption === undefined
        ? recognizedDefault
        : { __proto__: null, ...recognizedOption, ...recognizedDefault };
    for (const parameter of protectedHeader.crit) {
        if (!(parameter in recognized)) {
            throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        }
        if (recognized[parameter] &&
            (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === undefined)) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return protectedHeader.crit;
}
