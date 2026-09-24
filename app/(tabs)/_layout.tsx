import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

import polarisExpand from "@/assets/icons/polaris-expand.png";
import polarisHome from "@/assets/icons/polaris-home.png";
import polarisSolo from "@/assets/icons/polaris-solo.png";
import polarisTogether from "@/assets/icons/polaris-together.png";

function PolarisNavIcon({
  icon,
  focused = false,
}: {
  icon: any;
  focused?: boolean;
}) {
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: focused
          ? "rgba(255, 255, 255, 0.035)"
          : "transparent",

        borderWidth: focused ? 1 : 0,
        borderColor: focused
          ? "rgba(220, 235, 255, 0.14)"
          : "transparent",
      }}
    >
      <Image
        source={icon}
        style={{
          width: 22,
          height: 22,
          tintColor: focused ? "#F4F7FA" : "#707985",
        }}
        resizeMode="contain"
      />
    </View>
  );
}

function PolarisTabBar({
  state,
  navigation,
}: any) {
  const currentRoute = state.routes[state.index]?.name;

  const navigate = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 27,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 10,
      }}
    >
      {/* MAIN NAVIGATION PILL */}
      <View
        style={{
          height: 54,
          width: 196,

          borderRadius: 28,

          backgroundColor: "rgba(3, 7, 12, 0.96)",

          borderWidth: 1,
          borderColor: "rgba(220, 235, 255, 0.06)",

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",

          paddingHorizontal: 5,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.35,
          shadowRadius: 18,

          elevation: 8,
        }}
      >
        {/* HOME */}
        <Pressable
          onPress={() => navigate("index")}
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisHome}
            focused={currentRoute === "index"}
          />
        </Pressable>

        {/* SOLO */}
        <Pressable
          onPress={() => navigate("save")}
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisSolo}
            focused={currentRoute === "save"}
          />
        </Pressable>

        {/* TOGETHER */}
        <Pressable
          onPress={() => navigate("profile")}
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisTogether}
            focused={currentRoute === "profile"}
          />
        </Pressable>

        {/* EXPAND */}
        <Pressable
          onPress={() => {}}
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PolarisNavIcon
            icon={polarisExpand}
            focused={false}
          />
        </Pressable>
      </View>

      {/* SEARCH BUTTON */}
      <Pressable
        onPress={() => navigate("search")}
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,

          alignItems: "center",
          justifyContent: "center",

          backgroundColor: "rgba(3, 7, 12, 0.96)",

          borderWidth: 1,
          borderColor: "rgba(220, 235, 255, 0.06)",

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.35,
          shadowRadius: 18,

          elevation: 8,
        }}
      >
        <Ionicons
          name="search-outline"
          size={22}
          color="#F4F7FA"
        />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PolarisTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      <Tabs.Screen
        name="save"
        options={{
          title: "Solo",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Together",
        }}
      />
    </Tabs>
  );
}