import PolarisMovieStack from "@/components/PolarisMovieStack";
import PolarisBackground from "@/components/PolarisBackground";
import PolarisScreen from "@/components/PolarisScreen";

import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";

import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  const {
    data: movies,
    loading,
    error,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  const listData = Array.isArray(movies) ? movies : [];

  if (loading) {
    return (
      <PolarisBackground variant="home">
        <PolarisScreen>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </PolarisScreen>
      </PolarisBackground>
    );
  }

  if (error || listData.length === 0) {
    return (
      <PolarisBackground variant="home">
        <PolarisScreen>
          <View className="flex-1 items-center justify-center">
            <Text className="text-white">
              Error: {error?.message ?? "No movies found"}
            </Text>
          </View>
        </PolarisScreen>
      </PolarisBackground>
    );
  }

  return (
    <PolarisBackground variant="home">
      <PolarisScreen>

        {/* Profile button */}
        <View className="items-end px-5 pt-1">
          <Pressable
            onPress={() => router.push("/profile")}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={34}
              color="#F4F7FA"
            />
          </Pressable>
        </View>

        {/* Polaris Movie Stack */}
        <View className="flex-1 items-center justify-center">
          <PolarisMovieStack movies={listData} />
        </View>

      </PolarisScreen>
    </PolarisBackground>
  );
}