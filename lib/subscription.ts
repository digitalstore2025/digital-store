import { cookies } from "next/headers";

export async function hasActiveAccess() {
  const cookieStore = await cookies();
  const value = cookieStore.get("paid_user")?.value;
  return value === "true";
}
