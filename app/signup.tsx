import { signup } from "@/services/auth";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signup() {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await signup(email, password, username);

    await refreshSession();

    router.replace("/(tabs)/profile");
  };

  return (
    <View className="bg-primary flex-1 justify-center px-8">
      <Text className="text-white text-3xl font-bold mb-10">Create Account</Text>

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4"
        placeholder="Username"
        placeholderTextColor="#aaa"
        onChangeText={setUsername}
      />

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
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text className="text-light-200 text-center">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
