// lib/vault-encryption.ts

const ENC_ALGO = "AES-GCM";
const KEY_ALGO = "PBKDF2";
const KEY_LENGTH = 256;
const ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

// ---- Salt ----

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// ---- Key Derivation ----

export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin).buffer as ArrayBuffer,
    KEY_ALGO,
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: KEY_ALGO,
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ENC_ALGO, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

// ---- Encrypt / Decrypt ----

export async function encryptFile(data: ArrayBuffer, key: CryptoKey): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    { name: ENC_ALGO, iv },
    key,
    data
  );
  // Prepend IV to the encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result.buffer;
}

export async function decryptFile(
  encryptedData: ArrayBuffer,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const data = new Uint8Array(encryptedData);
  const iv = data.slice(0, IV_LENGTH);
  const ciphertext = data.slice(IV_LENGTH);
  return crypto.subtle.decrypt({ name: ENC_ALGO, iv }, key, ciphertext);
}

// ---- PIN Hashing (for verification only, not key derivation) ----

export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = generateSalt();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin).buffer as ArrayBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const saltB64 = btoa(String.fromCharCode(...salt));
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return `${saltB64}:${hashB64}`;
}

export async function verifyPin(
  pin: string,
  storedHash: string
): Promise<boolean> {
  const [saltB64, hashB64] = storedHash.split(":");
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin).buffer as ArrayBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const newHashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return newHashB64 === hashB64;
}
