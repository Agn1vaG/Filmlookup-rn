import { logout } from "@/services/auth";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../_layout";

export default function Profile() {
  const user = useContext(UserContext);
  const router = useRouter();

  const out = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View className="bg-primary flex-1 items-center justify-center px-8">

      <View className="w-32 h-32 rounded-full overflow-hidden bg-white/10 mb-6">
        <Image
          source={{ uri: user?.prefs?.avatar ?? "https://placehold.co/200" }}
          className="w-full h-full"
        />
      </View>

      <Text className="text-white text-2xl font-bold">{user.name}</Text>
      <Text className="text-light-200 text-sm mt-1 mb-6">{user.email}</Text>

      <TouchableOpacity
        className="bg-accent px-8 py-3 rounded-2xl mb-10"
        onPress={out}
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
