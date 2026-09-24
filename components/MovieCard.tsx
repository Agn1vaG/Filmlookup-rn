import React, { useEffect, useState } from "react";

import { Image, Text, View } from "react-native";

import { fetchMovieDetails } from "@/services/api";

type MovieCardProps = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

/*
|--------------------------------------------------------------------------
| CARD SIZE
|--------------------------------------------------------------------------
*/

const CARD_WIDTH = 390;
const CARD_HEIGHT = 630;

/*
|--------------------------------------------------------------------------
| MOVIE DETAILS CACHE
|--------------------------------------------------------------------------
*/

type MovieDetailsData = {
  runtime?: number | null;
  genres?: {
    id: number;
    name: string;
  }[];
  vote_average?: number;
};

const movieDetailsCache = new Map<number, MovieDetailsData>();

/*
|--------------------------------------------------------------------------
| FORMAT RUNTIME
|--------------------------------------------------------------------------
*/

const formatRuntime = (runtime?: number | null) => {
  if (!runtime || runtime <= 0) {
    return "—";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const MovieCard = ({
  id,
  poster_path,
  vote_average,
}: MovieCardProps) => {
  const [details, setDetails] = useState<MovieDetailsData | null>(
    movieDetailsCache.get(id) ?? null
  );

  const posterUri = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://placehold.co/600x900/1a1a1a/ffffff.png";

  /*
  |--------------------------------------------------------------------------
  | FETCH MOVIE DETAILS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    const cachedDetails = movieDetailsCache.get(id);

    if (cachedDetails) {
      setDetails(cachedDetails);
      return;
    }

    const loadDetails = async () => {
      try {
        const data = await fetchMovieDetails(id.toString());

        if (!isMounted) {
          return;
        }

        const movieDetails: MovieDetailsData = {
          runtime: data.runtime,
          genres: data.genres,
          vote_average: data.vote_average,
        };

        movieDetailsCache.set(id, movieDetails);

        setDetails(movieDetails);
      } catch (error) {
        console.log(
          `Failed to load details for movie ${id}:`,
          error
        );
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | DYNAMIC METADATA
  |--------------------------------------------------------------------------
  */

  const runtime = formatRuntime(details?.runtime);

  const genres =
    details?.genres
      ?.slice(0, 3)
      .map((genre) => genre.name)
      .join(" • ") || "—";

  const rating =
    details?.vote_average ?? vote_average ?? 0;

  const formattedRating =
    rating > 0 ? rating.toFixed(1) : "—";

  /*
  |--------------------------------------------------------------------------
  | CARD
  |--------------------------------------------------------------------------
  */

  return (
    <View
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#0A1119",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 14,
          },
          shadowOpacity: 0.45,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        {/* POSTER */}

        <Image
          source={{ uri: posterUri }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {/* RUNTIME */}

        <View
          style={{
            position: "absolute",
            left: 16,
            bottom: 54,
            height: 34,
            paddingHorizontal: 15,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor: "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.16)",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {runtime}
          </Text>
        </View>

        {/* GENRES — MAX 3 */}

        <View
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            maxWidth: 250,
            height: 34,
            paddingHorizontal: 15,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor: "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.16)",
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {genres}
          </Text>
        </View>

        {/* RATING */}

        <View
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            height: 34,
            paddingHorizontal: 14,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor: "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.16)",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            ★ {formattedRating}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MovieCard;