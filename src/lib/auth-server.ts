import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, DEMO_EMAIL } from "@/lib/auth";

const DEMO_USER = {
  id: "demo-user-1",
  name: "Ahmed Al-Rashid",
  email: DEMO_EMAIL,
  avatar: "/avatars/demo.png",
};

export function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (token !== "1") return null;
  return DEMO_USER;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
