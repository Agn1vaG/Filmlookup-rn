import { ID } from "appwrite";
import { account } from "@/services/appwriteClient";

export { account };

export async function getSessionUser() {
  try {
    return await account.get();
  } catch {
    const anon = await account.createAnonymousSession();
    return anon;
  }
}

export async function login(email: string, password: string) {
  await account.createSession(email, password)
;
  return await account.get();
}

export async function signup(email: string, password: string, username: string) {
  await account.create(ID.unique(), email, password, username);
  await account.createSession(email, password)
;
  return await account.get();
}

export async function logout() {
  try {
    await account.deleteSessions();
  } catch {}
}
