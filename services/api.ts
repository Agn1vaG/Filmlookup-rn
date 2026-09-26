export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",

  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

/**
 * |--------------------------------------------------------------------------
 * | SHARED MEDIA TYPES
 * |--------------------------------------------------------------------------
 */

export type MediaGenre = {
  id: number;
  name: string;
};

export type MediaDetails = {
  id: number;

  title?: string;
  name?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  vote_average?: number;

  // Movies
  release_date?: string;
  runtime?: number | null;

  // TV Series
  first_air_date?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;

  genres?: MediaGenre[];

  overview?: string;
};

/**
 * |--------------------------------------------------------------------------
 * | MOVIES
 * |--------------------------------------------------------------------------
 */

export const fetchMovies = async ({
  query,
}: {
  query: string;
}) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movies: ${response.status}`
    );
  }

  const data = await response.json();

  return data.results || [];
};

/**
 * |--------------------------------------------------------------------------
 * | TV SERIES
 * |--------------------------------------------------------------------------
 */

export const fetchSeries = async () => {
  const endpoint =
    `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch series: ${response.status}`
    );
  }

  const data = await response.json();

  return data.results || [];
};

/**
 * |--------------------------------------------------------------------------
 * | SHARED MOVIE / TV DETAILS
 * |--------------------------------------------------------------------------
 */

export const fetchMediaDetails = async (
  mediaType: "movie" | "tv",
  mediaId: string
): Promise<MediaDetails> => {
  try {
    const endpoint =
      `${TMDB_CONFIG.BASE_URL}/${mediaType}/${mediaId}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${mediaType} details: ${response.status}`
      );
    }

    const data: MediaDetails =
      await response.json();

    return data;
  } catch (error) {
    console.log(
      `Error fetching ${mediaType} details:`,
      error
    );

    throw error;
  }
};

/**
 * |--------------------------------------------------------------------------
 * | MOVIE DETAILS
 * |--------------------------------------------------------------------------
 */

export const fetchMovieDetails = async (
  movieId: string
): Promise<MediaDetails> => {
  return fetchMediaDetails(
    "movie",
    movieId
  );
};

/**
 * |--------------------------------------------------------------------------
 * | TV DETAILS
 * |--------------------------------------------------------------------------
 */

export const fetchSeriesDetails = async (
  seriesId: string
): Promise<MediaDetails> => {
  return fetchMediaDetails(
    "tv",
    seriesId
  );
};

/**
 * |--------------------------------------------------------------------------
 * | SIMILAR MOVIES
 * |--------------------------------------------------------------------------
 */

export const fetchSimilarMovies = async (
  movieId: string
) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/similar`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch similar movies"
    );
  }

  return await response.json();
};