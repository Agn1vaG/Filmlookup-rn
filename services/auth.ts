import { AppwriteException, ID } from "appwrite";
import type { Models } from "appwrite";
import { account } from "@/services/appwriteClient";

export { account };

export type SessionUser = Models.User;

const UNAUTHENTICATED_TYPES = new Set([
  "general_unauthorized_scope",
  "user_session_missing",
  "user_session_expired",
]);

function isUnauthenticatedError(error: unknown): boolean {
  if (!(error instanceof AppwriteException)) return false;

  return error.code === 401 || UNAUTHENTICATED_TYPES.has(error.type);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    return await account.get();
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
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
