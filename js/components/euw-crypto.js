/**
 * EUW 浏览器端加解密模块
 * 与 crypto.ts 的 AES-256-GCM 实现完全兼容
 * 使用 Web Crypto API
 */

const ALGORITHM = 'aes-256-gcm';
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;          // 位
const SALT_LENGTH = 16;          // 字节
const IV_LENGTH = 12;            // 字节
const AUTH_TAG_LENGTH = 16;      // 字节

/**
 * Base64 字符串 → ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * ArrayBuffer → Base64 字符串
 */
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * 从密码派生 AES-GCM 密钥
 */
async function deriveKeyFromPassword(password, saltBuffer) {
    const passwordKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256'
        },
        passwordKey,
        {
            name: 'AES-GCM',
            length: KEY_LENGTH
        },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * 加密明文，返回与 crypto.ts 相同格式的 JSON 字符串
 * @param {string} plaintext - 待加密的 EUW 明文
 * @param {string} password - 密码
 * @returns {Promise<string>} 加密后的 JSON 字符串
 */
export async function encrypt(plaintext, password) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const key = await deriveKeyFromPassword(password, salt);

    const encodedPlaintext = new TextEncoder().encode(plaintext);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
            tagLength: AUTH_TAG_LENGTH * 8
        },
        key,
        encodedPlaintext
    );

    const payload = {
        encrypted: true,
        algorithm: ALGORITHM,
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        data: arrayBufferToBase64(encrypted)
    };

    return JSON.stringify(payload, null, 2);
}

/**
 * 解密 JSON 格式的加密内容，返回明文
 * @param {string} encryptedJson - 加密的 JSON 字符串
 * @param {string} password - 密码
 * @returns {Promise<string>} 解密后的明文
 */
export async function decrypt(encryptedJson, password) {
    let payload;
    try {
        payload = JSON.parse(encryptedJson);
    } catch {
        throw new Error('无效的加密文件格式');
    }

    if (!payload.encrypted || payload.algorithm !== ALGORITHM) {
        throw new Error('文件不是 EUW 加密格式');
    }

    const saltBuffer = base64ToArrayBuffer(payload.salt);
    const ivBuffer = base64ToArrayBuffer(payload.iv);
    const combinedBuffer = base64ToArrayBuffer(payload.data); // ciphertext + authTag

    const key = await deriveKeyFromPassword(password, saltBuffer);

    try {
        const plaintextBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: ivBuffer,
                tagLength: AUTH_TAG_LENGTH * 8
            },
            key,
            combinedBuffer
        );

        return new TextDecoder().decode(plaintextBuffer);
    } catch (e) {
        throw new Error('密码错误或数据已损坏');
    }
}

/**
 * 检测内容是否为加密格式
 */
export function isEncryptedContent(content) {
    try {
        const obj = JSON.parse(content);
        return obj && obj.encrypted === true && obj.algorithm === ALGORITHM;
    } catch {
        return false;
    }
}

// 常量导出（如有需要）
export const CONSTANTS = {
    ALGORITHM,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    SALT_LENGTH,
    IV_LENGTH,
    AUTH_TAG_LENGTH
};