/**
 * Marca de que ya se vio la presentación de la aplicación.
 *
 * Vive en LocalStorage y no en las claves de datos del usuario porque no es
 * suyo: es una preferencia del dispositivo. Tampoco se borra con "borrar mis
 * datos", que si no volvería a aparecer la presentación a alguien que ya
 * conoce la app.
 */
export const PRESENTATION_SEEN = "fitcore:presentacion-vista";

export function presentationSeen(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(PRESENTATION_SEEN) === "1";
}
