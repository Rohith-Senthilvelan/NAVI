export const DEMO_EMAIL = "user@navi.demo";
export const DEMO_PASSWORD = "Demo123!@#";
export const AUTH_COOKIE_NAME = "navi_auth";

export function validateCredentials(email: string, password: string): boolean {
  return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function setAuthCookie(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=86400`;
  }
}

export function clearAuthCookie(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
  }
}
