import React, { useEffect, useState } from "react";

import { Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import PolarisText from "@/components/PolarisText";

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

const CARD_WIDTH = 420;
const CARD_HEIGHT = 640;

const detailsCache = new Map<string, MediaDetails>();

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

  if (month >= 1 && month <= 12) {
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
  const isSeries = !!name && !title;

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
      ?.slice(0, 2)
      .map((genre) => genre.name)
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
      {/* OUTER CARD */}

      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 24,
          overflow: "hidden",

          backgroundColor: "#3A3A3C",

          borderWidth: 1,
          borderColor:
            "rgba(255,255,255,0.22)",

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 14,
          },
          shadowOpacity: 0.45,
          shadowRadius: 22,
          elevation: 14,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 58,

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            paddingHorizontal: 17,

            zIndex: 10,
          }}
        >
          {/* TITLE */}

          <View
            style={{
              maxWidth: 235,
              minHeight: 32,

              paddingHorizontal: 15,

              borderRadius: 16,

              justifyContent: "center",

              backgroundColor:
                "rgba(11,15,20,0.88)",

              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.08)",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <PolarisText
              weight="medium"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: "#F4F7FA",
                fontSize: 12,
              }}
            >
              {mediaTitle}
            </PolarisText>
          </View>

          {/* YEAR */}

          <View
            style={{
              minWidth: 52,
              height: 32,

              paddingHorizontal: 12,

              borderRadius: 16,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                "rgba(11,15,20,0.88)",

              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.08)",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <PolarisText
              weight="medium"
              style={{
                color: "#F4F7FA",
                fontSize: 11,
              }}
            >
              {formattedDate}
            </PolarisText>
          </View>
        </View>

        {/* POSTER */}

        <View
          style={{
            position: "absolute",

            left: 10,
            right: 10,

            top: 58,
            bottom: 10,

            borderRadius: 20,

            overflow: "hidden",

            backgroundColor: "#11151B",
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

          {/* BOTTOM GRADIENT */}

          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.04)",
              "rgba(0,0,0,0.18)",
              "rgba(0,0,0,0.48)",
              "rgba(0,0,0,0.72)",
            ]}
            locations={[
              0,
              0.48,
              0.68,
              0.84,
              1,
            ]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 170,
            }}
          />

          {/* RUNTIME / SERIES STATS */}

          <View
            style={{
              position: "absolute",
              left: 10,
              bottom: 50,

              minHeight: 30,

              paddingHorizontal: 13,

              borderRadius: 15,

              justifyContent: "center",

              backgroundColor:
                "rgba(9,11,15,0.82)",

              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.10)",
            }}
          >
            <PolarisText
              weight="medium"
              numberOfLines={1}
              style={{
                color: "#FFFFFF",
                fontSize: 11,
              }}
            >
              {isSeries
                ? seriesStats
                : runtime}
            </PolarisText>
          </View>

          {/* GENRES */}

          <View
            style={{
              position: "absolute",
              left: 10,
              bottom: 10,

              maxWidth: 200,

              minHeight: 30,

              paddingHorizontal: 13,

              borderRadius: 15,

              justifyContent: "center",

              backgroundColor:
                "rgba(9,11,15,0.82)",

              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.10)",
            }}
          >
            <PolarisText
              weight="medium"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: "#FFFFFF",
                fontSize: 11,
              }}
            >
              {genres}
            </PolarisText>
          </View>

          {/* RATING */}

          <View
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,

              height: 30,

              paddingHorizontal: 12,

              borderRadius: 15,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                "rgba(9,11,15,0.82)",

              borderWidth: 1,
              borderColor:
                "rgba(255,255,255,0.10)",
            }}
          >
            <PolarisText
              weight="semiBold"
              style={{
                color: "#FFFFFF",
                fontSize: 11,
              }}
            >
              ★ {formattedRating}
            </PolarisText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovieCard;