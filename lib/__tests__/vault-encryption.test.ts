import { describe, it, expect, beforeAll } from "vitest";
import {
  deriveKey,
  encryptFile,
  decryptFile,
  hashPin,
  verifyPin,
  generateSalt,
} from "../vault-encryption";

const TEST_PIN = "123456";

describe("vault-encryption", () => {
  let salt: Uint8Array;
  let key: CryptoKey;

  beforeAll(async () => {
    salt = generateSalt();
    key = await deriveKey(TEST_PIN, salt);
  });

  describe("generateSalt", () => {
    it("returns 16 bytes", () => {
      expect(salt).toHaveLength(16);
    });

    it("generates unique salts", () => {
      const salt2 = generateSalt();
      expect(Buffer.from(salt).equals(Buffer.from(salt2))).toBe(false);
    });
  });

  describe("deriveKey", () => {
    it("returns a CryptoKey", async () => {
      expect(key).toBeDefined();
      expect(key.type).toBe("secret");
    });

    it("produces the same key from the same PIN and salt", async () => {
      const key2 = await deriveKey(TEST_PIN, salt);
      const data = new Uint8Array([1, 2, 3, 4]);
      const encrypted = await encryptFile(data.buffer as ArrayBuffer, key);
      const decrypted = await decryptFile(encrypted, key2);
      expect(new Uint8Array(decrypted)).toEqual(data);
    });

    it("produces a different key from a different PIN", async () => {
      const key2 = await deriveKey("654321", salt);
      const data = new Uint8Array([1, 2, 3, 4]);
      const encrypted = await encryptFile(data.buffer as ArrayBuffer, key);
      await expect(decryptFile(encrypted, key2)).rejects.toThrow();
    });
  });

  describe("encryptFile / decryptFile round-trip", () => {
    it("encrypts and decrypts a string", async () => {
      const original = "Hello, AmanAkses!";
      const data = new TextEncoder().encode(original).buffer as ArrayBuffer;
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(new TextDecoder().decode(decrypted)).toBe(original);
    });

    it("encrypts and decrypts binary data", async () => {
      const original = new Uint8Array(1000);
      crypto.getRandomValues(original);
      const encrypted = await encryptFile(original.buffer as ArrayBuffer, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(new Uint8Array(decrypted)).toEqual(original);
    });

    it("encrypted data is different from original", async () => {
      const data = new TextEncoder().encode("test").buffer as ArrayBuffer;
      const encrypted = await encryptFile(data, key);
      expect(new Uint8Array(encrypted)).not.toEqual(new Uint8Array(data));
    });
  });

  describe("hashPin / verifyPin", () => {
    it("verifies a correct PIN", async () => {
      const hash = await hashPin(TEST_PIN);
      const result = await verifyPin(TEST_PIN, hash);
      expect(result).toBe(true);
    });

    it("rejects an incorrect PIN", async () => {
      const hash = await hashPin(TEST_PIN);
      const result = await verifyPin("000000", hash);
      expect(result).toBe(false);
    });
  });
});
