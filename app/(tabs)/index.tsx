import PolarisMovieStack from "@/components/PolarisMovieStack";
import PolarisBackground from "@/components/PolarisBackground";
import PolarisScreen from "@/components/PolarisScreen";

import { fetchMovies, fetchSeries } from "@/services/api";
import useFetch from "@/services/useFetch";

import { BlurView } from "expo-blur";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import { useState } from "react";

type HomeMode = "movies" | "series";

export default function Index() {
  const [mode, setMode] =
    useState<HomeMode>("movies");

  const [backgroundPoster, setBackgroundPoster] =
    useState<string | null>(null);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  const {
    data: series,
    loading: seriesLoading,
    error: seriesError,
  } = useFetch(() => fetchSeries());

  const listData =
    mode === "movies"
      ? Array.isArray(movies)
        ? movies
        : []
      : Array.isArray(series)
        ? series
        : [];

  /* TEMPORARY DEBUG LOGS */

  console.log("POLARIS MODE:", mode);
  console.log("MOVIES:", movies?.length);
  console.log("SERIES:", series?.length);
  console.log("LIST DATA:", listData.length);
  console.log("FIRST ITEM:", listData[0]);

  const loading =
    mode === "movies"
      ? moviesLoading
      : seriesLoading;

  const error =
    mode === "movies"
      ? moviesError
      : seriesError;

  if (loading) {
    return (
      <PolarisBackground
        variant="home"
        posterPath={backgroundPoster}
      >
        <PolarisScreen>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color="#F4F7FA"
            />
          </View>
        </PolarisScreen>
      </PolarisBackground>
    );
  }

  if (error || listData.length === 0) {
    return (
      <PolarisBackground
        variant="home"
        posterPath={
          backgroundPoster ??
          listData[0]?.poster_path ??
          null
        }
      >
        <PolarisScreen>
          <View className="flex-1 items-center justify-center px-6">
            <Text
              style={{
                color: "#F4F7FA",
                textAlign: "center",
              }}
            >
              Error:{" "}
              {error?.message ??
                `No ${
                  mode === "movies"
                    ? "movies"
                    : "series"
                } found`}
            </Text>
          </View>
        </PolarisScreen>
      </PolarisBackground>
    );
  }

  return (
    <PolarisBackground
      variant="home"
      posterPath={backgroundPoster}
    >
      <PolarisScreen>

        {/* Movies / Series selector */}

        <View
          style={{
            alignItems: "center",
            paddingTop: 8,
            zIndex: 100,
            elevation: 100,
          }}
        >
          <View
            style={{
              width: 170,
              height: 40,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor:
                "rgba(220, 235, 255, 0.10)",
              backgroundColor:
                "rgba(5, 10, 17, 0.72)",
            }}
          >
            <BlurView
              pointerEvents="none"
              intensity={20}
              tint="dark"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Pressable
                onPress={() => setMode("movies")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mode === "movies" && (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 20,
                      backgroundColor:
                        "rgba(220, 235, 255, 0.065)",
                      borderWidth: 1,
                      borderColor:
                        "rgba(220, 235, 255, 0.12)",
                    }}
                  />
                )}

                <Text
                  style={{
                    color:
                      mode === "movies"
                        ? "#F4F7FA"
                        : "#7E8997",
                    fontSize: 12,
                    fontWeight:
                      mode === "movies"
                        ? "500"
                        : "400",
                  }}
                >
                  Movies
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setMode("series")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mode === "series" && (
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 20,
                      backgroundColor:
                        "rgba(220, 235, 255, 0.065)",
                      borderWidth: 1,
                      borderColor:
                        "rgba(220, 235, 255, 0.12)",
                    }}
                  />
                )}

                <Text
                  style={{
                    color:
                      mode === "series"
                        ? "#F4F7FA"
                        : "#7E8997",
                    fontSize: 12,
                    fontWeight:
                      mode === "series"
                        ? "500"
                        : "400",
                  }}
                >
                  Series
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Movie / Series Stack */}

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateY: -40 }],
          }}
        >
          <PolarisMovieStack
            movies={listData}
            onCurrentMovieChange={(movie) => {
              setBackgroundPoster(
                movie?.poster_path ?? null
              );
            }}
          />
        </View>

      </PolarisScreen>
    </PolarisBackground>
  );
}