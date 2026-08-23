import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserContext } from "@/app/_layout";
import { icons } from "@/constants/icons";
import { fetchMovieDetails, fetchSimilarMovies } from "@/services/api";
import { isSaved, removeMovie, saveMovie } from "@/services/saved";
import useFetch from "@/services/useFetch";

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const user = useContext(UserContext);
  const userId = user?.$id;

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: rec } = useFetch(() =>
    fetchSimilarMovies(id as string)
  );

  const r = (rec as { results?: any[] }) ?? {};
  const similar = Array.isArray(r.results) ? r.results : [];

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) {
      setSaved(false);
      return;
    }
    isSaved(userId, id as string).then(setSaved).catch(() => setSaved(false));
  }, [id, userId]);

  const toggleSave = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      if (saved) {
        await removeMovie(userId, id as string);
        setSaved(false);
      } else {
        await saveMovie(userId, id as string);
        setSaved(true);
      }
    } catch (e) {
      console.error("Save toggle error:", e);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[850px]"
            resizeMode="cover"
          />

          <View className="absolute bottom-0 w-full">
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                paddingBottom: 50,
                paddingTop: 140,
                backgroundColor: "rgba(0,0,0,0.35)",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 32, fontWeight: "700" }}
                numberOfLines={1}
              >
                {movie?.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {movie?.release_date?.split("-")[0]}
                </Text>

                <Text style={{ color: "white", marginHorizontal: 6 }}>•</Text>

                <Text style={{ color: "white", fontSize: 16 }}>
                  {movie?.runtime}m
                </Text>

                <Text style={{ color: "white", marginHorizontal: 6 }}>•</Text>

                <Text style={{ color: "white", fontSize: 16 }}>
                  {Math.round(movie?.vote_average ?? 0)}/10
                </Text>
              </View>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            onPress={toggleSave}
            className="absolute bottom-5 right-5 rounded-full size-16 bg-white flex items-center justify-center"
            accessibilityLabel={saved ? "Unsave movie" : "Save movie"}
          >
            <Image
              source={icons.save}
              className="w-7 h-7"
              tintColor={saved ? "#a855f7" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-12 px-5">
          <Text className="text-white font-bold text-xl mt-6 mb-2">
            Overview
          </Text>
          <Text className="text-white text-base leading-6">
            {movie?.overview || "No overview available."}
          </Text>

          <Text className="text-white font-bold text-xl mt-8 mb-2">Genres</Text>
          <View className="flex-row flex-wrap gap-2">
            {movie?.genres?.map((g: any) => (
              <View key={g.id} className="px-3 py-1 rounded-full bg-white/10">
                <Text className="text-white text-sm">{g.name}</Text>
              </View>
            ))}
          </View>

          {similar.length > 0 && (
            <View className="mt-10">
              <Text className="text-white font-bold text-xl mb-4">
                Recommended
              </Text>

              <FlatList
                horizontal
                data={similar.slice(0, 12)}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="w-32"
                    onPress={() => router.push(`/movies/${item.id}`)}
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      className="w-32 h-48 rounded-xl mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      className="text-white text-sm font-semibold"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-4 flex-row items-center justify-center z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-2 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
