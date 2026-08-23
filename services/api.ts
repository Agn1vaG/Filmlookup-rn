export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};


export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
};
export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try{
      const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );
    if(!response.ok) throw new Error(`Failed to fetch movie details: ${response.status}`);

    const data = await response.json();
    return data;
  }catch(error){
    console.log("Error fetching movie details:", error);
    throw error;
  }
}

export const fetchSimilarMovies = async (movieId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_CONFIG.API_KEY}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch similar movies");

  return await response.json(); // returns { page, results, total_pages, ... }
};

//   const data = await response.json();
// console.log("Fetched movie sample:", data.results?.[0]); // ADD THIS
// return data.results || [];
// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
