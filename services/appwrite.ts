import { Client, TablesDB, ID, Query } from "appwrite";

// Environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new TablesDB(client);

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
  [key: string]: any;
};

// Search Metrics Update
export const updateSearchCount = async (
  query: string,
  movie: Movie
) => {
  try {
    // Check if this search term already exists
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [
        Query.equal("searchTerm", query),
        Query.limit(1),
      ],
    });

    if (result.rows.length > 0) {
      // Update existing row
      const existing = result.rows[0];

      await database.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: existing.$id,
        data: {
          count: (existing.count ?? 0) + 1,
        },
      });

      return;
    }

    // Create new row
    await database.createRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: ID.unique(),
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
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [
        Query.orderDesc("count"),
        Query.limit(5),
      ],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error loading trending:", error);
    return undefined;
  }
};