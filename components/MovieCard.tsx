import React, { useEffect, useState } from "react";

import { Image, Text, View } from "react-native";

import {
  fetchMovieDetails,
  fetchSeriesDetails,
  MediaDetails,
} from "@/services/api";

type MovieCardProps = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

const CARD_WIDTH = 390;
const CARD_HEIGHT = 630;

const detailsCache = new Map<
  string,
  MediaDetails
>();

const formatRuntime = (
  runtime?: number | null
) => {
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

const formatSeriesStats = (
  seasons?: number,
  episodes?: number
) => {
  if (
    seasons === undefined ||
    episodes === undefined
  ) {
    return "—";
  }

  return `${seasons} Seasons • ${episodes} Episodes`;
};

const formatAirDate = (date?: string) => {
  if (!date) {
    return "—";
  }

  const parts = date.split("-");

  if (parts.length < 2) {
    return date;
  }

  const year = parts[0];
  const month = Number(parts[1]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (
    month >= 1 &&
    month <= 12
  ) {
    return `${months[month - 1]} ${year}`;
  }

  return year;
};

const MovieCard = ({
  id,
  poster_path,
  title,
  name,
  vote_average,
  release_date,
  first_air_date,
}: MovieCardProps) => {
  /*
  |--------------------------------------------------------------------------
  | DETECT MEDIA TYPE
  |--------------------------------------------------------------------------
  */

  const isSeries =
    !!name && !title;

  const mediaType = isSeries
    ? "tv"
    : "movie";

  const mediaTitle =
    name || title || "Untitled";

  const airDate = isSeries
    ? first_air_date
    : release_date;

  const cacheKey =
    `${mediaType}-${id}`;

  /*
  |--------------------------------------------------------------------------
  | DETAILS
  |--------------------------------------------------------------------------
  */

  const [details, setDetails] =
    useState<MediaDetails | null>(
      detailsCache.get(cacheKey) ?? null
    );

  useEffect(() => {
    let isMounted = true;

    const cachedDetails =
      detailsCache.get(cacheKey);

    if (cachedDetails) {
      setDetails(cachedDetails);
      return;
    }

    const loadDetails = async () => {
      try {
        const data = isSeries
          ? await fetchSeriesDetails(
              id.toString()
            )
          : await fetchMovieDetails(
              id.toString()
            );

        if (!isMounted) {
          return;
        }

        detailsCache.set(
          cacheKey,
          data
        );

        setDetails(data);
      } catch (error) {
        console.log(
          `Failed to load ${
            isSeries
              ? "series"
              : "movie"
          } details for ${id}:`,
          error
        );
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [id, cacheKey, isSeries]);

  /*
  |--------------------------------------------------------------------------
  | DISPLAY DATA
  |--------------------------------------------------------------------------
  */

  const runtime = formatRuntime(
    details?.runtime
  );

  const seriesStats =
    formatSeriesStats(
      details?.number_of_seasons,
      details?.number_of_episodes
    );

  const genres =
    details?.genres
      ?.slice(0, 3)
      .map(
        (genre) => genre.name
      )
      .join(" • ") || "—";

  const rating =
    details?.vote_average ??
    vote_average ??
    0;

  const formattedRating =
    rating > 0
      ? rating.toFixed(1)
      : "—";

  const formattedDate =
    formatAirDate(airDate);

  const posterUri = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://placehold.co/600x900/1a1a1a/ffffff.png";

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
        <Image
          source={{
            uri: posterUri,
          }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {/* TITLE */}

        <View
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            maxWidth: 280,
            paddingHorizontal: 15,
            minHeight: 34,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor:
              "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.16)",
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {mediaTitle}
          </Text>
        </View>

        {/* MOVIE RUNTIME / SERIES STATS */}

        <View
          style={{
            position: "absolute",
            left: 16,
            bottom: 54,
            maxWidth: 270,
            minHeight: 34,
            paddingHorizontal: 15,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor:
              "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.16)",
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
            {isSeries
              ? seriesStats
              : runtime}
          </Text>
        </View>

        {/* GENRES */}

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
            backgroundColor:
              "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.16)",
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
            backgroundColor:
              "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.16)",
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

        {/* AIR DATE */}

        <View
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            height: 34,
            paddingHorizontal: 14,
            borderRadius: 17,
            justifyContent: "center",
            backgroundColor:
              "rgba(8,8,12,0.62)",
            borderWidth: 1,
            borderColor:
              "rgba(255,255,255,0.16)",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {formattedDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MovieCard;