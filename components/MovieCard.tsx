import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type MovieCardProps = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

const MovieCard = ({
  id,
  poster_path,
  title,
  name,
  vote_average = 0,
  release_date,
  first_air_date,
}: MovieCardProps) => {
  const displayTitle = title || name || "Untitled";
  const date = release_date || first_air_date || "N/A";

  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: { id: id.toString() },
      }}
      asChild
    >
      <TouchableOpacity className="w-[30%] mb-4">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        {/* Movie title */}
        <Text className="text-white font-bold mt-2 text-sm" numberOfLines={1}>
          {displayTitle}
        </Text>

        {/* Rating + Release Year (same line) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // star+rating left, year right
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Image source={icons.star} className="w-4 h-4" resizeMode="contain" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>

          <Text style={{ color: "#ccc", fontSize: 12, fontWeight: "500" }}>
            {date !== "N/A" ? date.split("-")[0] : "N/A"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
