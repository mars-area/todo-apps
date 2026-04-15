type ConfigProps = {
  appName: string;
  apiUrl: string;
  apiVersion: string;
  apiBearer: string;
  encryptionKey: CryptoJS.lib.WordArray;
  encryptionIV: CryptoJS.lib.WordArray;
  saltPassword: string;
};

export const CONFIG: ConfigProps = {
  appName: import.meta.env.VITE_APP_APP_NAME || "[project-name]",
  apiUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:8080",
  apiVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  apiBearer: import.meta.env.VITE_APP_API_BEARER || "token",
  encryptionKey: import.meta.env.VITE_APP_ENCRYPTION_KEY || "key",
  encryptionIV: import.meta.env.VITE_APP_ENCRYPTION_IV || "iv",
  saltPassword: import.meta.env.VITE_APP_SALT_PASSWORD || "salt",
};

export default CONFIG;
