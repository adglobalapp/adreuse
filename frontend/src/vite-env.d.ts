/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A Laravel API címe élesben, pl. https://api.adreuse.hu. Fejlesztéskor üres (Vite proxy). */
  readonly VITE_API_URL?: string;
}
