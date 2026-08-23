import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { listSavedMovies } from "@/services/saved";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../_layout";

export default function SaveScreen() {
  const user = useContext(UserContext);
  const userId = user?.$id;

  const [savedList, setSavedList] = useState<any[]>([]);

  const loadSaved = async () => {
    if (!userId) return;

    const ids = await listSavedMovies(userId);

    const movies = await Promise.all(
      ids.map((mid: string) => fetchMovieDetails(mid))
    );

    setSavedList(movies);
  };

  useEffect(() => {
    loadSaved();
  }, [userId]);

  if (!savedList.length) {
    return (
      <View className="bg-primary flex-1 items-center justify-center px-6">
        <Image source={icons.save} className="w-20 h-20 opacity-60 mb-4" />
        <Text className="text-white text-xl font-semibold mb-2">
          Nothing Saved Yet
        </Text>
        <Text className="text-light-200 text-center text-base leading-6 px-8">
          Save movies to find them here later.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-primary flex-1 px-6 py-10">
      <Text className="text-white text-3xl font-bold text-center mt-10 mb-8">
        Saved Movies
      </Text>

      <View className="w-full bg-white/10 rounded-3xl p-4 pb-10">
        <FlatList
          data={savedList}
          scrollEnabled={false}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 14,
            marginBottom: 18,
          }}
          renderItem={({ item }) => (
            <Link href={`/movies/${item.id}`} asChild>
              <TouchableOpacity className="w-[30%]">
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  className="w-full h-40 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <Text className="text-white text-xs font-semibold" numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
