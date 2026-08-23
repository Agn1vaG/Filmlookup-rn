import { login } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await login(email, password);
    router.replace("/(tabs)/profile");
  };

  return (
    <View className="bg-primary flex-1 justify-center px-8">
      <Text className="text-white text-3xl font-bold mb-10">Login</Text>

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4"
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-xl mb-6"
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-accent py-4 rounded-xl mb-6"
        onPress={submit}
      >
        <Text className="text-white font-semibold text-center text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text className="text-light-200 text-center">
          Don’t have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
