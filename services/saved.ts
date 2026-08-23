import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const db = new Databases(client);

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const SAVED = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

export async function isSaved(userId: string, movieId: string) {
  const res = await db.listDocuments(DB_ID, SAVED, [
    `equal("userId", "${userId}")`,
    `equal("movieId", "${movieId}")`,
  ]);
  return res.total > 0;
}

export async function saveMovie(userId: string, movieId: string) {
  return db.createDocument(DB_ID, SAVED, `${userId}-${movieId}`, {
    userId,
    movieId,
  });
}

export async function removeMovie(userId: string, movieId: string) {
  return db.deleteDocument(DB_ID, SAVED, `${userId}-${movieId}`);
}

export async function listSavedMovies(userId: string) {
  const res = await db.listDocuments(DB_ID, SAVED, [
    `equal("userId", "${userId}")`,
  ]);
  return res.documents.map((d) => d.movieId);
}
