import { Client, Databases, ID, Query } from "appwrite";

// env vars
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

// Types
type Movie = {
  id: number;
  title?: string;
  poster_path?: string | null;
  vote_average?: number;
};

type TrendingMovie = {
  $id: string;
  searchTerm: string;
  movie_id: number;
  title: string;
  poster_url: string;
  count: number;
  [key: string]: any; // allow Appwrite system fields
};


// Search Metrics Update
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // Check existing record
    const result = await database.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      queries: [Query.equal("searchTerm", query), Query.limit(1)],
    });

    if (result.documents.length > 0) {
      // Update count if found
      const existing = result.documents[0];

      await database.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        documentId: existing.$id,
        data: {
          count: (existing.count ?? 0) + 1,
        },
      });

      return;
    }

    // Create new document
    await database.createDocument({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      documentId: ID.unique(),
      data: {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title ?? "",
        count: 1,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
      },
    });
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// Trending Movies
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      queries: [Query.orderDesc("count"), Query.limit(5)],
    });

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error loading trending:", error);
    return undefined;
  }
};
