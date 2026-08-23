import { Account, Client, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);

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
