/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A Laravel API címe élesben, pl. https://api.adreuse.hu. Fejlesztéskor üres (Vite proxy). */
  readonly VITE_API_URL?: string;
  /** 'true' esetén lehet regisztrálni; alapból ki van kapcsolva. */
  readonly VITE_REGISTRATION_ENABLED?: string;
}
