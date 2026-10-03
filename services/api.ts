export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",

  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

/*
|--------------------------------------------------------------------------
| SHARED TYPES
|--------------------------------------------------------------------------
*/

export type MediaGenre = {
  id: number;
  name: string;
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
};

export type TrailerVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
  display_priority?: number;
};

export type WatchProviderRegion = {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
};

export type WatchProviders = {
  results?: {
    IN?: WatchProviderRegion;
    US?: WatchProviderRegion;
    [country: string]: WatchProviderRegion | undefined;
  };
};

export type MediaDetails = {
  id: number;

  title?: string;
  name?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  vote_average?: number;
  vote_count?: number;

  /*
  |--------------------------------------------------------------------------
  | MOVIES
  |--------------------------------------------------------------------------
  */

  release_date?: string;
  runtime?: number | null;

  /*
  |--------------------------------------------------------------------------
  | TV SERIES
  |--------------------------------------------------------------------------
  */

  first_air_date?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;

  /*
  |--------------------------------------------------------------------------
  | COMMON
  |--------------------------------------------------------------------------
  */

  genres?: MediaGenre[];

  overview?: string;

  /*
  |--------------------------------------------------------------------------
  | APPENDED TMDB DATA
  |--------------------------------------------------------------------------
  */

  credits?: {
    cast?: CastMember[];
  };

  videos?: {
    results?: TrailerVideo[];
  };

  "watch/providers"?: WatchProviders;

  /*
  |--------------------------------------------------------------------------
  | MOVIE CERTIFICATION
  |--------------------------------------------------------------------------
  */

  release_dates?: {
    results?: {
      iso_3166_1: string;
      release_dates?: {
        certification?: string;
        iso_639_1?: string;
        release_date?: string;
        type?: number;
      }[];
    }[];
  };

  /*
  |--------------------------------------------------------------------------
  | TV CERTIFICATION
  |--------------------------------------------------------------------------
  */

  content_ratings?: {
    results?: {
      iso_3166_1: string;
      rating: string;
    }[];
  };
};

export type SimilarMedia = {
  id: number;

  title?: string;
  name?: string;

  poster_path?: string | null;
  backdrop_path?: string | null;

  vote_average?: number;

  release_date?: string;
  first_air_date?: string;
};

export type SimilarMediaResponse = {
  page: number;
  results: SimilarMedia[];
  total_pages: number;
  total_results: number;
};

/*
|--------------------------------------------------------------------------
| MOVIES
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| TV SERIES
|--------------------------------------------------------------------------
|
| Supports both:
|
| fetchSeries()
| → popular TV series
|
| fetchSeries({ query: "Breaking Bad" })
| → searched TV series
|
*/

export const fetchSeries = async ({
  query = "",
}: {
  query?: string;
} = {}) => {
  const endpoint = query.trim()
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(
        query.trim()
      )}`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc`;

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

/*
|--------------------------------------------------------------------------
| FULL MOVIE / TV DETAILS
|--------------------------------------------------------------------------
|
| One request gives us:
|
| - Main details
| - Cast
| - Videos / trailers
| - Watch providers
| - Certification data
|
*/

export const fetchMediaDetailsFull = async (
  mediaType: "movie" | "tv",
  mediaId: string
): Promise<MediaDetails> => {
  try {
    const append =
      mediaType === "movie"
        ? "credits,videos,watch/providers,release_dates"
        : "credits,videos,watch/providers,content_ratings";

    const endpoint =
      `${TMDB_CONFIG.BASE_URL}/${mediaType}/${mediaId}` +
      `?append_to_response=${append}`;

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
      `Error fetching full ${mediaType} details:`,
      error
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| BASIC MEDIA DETAILS
|--------------------------------------------------------------------------
|
| Keep these functions because MovieCard and other
| existing parts of the app already use them.
|
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

/*
|--------------------------------------------------------------------------
| MOVIE DETAILS
|--------------------------------------------------------------------------
*/

export const fetchMovieDetails = async (
  movieId: string
): Promise<MediaDetails> => {
  return fetchMediaDetails(
    "movie",
    movieId
  );
};

/*
|--------------------------------------------------------------------------
| TV DETAILS
|--------------------------------------------------------------------------
*/

export const fetchSeriesDetails = async (
  seriesId: string
): Promise<MediaDetails> => {
  return fetchMediaDetails(
    "tv",
    seriesId
  );
};

/*
|--------------------------------------------------------------------------
| SIMILAR MOVIES
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| SIMILAR MEDIA
|--------------------------------------------------------------------------
|
| Works for both:
|
| movie → /movie/{id}/similar
| tv    → /tv/{id}/similar
|
*/

export const fetchSimilarMedia = async (
  mediaType: "movie" | "tv",
  mediaId: string
): Promise<SimilarMediaResponse> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/${mediaType}/${mediaId}/similar`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch similar ${mediaType}`
    );
  }

  return await response.json();
};

/*
|--------------------------------------------------------------------------
| TRAILER HELPER
|--------------------------------------------------------------------------
*/

export const getOfficialTrailer = (
  videos?: TrailerVideo[]
): TrailerVideo | null => {
  if (!videos || videos.length === 0) {
    return null;
  }

  const youtubeVideos = videos.filter(
    (video) =>
      video.site === "YouTube"
  );

  const officialTrailer =
    youtubeVideos.find(
      (video) =>
        video.type === "Trailer" &&
        video.official === true
    );

  if (officialTrailer) {
    return officialTrailer;
  }

  const trailer =
    youtubeVideos.find(
      (video) =>
        video.type === "Trailer"
    );

  return trailer ?? null;
};

/*
|--------------------------------------------------------------------------
| INDIA WATCH PROVIDERS
|--------------------------------------------------------------------------
*/

export const getIndiaWatchProviders = (
  watchProviders?: WatchProviders
): WatchProvider[] => {
  const india =
    watchProviders?.results?.IN;

  if (!india) {
    return [];
  }

  return [
    ...(india.flatrate ?? []),
    ...(india.rent ?? []),
    ...(india.buy ?? []),
  ];
};