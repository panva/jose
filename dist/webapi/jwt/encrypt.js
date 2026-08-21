import { createJWE } from '../lib/jwe_encrypt.js';
import { JWTClaimsBuilder, jwtClaim, jwtData } from '../lib/jwt_claims_set.js';
import { assertNotSet } from '../lib/helpers.js';
const EncryptJWT_base = JWTClaimsBuilder;
export class EncryptJWT extends EncryptJWT_base {
    #cek;
    #iv;
    #keyManagementParameters;
    #protectedHeader;
    #replicateIssuerAsHeader;
    #replicateSubjectAsHeader;
    #replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        assertNotSet(this.#keyManagementParameters, 'setKeyManagementParameters');
        this.#keyManagementParameters = parameters;
        return this;
    }
    setContentEncryptionKey(cek) {
        assertNotSet(this.#cek, 'setContentEncryptionKey');
        this.#cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        assertNotSet(this.#iv, 'setInitializationVector');
        this.#iv = iv;
        return this;
    }
    replicateIssuerAsHeader() {
        this.#replicateIssuerAsHeader = true;
        return this;
    }
    replicateSubjectAsHeader() {
        this.#replicateSubjectAsHeader = true;
        return this;
    }
    replicateAudienceAsHeader() {
        this.#replicateAudienceAsHeader = true;
        return this;
    }
    async encrypt(key, options) {
        const plaintext = jwtData(this);
        if (this.#protectedHeader &&
            (this.#replicateIssuerAsHeader ||
                this.#replicateSubjectAsHeader ||
                this.#replicateAudienceAsHeader)) {
            this.#protectedHeader = {
                ...this.#protectedHeader,
                iss: this.#replicateIssuerAsHeader ? jwtClaim(this, 'iss') : undefined,
                sub: this.#replicateSubjectAsHeader ? jwtClaim(this, 'sub') : undefined,
                aud: this.#replicateAudienceAsHeader ? jwtClaim(this, 'aud') : undefined,
            };
        }
        const jwe = await createJWE([
            plaintext,
            this.#protectedHeader,
            undefined,
            undefined,
            undefined,
            this.#cek,
            this.#iv,
            this.#keyManagementParameters,
            undefined,
            false,
        ], key, options);
        return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.');
    }
}
