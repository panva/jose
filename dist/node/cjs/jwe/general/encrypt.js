"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralEncrypt = void 0;
const encrypt_js_1 = require("../flattened/encrypt.js");
const errors_js_1 = require("../../util/errors.js");
const cek_js_1 = require("../../lib/cek.js");
const is_disjoint_js_1 = require("../../lib/is_disjoint.js");
const encrypt_key_management_js_1 = require("../../lib/encrypt_key_management.js");
const base64url_js_1 = require("../../runtime/base64url.js");
const validate_crit_js_1 = require("../../lib/validate_crit.js");
const recipientRef = new WeakMap();
class IndividualRecipient {
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError('setUnprotectedHeader can only be called once');
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    set _unprotectedHeader(value) {
        recipientRef.get(this).unprotectedHeader = value;
    }
    get _unprotectedHeader() {
        return recipientRef.get(this).unprotectedHeader;
    }
}
class GeneralEncrypt {
    constructor(plaintext) {
        this._recipients = [];
        this._plaintext = plaintext;
    }
    addRecipient(key, options) {
        const recipient = new IndividualRecipient();
        recipientRef.set(recipient, { key, options: { crit: options === null || options === void 0 ? void 0 : options.crit } });
        this._recipients.push(recipient);
        return recipient;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError('setProtectedHeader can only be called once');
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError('setSharedUnprotectedHeader can only be called once');
        }
        this._unprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this._aad = aad;
        return this;
    }
    async encrypt(options) {
        var _a, _b;
        if (!this._recipients.length) {
            throw new errors_js_1.JWEInvalid('at least one recipient must be added');
        }
        options = { deflateRaw: options === null || options === void 0 ? void 0 : options.deflateRaw };
        if (this._recipients.length === 1) {
            const { unprotectedHeader, options: recipientOpts, key, } = recipientRef.get(this._recipients[0]);
            const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext)
                .setAdditionalAuthenticatedData(this._aad)
                .setProtectedHeader(this._protectedHeader)
                .setSharedUnprotectedHeader(this._unprotectedHeader)
                .setUnprotectedHeader(unprotectedHeader)
                .encrypt(key, { ...recipientOpts, ...options });
            let jwe = {
                ciphertext: flattened.ciphertext,
                iv: flattened.iv,
                recipients: [{}],
                tag: flattened.tag,
            };
            if (flattened.aad)
                jwe.aad = flattened.aad;
            if (flattened.protected)
                jwe.protected = flattened.protected;
            if (flattened.unprotected)
                jwe.unprotected = flattened.unprotected;
            if (flattened.encrypted_key)
                jwe.recipients[0].encrypted_key = flattened.encrypted_key;
            if (flattened.header)
                jwe.recipients[0].header = flattened.header;
            return jwe;
        }
        let enc;
        for (let i = 0; i < this._recipients.length; i++) {
            const recipient = this._recipients[i];
            const { unprotectedHeader, options: recipientOpts } = recipientRef.get(recipient);
            if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader, unprotectedHeader)) {
                throw new errors_js_1.JWEInvalid('JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint');
            }
            const joseHeader = {
                ...this._protectedHeader,
                ...this._unprotectedHeader,
                ...unprotectedHeader,
            };
            const { alg } = joseHeader;
            if (typeof alg !== 'string' || !alg) {
                throw new errors_js_1.JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
            }
            if (alg === 'dir' || alg === 'ECDH-ES') {
                throw new errors_js_1.JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            }
            if (typeof joseHeader.enc !== 'string' || !joseHeader.enc) {
                throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
            }
            if (!enc) {
                enc = joseHeader.enc;
            }
            else if (enc !== joseHeader.enc) {
                throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            }
            (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, new Map(), recipientOpts === null || recipientOpts === void 0 ? void 0 : recipientOpts.crit, this._protectedHeader, joseHeader);
            if (joseHeader.zip !== undefined) {
                if (!this._protectedHeader || !this._protectedHeader.zip) {
                    throw new errors_js_1.JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
                }
            }
        }
        const cek = (0, cek_js_1.default)(enc);
        let jwe = {
            ciphertext: '',
            iv: '',
            recipients: [],
            tag: '',
        };
        for (let i = 0; i < this._recipients.length; i++) {
            const recipient = this._recipients[i];
            const target = {};
            jwe.recipients.push(target);
            const { unprotectedHeader, options: recipientOpts, key } = recipientRef.get(recipient);
            if (i === 0) {
                const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext)
                    .setAdditionalAuthenticatedData(this._aad)
                    .setContentEncryptionKey(cek)
                    .setProtectedHeader(this._protectedHeader)
                    .setSharedUnprotectedHeader(this._unprotectedHeader)
                    .setUnprotectedHeader(unprotectedHeader)
                    .encrypt(key, { ...recipientOpts, ...options, [encrypt_js_1.unprotected]: true });
                jwe.ciphertext = flattened.ciphertext;
                jwe.iv = flattened.iv;
                jwe.tag = flattened.tag;
                if (flattened.aad)
                    jwe.aad = flattened.aad;
                if (flattened.protected)
                    jwe.protected = flattened.protected;
                if (flattened.unprotected)
                    jwe.unprotected = flattened.unprotected;
                target.encrypted_key = flattened.encrypted_key;
                if (flattened.header)
                    target.header = flattened.header;
                continue;
            }
            const { encryptedKey, parameters } = await (0, encrypt_key_management_js_1.default)((unprotectedHeader === null || unprotectedHeader === void 0 ? void 0 : unprotectedHeader.alg) || ((_a = this._protectedHeader) === null || _a === void 0 ? void 0 : _a.alg) || ((_b = this._unprotectedHeader) === null || _b === void 0 ? void 0 : _b.alg), enc, key, cek);
            target.encrypted_key = (0, base64url_js_1.encode)(encryptedKey);
            if (unprotectedHeader || parameters)
                target.header = { ...unprotectedHeader, ...parameters };
        }
        return jwe;
    }
}
exports.GeneralEncrypt = GeneralEncrypt;
