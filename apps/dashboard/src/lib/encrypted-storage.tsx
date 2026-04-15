import type { PersistStorage } from "zustand/middleware";

import { decrypt, encrypt, parser } from "./helpers";

export const encryptedPersistStorage: PersistStorage<unknown> = {
  getItem(key: string) {
    const value = localStorage.getItem(key);

    if (!value) return;
    const decryptedValue = decrypt(value);

    if (!decryptedValue) return;
    const data = parser(decryptedValue);

    return data;
  },
  setItem(key: string, value: unknown): void {
    const encrypted = encrypt(JSON.stringify(value)) || "";
    localStorage.setItem(key, encrypted);
  },
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
};
