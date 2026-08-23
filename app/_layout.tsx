import { getSessionUser } from "@/services/auth";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";

export const UserContext = createContext<any>(null);

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);   // <-- FIXED

  useEffect(() => {
    getSessionUser().then((u) => setUser(u));    // allowed now
  }, []);

  if (!user) return null;

  return (
    <UserContext.Provider value={user}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="(tabs)" />

  <Stack.Screen name="login" options={{ presentation: "modal" }} />
  <Stack.Screen name="signup" options={{ presentation: "modal" }} />

  <Stack.Screen name="movies/[id]" />
</Stack>

      </GestureHandlerRootView>
    </UserContext.Provider>
  );
}
