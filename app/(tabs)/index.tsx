import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  const listData = Array.isArray(movies) ? movies : [];

  if (moviesLoading || trendingLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (moviesError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white">
          Error: {moviesError?.message ?? trendingError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#070715" }}>
      <Image
        source={images.bg}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            poster_path={item.poster_path}
            title={item.title}
            vote_average={item.vote_average}
            release_date={item.release_date}
          />
        )}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          marginBottom: 10,
        }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          paddingTop: 10,
        }}
        ListHeaderComponent={
          <View className="mb-6">
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 45,
                marginBottom: 30,
              }}
            >
              <Image
                source={icons.logo}
                style={{ width: 48, height: 40 }}
                resizeMode="contain"
              />
            </View>

            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
              <View className="mt-8">
                <Text className="text-white text-lg font-bold mb-3">
                  Trending Movies
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 26 }}
                >
                  {trendingMovies.map((item, index) => (
                    <TrendingCard
                      key={item.movie_id}
                      movie={item}
                      index={index}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <Text className="text-white text-lg font-bold mb-3 mt-8">
              Latest Movies
            </Text>
          </View>
        }
      />
    </View>
  );
}
