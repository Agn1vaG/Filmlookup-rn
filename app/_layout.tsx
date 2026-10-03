import { getSessionUser } from "@/services/auth";
import { Stack } from "expo-router";
import {
  Sen_400Regular,
  Sen_500Medium,
  Sen_600SemiBold,
  Sen_700Bold,
  Sen_800ExtraBold,
} from "@expo-google-fonts/sen";
import { useFonts } from "expo-font";
import { createContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";

export const UserContext = createContext<any>(null);

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);

  const [fontsLoaded] = useFonts({
    Sen: Sen_400Regular,
    SenMedium: Sen_500Medium,
    SenSemiBold: Sen_600SemiBold,
    SenBold: Sen_700Bold,
    SenExtraBold: Sen_800ExtraBold,
  });

  useEffect(() => {
    getSessionUser().then((u) => setUser(u));
  }, []);

  if (!fontsLoaded || !user) return null;

  return (
    <UserContext.Provider value={user}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar hidden={true} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="login"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="signup"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="movies/[id]" />
        </Stack>
      </GestureHandlerRootView>
    </UserContext.Provider>
  );
}