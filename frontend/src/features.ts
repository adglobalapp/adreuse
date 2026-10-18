// Build-időben állítható kapcsolók (a frontend .env-jében vagy a build környezeti változóiban).

/** Új fiókok regisztrációja. A backend REGISTRATION_ENABLED kapcsolójával együtt kell állítani. */
export const registrationEnabled = import.meta.env.VITE_REGISTRATION_ENABLED === 'true';
